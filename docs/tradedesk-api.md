# TradeDesk Demo API

The quotation management workflow uses a local Express API backed by SQLite. It is a demonstration system only: it has no authentication, email delivery, multi-user controls, or production security guarantees.

## Run

```bash
npm install
npm run server
npm run dev
```

The API listens on `http://localhost:8787`; Vite proxies `/api` requests during development. `npm run dev:full` starts both processes. SQLite is stored at `data/tradedesk.sqlite` and can be redirected with `DB_PATH`.

## Endpoints

- `GET /api/health` checks the API/database.
- `GET /api/products?includeArchived=true` lists catalogue and optional archived products.
- `POST /api/products` creates a demonstration product.
- `PATCH /api/products/:id` edits supported fields or archives/restores a product.
- `GET /api/enquiries` lists saved enquiries with customer, product snapshots, status, and history.
- `GET /api/enquiries/:id` retrieves an enquiry by UUID or RFQ reference.
- `POST /api/enquiries` validates customer fields and active product IDs, then creates a Pending RFQ.
- `PATCH /api/enquiries/:id/status` accepts Pending, In Review, Quotation Prepared, Accepted, Rejected, or Closed.
- `POST /api/quotations` creates a quotation with validated unit prices, tax, discount, and validity days.
- `GET /api/quotations/:enquiryId` retrieves a saved quotation and calculated totals.
- `GET /api/quotations/:id/pdf` downloads the marked demonstration PDF.

## Database

SQLite tables are `products`, `enquiries`, `enquiry_items`, `enquiry_history`, `quotations`, and `quotation_items`. Enquiry items copy the product name, category, image, SKU, and quantity at submission time so later product edits or archives do not alter historical enquiries.

Public catalogue rows are seeded from the verified frontend data with `source=verified-public-catalogue`. New records created in Product Management use `source=demonstration-admin`. The application never invents official SKUs or product prices.

Quotation PDFs include `DEMONSTRATION - NOT A COMMERCIAL OFFER`. No email or company submission is claimed.
