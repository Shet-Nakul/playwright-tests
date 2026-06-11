import { test, expect } from '../fixtures/auth-fixtures'

/**
 * Cross-page navigation, suppliers and orders workflows.
 */
test.describe('Navigation', () => {
  test('navigates between all main sections @smoke', async ({ nav, page }) => {
    await page.goto('/dashboard')

    await nav.navigateTo('products')
    await expect(page).toHaveURL(/\/products$/)
    await expect(page.getByTestId('products-page')).toBeVisible()

    await nav.navigateTo('suppliers')
    await expect(page.getByTestId('suppliers-page')).toBeVisible()

    await nav.navigateTo('orders')
    await expect(page.getByTestId('orders-page')).toBeVisible()

    await nav.navigateTo('interactions')
    await expect(page.getByTestId('interactions-page')).toBeVisible()

    await nav.navigateTo('dynamic')
    await expect(page.getByTestId('dynamic-page')).toBeVisible()

    await nav.navigateTo('frames')
    await expect(page.getByTestId('frames-page')).toBeVisible()
  })
})

test.describe('Suppliers', () => {
  test('toggles a supplier active state @regression', async ({ page }) => {
    await page.goto('/suppliers')
    const card = page.getByTestId('supplier-card').first()
    const status = card.getByTestId('supplier-status')
    const before = await status.textContent()

    await card.getByTestId('toggle-supplier').click()
    await expect(status).not.toHaveText(before ?? '')
  })
})

test.describe('Orders', () => {
  test('filters orders by status tab', async ({ page }) => {
    await page.goto('/orders')
    await page.getByTestId('order-tab-pending').click()
    const statuses = await page.getByTestId('order-status').allInnerTexts()
    for (const s of statuses) expect(s).toBe('Pending')
  })

  test('advances a pending order to shipped @regression', async ({ page }) => {
    await page.goto('/orders')
    await page.getByTestId('order-tab-pending').click()
    const firstRow = page.getByTestId('order-row').first()
    const reference = await firstRow.getByTestId('order-reference').textContent()

    await firstRow.getByTestId('advance-order').click()
    await expect(page.getByTestId('toast-message').first()).toContainText(`${reference}`)
  })
})
