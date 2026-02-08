import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import { TransitAlert } from '../../../types/guidance';

interface Props {
    transits?: TransitAlert[];
}

const defaultTransits: TransitAlert[] = [
    { planet: 'Moon', event: 'enters Gemini', date: 'Today 2:30 PM', impact: 'medium', description: 'Increased mental activity' },
    { planet: 'Venus', event: 'conjunct Jupiter', date: 'Tomorrow', impact: 'high', description: 'Excellent for relationships' },
    { planet: 'Mars', event: 'trine Saturn', date: 'Feb 10', impact: 'medium', description: 'Disciplined energy' },
];

const TransitCalendarWidget: React.FC<Props> = ({ transits = defaultTransits }) => {
    const getImpactColor = (impact: string) => {
        switch (impact) {
            case 'high': return 'bg-purple-500 border-purple-400';
            case 'medium': return 'bg-blue-500 border-blue-400';
            default: return 'bg-slate-500 border-slate-400';
        }
    };

    const getPlanetSymbol = (planet: string) => {
        const symbols: Record<string, string> = {
            'Sun': '☉', 'Moon': '☽', 'Mercury': '☿', 'Venus': '♀',
            'Mars': '♂', 'Jupiter': '♃', 'Saturn': '♄', 'Rahu': '☊', 'Ketu': '☋'
        };
        return symbols[planet] || '●';
    };

    return (
        <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-bold text-white">Transit Calendar</h3>
                </div>
                <button className="text-xs text-white/40 hover:text-white/60 flex items-center gap-1 transition-colors">
                    Full Calendar <ChevronRight className="w-3 h-3" />
                </button>
            </div>

            <div className="space-y-3">
                {transits.map((transit, i) => (
                    <div
                        key={i}
                        className="flex gap-3 p-3 bg-black/20 rounded-xl border border-white/5 hover:border-white/10 transition-colors group cursor-pointer"
                    >
                        {/* Timeline indicator */}
                        <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full border-2 ${getImpactColor(transit.impact)}`} />
                            {i < transits.length - 1 && (
                                <div className="w-0.5 flex-1 bg-white/10 mt-1" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{getPlanetSymbol(transit.planet)}</span>
                                    <span className="text-sm font-medium text-white">
                                        {transit.planet} {transit.event}
                                    </span>
                                </div>
                                <span className="text-xs text-white/40 shrink-0">{transit.date}</span>
                            </div>
                            <p className="text-xs text-white/50 group-hover:text-white/70 transition-colors">
                                {transit.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransitCalendarWidget;
