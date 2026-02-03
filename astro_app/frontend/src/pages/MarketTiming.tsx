import { useEffect, useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { businessService } from '../services/business';
import { useChartSettings } from '../context/ChartContext';
import {
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info, Calendar,
  Activity, Zap, Download, Shield, Clock, BarChart3, PieChart
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

interface BradleyIndicator {
  current_value: number;
  trend_direction: 'up' | 'down';
  market_stress: 'low' | 'medium' | 'high';
  components: any;
}

interface GannCycle {
  planet: string;
  cycle_position: number;
  phase: string;
  next_turn_days: number;
}

interface MarketData {
  date: string;
  summary: string;
  transits?: any[];
  insights?: any[];
  // V3 New Fields
  overall_market_bias?: string;
  bradley_indicator?: BradleyIndicator;
  gann_time_cycles?: {
    active_cycles: GannCycle[];
    geometric_levels: any[];
  };
  volatility_forecast?: {
    volatility_percentage: number;
    recommendation: string;
  };
}

const MarketTiming = () => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentProfile } = useChartSettings();

  useEffect(() => {
    const fetchData = async () => {
      // Force refresh on mount if we have a profile or default to NY
      const params = currentProfile ? {
        lat: currentProfile.latitude,
        lon: currentProfile.longitude,
        timezone: currentProfile.timezone
      } : undefined;

      setLoading(true);
      try {
        const data = await businessService.getMarketTiming(params);
        setMarketData(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load market intelligence.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentProfile]);

  if (loading) {
    return (
      <MainLayout title="Market Timing" breadcrumbs={['Cosmic Hub', 'Market Timing']}>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          <p className="text-slate-500 animate-pulse">Running advanced astro-financial models...</p>
        </div>
      </MainLayout>
    );
  }

  if (!marketData) return null;

  const isProMode = !!marketData.bradley_indicator;

  return (
    <MainLayout title="Market Timing" breadcrumbs={['Cosmic Hub', 'Market Timing']}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-indigo-500" />
              Market Timing Intelligence
              {isProMode && <span className="text-xs px-2 py-0.5 rounded bg-indigo-500 text-white font-bold ml-2">PRO</span>}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {marketData.date.split('T')[0]} • {marketData.summary || "Astro-Financial Analysis"}
            </p>
          </div>
        </div>

        {/* PRO MODE: VAI Dashboard */}
        {isProMode && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* 1. Bradley Siderograph (Main) */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-500" />
                  Bradley Siderograph
                </h3>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${marketData.bradley_indicator?.trend_direction === 'up'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-rose-100 text-rose-700'
                  }`}>
                  Trend: {marketData.bradley_indicator?.trend_direction}
                </div>
              </div>

              <div className="h-64 w-full bg-slate-50 dark:bg-slate-900/50 rounded-xl relative overflow-hidden flex items-center justify-center">
                {/* Mock visual for now, ideally Recharts plotting Bradley history */}
                <div className="text-center">
                  <span className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 block mb-2">
                    {marketData.bradley_indicator?.current_value}
                  </span>
                  <span className="text-sm text-slate-500">Current Bradley Value</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg text-center">
                  <div className="text-xs text-slate-500 mb-1">Market Stress</div>
                  <div className="font-bold text-slate-900 dark:text-white uppercase">{marketData.bradley_indicator?.market_stress}</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg text-center">
                  <div className="text-xs text-slate-500 mb-1">Bias</div>
                  <div className="font-bold text-emerald-600 uppercase">{marketData.overall_market_bias}</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg text-center">
                  <div className="text-xs text-slate-500 mb-1">Turns</div>
                  <div className="font-bold text-slate-900 dark:text-white">Pending</div>
                </div>
              </div>
            </div>

            {/* 2. Volatility Gauge */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
              <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                Volatility Forecast
              </h3>

              <div className="flex flex-col items-center justify-center py-4">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100 dark:text-slate-700" />
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent"
                      strokeDasharray={440}
                      strokeDashoffset={440 - (440 * (marketData.volatility_forecast?.volatility_percentage || 0)) / 100}
                      className="text-amber-500 transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">
                      {marketData.volatility_forecast?.volatility_percentage}%
                    </span>
                    <span className="text-xs text-slate-500 uppercase">Risk Index</span>
                  </div>
                </div>
                <p className="text-center text-sm text-slate-600 dark:text-slate-300 mt-6 px-2">
                  {marketData.volatility_forecast?.recommendation}
                </p>
              </div>
            </div>

            {/* 3. Gann Time Cycles */}
            <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                Gann Time Cycles (Active)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {marketData.gann_time_cycles?.active_cycles.map((cycle, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-slate-700 dark:text-slate-200">{cycle.planet}</span>
                      <span className="text-[10px] uppercase font-bold text-slate-400">{cycle.phase}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-3">
                      <div
                        className="bg-indigo-500 h-1.5 rounded-full"
                        style={{ width: `${cycle.cycle_position * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-slate-500 flex justify-between">
                      <span>Progress: {Math.round(cycle.cycle_position * 100)}%</span>
                      <span className={cycle.next_turn_days < 7 ? "text-rose-500 font-bold" : "text-slate-500"}>
                        Turn: {cycle.next_turn_days}d
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FALLBACK MODE: Simple Views (Same as before but simplified) */}
        {!isProMode && (
          <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl text-center">
            <Info className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Standard Analysis Active</h2>
            <p className="text-slate-500 max-w-lg mx-auto mb-6">
              {marketData.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
              {marketData.insights?.map((insight: any, i: number) => (
                <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="font-bold mb-1 flex items-center justify-between">
                    {insight.title}
                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase ${insight.type === 'risk' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>{insight.intensity}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{insight.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default MarketTiming;
