'use server';

import { db } from '@/db';
import { products, templates, botRules, users } from '@/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth, currentUser } from '@clerk/nextjs/server';

// Kullanıcı Profil Bilgilerini Getir
export async function getUserProfile() {
  const { userId } = await auth();
  if (!userId) return null;

  const data = await db.select().from(users).where(eq(users.clerkId, userId));
  return data.length > 0 ? data[0] : null;
}

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

// Kullanıcı Profilini Güncelle (Kurumsal Kimlik)
export async function updateUserProfile(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const companyName = formData.get('companyName') as string;
  const logoUrl = formData.get('logoUrl') as string;
  const whatsappNumber = formData.get('whatsappNumber') as string;

  await db.update(users)
    .set({
      companyName,
      logoUrl,
      whatsappNumber,
      updatedAt: new Date(),
    })
    .where(eq(users.clerkId, userId));

  revalidatePath('/');
}

// Analitik: Sayaçları Artır
export async function incrementViewCount(id: number) {
  await db.update(products)
    .set({ viewCount: sql`${products.viewCount} + 1` })
    .where(eq(products.id, id));
}

export async function incrementClickCount(id: number) {
  await db.update(products)
    .set({ clickCount: sql`${products.clickCount} + 1` })
    .where(eq(products.id, id));
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

// İlan (Gayrimenkul) Oluşturma (Çoklu Fotoğraf Desteği Eklendi)
export async function createProduct(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const name = formData.get('name') as string;
  const price = formData.get('price') as string;
  const category = formData.get('category') as string;
  const description = formData.get('description') as string;
  const imageUrl = formData.get('imageUrl') as string;
  
  // Çoklu görselleri JSON olarak al
  const extraImages = formData.get('extraImages') as string;
  
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
    imageUrl,
    extraImages, // Çoklu Fotoğraf Desteği
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

// Mesaj Şablonlarını ve Bot Kurallarını Yönet
export async function getTemplates(sectorId: string) {
  const { userId } = await auth();
  if (!userId) return [];
  return await db.select().from(templates).where(and(eq(templates.userId, userId), eq(templates.sectorId, sectorId))).orderBy(desc(templates.createdAt));
}

export async function createTemplate(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');
  const title = formData.get('title') as string;
  const body = formData.get('body') as string;
  const category = formData.get('category') as string;
  const sectorId = formData.get('sectorId') as string;
  await db.insert(templates).values({ userId, title, body, category, sectorId });
  revalidatePath('/');
}

export async function getBotRules() {
  const { userId } = await auth();
  if (!userId) return [];
  return await db.select().from(botRules).where(eq(botRules.userId, userId)).orderBy(desc(botRules.createdAt));
}

export async function createBotRule(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');
  const trigger = formData.get('trigger') as string;
  const response = formData.get('response') as string;
  await db.insert(botRules).values({ userId, trigger, response, actionType: 'text' });
  revalidatePath('/');
}
