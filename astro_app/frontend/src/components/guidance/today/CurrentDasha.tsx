import React from 'react';
import { DashaInfo } from '../../../types/guidance';
import { Hourglass, ChevronRight } from 'lucide-react';

interface Props {
  dasha: DashaInfo;
}

const CurrentDashaCard: React.FC<Props> = ({ dasha }) => {
  return (
    <section className="bg-white/5 rounded-2xl border border-white/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
           <Hourglass className="w-5 h-5 text-blue-300" />
           <h2 className="text-lg font-bold text-white">Current Cycle</h2>
        </div>
        <button className="text-xs text-white/40 flex items-center hover:text-white transition-colors">
           Timeline <ChevronRight className="w-3 h-3 ml-0.5" />
        </button>
      </div>

      <div className="flex items-center gap-2 text-xl font-medium text-white mb-1">
         <span className="text-blue-300">{dasha.mahaDasha.planet}</span>
         <span className="text-white/20">/</span>
         <span className="text-purple-300">{dasha.antarDasha.planet}</span>
         <span className="text-white/20">/</span>
         <span className="text-white/60 text-base">{dasha.pratyantarDasha.planet}</span>
      </div>
      
      <p className="text-sm text-white/50 mb-4">Until {new Date(dasha.antarDasha.endDate).toLocaleDateString()}</p>

      <div className="bg-black/20 rounded-lg p-3 border border-white/5 mb-4">
         <p className="text-sm text-white/80 italic">"{dasha.theme}"</p>
      </div>

      <div className="space-y-1.5">
         <div className="flex justify-between text-xs text-white/40">
            <span>Progress</span>
            <span>{dasha.daysRemaining} days left</span>
         </div>
         <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
               className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" 
               style={{ width: `${dasha.percentComplete}%` }}
            />
         </div>
      </div>
    </section>
  );
};

export default CurrentDashaCard;
