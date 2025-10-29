import { checkVendorEmailExists } from './vendor';
import { createClient } from '@/lib/supabase/client';

// Mock the Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => {
    const mockSingle = jest.fn();
    const mockEq = jest.fn(() => ({ single: mockSingle }));
    const mockSelect = jest.fn(() => ({ eq: mockEq }));
    const mockFrom = jest.fn(() => ({ select: mockSelect }));

    return {
      from: mockFrom,
      // Add other Supabase client methods if needed for other tests
    };
  }),
}));

describe('checkVendorEmailExists', () => {
  const mockSupabase = createClient() as jest.Mocked<ReturnType<typeof createClient>>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return true if vendor email exists', async () => {
    const mockSupabase = createClient() as jest.Mocked<ReturnType<typeof createClient>>;
    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValueOnce({ data: { id: 1 }, error: null }),
    });
    const exists = await checkVendorEmailExists('test@example.com');
    expect(exists).toBe(true);
  });

  test('should return false if vendor email does not exist', async () => {
    const mockSupabase = createClient() as jest.Mocked<ReturnType<typeof createClient>>;
    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } }),
    });
    const exists = await checkVendorEmailExists('nonexistent@example.com');
    expect(exists).toBe(false);
  });

  test('should return false if there is a Supabase error (other than no rows found)', async () => {
    const mockSupabase = createClient() as jest.Mocked<ReturnType<typeof createClient>>;
    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValueOnce({ data: null, error: { code: '500', message: 'Database error' } }),
    });
    const exists = await checkVendorEmailExists('error@example.com');
    expect(exists).toBe(false);
  });
});