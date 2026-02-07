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
            <div className="relative overflow-hidden rounded-[2rem] bg-[#11162A]/80 backdrop-blur-2xl border border-[#FFFFFF]/08 p-6 lg:p-8 flex flex-col justify-between h-[320px] group hover:border-[#F5A623]/30 transition-all duration-500 shadow-xl">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-[#EDEFF5] font-black uppercase tracking-[0.15em] text-sm flex items-center gap-2">
                        <div className="w-1 h-5 bg-[#F5A623] rounded-full" />
                        Chart Details
                    </h3>
                    <Info className="w-5 h-5 text-[#6F768A]" />
                </div>

                <div className="space-y-5 flex-1 mt-2">
                    <div className="flex justify-between items-center border-b border-[#FFFFFF]/08 pb-4 group-hover:border-[#FFFFFF]/10 transition-colors">
                        <span className="text-[#A9B0C2] text-xs font-black uppercase tracking-widest">Lagna</span>
                        <div className="text-right">
                            <span className="text-[#EDEFF5] text-lg font-bold block">{lagna.sign}</span>
                            <span className="text-xs text-[#F5A623] font-mono tracking-wider font-bold">{lagna.degree_str}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#FFFFFF]/08 pb-4 group-hover:border-[#FFFFFF]/10 transition-colors">
                        <span className="text-[#A9B0C2] text-xs font-black uppercase tracking-widest">Moon Sign</span>
                        <div className="text-right">
                            <span className="text-[#EDEFF5] text-lg font-bold block">{moon.sign}</span>
                            <span className="text-xs text-[#F5A623] font-mono tracking-wider font-bold">{moon.degree_str}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#FFFFFF]/08 pb-4 group-hover:border-[#FFFFFF]/10 transition-colors">
                        <span className="text-[#A9B0C2] text-xs font-black uppercase tracking-widest">Sun Sign</span>
                        <div className="text-right">
                            <span className="text-[#EDEFF5] text-lg font-bold block">{sun.sign}</span>
                            <span className="text-xs text-[#F5A623] font-mono tracking-wider font-bold">{sun.degree_str}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#FFFFFF]/08">
                    <div className="flex items-center gap-3">
                        <Sunrise className="w-5 h-5 text-[#F5A623]" />
                        <span className="text-sm text-[#EDEFF5] font-bold">{chart_details?.sunrise || "06:00 AM"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Sunset className="w-5 h-5 text-[#6D5DF6]" />
                        <span className="text-sm text-[#EDEFF5] font-bold">{chart_details?.sunset || "06:00 PM"}</span>
                    </div>
                </div>
            </div>

            {/* CARD 2: MOON NAKSHATRA */}
            <div className="relative overflow-hidden rounded-[2rem] bg-[#11162A]/80 backdrop-blur-2xl border border-[#FFFFFF]/08 p-6 lg:p-8 flex flex-col justify-between h-[320px] group hover:border-[#6D5DF6]/30 transition-all duration-500 shadow-xl">
                {/* Background Decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#6D5DF6]/20 to-[#F5A623]/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                <Star className="absolute -top-6 -right-6 w-48 h-48 text-[#6D5DF6]/5 rotate-12 group-hover:rotate-[20deg] transition-transform duration-1000" />

                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-[#6D5DF6] font-black uppercase tracking-[0.15em] text-sm flex items-center gap-2">
                            <div className="w-1 h-5 bg-[#6D5DF6] rounded-full" />
                            Moon Nakshatra
                        </h3>
                        <div className="w-10 h-10 rounded-2xl bg-[#6D5DF6]/10 flex items-center justify-center border border-[#6D5DF6]/20">
                            <Star className="w-5 h-5 text-[#6D5DF6] fill-[#6D5DF6]/20" />
                        </div>
                    </div>

                    <div className="mb-6 mt-auto">
                        <h2 className="text-4xl lg:text-5xl font-black text-[#EDEFF5] mb-4 tracking-tight leading-none">{nak.name}</h2>
                        <span className="px-4 py-1.5 rounded-lg bg-[#FFFFFF]/04 border border-[#FFFFFF]/08 text-xs font-black uppercase tracking-[0.2em] text-[#6D5DF6] shadow-lg">
                            Pada {nak.pada} / 4
                        </span>
                    </div>

                    <div className="mt-auto space-y-4 bg-[#0B0F1A]/40 border border-[#FFFFFF]/08 p-5 rounded-2xl backdrop-blur-md">
                        <div className="flex justify-between items-center text-xs lg:text-sm">
                            <span className="text-[#A9B0C2] font-black uppercase tracking-wider">Deity</span>
                            <span className="text-[#EDEFF5] font-bold shadow-black drop-shadow-md">{meta.deity}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs lg:text-sm">
                            <span className="text-[#A9B0C2] font-black uppercase tracking-wider">Symbol</span>
                            <span className="text-[#EDEFF5] font-bold shadow-black drop-shadow-md">{meta.symbol}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CARD 3: CURRENT DASHA */}
            <div className="relative overflow-hidden rounded-[2rem] bg-[#11162A]/80 backdrop-blur-2xl border border-[#FFFFFF]/08 p-6 lg:p-8 flex flex-col justify-between h-[320px] group hover:border-[#F5A623]/30 transition-all duration-500 shadow-xl">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-[#EDEFF5] font-black uppercase tracking-[0.15em] text-sm flex items-center gap-2">
                        <div className="w-1 h-5 bg-[#F5A623] rounded-full" />
                        Current Dasha
                    </h3>
                    <div className="px-3 py-1 rounded bg-[#F5A623] text-[#0B0F1A] text-[10px] font-black uppercase tracking-wider shadow-[0_0_15px_rgba(245,166,35,0.4)]">
                        Active
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center flex-1">
                    {/* Simplified Circular Progress Visualization */}
                    <div className="relative w-40 h-40 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-500">
                        {/* Outer Ring */}
                        <div className="absolute inset-0 rounded-full border-[3px] border-[#FFFFFF]/08"></div>
                        {/* Progress Ring */}
                        <div className="absolute inset-0 rounded-full border-[3px] border-[#F5A623]/50" style={{ clipPath: `inset(0 0 ${100 - mdProgress}% 0)` }}></div>
                        <div className="absolute inset-[8px] rounded-full border border-[#FFFFFF]/08 bg-[#0B0F1A] shadow-inner flex items-center justify-center">
                            <div className="text-center">
                                <span className="text-4xl lg:text-5xl font-black text-[#EDEFF5] block tracking-tighter">{currentMD?.lord || "Unknown"}</span>
                                <span className="text-[10px] uppercase tracking-[0.3em] text-[#F5A623] font-bold mt-1 block">Mahadasha</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#A9B0C2] bg-[#FFFFFF]/04 px-4 py-1.5 rounded-full border border-[#FFFFFF]/08">
                        Ends <span className="text-[#EDEFF5] ml-1">{currentMD?.end_date || "Unknown"}</span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#FFFFFF]/08 w-full">
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-[#A9B0C2] mb-2">
                        <span className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#6D5DF6] animate-pulse" />
                            Antardasha
                        </span>
                        <span className="text-[#EDEFF5] text-sm">{currentAD?.lord || "Unknown"}</span>
                    </div>
                    {/* Linear Progress for Antardasha */}
                    <div className="w-full bg-[#11162A]/50 h-2 rounded-full overflow-hidden border border-[#FFFFFF]/08">
                        <div className="h-full bg-gradient-to-r from-[#F5A623] to-[#F5A623]/60 shadow-[0_0_10px_rgba(245,166,35,0.5)]" style={{ width: `${adProgress}%` }}></div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default QuickReferenceWidget;
