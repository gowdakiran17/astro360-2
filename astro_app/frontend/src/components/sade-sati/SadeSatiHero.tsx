import { Share2, Clock, Calendar, AlertCircle } from 'lucide-react';

interface SadeSatiHeroProps {
    status: 'active' | 'completed';
    phase: 'rising' | 'peak' | 'setting';
    startDate: string;
    endDate: string;
    progress: number;
    daysRemaining: number;
}

const SadeSatiHero = ({ status, phase, startDate, endDate, progress, daysRemaining }: SadeSatiHeroProps) => {
    // Phase Configuration
    const phases = {
        rising: {
            title: "Rising Phase",
            subtitle: "The Beginning of Transformation",
            color: "text-blue-400",
            bg: "bg-blue-500",
            gradient: "from-blue-500 to-indigo-600"
        },
        peak: {
            title: "Peak Phase",
            subtitle: "Intense Karmic Cleansing",
            color: "text-rose-400",
            bg: "bg-rose-500",
            gradient: "from-rose-500 to-red-600"
        },
        setting: {
            title: "Setting Phase",
            subtitle: "Resolution & Stability",
            color: "text-emerald-400",
            bg: "bg-emerald-500",
            gradient: "from-emerald-400 to-teal-500"
        }
    };

    const currentConfig = phases[phase];
    const isCompleted = status === 'completed';

    // Format progress for display
    const progressPercent = Math.min(100, Math.max(0, progress));
    const circumference = 2 * Math.PI * 120; // r=120
    const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

    return (
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0A0E1F]/90 backdrop-blur-2xl border border-white/10 p-8 lg:p-12 mb-8 shadow-2xl">
            {/* Dynamic Background Pulse */}
            <div className={`absolute top-0 right-0 w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] bg-gradient-to-br ${currentConfig.gradient} opacity-[0.1] blur-[100px] rounded-full -translate-y-1/2 translate-x-1/4 animate-pulse-slow pointer-events-none`}></div>

            <div className="relative z-10 flex flex-col-reverse lg:flex-row justify-between items-center gap-10 lg:gap-16">

                {/* Left Content */}
                <div className="flex-1 text-center lg:text-left space-y-6">
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                        {isCompleted ? (
                            <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-[0.2em] shadow-lg">
                                Cycle Completed
                            </span>
                        ) : (
                            <span className={`px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 ${currentConfig.color} text-xs font-black uppercase tracking-[0.2em] shadow-lg flex items-center gap-2`}>
                                <div className={`w-2 h-2 rounded-full ${currentConfig.bg} animate-pulse`}></div>
                                Active &bull; {currentConfig.title}
                            </span>
                        )}
                        <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 transition-colors">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-none mb-3">
                            Shani <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Sade Sati</span>
                        </h1>
                        <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            {currentConfig.subtitle}. Saturn's 7.5 year transit brings fundamental changes to structure your life for the next 30 years.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                        <div className="bg-[#0F1429] border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-0.5">Start Date</span>
                                <span className="text-white font-bold text-sm tracking-wide">{startDate || "N/A"}</span>
                            </div>
                        </div>
                        <div className="bg-[#0F1429] border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-0.5">Ends In</span>
                                <span className="text-white font-bold text-sm tracking-wide">{Math.ceil(daysRemaining / 365)} Years</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Circular Progress */}
                <div className="relative shrink-0">
                    {/* Glow Effect behind circle */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${currentConfig.gradient} opacity-20 blur-3xl rounded-full`}></div>

                    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl" viewBox="0 0 260 260">
                            {/* Track */}
                            <circle
                                cx="130"
                                cy="130"
                                r="120"
                                fill="none"
                                stroke="#1E293B"
                                strokeWidth="12" // Thicker track
                                strokeLinecap="round"
                            />
                            {/* Progress */}
                            <circle
                                cx="130"
                                cy="130"
                                r="120"
                                fill="none"
                                stroke="url(#progressGradient)"
                                strokeWidth="12" // Thicker progress
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                            />
                            <defs>
                                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#818CF8" /> {/* Indigo */}
                                    <stop offset="100%" stopColor="#F59E0B" /> {/* Amber */}
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Center Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <div className="w-48 h-48 rounded-full border border-white/5 bg-[#0A0E1F] flex flex-col items-center justify-center shadow-2xl">
                                <span className="text-6xl font-black text-white tracking-tighter mb-1">
                                    {Math.round(progressPercent)}<span className="text-2xl text-slate-500">%</span>
                                </span>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] bg-white/5 px-3 py-1 rounded-full">Complete</span>
                            </div>
                        </div>

                        {/* Orbiting Planet Decor */}
                        <div className="absolute inset-[15px] border border-white/5 rounded-full animate-spin-slow-reverse opacity-50"></div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SadeSatiHero;
