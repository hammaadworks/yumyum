import React from 'react';
import { LogoutButton } from '@/components/shared/LogoutButton';

const VendorDashboardPage = () => {
  return (
    <div>
      <h1>Vendor Dashboard</h1>
      <p>Welcome to your protected dashboard!</p>
      <LogoutButton />
    </div>
  );
};

export default VendorDashboardPage;
