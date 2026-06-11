import type { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * Page object for the Dynamic Content page: delayed loads, spinners,
 * delayed-enable buttons, live counter and progressive reveal.
 */
export class DynamicContentPage extends BasePage {
  readonly loadButton: Locator
  readonly spinner: Locator
  readonly dynamicTable: Locator
  readonly dynamicRows: Locator
  readonly delayedButton: Locator
  readonly counterValue: Locator
  readonly toggleCounter: Locator
  readonly revealButton: Locator
  readonly revealedText: Locator

  constructor(page: Page) {
    super(page)
    this.loadButton = page.getByTestId('load-data')
    this.spinner = page.getByTestId('loading-spinner')
    this.dynamicTable = page.getByTestId('dynamic-table')
    this.dynamicRows = page.getByTestId('dynamic-row')
    this.delayedButton = page.getByTestId('delayed-button')
    this.counterValue = page.getByTestId('counter-value')
    this.toggleCounter = page.getByTestId('toggle-counter')
    this.revealButton = page.getByTestId('reveal-button')
    this.revealedText = page.getByTestId('revealed-text')
  }

  async open(): Promise<void> {
    await this.goto('/dynamic')
  }

  async loadData(): Promise<void> {
    await this.loadButton.click()
  }

  async getCounterValue(): Promise<number> {
    return parseInt((await this.counterValue.textContent()) ?? '0', 10)
  }

  async startCounter(): Promise<void> {
    await this.toggleCounter.click()
  }

  async reveal(): Promise<void> {
    await this.revealButton.click()
  }
}
