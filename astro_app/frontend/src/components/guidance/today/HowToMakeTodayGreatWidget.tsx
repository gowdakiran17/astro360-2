import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, Circle } from 'lucide-react';

interface TodayTip {
    id: string;
    text: string;
    category: 'mindset' | 'action' | 'avoid';
    completed?: boolean;
}

interface Props {
    tips?: TodayTip[];
}

const defaultTips: TodayTip[] = [
    { id: '1', text: 'Start your morning with 5 minutes of stillness', category: 'mindset' },
    { id: '2', text: 'Complete one important task before noon', category: 'action' },
    { id: '3', text: 'Reach out to someone you care about', category: 'action' },
    { id: '4', text: 'Avoid making major financial decisions', category: 'avoid' },
    { id: '5', text: 'End the day with gratitude journaling', category: 'mindset' },
];

const HowToMakeTodayGreatWidget: React.FC<Props> = ({ tips = defaultTips }) => {
    const [completedTips, setCompletedTips] = useState<Set<string>>(new Set());

    const toggleTip = (id: string) => {
        setCompletedTips(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const getCategoryStyle = (category: string) => {
        switch (category) {
            case 'mindset': return 'border-l-purple-500';
            case 'action': return 'border-l-emerald-500';
            case 'avoid': return 'border-l-rose-500';
            default: return 'border-l-white/20';
        }
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'mindset': return { text: 'Mindset', color: 'text-purple-300' };
            case 'action': return { text: 'Action', color: 'text-emerald-300' };
            case 'avoid': return { text: 'Avoid', color: 'text-rose-300' };
            default: return { text: 'Tip', color: 'text-white/50' };
        }
    };

    const completedCount = completedTips.size;
    const progress = (completedCount / tips.length) * 100;

    return (
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl border border-white/10 p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-bold text-white">Make Today Great</h3>
                </div>
                <span className="text-xs text-white/40">{completedCount}/{tips.length} done</span>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 bg-black/20 rounded-full mb-4 overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
            </div>

            <div className="space-y-2">
                {tips.map((tip, i) => {
                    const isCompleted = completedTips.has(tip.id);
                    const label = getCategoryLabel(tip.category);

                    return (
                        <motion.button
                            key={tip.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => toggleTip(tip.id)}
                            className={`w-full text-left p-3 rounded-xl bg-black/20 border-l-4 ${getCategoryStyle(tip.category)} 
                hover:bg-black/30 transition-all group ${isCompleted ? 'opacity-60' : ''}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                  ${isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-white/30 group-hover:border-white/50'}`}
                                >
                                    {isCompleted ? (
                                        <Check className="w-3 h-3 text-white" />
                                    ) : (
                                        <Circle className="w-2 h-2 text-transparent" />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <span className={`text-sm text-white ${isCompleted ? 'line-through' : ''}`}>
                                        {tip.text}
                                    </span>
                                    <span className={`text-[10px] ml-2 uppercase ${label.color}`}>
                                        {label.text}
                                    </span>
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default HowToMakeTodayGreatWidget;
