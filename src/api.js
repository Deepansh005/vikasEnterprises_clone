async function request(path, options = {}) {
  const response = await fetch(path, { headers: { 'Content-Type': 'application/json', ...options.headers }, ...options });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'The local API request failed.');
  return payload;
}

export const api = {
  products: (includeArchived = false) => request(`/api/products${includeArchived ? '?includeArchived=true' : ''}`),
  enquiries: () => request('/api/enquiries'),
  enquiry: (id) => request(`/api/enquiries/${encodeURIComponent(id)}`),
  submitEnquiry: (payload) => request('/api/enquiries', { method: 'POST', body: JSON.stringify(payload) }),
  updateEnquiryStatus: (id, status) => request(`/api/enquiries/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  createQuotation: (payload) => request('/api/quotations', { method: 'POST', body: JSON.stringify(payload) }),
  quotation: (id) => request(`/api/quotations/${encodeURIComponent(id)}`),
  archiveProduct: (id, archived) => request(`/api/products/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify({ archived }) }),
  updateProduct: (id, payload) => request(`/api/products/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  createProduct: (payload) => request('/api/products', { method: 'POST', body: JSON.stringify(payload) }),
};
