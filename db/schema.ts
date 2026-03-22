import { pgTable, uuid, varchar, decimal, timestamp, integer, json } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  flavor: varchar('flavor', { length: 255 }).notNull(),
  cryptoPriceUsd: decimal('crypto_price_usd', { precision: 10, scale: 2 }).notNull(),
  imageUrl: varchar('image_url', { length: 255 }),
  stock: integer('stock').notNull().default(0),
});

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  paymentMethod: varchar('payment_method', { length: 20 }).notNull().default('CRYPTO'),
  walletAddress: varchar('wallet_address', { length: 42 }), 
  transactionHash: varchar('transaction_hash', { length: 66 }).unique(), 
  status: varchar('status', { length: 50 }).notNull().default('PENDING'), 
  totalUsd: decimal('total_usd', { precision: 10, scale: 2 }).notNull(),
  shippingName: varchar('shipping_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  city: varchar('city', { length: 255 }).notNull(),
  stateProvince: varchar('state_province', { length: 255 }).notNull(),
  postalCode: varchar('postal_code', { length: 50 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  items: json('items').notNull(),
  trackingNumber: varchar('tracking_number', { length: 255 }),
  shippedAt: timestamp('shipped_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
