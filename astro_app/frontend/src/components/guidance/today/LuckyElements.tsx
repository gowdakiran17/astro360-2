import React from 'react';
import { LuckyElements } from '../../../types/guidance';
import { Gem, Compass, Clock } from 'lucide-react';

interface Props {
  lucky: LuckyElements;
}

const LuckyElementsCard: React.FC<Props> = ({ lucky }) => {
  return (
    <section className="bg-white/5 rounded-2xl border border-white/10 p-5">
      <h2 className="text-lg font-bold text-white mb-4">Lucky Elements</h2>
      
      <div className="grid grid-cols-2 gap-3">
         <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col items-center text-center gap-2">
            <div 
               className="w-8 h-8 rounded-full border-2 border-white/20 shadow-lg"
               style={{ backgroundColor: lucky.colorHex }} 
            />
            <div>
               <span className="text-[10px] text-white/40 block uppercase">Color</span>
               <span className="text-sm font-medium text-white">{lucky.color}</span>
            </div>
         </div>

         <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col items-center text-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white font-bold font-serif">
               {lucky.number}
            </div>
            <div>
               <span className="text-[10px] text-white/40 block uppercase">Number</span>
               <span className="text-sm font-medium text-white">Number {lucky.number}</span>
            </div>
         </div>

         <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col items-center text-center gap-2">
            <Compass className="w-6 h-6 text-blue-300" />
            <div>
               <span className="text-[10px] text-white/40 block uppercase">Direction</span>
               <span className="text-sm font-medium text-white">{lucky.direction}</span>
            </div>
         </div>

         <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col items-center text-center gap-2">
            <Gem className="w-6 h-6 text-pink-300" />
            <div>
               <span className="text-[10px] text-white/40 block uppercase">Gemstone</span>
               <span className="text-sm font-medium text-white">{lucky.gemstone}</span>
            </div>
         </div>
      </div>

      <div className="mt-3 bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-green-300" />
            <span className="text-xs text-white/60 uppercase">Power Time</span>
         </div>
         <span className="text-sm font-bold text-white">{lucky.timeRange}</span>
      </div>
    </section>
  );
};

export default LuckyElementsCard;
