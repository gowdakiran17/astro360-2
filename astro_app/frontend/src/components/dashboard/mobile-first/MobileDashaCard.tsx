import { Clock } from 'lucide-react';

interface MobileDashaCardProps {
  dashaData: any;
}

const MobileDashaCard = ({ dashaData }: MobileDashaCardProps) => {
  const getCurrentDasha = () => {
    if (!dashaData?.dashas) return null;
    return dashaData.dashas[0]; // Get current major period
  };

  const currentDasha = getCurrentDasha();

  if (!currentDasha) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Current Period</h3>
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4 text-indigo-600" />
          <span className="text-xs text-slate-500">Active</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-center">
          <p className="text-lg font-bold text-slate-900">{currentDasha.planet} Dasha</p>
          <p className="text-sm text-slate-600">Major Period</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-500 mb-1">Started</p>
            <p className="text-sm font-medium text-slate-900">
              {formatDate(currentDasha.start_date)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Ends</p>
            <p className="text-sm font-medium text-slate-900">
              {formatDate(currentDasha.end_date)}
            </p>
          </div>
        </div>

        {currentDasha.antardasha && (
          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-2">Current Sub-period</p>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-sm font-medium text-slate-900">
                {currentDasha.antardasha.planet} Antardasha
              </p>
              <p className="text-xs text-slate-600 mt-1">
                {formatDate(currentDasha.antardasha.start_date)} - {formatDate(currentDasha.antardasha.end_date)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileDashaCard;