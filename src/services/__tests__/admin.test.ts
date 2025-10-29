import { updateVendorMembership } from '../admin';
import { createClient } from '@/lib/supabase/utils/client';
import { ADMIN_ROLE } from '@/lib/constants';

// Mock the Supabase client
jest.mock('@/lib/supabase/utils/client', () => ({
  createClient: jest.fn(),
}));

describe('updateVendorMembership', () => {
  let mockSupabase: jest.Mocked<ReturnType<typeof createClient>>;
  let mockFrom: jest.Mock;
  let mockUpdate: jest.Mock;
  let mockEq: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdate = jest.fn().mockReturnThis();
    mockEq = jest.fn().mockResolvedValue({ data: {}, error: null });
    mockFrom = jest.fn(() => ({ update: mockUpdate, eq: mockEq }));

    mockSupabase = {
      auth: {
        getUser: jest.fn(),
      },
      from: mockFrom,
    } as any;

    (createClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  test('should return success if admin user updates membership successfully', async () => {
    (mockSupabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: {
        user: { id: 'admin-user-id', user_metadata: { role: ADMIN_ROLE } },
      },
      error: null,
    });

    const result = await updateVendorMembership('vendor-id-1', true);
    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
    expect(mockFrom).toHaveBeenCalledWith('vendor_mappings');
    expect(mockUpdate).toHaveBeenCalledWith({ is_member: true });
    expect(mockEq).toHaveBeenCalledWith('user_id', 'vendor-id-1');
  });

  test('should return error if user is not authenticated', async () => {
    (mockSupabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: null },
      error: { message: 'User not authenticated.' } as any,
    });

    const result = await updateVendorMembership('vendor-id-1', true);
    expect(result.success).toBe(false);
    expect(result.error).toBe('User not authenticated.');
    expect(mockSupabase.from).not.toHaveBeenCalled();
  });

  test('should return error if user is not authorized (not admin)', async () => {
    (mockSupabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: {
        user: { id: 'non-admin-user-id', user_metadata: { role: 'user' } },
      },
      error: null,
    });

    const result = await updateVendorMembership('vendor-id-1', true);
    expect(result.success).toBe(false);
    expect(result.error).toBe('User not authorized.');
    expect(mockSupabase.from).not.toHaveBeenCalled();
  });

  test('should return error if Supabase update fails', async () => {
    (mockSupabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: {
        user: { id: 'admin-user-id', user_metadata: { role: ADMIN_ROLE } },
      },
      error: null,
    });
    mockEq.mockResolvedValue({
      data: null,
      error: { message: 'Database error' },
    });

    const result = await updateVendorMembership('vendor-id-1', false);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Database error');
    expect(mockFrom).toHaveBeenCalledWith('vendor_mappings');
    expect(mockUpdate).toHaveBeenCalledWith({ is_member: false });
    expect(mockEq).toHaveBeenCalledWith('user_id', 'vendor-id-1');
  });
});
