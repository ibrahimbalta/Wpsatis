'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Smartphone, Wifi, Battery, ChevronLeft, MoreVertical, CheckCheck, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithEmlakAI } from '@/lib/ai-actions';

interface Message {
  role: 'user' | 'bot';
  text: string;
  isError?: boolean;
}

export function BotSimulator() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Merhaba! Ben Wpsatis AI. Size gayrimenkul portföyümüz hakkında nasıl yardımcı olabilirim? (Örn: "Şişli\'de kiralık daire var mı?")' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // Prepare messages for AI (limit context for demo)
      const aiMessages = messages.concat({ role: 'user', text: userMsg }).map(m => ({
        role: m.role === 'bot' ? 'assistant' as const : 'user' as const,
        content: m.text
      }));

      const response = await chatWithEmlakAI(aiMessages);
      
      if (response && response.text) {
        setMessages(prev => [...prev, { role: 'bot', text: response.text }]);
      } else {
        throw new Error("Boş yanıt alındı.");
      }
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: 'Üzgünüm, şu an bağlantı kuramıyorum. Lütfen API anahtarınızı kontrol edin.',
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700" />

      {/* Phone Frame */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-[340px] h-[680px] bg-slate-900 rounded-[3.5rem] p-3 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-[10px] border-slate-800/80 backdrop-blur-xl"
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-2xl z-50 flex items-center justify-center">
            <div className="w-12 h-1 bg-slate-800 rounded-full" />
        </div>

        {/* Inner Screen */}
        <div className="w-full h-full bg-[#0b141a] rounded-[2.8rem] overflow-hidden flex flex-col relative shadow-inner">
          
          {/* Status Bar */}
          <div className="flex justify-between items-center px-8 pt-5 pb-2 text-[11px] text-slate-400 font-medium">
             <span>14:01</span>
             <div className="flex items-center gap-2">
               <Wifi size={12} />
               <Battery size={12} />
             </div>
          </div>

          {/* Header */}
          <div className="bg-[#202c33]/90 backdrop-blur-md p-4 flex items-center justify-between text-white border-b border-white/5 z-10">
            <div className="flex items-center gap-3">
              <ChevronLeft size={22} className="text-accent cursor-pointer hover:scale-110 transition-transform" />
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/60 rounded-full flex items-center justify-center shadow-lg shadow-accent/20">
                  <Bot size={22} className="text-white" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#202c33] rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight">Wpsatis AI</span>
                <span className="text-[10px] text-green-500/90 font-semibold animate-pulse">çevrimiçi</span>
              </div>
            </div>
            <MoreVertical size={20} className="text-slate-400 cursor-pointer" />
          </div>

          {/* Chat Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto scroll-smooth custom-scrollbar"
            style={{ backgroundImage: 'radial-gradient(#ffffff05 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          >
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className={cn(
                    "max-w-[88%] p-3.5 rounded-2xl text-[13px] leading-relaxed relative shadow-md",
                    msg.role === 'user' 
                      ? "bg-accent text-white self-end rounded-tr-none" 
                      : msg.isError 
                        ? "bg-red-500/10 border border-red-500/20 text-red-200 self-start rounded-tl-none"
                        : "bg-[#202c33] text-slate-100 self-start rounded-tl-none"
                  )}
                >
                  {msg.isError && <AlertCircle size={14} className="inline mr-1.5 mb-0.5" />}
                  {msg.text}
                  <div className="text-[9px] opacity-60 text-right mt-1.5 flex items-center justify-end gap-1 font-mono">
                    14:01 {msg.role === 'user' && <CheckCheck size={14} className="text-white" />}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#202c33] text-slate-300 self-start p-3 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-md"
              >
                <Loader2 size={16} className="animate-spin text-accent" />
                <span className="text-xs font-medium">Cevap yazılıyor...</span>
              </motion.div>
            )}
          </div>

          {/* Footer Input */}
          <div className="p-4 bg-[#202c33]/95 backdrop-blur-md border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-[#2a3942] rounded-2xl px-5 py-3 flex items-center shadow-inner group focus-within:ring-1 ring-accent/30 transition-all">
                 <input 
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                   placeholder={isLoading ? "Bot yanıtlıyor..." : "Mesajınızı yazın..."}
                   disabled={isLoading}
                   className="bg-transparent border-none focus:outline-none text-white text-[13px] w-full placeholder:text-slate-500"
                 />
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={isLoading}
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all shadow-lg shadow-accent/20",
                  input ? "bg-accent" : "bg-slate-700 opacity-50 cursor-not-allowed"
                )}
              >
                <Send size={20} className={isLoading ? "animate-pulse" : ""} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 group"
      >
        <div className="px-6 py-2.5 bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-full flex items-center gap-3 shadow-xl transition-all hover:bg-slate-800/80">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em]">Canlı AI Simülasyonu</span>
        </div>
      </motion.div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

