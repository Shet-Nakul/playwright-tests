import { test, expect } from '../fixtures/auth-fixtures'
import { buildProduct } from '../utils/dataFactory'
import { invalidProduct } from '../data/products'

/**
 * Add Product form: validation rules and the happy path.
 */
test.describe('Add Product form', () => {
  test.beforeEach(async ({ addProductPage }) => {
    await addProductPage.open()
  })

  test('shows validation errors when submitting an empty form @smoke', async ({ addProductPage }) => {
    await addProductPage.submit()
    await expect(addProductPage.fieldError('name')).toBeVisible()
    await expect(addProductPage.fieldError('sku')).toBeVisible()
    await expect(addProductPage.fieldError('category')).toBeVisible()
    await expect(addProductPage.fieldError('supplier')).toBeVisible()
    await expect(addProductPage.fieldError('acceptTerms')).toBeVisible()
  })

  test('rejects an invalid SKU format', async ({ addProductPage }) => {
    await addProductPage.fillForm({ ...invalidProduct, name: 'Valid Name' })
    await addProductPage.submit()
    await expect(addProductPage.fieldError('sku')).toContainText('ABC-1234')
  })

  test('rejects a name shorter than three characters', async ({ addProductPage }) => {
    await addProductPage.nameInput.fill('AB')
    await addProductPage.submit()
    await expect(addProductPage.fieldError('name')).toContainText('at least 3 characters')
  })

  test('rejects a non-positive price', async ({ addProductPage }) => {
    const product = buildProduct({ price: 0 })
    await addProductPage.fillForm(product)
    await addProductPage.acceptTerms()
    await addProductPage.submit()
    await expect(addProductPage.fieldError('price')).toContainText('greater than 0')
  })

  test('requires accepting the terms checkbox', async ({ addProductPage }) => {
    const product = buildProduct()
    await addProductPage.fillForm(product)
    // Intentionally skip acceptTerms.
    await addProductPage.submit()
    await expect(addProductPage.fieldError('acceptTerms')).toBeVisible()
  })

  test('creates a product successfully and redirects @regression', async ({ addProductPage, page }) => {
    const product = buildProduct()
    await addProductPage.createProduct(product)
    await expect(addProductPage.successAlert).toBeVisible()
    await addProductPage.expectToast(`Product "${product.name}" added successfully!`)
    await expect(page).toHaveURL(/\/products$/, { timeout: 5000 })
  })

  test('reset clears all entered values', async ({ addProductPage }) => {
    await addProductPage.nameInput.fill('Temporary Name')
    await addProductPage.skuInput.fill('ELE-1234')
    await addProductPage.reset()
    await expect(addProductPage.nameInput).toHaveValue('')
    await expect(addProductPage.skuInput).toHaveValue('')
  })
})
