
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
        <div className="overflow-x-auto rounded-xl border border-[#FFFFFF]/08 bg-[#FFFFFF]/04 backdrop-blur-md shadow-2xl">
            <div className="bg-[#F5A623]/20 px-6 py-4 border-b border-[#FFFFFF]/08">
                <h3 className="text-lg font-bold text-[#F5A623] text-center">
                    Strength of planets on various aspects (KP Analysis)
                </h3>
            </div>
            <table className="w-full text-center text-sm text-[#A9B0C2]">
                <thead className="bg-[#FFFFFF]/08 text-xs font-bold uppercase text-[#A9B0C2] tracking-wider">
                    <tr>
                        <th className="px-4 py-4 text-left bg-[#F5A623]/10 text-[#EDEFF5] border-r border-[#FFFFFF]/04">Planet</th>
                        <th className="px-4 py-4 bg-[#F5A623]/10 text-[#EDEFF5] border-r border-[#FFFFFF]/04">Intelligence</th>
                        <th className="px-4 py-4 bg-[#F5A623]/10 text-[#2ED573] border-r border-[#FFFFFF]/04">Efficiency</th>
                        <th className="px-4 py-4 bg-[#F5A623]/10 text-[#6D5DF6] border-r border-[#FFFFFF]/04">Love/Family</th>
                        <th className="px-4 py-4 bg-[#F5A623]/10 text-[#E25555] border-r border-[#FFFFFF]/04">Health</th>
                        <th className="px-4 py-4 bg-[#F5A623]/10 text-[#6D5DF6] border-r border-[#FFFFFF]/04">Social Life</th>
                        <th className="px-4 py-4 bg-[#F5A623]/10 text-[#6D5DF6] border-r border-[#FFFFFF]/04">Career</th>
                        <th className="px-4 py-4 bg-[#F5A623]/10 text-[#2ED573]">Finance</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#FFFFFF]/04">
                    {planets.map((planet) => (
                        <tr key={planet} className="hover:bg-[#FFFFFF]/06 transition-colors">
                            <td className="px-4 py-3.5 font-bold text-[#EDEFF5] text-left border-r border-[#FFFFFF]/04 bg-[#FFFFFF]/04">{planet}</td>
                            {aspects.map(aspect => (
                                <td key={aspect} className="px-2 py-3.5 border-r border-[#FFFFFF]/04 font-mono">
                                    {data[planet]?.[aspect] ?? '-'}
                                </td>
                            ))}
                        </tr>
                    ))}
                    {/* Total Score Row */}
                    <tr className="bg-[#FFFFFF]/08 font-bold border-t-2 border-[#FFFFFF]/10">
                        <td className="px-4 py-4 text-left text-[#F5A623]">Total Score</td>
                        {aspects.map(aspect => (
                            <td key={aspect} className={`px-2 py-4 font-mono ${columnTotals[aspect] > 0 ? 'text-[#2ED573]' : 'text-[#A9B0C2]'}`}>
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
