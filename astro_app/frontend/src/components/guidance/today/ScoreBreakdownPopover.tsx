import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';

interface ScoreBreakdown {
    dashaContribution: number;
    transitContribution: number;
    nakshatraContribution: number;
    activated: boolean;
    kpConfirmed: boolean;
    reason?: string;
}

interface Props {
    score: number;
    breakdown?: ScoreBreakdown;
    areaLabel: string;
}

const ScoreBreakdownPopover: React.FC<Props> = ({ score, breakdown, areaLabel }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Default breakdown if not provided
    const data = breakdown || {
        dashaContribution: score * 0.4,
        transitContribution: score * 0.35,
        nakshatraContribution: score * 0.25,
        activated: score >= 60,
        kpConfirmed: score >= 70,
    };

    const getScoreColor = (val: number) => {
        if (val >= 80) return 'text-emerald-400';
        if (val >= 60) return 'text-amber-400';
        return 'text-rose-400';
    };

    return (
        <div className="relative inline-flex items-center">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 rounded-full hover:bg-white/10 transition-colors ml-1"
                aria-label="Why this score?"
            >
                <Info className="w-3.5 h-3.5 text-white/40 hover:text-white/60" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Popover */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                            className="absolute left-0 top-full mt-2 z-50 w-64 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-4"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-sm font-semibold text-white">Why this score?</h4>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 rounded-full hover:bg-white/10"
                                >
                                    <X className="w-4 h-4 text-white/40" />
                                </button>
                            </div>

                            {/* Score Display */}
                            <div className="text-center mb-4">
                                <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
                                    {Math.round(score)}
                                </div>
                                <div className="text-xs text-white/50">{areaLabel} Score</div>
                            </div>

                            {/* Breakdown */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-white/60">Dasha Period (40%)</span>
                                    <span className="text-white font-medium">
                                        {Math.round(data.dashaContribution)}
                                    </span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-1.5">
                                    <div
                                        className="bg-purple-500 h-1.5 rounded-full transition-all"
                                        style={{ width: `${Math.min(100, data.dashaContribution)}%` }}
                                    />
                                </div>

                                <div className="flex justify-between items-center text-xs mt-2">
                                    <span className="text-white/60">Transit (35%)</span>
                                    <span className="text-white font-medium">
                                        {Math.round(data.transitContribution)}
                                    </span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-1.5">
                                    <div
                                        className="bg-blue-500 h-1.5 rounded-full transition-all"
                                        style={{ width: `${Math.min(100, data.transitContribution)}%` }}
                                    />
                                </div>

                                <div className="flex justify-between items-center text-xs mt-2">
                                    <span className="text-white/60">Nakshatra (25%)</span>
                                    <span className="text-white font-medium">
                                        {Math.round(data.nakshatraContribution)}
                                    </span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-1.5">
                                    <div
                                        className="bg-teal-500 h-1.5 rounded-full transition-all"
                                        style={{ width: `${Math.min(100, data.nakshatraContribution)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Status Badges */}
                            <div className="flex gap-2 mt-4">
                                <span className={`text-[10px] px-2 py-1 rounded-full ${data.activated ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                                    {data.activated ? '✓ Activated' : '○ Not Activated'}
                                </span>
                                <span className={`text-[10px] px-2 py-1 rounded-full ${data.kpConfirmed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                                    {data.kpConfirmed ? '✓ KP Confirmed' : '○ KP Unconfirmed'}
                                </span>
                            </div>

                            {/* Reason */}
                            {data.reason && (
                                <div className="mt-3 text-xs text-white/50 italic">
                                    {data.reason}
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ScoreBreakdownPopover;
