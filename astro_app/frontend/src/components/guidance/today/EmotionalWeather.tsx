import React from 'react';
import { EmotionalWeather } from '../../../types/guidance';
import { CloudRain, Sun, Cloud, CloudLightning, CloudFog, Umbrella } from 'lucide-react';

interface Props {
  weather: EmotionalWeather;
}

const EmotionalWeatherCard: React.FC<Props> = ({ weather }) => {
  const Icon = {
    sunny: Sun,
    cloudy: Cloud,
    calm: CloudFog,
    stormy: CloudLightning,
    mixed: CloudRain
  }[weather.type];

  const color = {
    sunny: 'text-yellow-400',
    cloudy: 'text-gray-400',
    calm: 'text-blue-300',
    stormy: 'text-purple-400',
    mixed: 'text-teal-400'
  }[weather.type];

  return (
    <section className="bg-white/5 rounded-2xl border border-white/10 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Cloud className="w-5 h-5 text-blue-200" />
        <h2 className="text-lg font-bold text-white">Emotional Weather</h2>
      </div>

      <div className="flex items-center gap-4 mb-5 bg-white/5 p-4 rounded-xl border border-white/5">
         <Icon className={`w-12 h-12 ${color}`} />
         <div>
            <h3 className="text-xl font-bold text-white capitalize">{weather.type}</h3>
            <p className="text-sm text-white/60">{weather.forecast}</p>
         </div>
      </div>

      <div className="space-y-3">
         <div>
            <h4 className="text-xs font-bold text-white/40 uppercase mb-2 flex items-center gap-1">
               <Umbrella className="w-3 h-3" /> Coping Strategies
            </h4>
            <ul className="space-y-1">
               {weather.copingStrategies.map((s, i) => (
                  <li key={i} className="text-sm text-white/80 pl-2 border-l-2 border-white/20">
                     {s}
                  </li>
               ))}
            </ul>
         </div>
      </div>
    </section>
  );
};

export default EmotionalWeatherCard;
