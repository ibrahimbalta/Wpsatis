'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  User, 
  Bot, 
  RotateCcw, 
  Copy, 
  Wand2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AIChatAssistant() {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'Merhaba! Müşteriden gelen mesajı buraya yapıştırın, en ikna edici satışı yapmanız için size yardımcı olayım.' }
  ]);

  const handleAnalyze = () => {
    if (!inputText) return;
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      setHistory([...history, 
        { role: 'user', content: inputText },
        { role: 'assistant', content: 'Müşterimiz fiyata itiraz ediyor. Bu bir "Değer Karmaşası" (Value Confusion) durumu. \n\nÖneri Cevabım: "Ürünlerimizin m2 fiyatı pazar ortalamasının biraz üzerinde görünebilir, ancak 10 yıl aşınmazlık garantisi ve m² bazında %20 daha düşük fire oranı ile uzun vadede %15 daha kârlı bir projeniz olacak. İsterseniz karşılaştırmalı test sonuçlarımızı paylaşabilirim."' }
      ]);
      setInputText('');
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto h-[700px] flex flex-col gap-6 animate-in slide-in-from-bottom-6 duration-700">
      <div className="flex items-center justify-between mb-2 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white shadow-xl shadow-accent/20">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">AI Satış Asistanı</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-green-500/80">Yapay Zeka Hazır</span>
            </div>
          </div>
        </div>
        
        <button onClick={() => setHistory([{role:'assistant', content: 'Geçmiş temizlendi. Yeni bir mesaj bekliyorum.'}])} className="p-2 text-slate-500 hover:text-white transition-colors">
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass-card p-6 overflow-y-auto space-y-6 bg-slate-900/40 border-glass-border">
        {history.map((msg, i) => (
          <div key={i} className={cn(
            "flex gap-4 animate-in fade-in duration-300",
            msg.role === 'user' ? "flex-row-reverse" : "flex-row"
          )}>
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
              msg.role === 'user' ? "bg-slate-800 text-slate-400" : "bg-accent/20 text-accent"
            )}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            
            <div className={cn(
              "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
              msg.role === 'user' 
                ? "bg-slate-800 text-slate-200 border border-glass-border" 
                : "bg-accent/5 text-slate-200 border border-accent/20"
            )}>
              {msg.content.split('\n').map((line, idx) => (
                <p key={idx} className={idx > 0 ? "mt-2" : ""}>{line}</p>
              ))}
              
              {msg.role === 'assistant' && i > 0 && (
                <div className="mt-4 flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-[10px] font-black rounded-lg text-white hover:scale-105 transition-all">
                    <Copy size={12} /> KOPYALA
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-[10px] font-black rounded-lg text-slate-300 hover:scale-105 transition-all">
                    <Wand2 size={12} /> YENİDEN ÜRET
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isAnalyzing && (
          <div className="flex gap-4 animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
              <Bot size={16} />
            </div>
            <div className="bg-accent/5 p-4 rounded-2xl border border-accent/20 w-32 h-10" />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="glass-card p-6 flex flex-col gap-4 border-glass-border bg-slate-900/60 shadow-2xl">
        <div className="relative">
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Müşterinin attığı mesajı buraya yapıştırın..."
            className="w-full bg-slate-800/50 border border-glass-border rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all text-sm font-medium resize-none min-h-[100px]"
          />
          <div className="absolute bottom-4 right-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            {inputText.length} Karakter
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
             <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
               <CheckCircle2 size={14} className="text-green-500" />
               Sektör Analizi
             </div>
             <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
               <AlertCircle size={14} className="text-accent" />
               İtiraz Yönetimi
             </div>
          </div>
          
          <button 
            onClick={handleAnalyze}
            disabled={!inputText || isAnalyzing}
            className="flex items-center gap-3 px-8 py-3 bg-accent hover:bg-accent-light disabled:opacity-50 disabled:scale-100 text-white font-black rounded-xl transition-all shadow-xl shadow-accent/20 active:scale-95"
          >
            {isAnalyzing ? 'Analiz Ediliyor...' : 'Yapay Zeka İle Cevapla'}
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
