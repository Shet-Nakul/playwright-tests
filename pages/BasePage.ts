import type { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'

/**
 * BasePage holds functionality shared by every page object:
 * navigation, common locators (toasts, page title) and small helpers.
 * All concrete page objects extend this class.
 */
export abstract class BasePage {
  readonly page: Page
  readonly toastContainer: Locator
  readonly toastMessage: Locator
  readonly pageTitle: Locator

  constructor(page: Page) {
    this.page = page
    this.toastContainer = page.getByTestId('toast-container')
    this.toastMessage = page.getByTestId('toast-message')
    this.pageTitle = page.getByTestId('page-title')
  }

  /** Navigate to a path relative to the configured baseURL. */
  async goto(path = '/'): Promise<void> {
    await this.page.goto(path)
  }

  /** Convenience wrapper around getByTestId. */
  byTestId(id: string): Locator {
    return this.page.getByTestId(id)
  }

  /** Assert that a toast with the given (partial) text becomes visible. */
  async expectToast(text: string | RegExp): Promise<void> {
    await expect(this.toastMessage.filter({ hasText: text }).first()).toBeVisible()
  }

  /** Return the current page heading text. */
  async getHeading(): Promise<string> {
    return (await this.pageTitle.textContent())?.trim() ?? ''
  }

  /** Wait for the SPA to settle. */
  async waitForReady(): Promise<void> {
    await this.page.waitForLoadState('networkidle')
  }
}
