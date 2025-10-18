import {
  getBrandData,
  getDishesData,
  getStatusData,
  getCacheKey,
  getSheetIdForSlug,
} from '@/services/gsheets';

// Mock fetch
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
  });

  describe('getSheetIdForSlug', () => {
    it('should return the correct sheetId for a valid slug', async () => {
      const mockCsv = [
        '"slug","sheet_id"',
        '"yum-yum-diner","sheet-id-123"',
        '"burger-place","sheet-id-456"',
      ].join('\n');
      fetchMock.mockResolvedValueOnce({ ok: true, text: () => Promise.resolve(mockCsv) });

      const sheetId = await getSheetIdForSlug('burger-place');
      expect(sheetId).toBe('sheet-id-456');
      expect(fetchMock).toHaveBeenCalledWith(
        'https://docs.google.com/spreadsheets/d/test-admin-sheet-id/gviz/tq?tqx=out:csv&sheet=vendors'
      );
    });
  });

  describe('getBrandData', () => {
    const sheetId = 'test-sheet-id';
    const mockCsv = [
      '"name","logo_url","cuisine","description","payment_link","whatsapp","contact"',
      '"YumYum","http://logo.url","Italian","Delicious pasta","http://pay.me","123","456"',
    ].join('\n');

    it('should fetch fresh data and cache it', async () => {
      fetchMock.mockResolvedValueOnce({ ok: true, text: () => Promise.resolve(mockCsv) });

      const data = await getBrandData(sheetId);

      expect(data?.name).toBe('YumYum');
      expect(data?.cuisine).toBe('Italian');
      const cached = localStorage.getItem(getCacheKey('Brand', sheetId));
      expect(cached).not.toBeNull();
      const cachedData = JSON.parse(cached!); // Use ! to assert non-null
      expect(cachedData.data.name).toBe('YumYum');
    });
  });

  describe('getDishesData', () => {
    const sheetId = 'test-sheet-id';
    const mockCsv = [
      '"category","name","price","description","image","instock","veg","tag"',
      '"Appetizer","Fries","100","Crispy fries","http://image.url","yes","veg","bestseller"',
    ].join('\n');

    it('should fetch fresh dishes and cache them', async () => {
      fetchMock.mockResolvedValueOnce({ ok: true, text: () => Promise.resolve(mockCsv) });
      const data = await getDishesData(sheetId);
      expect(data).not.toBeNull();
      expect(data.length).toBe(1);
      expect(data[0].name).toBe('Fries');
      const cacheKey = getCacheKey('Dishes', sheetId);
      const cached = localStorageMock.getItem(cacheKey);
      expect(cached).not.toBeNull();
      const cachedData = JSON.parse(cached!); // Use ! to assert non-null
      expect(cachedData.data[0].name).toBe('Fries');
    });
  });

  describe('getStatusData', () => {
    const sheetId = 'test-sheet-id';
    const mockCsv = ['"open"', '"We are open"'].join('\n');

    it('should fetch fresh status and cache it', async () => {
      fetchMock.mockResolvedValueOnce({ ok: true, text: () => Promise.resolve(mockCsv) });
      const data = await getStatusData(sheetId);
      expect(data).not.toBeNull();
      expect(data).toContain('open');
      expect(data).toContain('We are open');
    });
  });

  describe('Error Handling', () => {
    it('should call Lark webhook on fetch failure', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error')); // for google sheet fetch
      fetchMock.mockResolvedValueOnce({ ok: true }); // for lark webhook

      // Use a try-catch block to handle the expected rejection
      try {
        await getBrandData('test-sheet-id');
      } catch (error) {
        // Expected error
      }

      // Check if the Lark webhook was called
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('lark.webhook.url'),
        expect.any(Object)
      );
    });
  });
});