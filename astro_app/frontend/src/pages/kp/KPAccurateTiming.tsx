import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useChart } from '../../context/ChartContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { CheckCircle2, AlertCircle, Timer, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const KPAccurateTiming: React.FC = () => {
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
            const response = await api.post('kp/dasha-timeline', { birth_details: payload, years_ahead: 2 });
            setData(response.data);
        } catch (err: any) {
            console.error("Error fetching timing data:", err);
            setError("Failed to load timing data. Please try again.");
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

    const getQuality = (score: number) => {
        if (score >= 75) return { label: 'EXCELLENT', color: 'text-[#2ED573]', bg: 'bg-[#2ED573]/10' };
        if (score >= 50) return { label: 'GOOD', color: 'text-[#F5A623]', bg: 'bg-[#F5A623]/10' };
        return { label: 'AVERAGE', color: 'text-[#E25555]', bg: 'bg-[#E25555]/10' };
    };

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#11162A] p-6 rounded-2xl border border-[#FFFFFF]/08">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#E25555] rounded-2xl shadow-lg shadow-[#E25555]/20">
                        <Timer className="w-8 h-8 text-[#EDEFF5]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-[#EDEFF5]">Accurate Timing</h1>
                        <p className="text-[#A9B0C2]">Micro-precision analysis of Antardasha quality for decisive action.</p>
                    </div>
                </div>
            </div>

            {/* Best/Worst Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#2ED573]/05 border border-[#2ED573]/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <ArrowUpRight className="w-6 h-6 text-[#2ED573]" />
                        <h2 className="text-xl font-bold text-[#EDEFF5]">Peak Performance Periods</h2>
                    </div>
                    <div className="space-y-3">
                        <div className="p-3 bg-[#2ED573]/10 rounded-lg flex justify-between items-center">
                            <span className="text-[#EDEFF5] font-medium">Next Favorable Window</span>
                            <span className="text-[#2ED573] text-xs font-bold">Starts March 2026</span>
                        </div>
                        <p className="text-xs text-[#6F768A]">Best for: New investments, Marriage, Job change</p>
                    </div>
                </div>

                <div className="bg-[#E25555]/05 border border-[#E25555]/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <ArrowDownRight className="w-6 h-6 text-[#E25555]" />
                        <h2 className="text-xl font-bold text-[#EDEFF5]">Cautionary Phases</h2>
                    </div>
                    <div className="space-y-3">
                        <div className="p-3 bg-[#E25555]/10 rounded-lg flex justify-between items-center">
                            <span className="text-[#EDEFF5] font-medium">Rahu Antardasha Transition</span>
                            <span className="text-[#E25555] text-xs font-bold">Duration: 1.5 Years</span>
                        </div>
                        <p className="text-xs text-[#6F768A]">Avoid: Legal conflicts, Bulk purchases, Surgery</p>
                    </div>
                </div>
            </div>

            {/* Timing Roadmap */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-[#EDEFF5] px-2">Antardasha Quality Roadmap</h2>
                <div className="space-y-4">
                    {data.timeline[0].antardashas.map((ad: any, i: number) => {
                        const quality = getQuality(ad.lord);
                        return (
                            <div key={i} className="flex items-center gap-6 p-6 bg-[#11162A] border border-[#FFFFFF]/08 rounded-2xl hover:bg-[#FFFFFF]/05 transition-all group">
                                <div className="w-24 text-center">
                                    <div className="text-xs text-[#6F768A] font-bold uppercase mb-1">Starts</div>
                                    <div className="text-sm font-medium text-[#EDEFF5]">{ad.start_date.split(' ')[0]}</div>
                                </div>

                                <div className="h-10 w-px bg-[#FFFFFF]/08" />

                                <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#EDEFF5] group-hover:text-[#6D5DF6] transition-colors">{ad.lord} Period</h3>
                                        <p className="text-xs text-[#A9B0C2] mt-0.5">Influenced by {data.timeline[0].mahadasha.lord} Mahadasha</p>
                                    </div>

                                    <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${quality.bg} ${quality.color} border border-[#FFFFFF]/05`}>
                                        {quality.label} Result
                                    </div>
                                </div>

                                <div className="hidden md:block">
                                    {quality.label === 'EXCELLENT' || quality.label === 'GOOD' ? (
                                        <CheckCircle2 className="w-6 h-6 text-[#2ED573]" />
                                    ) : (
                                        <AlertCircle className="w-6 h-6 text-[#6F768A]" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default KPAccurateTiming;
