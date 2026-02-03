import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import {
    Diamond, Shield, Sparkles, Info, Flame, AlertTriangle,
    Droplets, Calendar, Star, Hexagon, Crown
} from 'lucide-react';
import api from '../services/api';
import AIReportButton from '../components/ai/AIReportButton';
import { useChartSettings } from '../context/ChartContext';
import { motion, AnimatePresence } from 'framer-motion';

// --- Shared Types ---
interface GemAnalysis {
    suitability: "Highly Recommended" | "Suitable" | "Caution" | "Avoid";
    analysis: string;
    strength_score: number;
}

interface GemstoneData {
    type: string;
    gem_name: string;
    indian_name: string;
    planet: string;
    benefits: string;
    wear_finger: string;
    wear_metal: string;
    wearing_day: string;
    mantra: string;
    ritual: string;
    caution: string;
    substitute: string;
    analysis?: GemAnalysis;
}

interface GemstoneResponse {
    ascendant: string;
    recommendations: {
        life_stone: GemstoneData;
        lucky_stone: GemstoneData;
        benefic_stone: GemstoneData;
    };
    note: string;
}

// --- Background Components ---
const StarField = () => {
    const stars = Array.from({ length: 40 }).map((_, i) => ({
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

const Gemstones = () => {
    const { currentProfile } = useChartSettings();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<GemstoneResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (currentProfile) {
            fetchGemstones();
        }
    }, [currentProfile]);

    const fetchGemstones = async () => {
        if (!currentProfile) return;
        setLoading(true);
        setError(null);
        try {
            const payload = {
                date: currentProfile.date,
                time: currentProfile.time,
                latitude: currentProfile.latitude,
                longitude: currentProfile.longitude,
                timezone: currentProfile.timezone
            };
            const response = await api.post('tools/gemstones', payload);
            setData(response.data);
        } catch (err: any) {
            console.error("Failed to fetch gemstones", err);
            setError("Failed to load gemstone recommendations. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Helper for Suitability Badge Colors (Dark Theme)
    const getSuitabilityColor = (suitability?: string) => {
        switch (suitability) {
            case "Highly Recommended": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
            case "Suitable": return "bg-indigo-500/20 text-indigo-300 border-indigo-500/40";
            case "Caution": return "bg-amber-500/20 text-amber-300 border-amber-500/40";
            case "Avoid": return "bg-red-500/20 text-red-300 border-red-500/40";
            default: return "bg-slate-500/20 text-slate-300 border-slate-500/40";
        }
    };

    // Component for Individual Gemstone Showcase
    const GemShowcase = ({ data, category, icon: Icon, delay }: { data: GemstoneData, category: string, icon: any, delay: number }) => {
        const [activeTab, setActiveTab] = useState<'essence' | 'ritual' | 'mantra'>('essence');

        return (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay }}
                className="relative group h-full"
            >
                {/* Dark Cosmic Card */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0A0E1F]/80 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50 transition-all duration-500 hover:shadow-[0_20px_50px_-10px_rgba(245,158,11,0.1)] hover:border-amber-500/30 hover:-translate-y-2 h-full flex flex-col">

                    {/* Subtle Glows */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[60px] rounded-full group-hover:bg-amber-500/10 transition-colors" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 blur-[60px] rounded-full" />

                    <div className="relative p-8 flex flex-col h-full z-10">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-slate-900 to-black border border-white/10 text-amber-500 shadow-lg group-hover:scale-110 transition-transform duration-500">
                                    <Icon className="w-5 h-5 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-amber-500/80 transition-colors">{category}</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                                            <div className="w-1 h-1 rounded-full bg-slate-400" />
                                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                                                {data.planet}
                                            </span>
                                        </div>
                                        {data.analysis && (
                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider shadow-sm ${getSuitabilityColor(data.analysis.suitability)}`}>
                                                {data.analysis.suitability === "Highly Recommended" ? "Elite" : data.analysis.suitability}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Title & Gem Name */}
                        <div className="text-center mb-8 relative">
                            <h2 className="text-4xl md:text-5xl font-serif text-white mb-2 drop-shadow-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                                {data.gem_name}
                            </h2>
                            <p className="font-serif italic text-lg text-amber-400/90">"{data.indian_name}"</p>
                        </div>

                        {/* Interaction Tabs */}
                        <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-black/40 border border-white/5 mb-6">
                            {[
                                { id: 'essence', label: 'Power' },
                                { id: 'ritual', label: 'Ritual' },
                                { id: 'mantra', label: 'Mantra' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-300 relative overflow-hidden ${activeTab === tab.id
                                        ? 'bg-amber-500/10 text-amber-400 shadow-[inset_0_0_20px_rgba(245,158,11,0.1)] border border-amber-500/20'
                                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                        }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="activeTabGem"
                                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b]"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Content Area with Fixed Height */}
                        <div className="flex-1 min-h-[160px] relative">
                            <AnimatePresence mode="wait">
                                {activeTab === 'essence' && (
                                    <motion.div
                                        key="essence"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-5"
                                    >
                                        <p className="text-sm leading-relaxed text-slate-300 font-medium text-center px-2">
                                            {data.benefits}
                                        </p>

                                        {/* Metal/Finger Grid */}
                                        <div className="grid grid-cols-2 gap-3 mt-auto">
                                            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center text-center group/item hover:border-amber-500/20 transition-colors">
                                                <Hexagon className="w-4 h-4 text-slate-500 mb-1.5 group-hover/item:text-amber-500 transition-colors" />
                                                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Metal</span>
                                                <span className="text-xs font-bold text-white mt-0.5">{data.wear_metal}</span>
                                            </div>
                                            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center text-center group/item hover:border-amber-500/20 transition-colors">
                                                <div className="w-1 h-4 bg-slate-600 rounded-full mb-1.5 group-hover/item:bg-amber-500 transition-colors" />
                                                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Finger</span>
                                                <span className="text-xs font-bold text-white mt-0.5">{data.wear_finger}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'ritual' && (
                                    <motion.div
                                        key="ritual"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-4"
                                    >
                                        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex gap-4">
                                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400">
                                                <Droplets className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1.5">Purification</h4>
                                                <p className="text-xs text-indigo-200/80 leading-relaxed font-medium">{data.ritual}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                            <Calendar className="w-4 h-4 text-amber-500" />
                                            <div className="flex flex-col">
                                                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Auspicious Time</span>
                                                <span className="text-xs text-white font-bold">{data.wearing_day} <span className="text-slate-500 font-medium">(Shukla Paksha)</span></span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'mantra' && (
                                    <motion.div
                                        key="mantra"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-center space-y-5"
                                    >
                                        <div className="relative p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 overflow-hidden group/mantra hover:bg-amber-500/10 transition-colors">
                                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                                            <Flame className="w-6 h-6 text-amber-500 mx-auto mb-3 animate-pulse" />
                                            <p className="text-lg font-serif italic text-amber-100/90 leading-relaxed drop-shadow-md">
                                                "{data.mantra}"
                                            </p>
                                            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-[9px] font-black text-amber-400 uppercase tracking-widest">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                                Chant 108 Times
                                            </div>
                                        </div>

                                        {data.caution && (
                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-left">
                                                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                                                <p className="text-[10px] text-red-200/80 leading-tight font-medium">
                                                    <strong>Caution:</strong> {data.caution}
                                                </p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <MainLayout title="Cosmic Gemology" breadcrumbs={['Tools', 'Gemstones']}>
            <div className="min-h-screen bg-[#050816] relative overflow-hidden font-sans -mx-4 -my-4 md:-mx-8 md:-my-8 pb-32">

                {/* 1. Background Universe */}
                <StarField />
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/20 blur-[120px] rounded-full mix-blend-screen" />
                    <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-amber-900/10 blur-[100px] rounded-full mix-blend-screen" />
                </div>

                <div className="relative z-10 w-full max-w-[1600px] mx-auto pt-12 px-4 md:px-12">

                    {/* Header */}
                    <header className="text-center max-w-2xl mx-auto mb-16 relative">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg mb-6 group cursor-default hover:bg-white/10 transition-colors">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-12 transition-transform" />
                                <span className="text-[10px] font-black text-amber-100 uppercase tracking-[0.25em]">Vedic Gemology</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-[0.9] drop-shadow-2xl">
                                Crystalline <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">Harmony</span>
                            </h1>
                            <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-xl mx-auto">
                                Discover the stones that resonate with your unique cosmic frequency.
                                Curated for power, protection, and prosperity.
                            </p>
                        </motion.div>
                    </header>

                    {/* Error State */}
                    {error && (
                        <div className="max-w-md mx-auto mt-20 p-6 bg-red-900/20 border border-red-500/30 rounded-2xl text-center backdrop-blur-md">
                            <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-red-200 mb-2">Cosmic Discord</h3>
                            <p className="text-sm text-red-200/70">{error}</p>
                            <button
                                onClick={fetchGemstones}
                                className="mt-6 px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-full text-xs font-black uppercase tracking-widest transition-colors border border-red-500/30"
                            >
                                Realign
                            </button>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-[600px] rounded-[2.5rem] bg-white/5 animate-pulse border border-white/5" />
                            ))}
                        </div>
                    )}

                    {/* Main Content */}
                    {!loading && data && (
                        <div className="max-w-7xl mx-auto">
                            {/* Ascendant Badge */}
                            <div className="flex justify-center mb-16">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="relative group"
                                >
                                    <div className="absolute inset-0 bg-amber-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
                                    <div className="relative px-8 py-3 rounded-2xl bg-[#0A0E1F] border border-white/10 flex items-center gap-4 shadow-2xl">
                                        <div className="flex flex-col text-right">
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Ascendant</span>
                                            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Rising Sign</span>
                                        </div>
                                        <div className="w-px h-8 bg-white/10" />
                                        <div className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                                            <Crown className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                                            {data.ascendant}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Gem Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12 px-2">
                                <GemShowcase
                                    category="Life Stone"
                                    data={data.recommendations.life_stone}
                                    icon={Shield}
                                    delay={0.3}
                                />
                                <GemShowcase
                                    category="Lucky Stone"
                                    data={data.recommendations.lucky_stone}
                                    icon={Star}
                                    delay={0.4}
                                />
                                <GemShowcase
                                    category="Benefic Stone"
                                    data={data.recommendations.benefic_stone}
                                    icon={Diamond}
                                    delay={0.5}
                                />
                            </div>

                            {/* AI CTA */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.6 }}
                                className="flex justify-center mt-24"
                            >
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-amber-500 blur-[60px] opacity-20 group-hover:opacity-30 transition-opacity duration-700" />
                                    <AIReportButton
                                        context={`Deep Gemology Analysis for ${data.ascendant} Ascendant. Analyze strength, metal, and wearing rituals based on current chart.`}
                                        data={data}
                                        buttonText="Consult the Oracle"
                                        className="!bg-[#0A0E1F] hover:!bg-[#0F1429] !text-white !border !border-amber-500/30 !shadow-2xl !px-10 !py-5 !text-xs !tracking-[0.3em] !uppercase !font-black !rounded-2xl relative z-10"
                                    />
                                </div>
                            </motion.div>

                            {/* Footer Note */}
                            <div className="mt-20 text-center max-w-2xl mx-auto pb-12 opacity-60 hover:opacity-100 transition-opacity">
                                <Info className="w-4 h-4 text-slate-500 mx-auto mb-4" />
                                <p className="text-[10px] text-slate-400 leading-loose font-bold tracking-widest uppercase">
                                    Astrological gemstones accelerate planetary karmas. <br />
                                    We recommend a <span className="text-amber-500">Pran Pratishta</span> ceremony before wearing.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default Gemstones;
