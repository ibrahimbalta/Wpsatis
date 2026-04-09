'use client';

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  MessageSquare, 
  Trash2, 
  Plus, 
  ChevronRight, 
  Settings2,
  Package,
  MapPin,
  Clock,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getBotRules, createBotRule } from '@/lib/actions';

interface BotRule {
  id: string;
  trigger: string;
  response: string;
  actionType: string;
  isActive: boolean;
}

export function FlowBuilder() {
  const [rules, setRules] = useState<BotRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newRule, setNewRule] = useState({ trigger: '', response: '', actionType: 'text' });

  useEffect(() => {
    async function fetchRules() {
      setIsLoading(true);
      const data = await getBotRules();
      setRules(data as any);
      setIsLoading(false);
    }
    fetchRules();
  }, []);

  const handleAddRule = async () => {
    if (!newRule.trigger || !newRule.response) return;
    
    setIsLoading(true);
    try {
      await createBotRule(newRule);
      const data = await getBotRules();
      setRules(data as any);
      setNewRule({ trigger: '', response: '', actionType: 'text' });
    } catch (error) {
      alert('Kural eklenirken hata oluştu!');
    } finally {
      setIsLoading(false);
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'catalog': return <Package size={14} />;
      case 'location': return <MapPin size={14} />;
      case 'transfer': return <Settings2 size={14} />;
      default: return <MessageSquare size={14} />;
    }
  };

  if (isLoading && rules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 glass-card">
        <Loader2 size={48} className="animate-spin mb-4 opacity-20" />
        <p className="text-lg font-medium">Kurallar yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent">
              <Zap size={24} />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">Bot Akış Kurgulayıcı</h2>
          </div>
          <p className="text-slate-500 font-medium">Anahtar kelimelere göre otomatik yanıtlar tanımlayın.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-900/50 p-2 rounded-2xl border border-glass-border">
          <span className="text-xs font-bold text-slate-400 px-3 uppercase tracking-widest">Bot Durumu</span>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-xl border border-green-500/20">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-black uppercase tracking-tighter">Aktif</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* New Rule Form */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-card p-6 border-accent/20">
            <h3 className="text-lg font-bold text-white mb-4">Yeni Kural Ekle</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Tetikleyici Kelime</label>
                <input 
                  type="text" 
                  value={newRule.trigger}
                  onChange={(e) => setNewRule({...newRule, trigger: e.target.value})}
                  placeholder="Örn: fiyat, katalog..."
                  className="w-full bg-slate-800/50 border border-glass-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-all text-sm font-medium"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Botun Yanıtı</label>
                <textarea 
                  rows={4}
                  value={newRule.response}
                  onChange={(e) => setNewRule({...newRule, response: e.target.value})}
                  placeholder="Müşteriye gidecek mesaj..."
                  className="w-full bg-slate-800/50 border border-glass-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-all text-sm font-medium resize-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Yanıt Tipi</label>
                <select 
                  value={newRule.actionType}
                  onChange={(e) => setNewRule({...newRule, actionType: e.target.value as any})}
                  className="w-full bg-slate-800/50 border border-glass-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-all text-sm font-medium"
                >
                  <option value="text">Düz Metin</option>
                  <option value="catalog">Katalog / Ürün Listesi</option>
                  <option value="location">Konum Paylaşımı</option>
                  <option value="transfer">Temsilciye Aktar</option>
                </select>
              </div>
              <button 
                onClick={handleAddRule}
                disabled={isLoading}
                className="w-full py-4 bg-accent hover:bg-accent-light text-white font-black rounded-xl transition-all shadow-xl shadow-accent/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <Plus size={20} className="stroke-[3px]" />}
                Kuralı Oluştur
              </button>
            </div>
          </div>
        </div>

        {/* Rules List */}
        <div className="lg:col-span-2 space-y-4">
          {rules.map((rule) => (
            <div key={rule.id} className={cn(
              "glass-card p-5 group transition-all duration-300",
              !rule.isActive && "opacity-50 grayscale-[0.5]"
            )}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-accent/20 text-accent text-[10px] font-black rounded-lg uppercase tracking-widest border border-accent/20">
                    IF: {rule.trigger}
                  </div>
                  <ChevronRight size={14} className="text-slate-600" />
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 text-slate-400 text-[10px] font-black rounded-lg uppercase tracking-widest border border-glass-border">
                    {getActionIcon(rule.actionType)}
                    DO: {rule.actionType}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="p-4 bg-slate-900/50 rounded-xl border border-glass-border/50">
                <p className="text-sm text-slate-300 font-medium italic">"{rule.response}"</p>
              </div>
            </div>
          ))}
          
          {rules.length === 0 && !isLoading && (
            <div className="py-12 flex flex-col items-center justify-center text-slate-500 glass-card">
              <Clock size={48} className="mb-4 opacity-20" />
              <p className="font-bold">Henüz bir kural tanımlanmadı.</p>
              <p className="text-sm">Müşteri mesajlarını otomatize etmek için ilk kuralınızı ekleyin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
