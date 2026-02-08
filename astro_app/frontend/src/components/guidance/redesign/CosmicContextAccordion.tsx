import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Moon, Orbit, Timer } from 'lucide-react';

interface CosmicInfo {
    dasha?: { period: string; theme: string };
    transit?: { planet: string; event: string; effect: string };
    moon?: { phase: string; nakshatra: string };
}

interface Props {
    cosmic: CosmicInfo;
}

const CosmicContextAccordion: React.FC<Props> = ({ cosmic }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <section className="px-4 py-2">
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 transition-colors group"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                        <Orbit className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="text-left">
                        <h2 className="text-sm font-bold text-white">Cosmic Context</h2>
                        <p className="text-xs text-white/40">Why today feels this way</p>
                    </div>
                </div>

                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10"
                >
                    <ChevronDown className="w-4 h-4 text-white/50" />
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-3 space-y-3">
                            {/* Dasha */}
                            {cosmic.dasha && (
                                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Timer className="w-4 h-4 text-indigo-400" />
                                        <span className="text-xs font-bold text-indigo-300 uppercase tracking-wide">Current Dasha</span>
                                    </div>
                                    <p className="text-sm font-semibold text-white">{cosmic.dasha.period}</p>
                                    <p className="text-xs text-white/50 mt-1">{cosmic.dasha.theme}</p>
                                </div>
                            )}

                            {/* Transit */}
                            {cosmic.transit && (
                                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Orbit className="w-4 h-4 text-blue-400" />
                                        <span className="text-xs font-bold text-blue-300 uppercase tracking-wide">Key Transit</span>
                                    </div>
                                    <p className="text-sm font-semibold text-white">{cosmic.transit.planet} {cosmic.transit.event}</p>
                                    <p className="text-xs text-white/50 mt-1">{cosmic.transit.effect}</p>
                                </div>
                            )}

                            {/* Moon */}
                            {cosmic.moon && (
                                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Moon className="w-4 h-4 text-purple-400" />
                                        <span className="text-xs font-bold text-purple-300 uppercase tracking-wide">Moon Phase</span>
                                    </div>
                                    <p className="text-sm font-semibold text-white">{cosmic.moon.phase}</p>
                                    <p className="text-xs text-white/50 mt-1">Nakshatra: {cosmic.moon.nakshatra}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default CosmicContextAccordion;
