import React from 'react';
import { motion } from 'framer-motion';
import { Target, AlertTriangle, Sparkles, Check } from 'lucide-react';

interface Props {
    primaryFocus: string;
    actions: string[];
    avoid?: string;
    insight?: string;
}

const TodaysFocusCard: React.FC<Props> = ({ primaryFocus, actions, avoid, insight }) => {
    return (
        <section className="px-4 py-2">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-pink-600/20 border border-white/10 p-6"
            >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <Target className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Today's Focus</h2>
                            <p className="text-xs text-white/40">Your priority for today</p>
                        </div>
                    </div>

                    {/* Primary Focus */}
                    <p className="text-xl font-semibold text-white leading-relaxed mb-6">
                        {primaryFocus}
                    </p>

                    {/* Actions */}
                    {actions.length > 0 && (
                        <div className="space-y-3 mb-6">
                            {actions.slice(0, 3).map((action, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
                                >
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    </div>
                                    <p className="text-sm text-white/80 leading-relaxed">{action}</p>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Avoid */}
                    {avoid && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex items-start gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20"
                        >
                            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-bold text-rose-300 uppercase tracking-wide mb-1">Avoid Today</p>
                                <p className="text-sm text-white/70">{avoid}</p>
                            </div>
                        </motion.div>
                    )}

                    {/* Insight */}
                    {insight && (
                        <div className="mt-4 flex items-start gap-2 text-xs text-white/40">
                            <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <p>{insight}</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </section>
    );
};

export default TodaysFocusCard;
