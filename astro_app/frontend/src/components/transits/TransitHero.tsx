import React from 'react';
import { ArrowRight } from 'lucide-react';

interface TransitHeroProps {
    transits: any[]; // Ideally strict type, using any for flexibility during rebuild
}

const TransitHero: React.FC<TransitHeroProps> = ({ transits }) => {
    // Find the most "impactful" transit to highlight
    // Logic: Retrograde Major Planets (Saturn, Jupiter, Mars) > Sun/Moon ingress
    const majorPlanets = ['Saturn', 'Jupiter', 'Mars', 'Rahu', 'Ketu'];

    // Sort logic: 
    // 1. Major Planet Retrograde
    // 2. Major Planet
    // 3. Sun/Moon
    const sortedTransits = [...transits].sort((a, b) => {
        const aMajor = majorPlanets.includes(a.name);
        const bMajor = majorPlanets.includes(b.name);

        if (a.is_retrograde && aMajor) return -1;
        if (b.is_retrograde && bMajor) return 1;
        if (aMajor && !bMajor) return -1;
        if (!aMajor && bMajor) return 1;
        return 0;
    });

    const highlight = sortedTransits[0];

    if (!highlight) return null;

    const getPlanetColor = (planet: string) => {
        const colors: Record<string, string> = {
            Saturn: 'from-indigo-600 to-violet-900',
            Jupiter: 'from-amber-400 to-orange-600',
            Mars: 'from-red-500 to-rose-700',
            Sun: 'from-yellow-400 to-orange-500',
            Moon: 'from-slate-200 to-slate-400',
            Rahu: 'from-purple-600 to-indigo-800',
            Ketu: 'from-stone-500 to-stone-700',
            Mercury: 'from-emerald-400 to-teal-600',
            Venus: 'from-pink-400 to-rose-400',
        };
        return colors[planet] || 'from-blue-500 to-indigo-600';
    };

    return (
        <div className="relative w-full overflow-hidden rounded-[2.5rem] bg-[#0A0E1F] border border-white/5 shadow-2xl">
            {/* Dynamic Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getPlanetColor(highlight.name)} opacity-20`} />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />

            {/* Animated Orbits */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] border border-white/5 rounded-full animate-[spin_60s_linear_infinite]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full animate-[spin_40s_linear_infinite_reverse]" />

            <div className="relative z-10 p-8 flex flex-col items-center text-center space-y-6">

                {/* Header Badge */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Major Cosmic Shift</span>
                </div>

                {/* Planet Focus */}
                <div className="relative">
                    <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${getPlanetColor(highlight.name)} shadow-[0_0_50px_rgba(255,255,255,0.2)] flex items-center justify-center text-4xl font-serif text-white`}>
                        {highlight.name[0]}
                    </div>
                    {/* Retrograde Indicator */}
                    {highlight.is_retrograde && (
                        <div className="absolute -bottom-2 -right-2 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg border border-red-400">
                            RETRO
                        </div>
                    )}
                </div>

                {/* Text Details */}
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-white tracking-tight">
                        {highlight.name} in {highlight.zodiac_sign}
                    </h2>
                    <p className="text-indigo-200 font-medium max-w-xs mx-auto text-sm leading-relaxed">
                        Currently traversing the stars of <span className="text-white font-bold">{highlight.nakshatra}</span>.
                        A time for reflection and re-alignment of core values.
                    </p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
                    <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex flex-col items-center">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Degree</span>
                        <span className="text-lg font-mono text-white font-bold">{(highlight.longitude % 30).toFixed(1)}°</span>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex flex-col items-center">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Speed</span>
                        <span className="text-lg text-white font-bold">{highlight.speed > 0 ? '+' : ''}{highlight.speed.toFixed(2)}</span>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex flex-col items-center">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Status</span>
                        <span className="text-lg text-white font-bold">{highlight.is_retrograde ? 'Retro' : 'Direct'}</span>
                    </div>
                </div>

                {/* CTA */}
                <button className="w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group">
                    Analyze Impact <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default TransitHero;
