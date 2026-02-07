import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useChart } from '../../context/ChartContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Briefcase, Heart, DollarSign, Home, Activity, Star, ChevronLeft, Lightbulb, Bookmark } from 'lucide-react';

const KPCategoryReport: React.FC = () => {
    const { category } = useParams<{ category: string }>();
    const navigate = useNavigate();
    const { currentProfile } = useChart();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!currentProfile || !category) return;

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
            const response = await api.post('kp/category-report', {
                birth_details: payload,
                category: category.toLowerCase()
            });
            setData(response.data);
        } catch (err: any) {
            console.error("Error fetching category report:", err);
            setError("Failed to load category report. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [currentProfile, category]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (isLoading) return <div className="h-96 flex items-center justify-center"><LoadingSpinner /></div>;
    if (error) return <div className="p-8 text-center text-[#E25555] bg-[#E25555]/20 rounded-xl border border-[#E25555]/50 m-6">{error}</div>;
    if (!data) return null;

    const categoryIcons: Record<string, any> = {
        career: Briefcase,
        love: Heart,
        finance: DollarSign,
        property: Home,
        health: Activity,
        fame: Star
    };

    const Icon = categoryIcons[category?.toLowerCase() || 'career'] || Star;

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-500">
            {/* Back Button */}
            <button
                onClick={() => navigate('/kp/dashboard')}
                className="flex items-center gap-2 text-[#A9B0C2] hover:text-[#EDEFF5] transition-colors group mb-4"
            >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to KP Dashboard</span>
            </button>

            {/* Header */}
            <div className="bg-[#11162A] border border-[#FFFFFF]/08 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute -right-16 -top-16 opacity-5">
                    <Icon className="w-64 h-64 text-[#FFFFFF]" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="p-5 bg-[#6D5DF6] rounded-3xl shadow-xl shadow-[#6D5DF6]/20">
                        <Icon className="w-10 h-10 text-[#EDEFF5]" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-[#EDEFF5] capitalize">{category} Analysis</h1>
                        <p className="text-[#A9B0C2] mt-2 max-w-xl">
                            Specialized KP analysis focused on the 12 houses and planetary significators relevant to your {category} life-domain.
                        </p>
                    </div>
                </div>
            </div>

            {/* Summary Card */}
            <div className="bg-[#6D5DF6]/10 border border-[#6D5DF6]/20 rounded-2xl p-8 shadow-inner">
                <div className="flex items-center gap-3 mb-6">
                    <Lightbulb className="w-6 h-6 text-[#F5A623]" />
                    <h2 className="text-2xl font-bold text-[#EDEFF5]">Executive Summary</h2>
                </div>
                <p className="text-[#EDEFF5] text-lg leading-relaxed italic">
                    "{data.report || `Your chart shows a promising outlook for ${category} matters. Focus on balancing your active houses for optimal results.`}"
                </p>
            </div>

            {/* Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* House Impacts */}
                <div className="bg-[#11162A] border border-[#FFFFFF]/08 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-[#EDEFF5] mb-6 border-b border-[#FFFFFF]/08 pb-4">Relevant House Impacts</h3>
                    <div className="space-y-4">
                        {data.relevant_houses?.map((h: any) => (
                            <div key={h.house} className="flex items-center justify-between p-4 bg-[#FFFFFF]/05 rounded-xl border border-[#FFFFFF]/05">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#11162A] flex items-center justify-center text-xs font-bold text-[#A9B0C2]">
                                        {h.house}
                                    </div>
                                    <span className="text-sm text-[#A9B0C2]">{h.description || 'Primary significance'}</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${h.impact === 'Strong' ? 'bg-[#2ED573]/20 text-[#2ED573]' : 'bg-[#6D5DF6]/20 text-[#6D5DF6]'
                                    }`}>
                                    {h.impact || 'Active'}
                                </span>
                            </div>
                        ))}
                        {!data.relevant_houses && [1, 2, 6, 10, 11].map(h => (
                            <div key={h} className="flex items-center justify-between p-4 bg-[#FFFFFF]/05 rounded-xl border border-[#FFFFFF]/05">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#11162A] flex items-center justify-center text-xs font-bold text-[#A9B0C2]">
                                        {h}
                                    </div>
                                    <span className="text-sm text-[#A9B0C2]">Potential Sector</span>
                                </div>
                                <span className="px-2 py-0.5 bg-[#6D5DF6]/20 text-[#6D5DF6] rounded text-[10px] font-bold uppercase">Evaluating</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Points */}
                <div className="bg-[#11162A] border border-[#FFFFFF]/08 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-[#EDEFF5] mb-6 border-b border-[#FFFFFF]/08 pb-4">Strategic Action Points</h3>
                    <div className="space-y-6">
                        {[
                            "Align important decisions with your current Sub Lord's transit.",
                            "Focus on collaborative efforts during the second half of the year.",
                            "Strengthen the significators of your 10th house for better visibility.",
                            "Perform regular meditation to align your mental clarity with planetary nodes."
                        ].map((point, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <Bookmark className="w-4 h-4 text-[#6D5DF6] mt-1 shrink-0" />
                                <p className="text-sm text-[#A9B0C2] leading-relaxed">{point}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KPCategoryReport;
