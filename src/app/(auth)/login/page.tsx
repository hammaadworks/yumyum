'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/utils/client';
import { checkVendorEmailExists } from '@/services/vendor'; // Import the new service
import Link from 'next/link'; // Import Link for "Go Home" button

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showGoHome, setShowGoHome] = useState(false); // State to control "Go Home" button visibility

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const supabase = createClient();

    // Check if vendor email exists
    const vendorExists = await checkVendorEmailExists(email);

    if (!vendorExists) {
      setError('This email is not registered with YumYum. Please contact support if you believe this is an error.');
      setMessage('');
      setShowGoHome(true); // Show "Go Home" button
      return; // Stop the login process
    }

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (signInError) {
      setError(signInError.message);
      setMessage('');
      setShowGoHome(false);
    } else {
      setMessage('Check your email for a magic link to log in!');
      setError('');
      setShowGoHome(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Send Magic Link
          </button>
        </form>
        {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        {showGoHome && (
          <div className="mt-4 text-center">
            <Link href="/">
              <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Go Home
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}