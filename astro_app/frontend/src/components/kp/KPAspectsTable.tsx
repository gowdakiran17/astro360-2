
import React from 'react';

interface KPAspectsTableProps {
    data: {
        planet_aspects: Record<string, number[]>;
        house_aspects: Record<string, string[]>;
        mutual_aspects: Record<string, string[]>;
    };
}

const KPAspectsTable: React.FC<KPAspectsTableProps> = ({ data }) => {
    if (!data) return null;

    const Wrapper = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl mb-8">
            <div className="bg-amber-500/20 px-6 py-4 border-b border-white/10">
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
        <th className="px-6 py-3 bg-[#523A1E] text-amber-100/90 font-bold border-b border-white/10 whitespace-nowrap">
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
            {/* Planet Aspects */}
            <Wrapper title="Planet Aspects">
                <thead>
                    <tr>
                        <Th>Planet</Th>
                        <Th>Aspecting Houses</Th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(data.planet_aspects).map(([planet, houses]) => (
                        <tr key={planet} className="hover:bg-white/5">
                            <Td isFirst>{planet}</Td>
                            <Td>{houses.join(', ')}</Td>
                        </tr>
                    ))}
                </tbody>
            </Wrapper>

            {/* House Aspects */}
            <Wrapper title="House Aspects">
                <thead>
                    <tr>
                        <Th>House</Th>
                        <Th>Aspecting Planets</Th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(data.house_aspects).map(([house, planets]) => (
                        <tr key={house} className="hover:bg-white/5">
                            <Td isFirst>{house}</Td>
                            <Td>{planets.length > 0 ? planets.join(', ') : '-'}</Td>
                        </tr>
                    ))}
                </tbody>
            </Wrapper>

            {/* Mutual Aspects */}
            <Wrapper title="Aspects between planets">
                <thead>
                    <tr>
                        <Th>Planet</Th>
                        <Th>Aspecting Planets</Th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(data.mutual_aspects).map(([planet, aspecting]) => (
                        <tr key={planet} className="hover:bg-white/5">
                            <Td isFirst>{planet}</Td>
                            <Td>{aspecting.length > 0 ? aspecting.join(', ') : '-'}</Td>
                        </tr>
                    ))}
                </tbody>
            </Wrapper>
        </div>
    );
};

export default KPAspectsTable;
