import { test, expect } from '@playwright/test';

test.describe('Protected Dashboard Route', () => {
  test('should redirect unauthenticated user to login page', async ({ page }) => {
    await page.goto('/vendor/dashboard');
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.locator('h1')).toHaveText('Login'); // Assuming your login page has an h1 with 'Login'
  });

  test('should allow authenticated user to access dashboard and then logout', async ({ page }) => {
    // Simulate login (this part would typically involve filling out a login form)
    // For now, we'll assume a successful login redirects to /vendor/dashboard
    // In a real scenario, you'd interact with the login form here.
    // For demonstration, let's directly set a mock session or navigate to a post-login state.
    // This is a placeholder and needs actual login implementation.
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.click('button[type="submit"]');
    // Assuming successful login redirects to dashboard
    await page.waitForURL(/.*\/vendor\/dashboard/);
    await expect(page.locator('h1')).toHaveText('Vendor Dashboard');

    // Click logout button
    await page.click('button:has-text("Logout")');

    // Verify redirection to login page after logout
    await page.waitForURL(/.*\/login/);
    await expect(page.locator('h1')).toHaveText('Login');
  });
});

