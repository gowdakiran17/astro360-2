import React from 'react';
import { Target, ArrowRight, Zap, Brain, Leaf } from 'lucide-react';

interface SadeSatiFocusProps {
    phase: 'rising' | 'peak' | 'setting';
}

const SadeSatiFocus: React.FC<SadeSatiFocusProps> = ({ phase }) => {

    const focusContent = {
        rising: {
            title: "Preparation & Grounding",
            items: [
                { icon: Brain, text: "Build mental resilience for upcoming changes", color: "text-blue-400" },
                { icon: Leaf, text: "Consolidate resources and reduce unnecessary expenses", color: "text-emerald-400" },
                { icon: Zap, text: "Strengthen family bonds and resolving domestic issues", color: "text-amber-400" }
            ]
        },
        peak: {
            title: "Discipline & Endurance",
            items: [
                { icon: Brain, text: "Maintain strict emotional discipline daily", color: "text-rose-400" },
                { icon: Zap, text: "Avoid impulsive career or relationship decisions", color: "text-orange-400" },
                { icon: Leaf, text: "Focus on health routines and stress management", color: "text-emerald-400" }
            ]
        },
        setting: {
            title: "Rebuilding & Stabilization",
            items: [
                { icon: Leaf, text: "Begin effective long-term planning", color: "text-emerald-400" },
                { icon: Brain, text: "Reflect on lessons learned and integrate wisdom", color: "text-blue-400" },
                { icon: Zap, text: "Re-engage with social circles cautiously", color: "text-purple-400" }
            ]
        }
    };

    const content = focusContent[phase];

    return (
        <div className="bg-[#1E1B4B]/40 backdrop-blur-xl border border-indigo-500/30 rounded-[2rem] p-6 lg:p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">

                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 shadow-lg shadow-indigo-500/10 shrink-0">
                        <Target className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-indigo-300 uppercase tracking-[0.2em] mb-1">Your Current Focus</h3>
                        <h2 className="text-xl lg:text-2xl font-black text-white">{content.title}</h2>
                    </div>
                </div>

                <div className="flex-1 grid md:grid-cols-3 gap-4 w-full lg:w-auto">
                    {content.items.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div key={idx} className="bg-[#0A0E1F]/60 border border-white/5 rounded-xl p-4 flex items-start gap-3 hover:bg-white/5 transition-colors">
                                <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${item.color}`} />
                                <span className="text-sm font-medium text-slate-300 leading-snug">{item.text}</span>
                            </div>
                        );
                    })}
                </div>

                <button className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default SadeSatiFocus;
