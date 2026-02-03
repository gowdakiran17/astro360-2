
import React from 'react';

interface KPStrengthTableProps {
    data: {
        graha_strength: Array<{
            planet: string;
            description: string;
            strength_percent: number;
            result: string;
        }>;
        bhava_strength: Array<{
            house: number;
            name: string;
            points: number;
            result: string;
        }>;
    };
}

const KPStrengthTable: React.FC<KPStrengthTableProps> = ({ data }) => {
    if (!data) return null;

    const Wrapper = ({ title, bgClass, children }: { title: string, bgClass?: string, children: React.ReactNode }) => (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl mb-8">
            <div className={`px-6 py-4 border-b border-white/10 ${bgClass || 'bg-amber-500/20'}`}>
                <h3 className="text-lg font-bold text-amber-200">{title}</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-200">
                    {children}
                </table>
            </div>
        </div>
    );

    const Th = ({ children }: { children: React.ReactNode }) => (
        <th className="px-6 py-3 bg-white/10 text-white/70 font-bold border-b border-white/10 whitespace-nowrap">
            {children}
        </th>
    );

    const Td = ({ children, isFirst }: { children: React.ReactNode, isFirst?: boolean }) => (
        <td className={`px-6 py-3 border-b border-white/5 ${isFirst ? 'font-medium text-amber-50 bg-white/5' : ''}`}>
            {children}
        </td>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Planetary Strength */}
            <Wrapper title="Planetary Strength" bgClass="bg-[#523A1E]">
                <thead>
                    <tr>
                        <Th>Planet</Th>
                        <Th>Strength</Th>
                    </tr>
                </thead>
                <tbody>
                    {data.graha_strength.map((item, idx) => (
                        <tr key={idx} className="hover:bg-white/5">
                            <Td isFirst>
                                <div className="flex flex-col">
                                    <span className="font-bold">{item.planet}</span>
                                    <span className="text-xs text-white/50">{item.description}</span>
                                </div>
                            </Td>
                            <Td>{item.strength_percent}%</Td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan={2} className="px-6 py-4 text-xs text-amber-100/70 bg-amber-900/20 italic">
                            Note: A score of 50% or above is expected to yield favorable results.
                        </td>
                    </tr>
                </tbody>
            </Wrapper>

            {/* House Strength */}
            <Wrapper title="House Strength" bgClass="bg-[#523A1E]">
                <thead>
                    <tr>
                        <Th>House</Th>
                        <Th>Points</Th>
                        <Th>Result</Th>
                    </tr>
                </thead>
                <tbody>
                    {data.bhava_strength.map((item, idx) => (
                        <tr key={idx} className="hover:bg-white/5">
                            <Td isFirst>{item.name}</Td>
                            <Td>{item.points}</Td>
                            <Td>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${item.result === 'Good' ? 'bg-green-500/20 text-green-300' :
                                        item.result === 'Demands Attention' ? 'bg-red-500/20 text-red-300' :
                                            'bg-blue-500/20 text-blue-300'
                                    }`}>
                                    {item.result}
                                </span>
                            </Td>
                        </tr>
                    ))}
                </tbody>
            </Wrapper>
        </div>
    );
};

export default KPStrengthTable;
