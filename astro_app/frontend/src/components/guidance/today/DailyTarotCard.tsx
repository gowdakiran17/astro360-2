import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TarotCard } from '../../../types/guidance';
import { Sparkles, RefreshCw } from 'lucide-react';

interface Props {
  tarot: TarotCard;
}

const DailyTarotCard: React.FC<Props> = ({ tarot }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-bold text-white">Daily Tarot</h2>
      </div>

      <div className="perspective-1000 h-[400px] w-full relative group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
        <motion.div
          className="w-full h-full relative preserve-3d transition-all duration-700"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
        >
          {/* Back of Card (Initial View) */}
          <div className="absolute w-full h-full backface-hidden rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#1a1b4b]">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center border-2 border-white/5 m-4 rounded-xl">
              <div className="w-24 h-24 rounded-full bg-purple-500/20 blur-xl absolute" />
              <span className="text-6xl mb-4 relative z-10">🔮</span>
              <h3 className="text-xl font-serif text-purple-200 relative z-10">Tap to Reveal</h3>
              <p className="text-sm text-purple-200/60 mt-2 relative z-10">Your daily guidance awaits</p>
            </div>
          </div>

          {/* Front of Card (Revealed View) */}
          <div 
            className="absolute w-full h-full backface-hidden rounded-2xl overflow-hidden shadow-2xl bg-black rotate-y-180 border border-white/10"
            style={{ transform: 'rotateY(180deg)' }}
          >
            {/* Image Background with Gradient Overlay */}
            <div className="absolute inset-0">
               {/* Fallback if image fails or is generic */}
               <div className="w-full h-full bg-gradient-to-br from-gray-900 via-purple-900 to-black opacity-80" />
               <img 
                 src={tarot.cardImage} 
                 alt={tarot.cardName}
                 className="w-full h-full object-cover opacity-60 mix-blend-overlay" 
                 onError={(e) => (e.currentTarget.style.display = 'none')}
               />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 flex flex-col justify-end">
              <div className="mb-auto pt-4 flex justify-end">
                <span className="px-2 py-1 bg-white/10 rounded text-xs font-medium backdrop-blur-sm">Major Arcana</span>
              </div>
              
              <h3 className="text-2xl font-serif text-white mb-1">{tarot.cardName}</h3>
              <p className="text-purple-300 font-medium text-sm mb-4">{tarot.meaning}</p>
              
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10">
                <p className="text-sm text-white/90 leading-relaxed">
                  "{tarot.interpretation}"
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                 <button className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-lg text-xs font-medium transition-colors">
                    Save Card
                 </button>
                 <button className="flex-1 bg-purple-600 hover:bg-purple-500 py-2 rounded-lg text-xs font-medium transition-colors text-white">
                    Read More
                 </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex justify-center">
         <button className="flex items-center gap-2 text-xs text-white/40 hover:text-white/60 transition-colors">
            <RefreshCw className="w-3 h-3" />
            <span>Premium: Pull a 3-card spread</span>
         </button>
      </div>
    </section>
  );
};

export default DailyTarotCard;
