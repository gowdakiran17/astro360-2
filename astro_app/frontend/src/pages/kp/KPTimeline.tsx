import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useChart } from '../../context/ChartContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import DashaTimeline from '../../components/kp/DashaTimeline';
import { Calendar, History, ArrowRight, Info } from 'lucide-react';

const KPTimeline: React.FC = () => {
    const { currentProfile } = useChart();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [yearsAhead, setYearsAhead] = useState(5);

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
            const response = await api.post('kp/dasha-timeline', {
                birth_details: payload,
                years_ahead: yearsAhead
            });
            setData(response.data);
        } catch (err: any) {
            console.error("Error fetching KP timeline:", err);
            setError("Failed to load Dasha timeline. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [currentProfile, yearsAhead]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (isLoading) return <div className="h-96 flex items-center justify-center"><LoadingSpinner /></div>;
    if (error) return <div className="p-8 text-center text-[#E25555] bg-[#E25555]/20 rounded-xl border border-[#E25555]/50 m-6">{error}</div>;
    if (!data) return null;

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#FFFFFF]/04 p-6 rounded-2xl border border-[#FFFFFF]/08">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#6D5DF6] rounded-2xl shadow-lg shadow-[#6D5DF6]/20">
                        <History className="w-8 h-8 text-[#EDEFF5]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-[#EDEFF5]">KP Dasha Timeline</h1>
                        <p className="text-[#A9B0C2]">Detailed Mahadasha and Antardasha roadmap for your life events.</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-[#0B0F1A]/20 p-1.5 rounded-xl border border-[#FFFFFF]/08">
                    {[5, 10, 20].map((y) => (
                        <button
                            key={y}
                            onClick={() => setYearsAhead(y)}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${yearsAhead === y ? 'bg-[#6D5DF6] text-[#EDEFF5]' : 'text-[#6F768A] hover:text-[#EDEFF5]'
                                }`}
                        >
                            {y} Years
                        </button>
                    ))}
                </div>
            </div>

            {/* Current Period Insight */}
            <div className="bg-gradient-to-br from-[#6D5DF6]/40 to-[#0B0F1A] border border-[#6D5DF6]/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full border-4 border-[#6D5DF6]/20 border-t-[#6D5DF6] animate-[spin_3s_linear_infinite]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Calendar className="w-8 h-8 text-[#6D5DF6]" />
                        </div>
                    </div>
                    <div>
                        <span className="px-3 py-1 bg-[#6D5DF6]/20 text-[#A9B0C2] rounded-full text-[10px] uppercase font-bold tracking-widest border border-[#6D5DF6]/30 mb-2 inline-block">
                            Currently Running
                        </span>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-[#EDEFF5]">{data.current_period.mahadasha}</span>
                            <ArrowRight className="w-5 h-5 text-[#6F768A]" />
                            <span className="text-2xl font-bold text-[#EDEFF5]">{data.current_period.antardasha}</span>
                        </div>
                        <p className="text-[#A9B0C2] text-sm mt-1">
                            Started on {data.current_period.start_date.split(' ')[0]}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 bg-[#FFFFFF]/04 p-4 rounded-xl border border-[#FFFFFF]/08 max-w-md">
                    <Info className="w-5 h-5 text-[#6D5DF6] shrink-0" />
                    <p className="text-xs text-[#A9B0C2] leading-relaxed">
                        In KP Astrology, the Sub Lord (Antardasha) indicates the final result of an event, while the Star Lord indicates the general trend.
                    </p>
                </div>
            </div>

            {/* Timeline Visualization */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-[#EDEFF5] flex items-center gap-2 px-2">
                    Predictions Roadmap
                </h2>
                <DashaTimeline timeline={data.timeline} currentPeriod={data.current_period} />
            </div>
        </div>
    );
};

export default KPTimeline;
