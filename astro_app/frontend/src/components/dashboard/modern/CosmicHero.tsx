import { useState, useEffect } from 'react';
import { Sparkles, Sun, Moon, Star, Compass } from 'lucide-react';

interface CosmicHeroProps {
  chartData: any;
  panchangData?: any;
  dailyHoroscopeData?: any;
}

const starPositions = [...Array(20)].map((_, i) => ({
  id: i,
  top: `${(i * 7) % 100}%`,
  left: `${(i * 13 + 5) % 100}%`,
  delay: `${(i * 0.15) % 3}s`,
  duration: `${2 + (i % 3)}s`
}));

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
  const optimalDirection = dailyHoroscopeData?.optimal_direction || "East";

  return (
    <div className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-white/[0.04] border border-white/[0.1] shadow-2xl group/hero backdrop-blur-xl">
      {/* Mystical Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

        {starPositions.map((star) => (
          <div
            key={star.id}
            className="absolute w-[1.5px] h-[1.5px] bg-white rounded-full opacity-30"
            style={{
              top: star.top,
              left: star.left,
              animation: `twinkle ${star.duration} infinite ease-in-out`,
              animationDelay: star.delay
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6 md:p-16">
        {/* Header Section: Mobile Stacked, Desktop Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-10 md:mb-16">
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping shadow-[0_0_10px_rgba(251,191,36,1)]" />
              <p className="text-[10px] md:text-xs font-black text-amber-400 uppercase tracking-[0.4em]">Celestial Transmission</p>
            </div>
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter uppercase leading-[0.9]">
              Daily <span className="text-transparent bg-clip-text bg-gradient-to-br from-amber-200 via-white to-amber-500">Decree</span>
            </h1>
            <p className="text-white/60 text-[10px] md:text-xs font-black tracking-[0.3em] uppercase">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Signs: Mobile Grid 2, Desktop Row */}
          <div className="grid grid-cols-2 gap-3 w-full lg:w-auto">
            {[
              { label: 'Ascendant', value: ascendant, icon: Sun },
              { label: 'Moon Sign', value: moonSign, icon: Moon }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col md:flex-row items-center gap-3 md:gap-5 bg-white/[0.05] md:bg-transparent backdrop-blur-lg border border-white/5 md:border-none p-4 md:p-0 rounded-2xl">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                  <item.icon className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-[8px] md:text-[10px] font-black text-white/40 uppercase tracking-widest">{item.label}</p>
                  <p className="text-xs md:text-sm font-black text-white tracking-tight uppercase whitespace-nowrap">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Insight Box: Mobile Stacked */}
        <div className="space-y-8 md:space-y-12">
          <div className="relative group/insight">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-purple-500/20 rounded-[2rem] blur-xl opacity-0 group-hover/insight:opacity-100 transition-opacity duration-700" />
            <div className="relative bg-white/[0.03] border border-white/10 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 overflow-hidden">
              <div className="flex flex-col gap-6 md:gap-10">
                <p className="text-xl md:text-3xl lg:text-4xl text-white font-medium leading-[1.3] md:leading-[1.4] tracking-tight">
                  <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-amber-400 inline-block mr-4 animate-pulse align-middle" />
                  {displayInsight}
                </p>

                {/* Combined Mantra & Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-4">
                  {/* Mantra - Primary Span */}
                  <div className="md:col-span-1 lg:col-span-1 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-500/20 rounded-lg">
                        <Star className="w-4 h-4 text-amber-400" />
                      </div>
                      <p className="text-[10px] font-black text-amber-400 uppercase tracking-wider">Mantra</p>
                    </div>
                    <p className="text-lg font-black text-amber-100 italic">"{powerMantra}"</p>
                  </div>

                  {/* Other Stats */}
                  {[
                    { label: 'Focus', value: primaryFocus, icon: Star },
                    { label: 'Color', value: harmonicColor, colorDot: true },
                    { label: 'Direction', value: optimalDirection, icon: Compass }
                  ].map((item, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col gap-3 group/stat hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/5 rounded-lg group-hover/stat:bg-amber-500/10 transition-colors">
                          {item.colorDot ? (
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.value.toLowerCase() }} />
                          ) : (
                            item.icon && <item.icon className="w-4 h-4 text-white/40 group-hover/stat:text-amber-400" />
                          )}
                        </div>
                        <p className="text-[10px] font-black text-white/40 group-hover/stat:text-white transition-colors uppercase tracking-wider">{item.label}</p>
                      </div>
                      <p className="text-sm font-black text-white uppercase tracking-tight">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Panchang Bar: Mobile Simple Grid, Desktop Flex */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4 md:px-8">
            {[
              { label: 'Tithi', value: getPanchangValue(panchangData?.tithi), icon: Moon },
              { label: 'Nakshatra', value: getPanchangValue(panchangData?.nakshatra), icon: Star },
              { label: 'Yoga', value: getPanchangValue(panchangData?.yoga), icon: Compass },
              { label: 'Solar', value: panchangData?.sunrise ? `↑ ${panchangData.sunrise}` : '--:--', icon: Sun }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 group/pnc">
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/5 group-hover/pnc:border-amber-500/30 transition-all">
                  <item.icon className="w-4 h-4 text-white/30 group-hover/pnc:text-amber-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-0.5">{item.label}</p>
                  <p className="text-xs font-black text-white uppercase tracking-tight truncate">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CosmicHero;
