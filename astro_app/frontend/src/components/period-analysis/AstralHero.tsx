import { format } from 'date-fns';
import { Sparkles, Calendar, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface AstralHeroProps {
    date: Date;
    score: number;
    description?: string;
    influences?: string[];
    best?: string;
    caution?: string;
    theme?: string;
}

const AstralHero = ({ date, score, description, influences, best, caution, theme }: AstralHeroProps) => {
    // Determine Color Theme based on Score
    let themeColor = 'from-purple-500 to-indigo-600';
    let shadowColor = 'shadow-purple-500/20';
    let powerWord = "Balanced";
    let accentColor = "text-purple-400";

    if (score >= 80) {
        themeColor = 'from-emerald-400 to-teal-500';
        shadowColor = 'shadow-emerald-500/30';
        powerWord = "Thriving";
        accentColor = "text-emerald-400";
    } else if (score >= 65) {
        themeColor = 'from-amber-400 to-orange-500';
        shadowColor = 'shadow-amber-500/30';
        powerWord = "Prosperous";
        accentColor = "text-amber-400";
    } else if (score >= 50) {
        themeColor = 'from-indigo-400 to-blue-500';
        shadowColor = 'shadow-indigo-500/20';
        powerWord = "Steady";
        accentColor = "text-indigo-400";
    } else {
        themeColor = 'from-rose-500 to-red-600';
        shadowColor = 'shadow-rose-500/30';
        powerWord = "Critical";
        accentColor = "text-rose-400";
    }

    return (
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0A0E1F]/80 backdrop-blur-2xl border border-white/10 p-8 lg:p-12 mb-8 shadow-2xl">
            {/* Dynamic Background Pulse */}
            <div className={`absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br ${themeColor} opacity-[0.08] blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 animate-pulse-slow pointer-events-none`}></div>

            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center lg:items-start gap-10">
                <div className="flex-1 space-y-8">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 shadow-lg">
                            <Calendar className="w-3.5 h-3.5" />
                            {format(date, 'EEEE, MMM do')}
                        </span>

                        {(influences || []).map((inf, i) => (
                            <span key={i} className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-500 shadow-lg shadow-amber-500/10" style={{ animationDelay: `${i * 100}ms` }}>
                                <Sparkles className="w-3 h-3" />
                                {inf}
                            </span>
                        ))}
                    </div>

                    <div>
                        <span className={`font-black text-sm uppercase tracking-[0.3em] mb-2 block ${accentColor}`}>{theme || 'Current Energy'}</span>
                        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none mb-4">
                            {powerWord} <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Alignment</span>
                        </h1>
                        <p className="text-slate-400 max-w-xl text-lg font-medium leading-relaxed">
                            {description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
                        <div className="bg-[#0F1429] border border-white/5 p-6 rounded-3xl flex items-start gap-4 hover:border-emerald-500/30 transition-colors group/card">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover/card:scale-110 transition-transform">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <span className="block text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1">Best For</span>
                                <span className="text-slate-200 font-medium text-sm leading-relaxed">{best || 'Routine Work'}</span>
                            </div>
                        </div>

                        <div className="bg-[#0F1429] border border-white/5 p-6 rounded-3xl flex items-start gap-4 hover:border-rose-500/30 transition-colors group/card">
                            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center shrink-0 border border-rose-500/20 group-hover/card:scale-110 transition-transform">
                                <AlertCircle className="w-5 h-5 text-rose-400" />
                            </div>
                            <div>
                                <span className="block text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-1">Cautious With</span>
                                <span className="text-slate-200 font-medium text-sm leading-relaxed">{caution || 'High Risks'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Score Orb Section */}
                <div className="flex flex-col items-center gap-6 shrink-0 self-center lg:self-start lg:pt-4">
                    <div className="relative group">
                        <div className={`absolute inset-0 bg-gradient-to-br ${themeColor} opacity-20 blur-2xl rounded-full group-hover:opacity-40 transition-opacity duration-700`}></div>
                        <div className={`relative w-48 h-48 rounded-full border border-white/10 bg-[#0F1429] flex items-center justify-center ${shadowColor} shadow-2xl transition-transform duration-700 group-hover:scale-105 group-hover:border-white/20`}>
                            {/* Inner Ring */}
                            <div className="absolute inset-2 rounded-full border border-white/5" />

                            <div className="text-center relative z-10">
                                <span className="block text-6xl font-black text-white tracking-tighter drop-shadow-lg">{score}</span>
                                <span className="block text-[10px] text-slate-400 uppercase tracking-[0.3em] mt-2 font-bold">Daily Score</span>
                            </div>
                        </div>
                        {/* Orbiting Ring Decoration */}
                        <div className={`absolute inset-[-12px] border border-white/5 rounded-full animate-spin-slow ${score >= 80 ? 'border-emerald-500/30' : 'border-amber-500/30'}`}></div>
                    </div>

                    <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/5 text-[10px] uppercase font-bold tracking-widest text-slate-400 hover:bg-white/[0.05] transition-colors">
                        <Info className="w-4 h-4 text-amber-500" />
                        Vedic Score
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AstralHero;
