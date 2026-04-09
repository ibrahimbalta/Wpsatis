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
  Image as ImageIcon,
  Link as LinkIcon,
  Layers,
  Plus,
  Navigation
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
    imageUrl: '',
    extraImages: '',
    latitude: '',
    longitude: '', // Harita Koordinatları
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
    
    // extraImages alanını JSON dizisi haline getirip gönder
    const imagesArray = formData.extraImages
      .split('\n')
      .map(url => url.trim())
      .filter(url => url !== '');
    form.set('extraImages', JSON.stringify(imagesArray));
    
    await createProduct(form);
    setStatus('success');
    setTimeout(() => {
      setStatus('idle');
      setFormData({
        name: '', price: '', category: 'Konut', description: '',
        location: '', rooms: '3+1', squareMeters: '', floorLevel: '',
        isRental: 'false', externalUrl: '', imageUrl: '', extraImages: '',
        latitude: '', longitude: '',
      });
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
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
                <h3 className="text-xl font-black text-white leading-tight">AI Smart Fill</h3>
                <p className="text-slate-400 text-sm font-medium">İlan metninden tüm detayları otomatik çıkarın.</p>
             </div>
          </div>
          
          <div className="flex-1 flex gap-2 w-full md:max-w-md">
             <input 
               value={aiInput}
               onChange={(e) => setAiInput(e.target.value)}
               placeholder="İlan metnini buraya yapıştırın..."
               className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-all text-sm"
             />
             <button 
              onClick={handleAiSmartFill}
              disabled={isParsing || !aiInput}
              className="px-6 py-3 bg-accent hover:bg-accent-light text-white font-black rounded-xl disabled:opacity-50 transition-all flex items-center gap-2"
             >
               {isParsing ? <Loader2 size={18} className="animate-spin" /> : 'ANALİZ'}
             </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-10 space-y-12 border-white/5 bg-[#0a0f1d]/60 shadow-[0_32px_64px_rgba(0,0,0,0.4)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {/* Temel Bilgiler */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">İlan Başlığı</label>
            <div className="relative">
              <input 
                name="name" required value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Örn: Boğaz Manzaralı Lüks Rezidans"
                className="w-full bg-slate-900/40 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all pl-12 font-semibold" 
              />
              <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Kategori</label>
            <select 
              name="category" value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full bg-slate-900/40 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all appearance-none font-semibold"
            >
              <option>Konut</option>
              <option>İşyeri</option>
              <option>Arsa</option>
              <option>Bina</option>
              <option>Villa</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Konum</label>
            <div className="relative">
              <input 
                name="location" required value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Şehir / İlçe / Mahalle"
                className="w-full bg-slate-900/40 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all pl-12" 
              />
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Fiyat (TL)</label>
            <div className="relative">
              <input 
                name="price" type="number" required value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="0"
                className="w-full bg-slate-900/40 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all pl-10 font-bold text-lg" 
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold">₺</span>
            </div>
          </div>

          {/* Harita Koordinatları (Yeni Alan) */}
          <div className="col-span-1 md:col-span-2 p-6 bg-accent/5 rounded-3xl border border-accent/10 space-y-6">
             <div className="flex items-center gap-3">
                <Navigation size={20} className="text-accent" />
                <h4 className="text-xs font-black text-white uppercase tracking-widest">Harita Koordinatları (Opsiyonel)</h4>
             </div>
             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Enlem (Latitude)</label>
                  <input 
                    name="latitude" value={formData.latitude}
                    onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                    placeholder="Örn: 41.63"
                    className="w-full bg-slate-900/40 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Boylam (Longitude)</label>
                  <input 
                    name="longitude" value={formData.longitude}
                    onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                    placeholder="Örn: 32.33"
                    className="w-full bg-slate-900/40 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent" 
                  />
                </div>
             </div>
             <p className="text-[9px] text-slate-500 font-bold italic">Nokta atışı konum gösterimi için Google Haritalar'dan alınan koordinatları buraya girebilirsiniz.</p>
          </div>

          {/* Teknik Özellikler */}
          <div className="grid grid-cols-2 gap-4 col-span-1 md:col-span-2 py-4 border-y border-white/5">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Oda Sayısı</label>
              <input name="rooms" value={formData.rooms} onChange={(e) => setFormData({...formData, rooms: e.target.value})} className="w-full bg-slate-900/30 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent font-semibold" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Metrekare</label>
              <input name="squareMeters" type="number" value={formData.squareMeters} onChange={(e) => setFormData({...formData, squareMeters: e.target.value})} className="w-full bg-slate-900/30 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent font-bold" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Kat</label>
              <input name="floorLevel" value={formData.floorLevel} onChange={(e) => setFormData({...formData, floorLevel: e.target.value})} className="w-full bg-slate-900/30 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">İlan Türü</label>
              <select name="isRental" value={formData.isRental} onChange={(e) => setFormData({...formData, isRental: e.target.value})} className="w-full bg-slate-900/30 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent font-black uppercase text-xs tracking-widest">
                <option value="false">Satılık</option>
                <option value="true">Kiralık</option>
              </select>
            </div>
          </div>

          {/* Multimedya Galeri Yönetimi */}
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center text-accent">
                  <ImageIcon size={18} />
               </div>
               <h4 className="text-sm font-black text-white uppercase tracking-widest">Görsel Vitrininizi Yönetin</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Kapak Fotoğrafı (URL)</label>
                  <div className="relative">
                    <input 
                      name="imageUrl" value={formData.imageUrl}
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                      placeholder="https://gorsel.com/kapak.jpg"
                      className="w-full bg-slate-900/40 border border-accent/20 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent pl-12" 
                    />
                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={18} />
                  </div>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Galeri Fotoğrafları (URL)</label>
                  <textarea 
                    placeholder="Her satıra bir fotoğraf linki (URL) gelecek şekilde yapıştırın..."
                    value={formData.extraImages}
                    onChange={(e) => setFormData({...formData, extraImages: e.target.value})}
                    rows={4}
                    className="w-full bg-slate-900/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent font-mono text-[10px] leading-relaxed"
                  />
               </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-4">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Açıklama</label>
            <textarea 
              name="description" rows={5} value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-slate-900/40 border border-white/5 rounded-[32px] px-6 py-5 text-white focus:outline-none focus:border-accent resize-none font-medium leading-relaxed"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={status === 'success'}
          className={cn(
            "w-full py-6 rounded-[32px] font-black text-xl transition-all shadow-2xl flex items-center justify-center gap-4 active:scale-[0.98]",
            status === 'success' 
              ? "bg-green-500 text-white shadow-green-500/20" 
              : "bg-accent hover:bg-accent-light text-white shadow-accent/40"
          )}
        >
          {status === 'success' ? (
            <>
              <CheckCircle2 size={24} />
              PORTFÖY YAYINA ALINDI
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
