import { useEffect, useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { businessService } from '../services/business';
import { useChartSettings } from '../context/ChartContext';
import {
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info, Calendar,
  Activity, Zap, Download, Shield, Clock, BarChart3, PieChart,
  Moon, Sun, Wind, ChevronRight, Bell, Target, Layers
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// --- Interfaces matching the new Backend & Design ---

interface CosmicWeather {
  moon_phase: string;
  moon_sign: string;
  moon_house: string;
  void_of_course: boolean;
  planetary_hour: {
    planet: string;
    start?: string;
    end?: string;
    quality: string;
  };
  retrogrades: string[];
  aspects: Array<{
    planet1?: string;
    planet2?: string;
    aspect?: string;
    type?: string;
    title?: string;
    description?: string;
    exact_time?: string;
    intensity?: string;
  }>;
}

interface PersonalInsights {
  dash_period: string;
  trading_bias: string;
  favorable_sectors: string[];
  challenging_periods: string[];
  favorable_windows?: Array<{ start: string, end: string, type: 'favorable' | 'caution' }>;
}

interface MarketIndicators {
  volatility_score: number;
  trend: string;
  confidence: string;
  trading_bias: string;
}

interface UpcomingEvent {
  date: string;
  event: string;
  impact: string;
  recommendation: string;
}

interface MarketTimingData {
  date: string;
  summary?: string;

  // New Main Structures
  cosmic_weather?: CosmicWeather;
  market_indicators?: MarketIndicators;
  personal_insights?: PersonalInsights;
  upcoming_events?: UpcomingEvent[];
  sector_rotation?: {
    STRONG: string[];
    NEUTRAL: string[];
    WEAKENING: string[];
  };

  // Fallback / Raw Data
  transits?: any[];
  insights?: any[];
  bradley_indicator?: any;
  gann_time_cycles?: any;
}

const MarketTiming = () => {
  const [data, setData] = useState<MarketTimingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentProfile } = useChartSettings();

  useEffect(() => {
    const fetchData = async () => {
      // Market Location
      const locParams = currentProfile ? {
        lat: currentProfile.latitude,
        lon: currentProfile.longitude,
        timezone: currentProfile.timezone
      } : undefined;

      // Personal Birth Details
      const birthParams = currentProfile ? {
        date: currentProfile.date,
        time: currentProfile.time,
        lat: currentProfile.latitude,
        lon: currentProfile.longitude,
        timezone: currentProfile.timezone
      } : undefined;

      setLoading(true);
      try {
        const response = await businessService.getMarketTiming(locParams, birthParams);
        setData(response);
      } catch (err) {
        console.error(err);
        setError("Failed to load market intelligence data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentProfile]);

  if (loading) {
    return (
      <MainLayout title="Market Analysis" breadcrumbs={['Cosmic Hub', 'Market Analysis']}>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          <p className="text-slate-500 animate-pulse font-medium">Calculating Volatility & Cosmic Weather...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="Market Analysis" breadcrumbs={['Cosmic Hub', 'Market Analysis']}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Analysis Unavailable</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </MainLayout>
    );
  }

  if (!data) {
    return (
      <MainLayout title="Market Analysis" breadcrumbs={['Cosmic Hub', 'Market Analysis']}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Info className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No Market Data</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md">
            We couldn't generate a market forecast for this location. Please update your profile or try again later.
          </p>
        </div>
      </MainLayout>
    );
  }

  // Helpers for Mock Data if API missing (Safe Defaults)
  const volatility = data.market_indicators?.volatility_score || 50;
  const volColor = volatility < 40 ? 'text-emerald-500' : volatility < 70 ? 'text-amber-500' : 'text-rose-500';
  const volBg = volatility < 40 ? 'bg-emerald-500' : volatility < 70 ? 'bg-amber-500' : 'bg-rose-500';
  const volBorder = volatility < 40 ? 'border-t-emerald-500' : volatility < 70 ? 'border-t-amber-500' : 'border-t-rose-500';

  return (
    <MainLayout title="Market Analysis" breadcrumbs={['Cosmic Hub', 'Market Analysis']}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-amber-500" />
              Market Intelligence
              <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                Live Analysis
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Cosmic timing for financial decisions.</p>
          </div>
          <div className="text-right text-xs text-slate-400">
            Last Updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* 1. TOP CARDS (Cosmic Weather / Volatility / Score) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1: Cosmic Weather */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Moon className="w-24 h-24" />
            </div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Current Cosmic Weather</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-500">
                <Moon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">
                  {data.cosmic_weather?.moon_phase || "Waxing"}
                </div>
                <div className="text-sm text-slate-500">
                  Moon in {data.cosmic_weather?.moon_sign || "Leo"}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Next Phase</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">Full Moon in 2d</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Void of Course</span>
                <span className={`font-medium ${data.cosmic_weather?.void_of_course ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {data.cosmic_weather?.void_of_course ? "YES (Caution)" : "NO (Stable)"}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Market Volatility Index */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Zap className="w-3 h-3" /> Market Volatility Index
            </h3>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-16 overflow-hidden mb-2">
                <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-[12px] border-slate-100 dark:border-slate-700 box-border"></div>
                <div
                  className={`absolute top-0 left-0 w-32 h-32 rounded-full border-[12px] border-transparent ${volBorder} transform origin-center transition-transform duration-1000`}
                  style={{ transform: `rotate(${(volatility / 100) * 180 - 45}deg)` }}
                ></div>
                <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 text-3xl font-bold ${volColor}`}>
                  {volatility}
                </span>
              </div>
              <div className={`text-sm font-bold uppercase px-3 py-1 rounded-full ${volBg} bg-opacity-10 ${volColor}`}>
                {volatility > 70 ? "High Volatility" : volatility > 40 ? "Moderate" : "Low Volatility"}
              </div>
              <p className="text-xs text-slate-400 mt-2 text-center">
                Based on hard aspects & retrograde stations
              </p>
            </div>
          </div>

          {/* Card 3: Cosmic Timing Score */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Cosmic Timing Score</h3>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-5xl font-bold text-slate-900 dark:text-white">
                {(data.market_indicators?.confidence === 'high' ? 8.5 : 7.2)}
              </span>
              <span className="text-lg text-slate-400 mb-2">/ 10</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-emerald-500" />
                <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                  {data.market_indicators?.trading_bias || "Cautious"}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Recommended for: {volatility < 60 ? "Swing Trading" : "Scalping / Hedges"}
              </p>
            </div>
          </div>
        </div>

        {/* 2. TRADING WINDOW TIMELINE */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            Today's Trading Window
          </h3>
          <div className="relative pt-6 pb-2">
            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full w-full absolute top-1/2 transform -translate-y-1/2 z-0"></div>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Window 1 */}
              <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 p-4 rounded-xl text-center hover:scale-105 transition-transform cursor-default">
                <span className="inline-block px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded mb-2">
                  09:30 - 11:00
                </span>
                <div className="flex flex-col items-center">
                  <Sun className="w-5 h-5 text-emerald-500 mb-1" />
                  <span className="font-bold text-emerald-700 text-sm">Sun Hour</span>
                  <span className="text-xs text-emerald-600/70">Initiate Trades</span>
                </div>
              </div>
              {/* Window 2 */}
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 p-4 rounded-xl text-center hover:scale-105 transition-transform cursor-default opacity-50">
                <span className="inline-block px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-[10px] font-bold rounded mb-2">
                  13:00 - 14:30
                </span>
                <div className="flex flex-col items-center">
                  <Moon className="w-5 h-5 text-amber-500 mb-1" />
                  <span className="font-bold text-amber-700 text-sm">Moon Void</span>
                  <span className="text-xs text-amber-600/70">No New Positions</span>
                </div>
              </div>
              {/* Window 3 */}
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl text-center hover:scale-105 transition-transform cursor-default">
                <span className="inline-block px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded mb-2">
                  15:30 - 16:00
                </span>
                <div className="flex flex-col items-center">
                  <div className="w-5 h-5 flex items-center justify-center font-serif text-slate-500 mb-1 font-bold">♄</div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">Saturn Hour</span>
                  <span className="text-xs text-slate-500">Close Positions</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. SPLIT SECTION: PERSONAL CALENDAR & ASPECTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Active Planetary Aspects */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              Active Planetary Aspects
            </h3>
            <div className="space-y-4">
              {/* Mock data if active aspects empty, or map real if available */}
              {(data.cosmic_weather?.aspects?.length ? data.cosmic_weather.aspects : [
                { title: "Mars Square Uranus", intensity: "high", desc: "Expect sudden moves in tech/crypto.", type: "risk" },
                { title: "Jupiter Trine Venus", intensity: "medium", desc: "Favorable for luxury & retail.", type: "opportunity" }
              ]).map((item: any, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700">
                  <div className={`mt-1 ${item.type === 'risk' ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {item.type === 'risk' ? <Zap className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900 dark:text-white">{item.title}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${item.intensity === 'high' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                        }`}>{item.intensity || "Active"}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {item.desc || item.description || "Influencing market sentiment today."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Trading Calendar */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-20">
              <Target className="w-32 h-32" />
            </div>
            <h3 className="font-bold mb-6 flex items-center gap-2 relative z-10">
              <Shield className="w-5 h-5 text-indigo-300" />
              Personal Trading Calendar
            </h3>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 relative z-10">
              <div className="text-xs text-indigo-200 uppercase font-bold tracking-wider mb-1">Current Dasha Period</div>
              <div className="text-xl font-bold">
                {data.personal_insights?.dash_period || "Jupiter Mahadasha"}
              </div>
              <div className="mt-2 text-sm text-indigo-100 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Bias: {data.personal_insights?.trading_bias || "Disciplined Growth"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="bg-emerald-500/20 border border-emerald-500/30 p-3 rounded-lg">
                <div className="text-xs font-bold text-emerald-300 uppercase mb-1">Favorable</div>
                <div className="font-medium text-sm">Next 3 Days</div>
              </div>
              <div className="bg-rose-500/20 border border-rose-500/30 p-3 rounded-lg">
                <div className="text-xs font-bold text-rose-300 uppercase mb-1">Caution</div>
                <div className="font-medium text-sm">Dec 15 - 20</div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. SECTOR ROTATION */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-500" />
              Sector Rotation Insights
            </h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View Analysis</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Strong */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="font-bold text-slate-700 dark:text-slate-300 text-sm uppercase">Strong</span>
              </div>
              {data.sector_rotation?.STRONG.map((sector) => (
                <div key={sector} className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{sector}</span>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
              )) || <div className="text-sm text-slate-400">Loading...</div>}
            </div>

            {/* Neutral */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
                <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                <span className="font-bold text-slate-700 dark:text-slate-300 text-sm uppercase">Neutral</span>
              </div>
              {data.sector_rotation?.NEUTRAL.map((sector) => (
                <div key={sector} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{sector}</span>
                  <span className="text-xs text-slate-400">Stable</span>
                </div>
              )) || <div className="text-sm text-slate-400">Loading...</div>}
            </div>

            {/* Weakening */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                <span className="font-bold text-slate-700 dark:text-slate-300 text-sm uppercase">Weakening</span>
              </div>
              {data.sector_rotation?.WEAKENING.map((sector) => (
                <div key={sector} className="p-3 bg-rose-50 dark:bg-rose-900/10 rounded-lg flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{sector}</span>
                  <TrendingDown className="w-4 h-4 text-rose-500" />
                </div>
              )) || <div className="text-sm text-slate-400">Loading...</div>}
            </div>
          </div>
        </div>

        {/* 5. UPCOMING EVENTS */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            Upcoming Cosmic Events (30 Days)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 rounded-l-lg">Date</th>
                  <th className="px-6 py-3">Event</th>
                  <th className="px-6 py-3">Market Impact</th>
                  <th className="px-6 py-3 rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(data.upcoming_events?.length ? data.upcoming_events : [
                  { date: "Feb 15", event: "Mercury Retrograde", impact: "Communication Breakdowns", recommendation: "Avoid new contracts" },
                  { date: "Feb 22", event: "Sun enters Pisces", impact: "Speculative peak", recommendation: "Take profits" }
                ]).map((event, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{event.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        <span className="text-slate-800 dark:text-slate-200">{event.event}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{event.impact}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                        {event.recommendation}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default MarketTiming;
