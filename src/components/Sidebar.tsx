'use client';

import React, { useState } from 'react';
import { useSector, Sector } from '@/context/SectorContext';
import { 
  MessageSquare, 
  Calculator, 
  Package, 
  BookOpen, 
  Settings, 
  ChevronDown,
  LayoutDashboard,
  Check,
  Zap,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { currentSector, setCurrentSector, availableSectors } = useSector();
  const [isSectorOpen, setIsSectorOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
    { icon: MessageSquare, label: 'Mesaj Şablonları', id: 'templates' },
    { icon: Zap, label: 'Bot Yönetimi', id: 'bot' },
    { icon: Sparkles, label: 'AI Asistanı', id: 'ai' },
    { icon: Calculator, label: 'Fiyat Hesaplayıcı', id: 'calculator' },
    { icon: Package, label: 'Ürün Kataloğu', id: 'catalog' },
    { icon: BookOpen, label: 'Satış Eğitimi', id: 'training' },
  ];

  return (
    <aside className="w-72 glass-card h-[calc(100vh-2rem)] sticky top-4 left-4 flex flex-col p-4 z-50">
      <div className="flex items-center gap-3 px-3 py-2 mb-8">
        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
          <MessageSquare className="text-white w-6 h-6" />
        </div>
        <div>
          <span className="font-black text-xl tracking-tight text-white block leading-none">Wpsatis</span>
          <span className="text-[10px] text-accent font-bold uppercase tracking-widest">Satış Kiti</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={cn(
              "nav-item w-full group",
              item.id === 'templates' && "active bg-accent/10 border-r-2 border-accent"
            )}
          >
            <item.icon size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-semibold">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 flex flex-col gap-4">
        {/* Sector Selector */}
        <div className="relative">
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2 px-3">
            Sektör Değiştir
          </p>
          <button 
            onClick={() => setIsSectorOpen(!isSectorOpen)}
            className="w-full flex items-center justify-between px-3 py-3 bg-slate-900/50 hover:bg-slate-800 border border-glass-border rounded-xl transition-all group"
          >
            <div className="flex flex-col items-start">
              <span className="text-sm font-bold text-white leading-tight">
                {currentSector?.name}
              </span>
            </div>
            <ChevronDown size={14} className={cn("text-slate-500 transition-transform duration-300", isSectorOpen && "rotate-180")} />
          </button>

          {isSectorOpen && (
            <div className="absolute bottom-full left-0 w-full mb-2 bg-[#1e293b] border border-glass-border rounded-xl shadow-2xl overflow-y-auto max-h-80 animate-in slide-in-from-bottom-2 duration-200 z-50 scroller-thin">
              {availableSectors.map((sector) => (
                <button
                  key={sector.id}
                  onClick={() => {
                    setCurrentSector(sector);
                    setIsSectorOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 text-sm transition-all hover:bg-accent/10",
                    currentSector?.id === sector.id ? "text-accent bg-accent/5" : "text-slate-300"
                  )}
                >
                  <span className={cn(currentSector?.id === sector.id ? "font-bold" : "font-medium")}>
                    {sector.name}
                  </span>
                  {currentSector?.id === sector.id && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="border-t border-glass-border my-2" />

        <button className="nav-item w-full">
          <Settings size={20} />
          <span className="font-semibold">Ayarlar</span>
        </button>
      </div>
    </aside>
  );
}
