import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'

// Load environment variables from .env (BASE_URL, CI, etc.)
dotenv.config()

const BASE_URL = process.env.BASE_URL ?? 'https://playwright-inventory.vercel.app/'

/**
 * Playwright configuration for the StockPilot inventory automation suite.
 * Docs: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  // Run a global setup that authenticates once and stores the session state.
  globalSetup: './global-setup.ts',
  // Per-test timeout.
  timeout: 30 * 1000,
  expect: {
    timeout: 5 * 1000,
  },
  // Fail the build on CI if test.only is left in the source.
  forbidOnly: !!process.env.CI,
  // Retry flaky tests on CI only.
  retries: process.env.CI ? 2 : 0,
  // Limit workers on CI for stability.
  workers: process.env.CI ? 1 : undefined,
  // Reporters: a readable list plus a rich HTML report and a JUnit file for CI.
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'results/junit.xml' }],
  ],
  // Shared settings for all projects.
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10 * 1000,
    navigationTimeout: 15 * 1000,
  },
  projects: [
    // A setup project could be used here too; we use globalSetup for storage state.
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
  // Automatically start the React app before running tests, and reuse it locally.
  webServer: {
    command: 'npm run dev --prefix ../inventory-app',
    url: BASE_URL,
    timeout: 120 * 1000,
    reuseExistingServer: true,
  },
})
