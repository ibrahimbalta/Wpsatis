'use client';

import React, { useState, useEffect } from 'react';
import { useSector } from '@/context/SectorContext';
import { Calculator, Send, Copy, RefreshCw } from 'lucide-react';

export function PricingCalculator() {
  const { currentSector } = useSector();
  const [values, setValues] = useState({
    area: '',
    pricePerUnit: '',
    wasteRate: '10', // Default 10%
  });
  
  const [result, setResult] = useState<{
    totalArea: number;
    totalPrice: number;
    message: string;
  } | null>(null);

  // Calculation logic for Ceramics (default for now)
  const calculate = () => {
    const area = parseFloat(values.area) || 0;
    const price = parseFloat(values.pricePerUnit) || 0;
    const waste = parseFloat(values.wasteRate) || 0;

    const totalArea = area * (1 + waste / 100);
    const totalPrice = totalArea * price;

    const message = `Merhaba, projeniz için yaptığımız hesaplama sonucu:\n\n` +
      `Net Alan: ${area} m²\n` +
      `Zayiat Payı (%${waste}): ${totalArea.toFixed(2)} m² (Önerilen)\n` +
      `Birim Fiyat: ${price} TL\n` +
      `━━━━━━━━━━━━━━━\n` +
      `Toplam Tutar: ${totalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL\n\n` +
      `Detaylar için mağazamıza bekleriz.`;

    setResult({ totalArea, totalPrice, message });
  };

  useEffect(() => {
    if (values.area && values.pricePerUnit) {
      calculate();
    } else {
      setResult(null);
    }
  }, [values]);

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.message);
      alert('Mesaj kopyalandı!');
    }
  };

  const handleWhatsApp = () => {
    if (result) {
      const encoded = encodeURIComponent(result.message);
      window.open(`https://wa.me/?text=${encoded}`, '_blank');
    }
  };

  return (
    <div className="glass-card p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-accent/20 rounded-lg">
          <Calculator className="text-accent w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Fiyat Hesaplayıcı</h2>
          <p className="text-sm text-slate-400">Hızlıca teklif mesajı oluşturun</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Alan (m²)</label>
          <input 
            type="number" 
            value={values.area}
            onChange={(e) => setValues({...values, area: e.target.value})}
            placeholder="Örn: 50"
            className="w-full bg-slate-800/50 border border-glass-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Birim Fiyat (TL)</label>
          <input 
            type="number" 
            value={values.pricePerUnit}
            onChange={(e) => setValues({...values, pricePerUnit: e.target.value})}
            placeholder="Örn: 450"
            className="w-full bg-slate-800/50 border border-glass-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-all"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-300">Zayiat Payı (%)</label>
          <input 
            type="range" 
            min="0" 
            max="25" 
            value={values.wasteRate}
            onChange={(e) => setValues({...values, wasteRate: e.target.value})}
            className="w-full accent-accent bg-slate-800"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>Standart (%0)</span>
            <span className="text-accent font-bold">Seçili: %{values.wasteRate}</span>
            <span>Profesyonel (%25)</span>
          </div>
        </div>
      </div>

      {result && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="p-4 bg-slate-900/50 rounded-xl border border-glass-border">
            <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
              {result.message}
            </pre>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-sm font-medium rounded-xl transition-all active:scale-95"
            >
              <Copy size={18} />
              Kopyala
            </button>
            <button 
              onClick={handleWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-sm font-bold text-white rounded-xl transition-all active:scale-95"
            >
              <Send size={18} />
              WhatsApp ile Gönder
            </button>
          </div>
        </div>
      )}

      {!result && (
        <div className="flex flex-col items-center justify-center py-12 text-slate-500 border-2 border-dashed border-glass-border rounded-2xl">
          <RefreshCw size={32} className="mb-2 opacity-20" />
          <p className="text-sm">Hesaplama yapmak için değerleri girin</p>
        </div>
      )}
    </div>
  );
}
