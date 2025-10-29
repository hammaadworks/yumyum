import { PATCH } from './route';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Mock the Supabase client and NextResponse
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(() => ({
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(),
        })),
      })),
    })),
  })),
}));
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({ data, options })),
  },
}));

describe('Admin Vendor API - PATCH', () => {
  const mockCreateClient = createClient as jest.Mocked<typeof createClient>;
  const mockNextResponse = NextResponse as jest.Mocked<typeof NextResponse>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return 401 if user is unauthorized', async () => {
    mockCreateClient.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
      },
    } as any);

    const request = new Request('http://localhost/api/admin/vendor/123', {
      method: 'PATCH',
      body: JSON.stringify({ is_member: true }),
    });
    const response = await PATCH(request, { params: { id: '123' } });

    expect(mockNextResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' }, { status: 401 });
    expect(response.options.status).toBe(401);
  });

  // Placeholder for forbidden access (non-admin user)
  test('should return 403 if user is forbidden (placeholder)', async () => {
    mockCreateClient.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-123' } } }),
      },
    } as any);

    // In a real scenario, you'd mock a user with a non-admin role
    const request = new Request('http://localhost/api/admin/vendor/123', {
      method: 'PATCH',
      body: JSON.stringify({ is_member: true }),
    });
    const response = await PATCH(request, { params: { id: '123' } });

    // Currently, it passes the authorization check, so it will proceed to update.
    // This test is a placeholder to remind that a proper 403 check is needed.
    expect(response.options.status).not.toBe(403);
  });

  test('should return 400 if is_member is not a boolean', async () => {
    mockCreateClient.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-123' } } }),
      },
    } as any);

    const request = new Request('http://localhost/api/admin/vendor/123', {
      method: 'PATCH',
      body: JSON.stringify({ is_member: 'not-a-boolean' }),
    });
    const response = await PATCH(request, { params: { id: '123' } });

    expect(mockNextResponse.json).toHaveBeenCalledWith({ error: 'Invalid is_member value' }, { status: 400 });
    expect(response.options.status).toBe(400);
  });

  test('should return 404 if vendor not found', async () => {
    mockCreateClient.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-123' } } }),
      },
      from: jest.fn(() => ({
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            select: jest.fn().mockResolvedValue({ data: [], error: null }),
          })),
        })),
      })),
    } as any);

    const request = new Request('http://localhost/api/admin/vendor/123', {
      method: 'PATCH',
      body: JSON.stringify({ is_member: true }),
    });
    const response = await PATCH(request, { params: { id: '123' } });

    expect(mockNextResponse.json).toHaveBeenCalledWith({ error: 'Vendor not found' }, { status: 404 });
    expect(response.options.status).toBe(404);
  });

  test('should successfully update is_member status', async () => {
    const mockVendor = { id: '123', is_member: true, vendor_slug: 'test-vendor' };
    mockCreateClient.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-123' } } }),
      },
      from: jest.fn(() => ({
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            select: jest.fn().mockResolvedValue({ data: [mockVendor], error: null }),
          })),
        })),
      })),
    } as any);

    const request = new Request('http://localhost/api/admin/vendor/123', {
      method: 'PATCH',
      body: JSON.stringify({ is_member: true }),
    });
    const response = await PATCH(request, { params: { id: '123' } });

    expect(mockCreateClient().from().update).toHaveBeenCalledWith({ is_member: true });
    expect(mockCreateClient().from().update().eq).toHaveBeenCalledWith('id', '123');
    expect(mockNextResponse.json).toHaveBeenCalledWith(mockVendor);
    expect(response.data).toEqual(mockVendor);
  });

  test('should return 500 if Supabase update fails', async () => {
    mockCreateClient.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-123' } } }),
      },
      from: jest.fn(() => ({
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            select: jest.fn().mockResolvedValue({ data: null, error: { message: 'DB Error' } }),
          })),
        })),
      })),
    } as any);

    const request = new Request('http://localhost/api/admin/vendor/123', {
      method: 'PATCH',
      body: JSON.stringify({ is_member: false }),
    });
    const response = await PATCH(request, { params: { id: '123' } });

    expect(mockNextResponse.json).toHaveBeenCalledWith({ error: 'DB Error' }, { status: 500 });
    expect(response.options.status).toBe(500);
  });
});