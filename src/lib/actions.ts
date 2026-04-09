'use server';

import { db } from '@/db';
import { templates, products, botRules } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// --- TEMPLATES ---
export async function getTemplates(sectorId: string) {
  const { userId } = await auth();
  if (!userId) return [];

  return await db.query.templates.findMany({
    where: and(
      eq(templates.userId, userId),
      eq(templates.sectorId, sectorId)
    ),
  });
}

export async function createTemplate(data: { title: string, body: string, category: string, sectorId: string }) {
  const { userId } = await auth();
  if (!userId) throw new Error('Oturum açılmadı');

  await db.insert(templates).values({
    userId,
    ...data,
  });

  revalidatePath('/');
}

// --- PRODUCTS ---
export async function getProducts(sectorId: string) {
  const { userId } = await auth();
  if (!userId) return [];

  return await db.query.products.findMany({
    where: and(
      eq(products.userId, userId),
      eq(products.sectorId, sectorId)
    ),
  });
}

export async function createProduct(data: { name: string, price: string, category: string, description: string, imageLabel: string, sectorId: string }) {
  const { userId } = await auth();
  if (!userId) throw new Error('Oturum açılmadı');

  await db.insert(products).values({
    userId,
    ...data,
  });

  revalidatePath('/');
}

// --- BOT RULES ---
export async function getBotRules() {
  const { userId } = await auth();
  if (!userId) return [];

  return await db.query.botRules.findMany({
    where: eq(botRules.userId, userId),
  });
}

export async function createBotRule(data: { trigger: string, response: string, actionType: string }) {
  const { userId } = await auth();
  if (!userId) throw new Error('Oturum açılmadı');

  await db.insert(botRules).values({
    userId,
    ...data,
  });

  revalidatePath('/');
}
