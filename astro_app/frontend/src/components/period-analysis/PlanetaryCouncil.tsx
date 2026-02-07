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
            ally: 'bg-[#2ED573]/20 border-[#2ED573]/50 text-[#2ED573]',
            neutral: 'bg-[#6D5DF6]/20 border-[#6D5DF6]/50 text-[#6D5DF6]',
            challenger: 'bg-[#E25555]/20 border-[#E25555]/50 text-[#E25555]'
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
                <span className="text-[10px] text-[#6F768A] font-bold tracking-wider">{strength.toFixed(1)}</span>

                {/* Tooltip */}
                <div className="absolute bottom-full mb-3 w-40 bg-[#0B0F1A] border border-[#FFFFFF]/08 p-3 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 text-center">
                    <div className="font-black text-[#EDEFF5] mb-1 uppercase tracking-widest text-xs">{planet}</div>
                    <div className="text-[#2ED573] text-xs font-bold">Ishta: {ishtaKashta[planet]?.ishta.toFixed(1)}</div>
                    <div className="text-[#E25555] text-xs font-bold">Kashta: {ishtaKashta[planet]?.kashta.toFixed(1)}</div>
                </div>
            </div>
        );
    };

    const renderCategory = (planets: string[], label: string, badgeLabel: string, type: 'ally' | 'neutral' | 'challenger') => {
        if (planets.length === 0) return null;

        const badgeColors = {
            ally: 'bg-[#2ED573]/10 text-[#2ED573] border-[#2ED573]/20',
            neutral: 'bg-[#6D5DF6]/10 text-[#6D5DF6] border-[#6D5DF6]/20',
            challenger: 'bg-[#E25555]/10 text-[#E25555] border-[#E25555]/20'
        };

        return (
            <div className="space-y-4 bg-[#FFFFFF]/02 rounded-2xl p-4 border border-[#FFFFFF]/05">
                <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-black text-[#6F768A] uppercase tracking-widest">{label}</span>
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
        <div className="glass-card p-6 lg:p-8 border-[#FFFFFF]/08 bg-[#11162A]/60 backdrop-blur-xl rounded-[2rem]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-[#EDEFF5] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#6D5DF6]/10 border border-[#6D5DF6]/30 flex items-center justify-center shadow-lg shadow-[#6D5DF6]/10">
                        <Users className="w-5 h-5 text-[#6D5DF6]" />
                    </div>
                    Planetary Council
                </h3>
                <Info className="w-5 h-5 text-[#6F768A] cursor-help hover:text-[#6D5DF6] transition-colors" />
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
