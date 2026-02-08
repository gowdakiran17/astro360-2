import React from 'react';
import { Target, Lightbulb } from 'lucide-react';

interface Props {
    focus?: string;
    priority?: string;
}

const MostImportantWidget: React.FC<Props> = ({ focus = "Focus on meaningful connections", priority = "Relationships" }) => {
    return (
        <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl border border-white/10 p-5 relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-3xl" />

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                        <Target className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">Most Important</h3>
                        <span className="text-[10px] text-indigo-300 uppercase tracking-wide">{priority}</span>
                    </div>
                </div>

                <p className="text-lg font-semibold text-white leading-relaxed mb-4">
                    {focus}
                </p>

                <div className="flex items-center gap-2 text-xs text-white/40">
                    <Lightbulb className="w-3 h-3" />
                    <span>Based on today's planetary alignment</span>
                </div>
            </div>
        </div>
    );
};

export default MostImportantWidget;
