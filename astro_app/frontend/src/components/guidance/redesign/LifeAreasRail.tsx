import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Heart, Activity, Brain, Coins, MessageCircle, Star } from 'lucide-react';

interface LifeArea {
    key: string;
    label: string;
    score: number;
    icon: string;
}

interface Props {
    areas: LifeArea[];
    activeKey?: string;
    onSelect?: (key: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
    career: Briefcase,
    love: Heart,
    health: Activity,
    decisions: Brain,
    money: Coins,
    relationships: Heart,
    communication: MessageCircle,
    default: Star,
};

const LifeAreasRail: React.FC<Props> = ({ areas, activeKey, onSelect }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const getScoreColor = (score: number) => {
        if (score >= 75) return { bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', text: 'text-emerald-400' };
        if (score >= 50) return { bg: 'bg-amber-500/20', border: 'border-amber-500/30', text: 'text-amber-400' };
        return { bg: 'bg-rose-500/20', border: 'border-rose-500/30', text: 'text-rose-400' };
    };

    return (
        <section className="py-4">
            <div className="px-4 mb-3 flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">Life Areas</h2>
                <span className="text-[10px] text-white/30 uppercase tracking-wide">Tap to explore</span>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {areas.map((area, i) => {
                    const Icon = iconMap[area.icon] || iconMap.default;
                    const colors = getScoreColor(area.score);
                    const isActive = activeKey === area.key;

                    return (
                        <motion.button
                            key={area.key}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => onSelect?.(area.key)}
                            className={`snap-start shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all
                ${colors.bg} ${colors.border}
                ${isActive ? 'ring-2 ring-white/20 scale-105' : 'hover:scale-102'}
              `}
                        >
                            <div className={`w-9 h-9 rounded-xl ${colors.bg} flex items-center justify-center`}>
                                <Icon className={`w-4 h-4 ${colors.text}`} />
                            </div>

                            <div className="text-left">
                                <p className="text-sm font-semibold text-white">{area.label}</p>
                                <p className={`text-lg font-black ${colors.text}`}>{area.score}</p>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </section>
    );
};

export default LifeAreasRail;
