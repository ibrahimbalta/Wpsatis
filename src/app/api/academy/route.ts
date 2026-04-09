import { google } from '@ai-sdk/google';
import { streamText, StreamData, generateObject } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const { messages, scenario } = await req.json();

    const scenarios: any = {
      'pazarlik': {
        role: 'İnatçı ve agresif bir alıcı adayı.',
        goal: 'Bütçesinin çok kısıtlı olduğunu iddia ederek fiyatı %20 düşürmeye çalışıyor.',
        personality: 'Aceleci, şüpheci ve her zaman açık arayan.'
      },
      'kararsiz': {
        role: 'Eşinden onay almadan karar veremeyen kararsız bir müşteri.',
        goal: 'Sürekli başka ilanlarla kıyaslama yapıp görüşmeyi uzatıyor.',
        personality: 'Kibar ama çok soru soran, güven arayan.'
      },
      'uzman': {
        role: 'Eskiden emlakçılık yapmış, teknik detaylara hakim bir yatırımcı.',
        goal: 'İmar durumundan tapu detaylarına kadar her teknik detayı sorguluyor.',
        personality: 'Analitik, soğuk ve hata kabul etmeyen.'
      }
    };

    const selected = scenarios[scenario] || scenarios['pazarlik'];
    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop();

    const data = new StreamData();

    // 1. ANALİZ ADIMI: Kullanıcın mesajını değerlendir
    if (lastUserMessage) {
       const analysis = await generateObject({
          model: google('gemini-1.5-flash'),
          schema: z.object({
            persuasionLevel: z.number().min(0).max(100),
            trustScore: z.number().min(0).max(100),
            coachTip: z.string(),
          }),
          system: `Sen bir emlak satış koçusun. Danışmanın müşteriye verdiği şu yanıtı analiz et:
          Müşteri Profili: ${selected.role}
          Yanıt: "${lastUserMessage.content}"
          
          İkna seviyesini (0-100), Güven skorunu (0-100) belirle ve kısa bir gelişim tavsiyesi ver.`,
          prompt: `Yanıtı analiz et ve tavsiye ver.`,
       });
       
       // Analiz verilerini stream ile gönder
       data.append({ 
         type: 'analysis', 
         persuasion: analysis.object.persuasionLevel, 
         trust: analysis.object.trustScore,
         tip: analysis.object.coachTip 
       });
    }

    // 2. YANIT ADIMI: Müşterinin (Personanın) yanıtını oluştur
    const result = await streamText({
      model: google('gemini-1.5-flash'),
      system: `Sen şu an bir ROLEPLAY personasısın.
      Karakterin: ${selected.role}
      Kişiliğin: ${selected.personality}
      Amacın: ${selected.goal}
      
      KURALLAR:
      - Asla bir yapay zeka olduğunu söyleme.
      - Gerçek bir müşteri gibi tepki ver (Kızabilirsin, şüphe duyabilirsin).
      - Eğer emlakçı (kullanıcı) seni ikna ederse yavaşça yumuşa. 
      - Görüşme bitene kadar müşteri kimliğinden çıkma.
      - Yanıtların kısa ve WhatsApp mesajı tadında olsun.`,
      messages,
      onFinish: () => {
        data.close();
      }
    });

    return result.toDataStreamResponse({ data });
  } catch (error) {
    console.error('Academy API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
