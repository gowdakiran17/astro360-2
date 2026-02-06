import { useState, useEffect } from 'react';
import { Sparkles, Sun, Moon } from 'lucide-react';

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

  const ascendant = chartData?.ascendant?.zodiac_sign || chartData?.ascendant?.sign || 'Unknown';
  const moonSign = chartData?.planets?.find((p: any) => p.name === 'Moon')?.zodiac_sign ||
    chartData?.planets?.find((p: any) => p.name === 'Moon')?.sign || 'Unknown';

  const getPanchangValue = (val: any) => {
    if (!val) return 'Unknown';
    if (typeof val === 'string') return val;
    if (typeof val === 'object') return val.name || val.id || 'Unknown';
    return String(val);
  };

  const displayInsight = dailyHoroscopeData?.overall_theme || "The cosmic energies are flowing in your favor today. Trust your intuition and embrace new opportunities.";
  const powerMantra = dailyHoroscopeData?.power_mantra || "Om Shanti";
  const primaryFocus = dailyHoroscopeData?.primary_focus || "Growth";
  const harmonicColor = dailyHoroscopeData?.harmonic_color || "Gold";
  const colorSwatch: Record<string, string> = {
    gold: '#f59e0b',
    yellow: '#f59e0b',
    amber: '#f59e0b',
    blue: '#3b82f6',
    indigo: '#6366f1',
    purple: '#a855f7',
    violet: '#8b5cf6',
    green: '#10b981',
    emerald: '#10b981',
    teal: '#14b8a6',
    red: '#ef4444',
    rose: '#f43f5e',
    orange: '#f97316',
    pink: '#ec4899',
    white: '#e2e8f0',
    silver: '#94a3b8'
  };
  const swatch = colorSwatch[String(harmonicColor || '').trim().toLowerCase()] || '#94a3b8';

  return (
    <div className="w-full">
      {/* SaaS Welcome Banner */}
      <div className="bg-[#1e293b]/50 border border-slate-700/50 rounded-2xl p-5 sm:p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            
            {/* Left: Welcome & Date */}
            <div className="space-y-2 min-w-0">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.05]">
                Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 18 ? 'Afternoon' : 'Evening'}, <span className="text-blue-400">Traveler</span>
              </h1>
              <p className="text-slate-400 font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Right: Key Identifiers (Pill Style) */}
            <div className="w-full lg:w-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl">
                <div className="p-1.5 bg-amber-500/10 rounded-md">
                  <Sun className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Ascendant</p>
                  <p className="text-sm font-semibold text-slate-200">{ascendant}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl">
                <div className="p-1.5 bg-blue-500/10 rounded-md">
                  <Moon className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Moon Sign</p>
                  <p className="text-sm font-semibold text-slate-200">{moonSign}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-slate-800/80 my-8" />

          {/* Daily Insight Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Insight */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Daily Insight</span>
              </div>
              <p className="text-base sm:text-lg md:text-xl text-slate-200 leading-relaxed font-light">
                {displayInsight}
              </p>
              
              {/* Stats Row */}
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-800/70">
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg max-w-full">
                  <span className="text-xs text-blue-300 font-medium">Mantra:</span>
                  <span className="text-xs text-blue-200 font-bold truncate max-w-[240px]" title={powerMantra}>{powerMantra}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg">
                  <span className="text-xs text-slate-400 font-medium">Focus:</span>
                  <span className="text-xs text-slate-200 font-bold">{primaryFocus}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg">
                  <span className="text-xs text-slate-400 font-medium">Color:</span>
                  <div className="w-2.5 h-2.5 rounded-full border border-slate-600" style={{ backgroundColor: swatch }} />
                  <span className="text-xs text-slate-200 font-bold">{harmonicColor}</span>
                </div>
              </div>
            </div>

            {/* Panchang Quick View (Data List) */}
            <div className="lg:col-span-1 bg-slate-900 rounded-xl p-5 border border-slate-800">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Panchang Snapshot</h3>
              <div className="space-y-3">
                {[
                  { label: 'Tithi', value: getPanchangValue(panchangData?.tithi) },
                  { label: 'Nakshatra', value: getPanchangValue(panchangData?.nakshatra) },
                  { label: 'Yoga', value: getPanchangValue(panchangData?.yoga) },
                  { label: 'Sunrise', value: panchangData?.sunrise || '--:--' }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">{item.label}</span>
                    <span className="text-slate-200 font-medium truncate max-w-[160px] md:max-w-[220px] text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CosmicHero;
