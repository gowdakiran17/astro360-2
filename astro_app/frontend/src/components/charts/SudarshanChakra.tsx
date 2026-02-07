import React from 'react';

interface SudarshanChakraProps {
  data: any;
}

const SudarshanChakra: React.FC<SudarshanChakraProps> = ({ data }) => {
  if (!data || !data.sudarshana_chakra) return null;

  const { lagna_wheel, moon_wheel, sun_wheel } = data.sudarshana_chakra;

  // Helper to render a single wheel layer
  const renderWheel = (houses: any[], radius: number, label: string, color: string) => {
    return (
      <g>
        {/* Ring Background */}
        <circle cx="300" cy="300" r={radius} fill="none" stroke={color} strokeWidth="1" opacity="0.3" />
        
        {houses.map((house, idx) => {
          // 12 Houses, 30 degrees each
          // Start from top (90 deg - 15 deg offset to center sector?)
          // Standard North/South charts are square. Sudarshan is circular.
          // Let's use a standard circular layout where House 1 is at Top (or East/Left depending on style).
          // Standard: House 1 at Top-Center (North Indian style mapping to circle?) 
          // Or just 12 sectors starting from 0 deg (Ascendant).
          // Let's assume standard circular: House 1 at top.
          const anglePerHouse = 360 / 12;
          // const startAngle = idx * anglePerHouse - 90 - (anglePerHouse / 2); // Shift so sector centers on top
          
          const sectorCenterAngle = (idx * anglePerHouse) - 90;
          const rad = (sectorCenterAngle * Math.PI) / 180;
          
          // Position for Sign Name
          const signR = radius - 25;
          const sx = 300 + signR * Math.cos(rad);
          const sy = 300 + signR * Math.sin(rad);

          // Position for Planets
          const planetR = radius - 55;
          const px = 300 + planetR * Math.cos(rad);
          const py = 300 + planetR * Math.sin(rad);

          return (
            <g key={idx}>
              {/* Divider Lines */}
              <line 
                x1={300 + (radius - 80) * Math.cos(((idx * 30 - 105) * Math.PI) / 180)} 
                y1={300 + (radius - 80) * Math.sin(((idx * 30 - 105) * Math.PI) / 180)}
                x2={300 + radius * Math.cos(((idx * 30 - 105) * Math.PI) / 180)}
                y2={300 + radius * Math.sin(((idx * 30 - 105) * Math.PI) / 180)}
                stroke={color}
                strokeWidth="0.5"
                opacity="0.2"
              />
              
              {/* Sign Number/Name */}
              <text x={sx} y={sy} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize="10" fontWeight="bold" opacity="0.8">
                {house.sign.substring(0, 3)}
              </text>
              
              {/* Planets */}
              <text x={px} y={py} textAnchor="middle" dominantBaseline="middle" fill="#EDEFF5" fontSize="9" fontWeight="500">
                {house.planets.map((p: string) => p.substring(0, 2)).join(' ')}
              </text>
            </g>
          );
        })}
        
        {/* Label for the Ring */}
        <text x="300" y={300 - radius + 15} textAnchor="middle" fill={color} fontSize="10" fontWeight="bold" opacity="0.6" letterSpacing="2px">
          {label}
        </text>
      </g>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h3 className="text-lg font-bold text-slate-200 mb-4">Sudarshan Chakra</h3>
      <svg width="600" height="600" viewBox="0 0 600 600" className="max-w-full h-auto">
        <defs>
          <radialGradient id="centerGrad" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#6D5DF6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#11162A" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Center Glow */}
        <circle cx="300" cy="300" r="50" fill="url(#centerGrad)" />
        
        {/* Outer Ring: Sun */}
        {renderWheel(sun_wheel, 280, "SURYA LAGNA (SUN)", "#F5A623")}
        
        {/* Middle Ring: Moon */}
        {renderWheel(moon_wheel, 200, "CHANDRA LAGNA (MOON)", "#E2E8F0")}
        
        {/* Inner Ring: Lagna */}
        {renderWheel(lagna_wheel, 120, "LAGNA (ASC)", "#2ED573")}
        
        {/* Center Point */}
        <circle cx="300" cy="300" r="3" fill="#6D5DF6" />
      </svg>
    </div>
  );
};

export default SudarshanChakra;
