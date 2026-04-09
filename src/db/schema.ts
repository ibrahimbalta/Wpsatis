import { pgTable, text, timestamp, boolean, decimal, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  clerkId: text('clerk_id').unique().notNull(), 
  email: text('email').notNull(),
  name: text('name'),
  selectedSectorId: text('selected_sector_id'), 
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const templates = pgTable('templates', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: text('user_id').notNull(),
  sectorId: text('sector_id').notNull(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  category: text('category').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Portföy / İlanlar (Modern Identity Yapısı)
export const products = pgTable('products', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: text('user_id').notNull(),
  sectorId: text('sector_id').notNull().default('emlak'),
  
  name: text('name').notNull(), 
  price: decimal('price', { precision: 20, scale: 2 }).notNull(),
  category: text('category').notNull(), 
  description: text('description'),
  
  // Emlak Detayları
  rooms: text('rooms'),       
  squareMeters: integer('square_meters'),
  floorLevel: text('floor_level'),
  location: text('location'), 
  isRental: boolean('is_rental').default(false),
  externalUrl: text('external_url'), 
  
  imageLabel: text('image_label'), 
  createdAt: timestamp('created_at').defaultNow(),
});

export const botRules = pgTable('bot_rules', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: text('user_id').notNull(),
  trigger: text('trigger').notNull(),
  response: text('response').notNull(),
  actionType: text('action_type').notNull().default('text'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});
