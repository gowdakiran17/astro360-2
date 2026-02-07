import React from 'react';
import { WorkplaceClimate } from '../../../types/guidance';
import { Briefcase, BarChart2 } from 'lucide-react';

interface Props {
  workplace: WorkplaceClimate;
}

const WorkplaceClimateCard: React.FC<Props> = ({ workplace }) => {
  return (
    <section className="bg-white/5 rounded-2xl border border-white/10 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="w-5 h-5 text-indigo-400" />
        <h2 className="text-lg font-bold text-white">Workplace Climate</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
         <div className="bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20 text-center">
            <span className="text-2xl font-bold text-indigo-300">{workplace.officeVibe}%</span>
            <span className="text-[10px] text-indigo-200/60 block uppercase mt-1">Office Vibe</span>
         </div>
         <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
            <span className="text-2xl font-bold text-white">{workplace.teamCooperation}%</span>
            <span className="text-[10px] text-white/40 block uppercase mt-1">Cooperation</span>
         </div>
         <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
            <span className="text-2xl font-bold text-white">{workplace.authorityPressure}%</span>
            <span className="text-[10px] text-white/40 block uppercase mt-1">Pressure</span>
         </div>
         <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
            <span className="text-2xl font-bold text-white">{workplace.visibilityLevel}%</span>
            <span className="text-[10px] text-white/40 block uppercase mt-1">Visibility</span>
         </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-900/40 to-blue-900/40 p-4 rounded-xl border border-white/10">
         <div className="flex items-center gap-2 mb-2">
            <BarChart2 className="w-4 h-4 text-indigo-300" />
            <span className="text-xs font-bold text-indigo-200 uppercase">Strategy for Today</span>
         </div>
         <p className="text-sm text-white/90 leading-relaxed">
            {workplace.strategy}
         </p>
      </div>
    </section>
  );
};

export default WorkplaceClimateCard;
