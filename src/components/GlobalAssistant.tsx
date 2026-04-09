'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { 
  Sparkles, 
  X, 
  Send, 
  Loader2, 
  Bot, 
  Search, 
  BarChart3, 
  MessageSquare,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function GlobalAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/global-ai',
    initialMessages: [
      { id: '1', role: 'assistant', content: 'Merhaba İbrahim Bey! Ben dijital broker ortağınız. Bugün ilanlarınız veya sistem ayarlarınız hakkında nasıl yardımcı olabilirim?' }
    ]
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="fixed bottom-12 right-12 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-24 right-0 w-[400px] h-[550px] bg-[#0a0f1d] border border-white/10 rounded-[32px] shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-accent/20 to-transparent border-b border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white shadow-xl shadow-accent/20">
                     <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white tracking-widest uppercase">Global AI Asistan</h3>
                    <div className="flex items-center gap-1.5">
                       <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                       <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Sisteme Bağlı</span>
                    </div>
                  </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-xl transition-all text-slate-500 hover:text-white">
                  <X size={20} />
               </button>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
               {messages.map((m) => (
                 <div key={m.id} className={cn("flex flex-col max-w-[85%]", m.role === 'user' ? "ml-auto items-end" : "items-start")}>
                    <div className={cn(
                      "p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-lg",
                      m.role === 'user' 
                        ? "bg-accent text-white rounded-tr-none" 
                        : "bg-white/5 text-slate-200 border border-white/10 rounded-tl-none"
                    )}>
                       {m.content}
                    </div>
                 </div>
               ))}
               {isLoading && (
                  <div className="flex items-center gap-2 text-slate-600 animate-pulse">
                     <Loader2 size={16} className="animate-spin" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Asistan Düşünüyor...</span>
                  </div>
               )}
            </div>

            {/* Quick Actions */}
            <div className="px-6 py-3 bg-black/40 flex gap-2 overflow-x-auto no-scrollbar border-t border-white/5">
                <button className="whitespace-nowrap px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest hover:bg-accent hover:text-white transition-all flex items-center gap-2">
                   <Search size={12} /> İlanları Bul
                </button>
                <button className="whitespace-nowrap px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest hover:bg-accent hover:text-white transition-all flex items-center gap-2">
                   <BarChart3 size={12} /> Analiz Getir
                </button>
                <button className="whitespace-nowrap px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest hover:bg-accent hover:text-white transition-all flex items-center gap-2">
                   <MessageSquare size={12} /> Bot Durumu
                </button>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-6 bg-black/40">
               <div className="relative">
                  <input 
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Sisteme bir komut verin..."
                    className="w-full bg-[#030712] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-accent pr-12"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-accent p-2 hover:scale-110 active:scale-95 transition-all">
                     <Send size={18} />
                  </button>
               </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-20 h-20 rounded-[28px] flex items-center justify-center text-white shadow-2xl transition-all group relative active:scale-90",
          isOpen ? "bg-white/10 border border-white/10" : "bg-gradient-to-tr from-accent to-secondary shadow-accent/40"
        )}
      >
        {isOpen ? <ChevronDown size={32} /> : <Sparkles size={32} className="animate-pulse" />}
        {!isOpen && (
           <div className="absolute right-full mr-6 px-5 py-3 bg-slate-900 border border-white/10 rounded-2xl text-[11px] font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none translate-x-4 group-hover:translate-x-0">
             NASIL YARDIMCI OLABİLİRİM?
           </div>
        )}
      </button>
    </div>
  );
}
