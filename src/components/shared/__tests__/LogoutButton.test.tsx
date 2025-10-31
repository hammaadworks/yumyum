import { render, screen, fireEvent } from '@testing-library/react';
import { LogoutButton } from '../LogoutButton';
import { createClient } from '@/lib/supabase/utils/client';
import { useRouter } from 'next/navigation';

// Mock Next.js navigation and Supabase client
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/lib/supabase/utils/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signOut: jest.fn(),
    },
  })),
}));

describe('LogoutButton', () => {
  const mockPush = jest.fn();
  const mockSignOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (createClient as jest.Mock).mockReturnValue({
      auth: {
        signOut: mockSignOut,
      },
    });
  });

  it('renders a logout button', () => {
    render(<LogoutButton />);
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('calls signOut and redirects to /login on click', async () => {
    render(<LogoutButton />);
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await fireEvent.click(logoutButton);

    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});
