import React from 'react';

interface KPPlanet {
    planet: string;
    longitude: number;
    sign: string;
    degree_in_sign: number;
    nakshatra: string;
    pada: number;
    star_lord: string;
    sub_lord: string;
    sub_sub_lord: string;
}

interface KPPlanetTableProps {
    planets: KPPlanet[];
}

const KPPlanetTable: React.FC<KPPlanetTableProps> = ({ planets }) => {
    const formatDegrees = (deg: number) => {
        const d = Math.floor(deg);
        const m = Math.floor((deg - d) * 60);
        const s = Math.floor(((deg - d) * 60 - m) * 60);
        return `${d}°${m}'${s}"`;
    };

    return (
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
            <table className="w-full text-left text-sm text-slate-200">
                <thead className="bg-white/10 text-xs font-bold uppercase text-white/50 tracking-wider">
                    <tr>
                        <th className="px-4 py-4">Planet</th>
                        <th className="px-4 py-4">Longitude</th>
                        <th className="px-4 py-4">Sign</th>
                        <th className="px-4 py-4">Nakshatra (Pada)</th>
                        <th className="px-4 py-4">Star Lord</th>
                        <th className="px-4 py-4">Sub Lord</th>
                        <th className="px-4 py-4">Sub-Sub Lord</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {planets.map((p) => (
                        <tr key={p.planet} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3.5 font-bold text-white">{p.planet}</td>
                            <td className="px-4 py-3.5 font-mono text-white/70">{formatDegrees(p.degree_in_sign)}</td>
                            <td className="px-4 py-3.5 text-white/90">{p.sign}</td>
                            <td className="px-4 py-3.5 text-white/70">{p.nakshatra} <span className="text-white/40">({p.pada})</span></td>
                            <td className="px-4 py-3.5 text-amber-400 font-medium">{p.star_lord}</td>
                            <td className="px-4 py-3.5 text-indigo-400 font-medium">{p.sub_lord}</td>
                            <td className="px-4 py-3.5 text-emerald-400 font-medium">{p.sub_sub_lord}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default KPPlanetTable;
