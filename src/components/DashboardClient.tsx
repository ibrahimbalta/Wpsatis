'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  MessageSquare, 
  Settings, 
  LayoutDashboard, 
  PlusCircle, 
  Search,
  Users,
  Bell,
  PanelLeftClose,
  ChevronRight,
  TrendingUp,
  Target,
  Clock,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { ProductForm } from './ProductForm';
import { ProductList } from './ProductList';
import { TemplateList } from './TemplateList';
import { FlowBuilder } from './FlowBuilder';
import { AIChatAssistant } from './AIChatAssistant';
import { SettingsView } from './SettingsView'; // Yeni Kurumsal Ayarlar Paneli
import { UserButton } from '@clerk/nextjs';

export function DashboardClient() {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const renderContent = () => {
    switch (activeTab) {
      case 'portfolio':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-5xl font-black text-white tracking-tighter leading-none">
                  İlan Portföyü
                </h1>
                <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Gayrimenkul Vitrini Yönetimi</p>
              </div>
              <button 
                onClick={() => setActiveTab('add-listing')}
                className="flex items-center gap-3 px-8 py-4 bg-accent hover:bg-accent-light text-white font-black rounded-2xl transition-all shadow-xl shadow-accent/20 active:scale-95 group"
              >
                <PlusCircle size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                YENİ İLAN EKLE
              </button>
            </div>
            
            <div className="relative group">
              <input 
                type="text"
                placeholder="İlan adı, konum veya oda sayısı ile ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0a0f1d]/60 border border-white/5 rounded-3xl px-14 py-6 text-white focus:outline-none focus:border-accent transition-all text-xl font-medium placeholder:text-slate-700 shadow-2xl"
              />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={24} />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:border-accent/40 transition-colors">
                Ara (⌘+F)
              </div>
            </div>

            <ProductList searchQuery={searchQuery} />
          </div>
        );
      case 'add-listing':
        return <ProductForm />;
      case 'training':
        return <AIChatAssistant />;
      case 'message-kit':
        return <TemplateList searchQuery={searchQuery} />;
      case 'ai-bot':
        return <FlowBuilder />;
      case 'settings':
        return <SettingsView />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#030712] overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-[#030712] via-[#05091a] to-[#030712] relative overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Top Header */}
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-10 relative z-10 backdrop-blur-3xl bg-[#030712]/40">
           <div className="flex items-center gap-6">
              <div className="hidden md:flex flex-col">
                 <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-0.5">Müşteri Potansiyeli</span>
                 <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-green-500" />
                    <span className="text-sm font-black text-white">+12% Bu Hafta</span>
                 </div>
              </div>
              <div className="h-8 w-px bg-white/5 hidden md:block" />
              <div className="flex items-center gap-3 group cursor-pointer">
                 <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                    <Target size={20} />
                 </div>
                 <span className="text-sm font-black text-slate-400 group-hover:text-white transition-colors">Portföy Analizi</span>
              </div>
           </div>

           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5">
                 <button className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-accent rounded-full border-2 border-[#030712]" />
                 </button>
                 <div className="w-px h-6 bg-white/10 mx-1" />
                 <UserButton afterSignOutUrl="/" />
              </div>
           </div>
        </header>

        {/* Dynamic Tab Content */}
        <div className="flex-1 overflow-y-auto p-10 relative z-10 no-scrollbar">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
