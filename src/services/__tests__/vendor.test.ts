import { checkVendorEmailExists, getVendorMappingByUserId } from '../vendor';

// Mock the global fetch function
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('checkVendorEmailExists', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true if vendor email exists', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ exists: true }),
    });

    const exists = await checkVendorEmailExists('test@example.com');
    expect(exists).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/auth/check-vendor-email',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com' }),
      })
    );
  });

  it('should return false if vendor email does not exist', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ exists: false }),
    });

    const exists = await checkVendorEmailExists('nonexistent@example.com');
    expect(exists).toBe(false);
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/auth/check-vendor-email',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'nonexistent@example.com' }),
      })
    );
  });

  it('should return false if there is a network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const exists = await checkVendorEmailExists('error@example.com');
    expect(exists).toBe(false);
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/auth/check-vendor-email',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'error@example.com' }),
      })
    );
  });

  it('should return false if the API response is not ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Internal Server Error',
      json: async () => ({ error: 'Internal Server Error' }),
    });

    const exists = await checkVendorEmailExists('api-error@example.com');
    expect(exists).toBe(false);
  });
});

describe('getVendorMappingByUserId', () => {
  // Mock the createClient for this test suite
  const mockFrom = jest.fn();
  const mockSelect = jest.fn();
  const mockEq = jest.fn();
  const mockSingle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockFrom.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ single: mockSingle });

    jest.mock('@/lib/supabase/utils/client', () => ({
      createClient: jest.fn(() => ({
        from: mockFrom,
      })),
    }));
  });

  it('should return vendor mapping if found', async () => {
    const mockVendorMapping = {
      id: 1,
      vendor_slug: 'test-vendor',
      backend_type: 'supabase',
      imagekit_account_id: '123',
      membership_fee: 0,
      membership_validity: '2025-12-31',
      is_member: true,
      user_id: 'user-123',
    };
    mockSingle.mockResolvedValueOnce({ data: mockVendorMapping, error: null });

    const mapping = await getVendorMappingByUserId('user-123');
    expect(mapping).toEqual(mockVendorMapping);
    expect(mockFrom).toHaveBeenCalledWith('vendor_mappings');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockEq).toHaveBeenCalledWith('user_id', 'user-123');
  });

  it('should return null if vendor mapping not found', async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });

    const mapping = await getVendorMappingByUserId('nonexistent-user');
    expect(mapping).toBeNull();
  });

  it('should return null if there is a Supabase error (other than no rows found)', async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: { code: '500', message: 'Database error' } });

    const mapping = await getVendorMappingByUserId('error-user');
    expect(mapping).toBeNull();
  });
});