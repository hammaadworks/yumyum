import { Brand, Dish, Status } from '@/lib/types';
import { BRAND_TTL, DISHES_TTL, STATUS_TTL } from '@/lib/constants';
import { sendLarkMessage } from './lark';
import Papa from 'papaparse';

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
    await sendLarkMessage(`Critical Error: Could not resolve slug '${slug}'. Error: ${(error as Error).message}`);
    return null;
  }
}

// --- Helper Functions ---

async function fetchSheetData(sheetName: string, sheetId: string, isBackground = false): Promise<string[][]> {
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
    // Only send alert on critical (non-background) fetches
    if (!isBackground) {
      await sendLarkMessage(`Failed to fetch Google Sheet: ${sheetName}. Error: ${(error as Error).message}`);
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

const inflightRequests = new Map<string, Promise<any>>();

async function swrFetch<T>(
  sheetName: string,
  sheetId: string,
  ttl: number,
  parser: (data: string[][]) => T | null
): Promise<T | null> {
  const cacheKey = getCacheKey(sheetName, sheetId);

  if (typeof window !== 'undefined') {
    if (inflightRequests.has(cacheKey)) {
      return inflightRequests.get(cacheKey);
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
              .then(freshData => {
                const parsedData = parser(freshData);
                if (parsedData !== null) {
                  localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: parsedData }));
                }
              })
              .catch(error => {
                console.warn(`Background revalidation failed for ${cacheKey}:`, error);
              })
              .finally(() => {
                inflightRequests.delete(`${cacheKey}-background`);
              });
            inflightRequests.set(`${cacheKey}-background`, bgPromise);
          }
          return data;
        }
      } catch (e) {
        console.error("Failed to parse cached data, fetching fresh.", e)
        localStorage.removeItem(cacheKey);
      }
    }
  }

  const fetchPromise = (async () => {
    try {
      const freshData = await fetchSheetData(sheetName, sheetId);
      const parsedData = parser(freshData);
      if (typeof window !== 'undefined' && parsedData !== null) {
        localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: parsedData }));
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
    sendLarkMessage("Critical Error: Brand data CSV is empty or malformed.");
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
  const headers = data[0].map(h => h.trim());
  const rows = data.slice(1);

  const dishes: Dish[] = rows.map(row => {
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
      tag: dishObject.tag as any,
    };
  }).filter(dish => dish.name && dish.name.trim() !== '');

  return dishes;
}

function parseStatusData(data: string[][]): Status | null {
    if (data.length < 1) {
      sendLarkMessage('Critical Error: Status data CSV is empty or malformed.');
      return [];
    }
    const items = data.flat().filter(item => item && item.trim() !== '');

    return items.map(item => {
        // Simple heuristic: if it's a URL, it's media. Otherwise, text.
        // Story 3.3 will require a more robust implementation.
        const isMedia = item.startsWith('http') && (item.includes('cloudinary') || item.match(/\.(jpeg|jpg|gif|png|mp4)$/));
        return {
            type: isMedia ? 'image' : 'text',
            content: item,
            duration: isMedia ? 10000 : 5000, // Default durations
        };
    });
}

export async function getBrandData(sheetId: string): Promise<Brand | null> {
  return swrFetch('Brand', sheetId, BRAND_TTL, parseBrandData);
}

export async function getDishesData(sheetId: string): Promise<Dish[]> {
  try {
    const dishes = await swrFetch('Dishes', sheetId, DISHES_TTL, parseDishesData);
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