import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, TrendingDown, Minus, Heart, Briefcase, Activity, Wallet, Moon, RefreshCw } from 'lucide-react';
import api from '../../../services/api';

interface QuickPrediction {
  score: number;
  trend: 'up' | 'stable' | 'down';
  summary: string;
}

interface QuickPredictionsData {
  career: QuickPrediction;
  love: QuickPrediction;
  health: QuickPrediction;
  wealth: QuickPrediction;
  spiritual: QuickPrediction;
  overall_message: string;
  ai_powered: boolean;
}

interface AIQuickInsightsProps {
  chartData: any;
  dashaData?: any;
}

const defaultPredictions: QuickPredictionsData = {
  career: { score: 72, trend: 'up', summary: "Professional growth opportunities are emerging." },
  love: { score: 78, trend: 'stable', summary: "Harmony flows in your relationships." },
  health: { score: 75, trend: 'stable', summary: "Maintain balance with self-care." },
  wealth: { score: 68, trend: 'up', summary: "Financial wisdom guides your path." },
  spiritual: { score: 82, trend: 'up', summary: "Inner peace illuminates your journey." },
  overall_message: "The stars favor your journey today. Embrace opportunities with confidence.",
  ai_powered: false
};

const AIQuickInsights: React.FC<AIQuickInsightsProps> = ({ chartData, dashaData }) => {
  const [predictions, setPredictions] = useState<QuickPredictionsData>(defaultPredictions);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchPredictions = async () => {
    if (!chartData) return;
    setLoading(true);
    try {
      const response = await api.post('/ai/quick-predictions', {
        chart_data: chartData,
        dasha_data: dashaData
      });
      if (response.data?.status === 'success' && response.data?.data) {
        const data = response.data.data;
        setPredictions({
          career: data.career || defaultPredictions.career,
          love: data.love || defaultPredictions.love,
          health: data.health || defaultPredictions.health,
          wealth: data.wealth || defaultPredictions.wealth,
          spiritual: data.spiritual || defaultPredictions.spiritual,
          overall_message: data.overall_message || defaultPredictions.overall_message,
          ai_powered: data.ai_powered || false
        });
      } else {
        setPredictions(defaultPredictions);
      }
    } catch (err) {
      console.error('Error fetching predictions:', err);
      setPredictions(defaultPredictions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, [chartData]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-rose-400" />;
      default: return <Minus className="w-4 h-4 text-amber-400" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'from-emerald-500 to-emerald-600';
    if (score >= 50) return 'from-amber-500 to-amber-600';
    return 'from-rose-500 to-rose-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 75) return 'bg-emerald-500/20';
    if (score >= 50) return 'bg-amber-500/20';
    return 'bg-rose-500/20';
  };

  const lifeAreas = [
    { key: 'career', label: 'Career', icon: Briefcase, color: 'text-blue-400', gradient: 'from-blue-600 to-indigo-600' },
    { key: 'love', label: 'Love', icon: Heart, color: 'text-rose-400', gradient: 'from-rose-600 to-pink-600' },
    { key: 'health', label: 'Health', icon: Activity, color: 'text-green-400', gradient: 'from-green-600 to-emerald-600' },
    { key: 'wealth', label: 'Wealth', icon: Wallet, color: 'text-amber-400', gradient: 'from-amber-600 to-yellow-600' },
    { key: 'spiritual', label: 'Spiritual', icon: Moon, color: 'text-purple-400', gradient: 'from-purple-600 to-violet-600' },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900/80 via-indigo-900/30 to-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">AI Life Predictions</h3>
            {predictions.ai_powered && (
              <span className="text-xs text-violet-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                Powered by AI
              </span>
            )}
          </div>
        </div>
        <button
          onClick={fetchPredictions}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          title="Refresh predictions"
        >
          <RefreshCw className={`w-4 h-4 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {predictions.overall_message && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30">
          <p className="text-sm text-slate-200 leading-relaxed">{predictions.overall_message}</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {lifeAreas.map(({ key, label, icon: Icon, color, gradient }) => {
          const prediction = predictions[key as keyof QuickPredictionsData] as QuickPrediction;
          if (!prediction || typeof prediction !== 'object') return null;
          
          const isExpanded = expanded === key;

          return (
            <div
              key={key}
              onClick={() => setExpanded(isExpanded ? null : key)}
              className={`relative group cursor-pointer rounded-2xl p-4 transition-all duration-300 ${
                isExpanded 
                  ? 'bg-white/10 ring-2 ring-white/20 scale-105' 
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
              
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-full ${getScoreBgColor(prediction.score)} flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>

                <div className="text-center">
                  <p className="text-sm font-medium text-white mb-1">{label}</p>
                  
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className={`text-lg font-bold bg-gradient-to-r ${getScoreColor(prediction.score)} bg-clip-text text-transparent`}>
                      {prediction.score}%
                    </span>
                    {getTrendIcon(prediction.trend)}
                  </div>

                  <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(prediction.score)} transition-all duration-500`}
                      style={{ width: `${prediction.score}%` }}
                    />
                  </div>

                  {isExpanded && prediction.summary && (
                    <p className="mt-3 text-xs text-slate-300 leading-relaxed animate-fadeIn">
                      {prediction.summary}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIQuickInsights;
