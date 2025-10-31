import { chromium, expect, FullConfig } from '@playwright/test';
import path from 'path';

const STORAGE_STATE_PATH = path.join(__dirname, 'playwright/.auth/user.json');

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;

  // Due to magic link authentication, we cannot directly log in and save state in global-setup.
  // This setup will primarily ensure the browser starts and closes cleanly.
  // For E2E tests requiring authentication, consider mocking the session or using a test email service.

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Example of how you *would* log in if it were a username/password flow:
  // await page.goto(`${baseURL}/login`);
  // await page.fill('input[id="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
  // await page.click('button[type="submit"]'); // Assuming this sends the magic link
  // await page.waitForURL(/.*\/dashboard/); // This would only work if the magic link was clicked and redirected

  // For now, we'll just save an empty state or a dummy state if needed.
  // If your tests require a logged-in state, you'll need to implement a way to achieve that (e.g., API login, mocked session).
  await page.context().storageState({ path: STORAGE_STATE_PATH });

  await browser.close();
}

export default globalSetup;
