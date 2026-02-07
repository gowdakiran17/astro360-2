import React from 'react';

interface KPHouse {
    house: number;
    longitude: number;
    sign: string;
    degree_in_sign: number;
    nakshatra: string;
    pada: number;
    star_lord: string;
    sub_lord: string;
    sub_sub_lord: string;
}

interface KPHouseTableProps {
    houses: KPHouse[];
}

const KPHouseTable: React.FC<KPHouseTableProps> = ({ houses }) => {
    const formatDegrees = (deg: number) => {
        const d = Math.floor(deg);
        const m = Math.floor((deg - d) * 60);
        const s = Math.floor(((deg - d) * 60 - m) * 60);
        return `${d}°${m}'${s}"`;
    };

    return (
        <div className="overflow-x-auto rounded-xl border border-[#FFFFFF]/08 bg-[#FFFFFF]/04 backdrop-blur-md shadow-2xl">
            <table className="w-full text-left text-sm text-[#A9B0C2]">
                <thead className="bg-[#FFFFFF]/08 text-xs font-bold uppercase text-[#6F768A] tracking-wider">
                    <tr>
                        <th className="px-4 py-4">House</th>
                        <th className="px-4 py-4">Longitude</th>
                        <th className="px-4 py-4">Sign</th>
                        <th className="px-4 py-4">Nakshatra (Pada)</th>
                        <th className="px-4 py-4">Star Lord</th>
                        <th className="px-4 py-4">Sub Lord</th>
                        <th className="px-4 py-4">Sub-Sub Lord</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#FFFFFF]/04">
                    {houses.map((h) => (
                        <tr key={h.house} className="hover:bg-[#FFFFFF]/06 transition-colors">
                            <td className="px-4 py-3.5 font-bold text-[#EDEFF5]">House {h.house}</td>
                            <td className="px-4 py-3.5 font-mono text-[#A9B0C2]">{formatDegrees(h.degree_in_sign)}</td>
                            <td className="px-4 py-3.5 text-[#EDEFF5]">{h.sign}</td>
                            <td className="px-4 py-3.5 text-[#A9B0C2]">{h.nakshatra} <span className="text-[#6F768A]">({h.pada})</span></td>
                            <td className="px-4 py-3.5 text-[#F5A623] font-medium">{h.star_lord}</td>
                            <td className="px-4 py-3.5 text-[#6D5DF6] font-medium">{h.sub_lord}</td>
                            <td className="px-4 py-3.5 text-[#2ED573] font-medium">{h.sub_sub_lord}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default KPHouseTable;
