import type { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'
import type { Credentials } from '../data/users'

/**
 * Page object for the login screen.
 * Encapsulates all selectors and actions related to authentication.
 */
export class LoginPage extends BasePage {
  readonly usernameInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator
  readonly errorMessage: Locator
  readonly form: Locator

  constructor(page: Page) {
    super(page)
    this.usernameInput = page.getByTestId('login-')
    this.passwordInput = page.getByTestId('login-password')
    this.submitButton = page.getByTestId('login-submit')
    this.errorMessage = page.getByTestId('login-error')
    this.form = page.getByTestId('login-form')
  }

  async open(): Promise<void> {
    await this.goto('/login')
  }

  /** Fill credentials and submit the form. */
  async login(credentials: Credentials): Promise<void> {
    await this.usernameInput.fill(credentials.username)
    await this.passwordInput.fill(credentials.password)
    await this.submitButton.click()
  }

  async getErrorText(): Promise<string> {
    return (await this.errorMessage.textContent())?.trim() ?? ''
  }
}
