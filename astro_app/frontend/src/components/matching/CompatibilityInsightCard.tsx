import React, { useEffect, useState } from 'react';
import { Sparkles, Heart, Scale, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import api from '../../services/api';

interface CompatibilityInsightCardProps {
    boyChart: any;
    girlChart: any;
    matchScore: any;
}

interface AICompatibilityData {
    verdict_title: string;
    summary: string;
    emotional_harmony: string;
    long_term_potential: string;
    challenges: string;
    recommendation: string;
    ai_powered: boolean;
}

const CompatibilityInsightCard: React.FC<CompatibilityInsightCardProps> = ({ boyChart, girlChart, matchScore }) => {
    const [insight, setInsight] = useState<AICompatibilityData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchInsight = async () => {
            if (!boyChart || !girlChart || !matchScore) return;
            
            setLoading(true);
            try {
                const response = await api.post('/ai/compatibility-insight', {
                    boy_chart: boyChart,
                    girl_chart: girlChart,
                    match_score: matchScore
                });
                if (response.data.status === 'success') {
                    setInsight(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch Compatibility insight", error);
                // Fallback
                setInsight({
                    verdict_title: "Standard Match",
                    summary: "The match score indicates average compatibility.",
                    emotional_harmony: "Check Moon signs.",
                    long_term_potential: "Requires effort.",
                    challenges: "Temperamental differences.",
                    recommendation: "Consult an astrologer.",
                    ai_powered: false
                });
            } finally {
                setLoading(false);
            }
        };

        fetchInsight();
    }, [boyChart, girlChart, matchScore]);

    if (loading) {
        return (
            <div className="bg-[#11162A] backdrop-blur-xl border border-[#FFFFFF]/08 rounded-[2rem] p-8 flex flex-col items-center justify-center min-h-[300px]">
                <Loader2 className="w-8 h-8 text-[#6D5DF6] animate-spin mb-4" />
                <p className="text-[#A9B0C2] text-xs font-bold uppercase tracking-widest animate-pulse">Consulting the Love Oracle...</p>
            </div>
        );
    }

    if (!insight) return null;

    return (
        <div className="bg-[#11162A] backdrop-blur-xl border border-[#FFFFFF]/08 rounded-[2rem] p-8 relative overflow-hidden mt-8">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F472B6]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#F472B6]/20 flex items-center justify-center border border-[#F472B6]/30 text-[#F472B6]">
                    <Sparkles className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-[#EDEFF5]">AI Verdict</h3>
                    <p className="text-[#F472B6] text-sm font-medium">{insight.verdict_title}</p>
                </div>
                {insight.ai_powered && (
                    <div className="ml-auto px-2 py-1 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded border border-pink-500/30 text-[10px] font-bold text-pink-300 uppercase tracking-wider">
                        AI Analysis
                    </div>
                )}
            </div>

            <div className="space-y-6">
                <div>
                    <p className="text-[#EDEFF5] leading-relaxed font-medium">
                        {insight.summary}
                    </p>
                </div>

                <div className="h-px bg-[#FFFFFF]/08 w-full"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#0B0F1A]/50 p-4 rounded-xl border border-[#FFFFFF]/05">
                        <div className="flex items-center gap-2 mb-1">
                            <Heart className="w-3 h-3 text-[#F472B6]" />
                            <span className="text-[10px] font-bold text-[#A9B0C2] uppercase">Emotional Harmony</span>
                        </div>
                        <p className="text-xs text-[#EDEFF5]">{insight.emotional_harmony}</p>
                    </div>
                    
                    <div className="bg-[#0B0F1A]/50 p-4 rounded-xl border border-[#FFFFFF]/05">
                        <div className="flex items-center gap-2 mb-1">
                            <Scale className="w-3 h-3 text-[#6D5DF6]" />
                            <span className="text-[10px] font-bold text-[#A9B0C2] uppercase">Long Term</span>
                        </div>
                        <p className="text-xs text-[#EDEFF5]">{insight.long_term_potential}</p>
                    </div>

                    <div className="bg-[#0B0F1A]/50 p-4 rounded-xl border border-[#FFFFFF]/05">
                        <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="w-3 h-3 text-[#F59E0B]" />
                            <span className="text-[10px] font-bold text-[#A9B0C2] uppercase">Challenges</span>
                        </div>
                        <p className="text-xs text-[#EDEFF5]">{insight.challenges}</p>
                    </div>

                    <div className="bg-[#0B0F1A]/50 p-4 rounded-xl border border-[#FFFFFF]/05">
                        <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="w-3 h-3 text-[#22C55E]" />
                            <span className="text-[10px] font-bold text-[#A9B0C2] uppercase">Recommendation</span>
                        </div>
                        <p className="text-xs text-[#EDEFF5]">{insight.recommendation}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompatibilityInsightCard;
