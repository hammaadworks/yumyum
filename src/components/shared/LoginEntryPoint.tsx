'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { LoginFormContent } from '@/components/features/auth/LoginFormContent';
import { useRouter } from 'next/navigation';

export function LoginEntryPoint() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleLoginSuccess = () => {
    // After successful magic link send, keep modal open to show message
    // User will be redirected by the magic link callback
  };

  const handleLoginError = (errorMsg: string) => {
    // Display error within the form
    console.error('Login error in modal:', errorMsg);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="absolute top-4 right-4 z-50">
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-white text-primary hover:bg-primary hover:text-white"
          >
            Vendor Login
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white p-0">
          <LoginFormContent
            onLoginSuccess={handleLoginSuccess}
            onLoginError={handleLoginError}
            onClose={handleCloseModal}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
