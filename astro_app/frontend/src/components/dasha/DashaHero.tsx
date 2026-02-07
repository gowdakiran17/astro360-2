import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, ChevronRight } from 'lucide-react';

interface DashaHeroProps {
    currentMahadasha: string;
    startDate: string;
    endDate: string;
    durationYears: number;
    balanceYears?: number;
}

// Map planets to colors
const PLANET_THEMES: Record<string, { color: string; gradient: string; icon: string }> = {
    Sun: { color: 'text-[#F5A623]', gradient: 'from-[#F5A623] to-[#E59612]', icon: '☀️' },
    Moon: { color: 'text-[#A9B0C2]', gradient: 'from-[#A9B0C2] to-[#8F96A8]', icon: '🌙' },
    Mars: { color: 'text-[#E25555]', gradient: 'from-[#E25555] to-[#C13333]', icon: '♂️' },
    Mercury: { color: 'text-[#2ED573]', gradient: 'from-[#2ED573] to-[#26B360]', icon: '☿️' },
    Jupiter: { color: 'text-[#F5A623]', gradient: 'from-[#F5A623] to-[#E59612]', icon: '♃' },
    Venus: { color: 'text-[#EDEFF5]', gradient: 'from-[#EDEFF5] to-[#D1D5DB]', icon: '♀️' },
    Saturn: { color: 'text-[#6D5DF6]', gradient: 'from-[#6D5DF6] to-[#5B4BC4]', icon: '🪐' },
    Rahu: { color: 'text-[#6F768A]', gradient: 'from-[#6F768A] to-[#4A5568]', icon: '☊' },
    Ketu: { color: 'text-[#6F768A]', gradient: 'from-[#6F768A] to-[#4A5568]', icon: '☋' }
};

const DashaHero: React.FC<DashaHeroProps> = ({ currentMahadasha, startDate, endDate, durationYears }) => {
    const theme = PLANET_THEMES[currentMahadasha] || PLANET_THEMES['Saturn'];

    // Parse Dates
    const start = new Date(startDate.split('/').reverse().join('-'));
    const end = new Date(endDate.split('/').reverse().join('-'));
    const now = new Date();

    // Calculate Progress
    const totalTime = end.getTime() - start.getTime();
    const elapsedTime = now.getTime() - start.getTime();
    const progress = Math.min(100, Math.max(0, (elapsedTime / totalTime) * 100));

    const yearsRemaining = Math.max(0, ((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 365.25))).toFixed(1);

    return (
        <div className="relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 border border-[rgba(255,255,255,0.08)] group">
            {/* Dynamic Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-10`} />
            <div className="absolute inset-0 bg-[#11162A]/80 backdrop-blur-xl" />

            {/* Decorative Glow */}
            <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${theme.gradient} opacity-20 blur-[100px] rounded-full transform translate-x-1/3 -translate-y-1/3`} />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">

                {/* Left: Text Content */}
                <div className="flex-1 text-center md:text-left space-y-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] backdrop-blur-md mb-4">
                            <span className="relative flex h-2 w-2">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${theme.color.replace('text', 'bg')}`}></span>
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${theme.color.replace('text', 'bg')}`}></span>
                            </span>
                            <span className="text-[10px] uppercase font-black tracking-widest text-[#A9B0C2]">Current Era</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-[#EDEFF5] tracking-tighter mb-2">
                            <span className={`bg-clip-text text-transparent bg-gradient-to-r ${theme.gradient}`}>
                                {currentMahadasha}
                            </span> <span className="text-[#6F768A] text-3xl md:text-5xl font-light">Mahadasha</span>
                        </h1>

                        <p className="text-[#A9B0C2] text-lg md:text-xl font-medium max-w-xl mx-auto md:mx-0 leading-relaxed">
                            A {durationYears}-year cycle of <span className="text-[#EDEFF5] font-bold">transformation</span> driven by the energy of {currentMahadasha}.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-bold text-[#A9B0C2]">
                        <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.04)] px-4 py-2 rounded-xl border border-[rgba(255,255,255,0.08)]">
                            <Calendar className="w-4 h-4 text-[#6F768A]" />
                            <span>{startDate}</span>
                            <ChevronRight className="w-3 h-3 text-[#6F768A]" />
                            <span className="text-[#EDEFF5]">{endDate}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.04)] px-4 py-2 rounded-xl border border-[rgba(255,255,255,0.08)]">
                            <Clock className="w-4 h-4 text-[#6F768A]" />
                            <span className={theme.color}>{yearsRemaining} Years Remaining</span>
                        </div>
                    </div>
                </div>

                {/* Right: Circular Progress */}
                <div className="relative flex-shrink-0">
                    {/* Outer Rings */}
                    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
                        {/* Track */}
                        <svg className="absolute inset-0 w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                            {/* Progress */}
                            <motion.circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke={`url(#gradient-${currentMahadasha})`}
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeDasharray="283"
                                initial={{ strokeDashoffset: 283 }}
                                animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
                                transition={{ duration: 2, ease: "easeOut" }}
                            />
                            <defs>
                                <linearGradient id={`gradient-${currentMahadasha}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor={theme.gradient.split(' ')[0].replace('from-', '')} /> // Fallback simplified color extraction logic or use hex
                                    <stop offset="100%" stopColor="#fff" stopOpacity="0.5" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Inner Content */}
                        <div className="absolute inset-4 rounded-full bg-[#0B0F1A] shadow-2xl flex flex-col items-center justify-center border border-[rgba(255,255,255,0.08)]">
                            <span className="text-6xl mb-2">{theme.icon}</span>
                            <div className="text-center">
                                <span className={`text-3xl font-black ${theme.color}`}>{Math.round(progress)}%</span>
                                <span className="block text-[10px] uppercase tracking-widest text-[#6F768A] font-bold mt-1">Complete</span>
                            </div>
                        </div>

                        {/* Orbiting Particles */}
                        <div className="absolute inset-0 animate-spin-slow opacity-30 pointer-events-none">
                            <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 rounded-full ${theme.color.replace('text', 'bg')} shadow-[0_0_10px_currentColor]`} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashaHero;
