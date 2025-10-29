import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/page';
import { checkVendorEmailExists } from '@/services/vendor';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

// Mock the necessary modules
jest.mock('/Users/alhamdulillah/codespace/yumyum/src/services/vendor');
jest.mock('@/lib/supabase/client');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

const mockCheckVendorEmailExists = checkVendorEmailExists as jest.Mock;
const mockCreateClient = createClient as jest.Mock;
const mockSignInWithOtp = jest.fn();

describe('LoginPage Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateClient.mockReturnValue({
      auth: {
        signInWithOtp: mockSignInWithOtp,
      },
    });
  });

  test('should display error and Go Home button if email is not registered', async () => {
    mockCheckVendorEmailExists.mockResolvedValue(false);

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'unregistered@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Send Magic Link/i }));

    await waitFor(() => {
      expect(screen.getByText(/This email is not registered with YumYum/i)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /Go Home/i })).toBeInTheDocument();
    expect(mockSignInWithOtp).not.toHaveBeenCalled();
  });

  test('should send magic link and display message if email is registered', async () => {
    mockCheckVendorEmailExists.mockResolvedValue(true);
    mockSignInWithOtp.mockResolvedValue({ error: null });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'registered@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Send Magic Link/i }));

    await waitFor(() => {
      expect(screen.getByText(/Check your email for a magic link to log in!/i)).toBeInTheDocument();
    });
    expect(mockSignInWithOtp).toHaveBeenCalledWith({
      email: 'registered@example.com',
      options: {
        emailRedirectTo: `http://localhost/auth/callback`,
      },
    });
    expect(screen.queryByRole('button', { name: /Go Home/i })).not.toBeInTheDocument();
  });

  test('should display Supabase error if magic link sending fails', async () => {
    mockCheckVendorEmailExists.mockResolvedValue(true);
    mockSignInWithOtp.mockResolvedValue({ error: { message: 'Supabase auth error' } });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'registered@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Send Magic Link/i }));

    await waitFor(() => {
      expect(screen.getByText(/Supabase auth error/i)).toBeInTheDocument();
    });
    expect(mockSignInWithOtp).toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: /Go Home/i })).not.toBeInTheDocument();
  });
});