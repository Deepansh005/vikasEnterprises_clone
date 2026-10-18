import { describe, expect, it } from 'vitest';
import { calculateQuotation } from '../server/quoteMath.js';

describe('calculateQuotation', () => {
  it('calculates line totals, tax, discount, and final total', () => {
    const result = calculateQuotation([{ name: 'Cable Ties', quantity: 3, unitPrice: 10 }, { name: 'Mount', quantity: 2, unitPrice: 7.5 }], 18, 4);
    expect(result.subtotal).toBe(45);
    expect(result.tax).toBe(8.1);
    expect(result.total).toBe(49.1);
  });
  it('rejects invalid quantities and prices', () => {
    expect(() => calculateQuotation([{ quantity: 0, unitPrice: 2 }])).toThrow('Quantity');
    expect(() => calculateQuotation([{ quantity: 1, unitPrice: -1 }])).toThrow('Unit price');
  });
});
