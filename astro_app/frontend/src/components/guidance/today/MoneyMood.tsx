import React from 'react';
import { MoneyMood } from '../../../types/guidance';
import { DollarSign, TrendingUp, ShieldAlert, PiggyBank } from 'lucide-react';

interface Props {
  money: MoneyMood;
}

const MoneyMoodCard: React.FC<Props> = ({ money }) => {
  return (
    <section className="bg-white/5 rounded-2xl border border-white/10 p-5">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5 text-green-400" />
        <h2 className="text-lg font-bold text-white">Money Mood</h2>
      </div>

      <div className="flex justify-between gap-2 mb-5">
         <div className="flex-1 bg-white/5 p-2 rounded-lg text-center">
            <TrendingUp className="w-4 h-4 text-green-400 mx-auto mb-1" />
            <span className="text-[10px] text-white/40 block">Risk</span>
            <span className="text-sm font-bold text-white">{money.riskAppetite}%</span>
         </div>
         <div className="flex-1 bg-white/5 p-2 rounded-lg text-center">
            <ShieldAlert className="w-4 h-4 text-red-400 mx-auto mb-1" />
            <span className="text-[10px] text-white/40 block">Caution</span>
            <span className="text-sm font-bold text-white">{money.spendingCaution}%</span>
         </div>
         <div className="flex-1 bg-white/5 p-2 rounded-lg text-center">
            <PiggyBank className="w-4 h-4 text-blue-400 mx-auto mb-1" />
            <span className="text-[10px] text-white/40 block">Save</span>
            <span className="text-sm font-bold text-white">{money.savingMindset}%</span>
         </div>
      </div>

      <div className="space-y-3">
         <div>
            <h4 className="text-xs font-bold text-green-400 uppercase mb-1">Good For</h4>
            <div className="flex flex-wrap gap-2">
               {money.goodFor.map((item, i) => (
                  <span key={i} className="text-xs bg-green-500/10 text-green-200 px-2 py-1 rounded border border-green-500/20">
                     {item}
                  </span>
               ))}
            </div>
         </div>
         <div>
            <h4 className="text-xs font-bold text-red-400 uppercase mb-1">Avoid</h4>
            <div className="flex flex-wrap gap-2">
               {money.avoid.map((item, i) => (
                  <span key={i} className="text-xs bg-red-500/10 text-red-200 px-2 py-1 rounded border border-red-500/20">
                     {item}
                  </span>
               ))}
            </div>
         </div>
      </div>
    </section>
  );
};

export default MoneyMoodCard;
