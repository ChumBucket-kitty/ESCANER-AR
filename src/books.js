// Loads the ISBN -> book mapping from public/books.json and looks books up.
let cache = null;

// Strip hyphens/spaces so "978-0-14-..." and "978014..." match.
export function normalizeIsbn(code) {
  return String(code).replace(/[^0-9Xx]/g, '').toUpperCase();
}

export async function loadBooks() {
  if (!cache) {
    const res = await fetch('/books.json');
    if (!res.ok) throw new Error(`Could not load books.json (${res.status})`);
    cache = await res.json();
  }
  return cache;
}

// Returns the book entry or null when unknown.
export async function findBook(code) {
  const books = await loadBooks();
  const isbn = normalizeIsbn(code);
  const book = books[isbn];
  return book ? { isbn, ...book } : null;
}
