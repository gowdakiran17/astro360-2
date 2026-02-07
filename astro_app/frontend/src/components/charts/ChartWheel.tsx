import React, { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

// --- Types ---
interface Planet {
    name: string;
    longitude: number; // 0-360
    zodiac_sign: string;
    house: number;
    speed?: number;
    is_retrograde?: boolean;
    color?: string; // Optional for transit handling
}

interface ChartData {
    ascendant: {
        zodiac_sign: string;
        longitude: number;
    };
    planets: Planet[];
}

interface ChartWheelProps {
    data: ChartData | null;
    transits?: Planet[]; // Optional Transit Planets
    width?: number;
    height?: number;
    className?: string;
}

// --- Constants ---
const ZODIAC_SIGNS = [
    { name: 'Aries', symbol: '♈', color: '#EF4444' },
    { name: 'Taurus', symbol: '♉', color: '#10B981' },
    { name: 'Gemini', symbol: '♊', color: '#F59E0B' },
    { name: 'Cancer', symbol: '♋', color: '#3B82F6' },
    { name: 'Leo', symbol: '♌', color: '#EF4444' },
    { name: 'Virgo', symbol: '♍', color: '#10B981' },
    { name: 'Libra', symbol: '♎', color: '#F59E0B' },
    { name: 'Scorpio', symbol: '♏', color: '#3B82F6' },
    { name: 'Sagittarius', symbol: '♐', color: '#EF4444' },
    { name: 'Capricorn', symbol: '♑', color: '#10B981' },
    { name: 'Aquarius', symbol: '♒', color: '#F59E0B' },
    { name: 'Pisces', symbol: '♓', color: '#3B82F6' },
];

const PLANET_COLORS: Record<string, string> = {
    'Sun': '#F59E0B',
    'Moon': '#E2E8F0',
    'Mars': '#EF4444',
    'Mercury': '#10B981',
    'Jupiter': '#FCD34D',
    'Venus': '#EC4899',
    'Saturn': '#6366F1',
    'Rahu': '#64748B',
    'Ketu': '#64748B',
    'Uranus': '#06B6D4',
    'Neptune': '#3B82F6',
    'Pluto': '#71717A'
};

const PLANET_SYMBOLS: Record<string, string> = {
    'Sun': '☉', 'Moon': '☾', 'Mars': '♂', 'Mercury': '☿',
    'Jupiter': '♃', 'Venus': '♀', 'Saturn': '♄', 'Rahu': '☊',
    'Ketu': '☋', 'Uranus': '♅', 'Neptune': '♆', 'Pluto': '♇'
};

// --- Helpers ---
const getCoordinates = (angleInDegrees: number, radius: number, cx: number, cy: number) => {
    const angleInRadians = (angleInDegrees - 180) * (Math.PI / 180); // Adjust -90 for 12 o'clock if needed, but here using chart logic
    // Standard Math: 0 is East (Right). SVG: 0 is East.
    // Astrology: Ascendant (Left/East) is usually 180 in SVG terms if 0 is right.
    // Let's stick to simple trigonometry.
    return {
        x: cx + radius * Math.cos(angleInRadians),
        y: cy + radius * Math.sin(angleInRadians)
    };
};

const ChartWheel: React.FC<ChartWheelProps> = ({ data, transits, width = 600, height = 600, className }) => {
    const [hoveredPlanet, setHoveredPlanet] = useState<Planet | null>(null);

    // Dimensions
    const cx = width / 2;
    const cy = height / 2;
    // Adjust radii to accommodate outer transit ring if needed
    const maxRadius = Math.min(width, height) / 2;
    const transitRingRadius = transits ? maxRadius - 20 : 0;
    const outerRadius = transits ? maxRadius - 60 : maxRadius - 20; // Shrink natal chart if transits exist
    const signRingRadius = outerRadius * 0.85;
    const houseRingRadius = signRingRadius * 0.85;
    const planetRingRadius = houseRingRadius * 0.75;
    const innerRadius = planetRingRadius * 0.4;

    // Memoize calculations
    const chartElements = useMemo(() => {
        if (!data) return null;

        const ascLon = data.ascendant.longitude;
        
        // Formula: SVG Angle = 180 - (PlanetLon - AscLon)
        // Ascendant (Angle 180 in SVG) should be at Left (Standard Chart)
        const getSvgAngle = (lon: number) => {
            return 180 - (lon - ascLon);
        };

        // 1. Zodiac Segments
        const zodiacSegments = ZODIAC_SIGNS.map((sign, i) => {
            const startLon = i * 30;
            const endLon = (i + 1) * 30;
            const startAngle = getSvgAngle(startLon);
            const endAngle = getSvgAngle(endLon);
            
            const p1 = getCoordinates(startAngle, outerRadius, cx, cy);
            const p2 = getCoordinates(endAngle, outerRadius, cx, cy);
            const p3 = getCoordinates(endAngle, signRingRadius, cx, cy);
            const p4 = getCoordinates(startAngle, signRingRadius, cx, cy);
            
            const midAngle = (startAngle + endAngle) / 2;
            const labelPos = getCoordinates(midAngle, (outerRadius + signRingRadius) / 2, cx, cy);

            return {
                path: `M ${p1.x} ${p1.y} A ${outerRadius} ${outerRadius} 0 0 0 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${signRingRadius} ${signRingRadius} 0 0 1 ${p4.x} ${p4.y} Z`,
                color: sign.color,
                symbol: sign.symbol,
                labelPos,
                name: sign.name
            };
        });

        // 2. House Lines
        const houseLines = Array.from({ length: 12 }).map((_, i) => {
            const angle = 180 - (i * 30);
            const start = getCoordinates(angle, signRingRadius, cx, cy);
            const end = getCoordinates(angle, innerRadius, cx, cy);
            const numAngle = angle - 15;
            const numPos = getCoordinates(numAngle, houseRingRadius * 0.9, cx, cy);
            return { x1: start.x, y1: start.y, x2: end.x, y2: end.y, numPos, num: i + 1 };
        });

        // 3. Natal Planets
        const sortedPlanets = [...data.planets].sort((a, b) => a.longitude - b.longitude);
        const plottedPlanets = sortedPlanets.map((planet) => {
            const angle = getSvgAngle(planet.longitude);
            const pos = getCoordinates(angle, planetRingRadius, cx, cy);
            const lineStart = getCoordinates(angle, planetRingRadius, cx, cy);
            const lineEnd = getCoordinates(angle, innerRadius, cx, cy);
            return {
                ...planet,
                x: pos.x, y: pos.y,
                color: PLANET_COLORS[planet.name] || '#EDEFF5',
                symbol: PLANET_SYMBOLS[planet.name] || planet.name.substring(0, 2),
                lineStart, lineEnd
            };
        });

        // 4. Aspects (Natal Only for now)
        const aspects = [];
        for (let i = 0; i < sortedPlanets.length; i++) {
            for (let j = i + 1; j < sortedPlanets.length; j++) {
                const p1 = sortedPlanets[i];
                const p2 = sortedPlanets[j];
                const diff = Math.abs(p1.longitude - p2.longitude);
                const normDiff = diff > 180 ? 360 - diff : diff;
                let type = null;
                if (Math.abs(normDiff - 0) < 8) type = 'Conjunction';
                else if (Math.abs(normDiff - 180) < 8) type = 'Opposition';
                else if (Math.abs(normDiff - 120) < 8) type = 'Trine';
                else if (Math.abs(normDiff - 90) < 8) type = 'Square';
                
                if (type && type !== 'Conjunction') {
                    const a1 = getSvgAngle(p1.longitude);
                    const a2 = getSvgAngle(p2.longitude);
                    const c1 = getCoordinates(a1, innerRadius, cx, cy);
                    const c2 = getCoordinates(a2, innerRadius, cx, cy);
                    aspects.push({
                        x1: c1.x, y1: c1.y, x2: c2.x, y2: c2.y,
                        type, color: type === 'Square' || type === 'Opposition' ? '#EF4444' : '#22C55E'
                    });
                }
            }
        }

        // 5. Transit Planets (Outer Ring)
        const plottedTransits = transits ? transits.map((planet) => {
            const angle = getSvgAngle(planet.longitude);
            const pos = getCoordinates(angle, transitRingRadius, cx, cy);
            // Line from outer ring to zodiac
            const lineStart = getCoordinates(angle, transitRingRadius, cx, cy);
            const lineEnd = getCoordinates(angle, outerRadius, cx, cy);
            return {
                ...planet,
                x: pos.x, y: pos.y,
                color: PLANET_COLORS[planet.name] || '#A3A3A3', // Slightly dimmer or distinct?
                symbol: PLANET_SYMBOLS[planet.name] || planet.name.substring(0, 2),
                lineStart, lineEnd
            };
        }) : [];

        return { zodiacSegments, houseLines, plottedPlanets, aspects, plottedTransits };

    }, [data, transits, width, height, cx, cy, outerRadius, innerRadius, planetRingRadius, houseRingRadius, signRingRadius, transitRingRadius]);

    if (!data || !chartElements) return null;

    return (
        <div className={`relative flex justify-center items-center ${className}`}>
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="max-w-full h-auto drop-shadow-2xl">
                
                {/* Defs */}
                <defs>
                    <radialGradient id="wheelGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="70%" stopColor="#0B0F1A" stopOpacity="1" />
                        <stop offset="100%" stopColor="#1E293B" stopOpacity="1" />
                    </radialGradient>
                </defs>

                {/* Background Circle */}
                <circle cx={cx} cy={cy} r={transits ? transitRingRadius + 15 : outerRadius} fill="url(#wheelGradient)" stroke="#334155" strokeWidth="1" />

                {/* 1. Zodiac Ring */}
                <g>
                    {chartElements.zodiacSegments.map((seg, i) => (
                        <g key={i}>
                            <path d={seg.path} fill="transparent" stroke="#334155" strokeWidth="1" />
                            <path d={seg.path} stroke={seg.color} strokeWidth="4" strokeDasharray={`${outerRadius * Math.PI / 10} 1000`} fill="none" className="opacity-50" />
                            <text x={seg.labelPos.x} y={seg.labelPos.y} textAnchor="middle" dominantBaseline="middle" fill={seg.color} fontSize="18" fontWeight="bold">
                                {seg.symbol}
                            </text>
                        </g>
                    ))}
                </g>

                {/* 2. House Ring */}
                <g>
                    {chartElements.houseLines.map((line, i) => (
                        <g key={i}>
                            <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                            <text x={line.numPos.x} y={line.numPos.y} textAnchor="middle" dominantBaseline="middle" fill="#64748B" fontSize="10" className="font-mono">{line.num}</text>
                        </g>
                    ))}
                </g>

                {/* 3. Aspects */}
                <g className="opacity-40">
                    {chartElements.aspects.map((aspect, i) => (
                        <line key={i} x1={aspect.x1} y1={aspect.y1} x2={aspect.x2} y2={aspect.y2} stroke={aspect.color} strokeWidth="1" />
                    ))}
                </g>

                {/* Center Void */}
                <circle cx={cx} cy={cy} r={innerRadius} fill="#0B0F1A" stroke="#334155" strokeWidth="1" />
                
                {/* Ascendant Marker */}
                <path d={`M ${cx - outerRadius - 10} ${cy} L ${cx - innerRadius} ${cy}`} stroke="#F5A623" strokeWidth="2" />
                <text x={cx - outerRadius - 25} y={cy} fill="#F5A623" fontSize="12" fontWeight="bold" dominantBaseline="middle">ASC</text>

                {/* 4. Natal Planets */}
                <g>
                    {chartElements.plottedPlanets.map((planet, i) => (
                        <g key={`natal-${i}`} className="cursor-pointer transition-opacity hover:opacity-80" onMouseEnter={() => setHoveredPlanet(planet)} onMouseLeave={() => setHoveredPlanet(null)}>
                            <line x1={planet.lineStart.x} y1={planet.lineStart.y} x2={planet.lineEnd.x} y2={planet.lineEnd.y} stroke={planet.color} strokeWidth="1" strokeOpacity="0.3" />
                            <circle cx={planet.x} cy={planet.y} r="12" fill="#0B0F1A" stroke={planet.color} strokeWidth="2" />
                            <text x={planet.x} y={planet.y} textAnchor="middle" dominantBaseline="central" fill={planet.color} fontSize="14">{planet.symbol}</text>
                            {planet.is_retrograde && <text x={planet.x + 8} y={planet.y - 8} fill="#EF4444" fontSize="8" fontWeight="bold">R</text>}
                        </g>
                    ))}
                </g>

                {/* 5. Transit Planets (Outer Ring) */}
                {transits && (
                    <g>
                         {/* Transit Ring Border */}
                         <circle cx={cx} cy={cy} r={transitRingRadius} fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
                         
                        {chartElements.plottedTransits.map((planet, i) => (
                            <g key={`transit-${i}`} className="cursor-pointer transition-opacity hover:opacity-80" onMouseEnter={() => setHoveredPlanet({...planet, name: `(T) ${planet.name}`})} onMouseLeave={() => setHoveredPlanet(null)}>
                                <line x1={planet.lineStart.x} y1={planet.lineStart.y} x2={planet.lineEnd.x} y2={planet.lineEnd.y} stroke={planet.color} strokeWidth="1" strokeOpacity="0.3" strokeDasharray="2 2" />
                                <circle cx={planet.x} cy={planet.y} r="10" fill="#1E293B" stroke={planet.color} strokeWidth="2" />
                                <text x={planet.x} y={planet.y} textAnchor="middle" dominantBaseline="central" fill={planet.color} fontSize="12">{planet.symbol}</text>
                                {planet.is_retrograde && <text x={planet.x + 8} y={planet.y - 8} fill="#EF4444" fontSize="8" fontWeight="bold">R</text>}
                            </g>
                        ))}
                    </g>
                )}
                
                {/* Info Display (Hover) */}
                <AnimatePresence>
                    {hoveredPlanet && (
                        <g>
                            <circle cx={cx} cy={cy} r={innerRadius * 0.9} fill="#0B0F1A" className="opacity-90" />
                            <text x={cx} y={cy - 10} textAnchor="middle" fill={hoveredPlanet.color || '#fff'} fontSize="16" fontWeight="bold">{hoveredPlanet.name}</text>
                            <text x={cx} y={cy + 10} textAnchor="middle" fill="#94A3B8" fontSize="12">{Math.floor(hoveredPlanet.longitude % 30)}° {Math.round((hoveredPlanet.longitude % 1) * 60)}'</text>
                            <text x={cx} y={cy + 25} textAnchor="middle" fill="#64748B" fontSize="10">{hoveredPlanet.zodiac_sign}</text>
                        </g>
                    )}
                </AnimatePresence>
            </svg>
        </div>
    );
};

export default ChartWheel;
