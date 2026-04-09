'use client';

import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { 
  Sparkles, 
  Send, 
  User, 
  Bot, 
  RotateCcw, 
  Copy, 
  Wand2,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function AIChatAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', content: 'Merhaba! Ben sizin kişisel gayrimenkul asistanınızım. Müşteriden gelen mesajı buraya yapıştırın veya portföyümüz hakkında soru sorun, size en ikna edici cevabı hazırlayayım.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const assistantId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })) }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value, { stream: true });
          setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: fullText } : m));
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[700px] flex flex-col gap-6 animate-in slide-in-from-bottom-6 duration-700">
      <div className="flex items-center justify-between mb-2 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white shadow-xl shadow-accent/20">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">EmlakAI Danışman</h2>
            <div className="flex items-center gap-2">
              <span className={cn("w-2 h-2 rounded-full", isLoading ? "bg-orange-500 animate-pulse" : "bg-green-500")} />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                {isLoading ? 'Düşünüyor...' : 'Yapay Zeka Hazır'}
              </span>
            </div>
          </div>
        </div>
        
        <button onClick={() => setMessages([
          { id: '1', role: 'assistant', content: 'Merhaba! Ben sizin kişisel gayrimenkul asistanınızım. Müşteriden gelen mesajı buraya yapıştırın veya portföyümüz hakkında soru sorun, size en ikna edici cevabı hazırlayayım.' }
        ])} className="p-2 text-slate-500 hover:text-white transition-colors">
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 glass-card p-6 overflow-y-auto space-y-6 bg-[#0a0f1d]/60 border-white/5 no-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={cn(
            "flex gap-4 animate-in fade-in slide-in-from-top-1 duration-300",
            msg.role === 'user' ? "flex-row-reverse" : "flex-row"
          )}>
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
              msg.role === 'user' ? "bg-slate-800 text-slate-400" : "bg-accent/20 text-accent"
            )}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            
            <div className={cn(
              "max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg",
              msg.role === 'user' 
                ? "bg-slate-800 text-slate-200 border border-white/5" 
                : "bg-accent/10 text-slate-200 border border-accent/20"
            )}>
              {(msg.content || '...').split('\n').map((line, idx) => (
                <p key={idx} className={idx > 0 ? "mt-2" : ""}>{line}</p>
              ))}
              
              {msg.id !== '1' && msg.role === 'assistant' && msg.content && (
                <div className="mt-4 flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/20 hover:bg-accent text-[10px] font-black rounded-lg text-accent hover:text-white transition-all border border-accent/20">
                    <Copy size={12} /> KOPYALA
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="glass-card p-6 flex flex-col gap-4 border-white/5 bg-[#0a0f1d]/80 shadow-2xl">
        <div className="relative">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Müşterinin mesajını yapıştırın veya 'Bartındaki dairelerimizi listele' yazın..."
            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all text-sm font-medium resize-none min-h-[120px] placeholder:text-slate-600"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
             <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
               <CheckCircle2 size={12} className="text-green-500" />
               Portföy Bağlı
             </div>
             <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
               <AlertCircle size={12} className="text-accent" />
               Satış Odaklı
             </div>
          </div>
          
          <button 
            type="submit"
            disabled={!input || isLoading}
            className="flex items-center gap-3 px-8 py-4 bg-accent hover:bg-accent-light disabled:opacity-30 text-white font-black rounded-2xl transition-all shadow-xl shadow-accent/20 active:scale-95 group"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
            Hemen Yanıtla
          </button>
        </div>
      </form>
    </div>
  );
}
