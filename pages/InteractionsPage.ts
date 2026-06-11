import type { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * Page object for the Interactions page: drag & drop, slider,
 * quantity stepper and file upload.
 */
export class InteractionsPage extends BasePage {
  readonly backlogColumn: Locator
  readonly restockColumn: Locator
  readonly restockCount: Locator
  readonly thresholdSlider: Locator
  readonly thresholdValue: Locator
  readonly stepperValue: Locator
  readonly stepperIncrement: Locator
  readonly stepperDecrement: Locator
  readonly fileInput: Locator
  readonly fileInfo: Locator

  constructor(page: Page) {
    super(page)
    this.backlogColumn = page.getByTestId('dnd-backlog')
    this.restockColumn = page.getByTestId('dnd-restock')
    this.restockCount = page.getByTestId('restock-count')
    this.thresholdSlider = page.getByTestId('threshold-slider')
    this.thresholdValue = page.getByTestId('threshold-value')
    this.stepperValue = page.getByTestId('stepper-value')
    this.stepperIncrement = page.getByTestId('stepper-increment')
    this.stepperDecrement = page.getByTestId('stepper-decrement')
    this.fileInput = page.getByTestId('file-input')
    this.fileInfo = page.getByTestId('file-info')
  }

  async open(): Promise<void> {
    await this.goto('/interactions')
  }

  /** Drag an item (by its data-item-id) from the backlog into the restock column. */
  async dragItemToRestock(itemId: string): Promise<void> {
    const source = this.backlogColumn.locator(`[data-item-id="${itemId}"]`)
    await source.dragTo(this.restockColumn)
  }

  async getRestockCount(): Promise<number> {
    const text = (await this.restockCount.textContent()) ?? ''
    const match = text.match(/(\d+)/)
    return match ? parseInt(match[1], 10) : 0
  }

  /** Set the threshold slider to an exact value using keyboard navigation. */
  async setThreshold(target: number): Promise<void> {
    await this.thresholdSlider.focus()
    // Move to minimum, then step up to the target for deterministic behaviour.
    await this.thresholdSlider.press('Home')
    for (let i = 0; i < target; i++) {
      await this.thresholdSlider.press('ArrowRight')
    }
  }

  async getThresholdValue(): Promise<number> {
    return parseInt((await this.thresholdValue.textContent()) ?? '0', 10)
  }

  async incrementStepper(times = 1): Promise<void> {
    for (let i = 0; i < times; i++) await this.stepperIncrement.click()
  }

  async decrementStepper(times = 1): Promise<void> {
    for (let i = 0; i < times; i++) await this.stepperDecrement.click()
  }

  async getStepperValue(): Promise<number> {
    return parseInt((await this.stepperValue.textContent()) ?? '0', 10)
  }

  /** Upload a file from a buffer (no real file on disk required). */
  async uploadFile(name: string, content: string): Promise<void> {
    await this.fileInput.setInputFiles({
      name,
      mimeType: 'text/csv',
      buffer: Buffer.from(content),
    })
  }
}
