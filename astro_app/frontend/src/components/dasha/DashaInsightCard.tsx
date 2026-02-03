import React from 'react';
import { Sparkles, Info, Star } from 'lucide-react';

interface DashaInsightCardProps {
    mahadasha: string;
    antardasha: string;
}

const DashaInsightCard: React.FC<DashaInsightCardProps> = ({ mahadasha, antardasha }) => {

    // Simple mock logic for insights - ideally this comes from backend or a robust mapping
    const getInsight = (m: string, a: string) => {
        if (m === 'Saturn') return "A period of discipline, hard work, and karmic restructuring. Expect slow but steady progress.";
        if (m === 'Jupiter') return "A time for expansion, learning, and spiritual growth. Good for wealth and education.";
        if (m === 'Mercury') return "Excellent for business, communication, and learning new skills. Intellectual growth is favored.";
        if (m === 'Venus') return "Focus on relationships, luxury, and creativity. A time to enjoy life's pleasures.";
        if (m === 'Rahu') return "A period of obsession and ambition. Can bring sudden gains but also confusion.";
        if (m === 'Ketu') return "Spiritual detachment and internal seeking. Good for occult studies, challenging for material gain.";
        if (m === 'Sun') return "Focus on authority, career, and vitality. Good for government interactions.";
        if (m === 'Moon') return "Emotional fluctuations and focus on home/mother. Changes in residence possible.";
        if (m === 'Mars') return "High energy and drive. Good for technical work and property, but watch out for aggression.";
        return "Planetary energies are shifting.";
    };

    return (
        <div className="bg-gradient-to-br from-indigo-900/40 to-violet-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 text-indigo-300">
                    <Sparkles className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-white">Cosmic Interpretation</h3>
                    <p className="text-indigo-200 text-sm font-medium">Combined energy of {mahadasha} & {antardasha}</p>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Primary Influence ({mahadasha})</h4>
                    <p className="text-slate-200 leading-relaxed font-medium">
                        {getInsight(mahadasha, antardasha)}
                    </p>
                </div>

                <div className="h-px bg-white/5 w-full"></div>

                <div className="flex gap-4">
                    <div className="flex-1 bg-[#0A0E1F]/50 p-4 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 mb-1">
                            <Star className="w-3 h-3 text-amber-400" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Opportunity</span>
                        </div>
                        <p className="text-xs text-slate-300">Growth in career / High energy</p>
                    </div>
                    <div className="flex-1 bg-[#0A0E1F]/50 p-4 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 mb-1">
                            <Info className="w-3 h-3 text-blue-400" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Caution</span>
                        </div>
                        <p className="text-xs text-slate-300">Avoid impulsive decisions</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashaInsightCard;
