import { pgTable, text, timestamp, integer, uuid, boolean, numeric } from 'drizzle-orm/pg-core';

// Users table (Syncs with Clerk)
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull(),
  name: text('name'),
  selectedSectorId: text('selected_sector_id').default('1'), // Default to Seramik
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Sectors metadata (Reference)
export const sectors = pgTable('sectors', {
  id: text('id').primaryKey(), // 1, 2, 3...
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  icon: text('icon').notNull(),
  description: text('description'),
});

// Templates
export const templates = pgTable('templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(), // Clerk User ID
  sectorId: text('sector_id').notNull(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  category: text('category').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Products
export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  sectorId: text('sector_id').notNull(),
  name: text('name').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  category: text('category').notNull(),
  description: text('description'),
  imageLabel: text('image_label'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Bot Rules
export const botRules = pgTable('bot_rules', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  trigger: text('trigger').notNull(),
  response: text('response').notNull(),
  actionType: text('action_type').notNull().default('text'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});
