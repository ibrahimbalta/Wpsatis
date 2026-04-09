import { NextResponse } from 'next/server';
import { db } from '@/db';
import { botRules, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { chatWithEmlakAI } from '@/lib/ai-actions';

/**
 * WhatsApp Webhook: Hybrid AI/Rule Model
 * 1. Sabit Kuralları Kontrol Et (Triggers)
 * 2. Eğer kuralda 'isAiFallback' varsa veya kural yoksa AI'yı kullan
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages || [];
    if (messages.length === 0) return NextResponse.json({ ok: true });

    const msg = messages[0];
    const chatId = msg.chatId || '';
    const text = msg.text?.body || '';
    const fromMe = msg.fromMe || false;

    // 1. Filtreleme: Benden çıkan veya grup mesajlarını atla
    if (fromMe || chatId.includes('@g.us')) {
      return NextResponse.json({ ok: true, status: 'ignored' });
    }

    // 2. Kullanıcı Ayarlarını ve Kuralları Al
    // Not: Gerçek senaryoda bu webhook'un hangi kullanıcıya ait olduğunu belirlemek için
    // URL parametresi veya sağlayıcı verisi kullanılır. Örnek olarak ilk kullanıcıyı alıyoruz.
    const user = await db.query.users.findFirst();
    if (!user) return NextResponse.json({ ok: true, status: 'no_user' });

    const rules = await db.select().from(botRules).where(eq(botRules.isActive, true));
    const matchedRule = rules.find(r => text.toLowerCase().includes(r.trigger.toLowerCase()));

    let finalResponse = '';

    // 3. Akış Mantığı
    if (matchedRule) {
      finalResponse = matchedRule.response;
      
      // Eğer kuralda AI Fallback aktifse, AI ile bağlamı zenginleştir
      if (matchedRule.isAiFallback) {
         const { text: aiContext } = await chatWithEmlakAI([
           { role: 'user', content: text },
           { role: 'assistant', content: `Bu kural gereği şu cevabı veriyorum: ${matchedRule.response}. Lütfen bu cevabı temel alarak müşteriye daha doğal ve detaylı yardımcı ol.` }
         ]);
         finalResponse = aiContext;
      }
    } else if (user.isAiEnabled) {
      // Kural yok ama Global AI aktif
      const { text: aiContext } = await chatWithEmlakAI([{ role: 'user', content: text }]);
      finalResponse = aiContext;
    }

    // 4. Yanıtı Gönder
    if (finalResponse) {
      await sendWhatsAppMessage(chatId, finalResponse);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function sendWhatsAppMessage(to: string, text: string) {
  const WHAPI_TOKEN = process.env.WHAPI_TOKEN;
  if (!WHAPI_TOKEN) return;

  try {
    await fetch('https://gate.whapi.cloud/messages/text', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHAPI_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ typing_time: 2, to, body: text })
    });
  } catch (err) {
    console.error('Send Error:', err);
  }
}
