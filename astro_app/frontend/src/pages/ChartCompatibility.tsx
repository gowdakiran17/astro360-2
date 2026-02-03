'use client';

import { useState, useEffect } from 'react';
import api from '../services/api';
import MainLayout from '../components/layout/MainLayout';
import { useChartSettings } from '../context/ChartContext';
import {
    ShieldAlert, Sparkles,
    ChevronRight, CheckCircle2,
    XCircle, Activity, Info, Heart,
    Users, Briefcase, RefreshCw
} from 'lucide-react';

import UniversalChart from '../components/charts/UniversalChart';

type CompatibilityMode = 'relationship' | 'business';

const ChartCompatibility = () => {
    // const { user } = useAuth();
    const { availableProfiles, currentProfile } = useChartSettings();
    // const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [loading, setLoading] = useState(false);
    const [matchData, setMatchData] = useState<any>(null);
    const [error, setError] = useState('');
    const [mode, setMode] = useState<CompatibilityMode>('relationship');

    const [selectedBoyId, setSelectedBoyId] = useState('');
    const [selectedGirlId, setSelectedGirlId] = useState('');

    // Auto-select based on available profiles and current selection
    useEffect(() => {
        if (availableProfiles.length > 0) {
            // Try to set one of the slots to the current profile
            if (currentProfile?.raw?.id) {
                const currentId = currentProfile.raw.id;
                const currentGender = currentProfile.raw.gender?.toLowerCase();

                if (currentGender === 'male') {
                    setSelectedBoyId(prev => prev || currentId);
                } else if (currentGender === 'female') {
                    setSelectedGirlId(prev => prev || currentId);
                } else {
                    // Fallback or unknown gender, maybe default to Boy slot if empty?
                    if (!selectedBoyId) setSelectedBoyId(currentId);
                }
            }

            // Fill empty slots with defaults
            if (!selectedBoyId) {
                const boy = availableProfiles.find((c: any) => c.gender?.toLowerCase() === 'male' && c.id !== selectedGirlId);
                if (boy) setSelectedBoyId(boy.id);
            }
            if (!selectedGirlId) {
                const girl = availableProfiles.find((c: any) => c.gender?.toLowerCase() === 'female' && c.id !== selectedBoyId);
                if (girl) setSelectedGirlId(girl.id);
            }
        }
    }, [availableProfiles, currentProfile]); // Only run when these change

    const handleCalculate = async () => {
        if (!selectedBoyId || !selectedGirlId) {
            setError("Please select both charts to compare.");
            return;
        }

        setLoading(true);
        setError('');
        try {
            const boyChart = availableProfiles.find(c => c.id == selectedBoyId);
            const girlChart = availableProfiles.find(c => c.id == selectedGirlId);

            if (!boyChart || !girlChart) throw new Error("Chart details not found");

            const endpoint = mode === 'business' ? '/chart/business' : '/chart/compatibility';
            const response = await api.post(endpoint, {
                boy: {
                    date: boyChart.date_str,
                    time: boyChart.time_str,
                    timezone: boyChart.timezone_str,
                    latitude: boyChart.latitude,
                    longitude: boyChart.longitude
                },
                girl: {
                    date: girlChart.date_str,
                    time: girlChart.time_str,
                    timezone: girlChart.timezone_str,
                    latitude: girlChart.latitude,
                    longitude: girlChart.longitude
                }
            });
            setMatchData(response.data);
        } catch (err: any) {
            console.error("Failed to fetch compatibility", err);
            setError(err.response?.data?.detail || "Failed to calculate compatibility.");
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 25) return 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
        if (score >= 18) return 'bg-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.3)]';
        if (score >= 12) return 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]';
        return 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 25) return 'Excellent Harmony';
        if (score >= 18) return 'Good Match';
        if (score >= 12) return 'Average Alignment';
        return 'Low Compatibility';
    };

    const KootaCard = ({ data }: any) => (
        <div className="glass-card p-4 flex items-center justify-between group hover:bg-white/[0.03] transition-all">
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${data.score > 0 ? 'bg-indigo-500/10 text-indigo-400' : 'bg-rose-500/10 text-rose-400'} border border-white/5`}>
                    <Sparkles className={`w-5 h-5 ${data.score > 0 ? 'animate-pulse' : ''}`} />
                </div>
                <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{data.label}</div>
                    <div className="font-bold text-slate-100 text-sm group-hover:text-white transition-colors">{data.desc}</div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <div className="text-sm font-black text-slate-100 tabular-nums">{data.score} / {data.max}</div>
                    <div className={`text-[9px] font-black uppercase tracking-tighter ${data.score / data.max > 0.5 ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {data.score === data.max ? 'Full Points' : data.score > 0 ? 'Partial' : 'No Points'}
                    </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-100 group-hover:translate-x-0.5 transition-all" />
            </div>
        </div>
    );

    return (
        <MainLayout title="Chart Compatibility" breadcrumbs={['Relationship Tools', 'Matching']}>
            <div className="max-w-5xl mx-auto space-y-6 pb-20 px-4 md:px-0">

                {/* Header Section */}
                <div className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-900/20">
                            <Heart className="w-6 h-6 fill-white/20" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-100 tracking-tight">Compatibility Analysis</h1>
                            <p className="text-slate-400 font-medium text-xs mt-0.5">Vedic Ashtakoota Milan & Alignment</p>
                        </div>
                    </div>

                    <div className="flex bg-slate-950/50 p-1 rounded-xl border border-white/5">
                        <button
                            onClick={() => { setMode('relationship'); setMatchData(null); }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${mode === 'relationship'
                                ? 'bg-slate-800 text-white shadow-lg ring-1 ring-white/10'
                                : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <Users className="w-4 h-4" /> Relationship
                        </button>
                        <button
                            onClick={() => { setMode('business'); setMatchData(null); }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${mode === 'business'
                                ? 'bg-slate-800 text-white shadow-lg ring-1 ring-white/10'
                                : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <Briefcase className="w-4 h-4" /> Business
                        </button>
                    </div>
                </div>

                {/* Selection Card */}
                <div className="glass-card p-6 md:p-8 space-y-6">
                    <div className="bg-indigo-500/5 border border-indigo-500/10 p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
                        <div className="flex gap-4 items-start mb-6 relative z-10">
                            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                <Info className="w-4 h-4" />
                            </div>
                            <div className="text-xs font-bold text-slate-400 leading-relaxed">
                                Vedic compatibility analysis requires one male and one female chart for traditional calculations. Select your charts below to begin the analysis.
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-3">
                                <label htmlFor="male-chart-select" className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Partner A (Male)</label>
                                <select
                                    id="male-chart-select"
                                    value={selectedBoyId}
                                    onChange={(e) => setSelectedBoyId(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-sm font-black text-slate-100 focus:ring-2 focus:ring-indigo-500/50 transition-all outline-none appearance-none cursor-pointer"
                                    aria-label="Select Male Chart Profile"
                                >
                                    <option value="" className="bg-slate-900">Select Profile...</option>
                                    {availableProfiles.map(c => (
                                        <option key={c.id} value={c.id} className="bg-slate-900">{c.first_name} {c.last_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label htmlFor="female-chart-select" className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Partner B (Female)</label>
                                <select
                                    id="female-chart-select"
                                    value={selectedGirlId}
                                    onChange={(e) => setSelectedGirlId(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-sm font-black text-slate-100 focus:ring-2 focus:ring-indigo-500/50 transition-all outline-none appearance-none cursor-pointer"
                                    aria-label="Select Female Chart Profile"
                                >
                                    <option value="" className="bg-slate-900">Select Profile...</option>
                                    {availableProfiles.map(c => (
                                        <option key={c.id} value={c.id} className="bg-slate-900">{c.first_name} {c.last_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-8 relative z-10">
                            <button
                                onClick={handleCalculate}
                                disabled={loading || !selectedBoyId || !selectedGirlId}
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-indigo-900/30 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 border border-indigo-400/20"
                            >
                                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Heart className="w-5 h-5 fill-white/20" />}
                                {loading ? 'Analyzing Alignment...' : 'Calculate Compatibility'}
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-rose-600 text-sm font-bold flex items-center gap-3">
                        <ShieldAlert className="w-5 h-5" />
                        {error}
                    </div>
                )}

                {/* Match Details Section */}
                {matchData && (
                    <div className="space-y-6 pt-10 animate-slide-up">

                        {/* Charts */}
                        {matchData.boy_charts && matchData.girl_charts && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="glass-card p-6 aspect-square flex flex-col items-center justify-center relative hover:bg-white/[0.02] transition-colors">
                                    <div className="absolute top-4 left-6 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                        Male Chart
                                    </div>
                                    <div className="w-full h-full flex items-center justify-center">
                                        <UniversalChart data={matchData.boy_charts} className="w-full max-w-[320px] drop-shadow-2xl" />
                                    </div>
                                </div>
                                <div className="glass-card p-6 aspect-square flex flex-col items-center justify-center relative hover:bg-white/[0.02] transition-colors">
                                    <div className="absolute top-4 left-6 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                        Female Chart
                                    </div>
                                    <div className="w-full h-full flex items-center justify-center">
                                        <UniversalChart data={matchData.girl_charts} className="w-full max-w-[320px] drop-shadow-2xl" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Score Card */}
                        <div className="glass-card bg-slate-900/40 p-10 space-y-6 relative overflow-hidden border-t-4 border-t-indigo-500/50 shadow-2xl">
                            <div className="absolute top-0 right-0 p-10 opacity-[0.03] transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
                                <Sparkles className="w-48 h-48" />
                            </div>
                            <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 relative z-10">
                                <div className="text-center md:text-left">
                                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-2">
                                        {mode === 'relationship' ? 'Guna Milan Match' : 'Business Compatibility'}
                                    </div>
                                    <div className="text-7xl font-black text-slate-100 tracking-tighter tabular-nums drop-shadow-lg">
                                        {matchData.total_score}
                                        <span className="text-2xl text-slate-600 ml-1">/ {matchData.maximum_score || 36}</span>
                                    </div>
                                    {mode === 'business' && (
                                        <div className="text-sm font-black text-slate-400 mt-4 px-4 py-2 bg-white/5 rounded-xl border border-white/5 inline-block">
                                            {matchData.conclusion}
                                        </div>
                                    )}
                                </div>
                                {mode === 'relationship' && (
                                    <div className={`px-6 py-3 rounded-2xl text-white font-black text-[11px] uppercase tracking-widest shadow-2xl ring-1 ring-white/10 ${getScoreColor(matchData.total_score).split(' ')[0]}`}>
                                        {getScoreLabel(matchData.total_score)}
                                    </div>
                                )}
                            </div>
                            <div className="h-6 bg-slate-950/50 rounded-full overflow-hidden flex p-1.5 border border-white/5">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.1)] ${mode === 'relationship'
                                        ? getScoreColor(matchData.total_score).split(' ')[0]
                                        : (matchData.total_score > 75 ? 'bg-emerald-500' : matchData.total_score > 50 ? 'bg-amber-500' : 'bg-rose-500')
                                        }`}
                                    style={{ width: `${(matchData.total_score / (matchData.maximum_score || 36)) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Business Compatibility Details */}
                        {mode === 'business' && matchData.details && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Moon Compatibility */}
                                <div className="glass-card p-6 space-y-4 hover:bg-white/[0.03] transition-all">
                                    <div className="flex items-center justify-between">
                                        <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Mental Sync</div>
                                        <div className="text-xl font-black text-indigo-400 tabular-nums">{matchData.details.moon_compatibility.score} / {matchData.details.moon_compatibility.max}</div>
                                    </div>
                                    <h3 className="font-black text-slate-100 text-sm italic group-hover:text-white transition-colors tracking-tight leading-snug">Mind & Thought Process</h3>
                                    <p className="text-xs text-slate-400 leading-relaxed italic opacity-80">"{matchData.details.moon_compatibility.desc}"</p>
                                </div>
                                {/* Ascendant Compatibility */}
                                <div className="glass-card p-6 space-y-4 hover:bg-white/[0.03] transition-all">
                                    <div className="flex items-center justify-between">
                                        <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Work Style</div>
                                        <div className="text-xl font-black text-indigo-400 tabular-nums">{matchData.details.ascendant_compatibility.score} / {matchData.details.ascendant_compatibility.max}</div>
                                    </div>
                                    <h3 className="font-black text-slate-100 text-sm italic tracking-tight leading-snug">Personality & Approach</h3>
                                    <p className="text-xs text-slate-400 leading-relaxed italic opacity-80">"{matchData.details.ascendant_compatibility.desc}"</p>
                                </div>
                                {/* Wealth Planets */}
                                <div className="glass-card p-6 space-y-4 hover:bg-white/[0.03] transition-all">
                                    <div className="flex items-center justify-between">
                                        <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Financial Growth</div>
                                        <div className="text-xl font-black text-indigo-400 tabular-nums">{matchData.details.wealth_planets.score} / {matchData.details.wealth_planets.max}</div>
                                    </div>
                                    <h3 className="font-black text-slate-100 text-sm italic tracking-tight leading-snug">Planetary Strength</h3>
                                    <p className="text-xs text-slate-400 leading-relaxed italic opacity-80">"{matchData.details.wealth_planets.desc}"</p>
                                </div>
                            </div>
                        )}

                        {/* Relationship Compatibility Details */}
                        {mode === 'relationship' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="flex items-center gap-3 px-2">
                                        <Sparkles className="w-4 h-4 text-indigo-400" />
                                        <h3 className="font-black text-slate-100 text-sm uppercase tracking-[0.2em]">Ashtakoot Breakdown</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(matchData.details).map(([key, val]: any) => (
                                            <KootaCard key={key} data={val} />
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="glass-card p-6 border-t-4 border-t-rose-500/50">
                                        <div className="flex items-center gap-3 mb-6">
                                            <ShieldAlert className="w-4 h-4 text-rose-400" />
                                            <h3 className="font-black text-slate-100 text-[10px] uppercase tracking-widest">Manglik Dosha</h3>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Partner A</span>
                                                {matchData.manglik.boy ? (
                                                    <div className="flex items-center gap-2 text-rose-400 font-black text-[10px] uppercase tracking-tighter">
                                                        <XCircle className="w-3.5 h-3.5" /> Presence
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-tighter">
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> Absent
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Partner B</span>
                                                {matchData.manglik.girl ? (
                                                    <div className="flex items-center gap-2 text-rose-400 font-black text-[10px] uppercase tracking-tighter">
                                                        <XCircle className="w-3.5 h-3.5" /> Presence
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-tighter">
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> Absent
                                                    </div>
                                                )}
                                            </div>
                                            <div className={`p-4 rounded-xl border mt-4 ${matchData.manglik.compatible ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'} text-[10px] font-black uppercase tracking-widest text-center shadow-lg`}>
                                                {matchData.manglik.compatible
                                                    ? "Dosha Balanced"
                                                    : "Dosha Mismatch"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="glass-card bg-slate-900/40 p-6 relative overflow-hidden ring-1 ring-white/10">
                                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
                                            <Activity className="w-32 h-32" />
                                        </div>
                                        <h3 className="font-black text-indigo-400 text-[10px] uppercase tracking-[0.2em] mb-6 relative z-10">7th House Sync</h3>
                                        <div className="space-y-6 relative z-10">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Partner A</div>
                                                        <div className="text-xl font-black text-slate-100 tabular-nums">{matchData.house_7_analysis.boy.strength}%</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sign</div>
                                                        <div className="text-[10px] font-black text-indigo-400 uppercase">{matchData.house_7_analysis.boy.sign}</div>
                                                    </div>
                                                </div>
                                                <div className="h-1.5 bg-slate-950/50 rounded-full overflow-hidden p-[1px] border border-white/5">
                                                    <div className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full shadow-[0_0_8px_rgba(79,70,229,0.4)]" style={{ width: `${matchData.house_7_analysis.boy.strength}%` }} />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-slate-100">
                                                    <div>
                                                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Partner B</div>
                                                        <div className="text-xl font-black text-slate-100 tabular-nums">{matchData.house_7_analysis.girl.strength}%</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sign</div>
                                                        <div className="text-[10px] font-black text-rose-400 uppercase">{matchData.house_7_analysis.girl.sign}</div>
                                                    </div>
                                                </div>
                                                <div className="h-1.5 bg-slate-950/50 rounded-full overflow-hidden p-[1px] border border-white/5">
                                                    <div className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full shadow-[0_0_8px_rgba(225,29,72,0.4)]" style={{ width: `${matchData.house_7_analysis.girl.strength}%` }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default ChartCompatibility;
