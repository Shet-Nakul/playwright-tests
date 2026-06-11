import { test, expect } from '../fixtures/auth-fixtures'

/**
 * Dynamic content: spinners, delayed loads, delayed-enable and reveals.
 * Demonstrates Playwright's auto-waiting and web-first assertions.
 */
test.describe('Dynamic content', () => {
  test.beforeEach(async ({ dynamicPage }) => {
    await dynamicPage.open()
  })

  test('shows a spinner then loads the table @smoke', async ({ dynamicPage }) => {
    await dynamicPage.loadData()
    await expect(dynamicPage.spinner).toBeVisible()
    // Auto-waiting: the assertion retries until the table appears.
    await expect(dynamicPage.dynamicTable).toBeVisible()
    await expect(dynamicPage.spinner).toBeHidden()
    await expect(dynamicPage.dynamicRows).toHaveCount(4)
  })

  test('enables the delayed button after a short wait @regression', async ({ dynamicPage }) => {
    await expect(dynamicPage.delayedButton).toBeDisabled()
    await expect(dynamicPage.delayedButton).toBeEnabled({ timeout: 5000 })
    await expect(dynamicPage.delayedButton).toHaveText('Now Enabled')
  })

  test('live counter increments over time', async ({ dynamicPage }) => {
    await dynamicPage.startCounter()
    await expect.poll(() => dynamicPage.getCounterValue(), { timeout: 6000 }).toBeGreaterThanOrEqual(2)
  })

  test('reveals hidden text on demand', async ({ dynamicPage }) => {
    await expect(dynamicPage.revealedText).toBeHidden()
    await dynamicPage.reveal()
    await expect(dynamicPage.revealedText).toBeVisible()
  })
})
