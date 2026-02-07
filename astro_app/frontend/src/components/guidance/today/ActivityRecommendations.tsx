import React from 'react';
import { ActivityRecommendation } from '../../../types/guidance';
import { Star, Clock } from 'lucide-react';

interface Props {
  activities: ActivityRecommendation[];
}

const ActivityRecommendations: React.FC<Props> = ({ activities }) => {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold text-white px-1">Best Activities</h2>
      
      <div className="grid gap-3">
         {activities.map((activity, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10 flex justify-between items-center">
               <div>
                  <h3 className="font-medium text-white mb-1">{activity.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-white/50">
                     <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {activity.bestTime}
                     </span>
                     <span>•</span>
                     <span>{activity.reason}</span>
                  </div>
               </div>
               
               <div className="flex gap-0.5">
                  {[...Array(5)].map((_, starI) => (
                     <Star 
                        key={starI} 
                        className={`w-3 h-3 ${starI < activity.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/10'}`} 
                     />
                  ))}
               </div>
            </div>
         ))}
      </div>
    </section>
  );
};

export default ActivityRecommendations;
