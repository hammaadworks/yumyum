
import { getBrandData, getDishesData, getStatusData, getCacheKey } from '@/services/gsheets';

const fetchMock = jest.fn();
global.fetch = fetchMock;

// Mock localStorage
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
    getStore: () => store,
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('gsheets service', () => {
  beforeEach(() => {
    localStorageMock.clear();
    fetchMock.mockClear();
    delete process.env.NEXT_PUBLIC_SHEET_ID;
    delete process.env.NEXT_PUBLIC_LARK_WEBHOOK_URL;
  });

  describe('getBrandData', () => {
    it('should fetch fresh data and cache it', async () => {
      process.env.NEXT_PUBLIC_SHEET_ID = 'test-sheet-id';
      fetchMock.mockResolvedValueOnce({ ok: true, text: () => Promise.resolve('"name","logo_url","cuisine"\n"YumYum","http://logo.url","Italian"') } as Response);
      const data = await getBrandData('test-sheet-id');
      expect(data).not.toBeNull();
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const cacheKey = getCacheKey('Brand', 'test-sheet-id');
      const cached = localStorageMock.getItem(cacheKey);
      expect(cached).not.toBeNull();
      const cachedData = JSON.parse(cached!); // Use ! to assert non-null
      expect(cachedData.data.name).toBe('YumYum');
    });

    it('should refetch data after TTL expires', async () => {
        process.env.NEXT_PUBLIC_SHEET_ID = 'test-sheet-id';
        const BRAND_TTL = 10 * 60 * 1000;
        const now = Date.now();
        // First call to cache
        fetchMock.mockResolvedValueOnce({ ok: true, text: () => Promise.resolve('"name","logo_url","cuisine"\n"YumYum","http://logo.url","Italian"') } as Response);
        await getBrandData('test-sheet-id');
        expect(fetchMock).toHaveBeenCalledTimes(1);

        // Fast-forward time
        jest.spyOn(Date, 'now').mockImplementation(() => now + BRAND_TTL + 1);

        // Second call should refetch
        fetchMock.mockResolvedValueOnce({ ok: true, text: () => Promise.resolve('"name","logo_url","cuisine"\n"YumYum2","http://logo.url2","French"') } as Response);
        await getBrandData('test-sheet-id');
        expect(fetchMock).toHaveBeenCalledTimes(2);

        jest.spyOn(Date, 'now').mockRestore();
      });
  });

  describe('getDishesData', () => {
    it('should fetch fresh dishes and cache them', async () => {
        process.env.NEXT_PUBLIC_SHEET_ID = 'test-sheet-id';
        fetchMock.mockResolvedValueOnce({ ok: true, text: () => Promise.resolve('"category","name","price"\n"Appetizer","Fries","100"') } as Response);
        const data = await getDishesData('test-sheet-id');
        expect(data).not.toBeNull();
        expect(data.length).toBe(1);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        const cacheKey = getCacheKey('Dishes', 'test-sheet-id');
        const cached = localStorageMock.getItem(cacheKey);
        expect(cached).not.toBeNull();
        const cachedData = JSON.parse(cached!); // Use ! to assert non-null
        expect(cachedData.data[0].name).toBe('Fries');
      });
  });

  describe('getStatusData', () => {
    it('should fetch fresh status and cache it', async () => {
        process.env.NEXT_PUBLIC_SHEET_ID = 'test-sheet-id';
        fetchMock.mockResolvedValueOnce({ ok: true, text: () => Promise.resolve('"open"\n"We are open"') } as Response);
        const data = await getStatusData('test-sheet-id');
        expect(data).not.toBeNull();
        expect(data).toContain('open');
        expect(fetchMock).toHaveBeenCalledTimes(1);
        const cacheKey = getCacheKey('Status', 'test-sheet-id');
        const cached = localStorageMock.getItem(cacheKey);
        expect(cached).not.toBeNull();
        const cachedData = JSON.parse(cached!); // Use ! to assert non-null
        expect(cachedData.data).toContain('open');
      });
  });

  describe('SWR integration', () => {
    it('should return stale data while revalidating', async () => {
        process.env.NEXT_PUBLIC_SHEET_ID = 'test-sheet-id';
        const BRAND_TTL = 10 * 60 * 1000;
        const now = Date.now();

        // First call to cache
        fetchMock.mockResolvedValueOnce({ ok: true, text: () => Promise.resolve('"name","logo_url","cuisine"\n"YumYum","http://logo.url","Italian"') } as Response);
        await getBrandData('test-sheet-id');
        expect(fetchMock).toHaveBeenCalledTimes(1);

        // Fast-forward time to make cache stale
        jest.spyOn(Date, 'now').mockImplementation(() => now + BRAND_TTL - 1000);

        // Second call should return stale data and trigger background fetch
        fetchMock.mockResolvedValueOnce({ ok: true, text: () => Promise.resolve('"name","logo_url","cuisine"\n"YumYum2","http://logo.url2","French"') } as Response);
        const data = await getBrandData('test-sheet-id');
        expect(data).not.toBeNull();
        expect(fetchMock).toHaveBeenCalledTimes(2);

        jest.spyOn(Date, 'now').mockRestore();
    });
  });

  describe('Error handling integration', () => {
    it('should call Lark webhook on fetch failure', async () => {
        process.env.NEXT_PUBLIC_SHEET_ID = 'test-sheet-id';
        process.env.NEXT_PUBLIC_LARK_WEBHOOK_URL = 'https://lark.webhook.url';
        
        fetchMock.mockRejectedValueOnce(new Error('Network error')); // for google sheet fetch
        fetchMock.mockResolvedValueOnce({ ok: true } as Response); // for lark webhook

        await expect(getBrandData('test-sheet-id')).rejects.toThrow('Network error');

        // Check if the Lark webhook was called
        expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('lark.webhook.url'), expect.any(Object));
    });
  });
});
