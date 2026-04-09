'use client';

import React, { useState, useEffect } from 'react';
import { useSector } from '@/context/SectorContext';
import { getProducts } from '@/lib/actions';
import { Send, Building2, MapPin, Home, Maximize, Loader2, Link as LinkIcon, Eye, Target, Sparkles } from 'lucide-react';
import { StoryCard } from './StoryCard';
import { AnimatePresence } from 'framer-motion';

export function ProductList({ searchQuery }: { searchQuery: string }) {
  const { currentSector } = useSector();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState<any>(null);

  useEffect(() => {
    async function fetchProducts() {
      if (!currentSector) return;
      setIsLoading(true);
      const data = await getProducts(currentSector.id);
      setProducts(data);
      setIsLoading(false);
    }
    fetchProducts();
  }, [currentSector]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleWhatsApp = (p: any) => {
    const type = p.isRental ? 'KİRALIK' : 'SATILIK';
    const baseUrl = window.location.origin;
    const internalUrl = `${baseUrl}/ilan/${p.id}`;
    
    const message = `🏠 *YENİ İLAN:* ${p.name}\n\n` +
      `📍 *Konum:* ${p.location || 'Belirtilmedi'}\n` +
      `💰 *Fiyat:* ${Number(p.price).toLocaleString('tr-TR')} TL\n` +
      `🛏️ *Oda:* ${p.rooms || '-'}\n` +
      `📐 *M²:* ${p.squareMeters || '-'} m²\n\n` +
      `💎 *Detaylı Fotoğraflar ve Bilgi:* ${internalUrl}\n\n` +
      (p.externalUrl ? `🔗 *Referans Link:* ${p.externalUrl}\n\n` : '') +
      `Portföyümüz hakkında detaylı bilgi ve randevu için ulaşabilirsiniz.`;
      
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 glass-card">
        <Loader2 size={48} className="animate-spin mb-4 opacity-20" />
        <p className="text-lg font-medium">Portföy yükleniyor...</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {filteredProducts.map((p) => (
          <div key={p.id} className="glass-card overflow-hidden group hover:scale-[1.02] transition-all flex flex-col h-full bg-[#0a0f1d]/40 border-white/5 active:scale-[0.98]">
            {/* İlan Görsel Alanı */}
            <div className="aspect-[16/10] bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-700 font-black text-6xl opacity-10 select-none group-hover:scale-110 transition-transform duration-500 uppercase">
                  {p.category}
                </div>
              )}
              
              {/* Analitik Rozeti */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                 <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md text-[9px] font-black text-white rounded-lg border border-white/10 flex items-center gap-1.5">
                    <Eye size={12} className="text-accent" />
                    {p.viewCount}
                 </div>
                 <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md text-[9px] font-black text-white rounded-lg border border-white/10 flex items-center gap-1.5">
                    <Target size={12} className="text-green-500" />
                    {p.clickCount}
                 </div>
              </div>

              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`px-3 py-1.5 backdrop-blur-md text-[10px] font-black rounded-lg uppercase tracking-wider border ${p.isRental ? 'bg-blue-500/20 text-blue-400 border-blue-500/20' : 'bg-orange-500/20 text-orange-400 border-orange-500/20'}`}>
                  {p.isRental ? 'Kiralık' : 'Satılık'}
                </span>
                {p.imageUrl && (
                  <button 
                    onClick={() => setSelectedStory(p)}
                    className="px-3 py-1.5 bg-accent/20 backdrop-blur-md text-[10px] font-black text-accent rounded-lg border border-accent/20 flex items-center gap-1.5 hover:bg-accent/30 transition-all"
                  >
                    <Sparkles size={12} />
                    STORY MODU
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-xl text-white leading-tight group-hover:text-accent transition-colors line-clamp-2 min-h-[56px]">
                  {p.name}
                </h4>
              </div>

              <div className="flex items-center gap-2 text-slate-400 text-sm mb-6 font-medium">
                <MapPin size={14} className="text-accent" />
                <span className="truncate">{p.location || 'Konum belirtilmedi'}</span>
              </div>

              {/* Emlak Detayları Grid */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="bg-white/5 rounded-2xl p-3 flex flex-col items-center justify-center border border-white/5 group-hover:border-accent/20 transition-colors">
                  <Home size={14} className="text-slate-500 mb-1" />
                  <span className="text-[11px] font-bold text-white uppercase tracking-tighter">{p.rooms || '-'}</span>
                </div>
                <div className="bg-white/5 rounded-2xl p-3 flex flex-col items-center justify-center border border-white/5 group-hover:border-accent/20 transition-colors">
                  <Maximize size={14} className="text-slate-500 mb-1" />
                  <span className="text-[11px] font-bold text-white uppercase tracking-tighter">{p.squareMeters || '-'} m²</span>
                </div>
                <div className="bg-white/5 rounded-2xl p-3 flex flex-col items-center justify-center border border-white/5 group-hover:border-accent/20 transition-colors">
                  <Building2 size={14} className="text-slate-500 mb-1" />
                  <span className="text-[11px] font-bold text-white uppercase tracking-tighter">{p.floorLevel || '-'}. Kat</span>
                </div>
              </div>
              
              <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1 opacity-60">GÜNCEL FİYAT</span>
                  <span className="text-2xl font-black text-white tracking-tighter">
                    {Number(p.price).toLocaleString('tr-TR')} 
                    <span className="text-sm text-accent ml-1.5 font-bold">TL</span>
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <a 
                    href={`/ilan/${p.id}`} 
                    target="_blank" 
                    className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all border border-white/5 active:scale-90"
                    title="Müşteri Sayfasını Önizle"
                  >
                    <Eye size={18} />
                  </a>
                  <button 
                    onClick={() => handleWhatsApp(p)}
                    className="p-4 bg-accent hover:bg-accent-light text-white rounded-2xl transition-all shadow-xl shadow-accent/20 active:scale-90 flex items-center justify-center"
                    title="Link Oluştur ve Paylaş"
                  >
                    <Send size={18} className="stroke-[3px]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedStory && (
          <StoryCard 
            listing={selectedStory} 
            branding={{ companyName: 'Wpsatis Elite', logoUrl: '' }} 
            onClose={() => setSelectedStory(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
