import type { Page, Locator } from '@playwright/test'

/**
 * Small collection of reusable helpers used across page objects and specs.
 * Keep these generic — anything app-specific belongs in a page object.
 */

/** Wait until the network is idle and the document is ready. */
export async function waitForPageReady(page: Page): Promise<void> {
  await page.waitForLoadState('domcontentloaded')
  await page.waitForLoadState('networkidle')
}

/** Read the trimmed text content of a locator. */
export async function getText(locator: Locator): Promise<string> {
  return (await locator.textContent())?.trim() ?? ''
}

/** Return the number of rows currently rendered in a table body. */
export async function rowCount(rows: Locator): Promise<number> {
  return rows.count()
}

/** Format a number as a USD currency string matching the app's output. */
export function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`
}

/** Retry an assertion-style async function until it passes or times out. */
export async function pollUntil(
  fn: () => Promise<boolean>,
  { timeout = 5000, interval = 200 } = {},
): Promise<void> {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    if (await fn()) return
    await new Promise((r) => setTimeout(r, interval))
  }
  throw new Error('pollUntil: condition not met within timeout')
}
