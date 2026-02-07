import React from 'react';
import { TomorrowPreview } from '../../../types/guidance';
import { ArrowRight, Moon } from 'lucide-react';

interface Props {
  preview: TomorrowPreview;
  theme?: any;
}

const TomorrowSneakPeek: React.FC<Props> = ({ preview }) => {
  return (
    <section className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 rounded-2xl border border-indigo-500/20 p-5 relative overflow-hidden group cursor-pointer">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
         <Moon className="w-16 h-16" />
      </div>

      <div className="relative z-10">
         <div className="flex items-center gap-2 mb-2 text-indigo-300">
            <Moon className="w-4 h-4" />
            <h2 className="text-xs font-bold uppercase tracking-widest">Tomorrow's Hint</h2>
         </div>
         
         <h3 className="text-lg font-bold text-white mb-1">{preview.theme}</h3>
         <p className="text-sm text-white/60 mb-4 line-clamp-2">{preview.teaser}</p>

         <button className="flex items-center gap-1 text-xs font-medium text-indigo-300 group-hover:text-white transition-colors">
            Unlock Full Preview <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
         </button>
      </div>
    </section>
  );
};

export default TomorrowSneakPeek;
