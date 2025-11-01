'use client';

import { usePathname } from 'next/navigation';
import { GlobalCart } from '@/components/shared/GlobalCart';
import React from 'react';

export function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideCart = pathname === '/' || pathname === '/login';

  return (
    <>
      {!hideCart && <GlobalCart />}
      {children}
    </>
  );
}
