import { Sunrise, Sunset, Moon, Star, Calendar } from 'lucide-react';
import { Panchang } from '../../types/periodAnalysis';

interface AlmanacHeaderProps {
    panchang: Panchang;
}

const AlmanacHeader = ({ panchang }: AlmanacHeaderProps) => {
    return (
        <div className="bg-[#0A0E1F]/80 backdrop-blur-2xl border border-white/10 px-6 py-6 lg:py-8 flex flex-wrap items-center justify-between gap-6 lg:gap-8 text-sm mb-8 rounded-[2rem] shadow-xl">
            {/* Tithi */}
            <div className="flex items-center gap-5 min-w-[180px] flex-1 sm:flex-none">
                <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300 shadow-inner">
                    <Moon className="w-5 h-5 lg:w-6 lg:h-6" />
                </div>
                <div>
                    <span className="block text-slate-500 text-xs font-black uppercase tracking-[0.2em] mb-1">Tithi</span>
                    <span className="font-black text-white text-lg lg:text-xl tracking-tight">{panchang.tithi.name}</span>
                </div>
            </div>

            {/* Nakshatra */}
            <div className="flex items-center gap-5 min-w-[180px] flex-1 sm:flex-none">
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 shadow-inner">
                    <Star className="w-5 h-5 lg:w-6 lg:h-6" />
                </div>
                <div>
                    <span className="block text-slate-500 text-xs font-black uppercase tracking-[0.2em] mb-1">Nakshatra</span>
                    <span className="font-black text-white text-lg lg:text-xl tracking-tight">{panchang.nakshatra.name}</span>
                </div>
            </div>

            {/* Yoga */}
            <div className="flex items-center gap-5 min-w-[180px] flex-1 sm:flex-none">
                <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-300 shadow-inner">
                    <Calendar className="w-5 h-5 lg:w-6 lg:h-6" />
                </div>
                <div>
                    <span className="block text-slate-500 text-xs font-black uppercase tracking-[0.2em] mb-1">Yoga</span>
                    <span className="font-black text-white text-lg lg:text-xl tracking-tight">{panchang.yoga.name}</span>
                </div>
            </div>

            {/* Sun Data */}
            <div className="flex items-center gap-6 lg:gap-8 border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-10 ml-auto w-full lg:w-auto justify-end">
                <div className="flex items-center gap-3">
                    <Sunrise className="w-5 h-5 text-amber-500" />
                    <span className="text-slate-300 font-bold font-mono text-sm tracking-wider">{panchang.sunrise}</span>
                </div>
                <div className="flex items-center gap-3">
                    <Sunset className="w-5 h-5 text-purple-400" />
                    <span className="text-slate-300 font-bold font-mono text-sm tracking-wider">{panchang.sunset}</span>
                </div>
            </div>
        </div>
    );
};

export default AlmanacHeader;
