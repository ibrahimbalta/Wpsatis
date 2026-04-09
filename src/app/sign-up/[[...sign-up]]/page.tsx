import { SignUp } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />
      
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-700 relative z-10">
        <div className="flex flex-col items-center mb-6">
           <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-accent/40 mb-4 -rotate-3">
             <Sparkles size={32} />
           </div>
           <h1 className="text-3xl font-black text-white tracking-tight">Ücretsiz Hesap Oluştur</h1>
           <p className="text-slate-500 font-medium text-sm mt-2 text-center">
             Kendi satış kitinizi ve chatbotunuzu hemen kurmaya başlayın.
           </p>
        </div>

        <div className="glass-card p-2 border-glass-border shadow-2xl bg-white/5 backdrop-blur-3xl overflow-hidden rounded-[2rem]">
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: "bg-accent hover:bg-accent-light text-sm font-black transition-all",
                card: "bg-transparent shadow-none border-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "bg-white/5 border-glass-border text-white hover:bg-white/10 transition-all",
                footerActionText: "text-slate-400",
                footerActionLink: "text-accent font-bold hover:text-accent-light",
                formFieldLabel: "text-slate-300 font-bold text-xs uppercase tracking-widest",
                formFieldInput: "bg-slate-900/50 border-glass-border text-white focus:border-accent transition-all",
                dividerLine: "bg-glass-border",
                dividerText: "text-slate-500 font-bold",
                identityPreviewText: "text-white",
                identityPreviewEditButtonIcon: "text-accent"
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
