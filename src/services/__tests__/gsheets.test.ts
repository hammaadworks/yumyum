// /**
//  * @file gsheets.test.ts
//  * Combined and cleaned-up test file
//  */
//
// process.env.NEXT_PUBLIC_ADMIN_SHEET_ID = 'test-admin-sheet-id';
// process.env.LARK_WEBHOOK_URL = 'https://lark.webhook.url';
//
// import { Brand, Dish, Status } from '@/lib/types';
// import { BRAND_TTL } from '@/lib/constants';
//
// // --- Global Mocks ---
// const fetchMock = jest.fn();
// global.fetch = fetchMock;
//
// const localStorageMock = (() => {
//   let store: Record<string, string> = {};
//   return {
//     getItem: (key: string) => store[key] || null,
//     setItem: (key: string, value: string) => {
//       store[key] = value.toString();
//     },
//     clear: () => {
//       store = {};
//     },
//     getStore: () => store,
//   };
// })();
// Object.defineProperty(window, 'localStorage', { value: localStorageMock });
//
// global.console.error = jest.fn();
// global.console.warn = jest.fn();
//
// // --- Dynamic Import Target ---
// let gsheets: {
//   getBrandData: (sheetId: string) => Promise<Brand | null>;
//   getDishesData: (sheetId: string) => Promise<Dish[]>;
//   getStatusData: (sheetId: string) => Promise<Status | null>;
//   getSheetIdForSlug: (slug: string) => Promise<string | null>;
//   getCacheKey: (name: string, id: string) => string;
// };
//
// beforeEach(async () => {
//   jest.resetModules();
//   fetchMock.mockReset();
//   localStorageMock.clear();
//   (global.console.error as jest.Mock).mockClear();
//   (global.console.warn as jest.Mock).mockClear();
//   gsheets = await import('@/services/gsheets');
// });
//
// // --- Helpers ---
// const MOCK_SHEET_ID = 'test-sheet-id';
// const MOCK_SLUG = 'burger-place';
// const MOCK_BRAND_DATA: Brand = {
//   name: 'Test Brand',
//   logo_url: 'http://example.com/logo.png',
//   cuisine: 'Test Cuisine',
//   description: 'A test brand.',
//   payment_link: 'http://example.com/pay',
//   whatsapp: '1234567890',
//   contact: '0987654321',
// };
// const mockCsvResponse = (rows: string[][]) => {
//   const csv = rows.map(r => `"${r.join('","')}"`).join('\n');
//   return Promise.resolve({ ok: true, text: () => Promise.resolve(csv) });
// };
//
// // --- Combined Test Suite ---
// describe('gsheets service', () => {
//   // ========================
//   // ✅ getSheetIdForSlug
//   // ========================
//   describe('getSheetIdForSlug', () => {
//     it('should return correct sheetId for valid slug', async () => {
//       const mockCsv = [
//         '"slug","sheet_id"',
//         '"yum-yum-diner","sheet-id-123"',
//         '"burger-place","sheet-id-456"',
//       ].join('\n');
//       fetchMock.mockResolvedValueOnce({ ok: true, text: () => Promise.resolve(mockCsv) });
//
//       const sheetId = await gsheets.getSheetIdForSlug(MOCK_SLUG);
//       expect(sheetId).toBe('sheet-id-456');
//       expect(fetchMock).toHaveBeenCalledWith(
//         expect.stringContaining('test-admin-sheet-id')
//       );
//     });
//
//     it('should return null and send Lark alert on network failure', async () => {
//       fetchMock
//         .mockImplementationOnce(() => Promise.reject(new Error('Network Error')))
//         .mockImplementationOnce(() => Promise.resolve({ ok: true }));
//
//       const result = await gsheets.getSheetIdForSlug(MOCK_SLUG);
//
//       expect(result).toBeNull();
//       expect(fetchMock).toHaveBeenCalledTimes(2);
//       expect(fetchMock.mock.calls[1][0]).toContain('lark');
//     });
//   });
//
//   // ========================
//   // ✅ Brand Data
//   // ========================
//   describe('getBrandData', () => {
//     const mockCsv = [
//       '"name","logo_url","cuisine","description","payment_link","whatsapp","contact"',
//       '"YumYum","http://logo.url","Italian","Delicious pasta","http://pay.me","123","456"',
//     ].join('\n');
//
//     it('should fetch fresh data and cache it', async () => {
//       fetchMock.mockResolvedValueOnce({ ok: true, text: () => Promise.resolve(mockCsv) });
//       const data = await gsheets.getBrandData(MOCK_SHEET_ID);
//       expect(data?.name).toBe('YumYum');
//       const cached = localStorage.getItem(gsheets.getCacheKey('Brand', MOCK_SHEET_ID));
//       expect(cached).not.toBeNull();
//     });
//
//     it('should fetch from network on cache miss', async () => {
//       fetchMock.mockImplementation(() =>
//         mockCsvResponse([['name', 'logo_url', 'cuisine'], ['Test Brand', 'logo.png', 'Testy']])
//       );
//       await gsheets.getBrandData(MOCK_SHEET_ID);
//       expect(fetchMock).toHaveBeenCalledTimes(1);
//     });
//
//     it('should return from cache and revalidate in background', async () => {
//       const cacheKey = gsheets.getCacheKey('Brand', MOCK_SHEET_ID);
//       localStorageMock.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: MOCK_BRAND_DATA }));
//
//       fetchMock.mockImplementationOnce(() =>
//         mockCsvResponse([['name'], ['New Brand Name']])
//       );
//
//       const data = await gsheets.getBrandData(MOCK_SHEET_ID);
//       expect(data).toEqual(MOCK_BRAND_DATA);
//
//       await new Promise(res => setTimeout(res, 0));
//       expect(fetchMock).toHaveBeenCalledTimes(1);
//     });
//
//     it('should fetch from network if cache is stale', async () => {
//       const cacheKey = gsheets.getCacheKey('Brand', MOCK_SHEET_ID);
//       const staleTimestamp = Date.now() - BRAND_TTL - 1000;
//       localStorageMock.setItem(cacheKey, JSON.stringify({ timestamp: staleTimestamp, data: MOCK_BRAND_DATA }));
//
//       fetchMock.mockImplementation(() =>
//         mockCsvResponse([
//           ['name', 'logo_url', 'cuisine'],
//           ['Updated Brand', 'logo2.png', 'Spicy'],
//         ])
//       );
//
//       const data = await gsheets.getBrandData(MOCK_SHEET_ID);
//       expect(data?.name).toBe('Updated Brand');
//     });
//
//     it('should send Lark alert if required brand fields missing', async () => {
//       fetchMock
//         .mockImplementationOnce(() => mockCsvResponse([['name'], ['Test Brand']]))
//         .mockImplementationOnce(() => Promise.resolve({ ok: true }));
//
//       await gsheets.getBrandData(MOCK_SHEET_ID);
//
//       expect(fetchMock).toHaveBeenCalledTimes(2);
//       expect(fetchMock.mock.calls[1][0]).toContain('lark');
//     });
//
//     it('should not send Lark alert on background revalidation failure', async () => {
//       const cacheKey = gsheets.getCacheKey('Brand', MOCK_SHEET_ID);
//       localStorageMock.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: MOCK_BRAND_DATA }));
//       fetchMock.mockImplementation(() => Promise.reject(new Error('Revalidation Failed')));
//
//       await gsheets.getBrandData(MOCK_SHEET_ID);
//       await new Promise(res => setTimeout(res, 0));
//
//       expect(fetchMock).toHaveBeenCalledTimes(1);
//       expect(console.warn).toHaveBeenCalled();
//     });
//   });
//
//   // ========================
//   // ✅ Dishes
//   // ========================
//   describe('getDishesData', () => {
//     const mockCsv = [
//       '"category","name","price","description","image","instock","veg","tag"',
//       '"Appetizer","Fries","100","Crispy fries","http://image.url","yes","veg","bestseller"',
//     ].join('\n');
//
//     it('should fetch fresh dishes and cache them', async () => {
//       fetchMock.mockResolvedValueOnce({ ok: true, text: () => Promise.resolve(mockCsv) });
//       const data = await gsheets.getDishesData(MOCK_SHEET_ID);
//       expect(data[0].name).toBe('Fries');
//       const cached = localStorageMock.getItem(gsheets.getCacheKey('Dishes', MOCK_SHEET_ID));
//       expect(cached).not.toBeNull();
//     });
//
//     it('should throw error on network failure', async () => {
//       fetchMock.mockImplementation(() => Promise.reject(new Error('Network Error')));
//       await expect(gsheets.getDishesData(MOCK_SHEET_ID)).rejects.toThrow('Network Error');
//     });
//   });
//
//   // ========================
//   // ✅ Status
//   // ========================
//   describe('getStatusData', () => {
//     const mockCsv = ['"open"', '"We are open"'].join('\n');
//
//     it('should fetch and cache status', async () => {
//       fetchMock.mockResolvedValueOnce({ ok: true, text: () => Promise.resolve(mockCsv) });
//       const data = await gsheets.getStatusData(MOCK_SHEET_ID);
//       expect(data).toEqual([
//         { type: 'text', content: 'open', duration: 5000 },
//         { type: 'text', content: 'We are open', duration: 5000 },
//       ]);
//     });
//
//     it('should throw error on network failure', async () => {
//       fetchMock.mockImplementation(() => Promise.reject(new Error('Network Error')));
//       await expect(gsheets.getStatusData(MOCK_SHEET_ID)).rejects.toThrow('Network Error');
//     });
//   });
//
//   // ========================
//   // ✅ Error Handling
//   // ========================
//   describe('Error Handling', () => {
//     it('should call Lark webhook on fetch failure', async () => {
//       fetchMock.mockRejectedValueOnce(new Error('Network error'));
//       fetchMock.mockResolvedValueOnce({ ok: true });
//
//       try {
//         await gsheets.getBrandData('test-sheet-id');
//       } catch {}
//       expect(fetchMock).toHaveBeenCalledWith(
//         'https://lark.webhook.url',
//         expect.any(Object)
//       );
//     });
//   });
// });
