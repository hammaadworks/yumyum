import { GET } from '@/app/auth/callback/route';
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
    redirect: jest.fn((url) => ({ url })),
  },
}));

describe('Auth Callback Route', () => {
  const mockCreateClient = createClient as jest.Mock;
  const mockNextResponse = NextResponse as jest.Mocked<typeof NextResponse>;

  let mockSupabase: any;

  beforeEach(() => {
    jest.clearAllMocks();

    const mockSingle = jest.fn();
    const mockEq = jest.fn(() => ({ single: mockSingle }));
    const mockSelect = jest.fn(() => ({ eq: mockEq }));
    const mockFrom = jest.fn(() => ({ select: mockSelect }));

    mockSupabase = {
      auth: {
        exchangeCodeForSession: jest.fn(),
        getUser: jest.fn(),
      },
      from: mockFrom,
    };

    mockCreateClient.mockReturnValue(mockSupabase);
  });

  test('should redirect to /login if no code is provided', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });

    const request = new Request('http://localhost/auth/callback');
    const response = await GET(request);

    expect(mockNextResponse.redirect).toHaveBeenCalledWith('http://localhost/login');
    expect(response.url).toBe('http://localhost/login');
  });

  test('should redirect to /{vendor-slug}/dashboard on successful login with vendor mapping', async () => {
    mockSupabase.auth.exchangeCodeForSession.mockResolvedValue({});
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user-123', email: 'vendor@example.com' } },
      error: null,
    });
    mockSupabase.from().select().eq().single.mockResolvedValue({
      data: { vendor_slug: 'test-vendor' },
      error: null,
    });

    const request = new Request('http://localhost/auth/callback?code=123');
    const response = await GET(request);

    expect(mockSupabase.auth.exchangeCodeForSession).toHaveBeenCalledWith('123');
    expect(mockSupabase.auth.getUser).toHaveBeenCalled();
    expect(mockSupabase.from).toHaveBeenCalledWith('vendor_mappings');
    expect(mockSupabase.from().select).toHaveBeenCalledWith('vendor_slug');
    expect(mockSupabase.from().select().eq).toHaveBeenCalledWith('user_id', 'user-123');
    expect(mockNextResponse.redirect).toHaveBeenCalledWith('http://localhost/test-vendor/dashboard');
    expect(response.url).toBe('http://localhost/test-vendor/dashboard');
  });

  test('should redirect to /dashboard-error if user exists but no vendor mapping is found', async () => {
    mockSupabase.auth.exchangeCodeForSession.mockResolvedValue({});
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user-123', email: 'vendor@example.com' } },
      error: null,
    });
    mockSupabase.from().select().eq().single.mockResolvedValue({
      data: null,
      error: { code: 'PGRST116', message: 'No rows found' },
    });

    const request = new Request('http://localhost/auth/callback?code=123');
    const response = await GET(request);

    expect(mockSupabase.auth.exchangeCodeForSession).toHaveBeenCalledWith('123');
    expect(mockSupabase.auth.getUser).toHaveBeenCalled();
    expect(mockSupabase.from).toHaveBeenCalledWith('vendor_mappings');
    expect(mockSupabase.from().select).toHaveBeenCalledWith('vendor_slug');
    expect(mockSupabase.from().select().eq).toHaveBeenCalledWith('user_id', 'user-123');
    expect(mockNextResponse.redirect).toHaveBeenCalledWith('http://localhost/dashboard-error');
    expect(response.url).toBe('http://localhost/dashboard-error');
  });

  test('should redirect to /login if user is not found after exchangeCodeForSession', async () => {
    mockSupabase.auth.exchangeCodeForSession.mockResolvedValue({});
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const request = new Request('http://localhost/auth/callback?code=123');
    const response = await GET(request);

    expect(mockSupabase.auth.exchangeCodeForSession).toHaveBeenCalledWith('123');
    expect(mockSupabase.auth.getUser).toHaveBeenCalled();
    expect(mockNextResponse.redirect).toHaveBeenCalledWith('http://localhost/login');
    expect(response.url).toBe('http://localhost/login');
  });
});