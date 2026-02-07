import React, { useEffect, useState } from 'react';
import { Sparkles, Info, Star, Shield, Loader2 } from 'lucide-react';
import api from '../../services/api';

interface DashaInsightCardProps {
    mahadasha: string;
    antardasha: string;
    chartData: any;
}

interface AIInsightData {
    insight: string;
    energy_score: number;
    key_themes: string[];
    opportunity: string;
    caution: string;
    remedy: string;
    ai_powered: boolean;
}

const DashaInsightCard: React.FC<DashaInsightCardProps> = ({ mahadasha, antardasha, chartData }) => {
    const [insight, setInsight] = useState<AIInsightData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchInsight = async () => {
            if (!mahadasha || !antardasha || !chartData) return;
            
            setLoading(true);
            try {
                const response = await api.post('/ai/dasha-insight', {
                    mahadasha,
                    antardasha,
                    chart_data: chartData
                });
                if (response.data.status === 'success') {
                    setInsight(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch Dasha insight", error);
                // Fallback handled by backend usually, but if API fails entirely:
                setInsight({
                    insight: `The planetary period of ${mahadasha}-${antardasha} is active.`,
                    energy_score: 50,
                    key_themes: ["Transition"],
                    opportunity: "New beginnings",
                    caution: "Stay balanced",
                    remedy: "Meditation",
                    ai_powered: false
                });
            } finally {
                setLoading(false);
            }
        };

        fetchInsight();
    }, [mahadasha, antardasha, chartData]);

    if (loading) {
        return (
            <div className="bg-[#11162A] backdrop-blur-xl border border-[#FFFFFF]/08 rounded-[2rem] p-8 flex flex-col items-center justify-center min-h-[300px]">
                <Loader2 className="w-8 h-8 text-[#6D5DF6] animate-spin mb-4" />
                <p className="text-[#A9B0C2] text-xs font-bold uppercase tracking-widest animate-pulse">Consulting the AI Oracle...</p>
            </div>
        );
    }

    if (!insight) return null;

    return (
        <div className="bg-[#11162A] backdrop-blur-xl border border-[#FFFFFF]/08 rounded-[2rem] p-8 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#6D5DF6]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#6D5DF6]/20 flex items-center justify-center border border-[#6D5DF6]/30 text-[#6D5DF6]">
                    <Sparkles className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-[#EDEFF5]">Cosmic Interpretation</h3>
                    <p className="text-[#6D5DF6] text-sm font-medium">Combined energy of {mahadasha} & {antardasha}</p>
                </div>
                {insight.ai_powered && (
                    <div className="ml-auto px-2 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded border border-purple-500/30 text-[10px] font-bold text-purple-300 uppercase tracking-wider">
                        AI Analysis
                    </div>
                )}
            </div>

            <div className="space-y-6">
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#6F768A] mb-2">Vedic Analysis</h4>
                    <p className="text-[#EDEFF5] leading-relaxed font-medium">
                        {insight.insight}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {insight.key_themes.map((theme, i) => (
                        <span key={i} className="px-3 py-1 bg-[#FFFFFF]/05 rounded-full text-xs text-[#A9B0C2] border border-[#FFFFFF]/05">
                            {theme}
                        </span>
                    ))}
                </div>

                <div className="h-px bg-[#FFFFFF]/08 w-full"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#0B0F1A]/50 p-4 rounded-xl border border-[#FFFFFF]/05">
                        <div className="flex items-center gap-2 mb-1">
                            <Star className="w-3 h-3 text-[#F5A623]" />
                            <span className="text-[10px] font-bold text-[#A9B0C2] uppercase">Opportunity</span>
                        </div>
                        <p className="text-xs text-[#EDEFF5]">{insight.opportunity}</p>
                    </div>
                    
                    <div className="bg-[#0B0F1A]/50 p-4 rounded-xl border border-[#FFFFFF]/05">
                        <div className="flex items-center gap-2 mb-1">
                            <Info className="w-3 h-3 text-[#6D5DF6]" />
                            <span className="text-[10px] font-bold text-[#A9B0C2] uppercase">Caution</span>
                        </div>
                        <p className="text-xs text-[#EDEFF5]">{insight.caution}</p>
                    </div>

                    <div className="md:col-span-2 bg-[#0B0F1A]/50 p-4 rounded-xl border border-[#FFFFFF]/05">
                        <div className="flex items-center gap-2 mb-1">
                            <Shield className="w-3 h-3 text-[#22C55E]" />
                            <span className="text-[10px] font-bold text-[#A9B0C2] uppercase">Remedy</span>
                        </div>
                        <p className="text-xs text-[#EDEFF5] italic">"{insight.remedy}"</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashaInsightCard;
