'use server';

import { google } from '@ai-sdk/google';
import { generateText, generateObject, tool } from 'ai';
import { z } from 'zod';
import { db } from '@/db';
import { products } from '@/db/schema';
import { ilike, or, and, eq } from 'drizzle-orm';

// Çoklu İlan Ayıklama Fonksiyonu (Mağaza sayfasından kopyalanan metin için)
export async function parseMultipleListingsWithAI(text: string) {
  const { object } = await generateObject({
    model: google('gemini-1.5-flash'),
    system: 'Sen uzman bir emlak veri madencisisin. Sana verilen karmaşık metin yığınlarından (Sahibinden mağaza listesi gibi) TÜM ilanları tespit etmeli ve listelemelisin.',
    prompt: `Şu metin yığınındaki tüm emlak ilanlarını bul ve ayıkla: ${text}`,
    schema: z.object({
      listings: z.array(z.object({
        name: z.string().describe('İlan başlığı'),
        price: z.string().describe('Fiyat (sadece sayı)'),
        category: z.string().describe('Daire, Arsa, Villa vb.'),
        location: z.string().describe('İlçe/Mahalle bilgisi'),
        rooms: z.string().optional().describe('2+1, 3+1 vb.'),
        squareMeters: z.number().optional().describe('Metrekare'),
        isRental: z.boolean().describe('Kiralık mı?'),
      }))
    }),
  });

  return object.listings;
}

// AI Veri Ayıklama Fonksiyonu (Tekil ilan girişi için)
export async function parseListingWithAI(text: string) {
  const { object } = await generateObject({
    model: google('gemini-1.5-flash'),
    system: 'Sen bir emlak veri ayıklayıcısısın. Sana verilen karmaşık ilan metinlerinden şu bilgileri ayıklayıp JSON formatında dönmelisin.',
    prompt: `Şu ilan metnini analiz et: ${text}`,
    schema: z.object({
      name: z.string().optional().describe('İlan başlığı'),
      price: z.string().optional().describe('Fiyat (sadece sayı)'),
      category: z.string().optional().describe('Daire, Arsa, İşyeri vb.'),
      description: z.string().optional().describe('İlan açıklaması'),
      rooms: z.string().optional().describe('2+1, 3+1 formatında'),
      squareMeters: z.number().optional().describe('Metrekare'),
      floorLevel: z.string().optional().describe('Kat bilgisi'),
      location: z.string().optional().describe('Konum'),
      isRental: z.boolean().optional().describe('Kiralık mı?'),
    }),
  });

  return object;
}

// Bot Simülatörü için Chat Fonksiyonu (Server Action)
export async function chatWithEmlakAI(messages: any[]) {
  const result = await generateText({
    model: google('gemini-1.5-flash'),
    system: `Sen profesyonel bir Gayrimenkul Satış Uzmanısın (Wpsatis Bot). 
    Görevin müşteriden gelen mesajları analiz etmek ve veritabanındaki portföyümüzü kullanarak en uygun gayrimenkulü önermektir.
    
    Önemli Kurallar:
    1. İlanları sunarken mutlaka ilan ID'sini kullanarak profesyonelce link ver (Örn: /ilan/12).
    2. Eğer müşteri genel bir konum (örn: Çanakkale) soruyorsa, arama aracını kullanarak o konumdaki tüm ilanları listele.
    3. Fiyat, oda sayısı ve m2 gibi detayları net bir şekilde belirt.
    4. Mülkün avantajlarından bahset (örn: deniz manzaralı, önü açık, yatırım fırsatı).
    5. Müşteriye karşı nazik, satış odaklı ve çözümleyici bir ton kullan.
    6. Veritabanında uygun ilan yoksa, "Şu an tam istediğiniz kriterde bir ilanımız yok ancak portföyümüz sürekli güncelleniyor, telefonunuzu bırakırsanız size uygun bir mülk düştüğünde ilk size haber veririm" de.`,
    messages,
    tools: {
      searchListings: tool({
        description: 'Veritabanındaki emlak ilanlarını arar.',
        parameters: z.object({
          query: z.string().describe('Aranacak kelime (konum, mülk tipi vb.)'),
          isRental: z.boolean().optional(),
        }),
        execute: async ({ query, isRental }: any) => {
          const results = await db.select().from(products).where(
            and(
              or(
                ilike(products.name, `%${query}%`),
                ilike(products.location, `%${query}%`),
                ilike(products.category, `%${query}%`)
              ),
              isRental !== undefined ? eq(products.isRental, isRental) : undefined
            )
          );
          return results;
        },
      } as any),
    },
  });

  return { 
    text: result.text,
    toolCalls: result.toolCalls 
  };
}
