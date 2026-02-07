import React from 'react';
import { TransitAlert } from '../../../types/guidance';
import { Orbit, AlertCircle } from 'lucide-react';

interface Props {
  transits: TransitAlert[];
}

const TransitAlertsCard: React.FC<Props> = ({ transits }) => {
  if (!transits.length) return null;

  return (
    <section className="bg-white/5 rounded-2xl border border-white/10 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Orbit className="w-5 h-5 text-teal-300" />
        <h2 className="text-lg font-bold text-white">Transit Alerts</h2>
      </div>

      <div className="space-y-3">
        {transits.map((transit, i) => (
          <div key={i} className="bg-white/5 rounded-lg p-3 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="flex justify-between items-start mb-1">
               <span className="font-medium text-white">{transit.event}</span>
               {transit.impact === 'high' && (
                  <span className="bg-red-500/20 text-red-300 text-[10px] px-1.5 py-0.5 rounded border border-red-500/20 flex items-center gap-1">
                     <AlertCircle className="w-3 h-3" /> High Impact
                  </span>
               )}
            </div>
            <p className="text-sm text-white/60 mb-2">{transit.description}</p>
            <div className="text-xs text-white/40 flex items-center gap-2">
               <span>{transit.planet}</span>
               <span className="w-1 h-1 bg-white/20 rounded-full" />
               <span>{transit.date}</span>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-xs text-center text-white/40 hover:text-white transition-colors">
         View All Upcoming Transits
      </button>
    </section>
  );
};

export default TransitAlertsCard;
