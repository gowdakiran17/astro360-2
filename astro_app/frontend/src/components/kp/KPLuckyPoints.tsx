
import React from 'react';

interface KPLuckyPointsProps {
    data: Record<string, string>;
}

const KPLuckyPoints: React.FC<KPLuckyPointsProps> = ({ data }) => {
    if (!data) return null;


    // Manual mapping based on what I implemented in backend
    const rows = [
        { label: "Lucky Days", value: data.favorable_day },
        { label: "Lucky Planets", value: "Moon, Mars, Jupiter" }, // Placeholder as logic was simple
        { label: "Friendly Signs", value: "Scorpio, Cancer" }, // Placeholder
        { label: "Friendly Ascendant", value: "Scorpio, Cancer" }, // Placeholder
        { label: "Life Stone", value: data.life_stone },
        { label: "Lucky Stone", value: data.lucky_stone },
        { label: "Punya Stone", value: data.punya_stone },
        { label: "Favorable Deity", value: data.favorable_deity },
        { label: "Favorable Metal", value: data.favorable_metal },
        { label: "Favorable Color", value: data.favorable_color },
        { label: "Favorable Direction", value: data.favorable_direction },
        { label: "Favorable Time", value: "Morning" } // Placeholder
    ];

    return (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
            <div className="px-6 py-4 border-b border-white/10 bg-[#523A1E]">
                <h3 className="text-lg font-bold text-amber-200">Lucky Things</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-200">
                    <tbody className="divide-y divide-white/5">
                        {rows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-white/5">
                                <td className="px-6 py-4 font-medium text-amber-50 bg-white/5 w-1/3">{row.label}</td>
                                <td className="px-6 py-4">{row.value}</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={2} className="px-6 py-4 text-xs text-amber-100/70 bg-amber-900/20 italic text-center">
                                Note: The gemstones listed are indicative only. Please consult a qualified astrologer before wearing any gem.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default KPLuckyPoints;
