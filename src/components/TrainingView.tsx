'use client';

import React, { useState } from 'react';
import { useChat } from 'ai/react';
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

const SCENARIOS = [
  { 
    id: 'pazarlik', 
    title: 'Fiyat Pazarlığı', 
    desc: 'Bütçesi kısıtlı ve agresif bir alıcıyı ikna edin.', 
    icon: <Zap size={24} />,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10'
  },
  { 
    id: 'kararsiz', 
    title: 'Kararsız Müşteri', 
    desc: 'Karar vermek için sürekli başkalarını öne süren engelleri aşın.', 
    icon: <Coffee size={24} />,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10'
  },
  { 
    id: 'uzman', 
    title: 'Profesyonel Yatırımcı', 
    desc: 'Teknik detayları bilen ve güven arayan müşteriye kendinizi kanıtlayın.', 
    icon: <Skull size={24} />,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10'
  }
];

export function TrainingView() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [metrics, setMetrics] = useState({ persuasion: 30, trust: 50, tip: 'Başlamak için ilk mesajınızı yazın.' });
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, data } = useChat({
    api: '/api/academy',
    body: { scenario: selectedScenario },
    initialMessages: [
      { id: '1', role: 'assistant', content: 'Merhaba, bugün hangi konuda kendinizi geliştirmek istersiniz? Lütfen bir senaryo seçin.' }
    ],
    onFinish: () => {
       // useChat provides data as an array, we take the last one
       if (data && data.length > 0) {
         const lastData: any = data[data.length - 1];
         if (lastData.type === 'analysis') {
           setMetrics({
             persuasion: lastData.persuasion,
             trust: lastData.trust,
             tip: lastData.tip
           });
         }
       }
    }
  });

  // Watch data updates in real-time if possible, or just on finish
  useEffect(() => {
    if (data && data.length > 0) {
      const lastData: any = data[data.length - 1];
      if (lastData.type === 'analysis') {
        setMetrics({
          persuasion: lastData.persuasion,
          trust: lastData.trust,
          tip: lastData.tip
        });
      }
    }
  }, [data]);

  const handleStart = (id: string) => {
    setSelectedScenario(id);
    setIsStarted(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-accent/20 rounded-2xl text-accent border border-accent/20">
                <GraduationCap size={28} />
             </div>
             <div>
                <h1 className="text-4xl font-black text-white tracking-tighter">Satış Akademisi</h1>
                <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Yapay Zeka ile İkna Sanatı Lab</p>
             </div>
          </div>
        </div>
        
        {isStarted && (
           <button 
             onClick={() => setIsStarted(false)}
             className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/5 transition-all text-xs"
           >
             SENARYO DEĞİŞTİR
           </button>
        )}
      </div>

      {!isStarted ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {SCENARIOS.map((scene) => (
             <button 
              key={scene.id}
              onClick={() => handleStart(scene.id)}
              className="glass-card p-10 flex flex-col items-center text-center gap-6 hover:scale-[1.05] hover:border-accent/40 transition-all group relative overflow-hidden active:scale-95 shadow-2xl"
             >
                <div className={cn("w-20 h-20 rounded-[32px] flex items-center justify-center transition-all group-hover:scale-110", scene.bg, scene.color)}>
                  {scene.icon}
                </div>
                <div className="space-y-3">
                   <h3 className="text-xl font-black text-white">{scene.title}</h3>
                   <p className="text-slate-500 text-sm font-medium leading-relaxed">{scene.desc}</p>
                </div>
                <div className="mt-auto px-6 py-3 bg-white/5 rounded-xl border border-white/5 text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:bg-accent group-hover:text-white transition-all">
                  EĞİTİME BAŞLA
                </div>
             </button>
           ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[700px]">
           {/* Sol Panel: Chat */}
           <div className="lg:col-span-2 glass-card flex flex-col overflow-hidden bg-[#0a0f1d]/60 border-white/5 shadow-[0_32px_64px_rgba(0,0,0,0.4)]">
              <div className="p-6 border-b border-white/5 bg-accent/5 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-accent">
                       <User size={20} />
                    </div>
                    <div>
                       <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest block">MÜŞTERİ PROFİLİ</span>
                       <span className="text-sm font-bold text-white capitalize">{selectedScenario} Müşteri</span>
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Canlı Simülasyon</span>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                 {messages.map((m) => (
                   <div key={m.id} className={cn("flex flex-col max-w-[85%]", m.role === 'user' ? "ml-auto items-end" : "items-start")}>
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 px-4">
                        {m.role === 'user' ? 'SİZ (DANIŞMAN)' : 'MÜŞTERİ'}
                      </span>
                      <div className={cn(
                        "p-5 rounded-[32px] text-lg font-medium leading-relaxed shadow-xl",
                        m.role === 'user' 
                          ? "bg-accent text-white rounded-tr-none" 
                          : "bg-white/5 text-slate-200 border border-white/10 rounded-tl-none"
                      )}>
                         {m.content}
                      </div>
                   </div>
                 ))}
                 {isLoading && messages[messages.length-1].role === 'user' && (
                    <div className="flex flex-col items-start max-w-[80%] animate-pulse">
                       <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">MÜŞTERİ YAZIYOR</span>
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
                      onChange={handleInputChange}
                      placeholder="Müşteriyi ikna edecek yanıtınızı yazın..."
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

           {/* Sağ Panel: Analiz & İpucu */}
           <div className="space-y-8 flex flex-col">
              <div className="glass-card p-10 space-y-8 flex-1 border-white/5 bg-[#0a0f1d]/40 shadow-2xl">
                 <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                    <BrainCircuit size={28} className="text-secondary" />
                    <h3 className="                  <div className="space-y-10">
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                          <span className="text-white">İKNA SEVİYESİ</span>
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
                          <span className="text-white">GÜVEN SKORU</span>
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
                       AI KOÇ ÖNERİSİ
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.p 
                        key={metrics.tip}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-slate-400 text-sm leading-relaxed font-medium italic"
                      >
                        "{metrics.tip}"
                      </motion.p>
                    </AnimatePresence>
                 </div>
�rımın gelecekteki değerinden bahsetmeyi deneyin."
                    </p>
                 </div>
              </div>

              <div className="glass-card p-8 bg-green-500/5 border-green-500/10 flex items-center gap-5 group cursor-not-allowed grayscale">
                 <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center text-green-500">
                    <Target size={28} />
                 </div>
                 <div>
                    <h4 className="text-md font-black text-white leading-tight uppercase tracking-tight">Eğitimi Bitir</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Final raporunu al</p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
