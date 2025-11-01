import { render } from '@testing-library/react';
import DashboardLayout from '../layout';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/utils/server';
import { cookies } from 'next/headers';

// Mock Next.js navigation and headers
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
  })),
}));

// Mock Supabase client
jest.mock('@/lib/supabase/utils/server', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(),
    },
  })),
}));

describe('DashboardLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to /login if user is not authenticated', async () => {
    (createClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: jest.fn(() =>
          Promise.resolve({
            data: { user: null },
            error: new Error('No user'),
          }),
        ),
      },
    });

    render(await DashboardLayout({ children: <div /> }));

    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('renders children if user is authenticated', async () => {
    (createClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: jest.fn(() =>
          Promise.resolve({ data: { user: { id: '123' } }, error: null }),
        ),
      },
    });

    const { getByText } = render(
      await DashboardLayout({ children: <div>Protected Content</div> }),
    );

    expect(redirect).not.toHaveBeenCalled();
    expect(getByText('Protected Content')).toBeInTheDocument();
  });
});
