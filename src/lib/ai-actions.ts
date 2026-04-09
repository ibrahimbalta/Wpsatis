'use client';

import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { z } from 'zod';

// İlan metnini emlak verilerine dönüştüren akıllı fonksiyon
export async function parseListingWithAI(text: string) {
  // Not: GOOGLE_GENERATIVE_AI_API_KEY .env dosyasında olmalıdır.
  
  const { object } = await generateText({
    model: google('gemini-1.5-flash'),
    system: 'Sen bir emlak veri ayıklayıcısısın. Sana verilen karmaşık ilan metinlerinden şu bilgileri ayıklayıp JSON formatında dönmelisin: name (ilan başlığı), price (sadece sayı), category (Daire, Arsa, İşyeri vb.), rooms (2+1, 3+1 formatında), squareMeters (sayı), floorLevel, location, isRental (true/false). Eğer bilgi yoksa boş bırak.',
    prompt: `Şu ilan metnini analiz et: ${text}`,
  });

  return object;
}
