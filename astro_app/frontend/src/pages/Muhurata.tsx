import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { astrologyService } from '../services/astrology';
import MainLayout from '../components/layout/MainLayout';
import {
    Zap, Clock, RefreshCw,
    Sunrise, Sunset, Info, Star, ChevronRight, ChevronLeft, Calendar, AlertCircle, Search
} from 'lucide-react';

const Muhurata = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [muhurataData, setMuhurataData] = useState<any>(null);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('All');
    const [selectedDate, setSelectedDate] = useState(new Date());

    // FInder Mode State
    const [mode, setMode] = useState<'Daily' | 'Finder'>('Daily');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 7)));
    const [activity, setActivity] = useState('General');
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const activities = [
        "General", "Marriage", "Travel", "Business", "Construction", "Education", "Medical"
    ];

    // Default location (Bengaluru)
    const [location] = useState({
        name: "Bengaluru, Karnataka, IN",
        latitude: 12.97,
        longitude: 77.59,
        timezone: "+05:30"
    });

    useEffect(() => {
        if (user && mode === 'Daily') {
            fetchMuhurata();
        }
    }, [user, selectedDate, mode]);

    const fetchMuhurata = async () => {
        setLoading(true);
        setError('');
        try {
            const dateStr = `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getFullYear()}`;
            const timeStr = `${selectedDate.getHours().toString().padStart(2, '0')}:${selectedDate.getMinutes().toString().padStart(2, '0')}`;

            const response = await api.post('chart/muhurata', {
                birth_details: {
                    date: dateStr,
                    time: timeStr,
                    timezone: location.timezone,
                    latitude: location.latitude,
                    longitude: location.longitude
                }
            });
            setMuhurataData(response.data.data);
        } catch (err: any) {
            console.error("Failed to fetch muhurata", err);
            let errorMessage = "Failed to load Muhurata data.";
            if (err.response?.data?.detail) {
                if (typeof err.response.data.detail === 'string') {
                    errorMessage = err.response.data.detail;
                } else {
                    errorMessage = JSON.stringify(err.response.data.detail);
                }
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const searchMuhurata = async () => {
        setLoading(true);
        setError('');
        try {
            const startStr = `${startDate.getDate().toString().padStart(2, '0')}/${(startDate.getMonth() + 1).toString().padStart(2, '0')}/${startDate.getFullYear()}`;
            const endStr = `${endDate.getDate().toString().padStart(2, '0')}/${(endDate.getMonth() + 1).toString().padStart(2, '0')}/${endDate.getFullYear()}`;

            // Fixed: Pass as object
            const result = await astrologyService.findMuhurata({
                date: startStr,
                end_date: endStr,
                latitude: location.latitude,
                longitude: location.longitude,
                target_quality: ["Excellent", "Good"],
                activity: activity
            });
            setSearchResults(result.results || []);
        } catch (err: any) {
            console.error("Failed to search muhurata", err);
            setError("Failed to search muhurata.");
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (days: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + days);
        setSelectedDate(newDate);
    };

    const formatJDToTime = (jd: number) => {
        if (!jd) return '--:--';
        const date = new Date((jd - 2440587.5) * 86400000);
        const tzStr = location.timezone;
        const sign = tzStr[0] === '+' ? 1 : -1;
        const [hours, minutes] = tzStr.substring(1).split(':').map(Number);
        const offsetMs = sign * (hours * 3600000 + minutes * 60000);

        const localDate = new Date(date.getTime() + offsetMs);
        return localDate.getUTCHours().toString().padStart(2, '0') + ':' +
            localDate.getUTCMinutes().toString().padStart(2, '0');
    };

    const getQualityColor = (quality: string) => {
        switch (quality) {
            case 'Excellent': return 'bg-emerald-500';
            case 'Good': return 'bg-teal-400';
            case 'Poor': return 'bg-amber-500';
            case 'Avoid': return 'bg-rose-500';
            default: return 'bg-slate-400';
        }
    };

    const getQualityLightBg = (quality: string) => {
        switch (quality) {
            case 'Excellent': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
            case 'Good': return 'bg-teal-500/10 border-teal-500/20 text-teal-400';
            case 'Poor': return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
            case 'Avoid': return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
            default: return 'bg-slate-500/10 border-slate-500/20 text-slate-400';
        }
    };

    const SummaryCard = ({ label, count, color, lightColor }: any) => (
        <div className={`glass-card ${lightColor.split(' ')[0]} p-6 flex-1 min-w-[150px] shadow-sm transition-all hover:scale-[1.02] active:scale-95 group`}>
            <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] uppercase font-black tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">{label}</span>
                <div className={`w-2 h-2 rounded-full ${color} shadow-[0_0_8px_rgba(255,255,255,0.2)]`} />
            </div>
            <div className="text-3xl font-black text-slate-100 transition-colors group-hover:text-white">{count}</div>
        </div>
    );

    const filteredPeriods = muhurataData?.periods?.filter((p: any) =>
        activeTab === 'All' || p.type.includes(activeTab) || p.quality === activeTab
    ) || [];

    return (
        <MainLayout title="Muhurata" breadcrumbs={['Global Tools', 'Muhurata']}>
            <div className="w-full space-y-6 pb-20 px-6">

                {/* Header Section */}
                <div className="glass-card p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-900/20">
                            <Zap className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-100">Auspicious Times</h1>
                            <p className="text-sm text-slate-400">Find the best times for your important activities</p>
                        </div>
                    </div>
                    <div className="flex bg-slate-950/50 p-1 rounded-xl border border-white/5">
                        <button
                            onClick={() => setMode('Daily')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'Daily' ? 'bg-slate-800 text-slate-100 shadow-lg ring-1 ring-white/10' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Daily View
                        </button>
                        <button
                            onClick={() => setMode('Finder')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'Finder' ? 'bg-slate-800 text-slate-100 shadow-lg ring-1 ring-white/10' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Finder
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl text-rose-400 text-sm font-bold flex items-center gap-3">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                {mode === 'Finder' && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Search Criteria */}
                        <div className="glass-card p-6">
                            <h3 className="text-lg font-bold text-slate-100 mb-4">Find Auspicious Timings</h3>
                            <div className="flex flex-col md:flex-row gap-4 items-end">
                                <div className="space-y-2 flex-grow">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Start Date</label>
                                    <input
                                        type="date"
                                        value={startDate.toISOString().split('T')[0]}
                                        onChange={(e) => setStartDate(new Date(e.target.value))}
                                        className="w-full px-4 py-2 bg-slate-950/50 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 font-bold text-slate-100 transition-all"
                                    />
                                </div>
                                <div className="space-y-2 flex-grow">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">End Date</label>
                                    <input
                                        type="date"
                                        value={endDate.toISOString().split('T')[0]}
                                        onChange={(e) => setEndDate(new Date(e.target.value))}
                                        className="w-full px-4 py-2 bg-slate-950/50 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 font-bold text-slate-100 transition-all"
                                    />
                                </div>
                                <div className="space-y-2 flex-grow min-w-[150px]">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Activity</label>
                                    <select
                                        value={activity}
                                        onChange={(e) => setActivity(e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-950/50 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 font-bold text-slate-100 transition-all appearance-none cursor-pointer"
                                    >
                                        {activities.map(act => (
                                            <option key={act} value={act} className="bg-slate-900 text-white">{act}</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    onClick={searchMuhurata}
                                    disabled={loading}
                                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-xl shadow-indigo-900/30 disabled:opacity-50 active:scale-95 border border-indigo-400/20 h-[42px]"
                                >
                                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                                    Find Muhurta
                                </button>
                            </div>
                        </div>

                        {/* Results */}
                        {searchResults.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {searchResults.map((result, idx) => (
                                    <div key={idx} className="glass-card p-5 hover:bg-slate-800/40 group transition-all">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{result.date}</div>
                                            <div className={`px-2 py-1 rounded text-[10px] font-black uppercase border ${getQualityLightBg(result.quality)}`}>
                                                {result.quality}
                                            </div>
                                        </div>
                                        <h4 className="font-black text-slate-100 mb-1 group-hover:text-white transition-colors">{result.name}</h4>
                                        <div className="text-sm font-medium text-slate-400 mb-3 tabular-nums">
                                            {formatJDToTime(result.start)} - {formatJDToTime(result.end)}
                                        </div>
                                        <div className="text-xs text-slate-400 bg-slate-950/50 p-3 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors italic">
                                            {result.description}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {searchResults.length === 0 && !loading && (
                            <div className="text-center py-12 text-slate-500">
                                <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p className="font-medium">Adjust dates and search to find auspicious moments</p>
                            </div>
                        )}
                    </div>
                )}

                {mode === 'Daily' && (
                    <>
                        {/* Summary Cards */}
                        {muhurataData && (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <SummaryCard label="Excellent" count={muhurataData.summary.Excellent} color="bg-emerald-500" lightColor="bg-emerald-500/10 border-emerald-500/20" />
                                <SummaryCard label="Good" count={muhurataData.summary.Good} color="bg-teal-400" lightColor="bg-teal-500/10 border-teal-500/20" />
                                <SummaryCard label="Poor" count={muhurataData.summary.Poor} color="bg-amber-500" lightColor="bg-amber-500/10 border-amber-500/20" />
                                <SummaryCard label="Avoid" count={muhurataData.summary.Avoid} color="bg-rose-500" lightColor="bg-rose-500/10 border-rose-500/20" />
                            </div>
                        )}

                        {/* Date Selection Bar */}
                        <div className="glass-card p-2 flex items-center justify-center gap-4 self-center max-w-fit mx-auto">
                            <button
                                onClick={() => handleDateChange(-1)}
                                className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-slate-100 transition-all active:scale-95"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-3 px-4 py-2 bg-slate-950/50 rounded-xl border border-white/5">
                                <Calendar className="w-4 h-4 text-slate-500" />
                                <input
                                    type="date"
                                    value={selectedDate.toISOString().split('T')[0]}
                                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                                    className="bg-transparent border-none outline-none text-sm font-bold text-slate-100 w-32 cursor-pointer"
                                />
                            </div>

                            <button
                                onClick={() => handleDateChange(1)}
                                className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-slate-100 transition-all active:scale-95"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>

                            <div className="w-px h-8 bg-white/5 mx-2" />

                            <button
                                onClick={() => setSelectedDate(new Date())}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-900/20 hover:bg-indigo-500 transition-all active:scale-95 border border-indigo-400/20"
                            >
                                Today
                            </button>
                        </div>

                        {/* Timeline Section */}
                        <div className="glass-card p-8 space-y-8">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-slate-500" />
                                    <h3 className="font-black text-slate-100 text-sm uppercase tracking-widest">Today's Timeline</h3>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    {['Excellent', 'Good', 'Poor', 'Avoid'].map(q => (
                                        <div key={q} className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-tighter ${getQualityLightBg(q)}`}>
                                            {q[0]}: {muhurataData?.summary[q]}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {muhurataData && (
                                <div className="space-y-12">
                                    {/* Sunrise/Sunset Markers */}
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-white/5 pb-2">
                                        <div className="flex items-center gap-2 border border-dashed border-amber-500/20 bg-amber-500/5 px-3 py-1 rounded-full text-amber-500">
                                            <Sunrise className="w-3 h-3" /> SUNRISE {formatJDToTime(muhurataData.sunrise)}
                                        </div>
                                        <div className="flex items-center gap-2 border border-dashed border-orange-500/20 bg-orange-500/5 px-3 py-1 rounded-full text-orange-500">
                                            <Sunset className="w-3 h-3" /> SUNSET {formatJDToTime(muhurataData.sunset)}
                                        </div>
                                    </div>

                                    {/* Main Timeline Bar */}
                                    <div className="h-10 bg-slate-950/50 rounded-2xl overflow-hidden flex relative border border-white/5 p-1">
                                        {muhurataData.periods.filter((p: any) => p.type === 'Choghadiya').map((p: any, i: number) => {
                                            const total = muhurataData.next_sunrise - muhurataData.sunrise;
                                            const width = ((p.end - p.start) / total) * 100;
                                            const left = ((p.start - muhurataData.sunrise) / total) * 100;
                                            return (
                                                <div
                                                    key={i}
                                                    className={`absolute h-full rounded-lg transition-all hover:brightness-110 hover:scale-y-105 shadow-sm active:scale-95 cursor-help ${getQualityColor(p.quality)}`}
                                                    style={{ width: `${width}%`, left: `${left}%` }}
                                                    title={`${p.name}: ${formatJDToTime(p.start)} - ${formatJDToTime(p.end)}`}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Period Grid/List */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 glass-card overflow-hidden">
                                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <h3 className="font-black text-slate-100 text-sm uppercase tracking-widest">Detail Periods</h3>
                                    <div className="flex gap-2 bg-slate-950/50 p-1 rounded-lg border border-white/5">
                                        {['All', 'Choghadiya', 'Hora', 'Muhurata'].map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setActiveTab(t)}
                                                className={`px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all ${activeTab === t ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10' : 'text-slate-500 hover:text-slate-300'}`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="overflow-y-auto max-h-[600px] divide-y divide-white/[0.03] custom-scrollbar">
                                    {filteredPeriods.map((p: any, i: number) => (
                                        <div key={i} className="p-4 hover:bg-white/[0.03] transition-all flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-1.5 h-10 rounded-full ${getQualityColor(p.quality)} shadow-[0_0_8px_rgba(0,0,0,0.2)]`} />
                                                <div>
                                                    <div className="font-black text-slate-100 text-sm group-hover:text-white transition-colors">{p.name}</div>
                                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                        {p.type} • {p.ruler ? `Ruler: ${p.ruler}` : 'Standard'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <div className="text-sm font-black text-slate-100 tabular-nums group-hover:text-white transition-colors">
                                                        {formatJDToTime(p.start)} - {formatJDToTime(p.end)}
                                                    </div>
                                                    <div className={`text-[9px] font-black uppercase tracking-widest ${getQualityLightBg(p.quality).split(' ')[2]}`}>
                                                        {p.quality}
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-100 group-hover:translate-x-0.5 transition-all" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="glass-card bg-slate-900/40 p-8 shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
                                        <Star className="w-48 h-48" />
                                    </div>
                                    <h3 className="font-black text-indigo-400 text-xs uppercase tracking-[0.2em] mb-6 relative z-10">Calculations Info</h3>
                                    <div className="space-y-4 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/10">
                                                <Info className="w-4 h-4" />
                                            </div>
                                            <p className="text-xs text-slate-400 leading-relaxed">
                                                Calculations are for <span className="text-slate-100 font-bold">{location.name}</span>. Total of {muhurataData?.periods?.length || 0} periods analyzed for auspicious planetary alignments.
                                            </p>
                                        </div>
                                        <div className="pt-4 border-t border-white/5 space-y-2">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Updated</p>
                                            <p className="text-sm font-black tabular-nums text-slate-100">{muhurataData ? new Date().toLocaleTimeString() : '--:--:--'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass-card bg-indigo-500/5 p-6 border-indigo-500/10">
                                    <h4 className="font-black text-indigo-400 text-xs uppercase tracking-widest mb-4">Legend</h4>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'Excellent', color: 'bg-emerald-500', desc: 'Highly auspicious for all tasks' },
                                            { label: 'Good', color: 'bg-teal-400', desc: 'Favorable for general success' },
                                            { label: 'Poor', color: 'bg-amber-500', desc: 'Avoid important beginnings' },
                                            { label: 'Avoid', color: 'bg-rose-500', desc: 'Critical negative period' }
                                        ].map(l => (
                                            <div key={l.label} className="flex items-center gap-3">
                                                <div className={`w-2.5 h-2.5 rounded-full ${l.color} shadow-[0_0_8px_rgba(0,0,0,0.3)]`} />
                                                <div>
                                                    <div className="text-[10px] font-black text-slate-100 uppercase tracking-wide leading-none">{l.label}</div>
                                                    <div className="text-[9px] text-slate-500 font-medium">{l.desc}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </MainLayout>
    );
};
export default Muhurata;
