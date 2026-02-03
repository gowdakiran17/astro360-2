import { ArrowRight } from 'lucide-react';

interface Planet {
    name: string;
    sign: string;
    house: number; // House from Moon
    isRetrograde?: boolean;
}

interface MajorTransitsProps {
    planets: Planet[];
    loading?: boolean;
    onPlanetClick?: (planetName: string) => void;
}

const SLOW_PLANETS = ['Jupiter', 'Saturn', 'Rahu', 'Ketu'];

const PLANET_COLORS: Record<string, string> = {
    Jupiter: 'text-yellow-400',
    Saturn: 'text-blue-300',
    Rahu: 'text-purple-400',
    Ketu: 'text-red-300'
};

const PLANET_THEMES: Record<string, string> = {
    Jupiter: 'Expansion & Wisdom',
    Saturn: 'Discipline & Karma',
    Rahu: 'Desire & Innovation',
    Ketu: 'Detachment & Spirituality'
};

const MajorTransits = ({ planets, loading, onPlanetClick }: MajorTransitsProps) => {

    // Filter only slow planets usually found in "Major Transits"
    const majorPlanets = planets.filter(p => SLOW_PLANETS.includes(p.name));

    // Fallback Mock Data if empty (for visual dev)
    const displayPlanets = majorPlanets.length > 0 ? majorPlanets : [
        { name: 'Jupiter', sign: 'Taurus', house: 1, isRetrograde: false },
        { name: 'Saturn', sign: 'Aquarius', house: 10, isRetrograde: true },
        { name: 'Rahu', sign: 'Pisces', house: 11, isRetrograde: false }
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-40 bg-white/5 rounded-2xl animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-serif text-white flex items-center gap-2">
                <span>🪐 Major Transits</span>
                <span className="text-slate-400 text-sm font-sans uppercase tracking-wider font-normal mt-1">(Life Themes)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayPlanets.map((planet) => (
                    <button
                        key={planet.name}
                        onClick={() => onPlanetClick?.(planet.name)}
                        className="group relative flex flex-col items-start p-5 bg-[#0A0F1E]/60 hover:bg-[#111827]/80 border border-white/5 hover:border-amber-500/30 rounded-2xl transition-all duration-300 text-left w-full backdrop-blur-sm"
                    >
                        <div className="flex justify-between items-start w-full mb-3">
                            <div className="flex items-center gap-3">
                                <span className={`text-xl font-bold ${PLANET_COLORS[planet.name] || 'text-white'}`}>
                                    {planet.name.slice(0, 2)}
                                </span>
                                <span className="text-white text-lg font-medium">{planet.name}</span>
                            </div>
                            {planet.isRetrograde && (
                                <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                                    Rx
                                </span>
                            )}
                        </div>

                        <div className="space-y-2 mb-4 w-full">
                            <div className="flex justify-between text-base">
                                <span className="text-slate-400">Sign</span>
                                <span className="text-white font-medium">{planet.sign}</span>
                            </div>
                            <div className="flex justify-between text-base">
                                <span className="text-slate-400">House</span>
                                <span className="text-amber-300 font-medium">{planet.house}th</span>
                            </div>
                        </div>

                        {/* Theme Badge */}
                        <div className="mb-4 text-sm font-medium text-slate-400 w-full truncate">
                            {PLANET_THEMES[planet.name] || 'Transit Influence'}
                        </div>

                        {/* Progress Bar (Visual Mock) */}
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-3">
                            <div
                                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 opacity-80"
                                style={{ width: `${Math.random() * 40 + 30}%` }}
                            />
                        </div>

                        <div className="text-sm text-amber-400 group-hover:text-amber-300 flex items-center gap-1 mt-auto font-bold uppercase tracking-wide">
                            Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MajorTransits;
