'use client';

import React, { useState, useEffect } from 'react';
import { updateUserProfile, getUserProfile } from '@/lib/actions';
import { 
  Building2, 
  Image as ImageIcon, 
  Phone, 
  Save, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck,
  Globe,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function SettingsView() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');
  
  const [formData, setFormData] = useState({
    companyName: '',
    logoUrl: '',
    whatsappNumber: '',
    isAiEnabled: true,
  });

  useEffect(() => {
    async function loadProfile() {
      const profile = await getUserProfile();
      if (profile) {
        setFormData({
          companyName: profile.companyName || '',
          logoUrl: profile.logoUrl || '',
          whatsappNumber: profile.whatsappNumber || '',
          isAiEnabled: profile.isAiEnabled ?? true,
        });
      }
      setIsLoading(false);
    }
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const form = new FormData(e.currentTarget);
    try {
      await updateUserProfile(form);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 glass-card">
        <Loader2 size={48} className="animate-spin mb-4 opacity-20" />
        <p className="text-lg font-medium">Profil ayarları yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4 mb-2">
         <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent border border-accent/20">
            <ShieldCheck size={24} />
         </div>
         <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Kurumsal Kimlik</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Markanızı Tüm Dünyaya Tanıtın</p>
         </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-10 space-y-10 border-white/5 bg-[#0a0f1d]/60 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Ofis Bilgileri */}
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Emlak Ofisi İsmi</label>
              <div className="relative">
                <input 
                  name="companyName" 
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  placeholder="Örn: Balta Gayrimenkul & Yatırım"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all pl-12 font-medium" 
                />
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Müşteri WhatsApp Hattı</label>
              <div className="relative">
                <input 
                  name="whatsappNumber" 
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})}
                  placeholder="905XXXXXXXXX"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all pl-12 font-medium" 
                />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              </div>
              <p className="text-[9px] text-slate-600 font-bold ml-1 italic">* Başına 90 ekleyerek bitişik yazın.</p>
            </div>
          </div>

          {/* Logo ve Önizleme */}
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Ofis Logosu (URL)</label>
              <div className="relative">
                <input 
                  name="logoUrl" 
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                  placeholder="https://siteniz.com/logo.png"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all pl-12 font-medium" 
                />
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              </div>
            </div>

            {/* Logo Preview */}
            <div className="p-6 bg-slate-900/30 border border-dashed border-white/10 rounded-[32px] flex flex-col items-center justify-center min-h-[160px] relative group overflow-hidden">
               {formData.logoUrl ? (
                 <div className="flex flex-col items-center gap-4">
                    <img src={formData.logoUrl} alt="logo preview" className="max-h-24 w-auto object-contain drop-shadow-2xl" />
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest text-accent">Logo Önizleme</span>
                 </div>
               ) : (
                 <>
                    <Globe className="text-slate-800 mb-2 group-hover:scale-110 transition-transform" size={40} />
                    <p className="text-[10px] text-slate-600 font-bold uppercase">Logo Linki Girin</p>
                 </>
               )}
            </div>
          </div>
        </div>

        {/* Global AI Toggle */}
        <div className="p-8 bg-accent/5 border border-accent/10 rounded-[32px] flex items-center justify-between gap-6 group">
           <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent">
                 <Sparkles size={24} />
              </div>
              <div>
                 <h4 className="text-md font-black text-white leading-tight uppercase tracking-tight">Global AI Desteği</h4>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Kural bulunamazsa AI otomatik yanıt versin</p>
              </div>
           </div>
           
           <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="isAiEnabled"
                value="true"
                checked={formData.isAiEnabled}
                onChange={(e) => setFormData({...formData, isAiEnabled: e.target.checked})}
                className="sr-only peer" 
              />
              <input type="hidden" name="isAiEnabled" value={formData.isAiEnabled ? 'true' : 'false'} />
              <div className="w-14 h-7 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-accent peer-checked:after:bg-white"></div>
           </label>
        </div>

        <div className="pt-6 border-t border-white/5">
          <button 
            type="submit" 
            disabled={isSaving || status === 'success'}
            className={cn(
              "w-full py-5 rounded-[28px] font-black text-xl transition-all shadow-2xl flex items-center justify-center gap-4 active:scale-[0.98]",
              status === 'success' 
                ? "bg-green-500 text-white shadow-green-500/20" 
                : "bg-accent hover:bg-accent-light text-white shadow-accent/40"
            )}
          >
            {isSaving ? (
              <Loader2 size={24} className="animate-spin" />
            ) : status === 'success' ? (
              <>
                <CheckCircle2 size={24} />
                AYARLAR KAYDEDİLDİ
              </>
            ) : (
              <>
                <Save size={24} />
                TÜM BİLGİLERİ GÜNCELLE
              </>
            )}
          </button>
        </div>
      </form>

      {/* Branding Guide Info */}
      <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-[40px] flex gap-6 items-start">
         <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 shrink-0">
            <Globe size={24} />
         </div>
         <div>
            <h4 className="text-lg font-black text-white mb-1 tracking-tight">Profesyonel Görünüm Önerisi</h4>
            <p className="text-slate-500 text-sm leading-relaxed">
              İlanlarınızın müşterilerde güven oluşturması için logonuzun arka planı şeffaf (PNG) ve kare formatta olması önerilir. Kurumsal numaranızı güncellediğinizde tüm ilan sayfalarınızdaki "WhatsApp ile Sor" butonları anında bu numaraya yönlenecektir.
            </p>
         </div>
      </div>
    </div>
  );
}
