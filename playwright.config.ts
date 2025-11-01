import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: './.env.local' });

const STORAGE_STATE_PATH = path.join(__dirname, 'playwright/.auth/user.json');

export default defineConfig({
  testDir: './e2e', // Specify the directory where Playwright should look for tests
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }]],
  globalSetup: require.resolve('./playwright.global-setup'),
  use: {
    trace: 'on-first-retry',
    baseURL: 'http://localhost:3000', // Assuming your Next.js app runs on port 3000
    storageState: STORAGE_STATE_PATH,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'bash ./start-dev.sh',
    url: 'http://localhost:3000',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
    env: process.env as Record<string, string>,
  },
});
