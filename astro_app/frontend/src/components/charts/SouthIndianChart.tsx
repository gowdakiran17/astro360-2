import type { ChartData, Planet } from '../NorthIndianChart';

const SouthIndianChart = ({ data, useBhava = false, transits = [] }: { data: ChartData | null, useBhava?: boolean, transits?: Planet[] }) => {
  if (!data) return null;

  // Planet Colors - Optimized for Dark Theme
  const planetColors: Record<string, string> = {
    "Su": "#FCA5A5", // Red-300
    "Mo": "#E9D5FF", // Purple-200
    "Ma": "#FDBA74", // Orange-300
    "Me": "#93C5FD", // Blue-300
    "Ju": "#FDE047", // Yellow-300
    "Ve": "#86EFAC", // Green-300
    "Sa": "#FDA4AF", // Rose-300
    "Ra": "#D8B4FE", // Violet-300
    "Ke": "#F9A8D4", // Pink-300
    "Ur": "#94A3B8", // Slate-400
    "Ne": "#94A3B8", // Slate-400
    "Pl": "#94A3B8", // Slate-400
  };

  const getPlanetColor = (name: string, isTransit = false) => {
    if (isTransit) return "#2ED573"; // Green for Transits
    return planetColors[name] || "#CBD5E1";
  };

  // Map signs to their fixed positions in the 4x4 grid (0-11 indices)
  const signCells = {
    0: { x: 100, y: 0, name: "Aries" },      // Aries
    1: { x: 200, y: 0, name: "Taurus" },     // Taurus
    2: { x: 300, y: 0, name: "Gemini" },     // Gemini
    3: { x: 300, y: 100, name: "Cancer" },   // Cancer
    4: { x: 300, y: 200, name: "Leo" },      // Leo
    5: { x: 300, y: 300, name: "Virgo" },    // Virgo
    6: { x: 200, y: 300, name: "Libra" },    // Libra
    7: { x: 100, y: 300, name: "Scorpio" },  // Scorpio
    8: { x: 0, y: 300, name: "Sagittarius" },// Sagittarius
    9: { x: 0, y: 200, name: "Capricorn" },  // Capricorn
    10: { x: 0, y: 100, name: "Aquarius" },  // Aquarius
    11: { x: 0, y: 0, name: "Pisces" },      // Pisces
  };

  const zodiacOrder = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];

  // Determine Ascendant Sign
  const ascSign = data.ascendant.zodiac_sign;
  const ascIndex = zodiacOrder.findIndex(z => z === ascSign);

  // Group planets by sign
  const planetsBySign: Record<string, Array<{name: string, isTransit: boolean}>> = {};
  
  // Natal Planets
  data.planets.forEach(p => {
    let targetSign = p.zodiac_sign;

    if (useBhava) {
      // In Bhava mode, we place planet in the sign corresponding to its House
      const houseNum = p.kp_house || p.house;
      const signIdx = (ascIndex + (houseNum - 1)) % 12;
      targetSign = zodiacOrder[signIdx];
    }

    if (!planetsBySign[targetSign]) planetsBySign[targetSign] = [];
    planetsBySign[targetSign].push({ name: p.name.substring(0, 2), isTransit: false });
  });

  // Transit Planets
  transits.forEach(p => {
    // For South Indian chart, signs are fixed position.
    // Just map by sign name.
    const targetSign = p.zodiac_sign; // Transits usually viewed in Rashi
    if (!planetsBySign[targetSign]) planetsBySign[targetSign] = [];
    planetsBySign[targetSign].push({ name: p.name.substring(0, 2), isTransit: true });
  });

  return (
    <div className="flex justify-center my-6">
      <svg width="100%" height="100%" viewBox="0 0 400 400" className="stroke-amber-500 stroke-2 bg-transparent max-w-[400px] max-h-[400px]">
        {/* Outer Border */}
        <rect x="2" y="2" width="396" height="396" fill="none" className="stroke-amber-600 stroke-[4]" />

        {/* Grid Lines */}
        {/* Horizontal */}
        <line x1="0" y1="100" x2="400" y2="100" />
        <line x1="0" y1="200" x2="100" y2="200" /> {/* Left stub */}
        <line x1="300" y1="200" x2="400" y2="200" /> {/* Right stub */}
        <line x1="0" y1="300" x2="400" y2="300" />

        {/* Vertical */}
        <line x1="100" y1="0" x2="100" y2="400" />
        <line x1="200" y1="0" x2="200" y2="100" /> {/* Top stub */}
        <line x1="200" y1="300" x2="200" y2="400" /> {/* Bottom stub */}
        <line x1="300" y1="0" x2="300" y2="400" />

        {/* Render Signs */}
        {Object.values(signCells).map((coords) => {

          const signName = coords.name;
          const planets = planetsBySign[signName] || [];
          const isAscendant = ascSign === signName;

          return (
            <g key={signName}>
              {/* Ascendant Marker */}
              {isAscendant && (
                <text
                  x={coords.x + 50}
                  y={coords.y + 20}
                  textAnchor="middle"
                  className="font-bold fill-red-600"
                  style={{ fontSize: '14px' }}
                >
                  Asc
                </text>
              )}

              {/* Planets List */}
              {planets.map((p, i) => (
                <text
                  key={`${p.name}-${i}`}
                  x={coords.x + 50}
                  y={coords.y + (isAscendant ? 40 : 30) + (i * 18)}
                  textAnchor="middle"
                  className="font-bold"
                  style={{ 
                    fontSize: p.isTransit ? '12px' : '16px', 
                    fill: getPlanetColor(p.name, p.isTransit), 
                    stroke: 'none',
                    fontStyle: p.isTransit ? 'italic' : 'normal'
                  }}
                >
                  {p.name}{p.isTransit ? '*' : ''}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default SouthIndianChart;
