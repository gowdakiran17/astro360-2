import React from 'react';
import { PanchangDetails } from '../../../types/guidance';
import { Calendar, Clock, Sun } from 'lucide-react';

interface Props {
  panchang: PanchangDetails;
}

const PanchangDetailsCard: React.FC<Props> = ({ panchang }) => {
  return (
    <section className="bg-white/5 rounded-2xl border border-white/10 p-5 space-y-5">
      <div className="flex items-center gap-2 mb-2">
        <Calendar className="w-5 h-5 text-orange-300" />
        <h2 className="text-lg font-bold text-white">Vedic Calendar</h2>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
           <span className="text-[10px] text-white/40 block mb-1">Tithi</span>
           <span className="text-xs font-medium text-white line-clamp-1">{panchang.tithi}</span>
        </div>
        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
           <span className="text-[10px] text-white/40 block mb-1">Yoga</span>
           <span className="text-xs font-medium text-white line-clamp-1">{panchang.yoga}</span>
        </div>
        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
           <span className="text-[10px] text-white/40 block mb-1">Karana</span>
           <span className="text-xs font-medium text-white line-clamp-1">{panchang.karana}</span>
        </div>
      </div>

      <div className="space-y-3">
        {panchang.auspiciousTimes.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2 flex items-center gap-1">
               <Sun className="w-3 h-3" /> Auspicious Times
            </h3>
            {panchang.auspiciousTimes.map((time, i) => (
              <div key={i} className="flex justify-between items-center bg-green-500/10 border border-green-500/20 p-2 rounded text-sm mb-2">
                 <span className="text-green-100">{time.name}</span>
                 <div className="flex items-center gap-1 text-green-300 font-mono text-xs">
                    <Clock className="w-3 h-3" />
                    {time.start} - {time.end}
                 </div>
              </div>
            ))}
          </div>
        )}
        
        {panchang.inauspiciousTimes.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1">
               <Clock className="w-3 h-3" /> Avoid Times
            </h3>
            {panchang.inauspiciousTimes.map((time, i) => (
              <div key={i} className="flex justify-between items-center bg-red-500/10 border border-red-500/20 p-2 rounded text-sm mb-2">
                 <span className="text-red-100">{time.name}</span>
                 <div className="flex items-center gap-1 text-red-300 font-mono text-xs">
                    {time.start} - {time.end}
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PanchangDetailsCard;
