import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { products } from '../src/data.js';

const databasePath = process.env.DB_PATH || 'data/tradedesk.sqlite';
fs.mkdirSync(path.dirname(databasePath), { recursive: true });
const database = new Database(databasePath);
database.pragma('foreign_keys = ON');
database.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    category_path TEXT NOT NULL,
    specifications TEXT NOT NULL,
    image TEXT,
    sku TEXT,
    archived INTEGER NOT NULL DEFAULT 0,
    source TEXT NOT NULL DEFAULT 'verified-public-catalogue',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS enquiries (
    id TEXT PRIMARY KEY,
    reference TEXT NOT NULL UNIQUE,
    submitted_at TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    business TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS enquiry_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    enquiry_id TEXT NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    category TEXT NOT NULL,
    image TEXT,
    sku TEXT,
    quantity INTEGER NOT NULL CHECK(quantity > 0)
  );
  CREATE TABLE IF NOT EXISTS enquiry_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    enquiry_id TEXT NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    changed_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS quotations (
    id TEXT PRIMARY KEY,
    enquiry_id TEXT NOT NULL UNIQUE REFERENCES enquiries(id) ON DELETE CASCADE,
    reference TEXT NOT NULL UNIQUE,
    quotation_date TEXT NOT NULL,
    valid_until TEXT NOT NULL,
    tax_rate REAL NOT NULL DEFAULT 0,
    discount REAL NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS quotation_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quotation_id TEXT NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    sku TEXT,
    quantity INTEGER NOT NULL CHECK(quantity > 0),
    unit_price REAL NOT NULL CHECK(unit_price >= 0)
  );
`);

function seedProducts() {
  const insert = database.prepare(`INSERT OR IGNORE INTO products (id, name, category, category_path, specifications, image, sku, source, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const now = new Date().toISOString();
  const transaction = database.transaction(() => Object.entries(products).forEach(([path, page]) => page.sections.forEach(([name, specifications, image], index) => insert.run(`${page.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}`, name, page.title, path, JSON.stringify(specifications), Array.isArray(image) ? image[0] : image, null, 'verified-public-catalogue', now, now))));
  transaction();
}

seedProducts();
export default database;
