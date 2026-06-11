import { test, expect } from '../fixtures/auth-fixtures'

/**
 * Dashboard tests run pre-authenticated using the stored storage state.
 */
test.describe('Dashboard @smoke', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.open()
  })

  test('renders all six stat cards', async ({ dashboardPage, page }) => {
    await expect(dashboardPage.statGrid).toBeVisible()
    await expect(page.getByTestId('stat-total-products')).toBeVisible()
    await expect(page.getByTestId('stat-low-stock')).toBeVisible()
    await expect(page.getByTestId('stat-out-of-stock')).toBeVisible()
    await expect(page.getByTestId('stat-inventory-value')).toBeVisible()
    await expect(page.getByTestId('stat-pending-orders')).toBeVisible()
    await expect(page.getByTestId('stat-active-suppliers')).toBeVisible()
  })

  test('shows correct total product count', async ({ dashboardPage }) => {
    await expect.poll(() => dashboardPage.getStatValue('total-products')).toBe('25')
  })

  test('inventory value is formatted as currency', async ({ dashboardPage }) => {
    const value = await dashboardPage.getStatValue('inventory-value')
    expect(value).toMatch(/^\$[\d,]+\.\d{2}$/)
  })

  test('recent orders table lists up to five rows', async ({ dashboardPage }) => {
    const count = await dashboardPage.recentOrderRows().count()
    expect(count).toBeGreaterThan(0)
    expect(count).toBeLessThanOrEqual(5)
  })
})
