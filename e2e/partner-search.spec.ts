import { test, expect } from '@playwright/test';

test.describe('Partner Search and 404 Page E2E Tests', () => {
  test('should display the custom 404 page for a non-existent vendor slug', async ({ page }) => {
    await page.goto('/non-existent-vendor-slug');
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
    await expect(page.getByText('Oops! Looks like this dish went missing from the menu!')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Go Home' })).toBeVisible();
    await expect(page.getByPlaceholder('Search vendors or dishes...')).toBeVisible();
  });

  test('should navigate to the homepage when "Go Home" button is clicked on 404 page', async ({ page }) => {
    await page.goto('/non-existent-vendor-slug');
    await page.getByRole('button', { name: 'Go Home' }).click();
    await expect(page).toHaveURL('/');
  });

  test('should display search results on the homepage', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.getByPlaceholder('Search vendors or dishes...');
    await expect(searchInput).toBeVisible();

    // Mock the API response for search
    await page.route('/api/search-partners?q=ven', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          results: [
            { vendor_name: 'Vendor A', cuisine: 'Italian', vendor_slug: 'vendor-a' },
            { vendor_name: 'Vendor B', cuisine: 'Mexican', vendor_slug: 'vendor-b' },
          ],
        }),
      });
    });

    await searchInput.fill('ven');
    await expect(page.getByText('Vendor A')).toBeVisible();
    await expect(page.getByText('Vendor B')).toBeVisible();
  });

  test('should navigate to vendor page when a search result is clicked', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.getByPlaceholder('Search vendors or dishes...');

    // Mock the API response for search
    await page.route('/api/search-partners?q=ven', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          results: [
            { vendor_name: 'Vendor A', cuisine: 'Italian', vendor_slug: 'vendor-a' },
          ],
        }),
      });
    });

    await searchInput.fill('ven');
    await page.getByText('Vendor A').click();
    await expect(page).toHaveURL('/vendor-a');
  });
});