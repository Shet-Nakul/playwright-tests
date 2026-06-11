import { test as base, expect } from './test-fixtures'
import { STORAGE_STATE } from '../data/users'

/**
 * Authenticated test variant: reuses the storage state captured in global-setup
 * so the test starts already logged in as the admin user.
 *
 * Usage:
 *   import { test, expect } from '../fixtures/auth-fixtures'
 */
export const test = base.extend({
  storageState: async ({}, use) => {
    await use(STORAGE_STATE)
  },
})

export { expect }
