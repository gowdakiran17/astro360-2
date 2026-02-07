import React, { useState } from 'react';
import { DailyRemedy } from '../../../types/guidance';
import { CheckCircle2, Flame, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  remedy: DailyRemedy;
}

const DailyRemedyCard: React.FC<Props> = ({ remedy }) => {
  const [isDone, setIsDone] = useState(false);

  return (
    <section className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-400" />
          <h2 className="text-lg font-bold text-white">Daily Remedy</h2>
        </div>
        <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded font-medium border border-orange-500/20">
          {remedy.type.toUpperCase()}
        </span>
      </div>

      <div className="p-5">
        <div className="mb-4">
          <h3 className="text-xl font-medium text-white mb-2">{remedy.description}</h3>
          <p className="text-sm text-white/60 bg-black/20 p-3 rounded-lg border border-white/5 leading-relaxed">
            {remedy.instructions}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-white/50 mb-6">
          <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded">
            <Info className="w-3 h-3" />
            <span>Why: {remedy.basedOn}</span>
          </div>
          <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded">
            <span className="text-orange-400">⏰</span>
            <span>Best Time: {remedy.bestTime}</span>
          </div>
        </div>

        <button
          onClick={() => setIsDone(!isDone)}
          className={`
            w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300
            ${isDone 
              ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
              : 'bg-white/10 hover:bg-white/20 text-white'
            }
          `}
        >
          {isDone ? (
            <>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                 <CheckCircle2 className="w-5 h-5" />
              </motion.div>
              <span>Completed</span>
            </>
          ) : (
            <span>Mark as Done</span>
          )}
        </button>
      </div>
    </section>
  );
};

export default DailyRemedyCard;
