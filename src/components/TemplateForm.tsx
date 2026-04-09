'use client';

import React, { useState } from 'react';
import { createTemplate } from '@/lib/actions';
import { useSector } from '@/context/SectorContext';
import { Loader2, PlusCircle } from 'lucide-react';

interface TemplateFormProps {
  onSuccess: () => void;
}

export function TemplateForm({ onSuccess }: TemplateFormProps) {
  const { currentSector } = useSector();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    category: 'SATIŞ'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSector || !formData.title || !formData.body) return;

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.set('title', formData.title);
      fd.set('body', formData.body);
      fd.set('category', formData.category);
      fd.set('sectorId', currentSector.id);
      await createTemplate(fd);
      onSuccess();
    } catch (error) {
      alert('Kayıt oluşturulurken hata oluştu!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Şablon Başlığı</label>
          <input 
            type="text" 
            required
            placeholder="Örn: Fiyat Teklifi"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full bg-slate-900/50 border border-glass-border rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all font-medium"
          />
        </div>
        
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Kategori</label>
          <select 
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full bg-slate-900/50 border border-glass-border rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all font-medium"
          >
            <option value="SATIŞ">Satış</option>
            <option value="BİLGİ">Bilgilendirme</option>
            <option value="TEKLİF">Teklif</option>
            <option value="SELAM">Selamlama</option>
            <option value="DESTEK">Destek</option>
          </select>
        </div>

        <div>
           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Mesaj İçeriği</label>
           <textarea 
             rows={8}
             required
             placeholder="Müşteriye gidecek mesaj..."
             value={formData.body}
             onChange={(e) => setFormData({...formData, body: e.target.value})}
             className="w-full bg-slate-900/50 border border-glass-border rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all font-medium resize-none"
           />
        </div>
      </div>

      <button 
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-accent hover:bg-accent-light text-white font-black rounded-2xl transition-all shadow-xl shadow-accent/20 active:scale-95 flex items-center justify-center gap-3"
      >
        {isSubmitting ? <Loader2 className="animate-spin" /> : <PlusCircle size={20} className="stroke-[3px]" />}
        Şablonu Kaydet
      </button>
      
      <p className="text-center text-[10px] text-slate-600 italic">
        Yeni şablon anında veritabanınıza kaydedilecek.
      </p>
    </form>
  );
}
