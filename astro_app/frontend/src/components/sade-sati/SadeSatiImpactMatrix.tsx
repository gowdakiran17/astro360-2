import { LucideIcon, TrendingUp, AlertTriangle, Minus } from 'lucide-react';

interface Impact {
    id: string;
    label: string;
    icon: LucideIcon;
    level: string;
    intensity: 'red' | 'orange' | 'green' | 'yellow';
    effects: string;
    advice: string;
}

interface SadeSatiImpactMatrixProps {
    impacts: Impact[];
}

const SadeSatiImpactMatrix = ({ impacts }: SadeSatiImpactMatrixProps) => {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {impacts.map((impact) => {
                const Icon = impact.icon;

                // Defined styles based on intensity
                const styles = {
                    red: {
                        bg: 'bg-rose-500/10 hover:bg-rose-500/20',
                        border: 'border-rose-500/20 hover:border-rose-500/40',
                        iconBg: 'bg-rose-500/20',
                        text: 'text-rose-400',
                        glow: 'shadow-[0_0_20px_rgba(244,63,94,0.1)]'
                    },
                    orange: {
                        bg: 'bg-amber-500/10 hover:bg-amber-500/20',
                        border: 'border-amber-500/20 hover:border-amber-500/40',
                        iconBg: 'bg-amber-500/20',
                        text: 'text-amber-400',
                        glow: 'shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                    },
                    yellow: {
                        bg: 'bg-yellow-500/10 hover:bg-yellow-500/20',
                        border: 'border-yellow-500/20 hover:border-yellow-500/40',
                        iconBg: 'bg-yellow-500/20',
                        text: 'text-yellow-400',
                        glow: 'shadow-[0_0_20px_rgba(234,179,8,0.1)]'
                    },
                    green: {
                        bg: 'bg-emerald-500/10 hover:bg-emerald-500/20',
                        border: 'border-emerald-500/20 hover:border-emerald-500/40',
                        iconBg: 'bg-emerald-500/20',
                        text: 'text-emerald-400',
                        glow: 'shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                    }
                };

                const style = styles[impact.intensity] || styles.red;

                return (
                    <div
                        key={impact.id}
                        className={`group relative rounded-[2rem] border p-6 transition-all duration-300 backdrop-blur-sm overflow-hidden ${style.bg} ${style.border} ${style.glow}`}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${style.iconBg} ${style.text} transition-transform group-hover:scale-110`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-current ${style.text} bg-black/20`}>
                                {impact.level} Impact
                            </span>
                        </div>

                        {/* Content */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-black text-white mb-2">{impact.label}</h3>
                                <p className="text-sm font-medium text-slate-300 leading-relaxed min-h-[3rem]">
                                    {impact.effects}
                                </p>
                            </div>

                            {/* Advice Divider */}
                            <div className={`h-px w-full bg-gradient-to-r from-transparent via-${impact.intensity === 'green' ? 'emerald' : impact.intensity === 'orange' ? 'amber' : 'rose'}-500/50 to-transparent opacity-30`}></div>

                            <div className="flex gap-3 items-start">
                                <div className={`mt-1 bg-black/30 p-1 rounded-md ${style.text}`}>
                                    {impact.intensity === 'green' ? <TrendingUp className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                                </div>
                                <p className={`text-xs font-bold leading-relaxed ${style.text} opacity-90`}>
                                    {impact.advice}
                                </p>
                            </div>
                        </div>

                        {/* Hover Decoration */}
                        <div className={`absolute -bottom-2 -right-2 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity ${style.text === 'text-rose-400' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                    </div>
                );
            })}
        </div>
    );
};

export default SadeSatiImpactMatrix;
