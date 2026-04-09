'use server';

import { google } from '@ai-sdk/google';
import { generateText, generateObject, tool } from 'ai';
import { z } from 'zod';
import { db } from '@/db';
import { products } from '@/db/schema';
import { ilike, or, and, eq } from 'drizzle-orm';

// AI Veri Ayıklama Fonksiyonu (İlan girişi için)
export async function parseListingWithAI(text: string) {
  const { object } = await generateObject({
    model: google('gemini-1.5-flash'),
    system: 'Sen bir emlak veri ayıklayıcısısın. Sana verilen karmaşık ilan metinlerinden şu bilgileri ayıklayıp JSON formatında dönmelisin.',
    prompt: `Şu ilan metnini analiz et: ${text}`,
    schema: z.object({
      name: z.string().optional().describe('İlan başlığı'),
      price: z.string().optional().describe('Fiyat (sadece sayı)'),
      category: z.string().optional().describe('Daire, Arsa, İşyeri vb.'),
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
    İlanları sunarken mutlaka ilan ID'sini kullanarak profesyonelce link ver.
    Müşteriye karşı nazik, satış odaklı ve çözümleyici bir ton kullan.`,
    messages,
    tools: {
      searchListings: tool({
        description: 'Veritabanındaki emlak ilanlarını arar.',
        parameters: z.object({
          query: z.string().describe('Aranacak kelime (konum, mülk tipi vb.)'),
          isRental: z.boolean().optional(),
        }),
        execute: async ({ query, isRental }) => {
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
      }),
    },
  });

  return { 
    text: result.text,
    toolCalls: result.toolCalls 
  };
}
