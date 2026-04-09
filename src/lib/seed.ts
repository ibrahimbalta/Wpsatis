'use server';

import { db } from '@/db';
import { templates, products } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { mockTemplates } from '@/data/mockTemplates';
import { mockProducts } from '@/data/mockProducts';
import { revalidatePath } from 'next/cache';

export async function seedSampleData() {
  const { userId } = await auth();
  if (!userId) throw new Error('Oturum açılmadı');

  // Check if user already has data to avoid duplication
  const existingTemplates = await db.query.templates.findFirst({
    where: (t, { eq }) => eq(t.userId, userId),
  });

  if (existingTemplates) {
    return { success: false, message: 'Veriler zaten yüklenmiş.' };
  }

  // Insert Templates
  const templatesToInsert = mockTemplates.map(t => ({
    userId,
    sectorId: t.sectorId,
    title: t.title,
    body: t.body,
    category: t.category,
  }));

  if (templatesToInsert.length > 0) {
    await db.insert(templates).values(templatesToInsert);
  }

  // Insert Products
  const productsToInsert = mockProducts.map(p => ({
    userId,
    sectorId: p.sectorId,
    name: p.name,
    price: p.price.toString(),
    category: p.category,
    description: p.description,
    imageLabel: p.imageLabel,
  }));

  if (productsToInsert.length > 0) {
    await db.insert(products).values(productsToInsert);
  }

  revalidatePath('/');
  return { success: true, message: '15 sektörlük örnek veri başarıyla yüklendi!' };
}
