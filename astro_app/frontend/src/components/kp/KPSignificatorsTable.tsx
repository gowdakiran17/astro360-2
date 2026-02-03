import React from 'react';

interface KPSignificatorsProps {
    significators: {
        planets: Record<string, number[]>;
        houses: Record<string, string[]>;
    };
}

const KPSignificatorsTable: React.FC<KPSignificatorsProps> = ({ significators }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Planetary Significators */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4">Planetary Significators</h3>
                <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
                    <table className="w-full text-left text-sm text-slate-200">
                        <thead className="bg-white/10 text-xs font-bold uppercase text-white/50 tracking-wider">
                            <tr>
                                <th className="px-4 py-4">Planet</th>
                                <th className="px-4 py-4">Signifying Houses</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {Object.entries(significators.planets).map(([planet, houses]) => (
                                <tr key={planet} className="hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-3.5 font-bold text-white">{planet}</td>
                                    <td className="px-4 py-3.5">
                                        <div className="flex flex-wrap gap-1">
                                            {houses.map((house) => (
                                                <span key={house} className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 rounded-md text-xs border border-indigo-500/30 font-medium">
                                                    {house}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* House Significators */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4">House Significators</h3>
                <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
                    <table className="w-full text-left text-sm text-slate-200">
                        <thead className="bg-white/10 text-xs font-bold uppercase text-white/50 tracking-wider">
                            <tr>
                                <th className="px-4 py-4">House</th>
                                <th className="px-4 py-4">Signifying Planets</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {Object.entries(significators.houses).map(([house, planets]) => (
                                <tr key={house} className="hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-3.5 font-bold text-white">House {house}</td>
                                    <td className="px-4 py-3.5">
                                        <div className="flex flex-wrap gap-1">
                                            {planets.map((planet) => (
                                                <span key={planet} className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-md text-xs border border-emerald-500/30 font-medium">
                                                    {planet}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default KPSignificatorsTable;
