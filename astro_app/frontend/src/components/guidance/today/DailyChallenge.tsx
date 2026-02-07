import React, { useState } from 'react';
import { DailyChallenge } from '../../../types/guidance';
import { Trophy, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  challenge: DailyChallenge;
  streak: number;
}

const DailyChallengeCard: React.FC<Props> = ({ challenge, streak }) => {
  const [completed, setCompleted] = useState(false);

  return (
    <section className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl border border-yellow-500/20 p-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-3 opacity-10">
         <Trophy className="w-24 h-24 rotate-12" />
      </div>

      <div className="relative z-10">
         <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
               <Trophy className="w-5 h-5 text-yellow-400" />
               <h2 className="text-lg font-bold text-white">Daily Challenge</h2>
            </div>
            <div className="bg-black/20 px-2 py-1 rounded text-xs text-yellow-200 font-mono">
               🔥 {streak} Day Streak
            </div>
         </div>

         <h3 className="text-xl font-medium text-white mb-2">{challenge.title}</h3>
         <p className="text-sm text-white/70 mb-4">{challenge.description}</p>
         
         <div className="bg-black/10 p-2 rounded text-xs text-white/50 mb-5 italic border-l-2 border-yellow-500/30">
            Why: {challenge.reason}
         </div>

         <button
            onClick={() => setCompleted(!completed)}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${completed ? 'bg-yellow-500 text-black' : 'bg-white/10 hover:bg-white/20 text-white'}`}
         >
            {completed ? (
               <>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                     <CheckCircle2 className="w-5 h-5" />
                  </motion.div>
                  <span>Challenge Complete!</span>
               </>
            ) : (
               <span>Accept Challenge</span>
            )}
         </button>
      </div>
    </section>
  );
};

export default DailyChallengeCard;
