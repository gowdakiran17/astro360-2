import { useState } from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';

interface MobileChartDisplayProps {
  chartData: any;
  title?: string;
}

const MobileChartDisplay = ({ chartData, title = "Birth Chart" }: MobileChartDisplayProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  if (!chartData?.planets) return null;

  const getPlanetsByHouse = () => {
    const houseMap: { [key: number]: any[] } = {};
    chartData.planets.forEach((planet: any) => {
      const house = planet.house || 1;
      if (!houseMap[house]) houseMap[house] = [];
      houseMap[house].push(planet);
    });
    return houseMap;
  };

  const planetsByHouse = getPlanetsByHouse();
  const houses = Array.from({ length: 12 }, (_, i) => i + 1);

  const getPlanetColor = (planetName: string) => {
    const colors: { [key: string]: string } = {
      'Sun': 'text-orange-600',
      'Moon': 'text-slate-600',
      'Mars': 'text-red-600',
      'Mercury': 'text-green-600',
      'Jupiter': 'text-yellow-600',
      'Venus': 'text-pink-600',
      'Saturn': 'text-gray-600',
      'Rahu': 'text-purple-600',
      'Ketu': 'text-indigo-600',
      'Uranus': 'text-cyan-600',
      'Neptune': 'text-blue-600',
      'Pluto': 'text-slate-700'
    };
    return colors[planetName] || 'text-slate-600';
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'exalted':
        return 'bg-green-100 text-green-700';
      case 'debilitated':
        return 'bg-red-100 text-red-700';
      case 'own sign':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label={showDetails ? "Hide details" : "Show details"}
            >
              {showDetails ? <EyeOff className="w-4 h-4 text-slate-600" /> : <Eye className="w-4 h-4 text-slate-600" />}
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>
      </div>

      {/* Compact View */}
      {!isExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {houses.slice(0, 4).map(house => (
              <div key={house} className="text-center">
                <div className="text-xs text-slate-500 mb-1">House {house}</div>
                <div className="space-y-1">
                  {(planetsByHouse[house] || []).slice(0, 2).map((planet: any, index: number) => (
                    <div key={index} className="text-xs">
                      <span className={`font-medium ${getPlanetColor(planet.name)}`}>
                        {planet.name.charAt(0)}
                      </span>
                      <span className="text-slate-600"> {planet.sign.charAt(0)}{planet.degree}°</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setIsExpanded(true)}
            className="mt-4 w-full text-center text-xs text-indigo-600 font-medium"
          >
            Show full chart
          </button>
        </div>
      )}

      {/* Expanded View */}
      {isExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-3 gap-3 text-xs">
            {houses.map(house => (
              <div key={house} className="bg-slate-50 rounded-lg p-3">
                <div className="font-medium text-slate-900 mb-2">House {house}</div>
                <div className="space-y-1.5">
                  {(planetsByHouse[house] || []).map((planet: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className={`font-medium ${getPlanetColor(planet.name)}`}>
                        {planet.name}
                      </span>
                      <div className="text-right">
                        <div className="text-slate-700">{planet.sign}</div>
                        <div className="text-slate-500">{planet.degree}°</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {showDetails && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Planetary Details</h4>
              <div className="space-y-2">
                {chartData.planets.map((planet: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getPlanetColor(planet.name).replace('text-', 'bg-')}`}></div>
                      <span className="text-sm font-medium text-slate-900">{planet.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-600">{planet.sign} {planet.degree}°</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(planet.status)}`}>
                        {planet.status || 'Normal'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => setIsExpanded(false)}
            className="mt-4 w-full text-center text-xs text-indigo-600 font-medium"
          >
            Show less
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileChartDisplay;