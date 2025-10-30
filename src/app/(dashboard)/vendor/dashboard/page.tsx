import React from 'react';
import LogoutButton from '@/components/LogoutButton'; // Import the LogoutButton

const VendorDashboardPage = () => {
  return (
    <div>
      <LogoutButton /> {/* Add the LogoutButton */}
      <h1>Vendor Dashboard</h1>
      <p>Welcome to your protected vendor dashboard!</p>
    </div>
  );
};

export default VendorDashboardPage;