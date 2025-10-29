import { test, expect } from '@playwright/test';

test.describe('Admin Membership Management E2E Tests', () => {
  test('should allow an administrator to update a vendor\'s is_member status', async ({ request }) => {
    // Simulate admin authentication - in a real app, this would involve logging in
    // and getting an auth token. For this test, we'll assume a valid admin session
    // or API key is available.
    const adminAuthToken = 'MOCK_ADMIN_AUTH_TOKEN'; // Replace with actual admin token if available

    // First, ensure a vendor exists to be updated
    // This would typically be set up in a test database seeding process
    const vendorIdToUpdate = '1'; // Assuming a vendor with ID 1 exists

    // Attempt to update the is_member status to false
    const updateResponse = await request.patch(`/api/admin/vendor/${vendorIdToUpdate}`, {
      headers: {
        Authorization: `Bearer ${adminAuthToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        is_member: false,
      },
    });

    expect(updateResponse.ok()).toBeTruthy();
    const updatedVendor = await updateResponse.json();
    expect(updatedVendor.is_member).toBe(false);

    // Optionally, verify the change by fetching the vendor's status again
    const getResponse = await request.get(`/api/admin/vendor/${vendorIdToUpdate}`, {
      headers: {
        Authorization: `Bearer ${adminAuthToken}`,
      },
    });
    expect(getResponse.ok()).toBeTruthy();
    const fetchedVendor = await getResponse.json();
    expect(fetchedVendor.is_member).toBe(false);

    // Attempt to update the is_member status back to true
    const updateResponse2 = await request.patch(`/api/admin/vendor/${vendorIdToUpdate}`, {
      headers: {
        Authorization: `Bearer ${adminAuthToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        is_member: true,
      },
    });

    expect(updateResponse2.ok()).toBeTruthy();
    const updatedVendor2 = await updateResponse2.json();
    expect(updatedVendor2.is_member).toBe(true);
  });

  test('should prevent unauthorized access to update vendor membership', async ({ request }) => {
    const vendorIdToUpdate = '1';

    // Attempt to update without any authorization token
    const updateResponse = await request.patch(`/api/admin/vendor/${vendorIdToUpdate}`, {
      data: {
        is_member: false,
      },
    });

    expect(updateResponse.status()).toBe(401); // Unauthorized
    const error = await updateResponse.json();
    expect(error.error).toBe('Unauthorized');
  });
});