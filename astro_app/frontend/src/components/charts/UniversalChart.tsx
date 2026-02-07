import React, { useState } from 'react';
import { useChartSettings } from '../../context/ChartContext';
import NorthIndianChart, { ChartData } from '../NorthIndianChart';
import SouthIndianChart from './SouthIndianChart';
import ChartWheel from './ChartWheel';
import { Layers } from 'lucide-react';

interface UniversalChartProps {
  data: ChartData | null;
  className?: string;
  transits?: any[];
}

const UniversalChart: React.FC<UniversalChartProps> = ({ data, className, transits = [] }) => {
  const { chartStyle } = useChartSettings();
  const [useBhava, setUseBhava] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {/* Chart Controls */}
      <div className="absolute top-0 right-0 z-10 p-2">
        <button
          onClick={() => setUseBhava(!useBhava)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
            useBhava 
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20' 
              : 'bg-slate-800/80 text-slate-400 border-white/10 hover:text-white hover:bg-slate-800'
          }`}
          title="Toggle Bhava Chalit (Planetary House Positions)"
        >
          <Layers className="w-3 h-3" />
          {useBhava ? 'Bhava Chalit' : 'Rashi Chart'}
        </button>
      </div>

      {chartStyle === 'NORTH_INDIAN' ? (
        <NorthIndianChart data={data} useBhava={useBhava} transits={transits} />
      ) : chartStyle === 'SOUTH_INDIAN' ? (
        <SouthIndianChart data={data} useBhava={useBhava} transits={transits} />
      ) : (
        <ChartWheel data={data} />
      )}
    </div>
  );
};

export default UniversalChart;
