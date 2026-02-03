import { AlertTriangle, CheckCircle, Sparkles, Compass } from 'lucide-react';

interface DailyGuidanceProps {
    predictions: string[];
    luckyFactors: Record<string, string>;
}

const DailyGuidance = ({ predictions, luckyFactors }: DailyGuidanceProps) => {
    // Basic sentiment analysis to split predictions (Mock logic if no category provided)
    const highlights = predictions.filter(p => !p.toLowerCase().includes('avoid') && !p.toLowerCase().includes('caution'));
    const cautions = predictions.filter(p => p.toLowerCase().includes('avoid') || p.toLowerCase().includes('caution'));

    const hasHighlights = highlights.length > 0;
    const hasCautions = cautions.length > 0;

    if (!hasHighlights && !hasCautions) {
        return (
            <div className="glass-card p-8 lg:p-10 border-white/5 flex flex-col items-center justify-center text-center bg-[#0A0E1F]/60 backdrop-blur-xl rounded-[2rem]">
                <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-6 text-slate-500 shadow-inner">
                    <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-white text-xl font-black mb-2 uppercase tracking-wide">Neutral Cosmic Flow</h3>
                <p className="text-sm text-slate-400 max-w-xs font-medium leading-relaxed">No specific highlights or warnings for this period. Maintain your current course with steady intention.</p>

                <div className="mt-8 w-full pt-8 border-t border-white/5 grid grid-cols-2 gap-8 text-xs uppercase tracking-widest">
                    <div>
                        <span className="text-slate-500 font-bold block mb-2">Lucky Color</span>
                        <span className="text-indigo-400 font-black text-sm">{luckyFactors?.color || 'N/A'}</span>
                    </div>
                    <div>
                        <span className="text-slate-500 font-bold block mb-2">Direction</span>
                        <span className="text-indigo-400 font-black text-sm">{luckyFactors?.direction || 'N/A'}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] px-1 ml-2">Cosmic Guidance</h3>

            <div className="grid grid-cols-1 gap-6">
                {/* Highlights Section */}
                {hasHighlights && (
                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-2xl">
                        <h3 className="text-emerald-400 font-black mb-4 flex items-center gap-2.5 uppercase tracking-wider text-xs">
                            <CheckCircle className="w-4 h-4" />
                            Highlights
                        </h3>
                        <ul className="space-y-3.5">
                            {highlights.slice(0, 3).map((p, i) => (
                                <li key={i} className="flex gap-3 text-emerald-100 text-sm lg:text-base leading-relaxed font-medium">
                                    <div className="mt-2 w-1.5 h-1.5 bg-emerald-400 rounded-full flex-shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                                    <span>{p}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Caution Section */}
                {hasCautions && (
                    <div className="bg-rose-500/5 border border-rose-500/10 p-6 rounded-2xl">
                        <h3 className="text-rose-400 font-black mb-4 flex items-center gap-2.5 uppercase tracking-wider text-xs">
                            <AlertTriangle className="w-4 h-4" />
                            Areas for Attention
                        </h3>
                        <ul className="space-y-3.5">
                            {cautions.slice(0, 3).map((p, i) => (
                                <li key={i} className="flex gap-3 text-rose-100 text-sm lg:text-base leading-relaxed font-medium">
                                    <div className="mt-2 w-1.5 h-1.5 bg-rose-400 rounded-full flex-shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
                                    <span>{p}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Lucky Factors Compact */}
                <div className="glass-card p-6 border-white/5 bg-[#0A0E1F]/60 backdrop-blur-xl rounded-2xl">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-slate-500 font-black block uppercase tracking-wider text-[10px] mb-0.5">Lucky Color</span>
                                <span className="text-white font-bold text-sm lg:text-base">{luckyFactors?.color || 'N/A'}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20 shadow-lg shadow-purple-500/5">
                                <Compass className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-slate-500 font-black block uppercase tracking-wider text-[10px] mb-0.5">Direction</span>
                                <span className="text-white font-bold text-sm lg:text-base">{luckyFactors?.direction || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyGuidance;
