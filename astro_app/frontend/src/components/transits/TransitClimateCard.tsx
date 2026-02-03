import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sparkles, Wind } from 'lucide-react';

interface TransitClimateCardProps {
    insight: {
        summary: string;
    };
    loading: boolean;
}

const TransitClimateCard: React.FC<TransitClimateCardProps> = ({ insight, loading }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full relative overflow-hidden rounded-[2rem] p-1"
        >
            {/* Background with Glassmorphism */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1A1F35] to-[#0B0F21] opacity-90 backdrop-blur-xl border border-white/10 rounded-[2rem]" />

            {/* Animated Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full animate-pulse" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full" />

            <div className="relative z-10 px-8 py-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">

                {/* Icon Column */}
                <div className="flex-shrink-0">
                    <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                        <Cloud className="w-10 h-10 text-indigo-400" />

                        {/* Orbiting Particles */}
                        <div className="absolute inset-0 animate-spin-slow">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_10px_#818cf8]" />
                        </div>
                    </div>
                </div>

                {/* Content Column */}
                <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                        <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-xs font-black text-indigo-300 uppercase tracking-widest flex items-center gap-2">
                            <Wind className="w-3 h-3" />
                            Cosmic Weather
                        </span>
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                        </span>
                    </div>

                    {loading ? (
                        <div className="space-y-3 animate-pulse">
                            <div className="h-6 bg-white/10 rounded w-3/4 mx-auto md:mx-0" />
                            <div className="h-6 bg-white/10 rounded w-1/2 mx-auto md:mx-0" />
                        </div>
                    ) : (
                        <h2 className="text-2xl md:text-3xl font-serif text-white leading-relaxed drop-shadow-lg">
                            "{insight.summary}"
                        </h2>
                    )}
                </div>

                {/* AI Badge */}
                <div className="absolute bottom-4 right-6 group opacity-50 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2 text-[0.65rem] font-black text-slate-500 uppercase tracking-[0.2em] bg-black/20 px-3 py-1 rounded-full border border-white/5">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        VedaAI Insight
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TransitClimateCard;
