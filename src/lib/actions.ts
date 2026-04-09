'use server';

import { db } from '@/db';
import { products, templates, botRules, users } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth, currentUser } from '@clerk/nextjs/server';

// Kullanıcıyı veritabanı ile eşleştirme
export async function syncUser() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) return null;

  const existingUser = await db.select().from(users).where(eq(users.clerkId, userId));

  if (existingUser.length === 0) {
    await db.insert(users).values({
      clerkId: userId,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
    });
  }

  return userId;
}

// İlanları Getir
export async function getProducts(sectorId: string) {
  const { userId } = await auth();
  if (!userId) return [];
  
  return await db.select()
    .from(products)
    .where(and(eq(products.userId, userId), eq(products.sectorId, sectorId)))
    .orderBy(desc(products.createdAt));
}

// Mesaj Şablonlarını Getir
export async function getTemplates(sectorId: string) {
  const { userId } = await auth();
  if (!userId) return [];

  return await db.select()
    .from(templates)
    .where(and(eq(templates.userId, userId), eq(templates.sectorId, sectorId)))
    .orderBy(desc(templates.createdAt));
}

// Bot Kurallarını Getir
export async function getBotRules() {
  const { userId } = await auth();
  if (!userId) return [];

  return await db.select()
    .from(botRules)
    .where(eq(botRules.userId, userId))
    .orderBy(desc(botRules.createdAt));
}

// İlan (Gayrimenkul) Oluşturma
export async function createProduct(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const name = formData.get('name') as string;
  const price = formData.get('price') as string;
  const category = formData.get('category') as string;
  const description = formData.get('description') as string;
  
  const rooms = formData.get('rooms') as string;
  const squareMeters = parseInt(formData.get('squareMeters') as string) || 0;
  const floorLevel = formData.get('floorLevel') as string;
  const location = formData.get('location') as string;
  const isRental = formData.get('isRental') === 'true';
  const externalUrl = formData.get('externalUrl') as string;

  await db.insert(products).values({
    userId,
    name,
    price,
    category,
    description,
    rooms,
    squareMeters,
    floorLevel,
    location,
    isRental,
    externalUrl,
    sectorId: 'emlak',
  });

  revalidatePath('/');
}

// Mesaj Şablonu Oluşturma
export async function createTemplate(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const title = formData.get('title') as string;
  const body = formData.get('body') as string;
  const category = formData.get('category') as string;
  const sectorId = formData.get('sectorId') as string;

  await db.insert(templates).values({
    userId,
    title,
    body,
    category,
    sectorId,
  });

  revalidatePath('/');
}

// Bot Kuralı Oluşturma
export async function createBotRule(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const trigger = formData.get('trigger') as string;
  const response = formData.get('response') as string;

  await db.insert(botRules).values({
    userId,
    trigger,
    response,
    actionType: 'text',
  });

  revalidatePath('/');
}
