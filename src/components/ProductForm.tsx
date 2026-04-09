'use client';

import React, { useState } from 'react';
import { Loader2, Building2, MapPin, Home, Link as LinkIcon, Sparkles, Wand2 } from 'lucide-react';
import { createProduct } from '@/lib/actions';

interface ProductFormProps {
  onSuccess: () => void;
}

export function ProductForm({ onSuccess }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiText, setAiText] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Konut',
    description: '',
    rooms: '',
    squareMeters: '',
    floorLevel: '',
    location: '',
    isRental: 'false',
    externalUrl: ''
  });

  const handleAiParse = async () => {
    if (!aiText) return;
    setIsAiProcessing(true);
    try {
      // Bu fonksiyon sunucu tarafında çalışacak (Vercel AI SDK)
      // Şimdilik simüle ediyoruz, birazdan lib/ai-actions.ts içinden gerçek çağırımı bağlayacağız
      alert('Yapay zeka ilan metnini analiz ediyor... (Gemini API anahtarı eklenmelidir)');
      // Not: Gerçek bağlantı için /api/ai/parse gibi bir endpoint gerekecek
    } catch (error) {
      console.error(error);
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      await createProduct(data);
      onSuccess();
    } catch (error) {
      alert('İlan oluşturulurken hata oluştu!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* AI İçe Aktarma Bölümü */}
      <div className="bg-accent/5 border border-accent/20 rounded-3xl p-6 space-y-4 animate-in fade-in duration-500">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-accent/20 rounded-xl flex items-center justify-center text-accent">
            <Sparkles size={16} />
          </div>
          <h3 className="text-sm font-black text-white uppercase tracking-wider">AI ile İlan Tanıma</h3>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">
          Sahibinden veya başka bir platformdaki ilan metnini buraya yapıştırın, bilgileri formun altına otomatik dolduralım.
        </p>
        <div className="relative">
          <textarea 
            rows={3}
            placeholder="İlan başlığı, m2, oda sayısı içeren herhangi bir metin yapıştırın..."
            value={aiText}
            onChange={(e) => setAiText(e.target.value)}
            className="w-full bg-slate-900/40 border border-white/5 rounded-2xl p-4 text-xs text-slate-300 focus:outline-none focus:border-accent transition-all resize-none"
          />
          <button
            type="button"
            onClick={handleAiParse}
            disabled={isAiProcessing || !aiText}
            className="absolute right-3 bottom-3 py-2 px-4 bg-accent hover:bg-accent-light text-[10px] font-black text-white rounded-xl transition-all flex items-center gap-2 shadow-lg disabled:opacity-30"
          >
            {isAiProcessing ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
            AI İLE ANALİZ ET
          </button>
        </div>
      </div>

      <div className="h-px bg-white/5" />

      {/* Manuel Form Alanı */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block opacity-50">MANUEL İLAN DETAYLARI</label>
        
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">İlan Başlığı</label>
            <input 
              type="text" 
              required
              placeholder="Örn: Bartın Merkez Satılık 3+1 Daire"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all font-medium"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Fiyat (TL)</label>
              <input 
                type="number" 
                required
                placeholder="0"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all font-medium"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">İşlem Türü</label>
              <select 
                value={formData.isRental}
                onChange={(e) => setFormData({...formData, isRental: e.target.value})}
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all font-medium appearance-none"
              >
                <option value="false">Satılık</option>
                <option value="true">Kiralık</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Oda Sayısı</label>
              <input 
                type="text" 
                placeholder="Örn: 3+1"
                value={formData.rooms}
                onChange={(e) => setFormData({...formData, rooms: e.target.value})}
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all font-medium"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Metrekare (m²)</label>
              <input 
                type="number" 
                placeholder="Örn: 120"
                value={formData.squareMeters}
                onChange={(e) => setFormData({...formData, squareMeters: e.target.value})}
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Bulunduğu Kat</label>
              <input 
                type="text" 
                placeholder="Örn: 2 / Bahçe Katı"
                value={formData.floorLevel}
                onChange={(e) => setFormData({...formData, floorLevel: e.target.value})}
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all font-medium"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Konum / Mahalle</label>
              <input 
                type="text" 
                placeholder="Örn: Bartın / Merkez"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Mülk Tipi</label>
            <input 
              type="text" 
              placeholder="Örn: Daire, Villa, Arsa..."
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all font-medium"
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block flex items-center gap-2">
              <LinkIcon size={12} /> İlan Linki
            </label>
            <input 
              type="url" 
              placeholder="https://www.sahibinden.com/ilan/..."
              value={formData.externalUrl}
              onChange={(e) => setFormData({...formData, externalUrl: e.target.value})}
              className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all font-medium"
            />
          </div>

          <div>
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Müşteri Tanıtım Notu</label>
             <textarea 
               rows={3}
               placeholder="Botun müşteriye anlatacağı özel detaylar..."
               value={formData.description}
               onChange={(e) => setFormData({...formData, description: e.target.value})}
               className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all font-medium resize-none shadow-inner"
             />
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full py-5 bg-accent hover:bg-accent-light text-white font-black rounded-3xl transition-all shadow-2xl shadow-accent/20 active:scale-95 flex items-center justify-center gap-3 text-lg"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Building2 size={24} className="stroke-[3px]" />}
          İlanı Portföye Kaydet
        </button>
      </form>
    </div>
  );
}
