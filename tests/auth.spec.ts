import { test, expect } from '../fixtures/test-fixtures'
import { users } from '../data/users'

/**
 * Authentication and protected-route behaviour.
 * These tests deliberately do NOT use the stored auth state — they exercise
 * the login flow itself.
 */
test.describe('Authentication @smoke', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open()
  })

  test('logs in successfully with valid admin credentials', async ({ loginPage, nav, page }) => {
    await loginPage.login(users.admin)
    await expect(page).toHaveURL(/\/dashboard/)
    await expect(nav.currentUser).toContainText('Admin User')
  })

  test('shows an error for invalid credentials', async ({ loginPage }) => {
    await loginPage.login(users.invalid)
    await expect(loginPage.errorMessage).toBeVisible()
    await expect(loginPage.errorMessage).toContainText('Invalid username or password')
  })

  test('validates that both fields are required', async ({ loginPage }) => {
    await loginPage.submitButton.click()
    await expect(loginPage.errorMessage).toContainText('required')
  })

  test('logs in as manager and viewer @regression', async ({ loginPage, nav, page }) => {
    await loginPage.login(users.manager)
    await expect(nav.currentUser).toContainText('Manager User')
    await nav.logout()

    await loginPage.login(users.viewer)
    await expect(nav.currentUser).toContainText('Viewer User')
    await expect(page).toHaveURL(/\/dashboard/)
  })
})

test.describe('Protected routes', () => {
  test('redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/products')
    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByTestId('login-page')).toBeVisible()
  })

  test('allows access after login and supports logout', async ({ loginPage, nav, page }) => {
    await loginPage.open()
    await loginPage.login(users.admin)
    await expect(page).toHaveURL(/\/dashboard/)

    await nav.logout()
    await expect(page).toHaveURL(/\/login/)

    // After logout, protected routes redirect again.
    await page.goto('/orders')
    await expect(page).toHaveURL(/\/login/)
  })
})
