import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import MainLayout from '../components/layout/MainLayout';
import {
    Loader2, AlertCircle, Sparkles, Layers, Search
} from 'lucide-react';
import { useChartSettings } from '../context/ChartContext';
import DashaHero from '../components/dasha/DashaHero';
import DashaTree from '../components/dasha/DashaTree';
import DashaInsightCard from '../components/dasha/DashaInsightCard';
import DashaEnergyMeters from '../components/dasha/DashaEnergyMeters';

interface DashaLevel {
    lord: string;
    start_date: string;
    end_date: string;
    duration_years: number;
    is_current?: boolean;
    antardashas?: DashaLevel[];
    pratyantardashas?: DashaLevel[];
    sookshma_dashas?: DashaLevel[];
    prana_dashas?: DashaLevel[];
}

interface DashaSummary {
    current_mahadasha: DashaLevel | null;
    current_antardasha: DashaLevel | null;
    current_pratyantardasha: DashaLevel | null;
    current_sookshma?: DashaLevel | null;
}

interface VimshottariDashaData {
    dashas: DashaLevel[];
    summary: DashaSummary;
    balance_years: number;
    balance_lord: string;
}

const VimshottariDasha = () => {
    const { currentProfile } = useChartSettings();
    const [loading, setLoading] = useState(false);
    const [dashaData, setDashaData] = useState<VimshottariDashaData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [ayanamsa, setAyanamsa] = useState('LAHIRI');
    const [searchQuery, setSearchQuery] = useState('');

    const formatDate = (dateStr: string) => {
        if (dateStr.includes('-')) {
            const parts = dateStr.split('-');
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return dateStr;
    };

    const fetchDashaData = useCallback(async () => {
        if (!currentProfile) return;

        setLoading(true);
        setError(null);
        try {
            const birthDetails = {
                date: formatDate(currentProfile.date),
                time: currentProfile.time,
                latitude: currentProfile.latitude,
                longitude: currentProfile.longitude,
                timezone: currentProfile.timezone
            };

            // 1. Get Moon Longitude first for precision
            let moonLongitude = null;
            try {
                const chartResponse = await api.post('/chart/birth', birthDetails);
                const moon = chartResponse.data.planets.find((p: any) => p.name === 'Moon');
                if (moon) moonLongitude = moon.longitude;
            } catch (e) {
                console.warn("Failed to fetch pre-chart for moon longitude", e);
            }

            // 2. Calculate Dasha with explicit Moon position
            const response = await api.post<VimshottariDashaData>('/chart/dasha', {
                birth_details: birthDetails,
                moon_longitude: moonLongitude,
                ayanamsa
            });
            setDashaData(response.data);
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.detail || 'Failed to calculate Dasha periods.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, [ayanamsa, currentProfile]);

    useEffect(() => {
        if (currentProfile) {
            fetchDashaData();
        }
    }, [currentProfile, fetchDashaData]);

    // Current MD is directly available in summary now (as object)
    const currentMD = dashaData?.summary?.current_mahadasha;

    const filteredDashas = dashaData?.dashas.filter(d =>
        d.lord.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    if (loading) {
        return (
            <MainLayout breadcrumbs={['Calculations', 'Dasha']}>
                <div className="min-h-screen bg-[#0A0E1F] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                        <span className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Calculating 120-Year Cycle...</span>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (!currentProfile) {
        return (
            <MainLayout breadcrumbs={['Calculations', 'Dasha']}>
                <div className="min-h-screen flex items-center justify-center bg-[#0A0E1F] text-white">
                    <p className="text-slate-400">Please select a profile to view Dasha.</p>
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout breadcrumbs={['Calculations', 'Dasha']}>
            <div className="min-h-screen w-full bg-[#030014] bg-gradient-to-b from-[#0B0122] via-[#050816] to-[#030014] text-slate-100 relative overflow-hidden font-sans -mx-4 -my-4 md:-mx-8 md:-my-8 p-4 md:p-8">

                {/* Mystical Background Elements (Consistent with Home) */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-indigo-500/5 blur-[120px] rounded-full animate-pulse-slow opacity-20" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-600/5 blur-[120px] rounded-full animate-pulse-slow opacity-20" style={{ animationDelay: '3s' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.03)_0%,transparent_70%)]" />
                    {/* Decorative Celestial Patterns */}
                    <div className="absolute top-1/4 right-[5%] opacity-[0.03] rotate-12 scale-150">
                        <Sparkles className="w-96 h-96 text-yellow-500" />
                    </div>
                </div>

                {/* Star Field Background */}
                <div className="fixed inset-0 pointer-events-none z-[1]">
                    {Array.from({ length: 150 }, (_, i) => (
                        <div
                            key={i}
                            className="absolute w-0.5 h-0.5 bg-white rounded-full animate-twinkle opacity-20"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${3 + Math.random() * 4}s`
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 max-w-7xl mx-auto space-y-12 pb-20 pt-8">

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-200 mb-6">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                            <button onClick={fetchDashaData} className="ml-auto text-xs bg-red-500/20 hover:bg-red-500/30 px-3 py-1 rounded transition-colors uppercase font-bold tracking-wider">
                                Retry
                            </button>
                        </div>
                    )}

                    {dashaData && currentMD ? (
                        <>
                            {/* Hero Section */}
                            <section>
                                <div className="flex items-center justify-between mb-8">
                                    <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                                        <Layers className="w-6 h-6 text-indigo-400" />
                                        Vimshottari Dasha
                                    </h1>

                                    {/* Ayanamsa Selector (Mini) */}
                                    <select
                                        value={ayanamsa}
                                        onChange={(e) => setAyanamsa(e.target.value)}
                                        className="bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-slate-400 px-3 py-2 cursor-pointer focus:outline-none focus:border-indigo-500"
                                    >
                                        <option value="LAHIRI">Lahiri</option>
                                        <option value="KP">KP System</option>
                                    </select>
                                </div>

                                <DashaHero
                                    currentMahadasha={dashaData.summary.current_mahadasha?.lord || 'Unknown'}
                                    startDate={currentMD.start_date}
                                    endDate={currentMD.end_date}
                                    durationYears={currentMD.duration_years}
                                />
                            </section>

                            <div className="grid lg:grid-cols-3 gap-8">
                                {/* Left Col: Tree View */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                            Planetary Timeline
                                            <span className="text-xs font-normal text-slate-500 bg-white/5 px-2 py-0.5 rounded ml-2">120 Years</span>
                                        </h2>

                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                                            <input
                                                type="text"
                                                placeholder="Search planet..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="bg-white/5 border border-white/10 rounded-full pl-8 pr-4 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 w-40 transition-all focus:w-52"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-[#0A0E1F]/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 min-h-[500px]">
                                        <DashaTree dashas={filteredDashas} />
                                    </div>
                                </div>

                                {/* Right Col: Insights */}
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-white">Current Influence</h2>
                                    <DashaInsightCard
                                        mahadasha={dashaData.summary.current_mahadasha?.lord || 'Unknown'}
                                        antardasha={dashaData.summary.current_antardasha?.lord || 'Unknown'}
                                    />

                                    <DashaEnergyMeters
                                        mahadasha={dashaData.summary.current_mahadasha?.lord || 'Unknown'}
                                        antardasha={dashaData.summary.current_antardasha?.lord || 'Unknown'}
                                    />

                                    {/* Future: Transit Overlay Trigger could go here */}
                                    <div className="bg-indigo-600/20 border border-indigo-500/30 p-6 rounded-[2rem] text-center">
                                        <p className="text-indigo-200 text-sm font-medium mb-4">
                                            Want to see how these periods interact with current transits?
                                        </p>
                                        <button className="px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors shadow-lg shadow-indigo-500/20">
                                            Explore Transits
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400">No Dasha data found.</p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default VimshottariDasha;
