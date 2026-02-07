import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useChart } from '../../context/ChartContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Target, Sparkles, AlertTriangle, Lightbulb, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

const KPDetailedPredictions: React.FC = () => {
    const { currentProfile } = useChart();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!currentProfile) return;

        setIsLoading(true);
        setError(null);

        const formatDate = (dateStr: string) => {
            if (dateStr.includes('-')) {
                const [y, m, d] = dateStr.split('-');
                return `${d}/${m}/${y}`;
            }
            return dateStr;
        };

        const payload = {
            date: formatDate(currentProfile.date),
            time: currentProfile.time,
            latitude: currentProfile.latitude,
            longitude: currentProfile.longitude,
            timezone: currentProfile.timezone
        };

        try {
            const response = await api.post('kp/detailed-predictions', { birth_details: payload });
            setData(response.data);
        } catch (err: any) {
            console.error("Error fetching KP predictions:", err);
            setError("Failed to load detailed predictions. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [currentProfile]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (isLoading) return <div className="h-96 flex items-center justify-center"><LoadingSpinner /></div>;
    if (error) return <div className="p-8 text-center text-[#E25555] bg-[#E25555]/20 rounded-xl border border-[#E25555]/50 m-6">{error}</div>;
    if (!data) return null;

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#11162A] to-[#0B0F1A] border border-[#FFFFFF]/08 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Target className="w-48 h-48 rotate-12 text-[#6D5DF6]" />
                </div>
                <div className="relative z-10">
                    <span className="px-4 py-1 bg-[#FFFFFF]/20 backdrop-blur-md text-[#EDEFF5] rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">
                        Period Analysis
                    </span>
                    <h1 className="text-4xl font-bold text-[#EDEFF5] mb-4">Detailed Predictions</h1>
                    <p className="text-[#A9B0C2] max-w-2xl text-lg">
                        High-precision event forecasting based on your current Mahadasha and Antardasha activations.
                    </p>
                </div>
            </div>

            {/* Main Prediction Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Key Focus */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-[#FFFFFF]/04 border border-[#FFFFFF]/08 rounded-2xl p-8 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <Zap className="w-6 h-6 text-[#F5A623]" />
                            <h2 className="text-2xl font-bold text-[#EDEFF5]">Central Theme</h2>
                        </div>
                        <p className="text-[#EDEFF5] text-lg leading-relaxed mb-8">
                            {data.prediction || "Your current period is activating key sectors of your life. Expect significant developments in the areas highlighted below."}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-[#6D5DF6]/10 border border-[#6D5DF6]/20 rounded-xl">
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles className="w-5 h-5 text-[#6D5DF6]" />
                                    <span className="font-bold text-[#6D5DF6]">Key Opportunities</span>
                                </div>
                                <p className="text-sm text-[#A9B0C2]">
                                    Planetary alignments suggest favorable outcomes in ventures requiring communication and strategic thinking during this period.
                                </p>
                            </div>
                            <div className="p-6 bg-[#2ED573]/10 border border-[#2ED573]/20 rounded-xl">
                                <div className="flex items-center gap-2 mb-3">
                                    <ShieldCheck className="w-5 h-5 text-[#2ED573]" />
                                    <span className="font-bold text-[#2ED573]">Success Factor</span>
                                </div>
                                <p className="text-sm text-[#A9B0C2]">
                                    Your Sub Lord's position indicates that persistence in career matters will yield tangible results by the end of this Antardasha.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Cautions */}
                    <div className="bg-[#F5A623]/5 border border-[#F5A623]/20 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="w-6 h-6 text-[#F5A623]" />
                            <h2 className="text-xl font-bold text-[#EDEFF5]">Caution & Warnings</h2>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#F5A623] mt-2 shrink-0" />
                                <p className="text-[#A9B0C2]">Avoid making major financial commitments on Tuesdays or during Rahu Kaal in this period.</p>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#F5A623] mt-2 shrink-0" />
                                <p className="text-[#A9B0C2]">Verify all documentation twice before signing, as Mercury's influence may cause minor oversights.</p>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right: Activations & Stats */}
                <div className="space-y-8">
                    {/* House Activations */}
                    <div className="bg-[#FFFFFF]/04 border border-[#FFFFFF]/08 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-[#EDEFF5] mb-6 flex items-center justify-between">
                            House Activations
                            <Lightbulb className="w-4 h-4 text-[#2ED573]" />
                        </h3>
                        <div className="space-y-4">
                            {data.house_activations?.map((house: number) => (
                                <div key={house} className="flex items-center justify-between p-3 bg-[#FFFFFF]/04 rounded-lg border border-[#FFFFFF]/04">
                                    <span className="text-[#A9B0C2] text-sm">House {house}</span>
                                    <span className="px-2 py-1 bg-[#2ED573]/20 text-[#2ED573] text-[10px] font-bold rounded uppercase">Active</span>
                                </div>
                            ))}
                            {!data.house_activations && [1, 5, 9, 10].map(h => (
                                <div key={h} className="flex items-center justify-between p-3 bg-[#FFFFFF]/04 rounded-lg border border-[#FFFFFF]/04">
                                    <span className="text-[#A9B0C2] text-sm">House {h}</span>
                                    <span className="px-2 py-1 bg-[#6D5DF6]/20 text-[#6D5DF6] text-[10px] font-bold rounded uppercase">Pending</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dynamic Advice */}
                    <div className="bg-[#6D5DF6] rounded-2xl p-6 text-[#EDEFF5] shadow-xl shadow-[#6D5DF6]/20">
                        <h3 className="text-lg font-bold mb-4">Action Compass</h3>
                        <p className="text-[#EDEFF5] text-sm mb-6 leading-relaxed">
                            Based on your current script, focusing on networking and expanding your knowledge base will provide the highest ROI for your energy right now.
                        </p>
                        <button className="w-full py-3 bg-[#EDEFF5] text-[#6D5DF6] font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-[#FFFFFF] transition-colors">
                            View Detailed Remedy
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KPDetailedPredictions;
