import type { NewProduct } from '../utils/dataFactory'

/**
 * Static, deterministic product fixtures for assertions that need known values.
 * For randomised data, prefer the helpers in utils/dataFactory.ts.
 */
export const knownProducts = {
  wirelessMouse: { name: 'Wireless Mouse', sku: 'ELE-1001', category: 'Electronics' },
  officeChair: { name: 'Office Chair', sku: 'FUR-2001', category: 'Furniture' },
}

export const validProduct: NewProduct = {
  name: 'Ergonomic Standing Desk',
  sku: 'FUR-9999',
  category: 'Furniture',
  quantity: 50,
  price: 299.99,
  supplier: 'Comfort Living',
  description: 'Height-adjustable standing desk for offices.',
  notify: true,
}

export const invalidProduct: NewProduct = {
  name: 'AB',
  sku: 'bad-sku',
  category: '',
  quantity: -5,
  price: 0,
  supplier: '',
  description: '',
  notify: false,
}
