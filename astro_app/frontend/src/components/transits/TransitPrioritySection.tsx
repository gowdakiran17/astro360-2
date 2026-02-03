import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Play, Ban, Target } from 'lucide-react';

interface TransitPrioritySectionProps {
    priorities: string[]; // List of transit IDs or Names (for now names)
    actions: {
        do: string[];
        avoid: string[];
    };
    transits: any[]; // Full transit list to find details for priorities
    loading: boolean;
}

const TransitPrioritySection: React.FC<TransitPrioritySectionProps> = ({ priorities, actions, loading }) => {

    // Helper to find transit details by ID/Name if priority list has IDs
    // For MVP we assume priorities is just a list of names/strings provided by AI

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mt-12">

            {/* LEFT: Priority Focus (Top 3) */}
            <div className="col-span-1 lg:col-span-5 flex flex-col gap-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                        <Target className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Cosmic Priorities</h3>
                        <p className="text-xs text-slate-500">If you only focus on 3 things today...</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        [1, 2, 3].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />)
                    ) : (
                        priorities.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative overflow-hidden p-4 rounded-xl bg-[#131728] border border-white/5 hover:border-red-500/30 transition-colors flex items-center gap-4"
                            >
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-red-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-slate-400">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-200 group-hover:text-red-300 transition-colors">
                                        {item}
                                    </p>
                                </div>
                                <ArrowUp className="w-4 h-4 text-slate-600 group-hover:text-red-500 rotate-45 transition-colors" />
                            </motion.div>
                        ))
                    )}

                    {priorities.length === 0 && !loading && (
                        <div className="p-6 text-center text-slate-500 text-sm">
                            No major critical transits today. Flow with the day.
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT: Action Guidance Matrix */}
            <div className="col-span-1 lg:col-span-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">

                    {/* DO List */}
                    <div className="bg-[#0F1426] border border-emerald-500/20 rounded-[2rem] p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                            <Play className="w-16 h-16 text-emerald-500 rotate-12" />
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-emerald-400 font-black uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Optimize Energy (Do)
                            </h3>

                            <ul className="space-y-4">
                                {loading ? (
                                    [1, 2, 3].map(i => <div key={i} className="h-4 bg-white/5 rounded w-3/4 animate-pulse" />)
                                ) : (
                                    actions.do.map((action, i) => (
                                        <motion.li
                                            key={i}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 + (i * 0.1) }}
                                            className="flex items-start gap-3 text-slate-300 text-sm font-medium"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                            {action}
                                        </motion.li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* AVOID List */}
                    <div className="bg-[#0F1426] border border-red-500/20 rounded-[2rem] p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                            <Ban className="w-16 h-16 text-red-500 rotate-12" />
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-red-400 font-black uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                Conserve Energy (Avoid)
                            </h3>

                            <ul className="space-y-4">
                                {loading ? (
                                    [1, 2, 3].map(i => <div key={i} className="h-4 bg-white/5 rounded w-3/4 animate-pulse" />)
                                ) : (
                                    actions.avoid.map((action, i) => (
                                        <motion.li
                                            key={i}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + (i * 0.1) }}
                                            className="flex items-start gap-3 text-slate-300 text-sm font-medium"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                            {action}
                                        </motion.li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TransitPrioritySection;
