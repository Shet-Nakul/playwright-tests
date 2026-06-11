import { test, expect } from '../fixtures/auth-fixtures'

/**
 * Products listing: search, filter, sort, pagination and delete-with-confirm.
 */
test.describe('Products table', () => {
  test.beforeEach(async ({ productsPage }) => {
    await productsPage.open()
  })

  test('displays a paginated list of products @smoke', async ({ productsPage }) => {
    await expect(productsPage.table).toBeVisible()
    await expect(productsPage.rows).toHaveCount(5)
    expect(await productsPage.getResultsCount()).toBe(25)
    await expect(productsPage.pageIndicator).toContainText('Page 1 of 5')
  })

  test('searches by product name', async ({ productsPage }) => {
    await productsPage.search('Keyboard')
    await expect(productsPage.rows).toHaveCount(1)
    await expect(productsPage.byTestId('product-name')).toContainText('Mechanical Keyboard')
  })

  test('searches by SKU', async ({ productsPage }) => {
    await productsPage.search('FUR-2002')
    await expect(productsPage.rows).toHaveCount(1)
    await expect(productsPage.byTestId('product-sku')).toHaveText('FUR-2002')
  })

  test('shows an empty state when nothing matches', async ({ productsPage }) => {
    await productsPage.search('does-not-exist-zzz')
    await expect(productsPage.noResultsRow).toBeVisible()
    await expect(productsPage.rows).toHaveCount(0)
  })

  test('filters by category', async ({ productsPage }) => {
    await productsPage.filterByCategory('Tools')
    const categories = await productsPage.page.getByTestId('product-category').allInnerTexts()
    expect(categories.length).toBeGreaterThan(0)
    for (const c of categories) expect(c).toBe('Tools')
  })

  test('filters by status', async ({ productsPage }) => {
    await productsPage.filterByStatus('Out of Stock')
    const statuses = await productsPage.page.getByTestId('product-status').allInnerTexts()
    for (const s of statuses) expect(s).toBe('Out of Stock')
  })

  test('combines filters and resets them @regression', async ({ productsPage }) => {
    await productsPage.filterByCategory('Electronics')
    await productsPage.filterByStatus('Low Stock')
    const count = await productsPage.getResultsCount()
    expect(count).toBeGreaterThan(0)

    await productsPage.resetFilters()
    expect(await productsPage.getResultsCount()).toBe(25)
  })

  test('sorts by price ascending then descending', async ({ productsPage }) => {
    await productsPage.sortBy('price')
    const ascText = await productsPage.page.getByTestId('product-price').allInnerTexts()
    const asc = ascText.map((t) => parseFloat(t.replace('$', '')))
    const sortedAsc = [...asc].sort((a, b) => a - b)
    expect(asc).toEqual(sortedAsc)

    await productsPage.sortBy('price')
    const descText = await productsPage.page.getByTestId('product-price').allInnerTexts()
    const desc = descText.map((t) => parseFloat(t.replace('$', '')))
    const sortedDesc = [...desc].sort((a, b) => b - a)
    expect(desc).toEqual(sortedDesc)
  })

  test('paginates forward and backward', async ({ productsPage }) => {
    await expect(productsPage.prevButton).toBeDisabled()
    await productsPage.nextPage()
    await expect(productsPage.pageIndicator).toContainText('Page 2 of 5')
    await productsPage.prevPage()
    await expect(productsPage.pageIndicator).toContainText('Page 1 of 5')
  })
})

test.describe('Delete product with confirmation', () => {
  test.beforeEach(async ({ productsPage }) => {
    await productsPage.open()
  })

  test('cancelling keeps the product', async ({ productsPage }) => {
    await productsPage.search('Wireless Mouse')
    await productsPage.clickDeleteForSku('ELE-1001')
    await expect(productsPage.deleteModalTarget).toHaveText('Wireless Mouse')
    await productsPage.cancelDelete()
    await expect(productsPage.deleteModal).toBeHidden()
    await expect(productsPage.rows).toHaveCount(1)
  })

  test('confirming removes the product and shows a toast @regression', async ({ productsPage }) => {
    await productsPage.search('Wireless Mouse')
    await productsPage.clickDeleteForSku('ELE-1001')
    await productsPage.confirmDelete()
    await productsPage.expectToast('Deleted "Wireless Mouse"')
    await expect(productsPage.noResultsRow).toBeVisible()
  })
})
