import { PATCH } from '../route';
import { NextResponse } from 'next/server';

// Mock the Supabase client
const mockFrom = jest.fn();
const mockEq = jest.fn();
const mockUpdate = jest.fn();

const mockGetUser = jest.fn();

jest.mock('@/lib/supabase/utils/server', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
  })),
}));

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: () => Promise.resolve(data),
      status: init?.status || 200,
      headers: init?.headers || {},
    })),
    // Mocking the constructor for other uses like new NextResponse
    __esModule: true,
    NextResponse: jest.fn((body, init) => ({
      json: () => Promise.resolve(JSON.parse(body)),
      status: init?.status || 200,
      headers: init?.headers || {},
    })),
  },
}));

// Mock next/headers cookies
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('Admin Vendor API - PATCH', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          id: 'user-123',
          email: 'admin@example.com',
          user_metadata: { role: 'admin' },
        },
      },
      error: null,
    });
    mockFrom.mockReturnValue({ update: mockUpdate });
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockEq.mockImplementation((_key, _value) => ({
      data: [{ id: 1, is_member: true }], // Default successful update
      error: null,
    }));
  });

  it('should return 401 if user is unauthorized', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null }, error: null });

    const request = { json: () => Promise.resolve({ is_member: true }) } as any;
    const response = await PATCH(request, { params: { id: '123' } });

    expect(response.status).toBe(401);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ error: 'Unauthorized' });
  });

  it('should return 403 if user is forbidden', async () => {
    mockGetUser.mockResolvedValueOnce({
      data: {
        user: {
          id: 'user-123',
          email: 'user@example.com',
          user_metadata: { role: 'user' },
        },
      },
      error: null,
    });

    const request = { json: () => Promise.resolve({ is_member: true }) } as any;
    const response = await PATCH(request, { params: { id: '123' } });

    expect(response.status).toBe(403);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ error: 'Forbidden' });
  });

  it('should return 400 if is_member is not a boolean', async () => {
    const request = {
      json: () => Promise.resolve({ is_member: 'not-a-boolean' }),
    } as any;
    const response = await PATCH(request, { params: { id: '123' } });

    expect(response.status).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ error: 'Invalid is_member value' });
  });

  it('should return 404 if vendor not found', async () => {
    mockEq.mockImplementationOnce((_key, _value) => ({
      data: [], // Simulate no rows found
      error: null,
    }));

    const request = { json: () => Promise.resolve({ is_member: true }) } as any;
    const response = await PATCH(request, { params: { id: '123' } });

    expect(response.status).toBe(404);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ error: 'Vendor not found' });
  });

  it('should successfully update is_member status', async () => {
    mockEq.mockImplementationOnce((_key, _value) => ({
      data: [{ id: 1, is_member: true }],
      error: null,
    }));

    const request = { json: () => Promise.resolve({ is_member: true }) } as any;
    const response = await PATCH(request, { params: { id: '123' } });

    expect(mockUpdate).toHaveBeenCalledWith({ is_member: true });
    expect(mockEq).toHaveBeenCalledWith('id', '123');
    expect(response.status).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ id: 1, is_member: true }); // Expecting single object, not array
  });

  it('should return 500 if Supabase update fails', async () => {
    mockEq.mockImplementationOnce((_key, _value) => ({
      data: null,
      error: { code: '22P02', message: 'DB Error' }, // Simulate a generic DB error
    }));

    const request = { json: () => Promise.resolve({ is_member: true }) } as any;
    const response = await PATCH(request, { params: { id: '123' } });

    expect(response.status).toBe(500);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ error: 'DB Error' }); // Expecting error.message
  });
});
