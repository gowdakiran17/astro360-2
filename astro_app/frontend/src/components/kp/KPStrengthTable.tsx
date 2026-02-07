
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
        <div className="overflow-hidden rounded-xl border border-[#FFFFFF]/08 bg-[#FFFFFF]/04 backdrop-blur-md shadow-2xl mb-8">
            <div className={`px-6 py-4 border-b border-[#FFFFFF]/08 ${bgClass || 'bg-[#F5A623]/20'}`}>
                <h3 className="text-lg font-bold text-[#F5A623]">{title}</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[#A9B0C2]">
                    {children}
                </table>
            </div>
        </div>
    );

    const Th = ({ children }: { children: React.ReactNode }) => (
        <th className="px-6 py-3 bg-[#FFFFFF]/08 text-[#EDEFF5] font-bold border-b border-[#FFFFFF]/08 whitespace-nowrap">
            {children}
        </th>
    );

    const Td = ({ children, isFirst }: { children: React.ReactNode, isFirst?: boolean }) => (
        <td className={`px-6 py-3 border-b border-[#FFFFFF]/04 ${isFirst ? 'font-medium text-[#EDEFF5] bg-[#FFFFFF]/04' : ''}`}>
            {children}
        </td>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Planetary Strength */}
            <Wrapper title="Planetary Strength" bgClass="bg-[#F5A623]/20">
                <thead>
                    <tr>
                        <Th>Planet</Th>
                        <Th>Strength</Th>
                    </tr>
                </thead>
                <tbody>
                    {data.graha_strength.map((item, idx) => (
                        <tr key={idx} className="hover:bg-[#FFFFFF]/06">
                            <Td isFirst>
                                <div className="flex flex-col">
                                    <span className="font-bold">{item.planet}</span>
                                    <span className="text-xs text-[#6F768A]">{item.description}</span>
                                </div>
                            </Td>
                            <Td>{item.strength_percent}%</Td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan={2} className="px-6 py-4 text-xs text-[#A9B0C2] bg-[#F5A623]/10 italic">
                            Note: A score of 50% or above is expected to yield favorable results.
                        </td>
                    </tr>
                </tbody>
            </Wrapper>

            {/* House Strength */}
            <Wrapper title="House Strength" bgClass="bg-[#F5A623]/20">
                <thead>
                    <tr>
                        <Th>House</Th>
                        <Th>Points</Th>
                        <Th>Result</Th>
                    </tr>
                </thead>
                <tbody>
                    {data.bhava_strength.map((item, idx) => (
                        <tr key={idx} className="hover:bg-[#FFFFFF]/06">
                            <Td isFirst>{item.name}</Td>
                            <Td>{item.points}</Td>
                            <Td>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${item.result === 'Good' ? 'bg-[#2ED573]/20 text-[#2ED573]' :
                                        item.result === 'Demands Attention' ? 'bg-[#E25555]/20 text-[#E25555]' :
                                            'bg-[#6D5DF6]/20 text-[#6D5DF6]'
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
