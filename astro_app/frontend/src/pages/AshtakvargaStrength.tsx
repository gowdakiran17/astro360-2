import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import MainLayout from '../components/layout/MainLayout';
import {
    BarChart2, Info, RefreshCw, Shield, AlertTriangle, Star, Target, Layout, Table
} from 'lucide-react';
import AIReportButton from '../components/ai/AIReportButton';
import { useChartSettings } from '../context/ChartContext';

const AshtakvargaStrength = () => {
    const { currentProfile } = useChartSettings();
    // const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [avData, setAvData] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'charts' | 'table' | 'detailed'>('charts');
    const [viewMode, setViewMode] = useState<'house' | 'sign'>('house');
    const [selectedPrastarakaPlanet, setSelectedPrastarakaPlanet] = useState<string>('Sun');

    useEffect(() => {
        if (currentProfile) {
            fetchAshtakvarga();
        }
    }, [currentProfile]);

    const fetchAshtakvarga = async () => {
        if (!currentProfile) return;

        setLoading(true);
        setError('');

        try {
            const payload = {
                birth_details: {
                    date: currentProfile.date,
                    time: currentProfile.time,
                    timezone: currentProfile.timezone,
                    latitude: currentProfile.latitude,
                    longitude: currentProfile.longitude
                }
            };
            const response = await api.post('chart/ashtakvarga', payload);
            setAvData(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to calculate Ashtakvarga strength.');
        } finally {
            setLoading(false);
        }
    };

    const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

    const getStrengthLabel = (points: number) => {
        if (points >= 30) return { label: 'Excellent', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
        if (points >= 25) return { label: 'Good', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
        if (points >= 20) return { label: 'Average', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
        return { label: 'Weak', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
    };

    const getHeatmapColor = (points: number) => {
        if (points >= 6) return 'bg-emerald-500/20 text-emerald-300';
        if (points >= 4) return 'bg-indigo-500/10 text-slate-300';
        return 'bg-rose-500/10 text-rose-300';
    };

    // Custom Simple Bar Chart Component
    const BarChart = ({ data, height = 150, showLabels = true, highlightIdx = -1 }: { data: number[], height?: number, showLabels?: boolean, highlightIdx?: number }) => {
        const max = Math.max(...data, 1);
        return (
            <div className="flex items-end justify-between w-full h-full gap-1 group" style={{ minHeight: height }}>
                {data.map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <div
                            className={`w-full rounded-t-sm transition-all duration-300 relative group/bar ${i === highlightIdx ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-white/10 hover:bg-indigo-400/50 opacity-90 hover:opacity-100'}`}
                            style={{ height: `${(val / max) * 85}%` }}
                        >
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none z-10 border border-white/10 backdrop-blur-md">
                                {val} pts
                            </div>
                        </div>
                        {showLabels && (
                            <span className="text-[10px] text-slate-500 font-medium">{i + 1}</span>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const getRotatedData = (data: number[]) => {
        if (viewMode === 'sign' || typeof avData?.ascendant_sign_idx === 'undefined') return data;
        const ascIdx = avData.ascendant_sign_idx;
        // Rotate: Start from Ascendant Index
        return [...data.slice(ascIdx), ...data.slice(0, ascIdx)];
    };

    const signsShort = ["Ar", "Ta", "Ge", "Cn", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"];

    const getBestPlanet = () => {
        if (!avData || !avData.bavs) return null;
        let maxAvg = 0;
        let bestPlanet = '';

        planets.forEach(planet => {
            const points = avData.bavs[planet];
            if (points) {
                const total = points.reduce((a: number, b: number) => a + b, 0);
                const avg = total / 12;
                if (avg > maxAvg) {
                    maxAvg = avg;
                    bestPlanet = planet;
                }
            }
        });

        return { planet: bestPlanet, avg: maxAvg };
    };

    const bestPlanetData = avData ? getBestPlanet() : null;

    return (
        <MainLayout title="Ashtakvarga Strength" breadcrumbs={['Calculations', 'Ashtakvarga']}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center glass-card p-4 gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
                            <BarChart2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-100">Ashtakvarga Strength (Natal)</h1>
                            <p className="text-sm text-slate-400">Inherent strength analysis based on your Birth Chart</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 w-full md:w-auto">
                        {avData && (
                            <AIReportButton
                                buttonText="AI Strength Report"
                                context={`Ashtakvarga Strength Analysis for Chart: ${currentProfile?.name}`}
                                data={avData}
                                className="mr-2"
                            />
                        )}
                        <button
                            onClick={() => currentProfile && fetchAshtakvarga()}
                            className="p-2 text-slate-400 hover:text-indigo-400 rounded-lg bg-white/5 border border-white/5 active:scale-95 transition-all"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {error && <div className="bg-rose-500/10 text-rose-400 p-4 rounded-xl border border-rose-500/20 animate-pulse">{error}</div>}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                        <p className="text-slate-400 animate-pulse font-medium">Computing planetary algorithms...</p>
                    </div>
                ) : avData ? (
                    <div className="space-y-6">
                        <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 flex gap-3">
                            <Info className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                            <p className="text-sm text-slate-300">
                                <strong className="text-indigo-400">Note:</strong> These scores represent your permanent <strong className="text-slate-100">Natal Strength</strong> based on your birth chart.
                                For daily fluctuating scores based on current planetary transits, check the Home Dashboard.
                            </p>
                        </div>

                        {/* Intro Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="glass-card p-5">
                                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-3">
                                    <Shield className="w-4 h-4" />
                                    <span>Strongest Houses</span>
                                </div>
                                <div className="space-y-2">
                                    {avData.strongest_houses.map((h: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-center text-sm">
                                            <span className="text-slate-400 font-medium">House {h.house_idx}</span>
                                            <div className="flex items-center space-x-2">
                                                <span className="font-bold text-slate-100">{h.points}</span>
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getStrengthLabel(h.points).color}`}>
                                                    {getStrengthLabel(h.points).label}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="glass-card p-5">
                                <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-3">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span>Weakest Houses</span>
                                </div>
                                <div className="space-y-2">
                                    {avData.weakest_houses.map((h: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-center text-sm">
                                            <span className="text-slate-400 font-medium">House {h.house_idx}</span>
                                            <div className="flex items-center space-x-2">
                                                <span className="font-bold text-slate-100">{h.points}</span>
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getStrengthLabel(h.points).color}`}>
                                                    {getStrengthLabel(h.points).label}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="glass-card p-5">
                                <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-3">
                                    <Star className="w-4 h-4" />
                                    <span>Best Planet</span>
                                </div>
                                <div className="flex flex-col space-y-2 mt-4">
                                    <div className="text-2xl font-bold text-slate-100">{bestPlanetData?.planet || '-'}</div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs text-slate-400 font-medium">Avg Points:</span>
                                        <span className="text-xs font-bold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">
                                            {bestPlanetData?.avg.toFixed(1) || '0.0'} / house
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card p-5">
                                <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-3">
                                    <Target className="w-4 h-4" />
                                    <span>Areas of Focus</span>
                                </div>
                                <div className="text-xs text-slate-400 leading-relaxed mt-2 font-medium">
                                    House {avData.weakest_houses[0].house_idx} points are low, indicating potential need for extra care in related life departments.
                                </div>
                                <div className="mt-3 flex items-center space-x-2 text-amber-200 bg-amber-500/10 p-2 rounded border border-amber-500/20 font-bold text-[10px] uppercase">
                                    House {avData.weakest_houses[0].house_idx} Weak
                                </div>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="glass-card overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-100">Total House Strengths (Sarvashtakvarga)</h2>
                                    <p className="text-xs text-slate-400 font-medium">Combined planetary strength for each house</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                                    <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                                        <button
                                            onClick={() => setViewMode('house')}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'house' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                                        >
                                            By House
                                        </button>
                                        <button
                                            onClick={() => setViewMode('sign')}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'sign' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                                        >
                                            By Sign
                                        </button>
                                    </div>
                                    <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                                        <button
                                            onClick={() => setActiveTab('charts')}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'charts' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                                        >
                                            <Layout className="w-3 h-3 inline mr-1" /> Visuals
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('table')}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'table' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                                        >
                                            <Table className="w-3 h-3 inline mr-1" /> Table
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('detailed')}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'detailed' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                                        >
                                            <Layout className="w-3 h-3 inline mr-1" /> Detailed
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                {activeTab === 'detailed' ? (
                                    <div className="space-y-6">
                                        {/* Planet Selector */}
                                        <div className="flex flex-wrap items-center gap-2 mb-6 bg-white/5 p-3 rounded-xl border border-white/10">
                                            <span className="text-sm font-bold text-slate-300 mr-2">Select Planet:</span>
                                            {planets.map(planet => (
                                                <button
                                                    key={planet}
                                                    onClick={() => setSelectedPrastarakaPlanet(planet)}
                                                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${selectedPrastarakaPlanet === planet
                                                            ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]'
                                                            : 'bg-white/5 text-slate-400 border border-white/5 hover:border-indigo-500/50 hover:text-indigo-400'
                                                        }`}
                                                >
                                                    {planet}
                                                </button>
                                            ))}
                                        </div>

                                        {avData?.prastarakas && avData.prastarakas[selectedPrastarakaPlanet] ? (
                                            <div className="overflow-x-auto border border-white/5 rounded-xl bg-white/5">
                                                <table className="w-full text-xs text-center border-collapse">
                                                    <thead>
                                                        <tr className="bg-white/5 text-slate-400">
                                                            <th className="p-3 border-b border-r border-white/5 text-left font-bold w-32 uppercase tracking-widest text-[10px] text-slate-500">Donor \ {viewMode === 'house' ? 'House' : 'Sign'}</th>
                                                            {Array.from({ length: 12 }).map((_, i) => (
                                                                <th key={i} className="p-3 border-b border-white/5 font-bold min-w-[40px] text-slate-100">
                                                                    {viewMode === 'house' ? `H${i + 1}` : signsShort[i]}
                                                                </th>
                                                            ))}
                                                            <th className="p-3 border-b border-l border-white/5 font-bold bg-white/10 text-indigo-400 uppercase text-[10px]">Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-transparent">
                                                        {["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Lagna"].map((donor) => {
                                                            const rowData = getRotatedData(avData.prastarakas[selectedPrastarakaPlanet][donor] || Array(12).fill(0));
                                                            const rowTotal = rowData.reduce((a: number, b: number) => a + b, 0);

                                                            return (
                                                                <tr key={donor} className="hover:bg-white/5 transition-colors border-b border-white/5">
                                                                    <td className="p-3 border-r border-white/5 text-left font-bold text-slate-300">
                                                                        {donor}
                                                                    </td>
                                                                    {rowData.map((val: number, idx: number) => (
                                                                        <td key={idx} className="p-3 border-white/5">
                                                                            {val === 1 ? (
                                                                                <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></span>
                                                                            ) : (
                                                                                <span className="text-slate-800">·</span>
                                                                            )}
                                                                        </td>
                                                                    ))}
                                                                    <td className="p-3 border-l border-white/5 font-bold text-slate-100 bg-white/5">
                                                                        {rowTotal}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                        {/* Footer Totals */}
                                                        <tr className="bg-indigo-900/40 font-bold">
                                                            <td className="p-3 border-r border-indigo-500/20 text-left text-indigo-300 uppercase text-[10px] tracking-widest">Total (BAV)</td>
                                                            {Array.from({ length: 12 }).map((_, colIdx) => {
                                                                // Calculate column sum dynamically from displayed rows
                                                                const colSum = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Lagna"].reduce((sum, donor) => {
                                                                    const rowData = getRotatedData(avData.prastarakas[selectedPrastarakaPlanet][donor] || Array(12).fill(0));
                                                                    return sum + rowData[colIdx];
                                                                }, 0);

                                                                return (
                                                                    <td key={colIdx} className="p-3 text-indigo-300">
                                                                        {colSum}
                                                                    </td>
                                                                );
                                                            })}
                                                            <td className="p-3 border-l border-indigo-500/20 text-white text-base">
                                                                {/* Grand Total */}
                                                                {avData.bavs[selectedPrastarakaPlanet]?.reduce((a: number, b: number) => a + b, 0)}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="p-12 text-center text-slate-500 bg-white/5 rounded-xl border border-dashed border-white/10">
                                                No detailed data available for this planet.
                                            </div>
                                        )}

                                        <div className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/20 text-xs text-blue-300">
                                            <p><strong className="text-blue-400 uppercase tracking-widest text-[10px] mr-2">Prastaraka Table:</strong> This detailed view shows exactly which "Donor" planet contributes a positive point (Bindu) to the selected planet's score in each sign/house.</p>
                                        </div>
                                    </div>
                                ) : activeTab === 'charts' ? (
                                    <div className="space-y-8">
                                        <div className="w-full max-w-4xl mx-auto pt-8 pb-4 bg-white/5 rounded-2xl border border-white/5 px-8">
                                            <div className="h-[250px] w-full">
                                                <BarChart data={getRotatedData(avData.sav)} height={220} />
                                            </div>
                                            <div className="mt-8 flex flex-col md:flex-row justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 gap-4 text-center">
                                                <div className="flex-1">
                                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Strongest</div>
                                                    <div className="text-xl font-bold text-slate-100">House {avData.strongest_houses[0].house_idx}</div>
                                                </div>
                                                <div className="hidden md:block w-px h-10 bg-white/10"></div>
                                                <div className="flex-1">
                                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Weakest</div>
                                                    <div className="text-xl font-bold text-slate-100">House {avData.weakest_houses[0].house_idx}</div>
                                                </div>
                                                <div className="hidden md:block w-px h-10 bg-white/10"></div>
                                                <div className="flex-1">
                                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Average</div>
                                                    <div className="text-xl font-bold text-slate-100">{avData.average_points.toFixed(1)}</div>
                                                </div>
                                                <div className="hidden md:block w-px h-10 bg-white/10"></div>
                                                <div className="flex-1">
                                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Points</div>
                                                    <div className="text-xl font-bold text-indigo-400">{avData.total_points}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
                                            {planets.map(p_name => (
                                                <div key={p_name} className="glass-card p-4 border-white/5 hover:border-indigo-500/30 transition-all group">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <span className="text-sm font-bold text-slate-200 group-hover:text-indigo-400 transition-colors uppercase tracking-widest text-[10px]">{p_name}</span>
                                                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">BAV</span>
                                                    </div>
                                                    <div className="h-[120px] w-full">
                                                        <BarChart data={getRotatedData(avData.bavs[p_name])} showLabels={false} height={110} />
                                                    </div>
                                                    <div className="mt-3 flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                                                        <span>Max: {Math.max(...avData.bavs[p_name])}</span>
                                                        <span className="text-indigo-400/80">Total: {avData.bavs[p_name].reduce((a: number, b: number) => a + b, 0)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
                                        <table className="w-full text-sm text-left border-collapse">
                                            <thead>
                                                <tr className="bg-white/10 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                                                    <th className="px-4 py-4 sticky left-0 bg-slate-900 border-r border-white/10 z-20">Planet</th>
                                                    {[...Array(12)].map((_, i) => (
                                                        <th key={i}
                                                            className="px-3 py-4 text-center border-r border-white/5"
                                                            title={viewMode === 'house' && avData?.ascendant_sign_idx !== undefined ? signsShort[(avData.ascendant_sign_idx + i) % 12] : ''}
                                                        >
                                                            {viewMode === 'house' ? `H${i + 1}` : signsShort[i]}
                                                        </th>
                                                    ))}
                                                    <th className="px-4 py-4 text-center bg-white/10">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-slate-400">
                                                {planets.map(p_name => (
                                                    <tr key={p_name} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                        <td
                                                            className="px-4 py-4 font-bold text-slate-300 sticky left-0 bg-slate-900 border-r border-white/10 z-20 cursor-pointer hover:text-indigo-400 group"
                                                            onClick={() => {
                                                                setSelectedPrastarakaPlanet(p_name);
                                                                setActiveTab('detailed');
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span>{p_name.substring(0, 2)}</span>
                                                                <Table className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            </div>
                                                        </td>
                                                        {getRotatedData(avData.bavs[p_name]).map((val: number, i: number) => (
                                                            <td key={i} className={`px-2 py-4 text-center font-bold border-r border-white/5 ${getHeatmapColor(val)}`}>
                                                                {val}
                                                            </td>
                                                        ))}
                                                        <td className="px-4 py-4 text-center font-bold text-slate-100 bg-white/5">
                                                            {avData.bavs[p_name].reduce((a: number, b: number) => a + b, 0)}
                                                        </td>
                                                    </tr>
                                                ))}
                                                <tr className="bg-indigo-600/20 text-indigo-100 font-bold">
                                                    <td className="px-4 py-5 sticky left-0 bg-indigo-950 border-r border-indigo-500/20 z-20 uppercase tracking-widest text-xs">SAV Total</td>
                                                    {getRotatedData(avData.sav).map((val: number, i: number) => (
                                                        <td key={i} className="px-2 py-5 text-center border-r border-indigo-500/20">{val}</td>
                                                    ))}
                                                    <td className="px-4 py-5 text-center bg-indigo-600 shadow-inner text-xl">{avData.total_points}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className="p-4 flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                            <Info className="w-3 h-3 text-indigo-400" />
                                            <span>
                                                {viewMode === 'house'
                                                    ? "Houses are calculated relative to the Lagna (Ascendant)."
                                                    : "Showing strength by Zodiac Sign (Aries to Pisces)."}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bottom Tip Section */}
                        <div className="bg-indigo-600 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -m-8 opacity-20 group-hover:rotate-12 transition-transform duration-700">
                                <BarChart2 className="w-48 h-48" />
                            </div>
                            <div className="max-w-2xl relative z-10">
                                <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                                    <Star className="w-6 h-6 fill-white" />
                                    Ashtakvarga Interpretation Guide
                                </h3>
                                <p className="text-indigo-100 text-sm leading-relaxed mb-6 font-medium opacity-90">
                                    A house with 30 or more points is considered <span className="text-white font-bold">very strong</span>, while a house with less than 20 points may indicate challenges. Note that these are your birth chart strengths - daily transit strengths will vary.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <button className="px-6 py-2.5 bg-white text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-all shadow-lg active:scale-95">
                                        Interpretation Guide
                                    </button>
                                    <button className="px-6 py-2.5 bg-indigo-500/50 text-white rounded-xl text-sm font-bold border border-indigo-400/30 hover:bg-indigo-500/70 transition-all shadow-lg active:scale-95 backdrop-blur-md">
                                        Accurate Insights
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="glass-card p-20 text-center border-dashed">
                        <BarChart2 className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-100 mb-2">Ready for Strength Analysis</h3>
                        <p className="text-slate-400 max-w-sm mx-auto font-medium">Select a birth chart to compute planetary distributions and house strengths using the Ashtakvarga system.</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default AshtakvargaStrength;
