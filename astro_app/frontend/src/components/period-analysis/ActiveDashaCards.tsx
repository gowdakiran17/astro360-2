import { DashboardOverviewResponse } from '../../types/periodAnalysis';
import { Star, Sunrise, Sunset, Info } from 'lucide-react';
import { NAKSHATRA_DATA } from '../../utils/nakshatraData';

interface QuickReferenceWidgetProps {
    data: DashboardOverviewResponse;
}

const QuickReferenceWidget = ({ data }: QuickReferenceWidgetProps) => {
    const { chart_details, dasha_info } = data;

    // Fallbacks if chart_details not yet populated fully in all envs
    const lagna = chart_details?.lagna || { sign: "Unknown", degree_str: "0°0'" };
    const moon = chart_details?.moon_sign || { sign: "Unknown", degree_str: "0°0'" };
    const sun = chart_details?.sun_sign || { sign: "Unknown", degree_str: "0°0'" };
    const nak = chart_details?.nakshatra || { name: "Unknown", pada: 1 };

    // Helper to get nakshatra data case-insensitively
    const getNakshatraMeta = (name: string) => {
        if (!name || name === "Unknown") return { deity: "Unknown", symbol: "Unknown", quality: "Unknown" };

        // 1. Try exact match
        if (NAKSHATRA_DATA[name]) return NAKSHATRA_DATA[name];

        // 2. Try case-insensitive match (trimmed)
        const cleanName = name.toLowerCase().trim();
        const key = Object.keys(NAKSHATRA_DATA).find(k => k.toLowerCase().trim() === cleanName);
        if (key) return NAKSHATRA_DATA[key];

        // 3. Try fuzzy match (remove spaces and special chars) - e.g. "PurvaAshadha" vs "Purva Ashadha"
        const fuzzyName = cleanName.replace(/[^a-z0-9]/g, '');
        const fuzzyKey = Object.keys(NAKSHATRA_DATA).find(k => k.toLowerCase().replace(/[^a-z0-9]/g, '') === fuzzyName);
        if (fuzzyKey) return NAKSHATRA_DATA[fuzzyKey];

        return { deity: "Unknown", symbol: "Unknown", quality: "Unknown" };
    };

    const meta = getNakshatraMeta(nak.name);

    // Dasha Logic
    const currentMD = dasha_info?.current?.current_mahadasha;
    const currentAD = dasha_info?.current?.current_antardasha;

    // Dasha Progress
    const mdProgress = currentMD?.progress_percent || 50;
    const adProgress = currentAD?.progress_percent || 30;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full">

            {/* CARD 1: CHART DETAILS */}
            <div className="relative overflow-hidden rounded-[2rem] bg-[#0A0E1F]/80 backdrop-blur-2xl border border-white/10 p-6 lg:p-8 flex flex-col justify-between h-[320px] group hover:border-amber-500/30 transition-all duration-500 shadow-xl">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-white font-black uppercase tracking-[0.15em] text-sm flex items-center gap-2">
                        <div className="w-1 h-5 bg-amber-500 rounded-full" />
                        Chart Details
                    </h3>
                    <Info className="w-5 h-5 text-slate-500" />
                </div>

                <div className="space-y-5 flex-1 mt-2">
                    <div className="flex justify-between items-center border-b border-white/5 pb-4 group-hover:border-white/10 transition-colors">
                        <span className="text-slate-400 text-xs font-black uppercase tracking-widest">Lagna</span>
                        <div className="text-right">
                            <span className="text-white text-lg font-bold block">{lagna.sign}</span>
                            <span className="text-xs text-amber-500 font-mono tracking-wider font-bold">{lagna.degree_str}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-4 group-hover:border-white/10 transition-colors">
                        <span className="text-slate-400 text-xs font-black uppercase tracking-widest">Moon Sign</span>
                        <div className="text-right">
                            <span className="text-white text-lg font-bold block">{moon.sign}</span>
                            <span className="text-xs text-amber-500 font-mono tracking-wider font-bold">{moon.degree_str}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-4 group-hover:border-white/10 transition-colors">
                        <span className="text-slate-400 text-xs font-black uppercase tracking-widest">Sun Sign</span>
                        <div className="text-right">
                            <span className="text-white text-lg font-bold block">{sun.sign}</span>
                            <span className="text-xs text-amber-500 font-mono tracking-wider font-bold">{sun.degree_str}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3">
                        <Sunrise className="w-5 h-5 text-amber-500" />
                        <span className="text-sm text-slate-300 font-bold">{chart_details?.sunrise || "06:00 AM"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Sunset className="w-5 h-5 text-purple-400" />
                        <span className="text-sm text-slate-300 font-bold">{chart_details?.sunset || "06:00 PM"}</span>
                    </div>
                </div>
            </div>

            {/* CARD 2: MOON NAKSHATRA */}
            <div className="relative overflow-hidden rounded-[2rem] bg-[#0A0E1F]/80 backdrop-blur-2xl border border-white/10 p-6 lg:p-8 flex flex-col justify-between h-[320px] group hover:border-purple-500/30 transition-all duration-500 shadow-xl">
                {/* Background Decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-amber-900/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                <Star className="absolute -top-6 -right-6 w-48 h-48 text-purple-500/5 rotate-12 group-hover:rotate-[20deg] transition-transform duration-1000" />

                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-purple-200 font-black uppercase tracking-[0.15em] text-sm flex items-center gap-2">
                            <div className="w-1 h-5 bg-purple-500 rounded-full" />
                            Moon Nakshatra
                        </h3>
                        <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                            <Star className="w-5 h-5 text-purple-400 fill-purple-400/20" />
                        </div>
                    </div>

                    <div className="mb-6 mt-auto">
                        <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight leading-none">{nak.name}</h2>
                        <span className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-black uppercase tracking-[0.2em] text-purple-200 shadow-lg">
                            Pada {nak.pada} / 4
                        </span>
                    </div>

                    <div className="mt-auto space-y-4 bg-black/40 border border-white/5 p-5 rounded-2xl backdrop-blur-md">
                        <div className="flex justify-between items-center text-xs lg:text-sm">
                            <span className="text-slate-400 font-black uppercase tracking-wider">Deity</span>
                            <span className="text-white font-bold shadow-black drop-shadow-md">{meta.deity}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs lg:text-sm">
                            <span className="text-slate-400 font-black uppercase tracking-wider">Symbol</span>
                            <span className="text-white font-bold shadow-black drop-shadow-md">{meta.symbol}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CARD 3: CURRENT DASHA */}
            <div className="relative overflow-hidden rounded-[2rem] bg-[#0A0E1F]/80 backdrop-blur-2xl border border-white/10 p-6 lg:p-8 flex flex-col justify-between h-[320px] group hover:border-amber-500/30 transition-all duration-500 shadow-xl">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-white font-black uppercase tracking-[0.15em] text-sm flex items-center gap-2">
                        <div className="w-1 h-5 bg-amber-500 rounded-full" />
                        Current Dasha
                    </h3>
                    <div className="px-3 py-1 rounded bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                        Active
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center flex-1">
                    {/* Simplified Circular Progress Visualization */}
                    <div className="relative w-40 h-40 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-500">
                        {/* Outer Ring */}
                        <div className="absolute inset-0 rounded-full border-[3px] border-white/5"></div>
                        {/* Progress Ring */}
                        <div className="absolute inset-0 rounded-full border-[3px] border-amber-500/50" style={{ clipPath: `inset(0 0 ${100 - mdProgress}% 0)` }}></div>
                        <div className="absolute inset-[8px] rounded-full border border-white/5 bg-[#0F1429] shadow-inner flex items-center justify-center">
                            <div className="text-center">
                                <span className="text-4xl lg:text-5xl font-black text-white block tracking-tighter">{currentMD?.lord || "Unknown"}</span>
                                <span className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-bold mt-1 block">Mahadasha</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                        Ends <span className="text-white ml-1">{currentMD?.end_date || "Unknown"}</span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 w-full">
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        <span className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                            Antardasha
                        </span>
                        <span className="text-white text-sm">{currentAD?.lord || "Unknown"}</span>
                    </div>
                    {/* Linear Progress for Antardasha */}
                    <div className="w-full bg-slate-800/50 h-2 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)]" style={{ width: `${adProgress}%` }}></div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default QuickReferenceWidget;
