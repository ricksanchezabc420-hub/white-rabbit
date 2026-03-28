import { pgTable, uuid, serial, varchar, decimal, timestamp, integer, json, jsonb } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  flavor: varchar('flavor', { length: 255 }).notNull(),
  cryptoPriceUsd: decimal('crypto_price_usd', { precision: 10, scale: 2 }).notNull(),
  imageUrl: varchar('image_url', { length: 255 }),
  stock: integer('stock').notNull().default(0),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  paymentMethod: varchar('payment_method', { length: 20 }).notNull().default('CRYPTO'),
  walletAddress: varchar('wallet_address', { length: 42 }), 
  transactionHash: varchar('transaction_hash', { length: 66 }).unique(), 
  status: varchar('status', { length: 50 }).notNull().default('PENDING'), 
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  discountCode: varchar('discount_code', { length: 50 }),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }),
  shippingName: varchar('shipping_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  city: varchar('city', { length: 255 }).notNull(),
  stateProvince: varchar('state_province', { length: 255 }).notNull(),
  postalCode: varchar('postal_code', { length: 50 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  items: jsonb('items').notNull(), 
  shippingCost: decimal('shipping_cost', { precision: 10, scale: 2 }),
  shippingService: varchar('shipping_service', { length: 100 }),
  trackingNumber: varchar('tracking_number', { length: 255 }),
  shippedAt: timestamp('shipped_at'),
  labelUrl: varchar('label_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const discounts = pgTable('discounts', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  description: varchar('description', { length: 255 }),
  discountType: varchar('discount_type', { length: 20 }).notNull().default('percentage'), // percentage, fixed
  discountValue: decimal('discount_value', { precision: 10, scale: 2 }).notNull(),
  minOrderAmount: decimal('min_order_amount', { precision: 10, scale: 2 }),
  maxUses: integer('max_uses'),
  usedCount: integer('used_count').default(0),
  isActive: integer('is_active').default(1), // 1 for true, 0 for false (SQLite-style if needed, but Drizzle pg supports boolean too)
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
