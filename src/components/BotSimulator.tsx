'use client';

import React, { useState, useEffect } from 'react';
import { Bot, User, Send, Smartphone, Wifi, Battery, ChevronLeft, MoreVertical, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BotSimulator() {
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Merhaba! Ben Wpsatis Bot. Size nasıl yardımcı olabilirim? "Fiyat", "Katalog" veya "Konum" yazarak test edebilirsiniz.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const simulateBot = (userText: string) => {
    setIsTyping(true);
    const lowerText = userText.toLowerCase();
    
    setTimeout(() => {
      let botResponse = 'Üzgünüm, bunu anlayamadım. Müşteri temsilcimize aktarıyorum...';
      
      if (lowerText.includes('fiyat')) {
        botResponse = 'Seramik m2 fiyatlarımız 350 TL\'den başlamaktadır. Hangi modelle ilgileniyorsunuz?';
      } else if (lowerText.includes('katalog')) {
        botResponse = 'Tabii! İşte 2026 sezonu dijital kataloğumuz: [PDF Link]';
      } else if (lowerText.includes('konum')) {
        botResponse = 'Mağazamız Şişli/İstanbul\'dadır. İşte konumuz: [Google Maps Link]';
      } else if (lowerText.includes('merhaba')) {
        botResponse = 'Tekrar merhaba! Satış sürecinize yardımcı olmaya hazırım.';
      }

      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSend = () => {
    if (!input) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    const currentInput = input;
    setInput('');
    simulateBot(currentInput);
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 animate-in zoom-in-95 duration-700">
      {/* Phone Frame */}
      <div className="relative w-[320px] h-[600px] bg-[#000] rounded-[3rem] p-3 shadow-2xl border-[8px] border-slate-800 outline outline-2 outline-slate-900">
        {/* Dynamic Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#000] rounded-b-2xl z-50 flex items-center justify-center">
            <div className="w-10 h-1 bg-slate-900 rounded-full" />
        </div>

        {/* Status Bar */}
        <div className="flex justify-between items-center px-6 pt-4 pb-2 text-[10px] text-white font-bold">
           <span>10:58</span>
           <div className="flex items-center gap-1.5">
             <Wifi size={10} />
             <Battery size={10} />
           </div>
        </div>

        {/* App Content */}
        <div className="w-full h-full bg-[#111b21] rounded-[2.2rem] overflow-hidden flex flex-col relative">
          {/* Header */}
          <div className="bg-[#202c33] p-3 flex items-center justify-between text-white border-b border-white/5">
            <div className="flex items-center gap-2">
              <ChevronLeft size={20} className="text-accent" />
              <div className="w-9 h-9 bg-accent/20 rounded-full flex items-center justify-center">
                <Bot size={20} className="text-accent" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold leading-none">Wpsatis Bot</span>
                <span className="text-[10px] text-green-500 font-medium">çevrimiçi</span>
              </div>
            </div>
            <MoreVertical size={18} className="text-slate-400" />
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto scrollbar-hide">
            {messages.map((msg, i) => (
              <div key={i} className={cn(
                "max-w-[85%] p-3 rounded-xl text-xs relative",
                msg.role === 'user' 
                  ? "bg-[#005c4b] text-white self-end rounded-tr-none" 
                  : "bg-[#202c33] text-slate-100 self-start rounded-tl-none"
              )}>
                {msg.text}
                <div className="text-[9px] text-slate-400 text-right mt-1 flex items-center justify-end gap-1">
                  10:58 {msg.role === 'user' && <CheckCheck size={12} className="text-accent" />}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="bg-[#202c33] text-slate-100 self-start p-3 rounded-xl rounded-tl-none text-xs animate-pulse">
                yazıyor...
              </div>
            )}
          </div>

          {/* Footer Input */}
          <div className="p-3 bg-[#202c33] flex items-center gap-2">
            <div className="flex-1 bg-[#2a3942] rounded-full px-4 py-2 flex items-center">
               <input 
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                 placeholder="Bir mesaj yazın..."
                 className="bg-transparent border-none focus:outline-none text-white text-xs w-full"
               />
            </div>
            <button 
              onClick={handleSend}
              className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white scale-90 hover:scale-100 transition-transform"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
        <Smartphone size={14} />
        Canlı Bot Simülasyonu
      </p>
    </div>
  );
}
