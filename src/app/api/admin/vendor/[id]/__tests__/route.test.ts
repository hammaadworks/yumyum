import { createClient } from '@/lib/supabase/utils/server';
import { NextResponse } from 'next/server';

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  })),
}));

// Mock the Supabase client and NextResponse
jest.mock('@/lib/supabase/utils/server', () => ({
  createClient: jest.fn(),
}));
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({ data, options })),
  },
}));

describe('Admin Vendor API - PATCH', () => {
  // Import PATCH inside describe to ensure mocks are applied
  const { PATCH } = require('@/app/api/admin/vendor/[id]/route');

  const mockCreateClient = createClient as jest.Mock;
  const mockNextResponse = NextResponse as jest.Mocked<typeof NextResponse>;

  let mockAuthGetUser: jest.Mock;
  let mockFrom: jest.Mock;
  let mockUpdate: jest.Mock;
  let mockEq: jest.Mock;
  let mockSelect: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockAuthGetUser = jest.fn();
    mockSelect = jest.fn();
    mockEq = jest.fn(() => ({ select: mockSelect }));
    mockUpdate = jest.fn(() => ({ eq: mockEq }));
    mockFrom = jest.fn(() => ({ update: mockUpdate }));

    mockCreateClient.mockReturnValue({
      auth: {
        getUser: mockAuthGetUser,
      },
      from: mockFrom,
    } as any);
  });

  test('should return 401 if user is unauthorized', async () => {
    mockAuthGetUser.mockResolvedValue({ data: { user: null } });

    const request = new Request('http://localhost/api/admin/vendor/123', {
      method: 'PATCH',
      body: JSON.stringify({ is_member: true }),
    });
    const response = await PATCH(request, { params: { id: '123' } });

    expect(mockNextResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' }, { status: 401 });
    expect(response.options.status).toBe(401);
  });

  test('should return 403 if user is forbidden', async () => {
    mockAuthGetUser.mockResolvedValue({ data: { user: { id: 'user-123', user_metadata: { role: 'user' } } } });

    const request = new Request('http://localhost/api/admin/vendor/123', {
      method: 'PATCH',
      body: JSON.stringify({ is_member: true }),
    });
    const response = await PATCH(request, { params: { id: '123' } });

    expect(mockNextResponse.json).toHaveBeenCalledWith({ error: 'Forbidden' }, { status: 403 });
    expect(response.options.status).toBe(403);
  });

  test('should return 400 if is_member is not a boolean', async () => {
    mockAuthGetUser.mockResolvedValue({ data: { user: { id: 'user-123', user_metadata: { role: 'admin' } } } });

    const request = new Request('http://localhost/api/admin/vendor/123', {
      method: 'PATCH',
      body: JSON.stringify({ is_member: 'not-a-boolean' }),
    });
    const response = await PATCH(request, { params: { id: '123' } });

    expect(mockNextResponse.json).toHaveBeenCalledWith({ error: 'Invalid is_member value' }, { status: 400 });
    expect(response.options.status).toBe(400);
  });

  test('should return 404 if vendor not found', async () => {
    mockAuthGetUser.mockResolvedValue({ data: { user: { id: 'user-123', user_metadata: { role: 'admin' } } } });
    mockEq.mockResolvedValue({ data: [], error: null });

    const request = new Request('http://localhost/api/admin/vendor/123', {
      method: 'PATCH',
      body: JSON.stringify({ is_member: true }),
    });
    const response = await PATCH(request, { params: { id: '123' } });

    expect(response.status).toBe(404);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ error: 'Vendor not found' });
  });

  test('should successfully update is_member status', async () => {
    const mockVendor = { id: '123', is_member: true, vendor_slug: 'test-vendor' };
    mockAuthGetUser.mockResolvedValue({ data: { user: { id: 'user-123', user_metadata: { role: 'admin' } } } });
    mockEq.mockResolvedValue({ data: [mockVendor], error: null });

    const request = new Request('http://localhost/api/admin/vendor/123', {
      method: 'PATCH',
      body: JSON.stringify({ is_member: true }),
    });
    const response = await PATCH(request, { params: { id: '123' } });

    expect(mockUpdate).toHaveBeenCalledWith({ is_member: true });
    expect(mockEq).toHaveBeenCalledWith('id', '123');
    expect(mockNextResponse.json).toHaveBeenCalledWith(mockVendor);
    expect(response.data).toEqual(mockVendor);
  });

  test('should return 500 if Supabase update fails', async () => {
    mockAuthGetUser.mockResolvedValue({ data: { user: { id: 'user-123', user_metadata: { role: 'admin' } } } });
    mockEq.mockResolvedValue({ data: null, error: { message: 'DB Error' } });

    const request = new Request('http://localhost/api/admin/vendor/123', {
      method: 'PATCH',
      body: JSON.stringify({ is_member: false }),
    });
    const response = await PATCH(request, { params: { id: '123' } });

    expect(mockNextResponse.json).toHaveBeenCalledWith({ error: 'DB Error' }, { status: 500 });
    expect(response.options.status).toBe(500);
  });
});