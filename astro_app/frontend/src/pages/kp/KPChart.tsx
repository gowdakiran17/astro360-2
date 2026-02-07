import React, { useState, useEffect, useCallback } from 'react';
import KPAspectStrengthTable from '../../components/kp/KPAspectStrengthTable';
import KPAspectsTable from '../../components/kp/KPAspectsTable';
import KPStrengthTable from '../../components/kp/KPStrengthTable';
import KPPlanetaryDetails from '../../components/kp/KPPlanetaryDetails';
import KPLuckyPoints from '../../components/kp/KPLuckyPoints';
import api from '../../services/api';
import { useChartSettings } from '../../context/ChartContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import KPPlanetTable from '../../components/kp/KPPlanetTable';
import KPHouseTable from '../../components/kp/KPHouseTable';
import KPSignificatorsTable from '../../components/kp/KPSignificatorsTable';
import NorthIndianChart from '../../components/NorthIndianChart';
import SouthIndianChart from '../../components/charts/SouthIndianChart';
import { LayoutGrid, Info, Table as TableIcon, Star } from 'lucide-react';

const KPChart: React.FC = () => {
    const { currentProfile } = useChartSettings();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [chartStyle] = useState<'NORTH_INDIAN' | 'SOUTH_INDIAN'>('SOUTH_INDIAN');

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
            const response = await api.post('kp/chart', { birth_details: payload });
            setData(response.data);
        } catch (err: any) {
            console.error("Error fetching KP chart:", err);
            setError("Failed to load KP Chart data. Please try again.");
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

    // Transform data for the charts


    const getHouse = (longitude: number, ascLongitude: number) => {
        const house = Math.floor((longitude - ascLongitude + 360) % 360 / 30) + 1;
        return house;
    };

    const rashiChartData = {
        ascendant: {
            zodiac_sign: data.ascendant.sign
        },
        planets: data.planets.map((p: any) => ({
            name: p.planet,
            zodiac_sign: p.sign,
            house: getHouse(p.longitude, data.ascendant.longitude)
        }))
    };

    // For Bhav Chalit, we use the house number directly from our house calculation logic if possible, 
    // but usually KP means the planet is in the house where its longitude falls between cusps.
    const getBhavHouse = (longitude: number, cusps: any[]) => {
        for (let i = 0; i < 11; i++) {
            const start = cusps[i].longitude;
            const end = cusps[i + 1].longitude;
            if (start < end) {
                if (longitude >= start && longitude < end) return i + 1;
            } else {
                // Wraps around 360
                if (longitude >= start || longitude < end) return i + 1;
            }
        }
        return 12;
    };

    const bhavChalitData = {
        ascendant: {
            zodiac_sign: data.ascendant.sign
        },
        planets: data.planets.map((p: any) => ({
            name: p.planet,
            zodiac_sign: p.sign, // Note: In Bhav Chalit, signs might be warped but NorthIndianChart expects zodiac_sign for labeling
            house: getBhavHouse(p.longitude, data.house_cusps)
        }))
    };

    const renderChart = (chartData: any, title: string) => (
        <div className="bg-[#FFFFFF]/04 border border-[#FFFFFF]/08 rounded-2xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#6D5DF6]/10 rounded-full blur-3xl group-hover:bg-[#6D5DF6]/20 transition-colors" />
            <h3 className="text-lg font-serif text-[#EDEFF5] mb-6 border-b border-[#FFFFFF]/08 pb-4 flex items-center gap-2 relative z-10">
                <Star className="w-4 h-4 text-[#F5A623]" />
                {title}
            </h3>
            <div className="aspect-square w-full max-w-[400px] mx-auto relative z-10">
                {chartStyle === 'NORTH_INDIAN' ? (
                    <NorthIndianChart data={chartData} />
                ) : (
                    <SouthIndianChart data={chartData} />
                )}
            </div>
        </div>
    );

    return (
        <div className="max-w-[1600px] mx-auto px-4 md:px-16 py-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#FFFFFF]/04 p-8 rounded-2xl border border-[#FFFFFF]/08 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#F5A623] via-[#F5A623]/80 to-[#F5A623]/50 opacity-80" />
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-[#EDEFF5] mb-2 tracking-tight">KP Birth Chart</h1>
                    <p className="text-[#A9B0C2]/60">Complete analysis of planets and house cusps using the Krishnamurti Padhdhati system.</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {renderChart(rashiChartData, "Rashi Chart (Lagna)")}
                {renderChart(bhavChalitData, "KP Bhav Chalit Chart")}
            </div>

            {/* Data Tables */}
            <div className="space-y-12">
                {/* Planets */}
                <section>
                    <h2 className="text-xl font-bold text-[#EDEFF5] mb-4 flex items-center gap-2">
                        <LayoutGrid className="w-5 h-5 text-[#6D5DF6]" />
                        Planetary KP Details
                    </h2>
                    <KPPlanetTable planets={data.planets} />
                </section>

                {/* House Cusps */}
                <section>
                    <h2 className="text-xl font-bold text-[#EDEFF5] mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-[#2ED573]" />
                        House Cusp Details
                    </h2>
                    <KPHouseTable houses={data.house_cusps} />
                </section>

                {/* Aspects Strength Matrix */}
                <div>
                    <KPAspectStrengthTable data={data?.aspect_strengths} />
                </div>

                {/* Detailed Functionality Sections */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-8">
                        <KPAspectsTable data={data?.extended_aspects} />
                        <KPPlanetaryDetails planets={data?.planets} houses={data?.house_cusps} />
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        <KPStrengthTable data={data?.graha_bhava_strength} />
                        <KPLuckyPoints data={data?.lucky_points} />
                    </div>
                </div>

                {/* Significators Tables */}
                <section>
                    <h2 className="text-xl font-bold text-[#EDEFF5] mb-4 flex items-center gap-2">
                        <TableIcon className="w-5 h-5 text-[#F5A623]" />
                        KP Significators
                    </h2>
                    <KPSignificatorsTable significators={data.significators} />
                </section>
            </div>
        </div>
    );
};

export default KPChart;
