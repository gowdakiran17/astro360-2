import { useState } from 'react';
import { Play, Pause, RefreshCw, Heart, Music, Flame, Gem, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SadeSatiRemedies = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeTab, setActiveTab] = useState<'mantra' | 'rituals' | 'gems'>('mantra');

    const togglePlay = () => setIsPlaying(!isPlaying);

    const TABS = [
        { id: 'mantra', label: 'Shani Mantra', icon: Music },
        { id: 'rituals', label: 'Daily Rituals', icon: Flame },
        { id: 'gems', label: 'Gemstones', icon: Gem },
    ];

    return (
        <div className="bg-[#0A0E1F]/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
            {/* Header Navigation */}
            <div className="flex border-b border-white/5 p-2 overflow-x-auto scrollbar-hide">
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl transition-all duration-300 whitespace-nowrap ${isActive
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                            <span className="text-sm font-black uppercase tracking-wider">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            <div className="p-6 lg:p-10 min-h-[400px]">
                <AnimatePresence mode="wait">
                    {activeTab === 'mantra' && (
                        <motion.div
                            key="mantra"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col items-center justify-center h-full text-center space-y-8"
                        >
                            <div className="relative group cursor-pointer" onClick={togglePlay}>
                                {/* Outer Glow */}
                                <div className={`absolute inset-0 bg-indigo-500 blur-[60px] rounded-full transition-opacity duration-1000 ${isPlaying ? 'opacity-40' : 'opacity-10'}`}></div>

                                {/* Inner Circle */}
                                <div className="relative w-48 h-48 lg:w-64 lg:h-64 rounded-full border border-white/10 bg-[#0F1429] flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-105">
                                    {/* Rotating Ring when playing */}
                                    <div className={`absolute inset-0 rounded-full border border-dashed border-indigo-500/30 ${isPlaying ? 'animate-spin-slow' : ''}`}></div>

                                    {isPlaying ? (
                                        <Pause className="w-16 h-16 text-indigo-400 fill-indigo-400/20" />
                                    ) : (
                                        <Play className="w-16 h-16 text-indigo-400 fill-indigo-400/20 ml-2" />
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4 max-w-lg">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <div className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest border border-indigo-500/30 flex items-center gap-1.5">
                                        <Flame className="w-3 h-3 text-orange-400" />
                                        <span>5 Day Streak</span>
                                    </div>
                                </div>
                                <h3 className="text-3xl font-black text-white tracking-tight">Om Sham Shanicharaya Namah</h3>
                                <p className="text-slate-400 font-medium leading-relaxed">
                                    Chant this mantra 108 times at sunset on Saturdays. It invokes the protective energy of Saturn and helps maintain mental stability.
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <button className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 font-bold text-sm uppercase tracking-wider flex items-center gap-2 transition-colors">
                                    <RefreshCw className="w-4 h-4" /> Reset Count
                                </button>
                                <button className="px-6 py-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold text-sm uppercase tracking-wider flex items-center gap-2 transition-colors">
                                    <BookOpen className="w-4 h-4" /> Read Meaning
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'rituals' && (
                        <motion.div
                            key="rituals"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid gap-4"
                        >
                            <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-3xl flex items-start gap-5">
                                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                                    <Heart className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-white mb-2">Charity & Service</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Saturn represents the working class. Donating food, black clothes, or iron utensils to the needy on Saturdays is the most powerful remedy.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-amber-500/5 border border-amber-500/10 p-6 rounded-3xl flex items-start gap-5">
                                <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                                    <Flame className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-white mb-2">Hanuman Chalisa</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Reciting Hanuman Chalisa creates a protective shield against Saturn's harsh effects. Essential during Peak Phase.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'gems' && (
                        <motion.div
                            key="gems"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-center"
                        >
                            <div className="w-32 h-32 mx-auto bg-blue-900/20 rounded-full blur-3xl mb-4"></div>
                            <Gem className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                            <h3 className="text-2xl font-black text-white mb-2">Blue Sapphire (Neelam)</h3>
                            <p className="text-slate-400 max-w-md mx-auto mb-8 text-sm leading-relaxed">
                                A powerful stone for Saturn. <br />
                                <span className="text-rose-400 font-bold uppercase tracking-wide text-xs block mt-2">
                                    Caution: Wear only after expert consultation.
                                </span>
                            </p>

                            <div className="grid grid-cols-2 gap-4 text-left">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <span className="text-[10px] uppercase font-black text-slate-500 block mb-1">Alternative</span>
                                    <span className="text-white font-bold">Amethyst</span>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <span className="text-[10px] uppercase font-black text-slate-500 block mb-1">Metal</span>
                                    <span className="text-white font-bold">Iron / Silver</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SadeSatiRemedies;
