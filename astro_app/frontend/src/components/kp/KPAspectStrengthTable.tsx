
import React from 'react';

interface KPAspectStrengthTableProps {
    data: Record<string, Record<string, number>>;
}

const KPAspectStrengthTable: React.FC<KPAspectStrengthTableProps> = ({ data }) => {
    if (!data) return null;

    const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
    const aspects = ["Intelligence", "Efficiency", "Love/Family", "Health", "Social Life", "Career", "Finance"];

    // Calculate columns totals (Average)
    const columnTotals: Record<string, number> = {};
    aspects.forEach(aspect => {
        let total = 0;
        let count = 0;
        planets.forEach(planet => {
            const val = data[planet]?.[aspect];
            if (val !== undefined) {
                total += val;
                count++;
            }
        });
        // Average
        columnTotals[aspect] = count > 0 ? Math.round(total / count) : 0;
    });

    return (
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
            <div className="bg-amber-500/20 px-6 py-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-amber-200 text-center">
                    Strength of planets on various aspects (KP Analysis)
                </h3>
            </div>
            <table className="w-full text-center text-sm text-slate-200">
                <thead className="bg-white/10 text-xs font-bold uppercase text-white/70 tracking-wider">
                    <tr>
                        <th className="px-4 py-4 text-left bg-[#523A1E] text-amber-100/90 border-r border-white/5">Planet</th>
                        <th className="px-4 py-4 bg-[#52441E] text-amber-100/90 border-r border-white/5">Intelligence</th>
                        <th className="px-4 py-4 bg-[#52441E] text-green-100/90 border-r border-white/5">Efficiency</th>
                        <th className="px-4 py-4 bg-[#52441E] text-pink-100/90 border-r border-white/5">Love/Family</th>
                        <th className="px-4 py-4 bg-[#52441E] text-red-100/90 border-r border-white/5">Health</th>
                        <th className="px-4 py-4 bg-[#52441E] text-blue-100/90 border-r border-white/5">Social Life</th>
                        <th className="px-4 py-4 bg-[#52441E] text-purple-100/90 border-r border-white/5">Career</th>
                        <th className="px-4 py-4 bg-[#52441E] text-emerald-100/90">Finance</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {planets.map((planet) => (
                        <tr key={planet} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3.5 font-bold text-white text-left border-r border-white/5 bg-white/5">{planet}</td>
                            {aspects.map(aspect => (
                                <td key={aspect} className="px-2 py-3.5 border-r border-white/5 font-mono">
                                    {data[planet]?.[aspect] ?? '-'}
                                </td>
                            ))}
                        </tr>
                    ))}
                    {/* Total Score Row */}
                    <tr className="bg-white/10 font-bold border-t-2 border-white/20">
                        <td className="px-4 py-4 text-left text-amber-300">Total Score</td>
                        {aspects.map(aspect => (
                            <td key={aspect} className={`px-2 py-4 font-mono ${columnTotals[aspect] > 0 ? 'text-green-400' : 'text-slate-300'}`}>
                                {columnTotals[aspect]}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default KPAspectStrengthTable;
