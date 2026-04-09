'use client';

import React, { useState, useEffect } from 'react';
import { useSector } from '@/context/SectorContext';
import { getProducts } from '@/lib/actions';
import { Send, Building2, MapPin, Home, Maximize, Loader2, Link as LinkIcon } from 'lucide-react';

export function ProductList({ searchQuery }: { searchQuery: string }) {
  const { currentSector } = useSector();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    const message = `🏠 *YENİ İLAN:* ${p.name}\n\n` +
      `📍 *Konum:* ${p.location || 'Belirtilmedi'}\n` +
      `💰 *Fiyat:* ${Number(p.price).toLocaleString('tr-TR')} TL (${type})\n` +
      `🛏️ *Oda:* ${p.rooms || '-'}\n` +
      `📐 *M²:* ${p.squareMeters || '-'} m²\n` +
      `🏢 *Kat:* ${p.floorLevel || '-'}\n\n` +
      `📝 *Not:* ${p.description || '-'}\n\n` +
      (p.externalUrl ? `🔗 *İlan Detayı:* ${p.externalUrl}\n\n` : '') +
      `Detaylı bilgi ve randevu için ulaşabilirsiniz.`;
      
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

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 glass-card border-dashed">
        <Building2 size={48} className="mb-4 opacity-20" />
        <p className="text-lg font-medium">Henüz portföyünüzde ilan bulunamadı.</p>
        <p className="text-sm opacity-60">"Yeni Kayıt" butonu ile ilk ilanınızı ekleyebilirsiniz.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {filteredProducts.map((p) => (
        <div key={p.id} className="glass-card overflow-hidden group hover:scale-[1.02] transition-all flex flex-col h-full bg-slate-900/40 border-white/5 active:scale-[0.98]">
          {/* İlan Görsel Alanı (Placeholder) */}
          <div className="aspect-[16/10] bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-slate-700 font-black text-6xl opacity-10 select-none group-hover:scale-110 transition-transform duration-500">
              {p.isRental ? 'KİRALIK' : 'SATILIK'}
            </div>
            {/* Rozetler */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className={`px-3 py-1.5 backdrop-blur-md text-[10px] font-black rounded-lg uppercase tracking-wider border ${p.isRental ? 'bg-blue-500/20 text-blue-400 border-blue-500/20' : 'bg-orange-500/20 text-orange-400 border-orange-500/20'}`}>
                {p.isRental ? 'Kiralık' : 'Satılık'}
              </span>
              <span className="px-3 py-1.5 bg-slate-900/60 backdrop-blur-md text-[10px] font-black text-slate-300 rounded-lg uppercase tracking-wider border border-white/10">
                {p.category}
              </span>
            </div>
          </div>
          
          <div className="p-6 flex flex-col flex-1">
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-bold text-xl text-white leading-tight group-hover:text-accent transition-colors">
                {p.name}
              </h4>
            </div>

            <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
              <MapPin size={14} className="text-accent" />
              <span>{p.location || 'Konum belirtilmedi'}</span>
            </div>

            {/* Emlak Detayları Grid */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <div className="bg-white/5 rounded-xl p-3 flex flex-col items-center justify-center border border-white/5 group-hover:bg-accent/5 transition-colors">
                <Home size={14} className="text-slate-500 mb-1" />
                <span className="text-[11px] font-bold text-slate-200">{p.rooms || '-'}</span>
              </div>
              <div className="bg-white/5 rounded-xl p-3 flex flex-col items-center justify-center border border-white/5 group-hover:bg-accent/5 transition-colors">
                <Maximize size={14} className="text-slate-500 mb-1" />
                <span className="text-[11px] font-bold text-slate-200">{p.squareMeters || '-'} m²</span>
              </div>
              <div className="bg-white/5 rounded-xl p-3 flex flex-col items-center justify-center border border-white/5 group-hover:bg-accent/5 transition-colors">
                <Building2 size={14} className="text-slate-500 mb-1" />
                <span className="text-[11px] font-bold text-slate-200">{p.floorLevel || '-'}. Kat</span>
              </div>
            </div>
            
            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">İSTENEN FİYAT</span>
                <span className="text-2xl font-black text-white tracking-tight">
                  {Number(p.price).toLocaleString('tr-TR')} 
                  <span className="text-sm text-accent ml-1.5">TL</span>
                </span>
              </div>
              
              <div className="flex gap-2">
                {p.externalUrl && (
                  <a 
                    href={p.externalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl transition-all active:scale-95"
                    title="İlan Linki"
                  >
                    <LinkIcon size={18} />
                  </a>
                )}
                <button 
                  onClick={() => handleWhatsApp(p)}
                  className="p-4 bg-accent hover:bg-accent-light text-white rounded-2xl transition-all shadow-xl shadow-accent/20 active:scale-90 flex items-center justify-center"
                  title="WhatsApp ile Paylaş"
                >
                  <Send size={18} className="stroke-[3px]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
