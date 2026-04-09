'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Home, Maximize, Building2, MessageSquare, Award } from 'lucide-react';

interface StoryCardProps {
  listing: any;
  branding: any;
  onClose: () => void;
}

export function StoryCard({ listing, branding, onClose }: StoryCardProps) {
  const type = listing.isRental ? 'KİRALIK' : 'SATILIK';
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4 md:p-10"
    >
      {/* Kapatma Butonu */}
      <button 
        onClick={onClose}
        className="absolute top-10 right-10 z-[110] px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/10 text-white font-black rounded-2xl hover:bg-white/20 transition-all"
      >
        MODDAN ÇIK
      </button>

      {/* Story Kartı (9:16 Aspect Ratio) */}
      <div className="relative aspect-[9/16] h-full max-h-[90vh] bg-slate-900 rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5 mx-auto">
        
        {/* Arka Plan Görseli */}
        {listing.imageUrl ? (
          <img 
            src={listing.imageUrl} 
            alt="story" 
            className="absolute inset-0 w-full h-full object-cover scale-105 blur-[2px] opacity-60"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-black" />
        )}

        {/* Sinematik Katmanlar */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#030712] z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />

        {/* İçerik */}
        <div className="relative z-20 h-full flex flex-col p-10 justify-between">
          
          {/* Üst Kısım: Logo ve Kategori */}
          <div className="flex flex-col items-center gap-6 mt-4">
             <div className="w-24 h-24 bg-white/5 backdrop-blur-3xl rounded-[32px] border border-white/10 flex items-center justify-center p-4">
                {branding?.logoUrl ? (
                  <img src={branding.logoUrl} alt="logo" className="w-full h-full object-contain" />
                ) : (
                  <Building2 size={48} className="text-secondary" />
                )}
             </div>
             <div className="text-center">
                <h4 className="text-sm font-black text-white uppercase tracking-[0.4em] mb-2 drop-shadow-lg">
                  {branding?.companyName || 'EMLAK YATIRIM'}
                </h4>
                <div className="inline-block px-4 py-1.5 bg-accent/20 backdrop-blur-xl border border-accent/30 rounded-full text-[10px] font-black text-accent uppercase tracking-widest">
                  {type} PORTFÖY
                </div>
             </div>
          </div>

          {/* Orta Kısım: İsim ve Büyük Görsel Kartı */}
          <div className="flex flex-col gap-4">
             <div className="aspect-square w-full rounded-[40px] overflow-hidden border border-white/10 shadow-2xl relative">
                {listing.imageUrl ? (
                  <img src={listing.imageUrl} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                    <Home size={64} className="text-slate-700" />
                  </div>
                )}
                {/* Rozet */}
                <div className="absolute top-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[10px] font-black text-white uppercase tracking-widest">AKTİF İLAN</span>
                </div>
             </div>
             <div>
                <h2 className="text-3xl font-black text-white tracking-tighter leading-[0.9] text-center mt-4 drop-shadow-2xl">
                  {listing.name}
                </h2>
                <div className="flex items-center justify-center gap-2 text-slate-300 font-bold uppercase tracking-widest text-[10px] mt-4 opacity-80">
                   <MapPin size={14} className="text-accent" />
                   {listing.location}
                </div>
             </div>
          </div>

          {/* Alt Kısım: Fiyat ve Detaylar */}
          <div className="space-y-8 mb-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-5 flex flex-col items-center gap-1 shadow-xl">
                   <Home size={18} className="text-accent mb-1" />
                   <span className="text-xs font-black text-white">{listing.rooms || '-'}</span>
                   <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">ODA</span>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-5 flex flex-col items-center gap-1 shadow-xl">
                   <Maximize size={18} className="text-accent mb-1" />
                   <span className="text-xs font-black text-white">{listing.squareMeters || '-'} m²</span>
                   <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">ALAN</span>
                </div>
             </div>

             <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-2 opacity-60">GÜNCEL FİYAT</span>
                <div className="flex items-baseline gap-2">
                   <span className="text-6xl font-black text-white tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                     {Number(listing.price).toLocaleString('tr-TR')}
                   </span>
                   <span className="text-xl font-black text-accent uppercase tracking-widest">TL</span>
                </div>
             </div>

             <div className="p-6 bg-accent rounded-[32px] shadow-2xl shadow-accent/20 flex items-center justify-center gap-3 active:scale-95 transition-transform cursor-pointer">
                <MessageSquare size={20} className="stroke-[3px] text-white" />
                <span className="text-sm font-black text-white uppercase tracking-widest">DETAYLAR İÇİN LİNKE TIKLA</span>
             </div>
             
             <div className="flex items-center justify-center gap-2 opacity-40">
                <Award size={14} className="text-white" />
                <span className="text-[8px] font-black text-white uppercase tracking-[0.3em]">RESMİ YETKİLİ İLAN</span>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
