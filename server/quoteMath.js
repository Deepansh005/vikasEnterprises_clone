export function calculateQuotation(items, taxRate = 0, discount = 0) {
  const normalizedItems = items.map((item) => {
    const quantity = Number(item.quantity);
    const unitPrice = Number(item.unitPrice);
    if (!Number.isInteger(quantity) || quantity < 1) throw new Error('Quantity must be a positive integer.');
    if (!Number.isFinite(unitPrice) || unitPrice < 0) throw new Error('Unit price must be a non-negative number.');
    return { ...item, quantity, unitPrice, lineTotal: Number((quantity * unitPrice).toFixed(2)) };
  });
  const normalizedTax = Number(taxRate);
  const normalizedDiscount = Number(discount);
  if (!Number.isFinite(normalizedTax) || normalizedTax < 0 || normalizedTax > 100) throw new Error('Tax rate must be between 0 and 100.');
  if (!Number.isFinite(normalizedDiscount) || normalizedDiscount < 0) throw new Error('Discount must be a non-negative number.');
  const subtotal = Number(normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2));
  const tax = Number((subtotal * normalizedTax / 100).toFixed(2));
  const total = Number(Math.max(0, subtotal + tax - normalizedDiscount).toFixed(2));
  return { items: normalizedItems, subtotal, taxRate: normalizedTax, tax, discount: normalizedDiscount, total };
}
