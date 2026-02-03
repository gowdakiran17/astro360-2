import { Check, X } from 'lucide-react';

interface PriorityItem {
    title: string;
    subtitle: string;
    why: string;
    action: string;
    score?: number;
}

interface Guidance {
    do: string[];
    avoid: string[];
}

interface CosmicPrioritiesProps {
    priorities: PriorityItem[];
    guidance: Guidance;
    loading?: boolean;
}

const CosmicPriorities = ({ priorities, guidance, loading }: CosmicPrioritiesProps) => {

    if (loading) {
        return <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left: Top 3 Priorities (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
                <h3 className="text-xl font-serif text-white flex items-center gap-2">
                    <span>📋 Cosmic Priorities</span>
                    <span className="text-slate-400 text-sm font-sans uppercase tracking-wider font-normal mt-1">(Focus on these 3 things)</span>
                </h3>

                <div className="space-y-4">
                    {priorities.map((item, index) => (
                        <div key={index} className="flex gap-4 p-4 bg-[#0A0F1E]/60 border border-white/5 rounded-xl hover:border-amber-500/20 transition-all backdrop-blur-sm">
                            {/* Rank Number */}
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold font-serif text-xl border border-amber-500/20">
                                {index + 1}
                            </div>

                            <div className="flex-grow">
                                <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3 mb-2">
                                    <h4 className="font-bold text-white text-xl">{item.title}</h4>
                                    <span className="text-amber-300 text-base font-medium">{item.subtitle}</span>
                                </div>

                                <p className="text-slate-300 text-base leading-relaxed mb-3">
                                    {item.why}
                                </p>

                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-900/20 text-amber-200 text-sm rounded-lg border border-amber-500/10">
                                    <span className="font-bold">➔ ACTION:</span>
                                    {item.action}
                                </div>
                            </div>
                        </div>
                    ))}

                    {priorities.length === 0 && (
                        <div className="text-slate-500 text-center py-8">Analyzing cosmic currents...</div>
                    )}
                </div>
            </div>

            {/* Right: Do / Avoid Lists (1/3 width) */}
            <div className="space-y-6">

                {/* Optimize Energy */}
                <div className="bg-[#0f1926] p-6 rounded-2xl border-l-4 border-emerald-500 shadow-lg shadow-black/20">
                    <h4 className="flex items-center gap-2 text-emerald-400 font-bold mb-4 uppercase text-sm tracking-wider">
                        <Check className="w-5 h-5" /> Optimize Energy
                    </h4>
                    <ul className="space-y-3">
                        {guidance.do.map((text, i) => (
                            <li key={i} className="text-slate-200 text-base flex items-start gap-3">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2.5 flex-shrink-0" />
                                {text}
                            </li>
                        ))}
                        {guidance.do.length === 0 && <li className="text-slate-500 text-sm">Align with flow...</li>}
                    </ul>
                </div>

                {/* Conserve Energy */}
                <div className="bg-[#1a1215] p-6 rounded-2xl border-l-4 border-red-500 shadow-lg shadow-black/20">
                    <h4 className="flex items-center gap-2 text-red-400 font-bold mb-4 uppercase text-sm tracking-wider">
                        <X className="w-5 h-5" /> Conserve & Avoid
                    </h4>
                    <ul className="space-y-3">
                        {guidance.avoid.map((text, i) => (
                            <li key={i} className="text-slate-200 text-base flex items-start gap-3">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2.5 flex-shrink-0" />
                                {text}
                            </li>
                        ))}
                        {guidance.avoid.length === 0 && <li className="text-slate-500 text-sm">Move mindfully...</li>}
                    </ul>
                </div>

            </div>
        </div>
    );
};

export default CosmicPriorities;
