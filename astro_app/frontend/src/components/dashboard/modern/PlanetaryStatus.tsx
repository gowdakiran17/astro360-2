import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Activity, AlertTriangle, Sparkles, User, Zap } from 'lucide-react';

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
    'Moon': 'text-amber-200',
    'Mars': 'text-red-500',
    'Mercury': 'text-emerald-500',
    'Jupiter': 'text-yellow-500',
    'Venus': 'text-pink-500',
    'Saturn': 'text-indigo-400',
    'Rahu': 'text-stone-400',
    'Ketu': 'text-orange-600',
    'Uranus': 'text-cyan-400',
    'Neptune': 'text-blue-500',
    'Pluto': 'text-slate-500'
};

const PlanetaryStatus: React.FC<PlanetaryStatusProps> = ({ chartData }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!chartData) return null;

    const ascendant = chartData.ascendant;
    const planets = chartData.planets || [];
    const avasthas = chartData.avasthas || {};
    const specialDegrees = chartData.special_degrees || { mrtyu_bhaga: [], pushkara_navamsa: [] };

    // Helper to check special degrees
    const getSpecialStatus = (planetName: string) => {
        const isMB = specialDegrees.mrtyu_bhaga?.some((p: any) => p.planet === planetName);
        const isPushkara = specialDegrees.pushkara_navamsa?.some((p: any) => p.planet === planetName);
        return { isMB, isPushkara };
    };

    // Key planets for top view
    const keyPlanets = planets.filter((p: any) => ['Sun', 'Moon', 'Mars', 'Jupiter', 'Saturn'].includes(p.name));
    // Other planets
    const otherPlanets = planets.filter((p: any) => !['Sun', 'Moon', 'Mars', 'Jupiter', 'Saturn'].includes(p.name));

    const PlanetCard = ({ name, sign, degree, nakshatra, retrograde, isAscendant = false }: any) => {
        const { isMB, isPushkara } = getSpecialStatus(name);
        const avastha = avasthas[name];

        return (
            <div className={`group relative p-4 rounded-xl border transition-all duration-300 ${
                isAscendant 
                    ? 'bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10' 
                    : isMB 
                        ? 'bg-red-950/20 border-red-900/30 hover:bg-red-900/20'
                        : 'bg-stone-950 border-stone-800 hover:border-stone-700 hover:bg-stone-900'
            }`}>
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${isAscendant ? 'bg-amber-400' : PLANET_COLORS[name]?.replace('text-', 'bg-') || 'bg-stone-400'}`} />
                        <span className={`text-sm font-semibold tracking-wide ${isAscendant ? 'text-amber-100' : 'text-stone-200'}`}>
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
                        <h4 className="text-base font-medium text-stone-300 group-hover:text-white transition-colors">{sign}</h4>
                        <span className="text-xs text-stone-500 font-mono">{degree?.toFixed(2)}°</span>
                    </div>
                    <div className="flex items-center gap-1.5 pt-1 border-t border-stone-800/50">
                        <p className="text-xs text-stone-500 font-medium truncate group-hover:text-stone-400 transition-colors">
                            {nakshatra}
                        </p>
                    </div>

                    {/* Extended Details (Avasthas & Special Degrees) */}
                    {(avastha || isMB || isPushkara) && (
                        <div className="pt-2 mt-2 border-t border-white/5 space-y-1">
                            {avastha && (
                                <div className="flex justify-between items-center text-[10px] text-stone-400">
                                    <div className="flex items-center gap-1" title="Baladi Avastha (State of Maturity)">
                                        <User className="w-3 h-3 text-stone-600" />
                                        <span>{avastha.baladi?.split(' ')[0]}</span>
                                    </div>
                                    <div className="flex items-center gap-1" title="Jagradadi Avastha (State of Consciousness)">
                                        <Zap className="w-3 h-3 text-stone-600" />
                                        <span>{avastha.jagradadi?.split(' ')[0]}</span>
                                    </div>
                                </div>
                            )}
                            
                            <div className="flex gap-2 mt-1">
                                {isMB && (
                                    <div className="flex items-center gap-1 text-[9px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20" title="Mrtyu Bhaga (Fatal Degree)">
                                        <AlertTriangle className="w-3 h-3" /> MB
                                    </div>
                                )}
                                {isPushkara && (
                                    <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20" title="Pushkara Navamsa (Nourishing Degree)">
                                        <Sparkles className="w-3 h-3" /> Pushkara
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-stone-200 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-amber-500" />
                    Planetary Positions
                </h3>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors font-medium"
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
