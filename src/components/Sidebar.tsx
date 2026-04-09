'use client';

import React from 'react';
import { 
  Building2, 
  MessageSquare, 
  Settings, 
  LayoutDashboard, 
  PlusCircle, 
  GraduationCap,
  Sparkles,
  PanelLeftClose,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ activeTab, setActiveTab, isOpen, toggleSidebar }: SidebarProps) {
  const menuItems = [
    { id: 'portfolio', label: 'İlan Portföyü', icon: <Building2 size={22} />, color: 'text-white' },
    { id: 'add-listing', label: 'Yeni İlan Ekle', icon: <PlusCircle size={22} />, color: 'text-white' },
    { id: 'smart-import', label: 'Hızlı Aktarım', icon: <Zap size={22} />, color: 'text-accent' },
    { id: 'message-kit', label: 'Mesaj Kitim', icon: <MessageSquare size={22} />, color: 'text-white' },
    { id: 'ai-bot', label: 'AI Danışman Seviyesi', icon: <Sparkles size={22} />, color: 'text-accent' },
    { id: 'training', label: 'Emlak Satış Akademisi', icon: <GraduationCap size={22} />, color: 'text-white' },
    { id: 'settings', label: 'Kurumsal Ayarlar', icon: <ShieldCheck size={22} />, color: 'text-white' },
  ];

  return (
    <aside 
      className={cn(
        "bg-[#030712] border-r border-white/5 transition-all duration-500 relative z-20 flex flex-col h-full shadow-2xl",
        isOpen ? "w-80" : "w-24"
      )}
    >
      {/* Sidebar Header / Logo */}
      <div className="h-24 flex items-center px-8 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white shadow-xl shadow-accent/20">
            <Building2 size={24} />
          </div>
          {isOpen && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-500">
               <span className="text-xl font-black text-white tracking-tighter">EMLAK<span className="text-accent">AI</span></span>
               <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Profesyonel Satış Kiti</span>
            </div>
          )}
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent mb-8" />

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 space-y-2 no-scrollbar overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group relative overflow-hidden",
              activeTab === item.id 
                ? "bg-accent/10 border border-accent/20 text-white shadow-lg" 
                : "text-slate-500 hover:bg-white/5 hover:text-slate-300 border border-transparent"
            )}
          >
            {activeTab === item.id && (
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-accent rounded-r-full" />
            )}
            
            <div className={cn(
              "shrink-0",
              item.color,
              activeTab === item.id ? "text-accent" : "opacity-60 group-hover:opacity-100"
            )}>
              {item.icon}
            </div>
            
            {isOpen && (
              <span className="font-bold text-sm tracking-tight animate-in fade-in slide-in-from-left-2 duration-500">
                {item.label}
              </span>
            )}
            
            {activeTab === item.id && isOpen && (
              <ChevronRight size={14} className="ml-auto text-accent animate-in slide-in-from-left-2 duration-500" />
            )}
          </button>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-6">
        <div className={cn(
          "bg-white/5 rounded-3xl p-4 flex items-center gap-4 border border-white/5 transition-all",
          !isOpen && "justify-center"
        )}>
           <div className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
             <Settings size={20} />
           </div>
           {isOpen && (
             <div className="flex flex-col animate-in fade-in duration-500">
               <span className="text-xs font-black text-white">Sistem v1.2</span>
               <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Premium Lisans</span>
             </div>
           )}
        </div>
      </div>
    </aside>
  );
}
