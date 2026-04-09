'use client';

import React, { useState } from 'react';
import { db } from '@/db';
import { products as productsTable } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { Loader2, PlusCircle, Package } from 'lucide-react';
import { useSector } from '@/context/SectorContext';

// We need a Server Action for creating product
// I'll create it directly in actions.ts if I haven't already
import { createProduct } from '@/lib/actions';

interface ProductFormProps {
  onSuccess: () => void;
}

export function ProductForm({ onSuccess }: ProductFormProps) {
  const { currentSector } = useSector();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'GENEL',
    description: '',
    imageLabel: 'ITEM'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSector || !formData.name || !formData.price) return;

    setIsSubmitting(true);
    try {
      await createProduct({
        ...formData,
        sectorId: currentSector.id
      });
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
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Ürün / Hizmet İsmi</label>
          <input 
            type="text" 
            required
            placeholder="Örn: Modern Seramik Karo"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full bg-slate-900/50 border border-glass-border rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all font-medium"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Fiyat (TL)</label>
            <input 
              type="number" 
              required
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="w-full bg-slate-900/50 border border-glass-border rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all font-medium"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">İkon Etiketi</label>
            <input 
              type="text" 
              placeholder="Örn: NEW, HOT"
              value={formData.imageLabel}
              onChange={(e) => setFormData({...formData, imageLabel: e.target.value})}
              className="w-full bg-slate-900/50 border border-glass-border rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all font-medium"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Kategori</label>
          <input 
            type="text" 
            placeholder="Örn: Mutfak, Banyo..."
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full bg-slate-900/50 border border-glass-border rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all font-medium"
          />
        </div>

        <div>
           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Detaylı Açıklama</label>
           <textarea 
             rows={4}
             placeholder="Müşteriye gidecek ürün detayları..."
             value={formData.description}
             onChange={(e) => setFormData({...formData, description: e.target.value})}
             className="w-full bg-slate-900/50 border border-glass-border rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent transition-all font-medium resize-none"
           />
        </div>
      </div>

      <button 
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-accent hover:bg-accent-light text-white font-black rounded-2xl transition-all shadow-xl shadow-accent/20 active:scale-95 flex items-center justify-center gap-3"
      >
        {isSubmitting ? <Loader2 className="animate-spin" /> : <Package size={20} className="stroke-[3px]" />}
        Ürünü Kaydet
      </button>
    </form>
  );
}
