import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { db } from '@/db';
import { products } from '@/db/schema';
import { ilike, or, and, eq } from 'drizzle-orm';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google('gemini-1.5-flash'),
    system: `Sen kıdemli bir Gayrimenkul Yatırım Danışmanısın. 
    Kullanıcıların elindeki emlak portföyünü (ilanları) en iyi şekilde pazarlamalarına yardımcı olursun.
    Müşteriden gelen bir soru olduğunda 'searchListings' aracını kullanarak portföyümüzde uygun ilan olup olmadığını mutlaka kontrol etmelisin.
    İlanları sunarken 'Bartın' gibi spesifik konum ve fiyat bilgilerini vurgula.
    Eğer müşteri genel bir satış tavsiyesi isterse, profesyonel emlakçı diliyle (krediler, tapu süreçleri vb.) cevap ver.`,
    messages,
    tools: {
      searchListings: tool({
        description: 'Veritabanındaki emlak ilanlarını isim, kategori, konum veya açıklamaya göre arar.',
        parameters: z.object({
          query: z.string().describe('Konum, oda sayısı veya mülk tipi gibi arama kelimeleri.'),
          isRental: z.boolean().optional().describe('Kiralık mı satılık mı?'),
        }),
        execute: async ({ query }: any) => {
          const results = await db.select().from(products).where(
            or(
              ilike(products.name, `%${query}%`),
              ilike(products.location, `%${query}%`),
              ilike(products.category, `%${query}%`),
              ilike(products.description, `%${query}%`)
            )
          );
          return results;
        },
      } as any),
    },
  });

  return result.toTextStreamResponse();
}
