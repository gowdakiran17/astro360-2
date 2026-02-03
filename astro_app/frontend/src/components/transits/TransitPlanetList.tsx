import React from 'react';
import { motion } from 'framer-motion';

interface TransitPlanetListProps {
    planets: any[];
}

const TransitPlanetList: React.FC<TransitPlanetListProps> = ({ planets }) => {

    // Sort ordering: Major planets first, then inner planets
    const order = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

    const sortedPlanets = [...planets].sort((a, b) => {
        return order.indexOf(a.name) - order.indexOf(b.name);
    });

    const getPlanetColor = (planet: string) => {
        const colors: Record<string, string> = {
            Sun: 'bg-amber-500 text-amber-100',
            Moon: 'bg-slate-300 text-slate-900',
            Mars: 'bg-red-500 text-red-100',
            Mercury: 'bg-emerald-500 text-emerald-100',
            Jupiter: 'bg-yellow-400 text-yellow-900',
            Venus: 'bg-pink-400 text-pink-100',
            Saturn: 'bg-indigo-600 text-indigo-100',
            Rahu: 'bg-stone-600 text-stone-200',
            Ketu: 'bg-stone-500 text-stone-200',
        };
        return colors[planet] || 'bg-blue-500 text-white';
    };

    return (
        <div className="space-y-4 px-1">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 px-2">
                Planetary Positions
            </h3>

            <div className="grid gap-3">
                {sortedPlanets.map((planet, idx) => (
                    <motion.div
                        key={planet.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-[#0A0E1F] border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:border-white/20 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-serif font-bold text-lg shadow-lg ${getPlanetColor(planet.name)}`}>
                                {planet.name[0]}
                            </div>
                            <div>
                                <h4 className="text-white font-bold flex items-center gap-2">
                                    {planet.name}
                                    {planet.is_retrograde && (
                                        <span className="text-[8px] bg-red-500 text-white px-1.5 py-0.5 rounded uppercase font-black tracking-wider">Rx</span>
                                    )}
                                </h4>
                                <div className="text-slate-400 text-xs font-medium">
                                    {planet.zodiac_sign} • {planet.nakshatra}
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-white font-mono font-bold text-sm">
                                {(planet.longitude % 30).toFixed(2)}°
                            </div>
                            <div className="text-slate-500 text-[10px] font-bold uppercase">
                                Pada {planet.pada}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default TransitPlanetList;
