import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Clock, Sparkles, ChevronRight
} from 'lucide-react';

interface DashaPeriod {
    maha: string;
    antar: string | null;
    mahaEnd: Date;
    antarEnd: Date | null;
}

interface DashaInfo {
    theme: string;
    color: string;
    desc: string;
}

interface CurrentDashaCardProps {
    currentDasha: DashaPeriod | null;
    dashaInfo: DashaInfo | null;
}

const PLANET_COLORS: Record<string, string> = {
    'Sun': 'text-orange-400',
    'Moon': 'text-blue-400',
    'Mars': 'text-red-400',
    'Mercury': 'text-emerald-400',
    'Jupiter': 'text-yellow-400',
    'Venus': 'text-pink-400',
    'Saturn': 'text-indigo-400',
    'Rahu': 'text-slate-400',
    'Ketu': 'text-orange-400'
};

const CurrentDashaCard: React.FC<CurrentDashaCardProps> = ({ currentDasha, dashaInfo }) => {
    const navigate = useNavigate();

    if (!currentDasha || !dashaInfo) return null;

    // Safety checks
    if (!currentDasha.maha) return null;

    const planetColorClass = PLANET_COLORS[currentDasha.maha] || 'text-white';

    // Calculate approximate progress (mock logic as full start date isn't always passed)
    const progressPercent = 65;

    const getSafeYear = (date: Date) => {
        if (date instanceof Date && !isNaN(date.getTime())) return date.getFullYear();
        return 'N/A';
    };

    

    return (
        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/30">
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-400" />
                    Current Planetary Period
                </h3>
                <button
                    onClick={() => navigate('/dasha')}
                    className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 group-hover:text-white">Full Timeline</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visual & Core Info */}
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <span className={`text-6xl font-bold ${planetColorClass} drop-shadow-sm`}>
                                {currentDasha.maha.charAt(0)}
                            </span>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-slate-800 border border-slate-600 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                            Maha
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Ruling Planet</div>
                        <h2 className={`text-3xl font-bold ${planetColorClass} mb-1`}>{currentDasha.maha}</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white bg-white/10 px-2 py-0.5 rounded">
                                Ends {getSafeYear(currentDasha.mahaEnd)}
                            </span>
                            <span className="text-xs text-slate-500">
                                {progressPercent}% Complete
                            </span>
                        </div>
                    </div>
                </div>

                {/* Theme & Details */}
                <div className="space-y-4">
                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Era Theme</div>
                        <h3 className="text-xl font-bold text-white mb-2">{dashaInfo.theme}</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">{dashaInfo.desc}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${planetColorClass.replace('text-', 'bg-')}`}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Sub-Period (Antar) Section */}
            {currentDasha.antar && (
                <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Sub-Period Info */}
                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                            <span className={`text-xl font-bold ${PLANET_COLORS[currentDasha.antar] || 'text-white'}`}>
                                {currentDasha.antar.charAt(0)}
                            </span>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-500">Sub-Period (Antar)</p>
                            <p className="text-white font-bold">{currentDasha.antar} Influence</p>
                        </div>
                        {currentDasha.antarEnd && (
                            <div className="ml-auto text-right">
                                <p className="text-[10px] text-slate-500">Ends</p>
                                <p className="text-xs text-white font-mono">{currentDasha.antarEnd.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</p>
                            </div>
                        )}
                    </div>

                    {/* Quick Insight */}
                    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg p-4 border border-amber-500/20 flex items-start gap-3">
                        <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wide mb-1">Cosmic Insight</p>
                            <p className="text-xs text-amber-100/80 leading-relaxed">
                                The {currentDasha.maha}-{currentDasha.antar} period blends {currentDasha.maha === 'Saturn' ? 'discipline' : 'energy'} with {currentDasha.antar === 'Venus' ? 'creativity' : 'focus'}.
                                {/* Simple dynamic text based on planets could go here */}
                                Stay balanced.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurrentDashaCard;
