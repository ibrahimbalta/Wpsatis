'use server';

import { google } from '@ai-sdk/google';
import { generateText, tool } from 'ai';
import { z } from 'zod';
import { db } from '@/db';
import { products } from '@/db/schema';
import { ilike, or, and, eq } from 'drizzle-orm';

// AI Veri Ayıklama Fonksiyonu (İlan girişi için)
export async function parseListingWithAI(text: string) {
  const { object } = await generateText({
    model: google('gemini-1.5-flash'),
    system: 'Sen bir emlak veri ayıklayıcısısın. Sana verilen karmaşık ilan metinlerinden şu bilgileri ayıklayıp JSON formatında dönmelisin: name (ilan başlığı), price (sadece sayı), category (Daire, Arsa, İşyeri vb.), rooms (2+1, 3+1 formatında), squareMeters (sayı), floorLevel, location, isRental (true/false). Eğer bilgi yoksa boş bırak.',
    prompt: `Şu ilan metnini analiz et: ${text}`,
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
    toolResults: result.toolResults 
  };
}
