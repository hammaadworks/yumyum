import { Brand, Dish } from '@/lib/types';
import { BRAND_TTL, DISHES_TTL, STATUS_TTL } from '@/lib/constants';

const SHEET_ID = process.env.NEXT_PUBLIC_SHEET_ID;
const LARK_WEBHOOK_URL = process.env.NEXT_PUBLIC_LARK_WEBHOOK_URL;
const ADMIN_SHEET_ID = process.env.NEXT_PUBLIC_ADMIN_SHEET_ID;

export async function getSheetIdForSlug(slug: string): Promise<string | null> {
  if (!ADMIN_SHEET_ID) {
    throw new Error('Admin sheet ID is not configured.');
  }
  // This is a simplified fetch, in a real app this might also be cached
  const url = `https://docs.google.com/spreadsheets/d/${ADMIN_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=vendors`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch admin config');
    }
    const csvText = await response.text();
    const rows = csvText.split('\n').map(row => row.split('","').map(cell => cell.replace(/"/g, '')));
    
    // Find the row matching the slug
    const slugRow = rows.find(row => row[0] === slug);
    if (slugRow && slugRow[1]) {
      return slugRow[1]; // Return the sheet_id
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
    // Basic CSV parsing
    return csvText.split('\n').map(row => row.split('","').map(cell => cell.replace(/"/g, '')));
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

async function swrFetch<T>(sheetName: string, sheetId: string, ttl: number, parser: (data: string[][]) => T): Promise<T | null> {
  const cacheKey = getCacheKey(sheetName, sheetId);
  const cachedItem = localStorage.getItem(cacheKey);
  const now = Date.now();

  if (cachedItem) {
    const { timestamp, data } = JSON.parse(cachedItem) as CacheEntry<T>;
    if (now - timestamp < ttl) {
      // Return cached data and revalidate in the background
      fetchSheetData(sheetName, sheetId).then(freshData => {
        const parsedData = parser(freshData);
        localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: parsedData }));
      });
      return data;
    }
  }

  // Fetch fresh data
  try {
    const freshData = await fetchSheetData(sheetName, sheetId);
    const parsedData = parser(freshData);
    localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: parsedData }));
    return parsedData;
  } catch (error) {
    throw error;
  }
}

// ... (parser functions remain the same)

export async function getBrandData(sheetId: string): Promise<Brand | null> {
  try {
    return await swrFetch('Brand', sheetId, BRAND_TTL, parseBrandData);
  } catch (error) {
    return null;
  }
}

export async function getDishesData(sheetId: string): Promise<Dish[]> {
  try {
    const dishes = await swrFetch('Dishes', sheetId, DISHES_TTL, parseDishesData);
    return dishes || [];
  }
  catch (error) {
    return [];
  }
}

export async function getStatusData(sheetId: string): Promise<any> {
  try {
    return await swrFetch('Status', sheetId, STATUS_TTL, parseStatusData);
  } catch (error) {
    return null;
  }
}
