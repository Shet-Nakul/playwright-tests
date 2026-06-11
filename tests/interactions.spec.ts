import { test, expect } from '../fixtures/auth-fixtures'

/**
 * Interactions: drag & drop, slider, stepper and file upload.
 */
test.describe('Interactions', () => {
  test.beforeEach(async ({ interactionsPage }) => {
    await interactionsPage.open()
  })

  test('drags an item from backlog to the restock column @regression', async ({ interactionsPage }) => {
    expect(await interactionsPage.getRestockCount()).toBe(0)
    await interactionsPage.dragItemToRestock('sku-1')
    await expect.poll(() => interactionsPage.getRestockCount()).toBe(1)
    await expect(interactionsPage.restockColumn.locator('[data-item-id="sku-1"]')).toBeVisible()
  })

  test('sets the threshold slider to a specific value', async ({ interactionsPage }) => {
    await interactionsPage.setThreshold(35)
    await expect.poll(() => interactionsPage.getThresholdValue()).toBe(35)
  })

  test('increments and decrements the quantity stepper @smoke', async ({ interactionsPage }) => {
    await interactionsPage.incrementStepper(3)
    expect(await interactionsPage.getStepperValue()).toBe(3)
    await interactionsPage.decrementStepper(1)
    expect(await interactionsPage.getStepperValue()).toBe(2)
  })

  test('does not go below zero on the stepper', async ({ interactionsPage }) => {
    await interactionsPage.decrementStepper(2)
    expect(await interactionsPage.getStepperValue()).toBe(0)
  })

  test('uploads a CSV file and shows file info', async ({ interactionsPage }) => {
    await interactionsPage.uploadFile('inventory.csv', 'sku,qty\nELE-1001,10')
    await expect(interactionsPage.fileInfo).toContainText('inventory.csv')
    await interactionsPage.expectToast('Uploaded inventory.csv')
  })
})
