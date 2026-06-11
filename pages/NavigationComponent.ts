import type { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * Page object for the persistent app shell (sidebar + topbar).
 * Provides cross-page navigation and the logout action.
 */
export class NavigationComponent extends BasePage {
  readonly sidebar: Locator
  readonly currentUser: Locator
  readonly logoutButton: Locator

  private readonly navTestIds: Record<string, string> = {
    dashboard: 'nav-dashboard',
    products: 'nav-products',
    addProduct: 'nav-add-product',
    suppliers: 'nav-suppliers',
    orders: 'nav-orders',
    interactions: 'nav-interactions',
    dynamic: 'nav-dynamic',
    frames: 'nav-frames',
  }

  constructor(page: Page) {
    super(page)
    this.sidebar = page.getByTestId('sidebar')
    this.currentUser = page.getByTestId('current-user')
    this.logoutButton = page.getByTestId('logout-button')
  }

  /** Click a sidebar item by logical name. */
  async navigateTo(section: keyof NavigationComponent['navTestIds'] | string): Promise<void> {
    const testid = this.navTestIds[section]
    if (!testid) throw new Error(`Unknown navigation section: ${section}`)
    await this.byTestId(testid).click()
  }

  async getCurrentUser(): Promise<string> {
    return (await this.currentUser.textContent())?.trim() ?? ''
  }

  async logout(): Promise<void> {
    await this.logoutButton.click()
  }
}
