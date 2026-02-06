import { useState } from 'react';
import { Calendar, Clock, TrendingUp } from 'lucide-react';

interface MobileTransitTimelineProps {
  transits: any[];
  title?: string;
}

const MobileTransitTimeline = ({ transits = [], title = "Today's Transits" }: MobileTransitTimelineProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');

  const getFilteredTransits = () => {
    const today = new Date();
    
    switch (selectedPeriod) {
      case 'today':
        return transits.filter(t => {
          const transitDate = new Date(t.date);
          return transitDate.toDateString() === today.toDateString();
        });
      case 'week': {
        const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        return transits.filter(t => {
          const transitDate = new Date(t.date);
          return transitDate >= today && transitDate <= weekFromNow;
        });
      }
      case 'month':
      {
        const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
        return transits.filter(t => {
          const transitDate = new Date(t.date);
          return transitDate >= today && transitDate <= monthFromNow;
        });
      }
      default:
        return transits;
    }
  };

  const filteredTransits = getFilteredTransits();

  const getImpactColor = (impact: string) => {
    switch (impact?.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-amber-600 bg-amber-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };

  const getPlanetIcon = (planet: string) => {
    const icons: { [key: string]: string } = {
      'Sun': '☀️',
      'Moon': '🌙',
      'Mars': '♂️',
      'Mercury': '☿️',
      'Jupiter': '♃',
      'Venus': '♀️',
      'Saturn': '♄',
      'Rahu': '☊',
      'Ketu': '☋'
    };
    return icons[planet] || '🪐';
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <TrendingUp className="w-4 h-4 text-indigo-600" />
        </div>
        
        {/* Period Selector */}
        <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
          {(['today', 'week', 'month'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md transition-colors ${
                selectedPeriod === period
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Transit List */}
      <div className="p-4">
        {filteredTransits.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No transits for this period</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransits.slice(0, 5).map((transit, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm">
                    {getPlanetIcon(transit.planet)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900">
                      {transit.planet} → {transit.sign}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getImpactColor(transit.impact)}`}>
                      {transit.impact}
                    </span>
                  </div>
                  
                  <div className="mt-1 flex items-center space-x-2 text-xs text-slate-600">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(transit.date)} at {formatTime(transit.date)}</span>
                  </div>
                  
                  {transit.description && (
                    <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                      {transit.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
            
            {filteredTransits.length > 5 && (
              <button className="w-full text-center text-xs text-indigo-600 font-medium py-2">
                View {filteredTransits.length - 5} more transits
              </button>
            )}
          </div>
        )}
      </div>

      {/* Impact Legend */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Low Impact</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span>Medium Impact</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span>High Impact</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileTransitTimeline;
