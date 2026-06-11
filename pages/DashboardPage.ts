import type { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * Page object for the Dashboard, exposing the stat cards and recent orders.
 */
export class DashboardPage extends BasePage {
  readonly statGrid: Locator
  readonly recentOrdersTable: Locator

  constructor(page: Page) {
    super(page)
    this.statGrid = page.getByTestId('stat-grid')
    this.recentOrdersTable = page.getByTestId('recent-orders-table')
  }

  async open(): Promise<void> {
    await this.goto('/dashboard')
  }

  /** Read the numeric/text value of a stat card by its key. */
  async getStatValue(
    stat: 'total-products' | 'low-stock' | 'out-of-stock' | 'inventory-value' | 'pending-orders' | 'active-suppliers',
  ): Promise<string> {
    const locator = this.byTestId(`stat-${stat}-value`)
    return (await locator.textContent())?.trim() ?? ''
  }

  recentOrderRows(): Locator {
    return this.recentOrdersTable.locator('tbody tr')
  }
}
