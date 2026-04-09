import { pgTable, text, timestamp, boolean, decimal, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
  clerkId: text('clerk_id').unique().notNull(), 
  email: text('email').notNull(),
  name: text('name'),
  
  // Kurumsal Kimlik Alanları
  companyName: text('company_name'), // Emlak Ofisi İsmi
  logoUrl: text('logo_url'), // Ofis Logo Linki
  whatsappNumber: text('whatsapp_number'), // Müşteri Hattı
  
  selectedSectorId: text('selected_sector_id').default('emlak'), 
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const templates = pgTable('templates', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
  userId: text('user_id').notNull(),
  sectorId: text('sector_id').notNull(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  category: text('category').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const products = pgTable('products', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
  userId: text('user_id').notNull(),
  sectorId: text('sector_id').notNull().default('emlak'),
  
  name: text('name').notNull(), 
  price: decimal('price', { precision: 20, scale: 2 }).notNull(),
  category: text('category').notNull(), 
  description: text('description'),
  
  rooms: text('rooms'),       
  squareMeters: integer('square_meters'),
  floorLevel: text('floor_level'),
  location: text('location'), 
  isRental: boolean('is_rental').default(false),
  externalUrl: text('external_url'), 
  
  imageUrl: text('image_url'), 
  viewCount: integer('view_count').default(0), 
  clickCount: integer('click_count').default(0), 
  
  imageLabel: text('image_label'), 
  createdAt: timestamp('created_at').defaultNow(),
});

export const botRules = pgTable('bot_rules', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
  userId: text('user_id').notNull(),
  trigger: text('trigger').notNull(),
  response: text('response').notNull(),
  actionType: text('action_type').notNull().default('text'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});
