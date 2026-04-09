'use client';

import React, { useState } from 'react';
import { bulkCreateProducts } from '@/lib/actions';
import { parseMultipleListingsWithAI } from '@/lib/ai-actions';
import { 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  Terminal,
  Copy,
  PlusCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function SmartImporter() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [pastedContent, setPastedContent] = useState('');
  const [previewItems, setPreviewItems] = useState<any[]>([]);
  const [status, setStatus] = useState<'idle' | 'parsing' | 'preview' | 'importing' | 'success'>('idle');

  const handleStartParsing = async () => {
    if (!pastedContent.trim()) return;
    setIsProcessing(true);
    setStatus('parsing');
    try {
      const items = await parseMultipleListingsWithAI(pastedContent);
      setPreviewItems(items);
      setStatus('preview');
    } catch (err) {
      console.error(err);
      setStatus('idle');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalImport = async () => {
    setStatus('importing');
    setIsProcessing(true);
    try {
      const result = await bulkCreateProducts(previewItems);
      if (result.success) {
        setStatus('success');
        setTimeout(() => {
          setStatus('idle');
          setPastedContent('');
          setPreviewItems([]);
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setStatus('preview');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
         <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Terminal className="text-accent" />
            Sihirli İlan Aktarımı
         </h2>
         <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Sahibinden Mağazanızı Saniyeler İçinde Sisteme Yükleyin</p>
      </div>

      {status === 'idle' || status === 'parsing' ? (
        <div className="space-y-8">
           <div className="glass-card p-10 bg-[#0a0f1d]/60 border-white/5 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-accent">
                 <Copy size={200} />
              </div>

              <div className="flex gap-6 items-start">
                 <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent shrink-0">
                    <Copy size={24} />
                 </div>
                 <div className="space-y-2">
                    <h4 className="text-lg font-black text-white leading-tight">Nasıl Çalışır?</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                       Sahibinden mağaza sayfanıza gidin, boş bir yere tıklayıp <kbd className="px-2 py-1 bg-white/10 rounded text-accent font-mono">Ctrl+A</kbd> ile her şeyi seçin ve <kbd className="px-2 py-1 bg-white/10 rounded text-accent font-mono">Ctrl+C</kbd> ile kopyalayın. Ardından aşağıdaki kutuya yapıştırın.
                    </p>
                 </div>
              </div>

              <div className="space-y-4 relative z-10">
                 <textarea 
                   value={pastedContent}
                   onChange={(e) => setPastedContent(e.target.value)}
                   placeholder="Kopyaladığınız içeriği buraya yapıştırın..."
                   className="w-full h-64 bg-slate-950/50 border border-white/10 rounded-[32px] px-8 py-6 text-white focus:outline-none focus:border-accent transition-all font-mono text-xs leading-relaxed custom-scrollbar"
                 />
                 
                 <button 
                   onClick={handleStartParsing}
                   disabled={isProcessing || !pastedContent.trim()}
                   className="w-full py-5 bg-accent hover:bg-accent-light text-white font-black rounded-[24px] shadow-2xl shadow-accent/40 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                 >
                    {isProcessing ? (
                       <Loader2 className="animate-spin" />
                    ) : (
                       <Sparkles size={24} />
                    )}
                    İÇERİĞİ ANALİZ ET VE İLANLARI BUL
                 </button>
              </div>
           </div>
        </div>
      ) : status === 'preview' || status === 'importing' ? (
        <div className="space-y-8">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
                    <CheckCircle2 size={24} />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-white">Analiz Tamamlandı</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{previewItems.length} İlan Tespit Edildi</p>
                 </div>
              </div>
              <button 
                onClick={() => setStatus('idle')}
                className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
              >
                 İPTAL ET VE YENİDEN BAŞLA
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {previewItems.map((item, i) => (
                <div key={i} className="glass-card p-6 border-white/5 bg-slate-900/40 flex items-start gap-4 hover:border-accent/30 transition-all group">
                   <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                      {i + 1}
                   </div>
                   <div className="space-y-1">
                      <h5 className="text-sm font-bold text-white leading-tight">{item.name}</h5>
                      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                         <span className="text-accent">{item.price} TL</span>
                         <span>•</span>
                         <span>{item.category}</span>
                         <span>•</span>
                         <span>{item.location}</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>

           <div className="pt-8">
              <button 
                onClick={handleFinalImport}
                disabled={isProcessing}
                className="w-full py-6 bg-green-600 hover:bg-green-500 text-white font-black rounded-[32px] shadow-2xl shadow-green-600/20 transition-all flex items-center justify-center gap-4"
              >
                 {status === 'importing' ? (
                    <Loader2 className="animate-spin" />
                 ) : (
                    <PlusCircle size={24} />
                 )}
                 TÜMÜNÜ VERİTABANINA KAYDET
              </button>
           </div>
        </div>
      ) : (
        <div className="glass-card p-20 flex flex-col items-center justify-center text-center space-y-6 bg-green-500/5 border-green-500/20">
           <div className="w-24 h-24 bg-green-500 rounded-[40px] flex items-center justify-center text-white shadow-2xl shadow-green-500/50">
              <CheckCircle2 size={48} />
           </div>
           <div className="space-y-2">
              <h3 className="text-3xl font-black text-white">Harika!</h3>
              <p className="text-slate-400 font-medium">İlanlarınız başarıyla kaydedildi ve WhatsApp asistanınıza öğretildi.</p>
           </div>
           <button 
             onClick={() => setStatus('idle')}
             className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl transition-all"
           >
              BAŞKA AKTARIM YAP
           </button>
        </div>
      )}

      {/* Warning Alert */}
      <div className="p-6 bg-orange-500/5 border border-orange-500/10 rounded-[32px] flex gap-4 items-start">
         <AlertCircle className="text-orange-500 shrink-0" size={20} />
         <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            Bu işlem mevcut ilanlarınızı silmez, sadece yeni bulduğu ilanları ekler. Mükerrer kayıt oluşmaması için her aktarım sonrası listeyi kontrol etmeniz önerilir. Görseller ve detaylı açıklamalar için ilanları manuel düzenleyebilirsiniz.
         </p>
      </div>
    </div>
  );
}
