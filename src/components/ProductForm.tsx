'use client';

import React, { useState } from 'react';
import { createProduct } from '@/lib/actions';
import { parseListingWithAI } from '@/lib/ai-actions';
import { 
  Building2, 
  MapPin, 
  Home, 
  Maximize, 
  Save, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  MessageSquare,
  Image as ImageIcon,
  Link as LinkIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProductForm() {
  const [isParsing, setIsParsing] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [showAiInput, setShowAiInput] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Konut',
    description: '',
    location: '',
    rooms: '3+1',
    squareMeters: '',
    floorLevel: '',
    isRental: 'false',
    externalUrl: '',
    imageUrl: '', // Yeni Görsel URL Alanı
  });

  const handleAiSmartFill = async () => {
    if (!aiInput) return;
    setIsParsing(true);
    try {
      const result = await parseListingWithAI(aiInput);
      if (result) {
        setFormData(prev => ({
          ...prev,
          name: result.name || prev.name,
          price: result.price?.toString() || prev.price,
          category: result.category || prev.category,
          description: result.description || prev.description,
          location: result.location || prev.location,
          rooms: result.rooms || prev.rooms,
          squareMeters: result.squareMeters?.toString() || prev.squareMeters,
          floorLevel: result.floorLevel || prev.floorLevel,
          isRental: result.isRental ? 'true' : 'false',
        }));
        setShowAiInput(false);
        setAiInput('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsParsing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await createProduct(form);
    setStatus('success');
    setTimeout(() => {
      setStatus('idle');
      setFormData({
        name: '', price: '', category: 'Konut', description: '',
        location: '', rooms: '3+1', squareMeters: '', floorLevel: '',
        isRental: 'false', externalUrl: '', imageUrl: '',
      });
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* AI Smart Fill Header */}
      <div className="glass-card p-8 bg-gradient-to-br from-accent/10 to-transparent border-accent/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Sparkles size={120} />
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center text-white shadow-xl shadow-accent/20">
                <Sparkles size={28} />
             </div>
             <div>
                <h3 className="text-xl font-black text-white leading-tight">AI Akıllı İlan Tanıma</h3>
                <p className="text-slate-400 text-sm font-medium">İlan metnini yapıştırın, form kendiliğinden dolsun.</p>
             </div>
          </div>
          
          {!showAiInput ? (
            <button 
              onClick={() => setShowAiInput(true)}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all active:scale-95"
            >
              Metin Yapıştır
            </button>
          ) : (
            <div className="flex-1 flex gap-2 w-full">
               <input 
                 value={aiInput}
                 onChange={(e) => setAiInput(e.target.value)}
                 placeholder="Sahibinden ilan açıklamasını buraya yapıştırın..."
                 className="flex-1 bg-slate-900/50 border border-accent/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-accent"
               />
               <button 
                onClick={handleAiSmartFill}
                disabled={isParsing || !aiInput}
                className="px-6 py-2 bg-accent hover:bg-accent-light text-white font-black rounded-xl disabled:opacity-50 transition-all flex items-center gap-2"
               >
                 {isParsing ? <Loader2 size={18} className="animate-spin" /> : 'DOLDUR'}
               </button>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-10 space-y-10 border-white/5 bg-[#0a0f1d]/60">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          {/* İsim & Kategori */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">İlan Başlığı</label>
            <div className="relative">
              <input 
                name="name" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Örn: Bartın Merkezde Deniz Manzaralı 3+1"
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all pl-12 font-medium" 
              />
              <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Emlak Tipi</label>
            <select 
              name="category"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all font-medium appearance-none"
            >
              <option>Konut</option>
              <option>İşyeri</option>
              <option>Arsa</option>
              <option>Bina</option>
              <option>Turistik Tesis</option>
            </select>
          </div>

          {/* Konum & Fiyat */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Konum</label>
            <div className="relative">
              <input 
                name="location" 
                required 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="İl / İlçe / Mahalle"
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all pl-12 font-medium" 
              />
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Fiyat (TL)</label>
            <div className="relative">
              <input 
                name="price" 
                type="number" 
                required 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="0.00"
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all pl-12 font-bold text-lg" 
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₺</span>
            </div>
          </div>

          {/* Emlak Teknik Detaylar */}
          <div className="grid grid-cols-2 gap-4 col-span-1 md:col-span-2">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Oda Sayısı</label>
              <input 
                name="rooms" 
                value={formData.rooms}
                onChange={(e) => setFormData({...formData, rooms: e.target.value})}
                placeholder="3+1, 2+1 vb."
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all font-medium" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Net Metrekare</label>
              <div className="relative">
                <input 
                  name="squareMeters"
                  type="number"
                  value={formData.squareMeters}
                  onChange={(e) => setFormData({...formData, squareMeters: e.target.value})}
                  placeholder="120"
                  className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all" 
                />
                <Maximize className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Bulundğu Kat</label>
              <input 
                name="floorLevel"
                value={formData.floorLevel}
                onChange={(e) => setFormData({...formData, floorLevel: e.target.value})}
                placeholder="2. Kat, Giriş vb."
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">İlan Durumu</label>
              <select 
                name="isRental"
                value={formData.isRental}
                onChange={(e) => setFormData({...formData, isRental: e.target.value})}
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all appearance-none"
              >
                <option value="false">Satılık</option>
                <option value="true">Kiralık</option>
              </select>
            </div>
          </div>

          {/* Görsel ve Harici Linkler */}
          <div className="space-y-3 col-span-1 md:col-span-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 text-accent">İlan Fotoğraf URL (Premium Vitrin İçin)</label>
            <div className="relative">
              <input 
                name="imageUrl" 
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                placeholder="https://resim-linki.com/foto.jpg"
                className="w-full bg-slate-900/50 border border-accent/20 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all pl-12 font-medium" 
              />
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={18} />
            </div>
          </div>

          <div className="space-y-3 col-span-1 md:col-span-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Harici İlan Linki (Sahibinden vb.)</label>
            <div className="relative">
              <input 
                name="externalUrl" 
                value={formData.externalUrl}
                onChange={(e) => setFormData({...formData, externalUrl: e.target.value})}
                placeholder="https://www.sahibinden.com/ilan/..."
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all pl-12 font-medium opacity-60" 
              />
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            </div>
          </div>

          <div className="space-y-3 col-span-1 md:col-span-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">İlan Açıklaması</label>
            <textarea 
              name="description" 
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-slate-900/50 border border-white/5 rounded-3xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all resize-none font-medium"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={status === 'success'}
          className={cn(
            "w-full py-5 rounded-[28px] font-black text-xl transition-all shadow-2xl flex items-center justify-center gap-4 active:scale-[0.98]",
            status === 'success' 
              ? "bg-green-500 text-white shadow-green-500/20" 
              : "bg-accent hover:bg-accent-light text-white shadow-accent/40"
          )}
        >
          {status === 'success' ? (
            <>
              <CheckCircle2 size={24} />
              İLAN PORTFÖYE EKLENDİ
            </>
          ) : (
            <>
              <Save size={24} />
              YAYINA AL VE KAYDET
            </>
          )}
        </button>
      </form>
    </div>
  );
}
