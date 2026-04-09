'use client';

import React, { useState, useEffect } from 'react';
import { getPublicListingWithBranding } from '@/lib/public-actions';
import { incrementViewCount, incrementClickCount } from '@/lib/actions';
import { 
  Building2, 
  MapPin, 
  Home, 
  Maximize, 
  Phone, 
  MessageSquare, 
  Share2, 
  ChevronLeft,
  Calendar,
  Layers,
  Eye,
  TrendingUp,
  Award,
  ChevronRight,
  Sparkles,
  Navigation,
  Smartphone
} from 'lucide-react';
import Link from 'next/link';
import { ImageSlider } from '@/components/ImageSlider';
import { StoryCard } from '@/components/StoryCard';
import { AnimatePresence } from 'framer-motion';

export default function ListingPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);
  const [showStory, setShowStory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const listingData = await getPublicListingWithBranding(parseInt(params.id));
      if (listingData) {
        setData(listingData);
        // Analitik: İzlenme sayısını artır
        await incrementViewCount(listingData.id);
      }
      setIsLoading(false);
    }
    loadData();
  }, [params.id]);

  if (isLoading) return (
    <div className="h-screen bg-[#030712] flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!data) return <div className="h-screen bg-[#030712] flex items-center justify-center text-white font-black">İLAN BULUNAMADI</div>;

  const { branding, ...listing } = data;

  // Fotoğrafları hazırla
  let allImages: string[] = [];
  if (listing.imageUrl) allImages.push(listing.imageUrl);
  try {
    if (listing.extraImages) {
      const extras = JSON.parse(listing.extraImages);
      if (Array.isArray(extras)) allImages = [...allImages, ...extras];
    }
  } catch (e) {}

  const type = listing.isRental ? 'KİRALIK' : 'SATILIK';
  const displayCompanyName = branding?.companyName || 'Gayrimenkul Yatırım Danışmanlığı';
  const whatsappNumber = branding?.whatsappNumber || '90';
  const whatsappMessage = `Merhaba, ${listing.name} ilanı ile ilgili bilgi almak istiyorum.\n\nFiyat: ${Number(listing.price).toLocaleString('tr-TR')} TL\nKonum: ${listing.location}`;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 selection:bg-accent selection:text-white relative">
      <AnimatePresence>
        {showStory && (
          <StoryCard 
            listing={listing} 
            branding={branding} 
            onClose={() => setShowStory(false)} 
          />
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[90vh] w-full overflow-hidden bg-black">
        {allImages.length > 0 ? (
          <ImageSlider images={allImages} />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
            <Building2 size={120} className="text-white/5" />
          </div>
        )}
        
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-[40vh] bg-gradient-to-t from-[#030712] via-[#030712]/90 to-transparent z-10 pointer-events-none" />

        {/* Kurumsal Header */}
        <header className="absolute top-0 inset-x-0 p-8 flex justify-between items-center z-20 max-w-7xl mx-auto w-full">
           <Link href="/" className="p-4 bg-black/40 backdrop-blur-3xl rounded-[24px] border border-white/10 hover:bg-white/10 transition-all flex items-center gap-4 group">
             <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
             {branding?.logoUrl && <img src={branding.logoUrl} alt="logo" className="h-8 w-auto object-contain" />}
           </Link>
           
           <div className="flex gap-4">
              <button 
                onClick={() => setShowStory(true)}
                className="px-5 py-2.5 bg-accent/20 backdrop-blur-3xl rounded-2xl border border-accent/30 flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest text-accent hover:bg-accent hover:text-white transition-all shadow-xl shadow-accent/20"
              >
                <Smartphone size={16} />
                STORY MODU
              </button>
              <div className="px-5 py-2.5 bg-black/40 backdrop-blur-3xl rounded-2xl border border-white/10 flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest text-slate-300">
                <Eye size={16} className="text-accent" />
                {listing.viewCount}
              </div>
           </div>
        </header>

        {/* Hero Content */}
        <div className="absolute bottom-12 inset-x-0 p-8 z-30 max-w-7xl mx-auto w-full pointer-events-none">
           <div className="flex flex-col gap-6 max-w-5xl">
              <div className="flex flex-wrap gap-3">
                <span className={`px-6 py-2.5 backdrop-blur-3xl text-[12px] font-black rounded-full uppercase tracking-[0.2em] border shadow-2xl ${listing.isRental ? 'bg-blue-500/30 text-blue-400 border-blue-500/20' : 'bg-orange-500/30 text-orange-400 border-orange-500/20'}`}>
                  {type} PORTFÖY
                </span>
                <span className="px-6 py-2.5 bg-white/5 backdrop-blur-3xl text-[12px] font-black text-slate-300 rounded-full uppercase tracking-[0.2em] border border-white/10 shadow-2xl">
                  {listing.category}
                </span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-white tracking-tight leading-[0.8] drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                {listing.name}
              </h1>
              <div className="flex items-center gap-4 text-slate-300 font-bold uppercase tracking-[0.3em] text-sm md:text-lg">
                 <div className="w-12 h-12 bg-accent/20 rounded-[18px] flex items-center justify-center backdrop-blur-xl">
                    <MapPin size={24} className="text-accent" />
                 </div>
                 {listing.location || 'Bartın / Merkez'}
              </div>
           </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full px-8 grid grid-cols-1 lg:grid-cols-3 gap-20 pb-40 relative z-20">
        <div className="lg:col-span-2 space-y-20">
          
          {/* Teknik Detaylar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             {[
               { icon: <Home />, label: 'Oda Sayısı', val: `${listing.rooms || '-'} Oda` },
               { icon: <Maximize />, label: 'Alan', val: `${listing.squareMeters || '-'} m²` },
               { icon: <Layers />, label: 'Kat', val: `${listing.floorLevel || '-'}. Kat` },
               { icon: <Navigation />, label: 'Kategori', val: listing.category }
             ].map((spec, i) => (
                <div key={i} className="bg-white/5 border border-white/5 rounded-[40px] p-10 flex flex-col items-start gap-4 hover:bg-white/10 transition-all group shadow-xl">
                   <div className="text-accent group-hover:scale-110 transition-transform">{React.cloneElement(spec.icon as React.ReactElement, { size: 32 })}</div>
                   <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">{spec.label}</span>
                   <span className="text-2xl font-bold text-white tracking-tighter">{spec.val}</span>
                </div>
             ))}
          </div>

          {/* Açıklama */}
          <div className="space-y-12">
             <div className="flex items-center gap-8">
               <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.6em] whitespace-nowrap">DETAYLI AÇIKLAMA</h3>
               <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
             </div>
             <p className="text-2xl text-slate-300 leading-[1.6] font-medium tracking-tight">
               {listing.description || 'Bu portföy hakkında detaylı bilgi almak için iletişim kurun.'}
             </p>
          </div>

          {/* Harita Bölümü (Yeni) */}
          {listing.latitude && listing.longitude && (
            <div className="space-y-10 group">
               <div className="flex items-center gap-8">
                 <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.6em] whitespace-nowrap">KONUM VE ÇEVRE</h3>
                 <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
               </div>
               <div className="relative aspect-video w-full rounded-[48px] overflow-hidden border border-white/5 shadow-2xl">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight={0} 
                    marginWidth={0} 
                    src={`https://maps.google.com/maps?q=${listing.latitude},${listing.longitude}&hl=tr&z=15&output=embed`}
                    className="grayscale-[0.8] contrast-[1.2] invert-[0.9] brightness-[0.9]"
                  />
                  <div className="absolute bottom-10 right-10 z-10">
                     <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${listing.latitude},${listing.longitude}`}
                      target="_blank"
                      className="px-8 py-4 bg-accent text-white font-black rounded-2xl shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform"
                     >
                       <Navigation size={20} />
                       YOL TARİFİ AL
                     </a>
                  </div>
               </div>
            </div>
          )}
          
          {/* Ofis Kartı */}
          <div className="p-12 bg-gradient-to-br from-[#0a0f1d] to-[#030712] rounded-[64px] border border-white/5 shadow-2xl flex flex-col md:flex-row items-center gap-12 group">
             <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center overflow-hidden shrink-0 border border-white/5">
                {branding?.logoUrl ? <img src={branding.logoUrl} alt="logo" className="w-full h-full object-contain p-4" /> : <Building2 size={48} className="text-accent/40" />}
             </div>
             <div className="flex-1 text-center md:text-left">
                <h4 className="text-2xl font-black text-white tracking-tighter mb-1">{displayCompanyName}</h4>
                <p className="text-[10px] text-accent/60 font-black uppercase tracking-widest leading-none">Yetkili Portföy Danışmanlığı</p>
             </div>
             <div className="h-20 w-px bg-white/5 hidden md:block" />
             <div className="flex flex-col items-center md:items-end gap-3 text-right">
                <div className="flex -space-x-4 mb-1">
                   {[1,2,3].map(i => <div key={i} className="w-12 h-12 rounded-2xl bg-slate-800 border-4 border-[#0a0f1d] overflow-hidden shadow-2xl"><img src={`https://i.pravatar.cc/150?u=${i+200}`} /></div>)}
                </div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Uzman Kadromuz</p>
             </div>
          </div>
        </div>

        {/* Sağ Kolon: Fiyat ve İletişim */}
        <div className="lg:col-span-1">
          <div className="sticky top-12 space-y-10">
             <div className="glass-card p-14 bg-[#0a0f1d] border-white/5 shadow-[0_50px_150px_rgba(0,0,0,0.8)] rounded-[72px] space-y-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity"><Target size={120} /></div>
                
                <div className="relative z-10 space-y-2">
                   <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.5em] block mb-4">GÜNCEL FİYAT</span>
                   <div className="flex items-baseline gap-4">
                      <span className="text-6xl font-black text-white tracking-tighter drop-shadow-2xl">{Number(listing.price).toLocaleString('tr-TR')}</span>
                      <span className="text-2xl font-bold text-accent uppercase tracking-widest">TL</span>
                   </div>
                </div>

                <div className="space-y-6 pt-6 relative z-10">
                   <a 
                    onClick={() => incrementClickCount(listing.id)}
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                    target="_blank"
                    className="w-full flex items-center justify-center gap-5 py-7 bg-accent hover:bg-accent-light text-white font-black rounded-[40px] transition-all shadow-2xl active:scale-95 text-2xl group shadow-accent/30"
                   >
                     <MessageSquare size={32} className="stroke-[3px] group-hover:scale-110 transition-transform" />
                     WHATSAPP İLE SOR
                   </a>
                   
                   <a 
                    href={`tel:${whatsappNumber}`}
                    className="w-full flex items-center justify-center gap-5 py-7 bg-white/5 hover:bg-white/10 text-white font-black rounded-[40px] transition-all border border-white/5 active:scale-95 text-2xl"
                   >
                     <Phone size={28} />
                     HEMEN ARA
                   </a>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col items-center gap-6 relative z-10 text-center">
                   <div className="flex items-center gap-3 px-5 py-2 bg-green-500/10 rounded-full border border-green-500/20 text-[11px] font-black text-green-500 uppercase tracking-widest animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                      DANIŞMAN ÇEVRİMİÇİ
                   </div>
                   <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.4em] leading-relaxed">RESMİ İLAN SAHİBİ <br/><span className="text-white font-black mt-2 inline-block">{displayCompanyName}</span></p>
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* Mobil Alt Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black via-black/95 to-transparent z-50">
         <a 
          onClick={() => incrementClickCount(listing.id)}
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
          className="w-full flex items-center justify-center gap-5 py-7 bg-accent text-white font-black rounded-[40px] shadow-[0_-30px_60px_rgba(0,0,0,0.8)] active:scale-95 transition-transform text-2xl"
         >
           <MessageSquare size={32} className="stroke-[3px]" />
           DANIŞMANA SOR
         </a>
      </div>
    </div>
  );
}
