'use server';

import { db } from '@/db';
import { products, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Giriş yapmamış kullanıcıların (Müşterilerin) ilanı ve SAHİBİ olan ofisi görebilmesi için
export async function getPublicListingWithBranding(id: number) {
  try {
    // 1. İlanı Getir
    const listingData = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (listingData.length === 0) return null;
    
    const listing = listingData[0];

    // 2. İlan Sahibinin (Emlak Ofisinin) Kurumsal Bilgilerini Getir
    const ownerData = await db.select().from(users).where(eq(users.clerkId, listing.userId)).limit(1);
    const branding = ownerData.length > 0 ? {
      companyName: ownerData[0].companyName,
      logoUrl: ownerData[0].logoUrl,
      whatsappNumber: ownerData[0].whatsappNumber,
      ownerName: ownerData[0].name
    } : null;

    return {
      ...listing,
      branding
    };
  } catch (error) {
    console.error('Public branding fetch error:', error);
    return null;
  }
}
