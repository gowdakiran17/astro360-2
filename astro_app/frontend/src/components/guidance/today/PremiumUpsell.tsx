import React from 'react';
import { Crown, Sparkles } from 'lucide-react';

interface Props {
  theme?: any;
}

const PremiumUpsell: React.FC<Props> = () => {
  return (
    <section className="mx-4 mt-8 mb-12 text-center">
      <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-2xl p-6 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30" />
         
         <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-3 shadow-lg shadow-orange-500/20">
               <Crown className="w-6 h-6 text-white" />
            </div>
            
            <h3 className="text-lg font-bold text-white mb-2">Unlock Cosmic Premium</h3>
            <p className="text-sm text-white/70 mb-4 max-w-xs mx-auto">
               Get deeper insights, unlimited tarot pulls, and personalized transit alerts.
            </p>
            
            <button className="bg-white text-orange-900 px-6 py-2.5 rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
               <Sparkles className="w-4 h-4" /> Start 7-Day Free Trial
            </button>
            
            <p className="text-[10px] text-white/40 mt-3">Cancel anytime. No commitment.</p>
         </div>
      </div>
    </section>
  );
};

export default PremiumUpsell;
