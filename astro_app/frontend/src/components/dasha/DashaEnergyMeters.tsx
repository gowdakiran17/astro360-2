import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Heart, Activity, TrendingUp, TrendingDown, Minus, Coins, Building2, Brain, Sparkles } from 'lucide-react';

interface DashaEnergyMetersProps {
    mahadasha: string;
    antardasha: string;
}

const DashaEnergyMeters: React.FC<DashaEnergyMetersProps> = ({ mahadasha, antardasha }) => {

    // Expanded scoring logic based on planetary significations
    const getScores = (planet: string) => {
        const scores: Record<string, {
            career: number;
            wealth: number;
            business: number;
            love: number;
            health: number;
            intellect: number;
            spirituality: number;
        }> = {
            Sun: {
                career: 95, wealth: 85, business: 70, love: 50, health: 90, intellect: 75, spirituality: 80
            },
            Moon: {
                career: 60, wealth: 75, business: 65, love: 95, health: 70, intellect: 60, spirituality: 85
            },
            Mars: {
                career: 90, wealth: 80, business: 85, love: 40, health: 65, intellect: 50, spirituality: 40
            },
            Mercury: {
                career: 85, wealth: 90, business: 100, love: 70, health: 75, intellect: 100, spirituality: 60
            },
            Jupiter: {
                career: 90, wealth: 95, business: 85, love: 85, health: 90, intellect: 95, spirituality: 100
            },
            Venus: {
                career: 70, wealth: 90, business: 80, love: 100, health: 80, intellect: 80, spirituality: 75
            },
            Saturn: {
                career: 85, wealth: 60, business: 75, love: 30, health: 50, intellect: 80, spirituality: 90
            },
            Rahu: {
                career: 90, wealth: 85, business: 95, love: 40, health: 40, intellect: 85, spirituality: 20
            },
            Ketu: {
                career: 30, wealth: 40, business: 20, love: 20, health: 40, intellect: 90, spirituality: 100
            }
        };
        // Default values
        return scores[planet] || {
            career: 50, wealth: 50, business: 50, love: 50, health: 50, intellect: 50, spirituality: 50
        };
    };

    const mEnergy = getScores(mahadasha);
    const aEnergy = getScores(antardasha);

    // Helper to blend scores (70% MD + 30% AD)
    const blend = (key: keyof typeof mEnergy) => Math.round(mEnergy[key] * 0.7 + aEnergy[key] * 0.3);

    const metrics = [
        { label: "Career & Status", value: blend('career'), icon: Briefcase, color: "text-[#F5A623]", bar: "bg-[#F5A623]" },
        { label: "Wealth & Finance", value: blend('wealth'), icon: Coins, color: "text-[#F5A623]", bar: "bg-[#F5A623]" },
        { label: "Business & Trade", value: blend('business'), icon: Building2, color: "text-[#6D5DF6]", bar: "bg-[#6D5DF6]" },
        { label: "Love & Relations", value: blend('love'), icon: Heart, color: "text-[#E25555]", bar: "bg-[#E25555]" },
        { label: "Health & Vitality", value: blend('health'), icon: Activity, color: "text-[#2ED573]", bar: "bg-[#2ED573]" },
        { label: "Intellect & Learning", value: blend('intellect'), icon: Brain, color: "text-[#6D5DF6]", bar: "bg-[#6D5DF6]" },
        { label: "Spirituality", value: blend('spirituality'), icon: Sparkles, color: "text-[#6F768A]", bar: "bg-[#6F768A]" },
    ];

    const getTrendIcon = (score: number) => {
        if (score >= 70) return <TrendingUp className="w-3 h-3 text-[#2ED573]" />;
        if (score <= 40) return <TrendingDown className="w-3 h-3 text-[#E25555]" />;
        return <Minus className="w-3 h-3 text-[#6F768A]" />;
    };

    return (
        <div className="bg-[#11162A] border border-[#FFFFFF]/08 rounded-[2rem] p-6 space-y-6">
            <h3 className="text-lg font-black text-[#EDEFF5] flex items-center gap-2">
                Cosmic Energy Levels
                <span className="px-2 py-0.5 rounded text-[10px] bg-[#FFFFFF]/05 text-[#6F768A] font-bold uppercase tracking-wider">Live</span>
            </h3>

            <div className="space-y-5">
                {metrics.map((m, idx) => (
                    <div key={idx}>
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2 text-[#A9B0C2] text-sm font-bold">
                                <m.icon className={`w-4 h-4 ${m.color}`} />
                                <span>{m.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {getTrendIcon(m.value)}
                                <span className="text-[#EDEFF5] font-black">{m.value}%</span>
                            </div>
                        </div>
                        <div className="h-2 w-full bg-[#0B0F1A] rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${m.value}%` }}
                                transition={{ duration: 1, ease: 'easeOut', delay: idx * 0.1 }}
                                className={`h-full rounded-full ${m.bar} ${m.value > 80 ? 'shadow-[0_0_10px_currentColor]' : ''}`}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
                <p className="text-xs text-indigo-300 font-medium">
                    This period strongly favors areas with <span className="text-emerald-400 font-bold">high energy</span>.
                    Focus your efforts there for maximum results.
                </p>
            </div>
        </div>
    );
};

export default DashaEnergyMeters;
