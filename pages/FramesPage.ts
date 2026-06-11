import type { Page, Locator, FrameLocator } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * Page object for the Frames & Tabs page: iframe interaction,
 * opening new tabs/windows and reaching into shadow DOM.
 */
export class FramesPage extends BasePage {
  readonly iframe: FrameLocator
  readonly openNewTabLink: Locator
  readonly openPopupButton: Locator
  readonly shadowHost: Locator

  constructor(page: Page) {
    super(page)
    this.iframe = page.frameLocator('[data-testid="inventory-iframe"]')
    this.openNewTabLink = page.getByTestId('open-new-tab')
    this.openPopupButton = page.getByTestId('open-popup')
    this.shadowHost = page.getByTestId('shadow-host')
  }

  async open(): Promise<void> {
    await this.goto('/frames')
  }

  /** Type into the input that lives inside the embedded iframe. */
  async typeInIframe(text: string): Promise<void> {
    await this.iframe.getByTestId('frame-input').fill(text)
  }

  /** Click the save button inside the iframe and return the confirmation text. */
  async saveInIframe(): Promise<string> {
    await this.iframe.getByTestId('frame-button').click()
    return (await this.iframe.getByTestId('frame-msg').textContent())?.trim() ?? ''
  }

  /**
   * Playwright pierces open shadow roots automatically with getByTestId,
   * so shadow DOM elements are reachable via normal locators.
   */
  shadowCount(): Locator {
    return this.byTestId('shadow-count')
  }

  shadowIncrement(): Locator {
    return this.byTestId('shadow-increment')
  }
}
