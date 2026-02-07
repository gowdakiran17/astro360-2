import React, { useState } from 'react';
import { DailyAffirmation } from '../../../types/guidance';
import { Heart, Play, Pause, Share2, Bookmark } from 'lucide-react';

interface Props {
  affirmation: DailyAffirmation;
}

const DailyAffirmationCard: React.FC<Props> = ({ affirmation }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-indigo-500/20 border border-white/10 p-6 text-center">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl -translate-x-10 -translate-y-10" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl translate-x-10 translate-y-10" />

      <div className="relative z-10">
        <div className="flex justify-center mb-4">
           <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Heart className="w-6 h-6 text-pink-300" fill="currentColor" fillOpacity={0.2} />
           </div>
        </div>

        <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">Daily Affirmation</h3>
        
        <blockquote className="text-2xl md:text-3xl font-serif text-white leading-relaxed mb-6">
          "{affirmation.text}"
        </blockquote>

        <p className="text-sm text-white/40 mb-8">
          Based on your focus for: <span className="text-white/80">{affirmation.basedOn}</span>
        </p>

        <div className="flex items-center justify-center gap-4">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full bg-white text-purple-900 flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-white/10"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>
          
          <div className="flex gap-2">
            <button 
                onClick={() => setIsSaved(!isSaved)}
                className={`p-3 rounded-full border transition-colors ${isSaved ? 'bg-pink-500 border-pink-500 text-white' : 'border-white/20 text-white/60 hover:bg-white/10'}`}
            >
                <Bookmark className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} />
            </button>
            <button className="p-3 rounded-full border border-white/20 text-white/60 hover:bg-white/10 transition-colors">
                <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DailyAffirmationCard;
