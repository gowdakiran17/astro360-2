
import React from 'react';

interface KPPlanetaryDetailsProps {
    planets: Array<any>;
    houses: Array<any>;
}

const KPPlanetaryDetails: React.FC<KPPlanetaryDetailsProps> = ({ planets, houses }) => {
    if (!planets) return null;

    const Wrapper = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl mb-8">
            <div className="bg-[#523A1E] px-6 py-4 border-b border-white/10">
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
        <th className="px-4 py-3 bg-white/10 text-amber-100/90 font-bold border-b border-r border-white/10 whitespace-nowrap last:border-r-0">
            {children}
        </th>
    );

    const Td = ({ children, isHeaderCol }: { children: React.ReactNode, isHeaderCol?: boolean }) => (
        <td className={`px-4 py-3 border-b border-r border-white/5 last:border-r-0 ${isHeaderCol ? 'font-medium text-amber-50 bg-white/5' : ''}`}>
            {children}
        </td>
    );

    // Helper to format DMS
    const formatDMS = (deg: number) => {
        const d = Math.floor(deg);
        const m = Math.floor((deg - d) * 60);
        const s = Math.floor(((deg - d) * 60 - m) * 60);
        return `${d.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Planetary Positions */}
            <Wrapper title="Planetary Positions">
                <thead>
                    <tr>
                        <Th>Planet</Th>
                        <Th>Rx/Comb</Th>
                        <Th>Sign</Th>
                        <Th>Deg/Min/Sec</Th>
                        <Th>House</Th>
                    </tr>
                </thead>
                <tbody>
                    {planets.map((p) => (
                        <tr key={p.planet} className="hover:bg-white/5">
                            <Td isHeaderCol>{p.planet}</Td>
                            <Td>{p.is_retro ? '(R)' : '-'}</Td>
                            <Td>{p.sign}</Td>
                            <Td>{formatDMS(p.degree_in_sign)}</Td>
                            <Td>{p.house}</Td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan={5} className="px-4 py-2 text-xs text-center bg-white/5 border-t border-white/10">
                            (R) = Retrograde, (C) = Combust
                        </td>
                    </tr>
                </tbody>
            </Wrapper>

            {/* Planetary Table (Extended) */}
            <Wrapper title="Planetary Table">
                <thead>
                    <tr>
                        <Th>Planet</Th>
                        <Th>Avastha</Th>
                        <Th>Nature</Th>
                        <Th>Gender</Th>
                        <Th>Element</Th>
                        <Th>Position</Th>
                    </tr>
                </thead>
                <tbody>
                    {planets.map((p) => (
                        <tr key={p.planet} className="hover:bg-white/5">
                            <Td isHeaderCol>{p.planet}</Td>
                            <Td>{p.avastha || '-'}</Td>
                            <Td>{p.nature || '-'}</Td>
                            <Td>{p.gender || '-'}</Td>
                            <Td>{p.element || '-'}</Td>
                            <Td>{p.position || '-'}</Td>
                        </tr>
                    ))}
                </tbody>
            </Wrapper>

            {/* Bhava Table */}
            <Wrapper title="Bhava Table">
                <thead>
                    <tr>
                        <Th>House</Th>
                        <Th>Sign</Th>
                        <Th>Deg/Min/Sec</Th>
                    </tr>
                </thead>
                <tbody>
                    {houses.map((h) => (
                        <tr key={h.house} className="hover:bg-white/5">
                            <Td isHeaderCol>House {h.house}</Td>
                            <Td>{h.sign}</Td>
                            <Td>{formatDMS(h.degree_in_sign)}</Td>
                        </tr>
                    ))}
                </tbody>
            </Wrapper>
        </div>
    );
};

export default KPPlanetaryDetails;
