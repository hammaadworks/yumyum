import { Brand, Dish } from '@/lib/types';
import { BRAND_TTL, DISHES_TTL, STATUS_TTL } from '@/lib/constants';


const LARK_WEBHOOK_URL = process.env.NEXT_PUBLIC_LARK_WEBHOOK_URL;
const ADMIN_SHEET_ID = process.env.NEXT_PUBLIC_ADMIN_SHEET_ID;

/**
 * Parse a CSV-formatted string into a two-dimensional array of cells.
 *
 * Handles quoted fields, escaped double quotes (""), commas, and newlines; trims surrounding quotes from quoted fields and unescapes embedded quotes.
 *
 * @param csvText - The CSV input text to parse
 * @returns A 2D array where each inner array represents a row and each element is a cell value
 */
function parseCSV(csvText: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];

    if (char === '"') {
      if (inQuotes && csvText[i + 1] === '"') {
        // Escaped quote
        cell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(cell);
      cell = '';
    } else if (char === '\n' && !inQuotes) {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }

  if (cell || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows.map(r => r.map(c => c.startsWith('"') && c.endsWith('"') ? c.slice(1, -1).replace(/""/g, '"') : c));
}

/**
 * Resolves the Google Sheet ID corresponding to a vendor slug from the admin "vendors" sheet.
 *
 * @param slug - The vendor slug to look up in the admin sheet's first column.
 * @returns The sheet ID from the second column if a matching slug is found, `null` if not found or on error.
 * @throws Error if the ADMIN_SHEET_ID environment variable is not configured.
 */
export async function getSheetIdForSlug(slug: string): Promise<string | null> {
  if (!ADMIN_SHEET_ID) {
    throw new Error('Admin sheet ID is not configured.');
  }
  const url = `https://docs.google.com/spreadsheets/d/${ADMIN_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=vendors`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch admin config');
    }
    const csvText = await response.text();
    const rows = parseCSV(csvText);

    const slugRow = rows.find(row => row[0] === slug);
    if (slugRow && slugRow[1]) {
      return slugRow[1];
    }
    return null;
  } catch (error) {
    console.error('Error fetching sheet ID for slug:', error);
    await sendLarkAlert(`Critical Error: Could not resolve slug '${slug}'. Error: ${(error as Error).message}`);
    return null;
  }
}

/**
 * Fetches a named tab from a Google Spreadsheet and parses its CSV into a 2D array of cell strings.
 *
 * @param sheetName - The name of the sheet (tab) to fetch within the spreadsheet.
 * @param sheetId - The Google Spreadsheet ID.
 * @returns A two-dimensional array where each inner array represents a row of cell strings from the sheet.
 * @throws If the network request fails or the response is not OK, or if the CSV cannot be retrieved.
 */

async function fetchSheetData(sheetName: string, sheetId: string): Promise<string[][]> {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error(`Failed to fetch sheet "${sheetName}":`, error);
    await sendLarkAlert(`Failed to fetch Google Sheet: ${sheetName}. Error: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Send a plain-text alert message to the configured Lark webhook.
 *
 * If no webhook URL is configured, the function does nothing. Network or delivery
 * failures are caught and logged to the console; errors are not rethrown.
 *
 * @param message - The text message to send to Lark
 */
async function sendLarkAlert(message: string) {
  if (!LARK_WEBHOOK_URL) return;
  try {
    await fetch(LARK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ msg_type: 'text', content: { text: message } }),
    });
  } catch (error) {
    console.error('Failed to send Lark alert:', error);
  }
}

/**
 * Constructs a stable localStorage cache key for a specific sheet.
 *
 * @param sheetName - The sheet tab name; it will be lowercased when included in the key
 * @param sheetId - The sheet's identifier (spreadsheet ID or configured sheet ID)
 * @returns The cache key in the form `yumyum-<lowercased sheetName>-<sheetId>`
 */
export function getCacheKey(sheetName: string, sheetId: string): string {
    return `yumyum-${sheetName.toLowerCase()}-${sheetId}`;
}

// --- Data Fetching Services ---

interface CacheEntry<T> {
  timestamp: number;
  data: T;
}

const inflightRequests = new Map<string, Promise<any>>();

/**
 * Fetches parsed sheet data using an SWR-style cache with in-flight deduplication.
 *
 * When cached data is fresh it is returned immediately and a background revalidation is started;
 * concurrent requests for the same sheet are deduplicated so only one network fetch runs at a time.
 *
 * @param sheetName - The named sheet within the Google Sheet (e.g., "Brand", "Dishes", "Status")
 * @param sheetId - The Google Sheet ID containing the target sheet
 * @param ttl - Time-to-live for cached entries in milliseconds; values older than this are considered stale
 * @param parser - A function that converts the fetched CSV grid (`string[][]`) into the desired return shape `T`
 * @returns The parsed sheet data of type `T`, or `null` when the parser returns `null`
 */
async function swrFetch<T>(
  sheetName: string,
  sheetId: string,
  ttl: number,
  parser: (data: string[][]) => T
): Promise<T | null> {
  const cacheKey = getCacheKey(sheetName, sheetId);

  if (inflightRequests.has(cacheKey)) {
    return inflightRequests.get(cacheKey);
  }

  const cachedItem = localStorage.getItem(cacheKey);
  const now = Date.now();

  if (cachedItem) {
    const { timestamp, data } = JSON.parse(cachedItem) as CacheEntry<T>;
    if (now - timestamp < ttl) {
      // Data is fresh, return from cache and revalidate in the background
      fetchSheetData(sheetName, sheetId)
        .then(freshData => {
          const parsedData = parser(freshData);
          localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: parsedData }));
        })
        .catch(error => {
          console.warn(`Background revalidation failed for ${cacheKey}:`, error);
        });
      return data;
    }
  }

  const fetchPromise = (async () => {
    try {
      const freshData = await fetchSheetData(sheetName, sheetId);
      const parsedData = parser(freshData);
      localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: parsedData }));
      return parsedData;
    } catch (error) {
      inflightRequests.delete(cacheKey);
      throw error;
    } finally {
      inflightRequests.delete(cacheKey);
    }
  })();

  inflightRequests.set(cacheKey, fetchPromise);
  return fetchPromise;
}


/**
 * Parse CSV-style rows for a brand sheet into a Brand object.
 *
 * @param data - Two-dimensional array of cell strings where the first row is header names and the second row contains the corresponding brand values; additional rows are ignored.
 * @returns A `Brand` populated from the header/value row pair, or `null` if the input has fewer than two rows or required fields (`name`, `logo_url`, `cuisine`) are missing or empty.
 */
function parseBrandData(data: string[][]): Brand | null {
  if (data.length < 2) {
    console.error("Brand data is unexpectedly short.");
    return null;
  }
  const headers = data[0].map(h => h.trim());
  const values = data[1];
  const brandObject: { [key: string]: string } = {};
  headers.forEach((header, index) => {
    brandObject[header] = values[index];
  });

  const requiredFields = ['name', 'logo_url', 'cuisine'];
  for (const field of requiredFields) {
    if (!brandObject[field] || brandObject[field].trim() === '') {
      console.error(`Missing required brand field: ${field}`);
      return null;
    }
  }

  return {
    name: brandObject.name,
    logo_url: brandObject.logo_url,
    cuisine: brandObject.cuisine,
    description: brandObject.description || '',
    payment_link: brandObject.payment_link || '',
    whatsapp: brandObject.whatsapp || '',
    contact: brandObject.contact || '',
    location_link: brandObject.location_link || '',
    review_link: brandObject.review_link || '',
    instagram: brandObject.instagram || '',
    facebook: brandObject.facebook || '',
    youtube: brandObject.youtube || '',
    custom: brandObject.custom || '',
    full_menu_pic: brandObject.full_menu_pic || '',
  } as Brand;
}

/**
 * Convert CSV-style rows into an array of Dish objects by mapping headers to row values.
 *
 * The first row of `data` is treated as headers and subsequent rows as records. Produces a Dish for each record with:
 * - `id` generated from `name` by lowercasing and replacing spaces with hyphens,
 * - `price` parsed as a number,
 * - categorical fields (`instock`, `veg`, `tag`) cast to their expected literal values.
 * Rows with an empty `name` are omitted. If `data` has fewer than two rows, returns an empty array.
 *
 * @param data - A 2D array where the first row is header names and each following row is a record.
 * @returns An array of parsed Dish objects.
 */
function parseDishesData(data: string[][]): Dish[] {
  if (data.length < 2) return [];
  const headers = data[0].map(h => h.trim());
  const rows = data.slice(1);

  const dishes: Dish[] = rows.map(row => {
    const dishObject: { [key: string]: string } = {};
    headers.forEach((header, index) => {
      dishObject[header] = row[index];
    });

    return {
      id: dishObject.name.toLowerCase().replace(/\s+/g, '-'), // System-Generated
      category: dishObject.category,
      name: dishObject.name,
      image: dishObject.image,
      reel: dishObject.reel,
      description: dishObject.description,
      price: parseFloat(dishObject.price),
      instock: dishObject.instock as 'yes' | 'no' | 'hide',
      veg: dishObject.veg as 'veg' | 'non-veg',
      tag: dishObject.tag as 'bestseller' | "chef's special" | 'new' | 'limited edition' | 'normal',
    };
  }).filter(dish => dish.name); // Filter out empty rows

  return dishes;
}

/**
 * Convert a status sheet's rows into a flat list of non-empty status strings.
 *
 * @param data - Two-dimensional array of sheet cells (rows and columns)
 * @returns An array of status strings with empty or whitespace-only entries removed
 */
function parseStatusData(data: string[][]): string[] {
  if (data.length < 1) return [];
  return data.flat().filter(item => item && item.trim() !== '');
}


/**
 * Fetches and returns brand information from the specified Google Sheet.
 *
 * @param sheetId - The Google Sheet ID that contains the Brand tab
 * @returns The parsed `Brand` object from the sheet, or `null` if no valid brand data is present
 */
export async function getBrandData(sheetId: string): Promise<Brand | null> {
  try {
    return await swrFetch('Brand', sheetId, BRAND_TTL, parseBrandData);
  } catch (error) {
    throw error;
  }
}

/**
 * Retrieve and parse dishes from the "Dishes" tab of the specified Google Sheet.
 *
 * @param sheetId - The Google Sheet ID containing the Dishes tab
 * @returns An array of parsed `Dish` objects; returns an empty array if no dishes are found or on error
 */
export async function getDishesData(sheetId: string): Promise<Dish[]> {
  try {
    const dishes = await swrFetch('Dishes', sheetId, DISHES_TTL, parseDishesData);
    return dishes || [];
  }
  catch {
    return [];
  }
}

/**
 * Fetches the status list from the "Status" tab of the specified Google Sheet.
 *
 * @param sheetId - The Google Sheet ID containing the Status sheet.
 * @returns An array of non-empty status strings parsed from the sheet, or `null` if fetching fails.
 */
export async function getStatusData(sheetId: string): Promise<string[] | null> {
  try {
    return await swrFetch('Status', sheetId, STATUS_TTL, parseStatusData);
  } catch {
    return null;
  }
}