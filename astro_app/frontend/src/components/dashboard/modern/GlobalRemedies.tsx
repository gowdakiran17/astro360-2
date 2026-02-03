import React from 'react';
import { CheckCircle2, Crown, Activity, Feather, Flame, Sparkles, Tent, Music } from 'lucide-react';

interface GlobalRemediesProps {
    ascLord: string;
    VEDIC_REMEDIES: any;
    checkedItems: Record<string, boolean>;
    toggleCheck: (id: string) => void;
}

const UNIVERSAL_HABITS = [
    { title: 'Solar Energized Water', desc: 'Keep water in a gold/copper vessel in sunlight for 2 hours before drinking.', icon: Flame, color: 'text-orange-400' },
    { title: 'Lagna Lord Honor', desc: 'Perform a 1-minute silent meditation focusing on your personal planet daily.', icon: Sparkles, color: 'text-indigo-400' },
    { title: 'Earth Connection', desc: 'Walk barefoot on green grass or natural soil for 10 mins at sunrise.', icon: Tent, color: 'text-emerald-400' },
    { title: 'Sonic Cleansing', desc: 'Play Vedic chants or soft flute music in your living space during twilight.', icon: Music, color: 'text-indigo-300' }
];

const ArtifactCard: React.FC<{ icon: React.ReactNode, type: string, value: string, imageUrl?: string, rationale?: string }> = ({ icon, type, value, imageUrl, rationale }) => (
    <div className="bg-black/40 border border-white/10 p-10 rounded-[2.5rem] group/remedy hover:border-amber-500/30 transition-all relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full" />
        <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-6">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.1)] group-hover/remedy:scale-110 transition-transform">
                    {icon}
                </div>
                <div>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{type}</p>
                    <h5 className="text-3xl font-black text-white tracking-tighter uppercase italic">{value}</h5>
                </div>
            </div>
            {imageUrl && (
                <div className="p-10 rounded-3xl bg-black/40 border border-white/5 shadow-2xl relative">
                    <img src={imageUrl} alt={value} className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/remedy:opacity-100 transition-opacity rounded-3xl" />
                </div>
            )}
        </div>
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
            <p className="text-sm italic leading-relaxed">
                <span className="text-amber-400 font-bold uppercase text-[10px] tracking-widest mr-2">Rationale:</span>
                <span className="text-slate-300 font-light">{rationale}</span>
            </p>
        </div>
    </div>
);

const GlobalRemedies: React.FC<GlobalRemediesProps> = ({ ascLord, VEDIC_REMEDIES, checkedItems, toggleCheck }) => {
    return (
        <div className="space-y-20">
            {/* Section 1: Daily Action Protocol */}
            <div className="bg-[#0A0E1F]/90 rounded-[3rem] border border-white/10 p-10 md:p-12 backdrop-blur-2xl">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <CheckCircle2 className="w-7 h-7 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]" />
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Daily Action Protocol</h3>
                    </div>
                    <div className="hidden md:flex px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-black text-emerald-400 uppercase tracking-widest">
                        Daily Rituals Required
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {UNIVERSAL_HABITS.map((habit, idx) => (
                        <div key={idx} className={`bg-black/40 rounded-[2rem] p-8 border flex flex-col items-center text-center group hover:bg-white/[0.04] transition-all border-dashed
                        ${checkedItems[`universal-${idx}`] ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/10'}
                    `}>
                            <div className="flex items-center justify-between w-full mb-6">
                                <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${habit.color} shadow-lg transition-transform group-hover:scale-110`}>
                                    <habit.icon className="w-5 h-5" />
                                </div>
                                <button
                                    onClick={() => toggleCheck(`universal-${idx}`)}
                                    className={`p-2.5 rounded-xl transition-all border ${checkedItems[`universal-${idx}`] ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/5 text-slate-600 border-white/5 hover:text-white hover:border-white/20'}`}
                                >
                                    <CheckCircle2 className={`w-4 h-4 ${checkedItems[`universal-${idx}`] ? 'fill-emerald-500/20' : ''}`} />
                                </button>
                            </div>
                            <span className={`text-base font-bold text-white mb-2 leading-tight ${checkedItems[`universal-${idx}`] ? 'line-through opacity-40' : ''}`}>{habit.title}</span>
                            <p className={`text-xs text-slate-400 leading-relaxed font-light ${checkedItems[`universal-${idx}`] ? 'opacity-20' : ''}`}>{habit.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 2: Foundational Alignment */}
            <div className="bg-[#0A0E1F]/90 rounded-[3rem] border border-white/10 p-10 md:p-12 backdrop-blur-2xl">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <Crown className="w-7 h-7 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Foundational Alignment</h3>
                    </div>
                    <div className="px-5 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-black text-amber-400 uppercase tracking-widest">
                        Soul Level (Lagna)
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ArtifactCard
                        icon={<Activity className="w-6 h-6 text-slate-300" />}
                        type="Master Metal"
                        value={VEDIC_REMEDIES[ascLord]?.metal || 'Gold'}
                        imageUrl="/remedies/remedy_metal.png"
                        rationale={VEDIC_REMEDIES[ascLord]?.why?.metal}
                    />
                    <ArtifactCard
                        icon={<Feather className="w-6 h-6 text-amber-400" />}
                        type="Bio-Shield"
                        value={VEDIC_REMEDIES[ascLord]?.rudraksha || '5 Mukhi'}
                        imageUrl="/remedies/remedy_rudraksha.png"
                        rationale={VEDIC_REMEDIES[ascLord]?.why?.rudraksha}
                    />
                </div>
            </div>
        </div>
    );
};

export default GlobalRemedies;
