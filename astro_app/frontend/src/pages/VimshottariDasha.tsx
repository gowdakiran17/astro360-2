import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import MainLayout from '../components/layout/MainLayout';
import {
    Loader2, AlertCircle, Sparkles, Layers, Search, X
} from 'lucide-react';
import { useChartSettings } from '../context/ChartContext';
import DashaHero from '../components/dasha/DashaHero';
import DashaTree from '../components/dasha/DashaTree';
import DashaInsightCard from '../components/dasha/DashaInsightCard';
import DashaEnergyMeters from '../components/dasha/DashaEnergyMeters';
import ChartWheel from '../components/charts/ChartWheel'; // Import ChartWheel

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
    const { currentProfile, settings } = useChartSettings();
    const [loading, setLoading] = useState(false);
    const [dashaData, setDashaData] = useState<VimshottariDashaData | null>(null);
    const [natalChart, setNatalChart] = useState<any>(null); // Store full natal chart
    const [transitChart, setTransitChart] = useState<any>(null); // Store transit chart
    const [showTransitModal, setShowTransitModal] = useState(false);
    const [loadingTransits, setLoadingTransits] = useState(false);
    const [error, setError] = useState<string | null>(null);
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

            // 1. Get Moon Longitude first for precision AND store Natal Chart
            let moonLongitude = null;
            try {
                const chartResponse = await api.post('/chart/birth', birthDetails);
                setNatalChart(chartResponse.data); // Save Natal Chart
                const moon = chartResponse.data.planets.find((p: any) => p.name === 'Moon');
                if (moon) moonLongitude = moon.longitude;
            } catch (e) {
                console.warn("Failed to fetch pre-chart for moon longitude", e);
            }

            // 2. Calculate Dasha with explicit Moon position
            const response = await api.post<VimshottariDashaData>('/chart/dasha', {
                birth_details: { ...birthDetails, settings },
                moon_longitude: moonLongitude,
                ayanamsa: settings.ayanamsa 
            });
            setDashaData(response.data);
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.detail || 'Failed to calculate Dasha periods.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, [currentProfile, settings]);

    useEffect(() => {
        if (currentProfile) {
            fetchDashaData();
        }
    }, [currentProfile, fetchDashaData]);

    const handleExploreTransits = async () => {
        if (!currentProfile) return;
        
        setLoadingTransits(true);
        setShowTransitModal(true);
        try {
            // Get Current Date
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            const dateStr = `${day}/${month}/${year}`;
            
            // Fetch Transit Chart (Chart for NOW at birth location)
            const transitPayload = {
                date: dateStr,
                time: "12:00", // Noon transits
                latitude: currentProfile.latitude,
                longitude: currentProfile.longitude,
                timezone: currentProfile.timezone
            };
            
            const response = await api.post('/chart/birth', transitPayload);
            setTransitChart(response.data);
            
        } catch (e) {
            console.error("Failed to fetch transits", e);
        } finally {
            setLoadingTransits(false);
        }
    };

    // Current MD is directly available in summary now (as object)
    const currentMD = dashaData?.summary?.current_mahadasha;

    const filteredDashas = dashaData?.dashas.filter(d =>
        d.lord.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    if (loading) {
        return (
            <MainLayout breadcrumbs={['Calculations', 'Dasha']}>
                <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-[#6D5DF6] animate-spin" />
                        <span className="text-[#A9B0C2] font-bold uppercase tracking-widest text-xs animate-pulse">Calculating 120-Year Cycle...</span>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (!currentProfile) {
        return (
            <MainLayout breadcrumbs={['Calculations', 'Dasha']}>
                <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A] text-[#EDEFF5]">
                    <p className="text-[#A9B0C2]">Please select a profile to view Dasha.</p>
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout breadcrumbs={['Calculations', 'Dasha']}>
            <div className="min-h-screen w-full bg-[#0B0F1A] text-[#EDEFF5] relative overflow-hidden font-sans -mx-4 -my-4 md:-mx-8 md:-my-8 p-4 md:p-8">

                {/* Mystical Background Elements (Consistent with Home) */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-[#6D5DF6]/5 blur-[120px] rounded-full animate-pulse-slow opacity-20" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-[#F5A623]/5 blur-[120px] rounded-full animate-pulse-slow opacity-20" style={{ animationDelay: '3s' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(109,93,246,0.03)_0%,transparent_70%)]" />
                    {/* Decorative Celestial Patterns */}
                    <div className="absolute top-1/4 right-[5%] opacity-[0.03] rotate-12 scale-150">
                        <Sparkles className="w-96 h-96 text-[#F5A623]" />
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
                        <div className="bg-[#E25555]/10 border border-[#E25555]/20 p-4 rounded-xl flex items-center gap-3 text-[#E25555] mb-6">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                            <button onClick={fetchDashaData} className="ml-auto text-xs bg-[#E25555]/20 hover:bg-[#E25555]/30 px-3 py-1 rounded transition-colors uppercase font-bold tracking-wider">
                                Retry
                            </button>
                        </div>
                    )}

                    {dashaData && currentMD ? (
                        <>
                            {/* Hero Section */}
                            <section>
                                <div className="flex items-center justify-between mb-8">
                                    <h1 className="text-2xl font-black text-[#EDEFF5] uppercase tracking-wider flex items-center gap-3">
                                        <Layers className="w-6 h-6 text-[#6D5DF6]" />
                                        Vimshottari Dasha
                                    </h1>

                                    {/* Settings Badge */}
                                    <div className="px-3 py-1 rounded-full bg-[#11162A] border border-[rgba(255,255,255,0.08)] text-xs text-[#A9B0C2]">
                                        {settings.ayanamsa}
                                    </div>
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
                                        <h2 className="text-xl font-bold text-[#EDEFF5] flex items-center gap-2">
                                            Planetary Timeline
                                            <span className="text-xs font-normal text-[#6F768A] bg-[rgba(255,255,255,0.04)] px-2 py-0.5 rounded ml-2">120 Years</span>
                                        </h2>

                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6F768A]" />
                                            <input
                                                type="text"
                                                placeholder="Search planet..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-full pl-8 pr-4 py-1.5 text-xs text-[#EDEFF5] placeholder:text-[#6F768A] focus:outline-none focus:border-[#6D5DF6] w-40 transition-all focus:w-52"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-[#11162A]/40 backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-[2rem] p-6 min-h-[500px]">
                                        <DashaTree dashas={filteredDashas} />
                                    </div>
                                </div>

                                {/* Right Col: Insights */}
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-[#EDEFF5]">Current Influence</h2>
                                    <DashaInsightCard
                                        mahadasha={dashaData.summary.current_mahadasha?.lord || 'Unknown'}
                                        antardasha={dashaData.summary.current_antardasha?.lord || 'Unknown'}
                                        chartData={natalChart}
                                    />

                                    <DashaEnergyMeters
                                        mahadasha={dashaData.summary.current_mahadasha?.lord || 'Unknown'}
                                        antardasha={dashaData.summary.current_antardasha?.lord || 'Unknown'}
                                    />

                                    {/* Future: Transit Overlay Trigger could go here */}
                                    <div className="bg-[#6D5DF6]/20 border border-[#6D5DF6]/30 p-6 rounded-[2rem] text-center">
                                        <p className="text-[#EDEFF5] text-sm font-medium mb-4">
                                            Want to see how these periods interact with current transits?
                                        </p>
                                        <button 
                                        onClick={handleExploreTransits}
                                        className="px-6 py-3 bg-[#6D5DF6] hover:bg-[#5848c9] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors shadow-lg shadow-[#6D5DF6]/20"
                                    >
                                        Explore Transits
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20">
                        <AlertCircle className="w-12 h-12 text-[#6F768A] mx-auto mb-4" />
                        <p className="text-[#A9B0C2]">No Dasha data found.</p>
                    </div>
                )}
            </div>
            
            {/* Transit Overlay Modal */}
            {showTransitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowTransitModal(false)} />
                    <div className="relative bg-[#0B0F1A] border border-[rgba(255,255,255,0.1)] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row">
                        <button 
                            onClick={() => setShowTransitModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white z-10"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        
                        <div className="p-8 flex-1 flex flex-col items-center justify-center bg-[#080B14]">
                            <h3 className="text-xl font-bold text-[#EDEFF5] mb-2">Transit Interaction</h3>
                            <p className="text-xs text-[#A9B0C2] mb-6 uppercase tracking-widest">Inner: Natal | Outer: Current Transit</p>
                            
                            {loadingTransits ? (
                                <div className="flex flex-col items-center gap-4 py-20">
                                    <Loader2 className="w-10 h-10 text-[#6D5DF6] animate-spin" />
                                    <span className="text-sm text-[#6F768A]">Calculating Planetary Positions...</span>
                                </div>
                            ) : (
                                <div className="w-full max-w-md mx-auto aspect-square">
                                    <ChartWheel 
                                        data={natalChart} 
                                        transits={transitChart?.planets} 
                                        width={500} 
                                        height={500} 
                                        className="w-full h-full"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="p-6 md:w-80 border-t md:border-t-0 md:border-l border-[rgba(255,255,255,0.1)] bg-[#11162A]/50">
                             <h4 className="text-sm font-bold text-[#EDEFF5] mb-4">Transit Analysis</h4>
                             <div className="space-y-4">
                                <p className="text-xs text-[#94A3B8] leading-relaxed">
                                    This view shows the current planetary positions (outer ring) overlaid on your natal chart (inner ring).
                                </p>
                                <div className="p-3 bg-[#6D5DF6]/10 border border-[#6D5DF6]/20 rounded-lg">
                                    <p className="text-xs text-[#EDEFF5]">
                                        <span className="font-bold text-[#6D5DF6]">Key Insight:</span> Check where Transit Jupiter and Saturn fall in your chart relative to your current Dasha Lord.
                                    </p>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </MainLayout>
);
};

export default VimshottariDasha;
