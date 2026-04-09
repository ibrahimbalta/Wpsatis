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
  const productsToInsert = [
    {
      userId,
      sectorId: 'emlak',
      name: 'Modern Mimari - Boğaz Manzaralı Villa',
      price: '125000000',
      category: 'Villa',
      rooms: '6+2',
      squareMeters: 450,
      location: 'Beşiktaş, İstanbul',
      imageUrl: '/demo/villa.png',
      description: 'Eşsiz mimarisi ve kesintisiz manzara.'
    },
    {
      userId,
      sectorId: 'emlak',
      name: 'Minimalist Penthouse - Şehir Kalbi',
      price: '45000000',
      category: 'Residence',
      rooms: '3+1',
      squareMeters: 220,
      location: 'Şişli, İstanbul',
      imageUrl: '/demo/apartment.png',
      description: 'Lüksün ve konforun buluştuğu nokta.'
    },
    {
      userId,
      sectorId: 'emlak',
      name: 'Doğa ile İç İçe - Bahçeli Malikane',
      price: '32000000',
      category: 'Müstakil',
      rooms: '4+1',
      squareMeters: 300,
      location: 'Beykoz, İstanbul',
      imageUrl: '/demo/garden.png',
      description: 'Huzurlu bir yaşam alanı.'
    },
    ...mockProducts.map(p => ({
      userId,
      sectorId: p.sectorId,
      name: p.name,
      price: p.price.toString(),
      category: p.category,
      description: p.description,
      rooms: '3+1',
      squareMeters: 120,
      location: 'İstanbul',
      imageUrl: ''
    }))
  ];

  if (productsToInsert.length > 0) {
    await db.insert(products).values(productsToInsert);
  }

  revalidatePath('/');
  return { success: true, message: 'Lüks portföy ve örnek veriler başarıyla yüklendi!' };
}
