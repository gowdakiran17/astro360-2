
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
        <div className="overflow-hidden rounded-xl border border-[#FFFFFF]/08 bg-[#FFFFFF]/04 backdrop-blur-md shadow-2xl">
            <div className="px-6 py-4 border-b border-[#FFFFFF]/08 bg-[#F5A623]/20">
                <h3 className="text-lg font-bold text-[#F5A623]">Lucky Things</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[#A9B0C2]">
                    <tbody className="divide-y divide-[#FFFFFF]/04">
                        {rows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-[#FFFFFF]/06">
                                <td className="px-6 py-4 font-medium text-[#EDEFF5] bg-[#FFFFFF]/04 w-1/3">{row.label}</td>
                                <td className="px-6 py-4">{row.value}</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={2} className="px-6 py-4 text-xs text-[#A9B0C2] bg-[#F5A623]/10 italic text-center">
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
