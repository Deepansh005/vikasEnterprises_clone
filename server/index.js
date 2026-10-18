import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { randomUUID } from 'node:crypto';
import PDFDocument from 'pdfkit';
import database from './db.js';
import { calculateQuotation } from './quoteMath.js';

const app = express();
const port = Number(process.env.PORT || 8787);
const statuses = ['Pending', 'In Review', 'Quotation Prepared', 'Accepted', 'Rejected', 'Closed'];
app.use(express.json({ limit: '200kb' }));

const now = () => new Date().toISOString();
const reference = (prefix) => `${prefix}-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${randomUUID().slice(0, 6).toUpperCase()}`;
const validEmail = (value) => /^\S+@\S+\.\S+$/.test(value);
function apiError(response, status, message) { return response.status(status).json({ error: message }); }

function productFromRow(row) { return { ...row, specifications: JSON.parse(row.specifications), archived: Boolean(row.archived) }; }
function enquiryFromRow(row) {
  if (!row) return null;
  const items = database.prepare('SELECT product_id AS productId, product_name AS name, category, image, sku, quantity FROM enquiry_items WHERE enquiry_id = ?').all(row.id);
  const history = database.prepare('SELECT status, changed_at AS at FROM enquiry_history WHERE enquiry_id = ? ORDER BY id').all(row.id);
  return { id: row.id, reference: row.reference, submittedAt: row.submitted_at, status: row.status, customer: { firstName: row.first_name, lastName: row.last_name, business: row.business, phone: row.phone, email: row.email, message: row.message }, items, history };
}

app.get('/api/health', (_request, response) => response.json({ ok: true, database: 'sqlite' }));
app.get('/api/products', (request, response) => {
  const includeArchived = request.query.includeArchived === 'true';
  const rows = database.prepare(`SELECT * FROM products ${includeArchived ? '' : 'WHERE archived = 0'} ORDER BY category, name`).all();
  response.json(rows.map(productFromRow));
});
app.post('/api/products', (request, response) => {
  const { name, category, categoryPath, specifications = [], image = '', sku = '' } = request.body || {};
  if (!name?.trim() || !category?.trim() || !categoryPath?.trim() || !Array.isArray(specifications)) return apiError(response, 400, 'Name, category, categoryPath, and specifications are required.');
  const timestamp = now();
  const id = `demo-${randomUUID()}`;
  database.prepare('INSERT INTO products (id, name, category, category_path, specifications, image, sku, source, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(id, name.trim(), category.trim(), categoryPath.trim(), JSON.stringify(specifications), image, sku?.trim() || null, 'demonstration-admin', timestamp, timestamp);
  response.status(201).json(productFromRow(database.prepare('SELECT * FROM products WHERE id = ?').get(id)));
});
app.patch('/api/products/:id', (request, response) => {
  const current = database.prepare('SELECT * FROM products WHERE id = ?').get(request.params.id);
  if (!current) return apiError(response, 404, 'Product not found.');
  const body = request.body || {};
  const name = body.name === undefined ? current.name : String(body.name).trim();
  const category = body.category === undefined ? current.category : String(body.category).trim();
  const specifications = body.specifications === undefined ? JSON.parse(current.specifications) : body.specifications;
  if (!name || !category || !Array.isArray(specifications)) return apiError(response, 400, 'Name, category, and specifications are required.');
  const archived = body.archived === undefined ? current.archived : body.archived ? 1 : 0;
  database.prepare('UPDATE products SET name = ?, category = ?, specifications = ?, sku = ?, archived = ?, updated_at = ? WHERE id = ?').run(name, category, JSON.stringify(specifications), body.sku === undefined ? current.sku : String(body.sku).trim() || null, archived, now(), current.id);
  response.json(productFromRow(database.prepare('SELECT * FROM products WHERE id = ?').get(current.id)));
});

app.get('/api/enquiries', (request, response) => {
  const rows = database.prepare('SELECT * FROM enquiries ORDER BY submitted_at DESC').all();
  response.json(rows.map(enquiryFromRow));
});
app.get('/api/enquiries/:id', (request, response) => {
  const row = database.prepare('SELECT * FROM enquiries WHERE id = ? OR reference = ?').get(request.params.id, request.params.id);
  if (!row) return apiError(response, 404, 'Enquiry not found.');
  response.json(enquiryFromRow(row));
});
app.post('/api/enquiries', (request, response) => {
  const { customer, items } = request.body || {};
  const required = ['firstName', 'lastName', 'business', 'phone', 'email', 'message'];
  if (!customer || required.some((field) => !String(customer[field] || '').trim())) return apiError(response, 400, 'All customer fields are required.');
  if (!validEmail(customer.email)) return apiError(response, 400, 'A valid email address is required.');
  if (!Array.isArray(items) || items.length === 0) return apiError(response, 400, 'At least one product is required.');
  if (items.some((item) => !item.productId || !Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1)) return apiError(response, 400, 'Each enquiry item needs a valid product and positive quantity.');
  const timestamp = now();
  const enquiryId = randomUUID();
  const enquiryReference = reference('RFQ');
  const create = database.transaction(() => {
    database.prepare('INSERT INTO enquiries (id, reference, submitted_at, status, first_name, last_name, business, phone, email, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(enquiryId, enquiryReference, timestamp, 'Pending', customer.firstName.trim(), customer.lastName.trim(), customer.business.trim(), customer.phone.trim(), customer.email.trim(), customer.message.trim());
    const insertItem = database.prepare('INSERT INTO enquiry_items (enquiry_id, product_id, product_name, category, image, sku, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)');
    items.forEach((item) => {
      const product = database.prepare('SELECT * FROM products WHERE (id = ? OR name = ?) AND archived = 0').get(item.productId, item.name);
      if (!product) throw new Error(`Product ${item.productId} is unavailable.`);
      insertItem.run(enquiryId, product.id, product.name, product.category, product.image, product.sku, Number(item.quantity));
    });
    database.prepare('INSERT INTO enquiry_history (enquiry_id, status, changed_at) VALUES (?, ?, ?)').run(enquiryId, 'Pending', timestamp);
  });
  try { create(); } catch (error) { return apiError(response, 400, error.message); }
  response.status(201).json(enquiryFromRow(database.prepare('SELECT * FROM enquiries WHERE id = ?').get(enquiryId)));
});
app.patch('/api/enquiries/:id/status', (request, response) => {
  const nextStatus = request.body?.status;
  if (!statuses.includes(nextStatus)) return apiError(response, 400, `Status must be one of: ${statuses.join(', ')}.`);
  const row = database.prepare('SELECT * FROM enquiries WHERE id = ? OR reference = ?').get(request.params.id, request.params.id);
  if (!row) return apiError(response, 404, 'Enquiry not found.');
  const timestamp = now();
  database.transaction(() => { database.prepare('UPDATE enquiries SET status = ? WHERE id = ?').run(nextStatus, row.id); database.prepare('INSERT INTO enquiry_history (enquiry_id, status, changed_at) VALUES (?, ?, ?)').run(row.id, nextStatus, timestamp); })();
  response.json(enquiryFromRow(database.prepare('SELECT * FROM enquiries WHERE id = ?').get(row.id)));
});

app.get('/api/quotations/:enquiryId', (request, response) => {
  const quote = database.prepare('SELECT * FROM quotations WHERE enquiry_id = ?').get(request.params.enquiryId);
  if (!quote) return response.json({ quotation: null });
  const items = database.prepare('SELECT product_name AS name, sku, quantity, unit_price AS unitPrice FROM quotation_items WHERE quotation_id = ?').all(quote.id);
  response.json({ id: quote.id, enquiryId: quote.enquiry_id, reference: quote.reference, quotationDate: quote.quotation_date, validUntil: quote.valid_until, ...calculateQuotation(items, quote.tax_rate, quote.discount) });
});
app.post('/api/quotations', (request, response) => {
  const { enquiryId, items, taxRate = 0, discount = 0, validDays = 30 } = request.body || {};
  const enquiry = database.prepare('SELECT * FROM enquiries WHERE id = ? OR reference = ?').get(enquiryId, enquiryId);
  if (!enquiry) return apiError(response, 404, 'Enquiry not found.');
  if (!Array.isArray(items) || !items.length) return apiError(response, 400, 'Quotation needs at least one line item.');
  let calculation;
  try { calculation = calculateQuotation(items, taxRate, discount); } catch (error) { return apiError(response, 400, error.message); }
  const days = Number(validDays);
  if (!Number.isInteger(days) || days < 1 || days > 365) return apiError(response, 400, 'Validity must be between 1 and 365 days.');
  const timestamp = now();
  const id = randomUUID();
  const quotationReference = reference('QUO');
  const quotationDate = timestamp.slice(0, 10);
  const validUntil = new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
  database.transaction(() => {
    database.prepare('INSERT INTO quotations (id, enquiry_id, reference, quotation_date, valid_until, tax_rate, discount, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(id, enquiry.id, quotationReference, quotationDate, validUntil, Number(taxRate), Number(discount), timestamp, timestamp);
    const insert = database.prepare('INSERT INTO quotation_items (quotation_id, product_name, sku, quantity, unit_price) VALUES (?, ?, ?, ?, ?)');
    calculation.items.forEach((item) => insert.run(id, item.name, item.sku || null, item.quantity, item.unitPrice));
    database.prepare('UPDATE enquiries SET status = ? WHERE id = ?').run('Quotation Prepared', enquiry.id);
    database.prepare('INSERT INTO enquiry_history (enquiry_id, status, changed_at) VALUES (?, ?, ?)').run(enquiry.id, 'Quotation Prepared', timestamp);
  })();
  response.status(201).json({ id, enquiryId: enquiry.id, reference: quotationReference, quotationDate, validUntil, ...calculation });
});
app.get('/api/quotations/:id/pdf', (request, response) => {
  const quote = database.prepare('SELECT * FROM quotations WHERE id = ? OR reference = ?').get(request.params.id, request.params.id);
  if (!quote) return apiError(response, 404, 'Quotation not found.');
  const enquiry = database.prepare('SELECT * FROM enquiries WHERE id = ?').get(quote.enquiry_id);
  const items = database.prepare('SELECT product_name AS name, sku, quantity, unit_price AS unitPrice FROM quotation_items WHERE quotation_id = ?').all(quote.id);
  const calculation = calculateQuotation(items, quote.tax_rate, quote.discount);
  response.setHeader('Content-Type', 'application/pdf');
  response.setHeader('Content-Disposition', `attachment; filename="${quote.reference}.pdf"`);
  const document = new PDFDocument({ size: 'A4', margin: 48, info: { Title: `${quote.reference} - Demonstration Quotation`, Author: 'Vikas Enterprises' } });
  document.pipe(response);

  const colors = { navy: '#17324d', blue: '#00a8ed', ink: '#263746', muted: '#617180', line: '#d9e1e7', pale: '#f1f6f9', warning: '#fff3d6' };
  const pageWidth = document.page.width - document.page.margins.left - document.page.margins.right;
  const right = document.page.width - document.page.margins.right;
  const money = (value) => Number(value).toFixed(2);
  const drawRule = (y, color = colors.line) => document.moveTo(document.page.margins.left, y).lineTo(right, y).strokeColor(color).lineWidth(0.7).stroke();
  const drawCell = (text, x, y, width, options = {}) => {
    const cursor = document.y;
    document.font(options.font || 'Helvetica').fontSize(options.size || 9).fillColor(options.color || colors.ink).text(String(text ?? ''), x, y, { width, align: options.align || 'left', lineGap: 1 });
    document.y = cursor;
  };

  document.rect(0, 0, document.page.width, 92).fill(colors.navy);
  const logoPath = path.resolve('public/assets/new-vikas-enterprises-logo.jpg');
  if (fs.existsSync(logoPath)) document.image(logoPath, 48, 16, { fit: [220, 60], align: 'left', valign: 'center' });
  else document.fillColor('#ffffff').font('Helvetica-Bold').fontSize(23).text('VIKAS ENTERPRISES', 48, 25);
  document.fillColor('#b9d8e8').font('Helvetica').fontSize(9).text('WIRING ACCESSORIES | INDUSTRIAL CONSUMABLES', 50, 75);
  document.fillColor('#ffffff').font('Helvetica-Bold').fontSize(10).text('DEMONSTRATION QUOTATION', right - 190, 29, { width: 190, align: 'right' });
  document.fillColor('#dcebf2').font('Helvetica').fontSize(8).text('NOT A COMMERCIAL OFFER', right - 190, 48, { width: 190, align: 'right' });
  document.fillColor(colors.ink);
  document.y = 122;

  document.font('Helvetica-Bold').fontSize(20).fillColor(colors.navy).text('Quotation');
  document.moveDown(0.35);
  drawRule(document.y, colors.blue);
  document.moveDown(0.85);

  const metaY = document.y;
  drawCell('QUOTATION REFERENCE', 48, metaY, 150, { size: 8, font: 'Helvetica-Bold', color: colors.muted });
  drawCell(quote.reference, 48, metaY + 14, 190, { size: 11, font: 'Helvetica-Bold', color: colors.navy });
  drawCell('QUOTATION DATE', 270, metaY, 120, { size: 8, font: 'Helvetica-Bold', color: colors.muted });
  drawCell(quote.quotation_date, 270, metaY + 14, 120, { size: 11, font: 'Helvetica-Bold', color: colors.navy });
  drawCell('VALID UNTIL', right - 130, metaY, 130, { size: 8, font: 'Helvetica-Bold', color: colors.muted, align: 'right' });
  drawCell(quote.valid_until, right - 130, metaY + 14, 130, { size: 11, font: 'Helvetica-Bold', color: colors.navy, align: 'right' });
  document.y = metaY + 55;

  document.rect(48, document.y, pageWidth, 91).fill(colors.pale);
  const partyY = document.y + 15;
  drawCell('FROM', 63, partyY, 220, { size: 8, font: 'Helvetica-Bold', color: colors.blue });
  drawCell('Vikas Enterprises', 63, partyY + 17, 220, { size: 11, font: 'Helvetica-Bold', color: colors.navy });
  drawCell('10292, 1st Floor, Tokri Walan, Library Road, Azad Market, Delhi-110006', 63, partyY + 34, 220, { size: 8, color: colors.muted });
  drawCell('TO', 330, partyY, 210, { size: 8, font: 'Helvetica-Bold', color: colors.blue });
  drawCell(`${enquiry?.first_name || ''} ${enquiry?.last_name || ''}`.trim() || 'Customer', 330, partyY + 17, 210, { size: 11, font: 'Helvetica-Bold', color: colors.navy });
  drawCell(enquiry?.business || 'Business name not provided', 330, partyY + 34, 210, { size: 8, color: colors.muted });
  drawCell(`${enquiry?.email || ''}  |  ${enquiry?.phone || ''}`, 330, partyY + 50, 210, { size: 8, color: colors.muted });
  document.y += 115;

  document.font('Helvetica-Bold').fontSize(11).fillColor(colors.navy).text('Quotation Details');
  document.moveDown(0.45);
  const tableTop = document.y;
  const columns = [{ label: '#', x: 48, width: 25 }, { label: 'PRODUCT / DESCRIPTION', x: 73, width: 238 }, { label: 'SKU', x: 311, width: 70 }, { label: 'QTY', x: 381, width: 42 }, { label: 'UNIT PRICE', x: 423, width: 65 }, { label: 'LINE TOTAL', x: 488, width: 70 }];
  document.rect(48, tableTop, pageWidth, 25).fill(colors.navy);
  columns.forEach((column) => drawCell(column.label, column.x, tableTop + 8, column.width, { size: 7, font: 'Helvetica-Bold', color: '#ffffff', align: column.label === 'QTY' || column.label.includes('PRICE') || column.label.includes('TOTAL') ? 'right' : 'left' }));
  let rowY = tableTop + 25;
  calculation.items.forEach((item, index) => {
    const rowHeight = 34;
    if (index % 2 === 0) document.rect(48, rowY, pageWidth, rowHeight).fill('#f7fafc');
    drawCell(index + 1, 48, rowY + 11, 25, { size: 8, color: colors.muted });
    drawCell(item.name, 73, rowY + 8, 238, { size: 9, font: 'Helvetica-Bold', color: colors.ink });
    drawCell(item.sku || '—', 311, rowY + 11, 70, { size: 8, color: colors.muted });
    drawCell(item.quantity, 381, rowY + 11, 42, { size: 9, align: 'right' });
    drawCell(money(item.unitPrice), 423, rowY + 11, 65, { size: 9, align: 'right' });
    drawCell(money(item.lineTotal), 488, rowY + 11, 70, { size: 9, font: 'Helvetica-Bold', align: 'right' });
    drawRule(rowY + rowHeight);
    rowY += rowHeight;
  });
  if (!calculation.items.length) drawCell('No products recorded for this quotation.', 73, rowY + 12, 485, { size: 9, color: colors.muted });
  document.y = rowY + 24;

  const totalsX = 355;
  const totalsWidth = 203;
  document.rect(totalsX, document.y, totalsWidth, 92).fill(colors.pale);
  drawCell('SUBTOTAL', totalsX + 14, document.y + 13, 105, { size: 9, color: colors.muted });
  drawCell(money(calculation.subtotal), totalsX + 122, document.y + 13, 65, { size: 9, align: 'right' });
  drawCell(`TAX (${money(calculation.taxRate)}%)`, totalsX + 14, document.y + 32, 105, { size: 9, color: colors.muted });
  drawCell(money(calculation.tax), totalsX + 122, document.y + 32, 65, { size: 9, align: 'right' });
  drawCell('DISCOUNT', totalsX + 14, document.y + 51, 105, { size: 9, color: colors.muted });
  drawCell(money(calculation.discount), totalsX + 122, document.y + 51, 65, { size: 9, align: 'right' });
  document.rect(totalsX, document.y + 70, totalsWidth, 22).fill(colors.blue);
  drawCell('TOTAL', totalsX + 14, document.y + 77, 105, { size: 10, font: 'Helvetica-Bold', color: '#ffffff' });
  drawCell(money(calculation.total), totalsX + 122, document.y + 77, 65, { size: 10, font: 'Helvetica-Bold', color: '#ffffff', align: 'right' });
  document.y += 120;

  document.font('Helvetica-Bold').fontSize(10).fillColor(colors.navy).text('Notes and Terms');
  document.moveDown(0.35);
  document.rect(48, document.y, pageWidth, 63).fill(colors.warning);
  drawCell('This document is generated for demonstration purposes only and is not an authorised commercial offer.', 62, document.y + 12, pageWidth - 28, { size: 9, font: 'Helvetica-Bold', color: colors.ink });
  drawCell('Prices, taxes, validity, availability, delivery, and other commercial terms require confirmation through an authorised business process.', 62, document.y + 31, pageWidth - 28, { size: 8, color: colors.muted });
  document.y += 83;
  drawCell('Vikas Enterprises  |  +91-9213811070  |  info@vikasenterprises.org', 48, document.y, pageWidth, { size: 8, color: colors.muted, align: 'center' });
  document.end();
});

const distPath = path.resolve('dist');
if (fs.existsSync(distPath)) { app.use(express.static(distPath)); app.use((_request, response) => response.sendFile(path.join(distPath, 'index.html'))); }
export default app;

if (!process.env.VERCEL) {
  app.listen(port, () => console.log(`TradeDesk API listening on http://localhost:${port}`));
}
