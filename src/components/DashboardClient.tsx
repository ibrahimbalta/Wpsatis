'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { useSector } from '@/context/SectorContext';
import { Search, Plus, Calculator, MessageSquare, Building2, LayoutDashboard, BookOpen, Zap, Sparkles, Database } from 'lucide-react';
import { PricingCalculator } from '@/components/PricingCalculator';
import { TemplateList } from '@/components/TemplateList';
import { SalesTraining } from '@/components/SalesTraining';
import { FlowBuilder } from '@/components/FlowBuilder';
import { AIChatAssistant } from '@/components/AIChatAssistant';
import { BotSimulator } from '@/components/BotSimulator';
import { ProductList } from '@/components/ProductList';
import { Drawer } from '@/components/Drawer';
import { TemplateForm } from '@/components/TemplateForm';
import { ProductForm } from '@/components/ProductForm';
import { cn } from '@/lib/utils';
import { UserButton } from '@clerk/nextjs';
import { seedSampleData } from '@/lib/seed';

interface DashboardClientProps {
  initialUser: any;
}

export function DashboardClient({ initialUser }: DashboardClientProps) {
  const { currentSector } = useSector();
  const [activeTab, setActiveTab] = useState('catalog'); // Defaulting to catalog/portfolio for real estate
  const [searchQuery, setSearchQuery] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);
  
  // Drawer States
  const [isTemplateDrawerOpen, setIsTemplateDrawerOpen] = useState(false);
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);

  const handleSeed = async () => {
    if (!confirm('Emlakçı portföyü için örnek veriler yüklenecek. Emin misiniz?')) return;
    setIsSeeding(true);
    try {
      const result = await seedSampleData();
      alert(result.message);
      window.location.reload(); 
    } catch (error) {
      alert('Hata oluştu!');
    } finally {
      setIsSeeding(false);
    }
  };

  const tabs = [
    { id: 'catalog', label: 'Portföyüm', icon: Building2 },
    { id: 'templates', label: 'Mesaj Kitim', icon: MessageSquare },
    { id: 'bot', label: 'Bot Yönetimi', icon: Zap },
    { id: 'ai', label: 'AI Danışman', icon: Sparkles },
    { id: 'calculator', label: 'Kredi/Komisyon', icon: Calculator },
  ];

  return (
    <main className="flex min-h-screen p-4 gap-6 bg-[#030712] text-slate-200">
      <Sidebar />
      
      <section className="flex-1 flex flex-col gap-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-2">
          <div className="animate-in slide-in-from-left duration-500">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-accent/20 text-accent text-[10px] font-black rounded-lg tracking-widest uppercase border border-accent/20">
                Gayrimenkul Modülü
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none mb-2">
              Emlak <span className="text-accent underline underline-offset-8 decoration-accent/20 italic">Portföyü</span>
            </h1>
            <p className="text-slate-500 max-w-md text-sm font-medium">
              Hoş geldin, <span className="text-white font-bold">{initialUser?.name || 'Gayrimenkul Danışmanı'}</span>.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 bg-slate-900/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 shrink-0",
                    activeTab === tab.id 
                      ? "bg-accent text-white shadow-2xl shadow-accent/40 scale-105" 
                      : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                  )}
                >
                  <tab.icon size={18} />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              ))}
            </div>
            <div className="w-12 h-12 flex items-center justify-center bg-slate-900/40 rounded-2xl border border-white/5">
              <UserButton />
            </div>
          </div>
        </header>

        {/* Search & Actions Bar */}
        {activeTab !== 'calculator' && activeTab !== 'bot' && activeTab !== 'ai' && (
          <div className="flex flex-col md:flex-row items-center gap-4 px-2 animate-in fade-in slide-in-from-top-4 duration-500 delay-150">
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-accent transition-colors" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`${activeTab === 'templates' ? 'Mesaj şablonu' : 'İlan, konum veya mülk tipi'} ara...`} 
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all font-medium placeholder:text-slate-600"
              />
            </div>
            <button 
              onClick={() => {
                if (activeTab === 'templates') setIsTemplateDrawerOpen(true);
                if (activeTab === 'catalog') setIsProductDrawerOpen(true);
              }}
              className="glass-button w-full md:w-auto h-14 px-8 shadow-xl shadow-accent/10 group bg-accent hover:bg-accent-light border-none"
            >
              <Plus size={20} className="stroke-[3px] group-hover:rotate-90 transition-transform" />
              <span className="font-black uppercase tracking-tight">Yeni {activeTab === 'templates' ? 'Şablon' : 'İlan'} Ekle</span>
            </button>
          </div>
        )}

        {/* Dynamic Content Area */}
        <div className="flex-1 px-2 pb-8 overflow-x-hidden">
          {activeTab === 'templates' && (
            <TemplateList searchQuery={searchQuery} />
          )}

          {activeTab === 'bot' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
               <div className="xl:col-span-2">
                  <FlowBuilder />
               </div>
               <div className="xl:col-span-1 border-l border-white/5 pl-8 hidden xl:block">
                  <BotSimulator />
               </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <AIChatAssistant />
          )}

          {activeTab === 'calculator' && (
            <div className="flex justify-center animate-in zoom-in-95 duration-500">
              <PricingCalculator />
            </div>
          )}

          {activeTab === 'catalog' && (
            <ProductList searchQuery={searchQuery} />
          )}
        </div>
      </section>

      {/* Drawers */}
      <Drawer 
        isOpen={isTemplateDrawerOpen} 
        onClose={() => setIsTemplateDrawerOpen(false)} 
        title="Yeni Mesaj Şablonu"
      >
        <TemplateForm onSuccess={() => {
          setIsTemplateDrawerOpen(false);
          window.location.reload();
        }} />
      </Drawer>

      <Drawer 
        isOpen={isProductDrawerOpen} 
        onClose={() => setIsProductDrawerOpen(false)} 
        title="Yeni Portföy Kaydı"
      >
        <ProductForm onSuccess={() => {
          setIsProductDrawerOpen(false);
          window.location.reload();
        }} />
      </Drawer>
    </main>
  );
}
