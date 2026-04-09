'use client';

import React, { useState } from 'react';
import { useSector } from '@/context/SectorContext';
import { BookOpen, ChevronDown, CheckCircle2, Star, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrainingSection {
  title: string;
  items: string[];
  icon: any;
}

export function SalesTraining() {
  const { currentSector } = useSector();
  const [openSection, setOpenSection] = useState<number | null>(0);

  const trainingData: TrainingSection[] = [
    {
      title: 'Müşteriyi Karşılama ve İlk İzlenim',
      icon: Zap,
      items: [
        'Mesajlara ilk 5 dakika içinde cevap verin.',
        'Kişiselleştirilmiş bir selamlama kullanın.',
        'Müşterinin ismini mutlaka öğrenin ve kullanın.',
        'Yardımcı olma isteğinizi net bir şekilde belli edin.'
      ]
    },
    {
      title: 'İhtiyaç Analizi ve Soru Sorma',
      icon: Target,
      items: [
        'Ucu açık sorular sorarak müşteriyi konuşturun.',
        'Projenin amacını ve aciliyet durumunu anlayın.',
        'Sadece fiyat değil, kalite ve çözüm odaklı yaklaşın.'
      ]
    },
    {
      title: 'Fiyat İtirazlarını Yönetme',
      icon: Star,
      items: [
        'Fiyatı söylemeden önce mutlaka değer önerinizi anlatın.',
        'Rakiplerle aranızdaki farkı (hizmet, garanti, kalite) vurgulayın.',
        'Maliyeti değil, yatırımın geri dönüşünü (dayanıklılık vb.) hatırlatın.'
      ]
    },
    {
      title: 'Satışı Kapatma (Closing)',
      icon: CheckCircle2,
      items: [
        'Ödeme seçeneklerini (taksit, nakit indirim) sunun.',
        'Stok durumunun azaldığını belirterek aciliyet oluşturun.',
        'Net bir "Eylem Çağrısı" (CTA) ile görüşmeyi sonlandırın.'
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-700">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-accent/20 rounded-2xl">
          <BookOpen className="text-accent w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">{currentSector?.name} Satış Eğitimi</h2>
          <p className="text-slate-400">Satışlarınızı artırmak için profesyonel ipuçları</p>
        </div>
      </div>

      <div className="space-y-4">
        {trainingData.map((section, idx) => (
          <div key={idx} className="glass-card overflow-hidden transition-all">
            <button 
              onClick={() => setOpenSection(openSection === idx ? null : idx)}
              className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-accent">
                  <section.icon size={20} />
                </div>
                <span className="font-bold text-lg text-white">{section.title}</span>
              </div>
              <ChevronDown className={cn("text-slate-500 transition-transform duration-300", openSection === idx && "rotate-180")} />
            </button>
            
            {openSection === idx && (
              <div className="px-6 pb-6 pt-2 animate-in slide-in-from-top-2 duration-300">
                <div className="h-px bg-glass-border mb-6" />
                <ul className="space-y-4">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                      <div className="mt-1 w-5 h-5 rounded-full border-2 border-accent/30 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-all">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      </div>
                      <span className="text-slate-300 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Checklist Section */}
      <div className="mt-12 p-8 bg-gradient-to-br from-accent/10 to-transparent border border-accent/20 rounded-3xl">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <CheckCircle2 className="text-accent" />
          Hızlı Satış Check-list
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'Ürün kataloğu hazır mı?',
            'Birim fiyatlar güncel mi?',
            'WhatsApp Business yüklü mü?',
            'Hızlı cevaplar kaydedildi mi?'
          ].map((check, i) => (
            <label key={i} className="flex items-center gap-3 p-4 bg-slate-900/40 rounded-xl border border-glass-border cursor-pointer hover:border-accent/40 transition-all">
              <input type="checkbox" className="w-5 h-5 rounded border-glass-border bg-transparent accent-accent" />
              <span className="text-sm font-semibold">{check}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
