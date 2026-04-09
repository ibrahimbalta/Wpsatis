'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, User, Bot, Clock, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  user: string;
  message: string;
  response: string;
  time: string;
  status: 'replied' | 'pending';
}

const mockActivities: Activity[] = [
  { id: '1', user: '+90 532 *** 12 34', message: 'Şişli\'de kiralık daire var mı?', response: 'Evet, Şişli bölgesinde 3 adet kiralık dairemiz bulunuyor...', time: '2 dakika önce', status: 'replied' },
  { id: '2', user: '+90 216 *** 45 67', message: 'Katalog alabilir miyim?', response: 'Tabii, 2026 dijital kataloğumuzu şu linkten...', time: '15 dakika önce', status: 'replied' },
  { id: '3', user: '+90 541 *** 88 99', message: 'Villa fiyatları ne kadar?', response: 'Villa fiyatlarımız 32M TL\'den başlamaktadır...', time: '1 saat önce', status: 'replied' },
];

export function LiveActivity() {
  return (
    <div className="glass-card p-6 border-white/5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
            <Clock size={18} />
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">Canlı Aktivite</h3>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-full border border-green-500/20">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">Canlı</span>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar">
        <AnimatePresence initial={false}>
          {mockActivities.map((activity, i) => (
            <motion.div 
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-all group"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                    <User size={12} />
                  </div>
                  <span className="text-xs font-bold text-slate-300">{activity.user}</span>
                </div>
                <span className="text-[9px] text-slate-500 font-bold uppercase">{activity.time}</span>
              </div>
              
              <div className="space-y-3">
                 <div className="flex gap-3">
                    <MessageSquare size={14} className="text-slate-600 mt-1 shrink-0" />
                    <p className="text-xs text-slate-400 font-medium italic">"{activity.message}"</p>
                 </div>
                 <div className="flex gap-3 p-3 rounded-xl bg-accent/5 border border-accent/10">
                    <Bot size={14} className="text-accent mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-[11px] text-slate-200 font-medium leading-relaxed">{activity.response}</p>
                      <div className="flex justify-end mt-1">
                        <CheckCheck size={12} className="text-accent opacity-50" />
                      </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button className="mt-6 w-full py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors border-t border-white/5 pt-6">
        Tüm Kayıtları Görüntüle
      </button>
    </div>
  );
}
