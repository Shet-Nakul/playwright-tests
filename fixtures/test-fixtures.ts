import { test as base } from '@playwright/test'
import {
  LoginPage,
  NavigationComponent,
  DashboardPage,
  ProductsPage,
  AddProductPage,
  InteractionsPage,
  DynamicContentPage,
  FramesPage,
} from '../pages'

/**
 * Custom fixtures that inject ready-to-use page objects into every test.
 * This keeps specs focused on behaviour instead of wiring up page objects.
 *
 * Usage:
 *   import { test, expect } from '../fixtures/test-fixtures'
 *   test('...', async ({ productsPage }) => { ... })
 */
interface PageObjects {
  loginPage: LoginPage
  nav: NavigationComponent
  dashboardPage: DashboardPage
  productsPage: ProductsPage
  addProductPage: AddProductPage
  interactionsPage: InteractionsPage
  dynamicPage: DynamicContentPage
  framesPage: FramesPage
}

export const test = base.extend<PageObjects>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page))
  },
  nav: async ({ page }, use) => {
    await use(new NavigationComponent(page))
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page))
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page))
  },
  addProductPage: async ({ page }, use) => {
    await use(new AddProductPage(page))
  },
  interactionsPage: async ({ page }, use) => {
    await use(new InteractionsPage(page))
  },
  dynamicPage: async ({ page }, use) => {
    await use(new DynamicContentPage(page))
  },
  framesPage: async ({ page }, use) => {
    await use(new FramesPage(page))
  },
})

export { expect } from '@playwright/test'
