import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gem, Heart, Pill } from 'lucide-react';

interface TarotData {
    cardName: string;
    meaning: string;
    interpretation: string;
}

interface LuckyData {
    color: string;
    colorHex: string;
    number: number;
    direction: string;
    timeRange: string;
}

interface RemedyData {
    title: string;
    description: string;
    type: string;
}

interface Props {
    tarot?: TarotData;
    lucky?: LuckyData;
    remedy?: RemedyData;
}

type TabKey = 'tarot' | 'lucky' | 'remedy';

const DailyExtrasTabs: React.FC<Props> = ({ tarot, lucky, remedy }) => {
    const [activeTab, setActiveTab] = useState<TabKey>('tarot');

    const tabs: { key: TabKey; label: string; icon: React.ElementType; available: boolean }[] = [
        { key: 'tarot', label: 'Tarot', icon: Sparkles, available: !!tarot },
        { key: 'lucky', label: 'Lucky', icon: Gem, available: !!lucky },
        { key: 'remedy', label: 'Remedy', icon: Pill, available: !!remedy },
    ];

    const availableTabs = tabs.filter(t => t.available);

    if (availableTabs.length === 0) return null;

    return (
        <section className="px-4 py-2">
            <div className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
                {/* Tab Headers */}
                <div className="flex border-b border-white/10">
                    {availableTabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.key;

                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-all relative
                  ${isActive ? 'text-white' : 'text-white/40 hover:text-white/60'}
                `}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{tab.label}</span>

                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="p-5 min-h-[180px]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'tarot' && tarot && (
                            <motion.div
                                key="tarot"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-center"
                            >
                                <div className="text-4xl mb-3">🔮</div>
                                <h3 className="text-lg font-bold text-white mb-2">{tarot.cardName}</h3>
                                <p className="text-sm text-purple-300 mb-3">{tarot.meaning}</p>
                                <p className="text-xs text-white/50 leading-relaxed">{tarot.interpretation}</p>
                            </motion.div>
                        )}

                        {activeTab === 'lucky' && lucky && (
                            <motion.div
                                key="lucky"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-xl bg-black/20 text-center">
                                        <div
                                            className="w-10 h-10 rounded-full mx-auto mb-2 border-2 border-white/20"
                                            style={{ backgroundColor: lucky.colorHex }}
                                        />
                                        <span className="text-[10px] text-white/40 uppercase block">Color</span>
                                        <span className="text-sm font-medium text-white">{lucky.color}</span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-black/20 text-center">
                                        <div className="text-2xl font-black text-amber-400 mb-1">{lucky.number}</div>
                                        <span className="text-[10px] text-white/40 uppercase block">Number</span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-black/20 text-center">
                                        <span className="text-[10px] text-white/40 uppercase block mb-1">Direction</span>
                                        <span className="text-sm font-medium text-white">{lucky.direction}</span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-black/20 text-center">
                                        <span className="text-[10px] text-white/40 uppercase block mb-1">Power Time</span>
                                        <span className="text-sm font-medium text-emerald-400">{lucky.timeRange}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'remedy' && remedy && (
                            <motion.div
                                key="remedy"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-center"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                                    <Heart className="w-7 h-7 text-emerald-400" />
                                </div>
                                <span className="text-xs text-emerald-400 uppercase tracking-wide font-bold">{remedy.type}</span>
                                <h3 className="text-lg font-bold text-white mt-2 mb-2">{remedy.title}</h3>
                                <p className="text-sm text-white/60">{remedy.description}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default DailyExtrasTabs;
