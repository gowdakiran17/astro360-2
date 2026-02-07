import React from 'react';
import { GuidedMeditation } from '../../../types/guidance';
import { Play, Headphones, Clock } from 'lucide-react';

interface Props {
  meditation: GuidedMeditation;
}

const GuidedMeditationCard: React.FC<Props> = ({ meditation }) => {
  return (
    <section className="relative rounded-2xl overflow-hidden group cursor-pointer h-40">
      {/* Background Image/Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
      </div>
      
      <div className="absolute inset-0 p-5 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-white/80">
            <Headphones className="w-3 h-3" />
            <span>Meditation</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-white/60">
            <Clock className="w-3 h-3" />
            <span>{meditation.duration} min</span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white mb-1">{meditation.title}</h3>
          <p className="text-xs text-white/70 line-clamp-1">{meditation.description}</p>
        </div>

        <div className="absolute right-5 bottom-5 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform text-indigo-900 pl-1">
          <Play className="w-5 h-5 fill-current" />
        </div>
      </div>
    </section>
  );
};

export default GuidedMeditationCard;
