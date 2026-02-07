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
                <h3 className="text-lg font-bold text-[#EDEFF5] mb-4">Planetary Significators</h3>
                <div className="overflow-x-auto rounded-xl border border-[#FFFFFF]/08 bg-[#FFFFFF]/04 backdrop-blur-md shadow-2xl">
                    <table className="w-full text-left text-sm text-[#A9B0C2]">
                        <thead className="bg-[#FFFFFF]/08 text-xs font-bold uppercase text-[#6F768A] tracking-wider">
                            <tr>
                                <th className="px-4 py-4">Planet</th>
                                <th className="px-4 py-4">Signifying Houses</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#FFFFFF]/04">
                            {Object.entries(significators.planets).map(([planet, houses]) => (
                                <tr key={planet} className="hover:bg-[#FFFFFF]/06 transition-colors">
                                    <td className="px-4 py-3.5 font-bold text-[#EDEFF5]">{planet}</td>
                                    <td className="px-4 py-3.5">
                                        <div className="flex flex-wrap gap-1">
                                            {houses.map((house) => (
                                                <span key={house} className="px-2.5 py-1 bg-[#6D5DF6]/20 text-[#6D5DF6] rounded-md text-xs border border-[#6D5DF6]/30 font-medium">
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
                <h3 className="text-lg font-bold text-[#EDEFF5] mb-4">House Significators</h3>
                <div className="overflow-x-auto rounded-xl border border-[#FFFFFF]/08 bg-[#FFFFFF]/04 backdrop-blur-md shadow-2xl">
                    <table className="w-full text-left text-sm text-[#A9B0C2]">
                        <thead className="bg-[#FFFFFF]/08 text-xs font-bold uppercase text-[#6F768A] tracking-wider">
                            <tr>
                                <th className="px-4 py-4">House</th>
                                <th className="px-4 py-4">Signifying Planets</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#FFFFFF]/04">
                            {Object.entries(significators.houses).map(([house, planets]) => (
                                <tr key={house} className="hover:bg-[#FFFFFF]/06 transition-colors">
                                    <td className="px-4 py-3.5 font-bold text-[#EDEFF5]">House {house}</td>
                                    <td className="px-4 py-3.5">
                                        <div className="flex flex-wrap gap-1">
                                            {planets.map((planet) => (
                                                <span key={planet} className="px-2.5 py-1 bg-[#2ED573]/20 text-[#2ED573] rounded-md text-xs border border-[#2ED573]/30 font-medium">
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
