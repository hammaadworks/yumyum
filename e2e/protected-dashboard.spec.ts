import { test, expect } from '@playwright/test';

test.describe('Protected Dynamic Routes', () => {
  test('should redirect unauthenticated user from /[vendor_slug]/dashboard to /login', async ({ page }) => {
    await page.goto('/some-vendor-slug/dashboard');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('should redirect unauthenticated user from /(dashboard)/[vendor_slug]/upload to /login', async ({ page }) => {
    await page.goto('/some-vendor-slug/upload');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('should allow a logged-in user to logout from /[vendor_slug]/dashboard', async ({ page }) => {
    // Simulate login by directly navigating to the dashboard (assuming a valid session is set up elsewhere or mocked)
    // In a real scenario, you would go through the login flow first.
    await page.goto('/test-vendor/dashboard');
    // Assuming the dashboard page has a logout button with the text 'Logout'
    await page.click('button:has-text("Logout")');
    await expect(page).toHaveURL(/.*\/login/);
  });
});