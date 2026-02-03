import React from 'react';
import { ChevronRight, Shield, Clock } from 'lucide-react';

interface Phase {
    id: 'rising' | 'peak' | 'setting';
    name: string;
    dates: string;
    status: 'completed' | 'current' | 'upcoming';
    intensity: number; // 1-5
    themes: string[];
    advice: string;
}

interface SadeSatiPhasesProps {
    currentPhaseId: 'rising' | 'peak' | 'setting';
    phases: Phase[];
}

const SadeSatiPhases: React.FC<SadeSatiPhasesProps> = ({ phases }) => {
    return (
        // Wrapper with negative margins for full-width swipe on mobile
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:overflow-visible scrollbar-hide">
            {phases.map((phase) => {
                const isCurrent = phase.status === 'current';
                const isCompleted = phase.status === 'completed';

                return (
                    <div
                        key={phase.id}
                        className={`
                            snap-center shrink-0 w-[85vw] md:w-auto relative rounded-[2rem] border transition-all duration-300 overflow-hidden group flex flex-col h-full
                            ${isCurrent
                                ? 'bg-[#1E1B4B]/60 backdrop-blur-xl border-indigo-500/40 shadow-2xl shadow-indigo-500/10'
                                : isCompleted
                                    ? 'bg-[#0A0E1F]/60 backdrop-blur-xl border-white/5 opacity-60 hover:opacity-100 hover:border-white/20'
                                    : 'bg-[#0A0E1F]/40 backdrop-blur-xl border-white/5 opacity-40 hover:opacity-80'
                            }
                        `}
                    >
                        {/* Status Badge */}
                        <div className="absolute top-0 right-0 p-5">
                            {isCurrent && (
                                <div className="px-3 py-1.5 bg-indigo-500 text-white text-[10px] font-black uppercase rounded-lg tracking-widest shadow-lg flex items-center gap-1.5 animate-pulse-slow">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div> Current
                                </div>
                            )}
                            {isCompleted && (
                                <div className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase rounded-lg tracking-widest">
                                    Done
                                </div>
                            )}
                        </div>

                        <div className="p-6 lg:p-8 flex flex-col h-full">
                            <h3 className={`text-2xl font-black mb-1 tracking-tight ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                                {phase.name}
                            </h3>
                            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 mb-6 bg-black/20 self-start px-2 py-1 rounded-md">
                                <Clock className="w-3.5 h-3.5" />
                                {phase.dates}
                            </div>

                            {/* Intensity Stars */}
                            <div className="flex gap-1.5 mb-8">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 rounded-full flex-1 transition-all ${i < phase.intensity
                                                ? isCurrent ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]' : 'bg-slate-500'
                                                : 'bg-white/5'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Themes */}
                            <div className="space-y-4 mb-8 flex-1">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Core Themes</h4>
                                <ul className="space-y-3">
                                    {phase.themes.map((theme, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm font-medium text-slate-200">
                                            <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isCurrent ? 'bg-indigo-400 shadow-glow' : 'bg-slate-600'}`}></div>
                                            <span className="leading-snug">{theme}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Key Advice */}
                            <div className={`mt-auto p-5 rounded-2xl text-sm leading-relaxed ${isCurrent
                                    ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-100'
                                    : 'bg-white/[0.03] border border-white/5 text-slate-400'
                                }`}>
                                <div className={`flex items-center gap-2 mb-2 font-black uppercase tracking-wider text-[10px] ${isCurrent ? 'text-indigo-300' : 'text-slate-500'}`}>
                                    <Shield className="w-3.5 h-3.5" /> Cosmic Advice
                                </div>
                                {phase.advice}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SadeSatiPhases;
