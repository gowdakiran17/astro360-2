import React from 'react';
import { motion } from 'framer-motion';
import { Orbit, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PlanetCycle {
    planet: string;
    symbol: string;
    status: 'direct' | 'retrograde' | 'stationary';
    sign: string;
    effect: 'favorable' | 'challenging' | 'neutral';
}

interface Props {
    cycles?: PlanetCycle[];
}

const defaultCycles: PlanetCycle[] = [
    { planet: 'Mercury', symbol: '☿', status: 'direct', sign: 'Aquarius', effect: 'favorable' },
    { planet: 'Venus', symbol: '♀', status: 'direct', sign: 'Pisces', effect: 'favorable' },
    { planet: 'Mars', symbol: '♂', status: 'direct', sign: 'Gemini', effect: 'neutral' },
    { planet: 'Jupiter', symbol: '♃', status: 'direct', sign: 'Taurus', effect: 'favorable' },
    { planet: 'Saturn', symbol: '♄', status: 'direct', sign: 'Pisces', effect: 'challenging' },
];

const PlanetaryCyclesWidget: React.FC<Props> = ({ cycles = defaultCycles }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'retrograde': return 'text-rose-400 bg-rose-500/20';
            case 'stationary': return 'text-amber-400 bg-amber-500/20';
            default: return 'text-emerald-400 bg-emerald-500/20';
        }
    };

    const getEffectIcon = (effect: string) => {
        switch (effect) {
            case 'favorable': return <TrendingUp className="w-3 h-3 text-emerald-400" />;
            case 'challenging': return <TrendingDown className="w-3 h-3 text-rose-400" />;
            default: return <Minus className="w-3 h-3 text-white/40" />;
        }
    };

    return (
        <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
            <div className="flex items-center gap-2 mb-4">
                <Orbit className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-white">Planetary Cycles</h3>
            </div>

            <div className="space-y-2">
                {cycles.map((cycle, i) => (
                    <motion.div
                        key={cycle.planet}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-xl">{cycle.symbol}</span>
                            <div>
                                <span className="text-sm font-medium text-white">{cycle.planet}</span>
                                <span className="text-xs text-white/40 ml-2">in {cycle.sign}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${getStatusColor(cycle.status)}`}>
                                {cycle.status}
                            </span>
                            {getEffectIcon(cycle.effect)}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-4 text-xs text-white/40 text-center">
                Direct = smooth energy • Retrograde = review & reflect
            </div>
        </div>
    );
};

export default PlanetaryCyclesWidget;
