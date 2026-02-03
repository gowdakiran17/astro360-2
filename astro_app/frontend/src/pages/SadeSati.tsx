import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useChartSettings } from '../context/ChartContext';
import { astrologyService, SadeSatiResponse } from '../services/astrology';
import { SADE_SATI_CONTENT } from '../utils/sadeSatiContent';
import {
    Clock,
    Zap,
    Calendar,
    Shield,
    AlertCircle,
    Loader2,
    Briefcase,
    DollarSign,
    Heart,
    Activity,
    Globe,
    Sparkles
} from 'lucide-react';

// New Components
import SadeSatiHero from '../components/sade-sati/SadeSatiHero';
import SadeSatiFocus from '../components/sade-sati/SadeSatiFocus';
import SadeSatiPhases from '../components/sade-sati/SadeSatiPhases';
import SadeSatiImpactMatrix from '../components/sade-sati/SadeSatiImpactMatrix';
import SadeSatiRemedies from '../components/sade-sati/SadeSatiRemedies';
import SadeSatiTimeline from '../components/sade-sati/SadeSatiTimeline';

const SadeSati: React.FC = () => {
    const { currentProfile } = useChartSettings();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<SadeSatiResponse | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!currentProfile) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const birthDetails = {
                    date: currentProfile.date,
                    time: currentProfile.time,
                    timezone: currentProfile.timezone || "Asia/Kolkata",
                    latitude: currentProfile.latitude,
                    longitude: currentProfile.longitude
                };

                const response = await astrologyService.getSadeSati(birthDetails);
                setData(response);
            } catch (err) {
                console.error("Failed to fetch Sade Sati data:", err);
                setError("Failed to load analysis. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentProfile]);

    if (loading) {
        return (
            <MainLayout breadcrumbs={['Tools', 'Sade Sati']}>
                <div className="min-h-screen flex items-center justify-center bg-[#0A0E1F]">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                        <span className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Calculating Saturn's Transit...</span>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (error || !data) {
        return (
            <MainLayout breadcrumbs={['Tools', 'Sade Sati']}>
                <div className="min-h-screen flex items-center justify-center bg-[#0A0E1F] text-white">
                    <div className="text-center p-8 bg-white/5 rounded-[2rem] border border-white/5">
                        <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-10 h-10 text-rose-500" />
                        </div>
                        <h2 className="text-2xl font-black mb-2">Analysis Currently Unavailable</h2>
                        <p className="text-slate-400 mb-6">{error || "No data available"}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors"
                        >
                            Retry Calculation
                        </button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    // --- Data Transformation Logic (Preserved) ---
    const currentPhaseId = data.is_in_sade_sati
        ? (data.phase.toLowerCase().includes('rising') ? 'rising' :
            data.phase.toLowerCase().includes('peak') ? 'peak' : 'setting')
        : 'setting';

    const phaseMapping = {
        'Rising': 'Rising Phase',
        'Peak': 'Peak Phase',
        'Setting': 'Setting Phase'
    };

    const formattedPhases = data.phases.map(p => {
        const contentKey = phaseMapping[p.phase as keyof typeof phaseMapping] as keyof typeof SADE_SATI_CONTENT.phases;
        const content: any = SADE_SATI_CONTENT.phases[contentKey] || {};

        // Simple status logic
        let status: 'completed' | 'current' | 'upcoming' = 'upcoming';
        if (p.is_current) status = 'current';
        else if (data.phase.includes('Peak') && p.phase === 'Rising') status = 'completed';
        else if (data.phase.includes('Setting') && (p.phase === 'Rising' || p.phase === 'Peak')) status = 'completed';

        return {
            id: p.phase.toLowerCase() as any,
            name: `${p.phase} Phase`, // "Rising Phase"
            dates: `${p.start} - ${p.end}`,
            status,
            intensity: p.phase === 'Peak' ? 5 : 3,
            themes: [content.meaning?.split('.')[0] || 'Transformation', content.purpose || 'Growth'],
            advice: content.advice || content.meaning || ''
        };
    });

    // Date calculations
    const parseDate = (dateStr: string) => {
        if (!dateStr) return new Date();
        if (dateStr.includes('/')) {
            const [day, month, year] = dateStr.split('/');
            return new Date(`${year}-${month}-${day}`);
        }
        return new Date(dateStr);
    };

    const daysRemaining = data.end_date ? Math.max(0, Math.ceil((parseDate(data.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : 0;
    const totalDays = 7.5 * 365;
    const progress = Math.min(100, Math.max(0, ((totalDays - daysRemaining) / totalDays) * 100));

    // Impact mapping
    const impactData = Object.entries(SADE_SATI_CONTENT.phases[data.phase as keyof typeof SADE_SATI_CONTENT.phases]?.impacts || {}).map(([key, val]: [string, any]) => {
        const icons: any = {
            career: Briefcase,
            money: DollarSign,
            health: Activity,
            relationships: Heart,
            travel: Globe,
            authority: Shield
        };

        return {
            id: key,
            label: key.charAt(0).toUpperCase() + key.slice(1),
            icon: icons[key] || Sparkles,
            level: val.level,
            intensity: (val.level === 'High' ? 'red' : val.level === 'Medium' ? 'orange' : 'green') as any,
            effects: val.text,
            advice: val.advice
        };
    });

    return (
        <MainLayout breadcrumbs={['Tools', 'Sade Sati']}>
            <div className="min-h-screen w-full bg-[#030014] bg-gradient-to-b from-[#0B0122] via-[#050816] to-[#030014] text-slate-100 relative overflow-hidden font-sans -mx-4 -my-4 md:-mx-8 md:-my-8 p-4 md:p-8">
                {/* Mystical Background Elements */}
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

                <div className="relative z-10 max-w-7xl mx-auto space-y-12 pb-20">

                    {/* A. Dynamic Hero */}
                    <section>
                        <SadeSatiHero
                            status={data.is_in_sade_sati ? 'active' : 'completed'}
                            phase={currentPhaseId}
                            startDate={data.start_date}
                            endDate={data.end_date}
                            progress={progress}
                            daysRemaining={daysRemaining}
                        />
                    </section>

                    {/* B. The 3 Phases (Scrollable) */}
                    <section>
                        <div className="flex items-center gap-3 mb-6 px-2">
                            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                                <Clock className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-black text-white tracking-tight">7.5 Year Journey</h2>
                        </div>
                        <SadeSatiPhases
                            currentPhaseId={currentPhaseId}
                            phases={formattedPhases}
                        />
                    </section>

                    {/* C. Life Impact Matrix */}
                    <section>
                        <div className="flex items-center gap-3 mb-6 px-2">
                            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400">
                                <Zap className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Karmic Impact</h2>
                        </div>
                        <SadeSatiImpactMatrix impacts={impactData} />
                    </section>

                    {/* D. Remedies & Timeline (Grid Layout) */}
                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                        <section className="h-full">
                            <div className="flex items-center gap-3 mb-6 px-2">
                                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Remedial Vault</h2>
                            </div>
                            <SadeSatiRemedies />
                        </section>

                        <section className="h-full">
                            <div className="flex items-center gap-3 mb-6 px-2">
                                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Timeline Analysis</h2>
                            </div>
                            {/* Re-use existing Timeline but wrapped nicely */}
                            <div className="bg-[#0A0E1F]/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 lg:p-10 shadow-xl h-full">
                                <SadeSatiTimeline />
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default SadeSati;
