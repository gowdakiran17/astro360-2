import { Info, Users } from 'lucide-react';

interface PlanetaryCouncilProps {
    ishtaKashta: Record<string, { ishta: number, kashta: number }>;
    vimsopaka: Record<string, number>;
}

const PlanetaryCouncil = ({ ishtaKashta, vimsopaka }: PlanetaryCouncilProps) => {
    // Sort planets into categories
    const allies: string[] = [];
    const neutrals: string[] = [];
    const challengers: string[] = [];

    Object.keys(ishtaKashta).forEach(planet => {
        const { ishta, kashta } = ishtaKashta[planet];
        const diff = ishta - kashta;

        if (diff > 10) allies.push(planet);
        else if (diff < -10) challengers.push(planet);
        else neutrals.push(planet);
    });

    // Sort allies by Vimsopaka strength (strongest first)
    const sortByStrength = (a: string, b: string) => (vimsopaka[b] || 0) - (vimsopaka[a] || 0);

    allies.sort(sortByStrength);
    neutrals.sort(sortByStrength);
    challengers.sort(sortByStrength);

    const renderPlanet = (planet: string, type: 'ally' | 'neutral' | 'challenger') => {
        const strength = vimsopaka[planet] || 10;
        const sizeClass = strength > 15 ? 'w-12 h-12 text-base' : (strength > 10 ? 'w-11 h-11 text-sm' : 'w-10 h-10 text-xs');

        const colors = {
            ally: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300',
            neutral: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
            challenger: 'bg-rose-500/20 border-rose-500/50 text-rose-300'
        };

        return (
            <div key={planet} className="flex flex-col items-center gap-1.5 group relative cursor-pointer">
                <div
                    className={`
                    rounded-full flex items-center justify-center font-black border-2 transition-transform group-hover:scale-110 shadow-lg
                    ${sizeClass} ${colors[type]}
                `}
                >
                    {planet.slice(0, 2)}
                </div>
                <span className="text-[10px] text-slate-400 font-bold tracking-wider">{strength.toFixed(1)}</span>

                {/* Tooltip */}
                <div className="absolute bottom-full mb-3 w-40 bg-[#0F1429] border border-white/10 p-3 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 text-center">
                    <div className="font-black text-white mb-1 uppercase tracking-widest text-xs">{planet}</div>
                    <div className="text-emerald-400 text-xs font-bold">Ishta: {ishtaKashta[planet]?.ishta.toFixed(1)}</div>
                    <div className="text-rose-400 text-xs font-bold">Kashta: {ishtaKashta[planet]?.kashta.toFixed(1)}</div>
                </div>
            </div>
        );
    };

    const renderCategory = (planets: string[], label: string, badgeLabel: string, type: 'ally' | 'neutral' | 'challenger') => {
        if (planets.length === 0) return null;

        const badgeColors = {
            ally: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            neutral: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            challenger: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
        };

        return (
            <div className="space-y-4 bg-white/[0.02] rounded-2xl p-4 border border-white/5">
                <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{label}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${badgeColors[type]} font-black uppercase tracking-wider`}>
                        {badgeLabel}
                    </span>
                </div>
                <div className="flex flex-wrap gap-4 py-2 justify-center">
                    {planets.map(p => renderPlanet(p, type))}
                </div>
            </div>
        );
    };

    return (
        <div className="glass-card p-6 lg:p-8 border-white/5 bg-[#0A0E1F]/60 backdrop-blur-xl rounded-[2rem]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10">
                        <Users className="w-5 h-5 text-indigo-400" />
                    </div>
                    Planetary Council
                </h3>
                <Info className="w-5 h-5 text-slate-500 cursor-help hover:text-indigo-400 transition-colors" />
            </div>

            <div className="space-y-4">
                {renderCategory(allies, 'Generous Allies', 'Supportive', 'ally')}
                {renderCategory(neutrals, 'Neutral Observers', 'Balanced', 'neutral')}
                {renderCategory(challengers, 'Strict Teachers', 'Obstruction', 'challenger')}
            </div>
        </div>
    );
};

export default PlanetaryCouncil;
