import { checkVendorEmailExists } from '../vendor';
import { createClient } from '@/lib/supabase/client';

// Mock the Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(),
}));

describe('checkVendorEmailExists', () => {
  const mockSupabaseClient = createClient as jest.Mock;
  let mockFrom: jest.Mock;
  let mockSelect: jest.Mock;
  let mockEq: jest.Mock;
  let mockSingle: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSingle = jest.fn();
    mockEq = jest.fn(() => ({ single: mockSingle }));
    mockSelect = jest.fn(() => ({ eq: mockEq }));
    mockFrom = jest.fn(() => ({ select: mockSelect }));

    mockSupabaseClient.mockReturnValue({
      from: mockFrom,
    });
  });

  test('should return true if vendor email exists', async () => {
    mockSingle.mockResolvedValueOnce({ data: { id: 1 }, error: null });
    const exists = await checkVendorEmailExists('test@example.com');
    expect(exists).toBe(true);
    expect(mockFrom).toHaveBeenCalledWith('vendor_mappings');
    expect(mockSelect).toHaveBeenCalledWith('id');
    expect(mockEq).toHaveBeenCalledWith('email', 'test@example.com');
  });

  test('should return false if vendor email does not exist', async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });
    const exists = await checkVendorEmailExists('nonexistent@example.com');
    expect(exists).toBe(false);
    expect(mockFrom).toHaveBeenCalledWith('vendor_mappings');
    expect(mockSelect).toHaveBeenCalledWith('id');
    expect(mockEq).toHaveBeenCalledWith('email', 'nonexistent@example.com');
  });

  test('should return false if there is a Supabase error (other than no rows found)', async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: { code: '500', message: 'Database error' } });
    const exists = await checkVendorEmailExists('error@example.com');
    expect(exists).toBe(false);
    expect(mockFrom).toHaveBeenCalledWith('vendor_mappings');
    expect(mockSelect).toHaveBeenCalledWith('id');
    expect(mockEq).toHaveBeenCalledWith('email', 'error@example.com');
  });
});