import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { PRODUCTS } from './src/data/products';

const app = express();
const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';

// Server-side persistence store inside ./.data (no user-controlled paths)
const DATA_DIR = path.resolve(process.cwd(), '.data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');

interface StoredOrder {
  orderNumber: string;
  status: string;
  createdAt: string;
  customer: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    productId: string;
    productName: string;
    variantName: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  note: string;
}

interface StoredContact {
  referenceId: string;
  receivedAt: string;
  name: string;
  email: string;
  topic: string;
  message: string;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJsonArray<T>(filePath: string): T[] {
  try {
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function appendJsonRecord<T>(filePath: string, record: T) {
  ensureDataDir();
  const existing = readJsonArray<T>(filePath);
  existing.unshift(record);
  fs.writeFileSync(filePath, JSON.stringify(existing.slice(0, 200), null, 2), 'utf-8');
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function cleanText(val: unknown, maxLen: number): string {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, maxLen);
}

app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', brand: 'AUREON', timestamp: new Date().toISOString() });
});

app.get('/api/products', (_req, res) => {
  res.json({ products: PRODUCTS });
});

app.post('/api/contact', (req, res) => {
  const name = cleanText(req.body?.name, 120);
  const email = cleanText(req.body?.email, 160);
  const topic = cleanText(req.body?.topic, 80) || 'Product Concierge';
  const message = cleanText(req.body?.message, 2500);

  if (name.length < 2) {
    res.status(400).json({ error: 'Please provide your full name.' });
    return;
  }
  if (!isValidEmail(email)) {
    res.status(400).json({ error: 'Please enter a valid email address.' });
    return;
  }
  if (message.length < 10) {
    res.status(400).json({ error: 'Please include a brief message (at least 10 characters).' });
    return;
  }

  const referenceId = `INQ-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const receivedAt = new Date().toISOString();

  const record: StoredContact = {
    referenceId,
    receivedAt,
    name,
    email,
    topic,
    message,
  };

  try {
    appendJsonRecord(CONTACTS_FILE, record);
  } catch (err) {
    console.error('Failed to persist contact inquiry:', err);
  }

  res.status(201).json({
    referenceId,
    receivedAt,
    message: 'Your inquiry has been routed to the AUREON Acoustic Concierge team.',
  });
});

app.post('/api/orders', (req, res) => {
  const rawItems = Array.isArray(req.body?.items) ? req.body.items : [];
  const rawCustomer = req.body?.customer ?? {};

  const fullName = cleanText(rawCustomer.fullName, 120);
  const email = cleanText(rawCustomer.email, 160);
  const address = cleanText(rawCustomer.address, 240);
  const city = cleanText(rawCustomer.city, 100);
  const postalCode = cleanText(rawCustomer.postalCode, 30);
  const country = cleanText(rawCustomer.country, 80);

  if (rawItems.length === 0 || rawItems.length > 25) {
    res.status(400).json({ error: 'Your shopping bag must contain between 1 and 25 line items.' });
    return;
  }

  if (
    fullName.length < 2 ||
    !isValidEmail(email) ||
    address.length < 5 ||
    city.length < 2 ||
    postalCode.length < 2 ||
    country.length < 2
  ) {
    res.status(400).json({ error: 'Please complete all shipping and contact fields accurately.' });
    return;
  }

  // Server-authoritative item resolution & price calculation
  const verifiedItems: StoredOrder['items'] = [];
  let subtotal = 0;

  for (const item of rawItems) {
    const productId = cleanText(item?.productId, 64);
    const variantId = cleanText(item?.variantId, 64);
    const qty = Number(item?.quantity);

    if (!Number.isInteger(qty) || qty < 1 || qty > 10) {
      res.status(400).json({ error: 'Invalid item quantity specified (1–10 allowed).' });
      return;
    }

    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) {
      res.status(400).json({ error: `Unknown product reference: ${productId}` });
      return;
    }

    const variant = product.variants.find((v) => v.id === variantId) || product.variants[0];
    const lineTotal = product.price * qty;
    subtotal += lineTotal;

    verifiedItems.push({
      productId: product.id,
      productName: product.name,
      variantName: variant.name,
      unitPrice: product.price,
      quantity: qty,
      lineTotal,
    });
  }

  const shipping = subtotal >= 1000 ? 0 : 35;
  const total = subtotal + shipping;
  const orderNumber = `AUR-${crypto.randomInt(100000, 999999)}`;
  const createdAt = new Date().toISOString();

  const orderRecord: StoredOrder = {
    orderNumber,
    status: 'Confirmed — Demo Reservation',
    createdAt,
    customer: {
      fullName,
      email,
      address,
      city,
      postalCode,
      country,
    },
    items: verifiedItems,
    subtotal,
    shipping,
    total,
    note: 'Demo Checkout Simulation — No live payment card was charged.',
  };

  try {
    appendJsonRecord(ORDERS_FILE, orderRecord);
  } catch (err) {
    console.error('Failed to persist demo order:', err);
  }

  res.status(201).json(orderRecord);
});

async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AUREON server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
