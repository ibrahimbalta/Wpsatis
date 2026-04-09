'use client';

import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq, sql, desc } from 'drizzle-orm';
import { z } from 'zod';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google('gemini-1.5-flash'),
    system: `Sen bu Emlak SaaS platformunun ana asistanısın. 
    Kullanıcının adı İbrahim. Sen onun dijital ortağısın.
    Görevin: İlanları sorgulamak, analizleri yorumlamak ve kullanıcıya sistem yönetiminde yardımcı olmak.
    
    Yeteneklerin:
    - İlanları veritabanında arayabilirsin.
    - Analytics verilerini (izlenme, tıklanma) analiz edebilirsin.
    - Kurumsal kimlik ve bot ayarlarında rehberlik edebilirsin.
    
    Üslubun: Profesyonel, çözüm odaklı ve hafif karizmatik (Senior Broker gibi).`,
    messages,
    tools: {
      // İlan Arama Yeteneği
      list_properties: tool({
        description: 'Veritabanındaki aktif ilanları listeler veya arar.',
        parameters: z.object({
          query: z.string().optional().description('Arama terimi (Örn: villa, daire)'),
          limit: z.number().optional().default(5)
        }),
        execute: async ({ query, limit }) => {
          const results = await db.select().from(products).limit(limit).orderBy(desc(products.createdAt));
          return results;
        }
      }),
      // Analitik Raporlama Yeteneği
      get_analytics_summary: tool({
        description: 'Tüm ilanların toplam izlenme ve tıklanma istatistiklerini getirir.',
        parameters: z.object({}),
        execute: async () => {
          const stats = await db.select({
            totalViews: sql<number>`sum(${products.viewCount})`,
            totalClicks: sql<number>`sum(${products.clickCount})`,
            count: sql<number>`count(*)`
          }).from(products);
          return stats[0];
        }
      })
    }
  });

  return result.toDataStreamResponse();
}
