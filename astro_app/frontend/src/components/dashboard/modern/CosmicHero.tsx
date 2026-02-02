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
    <div className="relative overflow-hidden rounded-[2rem] bg-[#0F0F16] border border-white/10 shadow-2xl">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03)_0%,transparent_70%)]" />

        {starPositions.map((star) => (
          <div
            key={star.id}
            className="absolute w-[2px] h-[2px] bg-white rounded-full"
            style={{
              top: star.top,
              left: star.left,
              opacity: 0.3,
              boxShadow: '0 0 8px 1px white',
              animation: `twinkle ${star.duration} infinite ease-in-out`,
              animationDelay: star.delay
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-8 md:p-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_theme(colors.emerald.500)]" />
              <p className="text-[10px] font-black text-emerald-400/80 uppercase tracking-[0.3em]">Live Cosmic Feed</p>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tighter">
              Daily <span className="italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-white to-emerald-400">Insights</span>
            </h1>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="group relative">
              <div className="absolute inset-0 bg-amber-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-3 bg-white/5 backdrop-blur-xl rounded-2xl px-5 py-3 border border-white/10 transition-all hover:bg-white/10 cursor-default">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <Sun className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Ascendant</p>
                  <p className="text-sm font-bold text-white leading-tight">{ascendant}</p>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-3 bg-white/5 backdrop-blur-xl rounded-2xl px-5 py-3 border border-white/10 transition-all hover:bg-white/10 cursor-default">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Moon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Moon Sign</p>
                  <p className="text-sm font-bold text-white leading-tight">{moonSign}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`relative rounded-2xl p-6 bg-gradient-to-r ${getMoodGradient(insight.mood)} backdrop-blur-sm border border-white/10`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-400" />
              <span className="text-sm font-medium text-violet-300">Today's Cosmic Message</span>
              {insight.ai_powered && (
                <span className="px-2 py-0.5 text-[10px] bg-violet-500/30 text-violet-200 rounded-full">AI</span>
              )}
            </div>
            <button
              onClick={fetchInsight}
              disabled={loading}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            <div className="w-full">
              <p className="text-xl md:text-2xl text-white leading-relaxed mb-6 font-medium">
                {getMoodEmoji(insight.mood)} {insight.insight}
              </p>

              {insight.power_mantra && (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 w-fit">
                  <div className="p-2 bg-amber-500/20 rounded-lg">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Power Mantra</p>
                    <p className="text-base font-bold text-amber-200 italic">"{insight.power_mantra}"</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <Star className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Focus</p>
                  <p className="text-sm font-bold text-white leading-none">{insight.focus_area || 'Growth'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <div
                    className="w-5 h-5 rounded-full border border-white/30"
                    style={{ backgroundColor: (insight.lucky_elements?.color || 'gold').toLowerCase() }}
                  />
                </div>
                <div>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Color</p>
                  <p className="text-sm font-bold text-white leading-none">{insight.lucky_elements?.color || 'Gold'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <Compass className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Direction</p>
                  <p className="text-sm font-bold text-white leading-none">{insight.lucky_elements?.direction || 'East'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cosmic Weather Strip */}
      <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Moon className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tithi (Phase)</p>
            <p className="text-sm font-bold text-white shadow-sm">{getPanchangValue(panchangData?.tithi)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-500/20 rounded-lg">
            <Star className="w-4 h-4 text-pink-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nakshatra</p>
            <p className="text-sm font-bold text-white shadow-sm">{getPanchangValue(panchangData?.nakshatra)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <Compass className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Yoga</p>
            <p className="text-sm font-bold text-white shadow-sm">{getPanchangValue(panchangData?.yoga)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <Sun className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Solar Cycle</p>
            <p className="text-sm font-bold text-white shadow-sm">
              {panchangData?.sunrise ? `↑ ${panchangData.sunrise}` : '--:--'} • {panchangData?.sunset ? `↓ ${panchangData.sunset}` : '--:--'}
            </p>
          </div>
        </div>
      </div>


    </div>
  );
};

export default CosmicHero;
