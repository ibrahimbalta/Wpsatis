'use client';

import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { db } from '@/db';
import { products } from '@/db/schema';
import { ilike, or, and, eq } from 'drizzle-orm';

export async function chatWithEmlakAI(messages: any[]) {
  // Not: Base URL'i env'den veya window'dan almak gerekebilir
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://wpsatis.vercel.app';

  const result = await streamText({
    model: google('gemini-1.5-flash'),
    system: `Sen profesyonel bir Gayrimenkul Satış Uzmanısın. 
    Görevin müşteriden gelen mesajları analiz etmek ve veritabanındaki portföyümüzü kullanarak en uygun gayrimenkulü önermektir.
    İlanları sunarken mutlaka ilan ID'sini kullanarak şu formatta link vermelisin: ${baseUrl}/ilan/[ID]
    Önemli: Linkleri 'Şu linkten detaylara bakabilirsiniz: ...' şeklinde profesyonelce sun.`,
    messages,
    tools: {
      searchListings: tool({
        description: 'Veritabanındaki emlak ilanlarını arar ve detaylı bilgiler ile ID'yi döner.',
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

  return result.toDataStreamResponse();
}
