import { useState, useEffect } from 'react';
import api from '../services/api';
import MainLayout from '../components/layout/MainLayout';
import {
    Info, Activity, RefreshCw, TrendingUp, Shield, Star, Target, Home
} from 'lucide-react';
import AIReportButton from '../components/ai/AIReportButton';
import { useChartSettings } from '../context/ChartContext';
// import { AnimatePresence, motion } from 'framer-motion';

const ShadbalaEnergy = () => {
    // const navigate = useNavigate();
    const { currentProfile, settings } = useChartSettings();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [shadbalaData, setShadbalaData] = useState<any>(null);
    const [bhavaData, setBhavaData] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'visuals' | 'table'>('visuals');

    useEffect(() => {
        if (currentProfile) {
            fetchShadbala(currentProfile);
        }
    }, [currentProfile, settings]);

    const fetchShadbala = async (profile: any) => {
        setLoading(true);
        setError('');

        try {
            const payload = {
                birth_details: {
                    date: profile.date,
                    time: profile.time,
                    timezone: profile.timezone,
                    latitude: profile.latitude,
                    longitude: profile.longitude,
                    settings: settings
                }
            };
            const response = await api.post('chart/shadbala', payload);

            // Handle both old and new response structures
            if (response.data.shadbala) {
                setShadbalaData(response.data.shadbala);
                setBhavaData(response.data.bhava_bala || []);
            } else {
                setShadbalaData(response.data);
                setBhavaData([]);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to calculate Shadbala strength.');
        } finally {
            setLoading(false);
        }
    };

    const fonts: { [key: string]: string } = {
        Sun: "text-amber-600",
        Moon: "text-slate-400",
        Mars: "text-rose-600",
        Mercury: "text-emerald-600",
        Jupiter: "text-yellow-600",
        Venus: "text-pink-500",
        Saturn: "text-indigo-600",
        Rahu: "text-purple-600",
        Ketu: "text-violet-600"
    };

    const getPlanetFont = (name: string) => {
        return fonts[name] || "text-slate-100";
    };

    // Custom Radar Chart (Spider Chart)
    const RadarChart = ({ components, planetName, size = 180 }: { components: any, planetName: string, size?: number }) => {
        const keys = ["Sthana", "Dig", "Kaala", "Cheshta", "Naisargika", "Drik"];
        const labels = ["Position", "Direction", "Time", "Motion", "Natural", "Aspect"];
        const center = size / 2;
        const radius = size * 0.35;
        const pointCount = keys.length;
        const maxVal = 60; // Max expected value for normalization

        const getPoints = () => {
            return keys.map((key, i) => {
                const angle = (Math.PI * 2 / pointCount) * i - Math.PI / 2;
                const value = Math.min(components[key], maxVal);
                const factor = (value / maxVal) * radius;
                const x = center + Math.cos(angle) * factor;
                const y = center + Math.sin(angle) * factor;
                return `${x},${y}`;
            }).join(' ');
        };

        const gridLines = [0.25, 0.5, 0.75, 1].map(scale => {
            return keys.map((_, i) => {
                const angle = (Math.PI * 2 / pointCount) * i - Math.PI / 2;
                const x = center + Math.cos(angle) * radius * scale;
                const y = center + Math.sin(angle) * radius * scale;
                return `${x},${y}`;
            }).join(' ');
        });

        return (
            <div className="flex flex-col items-center group/radar">
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
                    {/* Grid Background */}
                    {gridLines.map((points, i) => (
                        <polygon key={i} points={points} className="fill-none stroke-white/10" strokeWidth="1" />
                    ))}

                    {/* Axes */}
                    {keys.map((_, i) => {
                        const angle = (Math.PI * 2 / pointCount) * i - Math.PI / 2;
                        const x = center + Math.cos(angle) * radius;
                        const y = center + Math.sin(angle) * radius;
                        return (
                            <line key={i} x1={center} y1={center} x2={x} y2={y} className="stroke-white/5" strokeWidth="1" />
                        );
                    })}

                    {/* Data Polygon */}
                    <polygon
                        points={getPoints()}
                        className={`fill-indigo-500/20 stroke-indigo-400 transition-all duration-700 group-hover/radar:fill-indigo-500/30 group-hover/radar:stroke-indigo-300`}
                        strokeWidth="2"
                        style={{ filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.3))' }}
                    />

                    {/* Labels */}
                    {labels.map((label, i) => {
                        const angle = (Math.PI * 2 / pointCount) * i - Math.PI / 2;
                        const x = center + Math.cos(angle) * (radius + 20);
                        const y = center + Math.sin(angle) * (radius + 20);
                        return (
                            <text
                                key={i}
                                x={x}
                                y={y}
                                className="text-[9px] fill-slate-500 font-bold uppercase tracking-tighter"
                                textAnchor="middle"
                                alignmentBaseline="middle"
                            >
                                {label}
                            </text>
                        );
                    })}
                </svg>
                <div className={`mt-4 font-black tracking-widest text-xs ${getPlanetFont(planetName).replace('-600', '-400').replace('-500', '-400')}`}>{planetName.toUpperCase()}</div>
            </div>
        );
    };

    return (
        <MainLayout title="Shadbala Energy" breadcrumbs={['Calculations', 'Shadbala']}>
            <div className="space-y-6 pb-20 px-4 md:px-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center glass-card p-6 gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-100">Shadbala Energy</h1>
                            <p className="text-sm text-slate-400 font-medium">Six sources of planetary strength analysis</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 w-full md:w-auto">
                        {shadbalaData && (
                            <AIReportButton
                                buttonText="AI Energy Analysis"
                                context={`Shadbala Energy Analysis for ${currentProfile?.name}`}
                                data={{ shadbala: shadbalaData, bhava: bhavaData }}
                                className="mr-2"
                            />
                        )}
                        <button
                            onClick={() => currentProfile && fetchShadbala(currentProfile)}
                            className="p-2.5 text-slate-400 hover:text-indigo-400 rounded-xl bg-white/5 border border-white/5 active:scale-95 transition-all"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {error && <div className="bg-rose-500/10 text-rose-400 p-4 rounded-xl border border-rose-500/20 font-medium">{error}</div>}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                        <p className="text-slate-400 animate-pulse font-medium">Calculating 6-fold planetary potencies...</p>
                    </div>
                ) : shadbalaData ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Top Analysis Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass-card p-6 flex items-center space-x-4">
                                <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                    <TrendingUp className="w-8 h-8" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Strongest Planet</div>
                                    <div className={`text-2xl font-black ${getPlanetFont(shadbalaData.summary.strongest).replace('-600', '-400').replace('-500', '-400')}`}>
                                        {shadbalaData.summary.strongest}
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card p-6 flex items-center space-x-4">
                                <div className="p-4 bg-rose-500/10 text-rose-400 rounded-full border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
                                    <Shield className="w-8 h-8" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Weakest Planet</div>
                                    <div className={`text-2xl font-black ${getPlanetFont(shadbalaData.summary.weakest).replace('-600', '-400').replace('-500', '-400')}`}>
                                        {shadbalaData.summary.weakest}
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card p-6 flex items-center space-x-4">
                                <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                                    <Star className="w-8 h-8" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Average Strength</div>
                                    <div className="text-2xl font-black text-slate-100">
                                        {(shadbalaData.planets.reduce((acc: number, p: any) => acc + p.percentage, 0) / shadbalaData.planets.length).toFixed(1)}%
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Total Strength Chart */}
                        <div className="glass-card overflow-hidden">
                            <div className="px-8 py-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-100">Total Shadbala Strength</h2>
                                    <p className="text-sm text-slate-400 font-medium">Comparison of current strength vs standard requirement</p>
                                </div>
                                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                                    <button
                                        onClick={() => setActiveTab('visuals')}
                                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'visuals' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300 shadow-none'}`}
                                    >
                                        Visual Signatures
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('table')}
                                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'table' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300 shadow-none'}`}
                                    >
                                        Detailed Table
                                    </button>
                                </div>
                            </div>

                            <div className="p-8">
                                {activeTab === 'visuals' ? (
                                    <div className="space-y-12">
                                        {/* Main Bar Comparison Chart */}
                                        <div className="grid grid-cols-7 gap-4 h-[300px] items-end pb-8 relative pt-4">
                                            {/* Grid Horizontal Lines */}
                                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-50">
                                                {[100, 75, 50, 25, 0].map(val => (
                                                    <div key={val} className="w-full border-t border-white/5 flex items-center">
                                                        <span className="text-[8px] text-slate-600 -ml-8 w-6 text-right pr-1 font-bold">{val}%</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {shadbalaData.planets.map((p: any) => (
                                                <div key={p.name} className="flex flex-col items-center justify-end h-full group relative z-10">
                                                    <div
                                                        className={`w-full max-w-[48px] rounded-t-lg transition-all duration-1000 relative group/bar mb-3 ${p.percentage >= 100 ? 'bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'bg-slate-700'}`}
                                                        style={{ height: `${Math.min(p.percentage, 120) * 0.8}%` }}
                                                    >
                                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 bg-slate-900 border border-white/10 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-2xl transition-all whitespace-nowrap z-20">
                                                            {p.total_rupas} / {p.requirement_rupas} Rupas
                                                        </div>
                                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/bar:opacity-100 transition-all rounded-t-lg"></div>
                                                    </div>
                                                    <div className={`text-xs font-black ${getPlanetFont(p.name).replace('-600', '-400').replace('-500', '-400')}`}>{p.name.substring(0, 3).toUpperCase()}</div>
                                                    <div className="text-[10px] text-slate-500 font-bold tabular-nums mt-0.5">{p.percentage}%</div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Radar Charts Grid */}
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em] mb-12 text-center flex items-center justify-center space-x-3">
                                                <div className="h-px w-8 bg-white/10" />
                                                <span>Planetary Energy Signatures</span>
                                                <div className="h-px w-8 bg-white/10" />
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 py-4">
                                                {shadbalaData.planets.map((p: any) => (
                                                    <RadarChart key={p.name} components={p.components} planetName={p.name} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto rounded-xl border border-white/5">
                                        <table className="w-full text-sm border-collapse">
                                            <thead>
                                                <tr className="bg-white/5 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                                    <th className="px-6 py-5 text-left border-b border-white/5">Planet</th>
                                                    <th className="px-4 py-5 text-center border-b border-white/5">Position</th>
                                                    <th className="px-4 py-5 text-center border-b border-white/5">Direction</th>
                                                    <th className="px-4 py-5 text-center border-b border-white/5">Time</th>
                                                    <th className="px-4 py-5 text-center border-b border-white/5">Motion</th>
                                                    <th className="px-4 py-5 text-center border-b border-white/5">Natural</th>
                                                    <th className="px-4 py-5 text-center border-b border-white/5">Aspect</th>
                                                    <th className="px-4 py-5 text-center border-b border-white/5 bg-indigo-500/10 text-indigo-400">Total (R)</th>
                                                    <th className="px-4 py-5 text-center border-b border-white/5">Required</th>
                                                    <th className="px-6 py-5 text-right border-b border-white/5">Net Strength</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {shadbalaData.planets.map((p: any) => (
                                                    <tr key={p.name} className="hover:bg-white/5 transition-colors group">
                                                        <td className="px-6 py-4 font-bold text-slate-200 flex items-center space-x-3">
                                                            <div className={`w-2 h-2 rounded-full ${getPlanetFont(p.name).replace('text-', 'bg-').replace('-600', '-400').replace('-500', '-400')}`}></div>
                                                            <span>{p.name}</span>
                                                        </td>
                                                        <td className="px-4 py-4 text-center text-slate-400 font-medium tabular-nums">{p.components.Sthana}</td>
                                                        <td className="px-4 py-4 text-center text-slate-400 font-medium tabular-nums">{p.components.Dig}</td>
                                                        <td className="px-4 py-4 text-center text-slate-400 font-medium tabular-nums">{p.components.Kaala}</td>
                                                        <td className="px-4 py-4 text-center text-slate-400 font-medium tabular-nums">{p.components.Cheshta}</td>
                                                        <td className="px-4 py-4 text-center text-slate-400 font-medium tabular-nums">{p.components.Naisargika}</td>
                                                        <td className="px-4 py-4 text-center text-slate-400 font-medium tabular-nums">{p.components.Drik}</td>
                                                        <td className="px-4 py-4 text-center font-black text-indigo-400 bg-indigo-500/5 tabular-nums">{p.total_rupas}</td>
                                                        <td className="px-4 py-4 text-center text-slate-500 font-bold tabular-nums">{p.requirement_rupas}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col items-end">
                                                                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden max-w-[100px] border border-white/5">
                                                                    <div
                                                                        className={`h-full rounded-full transition-all duration-1000 ${p.percentage >= 100 ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : p.percentage >= 80 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                                                        style={{ width: `${Math.min(p.percentage, 100)}%` }}
                                                                    ></div>
                                                                </div>
                                                                <span className="text-[10px] font-black mt-1 text-slate-200 tabular-nums">{p.percentage}%</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>


                        {/* Bhava Bala (House Strength) Section */}
                        {bhavaData.length > 0 && (
                            <div className="glass-card overflow-hidden">
                                <div className="px-8 py-6 border-b border-white/5 flex items-center gap-4">
                                    <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                                        <Home className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-100">Bhava Bala</h2>
                                        <p className="text-sm text-slate-400 font-medium">House strength analysis (Mean ~8 Rupas)</p>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="overflow-x-auto">
                                        <div className="min-w-[700px] h-[300px] flex items-end justify-between gap-4 px-4 relative">
                                            {/* Horizontal Mean Line */}
                                            <div className="absolute left-0 right-0 h-px border-t border-dashed border-white/10 z-0 bottom-[120px]" />
                                            <div className="absolute left-0 bottom-[124px] text-[8px] font-bold text-slate-600 uppercase tracking-widest pl-4">Mean Requirement (8.0R)</div>

                                            {bhavaData.map((house: any) => {
                                                const strength = house.score || house.strength || 0;
                                                const heightPct = Math.min((strength / 12) * 100, 100);
                                                const isStrong = strength > 8;
                                                return (
                                                    <div key={house.house} className="flex-1 flex flex-col items-center gap-4 group cursor-pointer relative z-10">
                                                        <div className="relative w-full flex justify-center">
                                                            <div
                                                                className={`w-full max-w-[40px] rounded-t-xl transition-all duration-700 ${isStrong ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.2)]' : 'bg-slate-700'}/60 group-hover:brightness-125`}
                                                                style={{ height: `${heightPct * 2}px` }}
                                                            >
                                                                <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-white text-[10px] font-bold px-2 py-1.5 rounded-lg shadow-2xl transition-all whitespace-nowrap z-20">
                                                                    {strength.toFixed(1)} Rupas
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-center">
                                                            <div className="text-[10px] font-black text-slate-100">H{house.house}</div>
                                                            <div className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter tabular-nums">{strength.toFixed(1)}R</div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Interpretation Guide */}
                        <div className="glass-card bg-slate-900/60 p-8 text-white overflow-hidden shadow-2xl relative border-white/10">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] scale-[2.5] rotate-12 pointer-events-none">
                                <Activity className="w-64 h-64 text-indigo-400" />
                            </div>
                            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <div>
                                    <h3 className="text-xl font-bold mb-8 flex items-center space-x-4">
                                        <div className="p-2 bg-indigo-500/20 rounded-xl">
                                            <Info className="w-6 h-6 text-indigo-400" />
                                        </div>
                                        <span>Understanding Shadbala</span>
                                    </h3>
                                    <div className="space-y-8 text-slate-400 text-sm font-medium leading-relaxed">
                                        <div className="flex gap-4">
                                            <div className="w-1 h-auto bg-indigo-500/30 rounded-full shrink-0" />
                                            <p>
                                                <strong className="text-slate-100 block mb-1">Positional (Sthana) Strength</strong>
                                                Derived from planet's sign placement, exaltation, and varga positions. Indicates the solid foundation of a planet's essential power.
                                            </p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-1 h-auto bg-indigo-500/30 rounded-full shrink-0" />
                                            <p>
                                                <strong className="text-slate-100 block mb-1">Directional (Dig) Strength</strong>
                                                Planets gain specific power when located in cardinal angles (Houses 1, 4, 7, 10). Represents the correct alignment and orientation of life energy.
                                            </p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-1 h-auto bg-indigo-500/30 rounded-full shrink-0" />
                                            <p>
                                                <strong className="text-slate-100 block mb-1">Temporal (Kaala) Strength</strong>
                                                Calculated based on the astronomical time of birth and lunar cycle. Represents the dynamic availability and timing of a planet's force.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-indigo-500/30 transition-all group">
                                        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                            <Star className="w-4 h-4" />
                                            Core Astrological Insight
                                        </h4>
                                        <p className="text-slate-300 text-sm italic leading-loose mb-8">
                                            "Shadbala reveals a planet's raw potential to deliver its promise. A planet might be well-placed in the Rashi chart, but without sufficient Shadbala, its results may be inconsistent, subtle, or manifest only under pressure."
                                        </p>
                                        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex items-center space-x-3 text-indigo-400 font-black uppercase tracking-widest text-[10px]">
                                                <Target className="w-4 h-4 shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
                                                <span>Remedial Priority Planet: {shadbalaData.summary.weakest}</span>
                                            </div>
                                            <div className="px-3 py-1 bg-rose-500/10 text-rose-400 text-[10px] font-bold rounded-lg border border-rose-500/20">LOW ENERGY</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="glass-card p-24 text-center border-dashed">
                        <Activity className="w-16 h-16 text-slate-700 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-bold text-slate-200 mb-2">Shadbala Analysis Ready</h3>
                        <p className="text-slate-400 max-w-sm mx-auto font-medium">Select a birth chart to unlock advanced 6-fold planetary energy calculations and radar signature analysis.</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default ShadbalaEnergy;
