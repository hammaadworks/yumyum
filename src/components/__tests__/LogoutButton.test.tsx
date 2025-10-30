import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LogoutButton from '../LogoutButton';

// Mock useRouter and createClient
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock('@/lib/supabase/utils/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signOut: jest.fn(() => Promise.resolve()),
    },
  })),
}));

describe('LogoutButton', () => {
  it('renders a logout button', () => {
    render(<LogoutButton />);
    const button = screen.getByRole('button', { name: /logout/i });
    expect(button).toBeInTheDocument();
  });

  it('calls signOut and redirects to /login on click', async () => {
    const mockPush = jest.fn();
    const mockSignOut = jest.fn(() => Promise.resolve());

    require('next/navigation').useRouter.mockReturnValue({ push: mockPush });
    require('@/lib/supabase/utils/client').createClient.mockReturnValue({
      auth: {
        signOut: mockSignOut,
      },
    });

    render(<LogoutButton />);
    const button = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(button);

    expect(mockSignOut).toHaveBeenCalledTimes(1);
    await new Promise(process.nextTick); // Wait for promises to resolve
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});
