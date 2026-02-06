import { Calendar, Clock } from 'lucide-react';

interface MobileHeroProps {
  chartData: any;
  panchangData: any;
  dailyHoroscopeData: any;
}

const MobileHero = ({ panchangData, dailyHoroscopeData }: MobileHeroProps) => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getTithi = () => {
    if (!panchangData) return 'Loading...';
    return panchangData.tithi?.name || 'N/A';
  };

  const getNakshatra = () => {
    if (!panchangData) return 'Loading...';
    return panchangData.nakshatra?.name || 'N/A';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="space-y-4">
        {/* Date and Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-slate-700">{formattedDate}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span className="text-sm text-slate-600">
              {today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Panchang Details */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-500 mb-1">Tithi</p>
            <p className="text-sm font-medium text-slate-900">{getTithi()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Nakshatra</p>
            <p className="text-sm font-medium text-slate-900">{getNakshatra()}</p>
          </div>
        </div>

        {/* Daily Message */}
        {dailyHoroscopeData && (
          <div className="pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-700 leading-relaxed">
              {dailyHoroscopeData?.daily_message || 'Your cosmic insights are being prepared...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileHero;