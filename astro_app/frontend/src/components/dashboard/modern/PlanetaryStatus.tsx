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
    'Sun': 'text-orange-400',
    'Moon': 'text-blue-400',
    'Mars': 'text-red-400',
    'Mercury': 'text-emerald-400',
    'Jupiter': 'text-yellow-400',
    'Venus': 'text-pink-400',
    'Saturn': 'text-indigo-400',
    'Rahu': 'text-slate-400',
    'Ketu': 'text-orange-400'
};

const PlanetaryStatus: React.FC<PlanetaryStatusProps> = ({ chartData }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!chartData) return null;

    const ascendant = chartData.ascendant;
    const planets = chartData.planets || [];

    // Filter for key planets (Sun, Moon, Mars, Ascendant) for the top row
    const keyPlanets = planets.filter((p: any) => ['Sun', 'Moon', 'Mars'].includes(p.name));

    // All planets for the expanded view
    const allPlanets = planets;

    return (
        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/30">
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-400" />
                    Planetary Status
                </h3>
                <div className="px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Natal Positions</span>
                </div>
            </div>

            {/* Key Planets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Ascendant Card */}
                <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-slate-500 text-[10px] uppercase tracking-wider font-bold">Ascendant</span>
                        <span className="text-indigo-400 text-lg">{ZODIAC_SYMBOLS[ascendant?.sign] || 'Lg'}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h4 className="text-white text-lg font-bold">{ascendant?.sign}</h4>
                        <span className="text-slate-500 text-xs">{ascendant?.degree?.toFixed(1)}°</span>
                    </div>
                    <p className="text-slate-500 text-xs mt-1">{ascendant?.nakshatra}</p>
                </div>

                {/* Sun, Moon, Mars Cards */}
                {keyPlanets.map((planet: any) => (
                    <div key={planet.name} className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-[10px] uppercase tracking-wider font-bold ${PLANET_COLORS[planet.name] || 'text-slate-400'}`}>{planet.name}</span>
                            <span className={`${PLANET_COLORS[planet.name] || 'text-white'} text-lg`}>{ZODIAC_SYMBOLS[planet.sign]}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h4 className="text-white text-lg font-bold">{planet.sign}</h4>
                            <span className="text-slate-500 text-xs">{planet.degree?.toFixed(1)}°</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-slate-500 text-xs">{planet.nakshatra}</p>
                            {planet.retrograde && <span className="text-[10px] text-rose-400 border border-rose-500/30 px-1 rounded">R</span>}
                        </div>
                    </div>
                ))}
            </div>

            {/* Expandable Section for All Planets */}
            <div className="border-t border-white/5 pt-4">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-center gap-2 py-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
                >
                    {isExpanded ? 'Show Less' : 'View All Planets'}
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {isExpanded && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
                        {allPlanets.slice(3).map((planet: any) => ( // Skipping first 3 (Sun, Moon, Mars often) or just rendering all?
                            // Logic above filtered specifically Sun/Moon/Mars.
                            // Let's just render ALL planets excluding the ones we already showed if we want to be deduplicative,
                            // OR just render the remaining ones.
                            // The previous UI had "All Planetary Positions" which included everything.
                            // Let's render the ones NOT in [Sun, Moon, Mars] to avoid duplication?
                            // Or just render everything in a denser grid?
                            // Let's render the REST.
                            !['Sun', 'Moon', 'Mars'].includes(planet.name) && (
                                <div key={planet.name} className="bg-slate-800/20 rounded-lg p-3 border border-slate-700/20 hover:bg-slate-800/40 transition-colors">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`text-[10px] uppercase font-bold ${PLANET_COLORS[planet.name] || 'text-slate-400'}`}>{planet.name}</span>
                                        <span className={`${PLANET_COLORS[planet.name] || 'text-white'} text-sm`}>{ZODIAC_SYMBOLS[planet.sign]}</span>
                                    </div>
                                    <p className="text-white text-sm font-bold truncate">{planet.sign}</p>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-slate-500 text-[10px] truncate max-w-[70px]">{planet.nakshatra}</span>
                                        <span className="text-slate-500 text-[10px]">{planet.degree?.toFixed(0)}°</span>
                                    </div>
                                    {planet.retrograde && <div className="mt-1 text-[10px] text-rose-400">Retrograde</div>}
                                </div>
                            )
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlanetaryStatus;
