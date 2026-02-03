import { Sparkles, MessageCircle, Moon, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CosmicWeatherProps {
    date: Date;
    quote: string;
    moonSign: string;
    moonHouse: number; // House from Natal Moon
    dasha: {
        maha: string;
        antar: string;
    } | null;
    loading?: boolean;
    onAskAI?: () => void;
}

const CosmicWeatherCard = ({
    date,
    quote,
    moonSign,
    moonHouse,
    dasha,
    loading = false,
    onAskAI
}: CosmicWeatherProps) => {

    // Format date: "TUESDAY, FEBRUARY 3, 2026"
    const dateStr = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).toUpperCase();

    // Determine Moon phase icon/text (simplified)
    // In a real app we'd pass exact tithi

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e1b4b] to-[#0f172a] border border-indigo-500/20 shadow-2xl shadow-indigo-900/20"
        >
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10 p-6 md:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2 text-indigo-300 text-sm font-bold tracking-widest">
                        <Sparkles className="w-4 h-4" />
                        <span>COSMIC WEATHER</span>
                    </div>
                    <div className="text-slate-400 text-xs md:text-sm font-medium tracking-wide">
                        {dateStr}
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

                    {/* Quote Section (2/3 width) */}
                    <div className="md:col-span-2 space-y-6">
                        {loading ? (
                            <div className="h-24 bg-white/5 rounded-xl animate-pulse" />
                        ) : (
                            <blockquote className="text-2xl md:text-3xl font-serif text-white leading-relaxed">
                                "{quote}"
                            </blockquote>
                        )}

                        <button
                            onClick={onAskAI}
                            className="inline-flex items-center gap-2 text-sm text-indigo-300 hover:text-white transition-colors group"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span>Ask Gemini about today</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Context Data (1/3 width) */}
                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-4 backdrop-blur-sm">

                        {/* Moon Context */}
                        <div>
                            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Moon currently in</div>
                            <div className="flex items-center gap-2 text-white font-medium">
                                <Moon className="w-4 h-4 text-indigo-400" />
                                <span>{moonSign}</span>
                                <span className="text-slate-500">•</span>
                                <span className="text-indigo-200">{moonHouse}th House</span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1">from your Natal Moon</div>
                        </div>

                        <div className="h-px bg-white/10" />

                        {/* Dasha Context */}
                        <div>
                            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Current Dasha</div>
                            {dasha ? (
                                <div className="text-white font-medium">
                                    <span className="text-indigo-300">{dasha.maha}</span>
                                    <span className="mx-1 text-slate-600">/</span>
                                    <span>{dasha.antar}</span>
                                </div>
                            ) : (
                                <div className="text-slate-600 text-sm">--</div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

        </motion.div>
    );
};

export default CosmicWeatherCard;
