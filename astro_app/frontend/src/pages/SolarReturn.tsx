import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import MainLayout from '../components/layout/MainLayout';
import {
    Loader2, AlertCircle, Calendar, Sun, User, MapPin, 
    Star, Crown
} from 'lucide-react';
import { useChartSettings } from '../context/ChartContext';
// import { AnimatePresence, motion } from 'framer-motion';

interface Planet {
    name: string;
    longitude: number;
    sign: string;
    nakshatra: string;
    pada: number;
    house: number;
    is_retrograde: boolean;
    speed: number;
}

interface Muntha {
    sign: string;
    house: number;
    lord: string;
}

interface PanchaAdhikaris {
    muntha_lord: string;
    birth_lagna_lord: string;
    varsha_lagna_lord: string;
    tri_rashi_pati: string;
    din_ratri_pati: string;
}

interface SolarReturnData {
    year: number;
    return_date: string;
    return_time: string;
    tajaka_chart: {
        ascendant: any;
        planets: Planet[];
    };
    muntha: Muntha;
    pancha_adhikaris: PanchaAdhikaris;
    year_lord: string;
}

const SolarReturn = () => {
    const { currentProfile } = useChartSettings();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<SolarReturnData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    
    // Generate year options (current year - 5 to + 5)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

    const fetchSolarReturn = useCallback(async () => {
        if (!currentProfile) return;

        setLoading(true);
        setError(null);
        try {
            const birthDetails = {
                date: currentProfile.date, // Assuming format matches backend expectations
                time: currentProfile.time,
                latitude: currentProfile.latitude,
                longitude: currentProfile.longitude,
                timezone: currentProfile.timezone,
                location: currentProfile.location // Optional but good for context
            };

            const response = await api.post('/chart/solar-return', {
                birth_details: birthDetails,
                target_year: selectedYear
            });
            setData(response.data);
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.detail || 'Failed to calculate Solar Return.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, [currentProfile, selectedYear]);

    useEffect(() => {
        if (currentProfile) {
            fetchSolarReturn();
        }
    }, [currentProfile, fetchSolarReturn]);

    if (!currentProfile) {
        return (
            <MainLayout breadcrumbs={['Calculations', 'Solar Return']}>
                <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A] text-[#EDEFF5]">
                    <div className="text-center space-y-4">
                        <User className="w-12 h-12 text-[#6F768A] mx-auto" />
                        <p className="text-[#A9B0C2]">Please select a profile to view Solar Return (Varshaphal).</p>
                    </div>
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout breadcrumbs={['Calculations', 'Solar Return']}>
            <div className="min-h-screen w-full bg-[#0B0F1A] text-[#EDEFF5] relative overflow-hidden font-sans p-6 md:p-8">
                
                {/* Background Effects */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#F5A623]/5 blur-[100px] rounded-full opacity-20" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#6D5DF6]/5 blur-[100px] rounded-full opacity-20" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto space-y-8">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-2xl font-black text-[#EDEFF5] uppercase tracking-wider flex items-center gap-3">
                                <Sun className="w-8 h-8 text-[#F5A623]" />
                                Varshaphal (Solar Return)
                            </h1>
                            <p className="text-[#A9B0C2] text-sm mt-2">Annual predictions based on the Sun's return to its natal position.</p>
                        </div>

                        <div className="flex items-center gap-4 bg-[#11162A] p-2 rounded-xl border border-[rgba(255,255,255,0.08)]">
                            <span className="text-xs font-bold text-[#6F768A] uppercase tracking-widest pl-2">Year</span>
                            <select 
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                className="bg-[#0B0F1A] text-[#EDEFF5] text-sm font-bold px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] focus:outline-none focus:border-[#F5A623] cursor-pointer"
                            >
                                {years.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-[#E25555]/10 border border-[#E25555]/20 p-4 rounded-xl flex items-center gap-3 text-[#E25555]">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-12 h-12 text-[#F5A623] animate-spin" />
                            <span className="text-[#A9B0C2] font-bold uppercase tracking-widest text-xs animate-pulse">Calculating Annual Chart...</span>
                        </div>
                    ) : data ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            
                            {/* Key Metrics Card */}
                            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-[#11162A]/60 backdrop-blur-md p-6 rounded-2xl border border-[rgba(255,255,255,0.08)] flex items-center gap-4">
                                    <div className="p-3 bg-[#F5A623]/10 rounded-xl">
                                        <Calendar className="w-6 h-6 text-[#F5A623]" />
                                    </div>
                                    <div>
                                        <p className="text-[#6F768A] text-[10px] font-black uppercase tracking-widest">Return Date</p>
                                        <p className="text-[#EDEFF5] font-bold text-lg">{data.return_date}</p>
                                        <p className="text-[#A9B0C2] text-xs">{data.return_time}</p>
                                    </div>
                                </div>

                                <div className="bg-[#11162A]/60 backdrop-blur-md p-6 rounded-2xl border border-[rgba(255,255,255,0.08)] flex items-center gap-4">
                                    <div className="p-3 bg-[#6D5DF6]/10 rounded-xl">
                                        <Crown className="w-6 h-6 text-[#6D5DF6]" />
                                    </div>
                                    <div>
                                        <p className="text-[#6F768A] text-[10px] font-black uppercase tracking-widest">Year Lord (Varshesh)</p>
                                        <p className="text-[#EDEFF5] font-bold text-lg">{data.year_lord}</p>
                                        <p className="text-[#2ED573] text-xs font-bold">Strong Influence</p>
                                    </div>
                                </div>

                                <div className="bg-[#11162A]/60 backdrop-blur-md p-6 rounded-2xl border border-[rgba(255,255,255,0.08)] flex items-center gap-4">
                                    <div className="p-3 bg-[#2ED573]/10 rounded-xl">
                                        <Star className="w-6 h-6 text-[#2ED573]" />
                                    </div>
                                    <div>
                                        <p className="text-[#6F768A] text-[10px] font-black uppercase tracking-widest">Muntha Sign</p>
                                        <p className="text-[#EDEFF5] font-bold text-lg">{data.muntha.sign}</p>
                                        <p className="text-[#A9B0C2] text-xs">House {data.muntha.house}</p>
                                    </div>
                                </div>
                                
                                <div className="bg-[#11162A]/60 backdrop-blur-md p-6 rounded-2xl border border-[rgba(255,255,255,0.08)] flex items-center gap-4">
                                    <div className="p-3 bg-[#E25555]/10 rounded-xl">
                                        <MapPin className="w-6 h-6 text-[#E25555]" />
                                    </div>
                                    <div>
                                        <p className="text-[#6F768A] text-[10px] font-black uppercase tracking-widest">Location</p>
                                        <p className="text-[#EDEFF5] font-bold text-sm truncate max-w-[120px]" title={currentProfile.location}>{currentProfile.location}</p>
                                        <p className="text-[#A9B0C2] text-xs">Lat: {currentProfile.latitude.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Pancha Adhikaris Table */}
                            <div className="lg:col-span-1 bg-[#11162A]/60 backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 h-fit">
                                <h3 className="text-[#EDEFF5] font-bold text-lg mb-6 flex items-center gap-2">
                                    <User className="w-5 h-5 text-[#6D5DF6]" />
                                    Pancha Adhikaris
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { label: "Muntha Lord", value: data.pancha_adhikaris.muntha_lord },
                                        { label: "Birth Lagna Lord", value: data.pancha_adhikaris.birth_lagna_lord },
                                        { label: "Varsha Lagna Lord", value: data.pancha_adhikaris.varsha_lagna_lord },
                                        { label: "Tri-Rashi Pati", value: data.pancha_adhikaris.tri_rashi_pati },
                                        { label: "Din/Ratri Pati", value: data.pancha_adhikaris.din_ratri_pati },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-3 bg-[rgba(255,255,255,0.04)] rounded-xl border border-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.08)] transition-colors">
                                            <span className="text-[#A9B0C2] text-xs font-medium">{item.label}</span>
                                            <span className="text-[#EDEFF5] font-bold text-sm">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Planetary Positions List */}
                            <div className="lg:col-span-2 bg-[#11162A]/60 backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-2xl p-6">
                                <h3 className="text-[#EDEFF5] font-bold text-lg mb-6 flex items-center gap-2">
                                    <Star className="w-5 h-5 text-[#F5A623]" />
                                    Tajaka Planetary Positions
                                </h3>
                                
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-[rgba(255,255,255,0.08)]">
                                                <th className="py-3 px-4 text-[10px] font-black text-[#6F768A] uppercase tracking-widest">Planet</th>
                                                <th className="py-3 px-4 text-[10px] font-black text-[#6F768A] uppercase tracking-widest">Sign</th>
                                                <th className="py-3 px-4 text-[10px] font-black text-[#6F768A] uppercase tracking-widest">Longitude</th>
                                                <th className="py-3 px-4 text-[10px] font-black text-[#6F768A] uppercase tracking-widest">Nakshatra</th>
                                                <th className="py-3 px-4 text-[10px] font-black text-[#6F768A] uppercase tracking-widest">House</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            <tr className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                                                <td className="py-3 px-4 font-bold text-[#F5A623]">Ascendant</td>
                                                <td className="py-3 px-4 text-[#EDEFF5]">{data.tajaka_chart.ascendant.sign}</td>
                                                <td className="py-3 px-4 text-[#A9B0C2] font-mono text-xs">{data.tajaka_chart.ascendant.longitude.toFixed(2)}°</td>
                                                <td className="py-3 px-4 text-[#EDEFF5] text-xs">{data.tajaka_chart.ascendant.nakshatra} ({data.tajaka_chart.ascendant.pada})</td>
                                                <td className="py-3 px-4 text-[#EDEFF5] font-bold">1</td>
                                            </tr>
                                            {data.tajaka_chart.planets.map((planet, idx) => (
                                                <tr key={idx} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                                                    <td className="py-3 px-4 font-bold text-[#EDEFF5] flex items-center gap-2">
                                                        {planet.name}
                                                        {planet.is_retrograde && <span className="text-[10px] bg-[#E25555]/20 text-[#E25555] px-1.5 rounded">R</span>}
                                                    </td>
                                                    <td className="py-3 px-4 text-[#EDEFF5]">{planet.sign}</td>
                                                    <td className="py-3 px-4 text-[#A9B0C2] font-mono text-xs">{planet.longitude.toFixed(2)}°</td>
                                                    <td className="py-3 px-4 text-[#EDEFF5] text-xs">{planet.nakshatra} ({planet.pada})</td>
                                                    <td className="py-3 px-4 text-[#EDEFF5] font-bold">{planet.house}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </MainLayout>
    );
};

export default SolarReturn;
