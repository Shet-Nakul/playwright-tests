import type { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'
import type { NewProduct } from '../utils/dataFactory'

/**
 * Page object for the Add Product form, including validation error accessors.
 */
export class AddProductPage extends BasePage {
  readonly form: Locator
  readonly nameInput: Locator
  readonly skuInput: Locator
  readonly categorySelect: Locator
  readonly supplierSelect: Locator
  readonly quantityInput: Locator
  readonly moneyInput: Locator
  readonly descriptionInput: Locator
  readonly notifyYes: Locator
  readonly notifyNo: Locator
  readonly termsCheckbox: Locator
  readonly submitButton: Locator
  readonly resetButton: Locator
  readonly successAlert: Locator

  constructor(page: Page) {
    super(page)
    this.form = page.getByTestId('add-product-form')
    this.nameInput = page.getByTestId('input-name')
    this.skuInput = page.getByTestId('input-sku')
    this.categorySelect = page.getByTestId('select-category')
    this.supplierSelect = page.getByTestId('select-supplier')
    this.quantityInput = page.getByTestId('input-quantity')
    this.moneyInput = page.getByTestId('input-price')
    this.descriptionInput = page.getByTestId('input-description')
    this.notifyYes = page.getByTestId('radio-notify-yes')
    this.notifyNo = page.getByTestId('radio-notify-no')
    this.termsCheckbox = page.getByTestId('checkbox-terms')
    this.submitButton = page.getByTestId('submit-product')
    this.resetButton = page.getByTestId('reset')
    this.successAlert = page.getByTestId('form')
  }

  async open(): Promise<void> {
    await this.goto('/products/new')
  }

  /** Fill the form with the supplied product data. Empty fields are skipped. */
  async fillForm(product: NewProduct): Promise<void> {
    if (product.name) await this.nameInput.fill(product.name)
    if (product.sku) await this.skuInput.fill(product.sku)
    if (product.category) await this.categorySelect.selectOption(product.category)
    if (product.supplier) await this.supplierSelect.selectOption(product.supplier)
    await this.quantityInput.fill(String(product.quantity))
    await this.moneyInput.fill(String(product.price))
    if (product.description) await this.descriptionInput.fill(product.description)
    if (product.notify) await this.notifyYes.check()
    else await this.notifyNo.check()
  }

  async acceptTerms(): Promise<void> {
    await this.termsCheckbox.check()
  }

  async submit(): Promise<void> {
    console.log('Submitting product form with name:', await this.nameInput.inputValue())
    await this.submitButton.click()
  }

  async reset(): Promise<void> {
    await this.resetButton.click()
  }

  /** Locator for a specific field's validation error. */
  fieldError(field: 'name' | 'sku' | 'category' | 'supplier' | 'quantity' | 'price' | 'acceptTerms'): Locator {
    return this.byTestId(`error-${field}`)
  }

  /** Submit a fully valid product end-to-end. */
  async createProduct(product: NewProduct): Promise<void> {
    console.log("Something wrong with this test case");
    await this.fillForm(product)
    await this.acceptTerms()
    await this.submit()
  }
}
