/**
 * Centralised credentials for the demo app.
 * In a real project these would come from environment variables or a secrets vault.
 */
export interface Credentials {
  username: string
  password: string
}

export const users = {
  admin: { username: 'admin', password: 'admin123' } as Credentials,
  manager: { username: 'manager', password: 'manager123' } as Credentials,
  viewer: { username: 'viewer', password: 'viewer123' } as Credentials,
  invalid: { username: 'admin', password: 'wrongpass' } as Credentials,
}

// Path where the authenticated browser storage state is persisted by global-setup.
export const STORAGE_STATE = '.auth/admin.json'
