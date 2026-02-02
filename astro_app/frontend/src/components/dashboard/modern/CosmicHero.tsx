import { useState, useEffect } from 'react';
import { Sparkles, Sun, Moon, Star, Compass, RefreshCw } from 'lucide-react';
import api from '../../../services/api';

interface DailyInsight {
  insight: string;
  mood: 'positive' | 'neutral' | 'cautious';
  focus_area: string;
  lucky_elements: {
    color: string;
    number: number;
    direction: string;
  };
  power_mantra?: string;
  ai_powered: boolean;
}

interface CosmicHeroProps {
  chartData: any;
  panchangData?: any;
}

const defaultInsight: DailyInsight = {
  insight: "The cosmic energies are flowing in your favor today. Trust your intuition and embrace new opportunities.",
  mood: 'positive',
  focus_area: "Growth",
  lucky_elements: {
    color: "Gold",
    number: 7,
    direction: "East"
  },
  power_mantra: "Om Shanti",
  ai_powered: false
};

const starPositions = [...Array(20)].map((_, i) => ({
  id: i,
  top: `${(i * 7) % 100}%`,
  left: `${(i * 13 + 5) % 100}%`,
  delay: `${(i * 0.15) % 3}s`,
  duration: `${2 + (i % 3)}s`
}));

const CosmicHero: React.FC<CosmicHeroProps> = ({ chartData, panchangData }) => {
  const [insight, setInsight] = useState<DailyInsight>(defaultInsight);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchInsight = async () => {
    if (!chartData) return;
    setLoading(true);
    try {
      const response = await api.post('/ai/daily-insight', {
        chart_data: chartData,
        panchang_data: panchangData
      });
      if (response.data?.status === 'success' && response.data?.data) {
        const data = response.data.data;
        setInsight({
          insight: data.insight || defaultInsight.insight,
          mood: data.mood || 'positive',
          focus_area: data.focus_area || 'Growth',
          lucky_elements: {
            color: data.lucky_elements?.color || 'Gold',
            number: data.lucky_elements?.number || 7,
            direction: data.lucky_elements?.direction || 'East'
          },
          power_mantra: data.power_mantra,
          ai_powered: data.ai_powered || false
        });
      } else {
        setInsight(defaultInsight);
      }
    } catch (err) {
      console.error('Error fetching insight:', err);
      setInsight(defaultInsight);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsight();
  }, [chartData]);


  const getMoodGradient = (mood: string) => {
    switch (mood) {
      case 'positive': return 'from-emerald-600/40 via-teal-600/30 to-cyan-600/20';
      case 'cautious': return 'from-amber-600/40 via-orange-600/30 to-yellow-600/20';
      default: return 'from-indigo-600/40 via-violet-600/30 to-purple-600/20';
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'positive': return '✨';
      case 'cautious': return '⚠️';
      default: return '🌙';
    }
  };

  const ascendant = chartData?.ascendant?.sign || 'Unknown';
  const moonSign = chartData?.planets?.find((p: any) => p.name === 'Moon')?.sign || 'Unknown';

  const getPanchangValue = (val: any) => {
    if (!val) return 'Unknown';
    if (typeof val === 'string') return val;
    if (typeof val === 'object') return val.name || val.id || 'Unknown';
    return String(val);
  };

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-white/[0.08] border border-white/[0.15] shadow-2xl group/hero backdrop-blur-md">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-yellow-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.05)_0%,transparent_70%)] opacity-50" />

        {starPositions.map((star) => (
          <div
            key={star.id}
            className="absolute w-[1.5px] h-[1.5px] bg-white rounded-full opacity-20 shadow-[0_0_8px_1px_rgba(255,255,255,0.4)]"
            style={{
              top: star.top,
              left: star.left,
              animation: `twinkle ${star.duration} infinite ease-in-out`,
              animationDelay: star.delay
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6 md:p-14">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-10 md:mb-14">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_12px_rgba(251,191,36,0.8)] animate-pulse" />
              <p className="text-sm font-black text-yellow-400 uppercase tracking-[0.4em]">Live Cosmic Frequency</p>
            </div>
            <h1 className="text-4xl md:text-8xl font-black text-white mb-4 tracking-tighter uppercase leading-[1] md:leading-[0.9]">
              Daily <span className="text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 via-white to-orange-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.4)]">Insights</span>
            </h1>
            <p className="text-white text-sm font-black tracking-[0.3em] uppercase mt-2">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 md:gap-5 w-full md:w-auto">
            {[
              { label: 'Ascendant', value: ascendant, icon: Sun, color: 'amber' },
              { label: 'Moon Sign', value: moonSign, icon: Moon, color: 'blue' }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="group/sign relative flex-1 md:flex-none">
                  <div className="absolute inset-0 bg-yellow-500/10 blur-xl opacity-0 group-hover/sign:opacity-100 transition-opacity duration-700" />
                  <div className="relative flex items-center gap-5 bg-white/[0.04] backdrop-blur-3xl rounded-[1.5rem] px-5 py-4 border border-white/[0.1] transition-all duration-500 hover:bg-white/[0.08] cursor-default group/btn">
                    <div className="p-2.5 bg-yellow-500/10 rounded-xl border border-yellow-500/20 group-hover/btn:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white uppercase tracking-[0.2em] mb-1">{item.label}</p>
                      <p className="text-sm font-black text-white tracking-tight uppercase whitespace-nowrap">{item.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`relative rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 bg-gradient-to-br ${getMoodGradient(insight.mood)} backdrop-blur-3xl border border-white/[0.1] shadow-2xl overflow-hidden group/message`}>
          <div className="absolute inset-0 bg-white/[0.01] opacity-0 group-hover/message:opacity-100 transition-opacity duration-700" />
          <div className="flex items-start justify-between mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-sm font-black text-yellow-200 uppercase tracking-[0.3em]">Today's Cosmic Decree</span>
              {insight.ai_powered && (
                <span className="hidden sm:inline-block px-3 py-1 text-sm font-black bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-full uppercase tracking-tighter">AI</span>
              )}
            </div>
            <button
              onClick={fetchInsight}
              disabled={loading}
              className="p-2 md:p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-500 group/refresh"
            >
              <RefreshCw className={`w-5 h-5 text-white/40 group-hover/refresh:text-white transition-colors ${loading ? 'animate-spin' : 'group-hover/refresh:rotate-180 transition-transform duration-700'}`} />
            </button>
          </div>

          <div className="flex flex-col gap-8 md:gap-10 relative z-10">
            <div className="w-full">
              <p className="text-xl md:text-3xl lg:text-4xl text-white leading-[1.4] mb-8 md:mb-10 font-medium tracking-tight">
                {getMoodEmoji(insight.mood)} {insight.insight}
              </p>

              {insight.power_mantra && (
                <div className="p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-yellow-500/10 border border-yellow-500/20 w-fit backdrop-blur-3xl relative group/mantra hover:scale-105 transition-all duration-500 max-w-full">
                  <div className="absolute inset-0 bg-white/[0.02] rounded-[1.5rem] md:rounded-[2rem]" />
                  <div className="flex items-center gap-4 md:gap-6 relative z-10">
                    <div className="p-2.5 md:p-3 bg-yellow-500/20 rounded-2xl border border-yellow-500/30">
                      <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-yellow-300" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-yellow-400/80 uppercase tracking-[0.3em] mb-1 md:mb-2">Power Frequency</p>
                      <p className="text-lg md:text-2xl font-black text-yellow-100 italic tracking-wide drop-shadow-sm break-words">"{insight.power_mantra}"</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
              {[
                { label: 'Primary Focus', value: insight.focus_area || 'Growth', icon: Star, color: 'indigo' },
                { label: 'Harmonic Color', value: insight.lucky_elements?.color || 'Gold', colorTag: true },
                { label: 'Optimal Direction', value: insight.lucky_elements?.direction || 'East', icon: Compass, color: 'cyan' }
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-4 md:gap-5 p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] transition-all duration-500 group/item">
                    <div className="p-2.5 md:p-3 bg-white/5 rounded-2xl border border-white/10 group-hover/item:scale-110 group-hover/item:rotate-6 transition-transform">
                      {item.colorTag ? (
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-white/30 shadow-lg" style={{ backgroundColor: (item.value || 'gold').toLowerCase() }} />
                      ) : (
                        Icon && <Icon className="w-5 h-5 md:w-6 md:h-6 text-yellow-400/80" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-black text-white uppercase tracking-[0.3em] mb-1 md:mb-1.5">{item.label}</p>
                      <p className="text-sm md:text-base font-bold text-white uppercase tracking-tight">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Cosmic Weather Strip */}
      <div className="relative z-10 p-8 md:p-12 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-transparent rounded-[2.5rem] border border-white/[0.15] grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
        {[
          { label: 'Tithi (Lunar)', value: getPanchangValue(panchangData?.tithi), icon: Moon, color: 'purple' },
          { label: 'Nakshatra', value: getPanchangValue(panchangData?.nakshatra), icon: Star, color: 'pink' },
          { label: 'Yoga (Union)', value: getPanchangValue(panchangData?.yoga), icon: Compass, color: 'cyan' },
          { label: 'Solar Cycle', value: panchangData?.sunrise ? `↑ ${panchangData.sunrise} ↓ ${panchangData.sunset}` : '--:-- • --:--', icon: Sun, color: 'orange' }
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex items-center gap-4 md:gap-5 group/weather">
              <div className="p-2.5 md:p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 group-hover/weather:scale-110 transition-transform">
                <Icon className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-white uppercase tracking-[0.2em] mb-1">{item.label}</p>
                <p className="text-xs md:text-base font-black text-white tracking-tight uppercase truncate">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>


    </div>
  );
};

export default CosmicHero;
