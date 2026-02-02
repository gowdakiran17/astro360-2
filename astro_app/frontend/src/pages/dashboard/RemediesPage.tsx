import React, { useState, useEffect, useCallback } from 'react';
import { useChart } from '../../context/ChartContext';
import MainLayout from '../../components/layout/MainLayout';
import PersonalizedRemedies from '../../components/dashboard/modern/PersonalizedRemedies';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { BookOpen, ShieldCheck, Zap, Info, Sparkles } from 'lucide-react';

const RemediesPage: React.FC = () => {
    const { currentProfile } = useChart();
    const [chartData, setChartData] = useState<any>(null);
    const [panchangData, setPanchangData] = useState<any>(null);
    const [dashaData, setDashaData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

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
            title="Complete Cosmic Toolkit"
            breadcrumbs={['Dashboard', 'Remedies']}
            showHeader={true}
            disableContentPadding={true}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

                {/* Hero Header */}
                <div className="relative rounded-3xl overflow-hidden mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-slate-900/40 backdrop-blur-3xl z-0" />
                    <div className="relative z-10 p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5">
                        <div className="space-y-4 max-w-2xl text-center md:text-left">
                            <div className="flex items-center gap-2 text-indigo-400 font-bold tracking-widest text-xs uppercase mb-2 justify-center md:justify-start">
                                <Sparkles className="w-4 h-4" />
                                Personalized Alignment
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
                                Complete Cosmic <br /><span className="text-indigo-500">Remedial Toolkit</span>
                            </h1>
                            <p className="text-slate-400 text-lg">
                                Harmonize your planetary field through targeted artifacts, karmic realignment, and situational success triggers.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full" />
                            <img src="/remedies/remedy_secret.png" alt="Cosmic Vault" className="w-64 h-64 object-contain relative z-10 drop-shadow-2xl animate-float" />
                        </div>
                    </div>
                </div>

                {/* Core Toolkit Integration */}
                <section>
                    {chartData ? (
                        <PersonalizedRemedies
                            chartData={chartData}
                            dashaData={dashaData}
                            panchangData={panchangData}
                        />
                    ) : (
                        <div className="p-20 text-center bg-slate-900/30 rounded-3xl border border-white/5">
                            <p className="text-slate-500">Waiting for planetary data synchronization...</p>
                        </div>
                    )}
                </section>

                {/* Educational Intelligence Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-slate-900/50 rounded-3xl p-8 border border-white/5 backdrop-blur-3xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Educational Intelligence</h3>
                        </div>
                        <div className="space-y-6 text-slate-400 leading-relaxed text-sm">
                            <div className="flex gap-4">
                                <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
                                <p>
                                    <strong className="text-white block mb-1">Bio-Magnetic Frequency:</strong>
                                    Gemstones act as "color filters" for cosmic rays. When worn, they concentrate specific planetary frequencies into the body's subtle energy grid (Nadis), balancing the bio-magnetic field.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
                                <p>
                                    <strong className="text-white block mb-1">Rudraksha Science:</strong>
                                    Rudraksha beads possess unique electromagnetic properties. They stabilize heart rate and blood pressure while neutralizing static negative charges in the aura.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-1" />
                                <p>
                                    <strong className="text-white block mb-1">Mantra Vibration:</strong>
                                    The Sanskrit syllables used in Beeja Mantras are sonic triggers that stimulate specific plexuses (Chakras). Periodic chanting re-aligns the subconscious mind with the Dasha Lord.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Remedy Protocol Section */}
                    <div className="bg-slate-900/50 rounded-3xl p-8 border border-white/5 backdrop-blur-3xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Remedy Protocol</h3>
                        </div>
                        <div className="space-y-5">
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                                <h4 className="text-indigo-300 font-bold text-xs uppercase tracking-widest mb-2">1. Activation (Sankalp)</h4>
                                <p className="text-slate-400 text-sm">Always start a new remedy on the suggested day at sunrise. Hold the artifact or water, state your intention clearly, and offer a silent prayer.</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                                <h4 className="text-emerald-300 font-bold text-xs uppercase tracking-widest mb-2">2. Purification</h4>
                                <p className="text-slate-400 text-sm">Wash Gemstones and Rudrakshas in raw milk or Gangajal once a month to clear accumulated psychic debris and reactive static energy.</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                                <h4 className="text-amber-300 font-bold text-xs uppercase tracking-widest mb-2">3. Consistency</h4>
                                <p className="text-slate-400 text-sm">Remedies work through cumulative frequency shifts. Maintain the daily habits for at least 43 days (one full planetary cycle) for tangible karmic changes.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Background Research Mention */}
                <div className="text-center pb-12">
                    <p className="text-slate-500 text-xs italic">
                        Guidance based on combined wisdom of Lal Kitab, Bhrigu Samhita, and modern Bio-energy research.
                    </p>
                </div>
            </div>
        </MainLayout>
    );
};

export default RemediesPage;
