'use client';

import React, { useMemo } from 'react';
import { useSector } from '@/context/SectorContext';
import { mockProducts } from '@/data/mockProducts';
import { Send, Package, ShoppingBag } from 'lucide-react';

export function ProductList({ searchQuery }: { searchQuery: string }) {
  const { currentSector } = useSector();

  const filteredProducts = useMemo(() => {
    if (!currentSector) return [];
    
    return mockProducts.filter(p => 
      p.sectorId === currentSector.id &&
      (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       p.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [currentSector, searchQuery]);

  const handleWhatsApp = (product: any) => {
    const message = `Merhaba, [Mağaza İsmi] üzerinden şu ürünle ilgileniyorum:\n\n` +
      `*Ürün:* ${product.name}\n` +
      `*Kategori:* ${product.category}\n` +
      `*Fiyat:* ${product.price.toLocaleString('tr-TR')} TL\n\n` +
      `Detaylı bilgi alabilir miyim?`;
      
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 glass-card">
        <Package size={48} className="mb-4 opacity-20" />
        <p className="text-lg font-medium">Bu sektör için henüz ürün bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
      {filteredProducts.map((product) => (
        <div key={product.id} className="glass-card overflow-hidden group hover:scale-[1.02] transition-all flex flex-col h-full bg-slate-900/20">
          <div className="aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-slate-700 font-black text-4xl opacity-10 select-none group-hover:scale-110 transition-transform">
              {product.imageLabel}
            </div>
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 bg-accent/20 backdrop-blur-md text-[9px] font-black text-accent rounded uppercase tracking-widest border border-accent/20">
                {product.category}
              </span>
            </div>
          </div>
          
          <div className="p-5 flex flex-col flex-1">
            <h4 className="font-bold text-lg text-white mb-1 group-hover:text-accent transition-colors">
              {product.name}
            </h4>
            <p className="text-slate-500 text-xs mb-6 leading-relaxed line-clamp-2">
              {product.description}
            </p>
            
            <div className="mt-auto pt-4 border-t border-glass-border flex items-end justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Fiyat</span>
                <span className="text-xl font-black text-white">
                  {product.price.toLocaleString('tr-TR')} 
                  <span className="text-xs text-slate-500 ml-1">TL</span>
                </span>
              </div>
              
              <button 
                onClick={() => handleWhatsApp(product)}
                className="p-3 bg-slate-800 hover:bg-accent text-slate-300 hover:text-white rounded-xl transition-all shadow-lg active:scale-90"
                title="WhatsApp ile Paylaş"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
