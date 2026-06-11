import { chromium, type FullConfig } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { users, STORAGE_STATE } from './data/users'
import { logger } from './utils/logger'

/**
 * Global setup runs once before the whole suite.
 * It logs in as the admin user and saves the authenticated storage state
 * so authenticated specs can skip the login flow (faster, more reliable).
 */
async function globalSetup(config: FullConfig): Promise<void> {
  const baseURL = config.projects[0]?.use?.baseURL ?? 'http://localhost:5173'
  logger.info(`Global setup: authenticating against ${baseURL}`)

  const authDir = path.dirname(STORAGE_STATE)
  if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true })

  const browser = await chromium.launch()
  const page = await browser.newPage({ baseURL })

  await page.goto('/login')
  await page.getByTestId('login-username').fill(users.admin.username)
  await page.getByTestId('login-password').fill(users.admin.password)
  await page.getByTestId('login-submit').click()

  // Wait until we land on an authenticated page.
  await page.getByTestId('current-user').waitFor({ state: 'visible' })

  await page.context().storageState({ path: STORAGE_STATE })
  logger.info(`Storage state saved to ${STORAGE_STATE}`)

  await browser.close()
}

export default globalSetup
