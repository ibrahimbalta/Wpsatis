import React from 'react';
import { getPublicListingWithBranding } from '@/lib/public-actions';
import { incrementViewCount, incrementClickCount } from '@/lib/actions';
import { notFound } from 'not-found';
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
  Award
} from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getPublicListingWithBranding(parseInt(id));

  if (!data) {
    notFound();
  }

  const { branding, ...listing } = data;

  // Analitik: Sayfa yüklendiğinde izlenme sayısını artır
  await incrementViewCount(listing.id);

  const type = listing.isRental ? 'KİRALIK' : 'SATILIK';
  const displayCompanyName = branding?.companyName || 'Gayrimenkul Yatırım Danışmanlığı';
  const whatsappNumber = branding?.whatsappNumber || '90'; // Default to a safe placeholder
  const whatsappMessage = `Merhaba, ${listing.name} ilanı ile ilgili bilgi almak istiyorum.\n\nFiyat: ${Number(listing.price).toLocaleString('tr-TR')} TL\nKonum: ${listing.location}`;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 selection:bg-accent selection:text-white">
      {/* Hero Section */}
      <section className="relative h-[65vh] md:h-[85vh] w-full overflow-hidden">
        {listing.imageUrl ? (
          <img 
            src={listing.imageUrl} 
            alt={listing.name} 
            className="absolute inset-0 w-full h-full object-cover animate-in fade-in zoom-in duration-1000"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0a0f1d] to-[#030712] flex items-center justify-center text-white/5 font-black text-[12vw] select-none uppercase tracking-tighter">
            {listing.name}
          </div>
        )}
        
        {/* Overlay Gradients */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-10" />
        <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-[#030712] via-[#030712]/90 to-transparent z-10" />

        {/* Floating Header (Branding Logo/Name) */}
        <header className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-20 max-w-7xl mx-auto w-full">
           <Link href="/" className="p-3 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/20 transition-all flex items-center gap-3 group">
             <ChevronLeft size={20} />
             {branding?.logoUrl && (
               <img src={branding.logoUrl} alt="office logo" className="h-8 w-auto object-contain hidden md:block" />
             )}
           </Link>
           <div className="flex gap-3">
              <div className="px-4 py-2 bg-black/40 backdrop-blur-xl rounded-xl border border-white/10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300">
                <Eye size={14} className="text-accent" />
                {listing.viewCount} İZLENME
              </div>
              <button className="p-3 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/20 transition-all">
                <Share2 size={20} />
              </button>
           </div>
        </header>

        {/* Hero Content */}
        <div className="absolute bottom-12 inset-x-0 p-6 z-20 max-w-7xl mx-auto w-full">
           <div className="flex flex-col gap-6">
              <div className="flex flex-wrap gap-3">
                <span className={`px-5 py-2 backdrop-blur-xl text-[11px] font-black rounded-full uppercase tracking-[0.2em] border shadow-2xl ${listing.isRental ? 'bg-blue-500/20 text-blue-400 border-blue-500/20' : 'bg-orange-500/20 text-orange-400 border-orange-500/20'}`}>
                  {type} GAYRİMENKUL
                </span>
                <span className="px-5 py-2 bg-white/5 backdrop-blur-xl text-[11px] font-black text-slate-300 rounded-full uppercase tracking-[0.2em] border border-white/10">
                  {listing.category}
                </span>
                <span className="px-5 py-2 bg-accent/20 backdrop-blur-xl text-[11px] font-black text-accent rounded-full uppercase tracking-[0.2em] border border-accent/30 animate-pulse">
                  ÖZEL PORTFÖY
                </span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-white tracking-tight leading-[0.85] max-w-5xl drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                {listing.name}
              </h1>
              <div className="flex items-center gap-3 text-slate-300 font-bold uppercase tracking-widest text-xs md:text-base">
                 <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
                    <MapPin size={20} className="text-accent" />
                 </div>
                 {listing.location || 'Bartın / Merkez'}
              </div>
           </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-3 gap-16 pb-32 relative z-20">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-16">
          {/* Stats Bar */}
          <div className="flex flex-col md:flex-row items-center gap-6 py-8 px-10 bg-[#0a0f1d] rounded-[32px] border border-white/5 shadow-2xl">
             <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center text-accent">
                   <TrendingUp size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">Piyasa Analizi</h4>
                  <p className="text-xs font-bold text-slate-500">Bu ilana olan ilgi son 24 saatte %20 arttı</p>
                </div>
             </div>
             <div className="h-px md:h-12 w-full md:w-px bg-white/5" />
             <div className="flex items-center gap-4">
                <Award size={24} className="text-orange-400" />
                <span className="text-sm font-bold text-slate-400">Yetkili Portföy</span>
             </div>
          </div>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             <div className="bg-white/5 border border-white/5 rounded-[32px] p-8 flex flex-col items-start gap-3 hover:bg-white/10 transition-all group cursor-default">
                <Home className="text-accent mb-2 group-hover:scale-110 transition-transform" size={28} />
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Oda Sayısı</span>
                <span className="text-2xl font-bold text-white tracking-tighter">{listing.rooms || '-'} Oda</span>
             </div>
             <div className="bg-white/5 border border-white/5 rounded-[32px] p-8 flex flex-col items-start gap-3 hover:bg-white/10 transition-all group cursor-default">
                <Maximize className="text-accent mb-2 group-hover:scale-110 transition-transform" size={28} />
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Net Alan</span>
                <span className="text-2xl font-bold text-white tracking-tighter">{listing.squareMeters || '-'} m²</span>
             </div>
             <div className="bg-white/5 border border-white/5 rounded-[32px] p-8 flex flex-col items-start gap-3 hover:bg-white/10 transition-all group cursor-default">
                <Layers className="text-accent mb-2 group-hover:scale-110 transition-transform" size={28} />
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Bulunduğu Kat</span>
                <span className="text-2xl font-bold text-white tracking-tighter">{listing.floorLevel || '-'}. Kat</span>
             </div>
             <div className="bg-white/5 border border-white/5 rounded-[32px] p-8 flex flex-col items-start gap-3 hover:bg-white/10 transition-all group cursor-default">
                <Calendar className="text-accent mb-2 group-hover:scale-110 transition-transform" size={28} />
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Durum</span>
                <span className="text-2xl font-bold text-white tracking-tighter">Aktif</span>
             </div>
          </div>

          {/* Description Section */}
          <div className="space-y-10 group">
             <div className="flex items-center gap-6">
               <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.5em] whitespace-nowrap">AÇIKLAMA</h3>
               <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
             </div>
             <p className="text-2xl text-slate-300 leading-relaxed font-medium">
               {listing.description || 'Bu portföy hakkında detaylı bilgi almak ve randevu oluşturmak için bizimle iletişime geçebilirsiniz.'}
             </p>
          </div>
          
          {/* Agent/Office Card Integration */}
          <div className="p-10 bg-gradient-to-br from-[#0a0f1d] to-[#030712] rounded-[48px] border border-white/5 shadow-2xl flex flex-col md:flex-row items-center gap-10">
             <div className="w-24 h-24 bg-accent/20 rounded-3xl flex items-center justify-center text-accent overflow-hidden shrink-0">
                {branding?.logoUrl ? (
                  <img src={branding.logoUrl} alt="logo" className="w-full h-full object-contain p-4" />
                ) : (
                  <Building2 size={48} />
                )}
             </div>
             <div className="flex-1 text-center md:text-left">
                <h4 className="text-2xl font-black text-white tracking-tight mb-2">{displayCompanyName}</h4>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Yetkili Portföy Danışmanlığı</p>
             </div>
             <div className="h-12 w-px bg-white/5 hidden md:block" />
             <div className="flex flex-col items-center md:items-end">
                <div className="flex -space-x-3 mb-3">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full bg-slate-800 border-2 border-[#030712] overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="agent" />
                     </div>
                   ))}
                </div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Uzm. Danışman Kadromuz</p>
             </div>
          </div>
        </div>

        {/* Right Column: Sticky Contact */}
        <div className="lg:col-span-1">
          <div className="sticky top-12 space-y-8">
             <div className="glass-card p-12 bg-[#0a0f1d] border-white/5 shadow-[0_0_120px_rgba(0,0,0,0.6)] rounded-[64px] space-y-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Award size={100} />
                </div>
                
                <div className="relative z-10">
                   <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.5em] block mb-4">GÜNCEL DEĞERLEYEME</span>
                   <div className="flex items-baseline gap-3">
                      <span className="text-7xl font-black text-white tracking-tighter drop-shadow-2xl">
                        {Number(listing.price).toLocaleString('tr-TR')}
                      </span>
                      <span className="text-2xl font-bold text-accent uppercase tracking-widest">TL</span>
                   </div>
                </div>

                <div className="space-y-4 pt-4 relative z-10">
                   {/* Dynamic WhatsApp Integration according to Branding settings */}
                   <form action={async () => { 
                      'use server'; 
                      await incrementClickCount(listing.id);
                   }}>
                     <a 
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                      target="_blank"
                      className="w-full flex items-center justify-center gap-4 py-6 bg-accent hover:bg-accent-light text-white font-black rounded-[36px] transition-all shadow-2xl shadow-accent/40 active:scale-95 text-2xl group"
                     >
                       <MessageSquare size={28} className="stroke-[3px] group-hover:scale-110 transition-transform" />
                       WHATSAPP'TAN SOR
                     </a>
                   </form>
                   
                   <a 
                    href={`tel:${whatsappNumber}`}
                    className="w-full flex items-center justify-center gap-4 py-6 bg-white/5 hover:bg-white/10 text-white font-black rounded-[36px] transition-all border border-white/5 active:scale-95 text-xl"
                   >
                     <Phone size={24} />
                     HEMEN ARA
                   </a>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-5 relative z-10">
                   <div className="px-4 py-1.5 bg-green-500/10 rounded-full border border-green-500/20 text-[10px] font-black text-green-500 uppercase tracking-[0.2em] flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Danışman Çevrimiçi
                   </div>
                   <p className="text-[10px] text-center text-slate-600 font-bold uppercase tracking-[0.3em]">Resmi Portföy Sahibi: <br/> <span className="text-slate-400 mt-1 block">{displayCompanyName}</span></p>
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* Fixed Sticky Call to Action Mobile Only */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black via-black/95 to-transparent z-50">
         <a 
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
          className="w-full flex items-center justify-center gap-4 py-6 bg-accent text-white font-black rounded-[36px] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] active:scale-95 transition-transform text-xl"
         >
           <MessageSquare size={28} className="stroke-[3px]" />
           DANIŞMANA SOR
         </a>
      </div>
    </div>
  );
}
