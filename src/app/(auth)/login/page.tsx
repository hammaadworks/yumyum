'use client';

import { LoginFormContent } from '@/components/features/auth/LoginFormContent';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    // Optionally redirect or show a success message on this page
    // For now, the LoginFormContent handles the message display
  };

  const handleLoginError = (errorMsg: string) => {
    // Optionally handle error on this page
    console.error("Login error on page:", errorMsg);
  };

  const handleClose = () => {
    router.push('/'); // Go back to homepage if closed
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96">
        <LoginFormContent
          onLoginSuccess={handleLoginSuccess}
          onLoginError={handleLoginError}
          onClose={handleClose}
        />
      </div>
    </div>
  );
}
