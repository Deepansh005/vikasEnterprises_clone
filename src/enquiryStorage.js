const ITEMS_KEY = 'vikas-enquiry-items';
const RECORDS_KEY = 'vikas-enquiry-records';

function read(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadItems() { return read(ITEMS_KEY, []); }
export function saveItems(items) { write(ITEMS_KEY, items); }
export function loadRecords() { return read(RECORDS_KEY, []); }
