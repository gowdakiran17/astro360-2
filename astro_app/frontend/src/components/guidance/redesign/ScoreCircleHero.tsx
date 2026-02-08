import React from 'react';
import { motion } from 'framer-motion';

interface Props {
    score: number;
    theme: string;
    dateLabel: string;
    vedicLabel?: string;
    moonPhase?: string;
}

const ScoreCircleHero: React.FC<Props> = ({
    score,
    theme,
    dateLabel,
    vedicLabel,
    moonPhase
}) => {
    // Calculate color based on score
    const getScoreColor = () => {
        if (score >= 75) return { ring: 'from-emerald-400 to-teal-500', text: 'text-emerald-400', glow: 'shadow-emerald-500/30' };
        if (score >= 50) return { ring: 'from-amber-400 to-orange-500', text: 'text-amber-400', glow: 'shadow-amber-500/30' };
        return { ring: 'from-rose-400 to-pink-500', text: 'text-rose-400', glow: 'shadow-rose-500/30' };
    };

    const colors = getScoreColor();
    const circumference = 2 * Math.PI * 88; // radius = 88
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <section className="relative py-8 px-4">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
                {/* Date & Vedic Info */}
                <div className="text-center mb-6">
                    <p className="text-white/40 text-xs font-medium uppercase tracking-widest">{dateLabel}</p>
                    {vedicLabel && (
                        <p className="text-white/30 text-[10px] mt-1">{vedicLabel}</p>
                    )}
                </div>

                {/* Score Circle */}
                <div className="relative w-52 h-52 flex items-center justify-center mb-6">
                    {/* Glow effect */}
                    <div className={`absolute inset-4 rounded-full bg-gradient-to-br ${colors.ring} opacity-10 blur-2xl`} />

                    {/* Background ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle
                            cx="104"
                            cy="104"
                            r="88"
                            fill="none"
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="12"
                        />
                    </svg>

                    {/* Animated progress ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <motion.circle
                            cx="104"
                            cy="104"
                            r="88"
                            fill="none"
                            stroke="url(#scoreGradient)"
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                        />
                        <defs>
                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={score >= 75 ? '#34d399' : score >= 50 ? '#fbbf24' : '#fb7185'} />
                                <stop offset="100%" stopColor={score >= 75 ? '#14b8a6' : score >= 50 ? '#f97316' : '#ec4899'} />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Center content */}
                    <div className="relative text-center">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <span className={`text-6xl font-black ${colors.text}`}>{Math.round(score)}</span>
                            <span className="text-white/30 text-lg font-medium ml-1">/100</span>
                        </motion.div>
                        {moonPhase && (
                            <p className="text-white/40 text-xs mt-1">{moonPhase}</p>
                        )}
                    </div>
                </div>

                {/* Theme text */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-xl md:text-2xl font-bold text-white text-center max-w-sm leading-relaxed"
                >
                    {theme}
                </motion.h1>
            </div>
        </section>
    );
};

export default ScoreCircleHero;
