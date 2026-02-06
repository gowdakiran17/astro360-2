

interface MobilePlanetaryStatusProps {
  chartData: any;
}

const MobilePlanetaryStatus = ({ chartData }: MobilePlanetaryStatusProps) => {
  const getPlanets = () => {
    if (!chartData?.planets) return [];
    return chartData.planets.slice(0, 5); // Show first 5 planets
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'exalted':
        return 'text-green-600 bg-green-50';
      case 'debilitated':
        return 'text-red-600 bg-red-50';
      case 'own sign':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };

  const planets = getPlanets();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Planetary Status</h3>
        <button className="text-xs text-indigo-600 font-medium">View All</button>
      </div>

      <div className="space-y-3">
        {planets.map((planet: any, index: number) => (
          <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-xs font-bold text-indigo-600">
                  {planet.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{planet.name}</p>
                <p className="text-xs text-slate-500">{planet.sign} {planet.degree}°</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(planet.status)}`}>
                {planet.status || 'Normal'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobilePlanetaryStatus;