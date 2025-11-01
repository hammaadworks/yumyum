'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/utils/client';
import { checkVendorEmailExists } from '@/services/vendor';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface LoginFormContentProps {
  onLoginSuccess?: () => void;
  onLoginError?: (errorMsg: string) => void;
  onClose?: () => void; // For modal dismissal
}

export function LoginFormContent({
  onLoginSuccess,
  onLoginError,
  onClose,
}: LoginFormContentProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');
    const supabase = createClient();

    // Check if vendor email exists
    const vendorExists = await checkVendorEmailExists(email);

    if (!vendorExists) {
      setError(
        'This email is not registered with YumYum. Please contact support if you believe this is an error.',
      );
      setIsLoading(false);
      onLoginError?.('Email not registered.');
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (signInError) {
      setError(signInError.message);
      onLoginError?.(signInError.message);
    } else {
      setMessage('Check your email for a magic link to log in!');
      onLoginSuccess?.();
    }
    setIsLoading(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Vendor Login</h1>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <Label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email:
          </Label>
          <Input
            type="email"
            id="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Magic Link'}
        </Button>
      </form>
      {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      {error &&
        onClose && ( // Only show close button if there's an error and onClose is provided
          <div className="mt-4 text-center">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
    </div>
  );
}
