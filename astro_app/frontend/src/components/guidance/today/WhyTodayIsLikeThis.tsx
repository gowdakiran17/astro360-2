import React, { useState } from 'react';
import { DashaInfo, TransitAlert, NakshatraWisdom } from '../../../types/guidance';
import { ChevronDown, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  dasha: DashaInfo;
  transits: TransitAlert[];
  nakshatra: NakshatraWisdom;
  theme?: any;
}

const WhyTodayIsLikeThis: React.FC<Props> = ({ dasha, transits, nakshatra }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="border-t border-white/10 pt-6 mt-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-white/40 hover:text-white transition-colors"
      >
        <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
           <Info className="w-4 h-4" /> Why Today Is Like This
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-4 text-sm text-white/70">
               <div className="bg-white/5 p-3 rounded-lg">
                  <h4 className="text-white font-medium mb-1">Dasha Influence</h4>
                  <p>You are currently in the <strong>{dasha.mahaDasha.planet}</strong> cycle, which emphasizes {dasha.theme.toLowerCase()}.</p>
               </div>
               
               <div className="bg-white/5 p-3 rounded-lg">
                  <h4 className="text-white font-medium mb-1">Planetary Transits</h4>
                  <ul className="list-disc pl-4 space-y-1">
                     {transits.map((t, i) => (
                        <li key={i}>{t.description} ({t.planet} {t.event})</li>
                     ))}
                  </ul>
               </div>

               <div className="bg-white/5 p-3 rounded-lg">
                  <h4 className="text-white font-medium mb-1">Nakshatra Energy</h4>
                  <p>The Moon is in <strong>{nakshatra.name}</strong>, bringing a {nakshatra.quality.toLowerCase()} quality to the day.</p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default WhyTodayIsLikeThis;
