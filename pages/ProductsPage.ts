import type { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * Page object for the Products listing: search, filter, sort,
 * pagination and the delete-confirmation modal.
 */
export class ProductsPage extends BasePage {
  readonly searchInput: Locator
  readonly categoryFilter: Locator
  readonly statusFilter: Locator
  readonly resetButton: Locator
  readonly addButton: Locator
  readonly table: Locator
  readonly rows: Locator
  readonly resultsCount: Locator
  readonly pageIndicator: Locator
  readonly prevButton: Locator
  readonly nextButton: Locator
  readonly noResultsRow: Locator

  // Delete modal
  readonly deleteModal: Locator
  readonly deleteModalConfirm: Locator
  readonly deleteModalCancel: Locator
  readonly deleteModalTarget: Locator

  constructor(page: Page) {
    super(page)
    this.searchInput = page.getByTestId('product-search')
    this.categoryFilter = page.getByTestId('filter-category')
    this.statusFilter = page.getByTestId('filter-status')
    this.resetButton = page.getByTestId('reset-filters')
    this.addButton = page.getByTestId('add-product-button')
    this.table = page.getByTestId('products-table')
    this.rows = page.getByTestId('product-row')
    this.resultsCount = page.getByTestId('results-count')
    this.pageIndicator = page.getByTestId('page-indicator')
    this.prevButton = page.getByTestId('prev-page')
    this.nextButton = page.getByTestId('next-page')
    this.noResultsRow = page.getByTestId('no-results-row')

    this.deleteModal = page.getByTestId('delete-modal')
    this.deleteModalConfirm = page.getByTestId('delete')
    this.deleteModalCancel = page.getByTestId('delete')
    this.deleteModalTarget = page.getByTestId('delete')
  }

  async open(): Promise<void> {
    await this.goto('/products')
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term)
  }

  async filterByCategory(category: string): Promise<void> {
    await this.categoryFilter.selectOption(category)
  }

  async filterByStatus(status: string): Promise<void> {
    await this.statusFilter.selectOption(status)
  }

  async resetFilters(): Promise<void> {
    await this.resetButton.click({ force: true });
  }

  /** Sort by clicking a column header (name, category, quantity, price, status). */
  async sortBy(column: 'name' | 'category' | 'quantity' | 'price' | 'status'): Promise<void> {
    await this.byTestId(`th-${column}`).click()
  }

  /** Return the row locator that contains the given SKU. */
  rowBySku(sku: string): Locator {
    return this.rows.filter({ has: this.page.getByTestId('product-sku').filter({ hasText: sku }) })
  }

  /** Get the locator of a specific cell within a product row. */
  cell(row: Locator, field: 'name' | 'sku' | 'category' | 'quantity' | 'price' | 'status'): Locator {
    return row.getByTestId(`product-${field}`)
  }

  async getVisibleNames(): Promise<string[]> {
    return this.page.getByTestId('product-name').allInnerTexts()
  }

  async getResultsCount(): Promise<number> {
    const text = (await this.resultsCount.textContent()) ?? '0'
    return parseInt(text, 10)
  }

  async nextPage(): Promise<void> {
    await this.nextButton.click()
  }

  async prevPage(): Promise<void> {
    await this.prevButton.click()
  }

  async getPageIndicator(): Promise<string> {
    return (await this.pageIndicator.textContent())?.trim() ?? ''
  }

  /** Open the delete modal for a product by SKU. */
  async clickDeleteForSku(sku: string): Promise<void> {
    await this.rowBySku(sku).getByTestId('delete-product').click()
    await expect(this.deleteModal).toBeVisible()
  }

  async confirmDelete(): Promise<void> {
    await this.deleteModalConfirm.click()
  }

  async cancelDelete(): Promise<void> {
    await this.deleteModalCancel.click()
  }
}
