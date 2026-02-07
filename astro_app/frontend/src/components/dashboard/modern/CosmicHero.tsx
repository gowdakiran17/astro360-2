import { useState, useEffect } from 'react';
import { Sparkles, Sun } from 'lucide-react';

interface CosmicHeroProps {
  chartData: any;
  panchangData?: any;
  dailyHoroscopeData?: any;
}

const CosmicHero: React.FC<CosmicHeroProps> = ({ chartData, panchangData, dailyHoroscopeData }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const displayInsight = dailyHoroscopeData?.overall_theme || "The cosmic energies are flowing in your favor today. Trust your intuition and embrace new opportunities.";
  const dashaPeriod = chartData?.dasha_info?.current_dasha || "Mercury / Venus"; // Fallback or derived

  return (
    <div className="w-full">
      <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-amber-500/10 transition-colors duration-1000" />
        
        <div className="relative z-10 flex flex-col gap-6">
            {/* Top Row: Greeting & Time */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-200 tracking-tight">
                        Namaste, <span className="text-amber-500">Traveler</span>
                    </h1>
                    <div className="flex items-center gap-3 mt-1 text-xs font-medium text-stone-500 uppercase tracking-wider">
                         <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </span>
                         <span>•</span>
                         <span>{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>
                
                {/* Active Cycle Badge */}
                <div className="px-3 py-1.5 bg-stone-900/80 border border-stone-800 rounded-lg backdrop-blur-sm">
                    <p className="text-[10px] text-stone-500 uppercase font-bold tracking-wider mb-0.5">Current Cycle</p>
                    <p className="text-xs font-semibold text-amber-500">{dashaPeriod}</p>
                </div>
            </div>

            {/* Daily Guidance Message */}
            <div className="max-w-2xl">
                <p className="text-lg sm:text-xl text-stone-300 leading-relaxed font-light font-serif">
                    "{displayInsight}"
                </p>
            </div>

            {/* Primary CTA */}
            <div className="flex items-center gap-4 pt-2">
                 <button className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-stone-100 text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-red-900/20 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    View Today's Insight
                 </button>
                 <div className="hidden sm:flex items-center gap-2 text-xs text-stone-500">
                    <Sun className="w-3.5 h-3.5 text-amber-600" />
                    <span>Sunrise: {panchangData?.sunrise || '--:--'}</span>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CosmicHero;
