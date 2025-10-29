import { BRAND_TTL, DISHES_TTL, STATUS_TTL } from '@/lib/constants';
import { Brand, Dish, Status, StatusItem, DishTag } from '@/lib/types'; // Corrected import
import Papa from 'papaparse';
import { sendLarkMessage } from './lark';
import axios from 'axios';

const ADMIN_SHEET_ID = process.env.NEXT_PUBLIC_ADMIN_SHEET_ID;

function parseCSV(csvText: string): string[][] {
  const result = Papa.parse(csvText, { skipEmptyLines: true });
  return result.data as string[][];
}

export async function getSheetIdForSlug(slug: string): Promise<string | null> {
  if (!ADMIN_SHEET_ID) {
    throw new Error('Admin sheet ID is not configured.');
  }
  const url = `https://docs.google.com/spreadsheets/d/${ADMIN_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=vendors`;
  try {
    const response = await axios.get(url);
    const csvText = response.data;
    const rows = parseCSV(csvText);

    const slugRow = rows.find((row) => row[0] === slug);
    if (slugRow && slugRow[1]) {
      return slugRow[1];
    }
    return null;
  } catch (error) {
    console.error('Error fetching sheet ID for slug:', error);
    await sendLarkMessage(
      `Critical Error: Could not resolve slug '${slug}'. Error: ${(error as Error).message}`,
    );
    return null;
  }
}

// --- Helper Functions ---

async function fetchSheetData(
  sheetName: string,
  sheetId: string,
  isBackground = false,
): Promise<string[][]> {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
  try {
    const response = await axios.get(url);
    const csvText = response.data;
    return parseCSV(csvText);
  } catch (error) {
    console.error(`Failed to fetch sheet "${sheetName}":`, error);
    // Only send alert on critical (non-background) fetches
    if (!isBackground) {
      await sendLarkMessage(
        `Failed to fetch Google Sheet: ${sheetName}. Error: ${(error as Error).message}`,
      );
    }
    throw error;
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

const inflightRequests = new Map<string, Promise<unknown>>();

async function swrFetch<T>(
  sheetName: string,
  sheetId: string,
  ttl: number,
  parser: (data: string[][]) => T | null,
): Promise<T | null> {
  const cacheKey = getCacheKey(sheetName, sheetId);

  if (typeof window !== 'undefined') {
    if (inflightRequests.has(cacheKey)) {
      return inflightRequests.get(cacheKey) as Promise<T | null>; // Corrected type assertion
    }

    const cachedItem = localStorage.getItem(cacheKey);
    const now = Date.now();

    if (cachedItem) {
      try {
        const { timestamp, data } = JSON.parse(cachedItem) as CacheEntry<T>;
        if (now - timestamp < ttl) {
          // Data is fresh, return from cache and revalidate in the background
          if (!inflightRequests.has(`${cacheKey}-background`)) {
            const bgPromise = fetchSheetData(sheetName, sheetId, true) // isBackground = true
              .then((freshData) => {
                const parsedData = parser(freshData);
                if (parsedData !== null) {
                  localStorage.setItem(
                    cacheKey,
                    JSON.stringify({ timestamp: Date.now(), data: parsedData }),
                  );
                }
              })
              .catch((error) => {
                console.warn(
                  `Background revalidation failed for ${cacheKey}:`,
                  error,
                );
              })
              .finally(() => {
                inflightRequests.delete(`${cacheKey}-background`);
              });
            inflightRequests.set(`${cacheKey}-background`, bgPromise);
          }
          return data;
        }
      } catch (e) {
        console.error('Failed to parse cached data, fetching fresh.', e);
        localStorage.removeItem(cacheKey);
      }
    }
  }

  const fetchPromise = (async () => {
    try {
      const freshData = await fetchSheetData(sheetName, sheetId);
      const parsedData = parser(freshData);
      if (typeof window !== 'undefined' && parsedData !== null) {
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ timestamp: Date.now(), data: parsedData }),
        );
      }
      return parsedData;
    } catch (error) {
      if (typeof window !== 'undefined') {
        inflightRequests.delete(cacheKey);
      }
      throw error;
    } finally {
      if (typeof window !== 'undefined') {
        inflightRequests.delete(cacheKey);
      }
    }
  })();

  if (typeof window !== 'undefined') {
    inflightRequests.set(cacheKey, fetchPromise);
  }
  return fetchPromise;
}

function parseBrandData(data: string[][]): Brand | null {
  if (data.length < 2) {
    sendLarkMessage('Critical Error: Brand data CSV is empty or malformed.');
    console.error('Brand data is unexpectedly short.');
    return null;
  }
  const headers = data[0].map((h) => h.trim());
  const values = data[1];
  const brandObject: { [key: string]: string } = {};
  headers.forEach((header, index) => {
    brandObject[header] = values[index];
  });

  const requiredFields = ['name', 'logo_url', 'cuisine'];
  for (const field of requiredFields) {
    if (!brandObject[field] || brandObject[field].trim() === '') {
      sendLarkMessage(`Critical Error: Missing required brand field: ${field}`);
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
  if (data.length < 2) {
    sendLarkMessage('Critical Error: Dishes data CSV is empty or malformed.');
    return [];
  }
  const headers = data[0].map((h) => h.trim());
  const rows = data.slice(1);

  const dishes: Dish[] = rows
    .map((row) => {
      const dishObject: { [key: string]: string } = {};
      headers.forEach((header, index) => {
        dishObject[header] = row[index];
      });

      return {
        id: dishObject.name.toLowerCase().replace(/\s+/g, '-'),
        category: dishObject.category,
        name: dishObject.name,
        image: dishObject.image,
        reel: dishObject.reel,
        description: dishObject.description,
        price: parseFloat(dishObject.price),
        instock: dishObject.instock as 'yes' | 'no' | 'hide',
        veg: dishObject.veg as 'veg' | 'non-veg',
        tag: dishObject.tag as DishTag,
      };
    })
    .filter((dish) => dish.name && dish.name.trim() !== '');

  return dishes;
}

const parseStatusData = (data: string[][]): Status => {
  // Validate input data structure
  if (!Array.isArray(data)) {
    console.error('parseStatusData: Invalid input - not an array', data);
    return [];
  }

  if (data.length === 0) {
    console.error('parseStatusData: Empty data');
    return [];
  }

  try {
    // Skip header row if present
    const dataRows = data.length > 1 ? data.slice(1) : data;

    return dataRows
      .map((row, index) => {
        try {
          const [type = '', content = '', duration = '5'] = row;

          // Validate type
          if (
            typeof type !== 'string' ||
            !['image', 'video', 'text'].includes(type as string)
          ) {
            console.error(`parseStatusData: Invalid type at row ${index}`, {
              type,
            });
            return null;
          }

          // Validate content
          if (typeof content !== 'string' || !content.trim()) {
            console.error(
              `parseStatusData: Invalid or empty content at row ${index}`,
              { content },
            );
            return null;
          }

          // Validate and parse duration
          const parsedDuration = parseInt(duration, 10);
          if (isNaN(parsedDuration) || parsedDuration < 1) {
            console.warn(
              `parseStatusData: Invalid duration at row ${index}, using default`,
              { duration },
            );
            return {
              type: type as 'image' | 'video' | 'text',
              content: content.trim(),
              duration: 5,
            };
          }

          return {
            type: type as 'image' | 'video' | 'text',
            content: content.trim(),
            duration: parsedDuration,
          };
        } catch (err) {
          console.error(`parseStatusData: Failed to parse row ${index}:`, err, {
            row,
          });
          return null;
        }
      })
      .filter((item): item is StatusItem => item !== null) as Status; // Cast to Status
  } catch (err) {
    console.error('parseStatusData: Failed to parse status data:', err, {
      data,
    });
    return [];
  }
};

export async function getBrandData(sheetId: string): Promise<Brand | null> {
  return swrFetch('Brand', sheetId, BRAND_TTL, parseBrandData);
}

export async function getDishesData(sheetId: string): Promise<Dish[]> {
  try {
    const dishes = await swrFetch(
      'Dishes',
      sheetId,
      DISHES_TTL,
      parseDishesData,
    );
    return dishes || [];
  } catch (error) {
    throw error;
  }
}

export async function getStatusData(sheetId: string): Promise<Status | null> {
  try {
    return await swrFetch('Status', sheetId, STATUS_TTL, parseStatusData);
  } catch (error) {
    throw error;
  }
}