import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Activity } from 'lucide-react';

interface PlanetaryStatusProps {
    chartData: any;
}

const ZODIAC_SYMBOLS: Record<string, string> = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
};

const PLANET_COLORS: Record<string, string> = {
    'Sun': 'text-amber-500',
    'Moon': 'text-blue-200',
    'Mars': 'text-red-500',
    'Mercury': 'text-emerald-500',
    'Jupiter': 'text-yellow-500',
    'Venus': 'text-pink-500',
    'Saturn': 'text-indigo-400',
    'Rahu': 'text-slate-400',
    'Ketu': 'text-orange-600'
};

const PlanetaryStatus: React.FC<PlanetaryStatusProps> = ({ chartData }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!chartData) return null;

    const ascendant = chartData.ascendant;
    const planets = chartData.planets || [];

    // Key planets for top view
    const keyPlanets = planets.filter((p: any) => ['Sun', 'Moon', 'Mars', 'Jupiter', 'Saturn'].includes(p.name));
    // Other planets
    const otherPlanets = planets.filter((p: any) => !['Sun', 'Moon', 'Mars', 'Jupiter', 'Saturn'].includes(p.name));

    const PlanetCard = ({ name, sign, degree, nakshatra, retrograde, isAscendant = false }: any) => (
        <div className={`group relative p-4 rounded-xl border transition-all duration-300 ${
            isAscendant 
                ? 'bg-blue-500/5 border-blue-500/20 hover:bg-blue-500/10' 
                : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
        }`}>
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isAscendant ? 'bg-blue-400' : PLANET_COLORS[name]?.replace('text-', 'bg-') || 'bg-slate-400'}`} />
                    <span className={`text-sm font-semibold tracking-wide ${isAscendant ? 'text-blue-100' : 'text-slate-200'}`}>
                        {name}
                    </span>
                    {retrograde && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 font-medium uppercase tracking-wider">
                            Rx
                        </span>
                    )}
                </div>
                <span className="text-lg opacity-60 group-hover:opacity-100 transition-opacity" role="img" aria-label={sign}>
                    {ZODIAC_SYMBOLS[sign]}
                </span>
            </div>
            
            <div className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                    <h4 className="text-base font-medium text-slate-300 group-hover:text-white transition-colors">{sign}</h4>
                    <span className="text-xs text-slate-500 font-mono">{degree?.toFixed(2)}°</span>
                </div>
                <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800/50">
                    <p className="text-xs text-slate-500 font-medium truncate group-hover:text-slate-400 transition-colors">
                        {nakshatra}
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-500" />
                    Planetary Positions
                </h3>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                    {isExpanded ? 'Show Less' : 'Show All'}
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* Ascendant is always first */}
                <PlanetCard
                    name="Ascendant"
                    sign={ascendant?.sign}
                    degree={ascendant?.degree}
                    nakshatra={ascendant?.nakshatra}
                    isAscendant={true}
                />
                
                {/* Key Planets */}
                {keyPlanets.map((planet: any) => (
                    <PlanetCard
                        key={planet.name}
                        {...planet}
                    />
                ))}

                {/* Expanded View */}
                {isExpanded && otherPlanets.map((planet: any) => (
                    <PlanetCard
                        key={planet.name}
                        {...planet}
                    />
                ))}
            </div>
        </div>
    );
};

export default PlanetaryStatus;
