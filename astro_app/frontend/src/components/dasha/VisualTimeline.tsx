import React, { useState } from 'react';

interface DashaSegment {
  lord: string;
  duration_years: number;
  start_date: string;
  end_date: string;
  is_current?: boolean;
}

interface VisualTimelineProps {
  dashas: DashaSegment[];
  startYear: number;
}

const PLANET_COLORS: Record<string, string> = {
  Sun: '#F5A623',    // Amber-500
  Moon: '#A9B0C2',   // Blue-400
  Mars: '#E25555',   // Red-500
  Mercury: '#2ED573', // Emerald-500
  Jupiter: '#F5A623', // Yellow-400
  Venus: '#EDEFF5',  // Pink-400
  Saturn: '#6D5DF6', // Indigo-500
  Rahu: '#6F768A',   // Slate-600
  Ketu: '#6F768A'    // Amber-800
};

const VisualTimeline: React.FC<VisualTimelineProps> = ({ dashas, startYear }) => {
  const [hoveredDasha, setHoveredDasha] = useState<DashaSegment | null>(null);

  // Total cycle is 120 years
  const totalYears = 120;

  return (
    <div className="w-full">
      <div className="relative h-16 bg-[#FFFFFF]/05 rounded-xl overflow-hidden flex border border-[#FFFFFF]/08">
        {dashas.map((dasha, idx) => {
          const widthPercent = (dasha.duration_years / totalYears) * 100;
          return (
            <div
              key={idx}
              className="h-full relative group transition-all duration-300 hover:opacity-90"
              style={{
                width: `${widthPercent}%`,
                backgroundColor: PLANET_COLORS[dasha.lord] || '#A9B0C2'
              }}
              onMouseEnter={() => setHoveredDasha(dasha)}
              onMouseLeave={() => setHoveredDasha(null)}
            >
              {dasha.is_current && (
                <div className="absolute top-0 left-0 w-full h-1 bg-[#EDEFF5] animate-pulse shadow-[0_0_10px_white]"></div>
              )}
              {/* Label if wide enough */}
              {widthPercent > 5 && (
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#0B0F1A] uppercase tracking-wider drop-shadow-md">
                  {dasha.lord}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend / Hover Info */}
      <div className="mt-2 h-6 flex justify-between items-center text-xs text-[#6F768A]">
        <span>{startYear}</span>
        {hoveredDasha ? (
          <span className="font-bold text-[#6D5DF6]">
            {hoveredDasha.lord} Mahadasha ({hoveredDasha.start_date} - {hoveredDasha.end_date})
          </span>
        ) : (
          <span>Hover for details</span>
        )}
        <span>{startYear + 120}</span>
      </div>
    </div>
  );
};

export default VisualTimeline;
