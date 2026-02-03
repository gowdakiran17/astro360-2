import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useChart } from '../../context/ChartContext';
import MainLayout from '../../components/layout/MainLayout';
import PersonalizedRemedies from '../../components/dashboard/modern/PersonalizedRemedies';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { BrainCircuit } from 'lucide-react';
import GlobalRemedies from '../../components/dashboard/modern/GlobalRemedies';
import { ZODIAC_LORDS, VEDIC_REMEDIES } from '../../data/remedyData';

const StarField = () => {
    const stars = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 2 + 1,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${Math.random() * 3 + 2}s`
    }));

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute bg-white rounded-full opacity-20 animate-pulse"
                    style={{
                        top: star.top,
                        left: star.left,
                        width: star.size,
                        height: star.size,
                        animationDelay: star.animationDelay,
                        animationDuration: star.animationDuration
                    }}
                />
            ))}
        </div>
    );
};

const RemediesPage: React.FC = () => {
    const { currentProfile } = useChart();
    const [chartData, setChartData] = useState<any>(null);
    const [panchangData, setPanchangData] = useState<any>(null);
    const [dashaData, setDashaData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    const toggleCheck = (id: string) => {
        setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const fetchData = useCallback(async (profile: any) => {
        if (!profile) return;
        setIsLoading(true);

        const formatDate = (dateStr: string) => {
            if (dateStr.includes('-')) {
                const [y, m, d] = dateStr.split('-');
                return `${d}/${m}/${y}`;
            }
            return dateStr;
        };

        const birthDetails = {
            date: formatDate(profile.date),
            time: profile.time,
            latitude: profile.latitude,
            longitude: profile.longitude,
            timezone: profile.timezone
        };

        try {
            const [panchangRes, chartRes] = await Promise.allSettled([
                api.post('chart/panchang', { ...birthDetails, date: birthDetails.date, time: birthDetails.time }),
                api.post('chart/birth', birthDetails)
            ]);

            if (panchangRes.status === 'fulfilled') setPanchangData((panchangRes.value as any).data);

            if (chartRes.status === 'fulfilled') {
                const chart = (chartRes.value as any).data;
                setChartData(chart);

                const moon = chart?.planets?.find((p: any) => p.name === 'Moon');
                if (moon) {
                    try {
                        const dashaRes = await api.post('chart/dasha', {
                            birth_details: birthDetails,
                            moon_longitude: moon.longitude
                        });
                        if (dashaRes.data?.dashas) setDashaData(dashaRes.data);
                    } catch (e) { console.error("Dasha Error:", e); }
                }
            }
        } catch (e) {
            console.error("Fetch Data Error:", e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (currentProfile) fetchData(currentProfile);
    }, [currentProfile, fetchData]);

    if (isLoading && !chartData) return <LoadingSpinner />;

    return (
        <MainLayout
            title="Cosmic Alignment"
            breadcrumbs={['Tools', 'Remedies']}
            showHeader={true}
            disableContentPadding={true}
        >
            <div className="min-h-screen bg-[#050816] relative overflow-hidden font-sans pb-32">
                <StarField />

                {/* Background Universe */}
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/10 blur-[120px] rounded-full opacity-20" />
                    <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-amber-900/10 blur-[100px] rounded-full opacity-20" />
                </div>

                <div className="relative z-10 mx-auto max-w-7xl pt-16 px-6 md:px-10 space-y-24">

                    {/* Hero Header */}
                    <header className="text-center w-full mx-auto relative">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center justify-center gap-4">
                                <div className="h-px w-16 bg-amber-500/40" />
                                <span className="text-xs font-black text-amber-400 uppercase tracking-[0.5em] drop-shadow-[0_0_10px_rgba(251,191,36,0.2)]">Celestial Alignment</span>
                                <div className="h-px w-16 bg-amber-500/40" />
                            </div>

                            <h1 className="text-6xl md:text-8xl font-serif text-white tracking-tight leading-none mb-8">
                                Cosmic <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-400 to-amber-600 drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]">Toolkit</span>
                            </h1>

                            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light italic opacity-80">
                                Harmonize your planetary field through targeted artifacts, karmic realignment, and situational success triggers.
                            </p>
                        </motion.div>

                        <div className="mt-16 relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full" />
                            <motion.img
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                src="/remedies/remedy_secret.png"
                                alt="Cosmic Vault"
                                className="w-80 h-80 mx-auto object-contain relative z-10 drop-shadow-[0_35px_35px_rgba(0,0,0,0.6)]"
                            />
                        </div>
                    </header>

                    {/* Section 2: Global Fundamental Alignment (NEW TOP POSITION) */}
                    {chartData?.ascendant && (
                        <GlobalRemedies
                            ascLord={ZODIAC_LORDS[chartData.ascendant.sign.charAt(0).toUpperCase() + chartData.ascendant.sign.slice(1).toLowerCase()]}
                            VEDIC_REMEDIES={VEDIC_REMEDIES}
                            checkedItems={checkedItems}
                            toggleCheck={toggleCheck}
                        />
                    )}

                    {/* Core Toolkit Integration */}
                    <div className="relative">
                        {chartData ? (
                            <PersonalizedRemedies
                                chartData={chartData}
                                dashaData={dashaData}
                                panchangData={panchangData}
                            />
                        ) : (
                            <div className="p-24 text-center bg-[#0A0E1F]/60 rounded-[3rem] border border-white/5 backdrop-blur-xl">
                                <BrainCircuit className="w-12 h-12 text-slate-700 mx-auto mb-6 animate-pulse" />
                                <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Synchronizing Planetary Frequencies...</p>
                            </div>
                        )}
                    </div>

                    {/* Information Grids (Educational & Protocol) Removed from bottom as they moved up */}

                    {/* Background Research Mention */}
                    <div className="text-center pb-12 pt-10">
                        <div className="h-px w-24 bg-white/10 mx-auto mb-6" />
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] font-sans">
                            Sourced via Lal Kitab & Bio-energy Science
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default RemediesPage;
