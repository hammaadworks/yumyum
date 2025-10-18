// --- Environment Setup ---
process.env.NEXT_PUBLIC_ADMIN_SHEET_ID = 'test-admin-sheet-id';
process.env.LARK_WEBHOOK_URL = 'https://lark.webhook.url';

import { Brand, Dish, Status } from '@/lib/types';
import { BRAND_TTL } from '@/lib/constants';

// --- Mocks ---
const mockFetch = jest.fn();
global.fetch = mockFetch;

const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

global.console.error = jest.fn();
global.console.warn = jest.fn();

// --- Dynamically import the module to be tested AFTER setting up mocks ---
let gsheets: {
  getBrandData: (sheetId: string) => Promise<Brand | null>;
  getDishesData: (sheetId: string) => Promise<Dish[]>;
  getStatusData: (sheetId: string) => Promise<Status | null>;
  getSheetIdForSlug: (slug: string) => Promise<string | null>;
  getCacheKey: (name: string, id: string) => string;
};

beforeEach(async () => {
  // Reset mocks and localStorage before each test
  mockFetch.mockReset();
  localStorageMock.clear();
  (global.console.error as jest.Mock).mockClear();
  (global.console.warn as jest.Mock).mockClear();

  // Use jest.resetModules() to clear cache and re-import the module
  jest.resetModules();
  gsheets = await import('@/services/gsheets');
});

// --- Test Data & Helpers ---
const MOCK_SHEET_ID = 'test-sheet-id';
const MOCK_SLUG = 'test-vendor';

const MOCK_BRAND_DATA: Brand = {
  name: 'Test Brand',
  logo_url: 'http://example.com/logo.png',
  cuisine: 'Test Cuisine',
  description: 'A test brand.',
  payment_link: 'http://example.com/pay',
  whatsapp: '1234567890',
  contact: '0987654321',
};

const mockCsvResponse = (data: string[][]) => {
  const csv = data.map(row => `"${row.join('","')}"`).join('\n');
  return Promise.resolve({
    ok: true,
    text: () => Promise.resolve(csv),
  });
};

// --- Test Suite ---
describe('gsheets.ts Data Service', () => {
  describe('getSheetIdForSlug', () => {
    it('should return null and send a Lark alert on network failure', async () => {
      mockFetch
        .mockImplementationOnce(() => Promise.reject(new Error('Network Error'))) // GSheet fetch fails
        .mockImplementationOnce(() => Promise.resolve({ ok: true })); // Lark alert succeeds

      const result = await gsheets.getSheetIdForSlug(MOCK_SLUG);

      expect(result).toBeNull();
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch.mock.calls[0][0]).toContain('google');
      expect(mockFetch.mock.calls[1][0]).toContain('lark');
    });
  });

  describe('SWR Caching Logic', () => {
    it('should fetch from network on cache miss', async () => {
      mockFetch.mockImplementation(() => mockCsvResponse([['name', 'logo_url', 'cuisine'], ['Test Brand', 'logo.png', 'Testy']]));
      await gsheets.getBrandData(MOCK_SHEET_ID);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(localStorageMock.getItem(gsheets.getCacheKey('Brand', MOCK_SHEET_ID))).not.toBeNull();
    });

    it('should return from cache and revalidate in background if fresh', async () => {
      const cacheKey = gsheets.getCacheKey('Brand', MOCK_SHEET_ID);
      localStorageMock.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: MOCK_BRAND_DATA }));

      // Use mockImplementationOnce to provide a mock for only the background revalidation fetch
      mockFetch.mockImplementationOnce(() => mockCsvResponse([['name'], ['New Brand Name']]));

      const data = await gsheets.getBrandData(MOCK_SHEET_ID);
      expect(data).toEqual(MOCK_BRAND_DATA);

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should fetch from network if cache is stale', async () => {
        const cacheKey = gsheets.getCacheKey('Brand', MOCK_SHEET_ID);
        const staleTimestamp = Date.now() - BRAND_TTL - 1000;
        localStorageMock.setItem(cacheKey, JSON.stringify({ timestamp: staleTimestamp, data: MOCK_BRAND_DATA }));

        mockFetch.mockImplementation(() => mockCsvResponse([['name', 'logo_url', 'cuisine'], ['Updated Brand', 'logo2.png', 'Spicy']]));

        const data = await gsheets.getBrandData(MOCK_SHEET_ID);
        expect(data?.name).toBe('Updated Brand');
        expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Bug Fixes and Error Handling', () => {
    it('should throw an error on network failure for getDishesData', async () => {
      mockFetch.mockImplementation(() => Promise.reject(new Error('Network Error')));
      await expect(gsheets.getDishesData(MOCK_SHEET_ID)).rejects.toThrow('Network Error');
    });

    it('should throw an error on network failure for getStatusData', async () => {
      mockFetch.mockImplementation(() => Promise.reject(new Error('Network Error')));
      await expect(gsheets.getStatusData(MOCK_SHEET_ID)).rejects.toThrow('Network Error');
    });

    it('should send a Lark alert if required brand fields are missing', async () => {
      mockFetch
        .mockImplementationOnce(() => mockCsvResponse([['name'], ['Test Brand']])) // GSheet fetch
        .mockImplementationOnce(() => Promise.resolve({ ok: true })); // Lark alert

      await gsheets.getBrandData(MOCK_SHEET_ID);

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch.mock.calls[1][0]).toContain('lark');
    });

    it('should not send a Lark alert on background revalidation failure', async () => {
      const cacheKey = gsheets.getCacheKey('Brand', MOCK_SHEET_ID);
      localStorageMock.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: MOCK_BRAND_DATA }));

      mockFetch.mockImplementation(() => Promise.reject(new Error('Background Revalidation Failed')));

      await gsheets.getBrandData(MOCK_SHEET_ID);
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch.mock.calls[0][0]).not.toContain('lark');
      expect(console.warn).toHaveBeenCalled();
    });
  });
});