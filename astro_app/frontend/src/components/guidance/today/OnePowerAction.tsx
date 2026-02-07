import React, { useState } from 'react';
import { Zap, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  action: string;
  theme?: any;
}

const OnePowerAction: React.FC<Props> = ({ action }) => {
  const [isDone, setIsDone] = useState(false);

  return (
    <section className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-5 shadow-lg shadow-purple-900/20 text-white relative overflow-hidden">
      <div className="absolute right-0 top-0 p-4 opacity-10">
         <Zap className="w-24 h-24" />
      </div>

      <div className="relative z-10">
         <div className="flex items-center gap-2 mb-2 opacity-80">
            <Zap className="w-4 h-4" />
            <h2 className="text-xs font-bold uppercase tracking-widest">One Power Action</h2>
         </div>
         
         <p className="text-lg font-medium leading-relaxed mb-4">
            {action}
         </p>

         <button
            onClick={() => setIsDone(!isDone)}
            className={`
               w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors
               ${isDone ? 'bg-white text-purple-900' : 'bg-white/20 hover:bg-white/30 text-white'}
            `}
         >
            {isDone ? (
               <>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                     <CheckCircle2 className="w-4 h-4" />
                  </motion.div>
                  <span>Done</span>
               </>
            ) : (
               <span>Mark Complete</span>
            )}
         </button>
      </div>
    </section>
  );
};

export default OnePowerAction;
