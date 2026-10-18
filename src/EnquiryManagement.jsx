import { useEffect, useState } from 'react';
import { api } from './api';

const statuses = ['Pending', 'In Review', 'Quotation Prepared', 'Accepted', 'Rejected', 'Closed'];

function Banner({ title }) {
  return <div className="page-banner"><div className="site-width"><h1>{title}</h1></div></div>;
}

function ErrorState({ message, onBack }) {
  return <main className="admin-page site-width"><div className="admin-error"><h2>Unable to load enquiry</h2><p>{message}</p><a className="action-link" href="/admin/enquiries/" onClick={onBack}>Back to enquiries</a></div></main>;
}

function QuotationEditor({ enquiry, existingQuote, onCreated }) {
  const [lines, setLines] = useState(() => (existingQuote?.items || enquiry.items || []).map((item) => ({ ...item, unitPrice: item.unitPrice ?? '' })));
  const [taxRate, setTaxRate] = useState(String(existingQuote?.taxRate ?? 0));
  const [discount, setDiscount] = useState(String(existingQuote?.discount ?? 0));
  const [validDays, setValidDays] = useState('30');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const subtotal = lines.reduce((sum, item) => sum + Number(item.quantity) * (Number(item.unitPrice) || 0), 0);
  const tax = subtotal * (Number(taxRate) || 0) / 100;
  const total = Math.max(0, subtotal + tax - (Number(discount) || 0));

  async function saveQuote(event) {
    event.preventDefault();
    if (lines.some((item) => !Number.isFinite(Number(item.unitPrice)) || Number(item.unitPrice) < 0)) {
      setError('Enter a valid non-negative unit price for every product.');
      return;
    }
    setSaving(true);
    try {
      const quote = await api.createQuotation({ enquiryId: enquiry.id, items: lines.map((item) => ({ name: item.name, sku: item.sku, quantity: Number(item.quantity), unitPrice: Number(item.unitPrice) })), taxRate: Number(taxRate), discount: Number(discount), validDays: Number(validDays) });
      setError('');
      onCreated(quote);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return <form className="quotation-editor" onSubmit={saveQuote}>
    <h3>Prepare demonstration quotation</h3>
    {lines.length === 0 && <p className="muted">This enquiry has no requested products.</p>}
    {lines.map((item, index) => <label key={`${item.productId || item.name}-${index}`}>{item.name} × {item.quantity}<input type="number" min="0" step="0.01" required value={item.unitPrice} onChange={(event) => setLines((current) => current.map((line, lineIndex) => lineIndex === index ? { ...line, unitPrice: event.target.value } : line))} placeholder="Unit price" /></label>)}
    <div className="form-two"><label>Tax %<input type="number" min="0" max="100" step="0.01" value={taxRate} onChange={(event) => setTaxRate(event.target.value)} /></label><label>Discount<input type="number" min="0" step="0.01" value={discount} onChange={(event) => setDiscount(event.target.value)} /></label></div>
    <label>Valid for days<input type="number" min="1" max="365" value={validDays} onChange={(event) => setValidDays(event.target.value)} /></label>
    <p className="quote-total">Subtotal: {subtotal.toFixed(2)} · Tax: {tax.toFixed(2)} · Total: {total.toFixed(2)}</p>
    <button className="primary-action" type="submit" disabled={saving || lines.length === 0}>{saving ? 'Saving...' : 'Save Quotation'}</button>
    {error && <p className="form-error">{error}</p>}
  </form>;
}

export function EnquiryManagementPage({ records, onStatus }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [date, setDate] = useState('');
  const lifecycle = statuses;
  const filtered = records.filter((record) => {
    const haystack = `${record.reference} ${record.customer.firstName} ${record.customer.lastName} ${record.customer.business} ${record.customer.email}`.toLowerCase();
    return (!query || haystack.includes(query.toLowerCase())) && (status === 'All' || record.status === status) && (!date || record.submittedAt.slice(0, 10) === date);
  }).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  const counts = lifecycle.reduce((result, value) => ({ ...result, [value]: records.filter((record) => record.status === value).length }), {});

  return <><Banner title="Demo Enquiry Dashboard" /><main className="admin-page site-width"><div className="demo-note">Demo interface only. Records are stored in the local SQLite database; there is no authentication or live company backend.</div><div className="stats-grid stats-many"><div><strong>{records.length}</strong><span>Total enquiries</span></div>{lifecycle.map((value) => <div key={value}><strong>{counts[value]}</strong><span>{value}</span></div>)}</div><div className="admin-toolbar"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search reference or customer" /><select value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option>{lifecycle.map((value) => <option key={value}>{value}</option>)}</select><input type="date" value={date} onChange={(event) => setDate(event.target.value)} aria-label="Filter by date" /></div><div className="admin-table">{filtered.length === 0 ? <div className="empty-state"><h3>No enquiries found</h3><p>Submitted enquiries will appear here.</p></div> : filtered.map((record) => <a className="admin-row" href={`/admin/enquiries/${encodeURIComponent(record.id)}/`} key={record.id}><strong>{record.reference}</strong><span>{record.customer.firstName} {record.customer.lastName}<br />{record.customer.business}</span><span>{record.items.length} products</span><span className={`status status-${record.status.toLowerCase().replaceAll(' ', '-')}`}>{record.status}</span><time>{new Date(record.submittedAt).toLocaleDateString()}</time></a>)}</div></main></>;
}

export function EnquiryDetailPage({ enquiryId, onStatus, onRefresh }) {
  const [enquiry, setEnquiry] = useState(null);
  const [quote, setQuote] = useState(null);
  const [state, setState] = useState('loading');
  const [message, setMessage] = useState('');
  const [statusSaving, setStatusSaving] = useState(false);

  useEffect(() => {
    let active = true;
    setState('loading');
    Promise.all([api.enquiry(enquiryId), api.quotation(enquiryId).catch(() => null)]).then(([loadedEnquiry, loadedQuote]) => {
      if (!active) return;
      setEnquiry(loadedEnquiry);
      setQuote(loadedQuote && Object.prototype.hasOwnProperty.call(loadedQuote, 'quotation') ? loadedQuote.quotation : loadedQuote);
      setState('ready');
    }).catch((error) => {
      if (!active) return;
      setMessage(error.message);
      setState(error.message === 'Enquiry not found.' ? 'not-found' : 'error');
    });
    return () => { active = false; };
  }, [enquiryId]);

  async function updateDetailStatus(nextStatus) {
    setStatusSaving(true);
    try {
      const updated = await api.updateEnquiryStatus(enquiry.id, nextStatus);
      setEnquiry(updated);
      setMessage('Status updated successfully.');
      onStatus(updated);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setStatusSaving(false);
    }
  }

  if (state === 'loading') return <><Banner title="Enquiry Details" /><main className="admin-page site-width"><div className="loading-state">Loading enquiry details...</div></main></>;
  if (state === 'not-found') return <><Banner title="Enquiry Not Found" /><ErrorState message="No saved enquiry matches this ID or reference." /></>;
  if (state === 'error' || !enquiry) return <><Banner title="Enquiry Details" /><ErrorState message={message || 'The enquiry could not be loaded.'} /></>;

  return <><Banner title="Enquiry Details" /><main className="admin-page site-width"><div className="detail-toolbar"><a className="text-action" href="/admin/enquiries/">← Back to enquiries</a><span className={`status status-${enquiry.status.toLowerCase().replaceAll(' ', '-')}`}>{enquiry.status}</span></div>{message && <p className={message === 'Status updated successfully.' ? 'form-success' : 'form-error'}>{message}</p>}<header className="detail-header"><div><p className="eyebrow">{enquiry.reference}</p><h2>{enquiry.customer.business || 'Unnamed business'}</h2><p>Submitted {new Date(enquiry.submittedAt).toLocaleString()}</p></div><div className="detail-actions"><select value={enquiry.status} disabled={statusSaving} onChange={(event) => updateDetailStatus(event.target.value)} aria-label="Update enquiry status">{statuses.map((value) => <option key={value}>{value}</option>)}</select><a className="action-link" href="#quotation">Prepare Quotation</a>{quote ? <a className="action-link" href={`/api/quotations/${quote.id}/pdf`} target="_blank" rel="noreferrer">Download Quotation</a> : <button className="secondary-action" type="button" disabled>Download Quotation</button>}</div></header><section className="detail-section"><h3>Customer information</h3><div className="detail-grid"><p><strong>Contact</strong><br />{enquiry.customer.firstName || '-'} {enquiry.customer.lastName || '-'}</p><p><strong>Business</strong><br />{enquiry.customer.business || '-'}</p><p><strong>Email</strong><br /><a href={`mailto:${enquiry.customer.email}`}>{enquiry.customer.email || '-'}</a></p><p><strong>Phone</strong><br /><a href={`tel:${enquiry.customer.phone}`}>{enquiry.customer.phone || '-'}</a></p></div><p><strong>Requirements</strong><br />{enquiry.customer.message || 'No additional requirements provided.'}</p></section><section className="detail-section"><h3>Requested products</h3>{enquiry.items.length === 0 ? <p className="muted">No products were recorded for this enquiry.</p> : <div className="detail-products">{enquiry.items.map((item, index) => <div className="detail-product-row" key={`${item.productId || item.name}-${index}`}><strong>{item.name}</strong><span>{item.sku || 'No SKU recorded'}</span><span>{item.category || 'Uncategorised'}</span><span>Quantity: {item.quantity}</span>{quote?.items?.[index] ? <span>Unit: {quote.items[index].unitPrice.toFixed(2)} · Line: {quote.items[index].lineTotal.toFixed(2)}</span> : <span>Price: Not recorded</span>}</div>)}</div>}</section><section className="detail-section" id="quotation"><h3>Quotation</h3>{quote ? <div className="saved-quote"><p><strong>{quote.reference}</strong> · Date {quote.quotationDate} · Valid until {quote.validUntil}</p><p>Subtotal: {quote.subtotal.toFixed(2)} · Tax: {quote.tax.toFixed(2)} · Discount: {quote.discount.toFixed(2)} · Total: {quote.total.toFixed(2)}</p><a className="action-link" href={`/api/quotations/${quote.id}/pdf`} target="_blank" rel="noreferrer">Download demonstration PDF</a></div> : <QuotationEditor enquiry={enquiry} onCreated={(created) => { setQuote(created); setEnquiry((current) => ({ ...current, status: 'Quotation Prepared' })); onRefresh(); }} />}</section><section className="detail-section"><h3>Enquiry timeline</h3>{enquiry.history.length === 0 ? <p className="muted">No status history is recorded.</p> : <div className="timeline">{enquiry.history.map((entry, index) => <p key={`${entry.status}-${entry.at}-${index}`}><strong>{entry.status}</strong><br />{new Date(entry.at).toLocaleString()}</p>)}</div>}</section></main></>;
}
