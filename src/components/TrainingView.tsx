'use client';

import React, { useState, FormEvent } from 'react';
import { 
  GraduationCap, 
  MessageSquare, 
  Target, 
  Zap, 
  AlertCircle, 
  CheckCircle2, 
  Send,
  Loader2,
  BrainCircuit,
  User,
  Coffee,
  Skull
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const SCENARIOS = [
  { 
    id: 'pazarlik', 
    title: 'Fiyat Pazarligi', 
    desc: 'Butcesi kisitli ve agresif bir aliciyi ikna edin.', 
    icon: <Zap size={24} />,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10'
  },
  { 
    id: 'kararsiz', 
    title: 'Kararsiz Musteri', 
    desc: 'Karar vermek icin surekli baskalarini one suren engelleri asin.', 
    icon: <Coffee size={24} />,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10'
  },
  { 
    id: 'uzman', 
    title: 'Profesyonel Yatirimci', 
    desc: 'Teknik detaylari bilen ve guven arayan musteriye kendinizi kanitilayin.', 
    icon: <Skull size={24} />,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10'
  }
];

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function TrainingView() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [metrics, setMetrics] = useState({ persuasion: 30, trust: 50, tip: 'Baslamak icin ilk mesajinizi yazin.' });
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', content: 'Merhaba, bugun hangi konuda kendinizi gelistirmek istersiniz? Lutfen bir senaryo secin.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const assistantId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/academy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          scenario: selectedScenario 
        }),
      });

      // Read analysis data from header
      const analysisHeader = res.headers.get('X-Analysis-Data');
      if (analysisHeader) {
        try {
          const analysis = JSON.parse(analysisHeader);
          setMetrics({
            persuasion: analysis.persuasionLevel,
            trust: analysis.trustScore,
            tip: analysis.coachTip
          });
        } catch { /* ignore parse errors */ }
      }

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
      console.error('Academy error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {!isStarted ? (
        <div className="space-y-12">
           <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto text-accent border border-accent/10">
                 <GraduationCap size={40} />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">Emlak Satis Akademisi</h2>
              <p className="text-slate-500 text-sm max-w-md mx-auto font-medium">AI destekli simulasyonlarla musteri ikna becerilerinizi gelistirin.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {SCENARIOS.map(s => (
                <button 
                  key={s.id} 
                  onClick={() => setSelectedScenario(s.id)}
                  className={cn(
                    "glass-card p-10 text-left space-y-4 hover:scale-[1.02] transition-all border-2 group cursor-pointer",
                    selectedScenario === s.id ? "border-accent bg-accent/5" : "border-white/5 hover:border-white/10"
                  )}
                >
                   <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", s.bg, s.color)}>
                     {s.icon}
                   </div>
                   <h3 className="text-xl font-black text-white">{s.title}</h3>
                   <p className="text-sm text-slate-500 font-medium leading-relaxed">{s.desc}</p>
                   {selectedScenario === s.id && <CheckCircle2 className="text-accent" size={20} />}
                </button>
              ))}
           </div>

           <div className="flex justify-center">
              <button 
                disabled={!selectedScenario}
                onClick={() => setIsStarted(true)}
                className="px-16 py-6 bg-accent hover:bg-accent-light text-white font-black text-lg rounded-2xl transition-all shadow-2xl shadow-accent/30 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
              >
                SIMULASYONU BASLAT
              </button>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-12 h-[700px]">
           {/* Left Panel: Chat */}
           <div className="glass-card flex flex-col border-white/5 bg-[#0a0f1d]/40 shadow-2xl overflow-hidden">
              <div className="p-8 bg-gradient-to-r from-accent/10 to-transparent border-b border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-accent">
                       <User size={20} />
                    </div>
                    <div>
                       <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest block">MUSTERI PROFILI</span>
                       <span className="text-sm font-bold text-white capitalize">{selectedScenario} Musteri</span>
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Canli Simulasyon</span>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                 {messages.map((m) => (
                   <div key={m.id} className={cn("flex flex-col max-w-[85%]", m.role === 'user' ? "ml-auto items-end" : "items-start")}>
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 px-4">
                        {m.role === 'user' ? 'SIZ (DANISMAN)' : 'MUSTERI'}
                      </span>
                      <div className={cn(
                        "p-5 rounded-[32px] text-lg font-medium leading-relaxed shadow-xl",
                        m.role === 'user' 
                          ? "bg-accent text-white rounded-tr-none" 
                          : "bg-white/5 text-slate-200 border border-white/10 rounded-tl-none"
                      )}>
                         {m.content || '...'}
                      </div>
                   </div>
                 ))}
                 {isLoading && messages[messages.length-1]?.role === 'user' && (
                    <div className="flex flex-col items-start max-w-[80%] animate-pulse">
                       <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">MUSTERI YAZIYOR</span>
                       <div className="bg-white/5 p-5 rounded-[32px] rounded-tl-none border border-white/10">
                          <Loader2 size={24} className="animate-spin text-slate-700" />
                       </div>
                    </div>
                 )}
              </div>

              <form onSubmit={handleSubmit} className="p-8 border-t border-white/5 bg-black/20">
                 <div className="relative group">
                    <input 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Musteriyi ikna edecek yanitinizi yazin..."
                      className="w-full bg-[#030712] border border-white/10 rounded-[32px] px-8 py-6 text-white text-xl font-medium focus:outline-none focus:border-accent transition-all pl-16 pr-24 shadow-2xl shadow-accent/5 placeholder:text-slate-800"
                    />
                    <MessageSquare className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-accent transition-colors" size={24} />
                    <button 
                      type="submit" 
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-accent text-white rounded-2xl hover:scale-110 active:scale-90 transition-all"
                    >
                       <Send size={24} />
                    </button>
                 </div>
              </form>
           </div>

           {/* Right Panel: Analysis */}
           <div className="space-y-8 flex flex-col">
              <div className="glass-card p-10 space-y-8 flex-1 border-white/5 bg-[#0a0f1d]/40 shadow-2xl">
                 <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                    <BrainCircuit size={28} className="text-secondary" />
                    <h3 className="text-lg font-black text-white uppercase tracking-wider">AI Koc Analizi</h3>
                 </div>

                 <div className="space-y-10">
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                          <span className="text-white">IKNA SEVIYESI</span>
                          <span className={cn(
                            metrics.persuasion > 70 ? "text-accent" : 
                            metrics.persuasion > 40 ? "text-secondary" : "text-orange-400"
                          )}>{metrics.persuasion}%</span>
                       </div>
                       <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${metrics.persuasion}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={cn(
                              "h-full shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-colors",
                              metrics.persuasion > 70 ? "bg-accent" : 
                              metrics.persuasion > 40 ? "bg-secondary" : "bg-orange-400"
                            )} 
                          />
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                          <span className="text-white">GUVEN SKORU</span>
                          <span className="text-secondary">{metrics.trust}%</span>
                       </div>
                       <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${metrics.trust}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full bg-secondary shadow-[0_0_15px_rgba(0,196,255,0.4)]" 
                          />
                       </div>
                    </div>
                 </div>

                 <div className="p-8 bg-black/40 rounded-[32px] border border-white/5 space-y-4 mt-8">
                    <div className="flex items-center gap-3 text-secondary font-black text-xs uppercase tracking-widest">
                       <AlertCircle size={18} />
                       AI KOC ONERISI
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.p 
                        key={metrics.tip}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-slate-400 text-sm leading-relaxed font-medium italic"
                      >
                        {metrics.tip}
                      </motion.p>
                    </AnimatePresence>
                 </div>
              </div>

              <div className="glass-card p-8 bg-green-500/5 border-green-500/10 flex items-center gap-5 group cursor-not-allowed grayscale">
                 <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center text-green-500">
                    <Target size={28} />
                 </div>
                 <div>
                    <h4 className="text-md font-black text-white leading-tight uppercase tracking-tight">Egitimi Bitir</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Final raporunu al</p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
