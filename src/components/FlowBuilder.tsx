import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Power, 
  AlertCircle, 
  Package, 
  MapPin, 
  Settings2, 
  MessageSquare, 
  Loader2, 
  Zap, 
  Plus,
  Trash2,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getBotRules, createBotRule, toggleBotRule, deleteBotRule } from '@/lib/actions';

interface BotRule {
  id: number;
  trigger: string;
  response: string;
  actionType: string;
  isAiFallback: boolean;
  isActive: boolean;
}

export function FlowBuilder() {
  const [rules, setRules] = useState<BotRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newRule, setNewRule] = useState({ 
    trigger: '', 
    response: '', 
    actionType: 'text',
    isAiFallback: false 
  });

  const fetchRules = async () => {
    setIsLoading(true);
    const data = await getBotRules();
    setRules(data as any);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleAddRule = async () => {
    if (!newRule.trigger || !newRule.response) return;
    
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('trigger', newRule.trigger);
      formData.append('response', newRule.response);
      formData.append('actionType', newRule.actionType);
      formData.append('isAiFallback', String(newRule.isAiFallback));
      
      await createBotRule(formData);
      await fetchRules();
      setNewRule({ trigger: '', response: '', actionType: 'text', isAiFallback: false });
    } catch (error) {
      alert('Kural eklenirken hata oluştu!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (id: number, current: boolean) => {
    try {
      await toggleBotRule(id, !current);
      await fetchRules();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu kuralı silmek istediğinize emin misiniz?')) return;
    try {
      await deleteBotRule(id);
      await fetchRules();
    } catch (err) {
      console.error(err);
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
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent shadow-lg border border-accent/20">
              <Zap size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Akış Kurgulayıcı</h2>
              <p className="text-slate-500 font-medium text-sm">WhatsApp botunuzun nasıl tepki vereceğini tasarlayın.</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5 backdrop-blur-xl">
           <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-xl border border-green-500/20">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest">Sistem Online</span>
           </div>
           <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-xl border border-accent/20">
             <Sparkles size={14} />
             <span className="text-[10px] font-black uppercase tracking-widest">AI Hibrit Aktif</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* New Rule Form */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card p-8 border-accent/20 sticky top-32">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
               <Plus className="text-accent" />
               Yeni Akış Ekle
            </h3>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block ml-1">Tetikleyici Kelime (Trigger)</label>
                <input 
                  type="text" 
                  value={newRule.trigger}
                  onChange={(e) => setNewRule({...newRule, trigger: e.target.value})}
                  placeholder="Örn: fiyat, konum, selam..."
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all text-sm font-bold placeholder:text-slate-700"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block ml-1">Otomatik Yanıt (Response)</label>
                <textarea 
                  rows={4}
                  value={newRule.response}
                  onChange={(e) => setNewRule({...newRule, response: e.target.value})}
                  placeholder="Müşteriye gidecek mesaj..."
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all text-sm font-medium resize-none placeholder:text-slate-700"
                />
              </div>
              
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-accent" />
                      <span className="text-xs font-bold text-slate-200">AI Fallback</span>
                   </div>
                   <button 
                     onClick={() => setNewRule({...newRule, isAiFallback: !newRule.isAiFallback})}
                     className={cn(
                       "w-10 h-5 rounded-full transition-all relative flex items-center px-1",
                       newRule.isAiFallback ? "bg-accent" : "bg-slate-700"
                     )}
                   >
                     <motion.div 
                       animate={{ x: newRule.isAiFallback ? 20 : 0 }}
                       className="w-3 h-3 bg-white rounded-full shadow-lg" 
                     />
                   </button>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed italic">Eğer bu kural tek başına yetersiz kalırsa AI motoru bağlamı tamamlamak için devreye girer.</p>
              </div>

              <button 
                onClick={handleAddRule}
                disabled={isLoading}
                className="w-full py-5 bg-accent hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] text-white font-black rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <Plus size={20} className="stroke-[3px]" />}
                AKIDŞI KAYDET
              </button>
            </div>
          </div>
        </div>

        {/* Rules List */}
        <div className="lg:col-span-8 space-y-6">
          {rules.map((rule) => (
            <motion.div 
              layout
              key={rule.id} 
              className={cn(
                "glass-card p-6 group transition-all duration-300 relative overflow-hidden",
                !rule.isActive && "opacity-60 grayscale-[0.8]"
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 bg-accent/20 text-accent text-[11px] font-black rounded-xl uppercase tracking-[0.1em] border border-accent/20">
                    IF: {rule.trigger}
                  </div>
                  <ChevronRight size={18} className="text-slate-600" />
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 text-[11px] font-black rounded-xl uppercase tracking-[0.1em] border border-white/5">
                    {getActionIcon(rule.actionType)}
                    DO: {rule.actionType}
                  </div>
                  {rule.isAiFallback && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 text-purple-400 text-[9px] font-black rounded-lg uppercase border border-purple-500/20">
                       <Sparkles size={10} />
                       AI-POWERED
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleToggle(rule.id, rule.isActive)}
                    className={cn(
                      "p-3 rounded-xl transition-all border",
                      rule.isActive ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-slate-700 text-slate-400 border-slate-600"
                    )}
                  >
                    <Power size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(rule.id)}
                    className="p-3 text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-all border border-red-500/10"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 bg-black/20 rounded-2xl border border-white/5 relative group-hover:border-accent/20 transition-colors">
                <div className="absolute top-4 right-4 text-slate-800/20"><MessageSquare size={40} /></div>
                <p className="text-slate-300 font-medium leading-relaxed relative z-10">"{rule.response}"</p>
              </div>
            </motion.div>
          ))}
          
          {rules.length === 0 && !isLoading && (
            <div className="py-24 flex flex-col items-center justify-center text-slate-500 glass-card border-dashed">
              <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-6 text-slate-700">
                <AlertCircle size={40} />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Henüz Bir Akış Yok</h4>
              <p className="text-sm max-w-xs text-center">WhatsApp botunuzun zekasını artırmak için soldaki paneli kullanarak ilk kuralı tanımlayın.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
