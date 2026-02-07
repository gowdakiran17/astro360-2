import React, { useState } from 'react';
import { NakshatraWisdom } from '../../../types/guidance';
import { Moon, Music, BookOpen } from 'lucide-react';

interface Props {
  nakshatra: NakshatraWisdom;
}

const NakshatraWisdomCard: React.FC<Props> = ({ nakshatra }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-4 flex items-center gap-3 border-b border-white/5">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
          <Moon className="w-5 h-5 text-indigo-300" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white leading-none">{nakshatra.name}</h2>
          <span className="text-xs text-indigo-300 font-medium tracking-wider uppercase">Moon Nakshatra</span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 p-3 rounded-lg border border-white/5">
            <span className="text-xs text-white/40 block mb-1 uppercase tracking-wide">Symbol</span>
            <span className="text-sm font-medium text-white">{nakshatra.symbol}</span>
          </div>
          <div className="bg-white/5 p-3 rounded-lg border border-white/5">
            <span className="text-xs text-white/40 block mb-1 uppercase tracking-wide">Deity</span>
            <span className="text-sm font-medium text-white">{nakshatra.deity}</span>
          </div>
        </div>

        <div className="bg-indigo-500/10 p-3 rounded-lg border border-indigo-500/20">
          <p className="text-sm text-indigo-100 italic">"{nakshatra.insight}"</p>
        </div>

        <div className="space-y-2">
           <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Mantra</h3>
           <div className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-full bg-indigo-500 hover:bg-indigo-400 flex items-center justify-center transition-colors text-white shrink-0"
              >
                 <Music className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
              </button>
              <div>
                 <p className="text-sm font-serif text-white/90">{nakshatra.mantra}</p>
                 <span className="text-[10px] text-white/40">Recite 108 times</span>
              </div>
           </div>
        </div>

        <button className="w-full py-2 flex items-center justify-center gap-2 text-xs font-medium text-white/60 hover:text-white transition-colors">
           <BookOpen className="w-3 h-3" />
           <span>Learn more about {nakshatra.name}</span>
        </button>
      </div>
    </section>
  );
};

export default NakshatraWisdomCard;
