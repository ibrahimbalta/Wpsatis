'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ProductList } from './ProductList';
import { ProductForm } from './ProductForm';
import { TemplateManager } from './TemplateManager';
import { BotSimulator } from './BotSimulator';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Users, 
  Sparkles,
  Search,
  Zap,
  GraduationCap,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { LiveActivity } from './LiveActivity';

export function DashboardClient() {
  const [activeTab, setActiveTab] = useState('products');
  const [showBot, setShowBot] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
             {/* Key Metrics */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { label: 'Toplam İlan', val: '42', icon: <BarChart3 />, color: 'from-blue-600/20 to-blue-600/5 text-blue-400 border-blue-500/10' },
                  { label: 'İzlenme', val: '12.4K', icon: <TrendingUp />, color: 'from-accent/20 to-accent/5 text-accent border-accent/10' },
                  { label: 'Tıklanma', val: '840', icon: <Target />, color: 'from-orange-600/20 to-orange-600/5 text-orange-400 border-orange-500/10' },
                  { label: 'Yeni Müşteri', val: '+12%', icon: <Users />, color: 'from-purple-600/20 to-purple-600/5 text-purple-400 border-purple-500/10' }
                ].map((stat, i) => (
                  <div key={i} className="glass-card p-8 group hover:scale-[1.02] transition-all border-white/5 bg-[#0a0f1d]/40 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-[0.03] rounded-full -mr-16 -mt-16 pointer-events-none" />
                    <div className="flex justify-between items-start mb-6">
                       <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg border`}>{stat.icon}</div>
                       <span className="text-[10px] font-black text-slate-600 bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest">{stat.label === 'Yeni Müşteri' ? 'HAFTALIK' : 'TOPLAM'}</span>
                    </div>
                    <div className="space-y-1">
                       <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</h4>
                       <span className="text-4xl font-black text-white tracking-tighter">{stat.val}</span>
                    </div>
                  </div>
                ))}
             </div>

             <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                <div className="xl:col-span-2 space-y-8">
                   <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <Package className="text-accent" />
                        Aktif Portföyünüz
                      </h3>
                   </div>
                   <ProductList searchQuery="" />
                </div>
                
                <div className="space-y-8">
                   <LiveActivity />
                </div>
             </div>
          </div>
        );
      case 'add-product':
        return <ProductForm />;
      case 'templates':
        return <TemplateManager />;
      case 'bot':
        return <BotSettings />;
      case 'settings':
        return <SettingsView />;
      case 'academy':
        return <TrainingView />;
      default:
        return <div>Lütfen bir sekme seçin.</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#030712] selection:bg-accent selection:text-white overflow-hidden max-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="h-28 border-b border-white/5 flex items-center justify-between px-12 bg-black/20 backdrop-blur-3xl sticky top-0 z-40 shrink-0">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-accent/40">
                 <Zap size={24} />
              </div>
              <div>
                 <h2 className="text-2xl font-black text-white tracking-tighter">
                   {activeTab === 'products' && 'Emlak Portföyünüz'}
                   {activeTab === 'add-product' && 'Yeni Portföy Kaydı'}
                   {activeTab === 'templates' && 'Mesaj Şablonları'}
                   {activeTab === 'bot' && 'WhatsApp AI Ayarları'}
                   {activeTab === 'settings' && 'Kurumsal Kimlik Ayarları'}
                   {activeTab === 'academy' && 'Emlak Satış Akademisi'}
                 </h2>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">AI-Powered Real Estate Hub</p>
              </div>
           </div>

           <div className="flex items-center gap-8">
              <div className="hidden lg:flex items-center bg-white/5 rounded-2xl px-5 py-3 border border-white/5 group focus-within:border-accent/40 transition-all">
                <Search size={18} className="text-slate-600 group-focus-within:text-accent" />
                <input placeholder="İlanlarda veya mesajlarda ara..." className="bg-transparent border-none outline-none text-sm text-white px-4 w-64 placeholder:text-slate-700" />
              </div>
              <div className="h-10 w-px bg-white/5" />
              <button className="flex items-center gap-4 px-2 py-2 hover:bg-white/5 rounded-2xl transition-all">
                 <div className="text-right hidden sm:block">
                    <p className="text-xs font-black text-white">İbrahim Balta</p>
                    <p className="text-[9px] font-bold text-accent uppercase tracking-widest">Broker / Owner</p>
                 </div>
                 <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-secondary p-[2px] shadow-xl">
                    <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center overflow-hidden">
                       <img src="https://i.pravatar.cc/150?u=ibrahim" alt="avatar" />
                    </div>
                 </div>
              </button>
           </div>
        </header>

        <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative bg-[#030712]">
           {renderContent()}
           
           {/* Global AI Floating Action */}
           <div className="fixed bottom-12 right-12 z-50">
              <button 
                onClick={() => setShowBot(true)}
                className="w-16 h-16 bg-gradient-to-tr from-accent to-secondary rounded-[24px] flex items-center justify-center text-white shadow-2xl shadow-accent/50 hover:scale-110 active:scale-90 transition-all group relative border border-white/10"
              >
                 <Sparkles size={28} />
                 <div className="absolute right-full mr-4 px-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-[10px] font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    AI SİMÜLATÖRÜ AÇ
                 </div>
              </button>
           </div>
        </div>

        {/* Bot Simulator Modal Overlay */}
        <AnimatePresence>
          {showBot && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            >
              <div className="relative">
                <button 
                  onClick={() => setShowBot(false)}
                  className="absolute -top-12 -right-12 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all border border-white/10 z-[110]"
                >
                  <X size={20} />
                </button>
                <BotSimulator />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

