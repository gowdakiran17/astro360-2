import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Planet {
    name: string;
    sign: string;
    house: number;
    isRetrograde?: boolean;
}

interface FastTransitsProps {
    planets: Planet[];
    loading?: boolean;
    onPlanetClick?: (planetName: string) => void;
}

const FAST_PLANETS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'];

const FastTransitsStrip = ({ planets, loading, onPlanetClick }: FastTransitsProps) => {
    const scrollContainer = useRef<HTMLDivElement>(null);

    const fastPlanets = planets.filter(p => FAST_PLANETS.includes(p.name));
    // Fallback if empty
    const displayPlanets = fastPlanets.length > 0 ? fastPlanets : [
        { name: 'Sun', sign: 'Aquarius', house: 10 },
        { name: 'Moon', sign: 'Leo', house: 3 },
        { name: 'Mercury', sign: 'Capricorn', house: 9, isRetrograde: true },
        { name: 'Venus', sign: 'Pisces', house: 11 },
        { name: 'Mars', sign: 'Cancer', house: 2 }
    ];

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainer.current) {
            const scrollAmount = 200;
            scrollContainer.current.scrollBy({
                left: direction === 'right' ? scrollAmount : -scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (loading) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-serif text-white flex items-center gap-2">
                    <span>🌟 Fast Transits</span>
                    <span className="text-slate-400 text-sm font-sans uppercase tracking-wider font-normal mt-1">(Daily Movers)</span>
                </h3>

                <div className="flex gap-2">
                    <button onClick={() => scroll('left')} className="p-1 hover:bg-white/10 rounded-full text-slate-400 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={() => scroll('right')} className="p-1 hover:bg-white/10 rounded-full text-slate-400 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollContainer}
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x"
            >
                {displayPlanets.map((planet) => (
                    <button
                        key={planet.name}
                        onClick={() => onPlanetClick?.(planet.name)}
                        className="text-left flex-shrink-0 w-48 bg-[#0A0F1E]/60 border border-white/5 rounded-xl p-4 snap-start relative overflow-hidden group hover:border-amber-500/30 transition-colors backdrop-blur-sm"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <span className="font-bold text-lg text-white">{planet.name}</span>
                            {planet.isRetrograde && (
                                <span className="text-xs bg-red-500/20 text-red-300 px-1.5 rounded font-bold">Rx</span>
                            )}
                        </div>

                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-3xl font-serif text-amber-300">{planet.sign}</span>
                        </div>

                        <div className="text-sm text-slate-400 font-medium">
                            {planet.house}th House
                        </div>

                        {/* Status Dot */}
                        <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FastTransitsStrip;
