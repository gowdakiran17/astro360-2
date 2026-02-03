import { Sunrise, Sunset, Moon, Star, Calendar } from 'lucide-react';
import { Panchang } from '../../types/periodAnalysis';

interface AlmanacHeaderProps {
    panchang: Panchang;
}

const AlmanacHeader = ({ panchang }: AlmanacHeaderProps) => {
    return (
        <div className="bg-[#0A0E1F]/80 backdrop-blur-2xl border border-white/10 px-6 py-5 flex flex-wrap items-center justify-between gap-6 text-sm mb-8 rounded-[1.5rem] shadow-xl">
            {/* Tithi */}
            <div className="flex items-center gap-4 min-w-[160px]">
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 shadow-inner">
                    <Moon className="w-4 h-4" />
                </div>
                <div>
                    <span className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">Tithi</span>
                    <span className="font-bold text-white text-base tracking-tight">{panchang.tithi.name}</span>
                </div>
            </div>

            {/* Nakshatra */}
            <div className="flex items-center gap-4 min-w-[160px]">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 shadow-inner">
                    <Star className="w-4 h-4" />
                </div>
                <div>
                    <span className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">Nakshatra</span>
                    <span className="font-bold text-white text-base tracking-tight">{panchang.nakshatra.name}</span>
                </div>
            </div>

            {/* Yoga */}
            <div className="flex items-center gap-4 min-w-[160px]">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 shadow-inner">
                    <Calendar className="w-4 h-4" />
                </div>
                <div>
                    <span className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">Yoga</span>
                    <span className="font-bold text-white text-base tracking-tight">{panchang.yoga.name}</span>
                </div>
            </div>

            {/* Sun Data */}
            <div className="flex items-center gap-6 border-l border-white/10 pl-8 ml-auto">
                <div className="flex items-center gap-2.5">
                    <Sunrise className="w-4 h-4 text-amber-500" />
                    <span className="text-slate-300 font-bold font-mono text-xs tracking-wider">{panchang.sunrise}</span>
                </div>
                <div className="flex items-center gap-2.5">
                    <Sunset className="w-4 h-4 text-purple-400" />
                    <span className="text-slate-300 font-bold font-mono text-xs tracking-wider">{panchang.sunset}</span>
                </div>
            </div>
        </div>
    );
};

export default AlmanacHeader;
