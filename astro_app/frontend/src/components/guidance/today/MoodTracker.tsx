import React, { useState } from 'react';
import { Smile, Frown, Meh, Angry, Laugh } from 'lucide-react';

interface Props {
  moodHistory: { date: string; mood: number }[];
}

const MoodTracker: React.FC<Props> = ({ moodHistory: _ }) => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const moods = [
    { value: 1, icon: Angry, color: 'text-red-400', label: 'Stressed' },
    { value: 2, icon: Frown, color: 'text-orange-400', label: 'Low' },
    { value: 3, icon: Meh, color: 'text-yellow-400', label: 'Okay' },
    { value: 4, icon: Smile, color: 'text-blue-400', label: 'Good' },
    { value: 5, icon: Laugh, color: 'text-green-400', label: 'Great' },
  ];

  return (
    <section className="bg-white/5 rounded-2xl border border-white/10 p-5">
      <h2 className="text-lg font-bold text-white mb-4 text-center">How are you feeling?</h2>
      
      <div className="flex justify-between items-end h-20 mb-6 px-2">
         {moods.map((m) => {
            const Icon = m.icon;
            const isSelected = selectedMood === m.value;
            return (
               <button 
                  key={m.value}
                  onClick={() => setSelectedMood(m.value)}
                  className={`flex flex-col items-center gap-2 transition-all duration-300 ${isSelected ? '-translate-y-2 scale-110' : 'opacity-60 hover:opacity-100'}`}
               >
                  <Icon className={`w-8 h-8 ${m.color} ${isSelected ? 'fill-current' : ''}`} />
                  {isSelected && <span className={`text-xs font-medium ${m.color}`}>{m.label}</span>}
               </button>
            );
         })}
      </div>

      {/* Mini Chart */}
      <div className="pt-4 border-t border-white/5">
         <div className="flex justify-between items-end h-12 gap-1">
            {[...Array(7)].map((_, i) => (
               <div key={i} className="w-full bg-white/5 rounded-sm relative group">
                  <div 
                     className="absolute bottom-0 w-full bg-white/20 rounded-sm" 
                     style={{ height: `${Math.random() * 100}%` }} 
                  />
               </div>
            ))}
         </div>
         <p className="text-center text-[10px] text-white/30 mt-2">Last 7 Days</p>
      </div>
    </section>
  );
};

export default MoodTracker;
