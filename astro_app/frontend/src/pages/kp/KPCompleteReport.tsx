import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useChart } from '../../context/ChartContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import KPPlanetTable from '../../components/kp/KPPlanetTable';
import KPHouseTable from '../../components/kp/KPHouseTable';
import KPSignificatorsTable from '../../components/kp/KPSignificatorsTable';
import { FileText, Printer, Download, Star, Map, History, BarChart2, Target } from 'lucide-react';

const KPCompleteReport: React.FC = () => {
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
            const response = await api.post('kp/complete-report', { birth_details: payload });
            setData(response.data);
        } catch (err: any) {
            console.error("Error fetching complete KP report:", err);
            setError("Failed to load the complete report. Please try again.");
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
        <div className="p-6 md:p-12 space-y-16 animate-in fade-in duration-700 max-w-6xl mx-auto">
            {/* Report Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-[#FFFFFF]/08 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#6D5DF6] rounded-lg">
                            <Star className="w-5 h-5 text-[#EDEFF5]" />
                        </div>
                        <span className="text-sm font-bold text-[#6D5DF6] uppercase tracking-widest">Premium Astrological Certificate</span>
                    </div>
                    <h1 className="text-5xl font-black text-[#EDEFF5] leading-tight">Comprehensive KP<br />Astrology Report</h1>
                    <div className="flex items-center gap-6 mt-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-[#6F768A] uppercase font-bold tracking-widest">Name</span>
                            <span className="text-[#EDEFF5] font-medium">{currentProfile?.name}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-[#6F768A] uppercase font-bold tracking-widest">Birth Date</span>
                            <span className="text-[#EDEFF5] font-medium">{currentProfile?.date}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-[#6F768A] uppercase font-bold tracking-widest">Location</span>
                            <span className="text-[#EDEFF5] font-medium">{currentProfile?.location}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button className="p-3 bg-[#FFFFFF]/04 hover:bg-[#FFFFFF]/08 border border-[#FFFFFF]/08 rounded-xl text-[#A9B0C2] hover:text-[#EDEFF5] transition-all shadow-xl">
                        <Printer className="w-5 h-5" />
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-[#6D5DF6] hover:bg-[#6D5DF6]/80 text-[#EDEFF5] rounded-xl font-bold transition-all shadow-xl shadow-[#6D5DF6]/20">
                        <Download className="w-5 h-5" />
                        Download PDF
                    </button>
                </div>
            </div>

            {/* 1. Planetary Script */}
            <section className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#6D5DF6]/10 border border-[#6D5DF6]/20 flex items-center justify-center">
                        <Map className="w-6 h-6 text-[#6D5DF6]" />
                    </div>
                    <h2 className="text-3xl font-bold text-[#EDEFF5]">Planetary Positions & Script</h2>
                </div>
                <KPPlanetTable planets={data.chart.planets} />
            </section>

            {/* 2. House Cusps */}
            <section className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#2ED573]/10 border border-[#2ED573]/20 flex items-center justify-center">
                        <Target className="w-6 h-6 text-[#2ED573]" />
                    </div>
                    <h2 className="text-3xl font-bold text-[#EDEFF5]">House Cusp Significance</h2>
                </div>
                <KPHouseTable houses={data.chart.house_cusps} />
            </section>

            {/* 3. Predictions Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <section className="space-y-8 p-10 bg-[#6D5DF6]/5 border border-[#6D5DF6]/20 rounded-3xl">
                    <div className="flex items-center gap-4">
                        <History className="w-6 h-6 text-[#6D5DF6]" />
                        <h2 className="text-2xl font-bold text-[#EDEFF5]">Current Period Insight</h2>
                    </div>
                    <p className="text-xl text-[#EDEFF5] leading-relaxed font-serif italic">
                        "{data.predictions?.prediction || 'Your current Mahadasha is guiding you toward self-realization and professional growth. This is a foundational period for future success.'}"
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {data.predictions?.house_activations?.map((h: number) => (
                            <span key={h} className="px-4 py-2 bg-[#6D5DF6]/20 text-[#6D5DF6] rounded-full text-xs font-bold border border-[#6D5DF6]/20">
                                House {h} Active
                            </span>
                        ))}
                    </div>
                </section>

                <section className="space-y-8 p-10 bg-[#FFFFFF]/04 border border-[#FFFFFF]/08 rounded-3xl">
                    <div className="flex items-center gap-4">
                        <BarChart2 className="w-6 h-6 text-[#2ED573]" />
                        <h2 className="text-2xl font-bold text-[#EDEFF5]">Precision Scores</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        {Object.entries(data.scores?.scores || {}).slice(0, 6).map(([planet, score]: [string, any]) => (
                            <div key={planet} className="flex justify-between items-center border-b border-[#FFFFFF]/04 pb-2">
                                <span className="text-[#A9B0C2] text-sm">{planet}</span>
                                <span className="text-[#EDEFF5] font-bold">{score}%</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* 4. Significators */}
            <section className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-[#F5A623]" />
                    </div>
                    <h2 className="text-3xl font-bold text-[#EDEFF5]">Full Significator Matrix</h2>
                </div>
                <KPSignificatorsTable significators={data.chart.significators} />
            </section>

            {/* Report Footer */}
            <div className="pt-16 border-t border-[#FFFFFF]/08 text-center space-y-4">
                <p className="text-xs text-[#6F768A] leading-relaxed max-w-2xl mx-auto">
                    This report is generated using advanced Placidus house system algorithms and the 249 sub-division Krishnamurti Padhdhati methodology. The results are calculated based on the precise lat/long coordinates provided.
                </p>
                <p className="text-[10px] text-[#6D5DF6]/50 font-bold uppercase tracking-widest">© 2026 ASTRO360 KP ANALYTICS ENGINE</p>
            </div>
        </div>
    );
};

export default KPCompleteReport;
