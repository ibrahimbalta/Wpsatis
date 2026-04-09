'use client';

import React from 'react';
import { 
  MessageSquare, 
  Calculator, 
  Building2, 
  BookOpen, 
  Settings, 
  LayoutDashboard,
  Zap,
  Sparkles,
  Map,
  BadgeCent
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const menuItems = [
    { icon: Building2, label: 'İlan Portföyü', id: 'catalog' },
    { icon: MessageSquare, label: 'Mesaj Şablonları', id: 'templates' },
    { icon: Zap, label: 'WhatsApp Botu', id: 'bot' },
    { icon: Sparkles, label: 'Yapay Zeka Danışman', id: 'ai' },
    { icon: Calculator, label: 'Kredi Hesaplayıcı', id: 'calculator' },
    { icon: BadgeCent, label: 'Satış Akademisi', id: 'training' },
  ];

  return (
    <aside className="w-72 glass-card h-[calc(100vh-2rem)] sticky top-4 left-4 flex flex-col p-4 z-50 bg-[#0a0f1d]/50 border-white/5">
      <div className="flex items-center gap-3 px-3 py-4 mb-10 border-b border-white/5 pb-6">
        <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center shadow-2xl shadow-accent/20">
          <Building2 className="text-white w-7 h-7" />
        </div>
        <div>
          <span className="font-black text-2xl tracking-tight text-white block leading-none">EmlakAI</span>
          <span className="text-[10px] text-accent font-black uppercase tracking-widest mt-1 block">Satış Asistanı</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={cn(
              "nav-item w-full group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300",
              item.id === 'catalog' ? "bg-accent/10 text-white border border-accent/20 shadow-inner" : "text-slate-500 hover:bg-white/5 hover:text-slate-200"
            )}
          >
            <item.icon size={22} className={cn("transition-transform duration-300 group-hover:scale-110", item.id === 'catalog' ? "text-accent" : "text-slate-500 group-hover:text-slate-300")} />
            <span className="font-bold text-sm tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 flex flex-col gap-4">
        {/* Support Card */}
        <div className="bg-gradient-to-br from-accent/20 to-transparent p-5 rounded-3xl border border-accent/10 mb-2">
          <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-2">PRO DESTEK</p>
          <p className="text-xs text-slate-300 font-medium leading-relaxed mb-4">Portföyünüzü botumuza bağlayın, 7/24 satış yapın.</p>
          <button className="w-full py-2.5 bg-accent/20 hover:bg-accent/30 text-accent text-[10px] font-black rounded-xl border border-accent/20 transition-all uppercase tracking-widest">Yardım Al</button>
        </div>

        <div className="border-t border-white/5 my-2" />

        <button className="flex items-center gap-4 px-4 py-4 text-slate-500 hover:text-white transition-colors group">
          <Settings size={20} className="group-hover:rotate-45 transition-transform duration-500" />
          <span className="font-bold text-sm">Ayarlar</span>
        </button>
      </div>
    </aside>
  );
}
