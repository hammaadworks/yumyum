import { Brand, Dish } from '@/lib/types';
import { BRAND_TTL, DISHES_TTL, STATUS_TTL } from '@/lib/constants';


const LARK_WEBHOOK_URL = process.env.NEXT_PUBLIC_LARK_WEBHOOK_URL;
const ADMIN_SHEET_ID = process.env.NEXT_PUBLIC_ADMIN_SHEET_ID;

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

// --- Helper Functions ---

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

export function getCacheKey(sheetName: string, sheetId: string): string {
    return `yumyum-${sheetName.toLowerCase()}-${sheetId}`;
}

// --- Data Fetching Services ---

interface CacheEntry<T> {
  timestamp: number;
  data: T;
}

const inflightRequests = new Map<string, Promise<any>>();

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

function parseStatusData(data: string[][]): string[] {
  if (data.length < 1) return [];
  return data.flat().filter(item => item && item.trim() !== '');
}


export async function getBrandData(sheetId: string): Promise<Brand | null> {
  try {
    return await swrFetch('Brand', sheetId, BRAND_TTL, parseBrandData);
  } catch (error) {
    throw error;
  }
}

export async function getDishesData(sheetId: string): Promise<Dish[]> {
  try {
    const dishes = await swrFetch('Dishes', sheetId, DISHES_TTL, parseDishesData);
    return dishes || [];
  }
  catch {
    return [];
  }
}

export async function getStatusData(sheetId: string): Promise<string[] | null> {
  try {
    return await swrFetch('Status', sheetId, STATUS_TTL, parseStatusData);
  } catch {
    return null;
  }
}
