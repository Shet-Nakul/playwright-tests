import { test, expect } from '../fixtures/auth-fixtures'

/**
 * Frames, new tabs/windows and shadow DOM.
 */
test.describe('Frames, tabs and shadow DOM', () => {
  test.beforeEach(async ({ framesPage }) => {
    await framesPage.open()
  })

  test('interacts with elements inside an iframe @regression', async ({ framesPage }) => {
    await framesPage.typeInIframe('Reorder soon')
    const message = await framesPage.saveInIframe()
    expect(message).toBe('Saved inside iframe!')
  })

  test('opens a new tab when clicking the external link @smoke', async ({ framesPage, context }) => {
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      framesPage.openNewTabLink.click(),
    ])
    await newPage.waitForLoadState('domcontentloaded')
    expect(newPage.url()).toContain('playwright.dev')
    await newPage.close()
  })

  test('interacts with elements inside shadow DOM', async ({ framesPage }) => {
    await expect(framesPage.shadowCount()).toHaveText('0')
    await framesPage.shadowIncrement().click()
    await framesPage.shadowIncrement().click()
    await expect(framesPage.shadowCount()).toHaveText('2')
  })
})
