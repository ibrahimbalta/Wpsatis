'use client';

import React, { useMemo } from 'react';
import { useSector } from '@/context/SectorContext';
import { mockTemplates } from '@/data/mockTemplates';
import { Copy, Send, ExternalLink, MessageSquareOff } from 'lucide-react';

export function TemplateList({ searchQuery }: { searchQuery: string }) {
  const { currentSector } = useSector();

  const filteredTemplates = useMemo(() => {
    if (!currentSector) return [];
    
    return mockTemplates.filter(t => 
      t.sectorId === currentSector.id &&
      (t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
       t.body.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [currentSector, searchQuery]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Şablon kopyalandı!');
  };

  const handleWhatsApp = (text: string) => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (filteredTemplates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 glass-card">
        <MessageSquareOff size={48} className="mb-4 opacity-20" />
        <p className="text-lg font-medium">Bu sektör için henüz şablon bulunamadı.</p>
        <p className="text-sm">Yandaki "+" butonu ile yeni bir şablon ekleyebilirsiniz.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      {filteredTemplates.map((template) => (
        <div key={template.id} className="glass-card p-6 group hover:border-accent/40 transition-all duration-300 flex flex-col shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <span className="px-3 py-1 bg-slate-800 text-slate-400 text-[10px] font-black rounded-md uppercase tracking-widest border border-glass-border">
              {template.category}
            </span>
            <button className="text-slate-600 hover:text-white transition-colors">
              <ExternalLink size={16} />
            </button>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors leading-tight">
            {template.title}
          </h3>
          
          <div className="relative flex-1">
            <p className="text-slate-400 text-sm leading-relaxed mb-8 line-clamp-4 italic">
              "{template.body}"
            </p>
            <div className="absolute -bottom-2 left-0 w-full h-8 bg-gradient-to-t from-[#0a0f1d] to-transparent opacity-20" />
          </div>
          
          <div className="flex gap-2 mt-4 pt-4 border-t border-glass-border">
            <button 
              onClick={() => handleCopy(template.body)}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-sm font-bold rounded-xl transition-all active:scale-95 text-slate-300"
            >
              <Copy size={16} />
              Kopyala
            </button>
            <button 
              onClick={() => handleWhatsApp(template.body)}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-sm font-bold text-white rounded-xl transition-all active:scale-95 shadow-lg shadow-[#25D366]/10"
            >
              <Send size={16} />
              WhatsApp
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
