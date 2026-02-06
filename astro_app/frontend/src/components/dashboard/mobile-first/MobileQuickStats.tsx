import { RefreshCw, TrendingUp, Star, Clock } from 'lucide-react';

interface MobileQuickStatsProps {
  chartData: any;
  onRefresh: () => void;
  isLoading: boolean;
}

const MobileQuickStats = ({ chartData, onRefresh, isLoading }: MobileQuickStatsProps) => {
  const getMoonSign = () => {
    if (!chartData?.planets) return 'N/A';
    const moon = chartData.planets.find((p: any) => p.name === 'Moon');
    return moon?.sign || 'N/A';
  };

  const getAscendant = () => {
    if (!chartData?.ascendant) return 'N/A';
    return chartData.ascendant.sign || 'N/A';
  };

  const getActivePlanets = () => {
    if (!chartData?.planets) return 0;
    return chartData.planets.filter((p: any) => p.is_active).length;
  };

  const stats = [
    {
      icon: Star,
      label: 'Moon Sign',
      value: getMoonSign(),
      color: 'text-indigo-600'
    },
    {
      icon: TrendingUp,
      label: 'Ascendant',
      value: getAscendant(),
      color: 'text-purple-600'
    },
    {
      icon: Clock,
      label: 'Active Planets',
      value: getActivePlanets().toString(),
      color: 'text-amber-600'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Quick Stats</h3>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
          aria-label="Refresh data"
        >
          <RefreshCw className={`w-4 h-4 text-slate-600 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-50 mb-2`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
            <p className="text-sm font-semibold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileQuickStats;