'use client';

import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { db } from '@/db';
import { products } from '@/db/schema';
import { ilike, or, and, eq } from 'drizzle-orm';

export async function chatWithEmlakAI(messages: any[]) {
  // Not: Emlakçı uzmanı asistanı için Gemini-1.5-Flash kullanıyoruz
  const result = await streamText({
    model: google('gemini-1.5-flash'),
    system: `Sen profesyonel bir Gayrimenkul Satış Uzmanısın. 
    Görevin müşteriden gelen mesajları analiz etmek ve veritabanındaki portföyümüzü kullanarak en uygun gayrimenkulü önermektir.
    Veritabanında arama yapmak için 'searchListings' aracını kullanmalısın.
    Eğer uygun bir ilan bulursan, detaylarını (fiyat, m2, konum) profesyonel ve ikna edici bir dille sun.
    Eğer hiç ilan bulamazsan, 'Şu an tam istediğiniz kriterde bir ilanım yok ama alternatiflere bakabilirim' de.`,
    messages,
    tools: {
      searchListings: tool({
        description: 'Veritabanındaki emlak ilanlarını isim, konum veya açıklamaya göre arar.',
        parameters: z.object({
          query: z.string().describe('Aranacak kelime (konum, mülk tipi vb.)'),
          isRental: z.boolean().optional().describe('Kiralık mı satılık mı?'),
        }),
        execute: async ({ query, isRental }) => {
          const results = await db.select().from(products).where(
            and(
              or(
                ilike(products.name, `%${query}%`),
                ilike(products.location, `%${query}%`),
                ilike(products.description, `%${query}%`)
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
