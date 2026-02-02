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
    'Moon': 'text-white',
    'Mars': 'text-red-400',
    'Mercury': 'text-emerald-400',
    'Jupiter': 'text-yellow-400',
    'Venus': 'text-pink-400',
    'Saturn': 'text-indigo-400',
    'Rahu': 'text-white',
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
        <div className="relative overflow-hidden rounded-[2.5rem] bg-white/[0.08] border border-white/[0.15] shadow-2xl backdrop-blur-md p-6 md:p-10 group">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-yellow-500/[0.05] to-transparent pointer-events-none" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-8 gap-4 border-b border-white/[0.08] relative z-10">
                <h3 className="text-sm font-black text-white flex items-center gap-4 uppercase tracking-[0.3em]">
                    <Activity className="w-5 h-5 text-yellow-400 animate-pulse" />
                    Planetary Resonance
                </h3>
                <div className="relative bg-gradient-to-br from-yellow-900/40 via-orange-900/30 to-transparent rounded-[2rem] p-6 md:p-8 border border-yellow-500/20 shadow-xl backdrop-blur-sm">
                    <span className="text-sm font-black text-yellow-400 uppercase tracking-[0.3em]">Natal Alignment</span>
                </div>
            </div>

            {/* Key Planets Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Ascendant Card */}
                <div className="bg-white/[0.06] rounded-[2rem] p-6 md:p-8 border border-white/[0.12] hover:bg-white/[0.09] transition-all duration-500 group/card relative overflow-hidden shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/[0.07] to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-white text-sm uppercase tracking-[0.2em] font-black">Ascendant</span>
                            <span className="text-yellow-400 text-2xl font-extrabold drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">{ZODIAC_SYMBOLS[ascendant?.sign] || 'Lg'}</span>
                        </div>
                        <div className="flex flex-col md:flex-row items-baseline gap-1 md:gap-3">
                            <h4 className="text-white text-xl md:text-2xl font-black tracking-tighter uppercase">{ascendant?.sign}</h4>
                            <span className="text-white text-sm font-black uppercase tracking-widest">{ascendant?.degree?.toFixed(1)}°</span>
                        </div>
                        <p className="text-yellow-300 text-sm mt-3 font-black tracking-[0.1em] uppercase italic">{ascendant?.nakshatra}</p>
                    </div>
                </div>

                {/* Sun, Moon, Mars Cards */}
                {keyPlanets.map((planet: any) => (
                    <div key={planet.name} className="bg-white/[0.03] rounded-[2rem] p-5 border border-white/[0.08] hover:bg-white/[0.06] transition-all duration-500 group/card relative overflow-hidden shadow-xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.07] to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`text-sm uppercase tracking-[0.2em] font-black ${PLANET_COLORS[planet.name] || 'text-white'}`}>{planet.name}</span>
                                <span className={`${PLANET_COLORS[planet.name] || 'text-white'} text-2xl font-extrabold drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]`}>{ZODIAC_SYMBOLS[planet.sign]}</span>
                            </div>
                            <div className="flex flex-col md:flex-row items-baseline gap-1 md:gap-3">
                                <h4 className="text-white text-xl md:text-2xl font-black tracking-tighter uppercase">{planet.sign}</h4>
                                <span className="text-white text-sm font-black uppercase tracking-widest">{planet.degree?.toFixed(1)}°</span>
                            </div>
                            <div className="flex items-center gap-3 mt-3">
                                <p className="text-yellow-300 text-sm font-black tracking-[0.1em] uppercase italic">{planet.nakshatra}</p>
                                {planet.retrograde && <span className="text-sm font-black text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-lg bg-rose-500/10">R</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Expandable Section for All Planets */}
            <div className="border-t border-white/10 mt-4 pt-6">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-center gap-4 py-4 px-6 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all duration-500 text-white hover:text-white text-sm font-black uppercase tracking-[0.3em] active:scale-[0.98] group/expand"
                >
                    <span>{isExpanded ? 'Compress Planetary Array' : 'Expand Cellular Array'}</span>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-yellow-500 transition-transform" /> : <ChevronDown className="w-5 h-5 text-yellow-500 group-hover/expand:translate-y-0.5 transition-transform" />}
                </button>

                {isExpanded && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8 animate-in fade-in slide-in-from-top-6 duration-500 p-1">
                        {allPlanets.slice(3).map((planet: any) => (
                            !['Sun', 'Moon', 'Mars'].includes(planet.name) && (
                                <div key={planet.name} className="bg-white/[0.03] rounded-3xl p-6 border border-white/[0.08] hover:bg-white/[0.06] transition-all duration-500 group/subcard shadow-lg relative overflow-hidden">
                                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent opacity-0 group-hover/subcard:opacity-100 transition-opacity" />
                                    <div className="flex justify-between items-center mb-4">
                                        <span className={`text-sm uppercase font-black tracking-[0.2em] ${PLANET_COLORS[planet.name] || 'text-white'}`}>{planet.name}</span>
                                        <span className={`${PLANET_COLORS[planet.name] || 'text-white'} text-lg drop-shadow-sm`}>{ZODIAC_SYMBOLS[planet.sign]}</span>
                                    </div>
                                    <p className="text-white text-lg font-black tracking-tight uppercase mb-3 truncate">{planet.sign}</p>
                                    <div className="flex justify-between items-center mt-auto">
                                        <span className="text-yellow-300 text-sm font-bold uppercase tracking-tight italic truncate max-w-[90px]">{planet.nakshatra}</span>
                                        <span className="text-white text-base font-black uppercase">{planet.degree?.toFixed(0)}°</span>
                                    </div>
                                    {planet.retrograde && <div className="mt-4 text-sm font-black uppercase text-rose-400/90 tracking-[0.2em] bg-rose-500/10 px-3 py-1 rounded-lg w-fit">Retrograde</div>}
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
