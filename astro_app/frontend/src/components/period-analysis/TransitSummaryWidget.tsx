import { ArrowRight, Move, AlertTriangle, CheckCircle, Globe } from 'lucide-react';

interface TransitImpact {
    transit_planet: string;
    natal_planet?: string;
    house?: number;
    type?: string;
    aspect?: string;
    nature: 'Favorable' | 'Challenging' | 'Mixed';
    description: string;
}

interface TransitSummaryWidgetProps {
    impacts: TransitImpact[];
}

const ImpactRow = ({ impact }: { impact: TransitImpact }) => {
    const isChallenging = impact.nature === 'Challenging';
    const isFavorable = impact.nature === 'Favorable';

    const iconColor = isChallenging ? 'text-[#E25555]' : isFavorable ? 'text-[#2ED573]' : 'text-[#F5A623]';
    const bgColor = isChallenging ? 'bg-[#E25555]/10 border-[#E25555]/20' : isFavorable ? 'bg-[#2ED573]/10 border-[#2ED573]/20' : 'bg-[#F5A623]/10 border-[#F5A623]/20';
    const Icon = isChallenging ? AlertTriangle : isFavorable ? CheckCircle : Move;

    return (
        <div className="flex items-start gap-4 p-4 lg:p-5 rounded-2xl hover:bg-[#FFFFFF]/06 transition-all duration-300 border border-transparent hover:border-[#FFFFFF]/08 hover:translate-x-1 group">
            <div className={`p-3 rounded-xl border flex-shrink-0 transition-colors ${bgColor} ${iconColor}`}>
                <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className={`text-[10px] lg:text-xs px-2.5 py-1 rounded-lg font-black uppercase tracking-widest border ${bgColor} ${iconColor}`}>
                        {impact.nature}
                    </span>
                    {impact.aspect && (
                        <span className="text-[10px] lg:text-xs text-[#6F768A] font-bold whitespace-nowrap bg-[#FFFFFF]/05 px-2 py-1 rounded-lg border border-[#FFFFFF]/05">
                            {impact.aspect} Aspect
                        </span>
                    )}
                </div>
                <p className="text-sm lg:text-base leading-relaxed text-[#A9B0C2] group-hover:text-[#EDEFF5] transition-colors font-medium">
                    {impact.description}
                </p>
            </div>
        </div>
    );
};

const TransitSummaryWidget = ({ impacts }: TransitSummaryWidgetProps) => {
    // Prioritize impacts: Aspects first, then significant house transits
    const significantImpacts = impacts.filter(i => i.aspect).slice(0, 4);
    const houseTransits = impacts.filter(i => !i.aspect).slice(0, 2);

    const displayList = [...significantImpacts, ...houseTransits].slice(0, 6);

    return (
        <div className="glass-card p-6 lg:p-8 h-full border-[#FFFFFF]/08 bg-[#11162A]/60 backdrop-blur-xl rounded-[2rem]">
            <div className="flex items-center justify-between mb-6 lg:mb-8">
                <h3 className="text-xl lg:text-2xl font-black text-[#EDEFF5] flex items-center gap-3">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-[#6D5DF6]/10 border border-[#6D5DF6]/30 flex items-center justify-center shadow-lg shadow-[#6D5DF6]/10">
                        <Move className="w-5 h-5 lg:w-6 lg:h-6 text-[#6D5DF6]" />
                    </div>
                    Today's Planetary Transits
                </h3>
            </div>

            {displayList.length > 0 ? (
                <div className="space-y-2">
                    {displayList.map((impact, idx) => (
                        <ImpactRow key={idx} impact={impact} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 lg:py-16 opacity-50">
                    <div className="w-16 h-16 rounded-full bg-[#FFFFFF]/08 flex items-center justify-center mb-4">
                        <Globe className="w-8 h-8 text-[#6F768A]" />
                    </div>
                    <p className="text-[#6F768A] text-base font-bold">
                        No major transit impacts detected
                    </p>
                </div>
            )}

            <button className="w-full mt-8 py-4 text-xs font-black text-[#6F768A] uppercase tracking-[0.2em] hover:text-[#EDEFF5] hover:bg-[#FFFFFF]/05 border border-[#FFFFFF]/08 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg">
                View Detailed Transits <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default TransitSummaryWidget;
