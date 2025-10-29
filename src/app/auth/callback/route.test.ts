import { GET } from './route';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Mock the Supabase client and NextResponse
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    auth: {
      exchangeCodeForSession: jest.fn(),
      getUser: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  })),
}));
jest.mock('next/server', () => ({
  NextResponse: {
    redirect: jest.fn((url) => ({ url })),
  },
}));

// Mock the createClient to return a consistent structure
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    auth: {
      exchangeCodeForSession: jest.fn(),
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } } }), // Default mock for getUser
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  })),
}));

describe('Auth Callback Route', () => {
  const mockCreateClient = createClient as jest.Mocked<typeof createClient>;
  const mockNextResponse = NextResponse as jest.Mocked<typeof NextResponse>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should redirect to /login if no code is provided', async () => {
    const request = new Request('http://localhost/auth/callback');
    const response = await GET(request);

    expect(mockNextResponse.redirect).toHaveBeenCalledWith('http://localhost/login');
    expect(response.url).toBe('http://localhost/login');
  });

  test('should redirect to /{vendor-slug}/dashboard on successful login with vendor mapping', async () => {
    const mockGetUser = jest.fn().mockResolvedValue({
      data: { user: { id: 'user-123', email: 'vendor@example.com' } },
    });
    const mockSelect = jest.fn().mockResolvedValue({
      data: { vendor_slug: 'test-vendor' },
      error: null,
    });

    mockCreateClient.mockReturnValue({
      auth: {
        exchangeCodeForSession: jest.fn().mockResolvedValue({}),
        getUser: mockGetUser,
      },
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: mockSelect,
          })),
        })),
      })),
    } as any);

    const request = new Request('http://localhost/auth/callback?code=123');
    const response = await GET(request);

    expect(mockCreateClient().auth.exchangeCodeForSession).toHaveBeenCalledWith('123');
    expect(mockGetUser).toHaveBeenCalled();
    expect(mockSelect).toHaveBeenCalled();
    expect(mockNextResponse.redirect).toHaveBeenCalledWith('http://localhost/test-vendor/dashboard');
    expect(response.url).toBe('http://localhost/test-vendor/dashboard');
  });

  test('should redirect to /dashboard-error if user exists but no vendor mapping is found', async () => {
    const mockGetUser = jest.fn().mockResolvedValue({
      data: { user: { id: 'user-123', email: 'vendor@example.com' } },
    });
    const mockSelect = jest.fn().mockResolvedValue({
      data: null,
      error: { code: 'PGRST116', message: 'No rows found' },
    });

    mockCreateClient.mockReturnValue({
      auth: {
        exchangeCodeForSession: jest.fn().mockResolvedValue({}),
        getUser: mockGetUser,
      },
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: mockSelect,
          })),
        })),
      })),
    } as any);

    const request = new Request('http://localhost/auth/callback?code=123');
    const response = await GET(request);

    expect(mockCreateClient().auth.exchangeCodeForSession).toHaveBeenCalledWith('123');
    expect(mockGetUser).toHaveBeenCalled();
    expect(mockSelect).toHaveBeenCalled();
    expect(mockNextResponse.redirect).toHaveBeenCalledWith('http://localhost/dashboard-error');
    expect(response.url).toBe('http://localhost/dashboard-error');
  });

  test('should redirect to /login if user is not found after exchangeCodeForSession', async () => {
    const mockGetUser = jest.fn().mockResolvedValue({
      data: { user: null },
    });

    mockCreateClient.mockReturnValue({
      auth: {
        exchangeCodeForSession: jest.fn().mockResolvedValue({}),
        getUser: mockGetUser,
      },
      from: jest.fn(),
    } as any);

    const request = new Request('http://localhost/auth/callback?code=123');
    const response = await GET(request);

    expect(mockCreateClient().auth.exchangeCodeForSession).toHaveBeenCalledWith('123');
    expect(mockGetUser).toHaveBeenCalled();
    expect(mockNextResponse.redirect).toHaveBeenCalledWith('http://localhost/login');
    expect(response.url).toBe('http://localhost/login');
  });
});