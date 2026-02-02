import React, { useState } from 'react';
import { Globe, Zap, Users, Sparkles } from 'lucide-react';

interface AdvancedAstrologyDetailsProps {
    chartData: any;
}

const MAITRI_COLORS: Record<string, string> = {
    'Extreme Friend': 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    'Friend': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'Neutral': 'bg-slate-700/30 text-slate-400 border-slate-700/50',
    'Enemy': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    'Extreme Enemy': 'bg-pink-600/30 text-pink-300 border-pink-700/50',
    '--': 'bg-transparent text-slate-600 border-transparent'
};

const ZODIAC_SYMBOLS: Record<string, string> = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
};

const AdvancedAstrologyDetails: React.FC<AdvancedAstrologyDetailsProps> = ({ chartData }) => {
    const [activeSection, setActiveSection] = useState<'positions' | 'maitri' | 'chakra'>('positions');

    if (!chartData) return null;

    const mainPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

    const renderMaitriTable = (title: string, data: any) => (
        <div className="bg-[#0F0F16] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative mb-8">
            <div className="bg-emerald-500/5 px-8 py-5 border-b border-emerald-500/10 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-4">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <Users className="w-4 h-4 text-emerald-400" />
                    </div>
                    {title}
                </h3>
                <div className="px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Natural Archetype</span>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b border-slate-700/50">
                            <th className="p-4 font-bold text-slate-400 bg-slate-800/30">Planet</th>
                            {mainPlanets.map(p => (
                                <th key={p} className="p-4 font-bold text-slate-400 bg-slate-800/30 text-center">{p}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {mainPlanets.map(p1 => (
                            <tr key={p1} className="border-b border-slate-800/50 hover:bg-white/5 transition-colors">
                                <td className="p-4 font-bold text-white">{p1}</td>
                                {mainPlanets.map(p2 => {
                                    const status = data?.[p1]?.[p2] || 'Neutral';
                                    return (
                                        <td key={p2} className="p-2 text-center">
                                            <div className={`py-2 px-1 rounded-lg border text-[10px] whitespace-nowrap ${MAITRI_COLORS[status]}`}>
                                                {status}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderSudarshanaChakra = () => {
        if (!chartData.sudarshana_chakra) return null;
        const wheels = ['lagna_wheel', 'moon_wheel', 'sun_wheel'];
        const labels = ['Lagna', 'Moon', 'Sun'];

        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {wheels.map((wheel, idx) => (
                    <div key={wheel} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50 text-center flex flex-col items-center">
                        <div className="mb-4">
                            <h4 className="text-white font-bold">{labels[idx]} Wheel</h4>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Perspectives from {labels[idx]}</p>
                        </div>

                        {/* Sudarshana Chakra SVG Visualization */}
                        <div className="relative w-64 h-64">
                            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                                {/* Diamonds/Square Pattern */}
                                <rect x="10" y="10" width="80" height="80" fill="none" stroke="#475569" strokeWidth="0.5" />
                                <line x1="10" y1="10" x2="90" y2="90" stroke="#475569" strokeWidth="0.5" />
                                <line x1="90" y1="10" x2="10" y2="90" stroke="#475569" strokeWidth="0.5" />
                                <rect x="30" y="30" width="40" height="40" fill="none" stroke="#475569" strokeWidth="0.5" transform="rotate(45 50 50)" />

                                {chartData.sudarshana_chakra[wheel].map((_: any, i: number) => {
                                    return <React.Fragment key={i} />;
                                })}
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="grid grid-cols-3 grid-rows-3 w-4/5 h-4/5 text-[8px] font-bold">
                                    {/* Simple Diamond Chart Representation */}
                                    <div className="border border-slate-700/30 flex items-center justify-center relative">
                                        <span className="opacity-20 absolute top-1 left-1">12</span>
                                        <div className="flex flex-col text-[6px]">{chartData.sudarshana_chakra[wheel][11].planets.map((p: string) => p.slice(0, 2)).join(',')}</div>
                                    </div>
                                    <div className="border border-slate-700/30 flex items-center justify-center border-t-2 border-indigo-500/50 bg-indigo-500/5 relative">
                                        <span className="opacity-20 absolute top-1 left-1">1</span>
                                        <div className="flex flex-col text-[6px]">{chartData.sudarshana_chakra[wheel][0].planets.map((p: string) => p.slice(0, 2)).join(',')}</div>
                                    </div>
                                    <div className="border border-slate-700/30 flex items-center justify-center relative">
                                        <span className="opacity-20 absolute top-1 left-1">2</span>
                                        <div className="flex flex-col text-[6px]">{chartData.sudarshana_chakra[wheel][1].planets.map((p: string) => p.slice(0, 2)).join(',')}</div>
                                    </div>
                                    {/* Row 2 */}
                                    <div className="border border-slate-700/30 flex items-center justify-center relative">
                                        <span className="opacity-20 absolute top-1 left-1">11</span>
                                        <div className="flex flex-col text-[6px]">{chartData.sudarshana_chakra[wheel][10].planets.map((p: string) => p.slice(0, 2)).join(',')}</div>
                                    </div>
                                    <div className="flex items-center justify-center text-indigo-400 font-black text-xs">
                                        {labels[idx].charAt(0)}
                                    </div>
                                    <div className="border border-slate-700/30 flex items-center justify-center relative">
                                        <span className="opacity-20 absolute top-1 left-1">3</span>
                                        <div className="flex flex-col text-[6px]">{chartData.sudarshana_chakra[wheel][2].planets.map((p: string) => p.slice(0, 2)).join(',')}</div>
                                    </div>
                                    {/* Row 3 */}
                                    <div className="border border-slate-700/30 flex items-center justify-center relative">
                                        <span className="opacity-20 absolute top-1 left-1">10</span>
                                        <div className="flex flex-col text-[6px]">{chartData.sudarshana_chakra[wheel][9].planets.map((p: string) => p.slice(0, 2)).join(',')}</div>
                                    </div>
                                    <div className="border border-slate-700/30 flex items-center justify-center relative">
                                        <span className="opacity-20 absolute top-1 left-1">9</span>
                                        <div className="flex flex-col text-[6px]">{chartData.sudarshana_chakra[wheel][8].planets.map((p: string) => p.slice(0, 2)).join(',')}</div>
                                    </div>
                                    <div className="border border-slate-700/30 flex items-center justify-center relative">
                                        <span className="opacity-20 absolute top-1 left-1">8</span>
                                        <div className="flex flex-col text-[6px]">{chartData.sudarshana_chakra[wheel][7].planets.map((p: string) => p.slice(0, 2)).join(',')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-slate-400">
                            1st House: <span className="text-indigo-300">{chartData.sudarshana_chakra[wheel][0].sign}</span>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-8 mt-12">
            {/* Header Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-900/60 rounded-2xl border border-white/10 w-fit backdrop-blur-3xl shadow-2xl">
                {[
                    { id: 'positions', label: 'Detailed Positions', icon: Globe },
                    { id: 'maitri', label: 'Graha Maitri', icon: Users },
                    { id: 'chakra', label: 'Sudarshana Chakra', icon: Sparkles }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSection(tab.id as any)}
                        className={`flex items-center gap-3 px-8 py-4 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all ${activeSection === tab.id
                            ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20'
                            : 'text-slate-500 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Detailed Planetary Positions Table */}
            {activeSection === 'positions' && (
                <div className="bg-[#0F0F16] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
                    <div className="bg-emerald-500/5 px-8 py-5 border-b border-emerald-500/10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-emerald-500/20 rounded-lg">
                                <Zap className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white tracking-tight">Full Planetary Archetypes</h2>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Mathematical Coordinates & Analysis</p>
                            </div>
                        </div>
                        <div className="px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Scientific Precision</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-700/50 bg-slate-800/10">
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Planet</th>
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Position</th>
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Abs Deg</th>
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Rasi</th>
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Rasi Lord</th>
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Nakshatra</th>
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Nak Lord</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[chartData.ascendant, ...chartData.planets].map((p: any, idx: number) => (
                                    <tr key={idx} className="border-b border-slate-800/50 hover:bg-indigo-500/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl group-hover:scale-110 transition-transform">
                                                    {p.name === 'Ascendant' ? 'Asc' : (ZODIAC_SYMBOLS[p.sign] || '☉')}
                                                </span>
                                                <span className="font-bold text-white text-sm">{p.name || 'Ascendant'}</span>
                                                {p.retrograde && <span className="text-[8px] bg-rose-500/20 text-rose-300 px-1 rounded border border-rose-500/30">RET</span>}
                                            </div>
                                        </td>
                                        <td className="p-4 font-mono text-indigo-200 text-xs">{p.formatted_degree}</td>
                                        <td className="p-4 font-mono text-slate-500 text-xs">{p.longitude?.toFixed(2)}°</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-400">{ZODIAC_SYMBOLS[p.sign]}</span>
                                                <span className="text-white text-sm font-medium">{p.sign}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-emerald-400 text-sm font-semibold">{p.rasi_lord}</td>
                                        <td className="p-4 text-slate-300 text-sm">{p.nakshatra}</td>
                                        <td className="p-4 text-amber-400 text-sm font-semibold">{p.nakshatra_lord}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeSection === 'maitri' && chartData.maitri && (
                <div className="grid grid-cols-1 gap-2">
                    {renderMaitriTable("Naisargika Maitri (Natural)", chartData.maitri.naisargika)}
                    {renderMaitriTable("Tatkaala Maitri (Temporary)", chartData.maitri.tatkaala)}
                    {renderMaitriTable("Panchadha Maitri (Compound)", chartData.maitri.panchadha)}
                </div>
            )}

            {activeSection === 'chakra' && (
                <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Sparkles className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Sudarshana Chakra</h2>
                            <p className="text-xs text-slate-400">The Triple Wheel of Consciousness (Lagna, Moon, and Sun perspectives)</p>
                        </div>
                    </div>
                    {renderSudarshanaChakra()}
                </div>
            )}
        </div>
    );
};

export default AdvancedAstrologyDetails;
