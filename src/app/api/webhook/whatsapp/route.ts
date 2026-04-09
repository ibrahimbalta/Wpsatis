import { NextResponse } from 'next/server';
import { db } from '@/db';
import { botRules, products } from '@/db/schema';
import { eq, ilike, or } from 'drizzle-orm';
import { google } from '@ai-sdk/google';
import { generateText, tool } from 'ai';
import { z } from 'zod';

// Not: Bu Webhook, Whapi.cloud veya Evolution API gibi sağlayıcılarla uyumludur.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Gelen mesaj verisini ayıkla (Whapi yapısına göre örneklendi)
    const messages = body.messages || [];
    if (messages.length === 0) return NextResponse.json({ ok: true });

    const msg = messages[0];
    const chatId = msg.chatId || '';
    const text = msg.text?.body || '';
    const fromMe = msg.fromMe || false;

    // 2. KRİTİK FİLTRE: Eğer mesaj benden çıkmışsa veya bir GRUP mesajıysa İŞLEME
    // WhatsApp'ta grup ID'leri genellikle 'g.us' ile biter.
    if (fromMe || chatId.includes('@g.us')) {
      console.log('Grup mesajı veya benden çıkan mesaj, atlanıyor...');
      return NextResponse.json({ ok: true, status: 'ignored' });
    }

    // 3. Sabit Kural Kontrolü (Quick Replies)
    const rules = await db.select().from(botRules).where(eq(botRules.isActive, true));
    const matchedRule = rules.find(r => text.toLowerCase().includes(r.trigger.toLowerCase()));

    if (matchedRule) {
      await sendWhatsAppMessage(chatId, matchedRule.response);
      return NextResponse.json({ ok: true });
    }

    // 4. AI Emlak Asistanını Devreye Sok (Eğer kural yoksa)
    const { text: aiResponse } = await generateText({
      model: google('gemini-1.5-flash'),
      system: `Sen bir emlak uzmanısın. Portföyümüzdeki ilanları tarayarak müşteriye cevap ver. 
      Eğer grup mesajı değilse (zaten filtrelendi) sıcak ve profesyonel davran.`,
      prompt: text,
      tools: {
        searchListings: tool({
          description: 'Emlak ilanlarını arar.',
          parameters: z.object({ query: z.string() }),
          execute: async ({ query }) => {
            return await db.select().from(products).where(
              or(
                ilike(products.name, `%${query}%`),
                ilike(products.location, `%${query}%`)
              )
            );
          },
        }),
      },
    });

    if (aiResponse) {
      await sendWhatsAppMessage(chatId, aiResponse);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// WhatsApp Sağlayıcısına Mesaj Gönderme (Örn: Whapi API)
async function sendWhatsAppMessage(to: string, text: string) {
  const WHAPI_TOKEN = process.env.WHAPI_TOKEN;
  if (!WHAPI_TOKEN) {
    console.warn('WHAPI_TOKEN eksik, mesaj gönderilemedi!');
    return;
  }

  try {
    await fetch('https://gate.whapi.cloud/messages/text', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHAPI_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        typing_time: 2,
        to: to,
        body: text
      })
    });
  } catch (err) {
    console.error('Mesaj gönderme hatası:', err);
  }
}
