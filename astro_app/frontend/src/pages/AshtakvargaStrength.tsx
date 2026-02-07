
import { useEffect, useState } from 'react';
import { useChartSettings } from '../context/ChartContext';
import MainLayout from '../components/layout/MainLayout';
import api from '../services/api';
import { BarChart2, AlertCircle, Loader2, Grid, Activity, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

interface AshtakvargaData {
    sav: number[];
    bavs: Record<string, number[]>;
    strongest_houses: Array<{ house_idx: number, points: number }>;
    weakest_houses: Array<{ house_idx: number, points: number }>;
    ascendant_sign_idx: number;
    kakshya_matrix?: any;
}

const AshtakvargaStrength = () => {
    const { currentProfile, settings } = useChartSettings();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<AshtakvargaData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeView, setActiveView] = useState<'sav' | 'bav'>('sav');
    const [selectedPlanet, setSelectedPlanet] = useState('Sun');

    const fetchAshtakvarga = async () => {
        if (!currentProfile) return;
        setLoading(true);
        setError(null);
        try {
            const payload = {
                birth_details: {
                    date: currentProfile.date,
                    time: currentProfile.time,
                    latitude: currentProfile.latitude,
                    longitude: currentProfile.longitude,
                    timezone: currentProfile.timezone,
                    settings: settings
                }
            };
            const response = await api.post('/chart/ashtakvarga', payload);
            setData(response.data);
        } catch (err: any) {
            console.error("Error fetching ashtakvarga:", err);
            setError("Failed to load Ashtakvarga analysis.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentProfile) {
            fetchAshtakvarga();
        }
    }, [currentProfile, settings]);

    if (!currentProfile) {
        return (
            <MainLayout breadcrumbs={['Calculations', 'Ashtakvarga']}>
                <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A] text-[#EDEFF5]">
                    <p className="text-[#A9B0C2]">Please select a profile.</p>
                </div>
            </MainLayout>
        );
    }

    const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

    // Calculate house number relative to Ascendant
    const getHouseNumber = (signIdx: number) => {
        if (!data) return 0;
        return (signIdx - data.ascendant_sign_idx + 12) % 12 + 1;
    };

    return (
        <MainLayout breadcrumbs={['Calculations', 'Ashtakvarga']}>
            <div className="min-h-screen w-full bg-[#0B0F1A] text-[#EDEFF5] relative overflow-hidden font-sans p-6 md:p-8">
                
                {/* Background Effects */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#6D5DF6]/5 blur-[120px] rounded-full opacity-20" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#2ED573]/5 blur-[120px] rounded-full opacity-20" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto space-y-8">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-black text-[#EDEFF5] uppercase tracking-wider flex items-center gap-3">
                                <Grid className="w-8 h-8 text-[#2ED573]" />
                                Ashtakvarga Strength
                            </h1>
                            <p className="text-[#A9B0C2] text-sm mt-2">The Eight-Fold System of Planetary Power.</p>
                        </div>
                        
                        <div className="flex bg-[#11162A] p-1 rounded-xl border border-[rgba(255,255,255,0.08)]">
                            <button
                                onClick={() => setActiveView('sav')}
                                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeView === 'sav' ? 'bg-[#6D5DF6] text-white shadow-lg' : 'text-[#6F768A] hover:text-[#EDEFF5]'}`}
                            >
                                SAV (Summary)
                            </button>
                            <button
                                onClick={() => setActiveView('bav')}
                                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeView === 'bav' ? 'bg-[#6D5DF6] text-white shadow-lg' : 'text-[#6F768A] hover:text-[#EDEFF5]'}`}
                            >
                                BAV (Detail)
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-12 h-12 text-[#6D5DF6] animate-spin" />
                            <span className="text-[#A9B0C2] font-bold uppercase tracking-widest text-xs animate-pulse">Calculating Bindus...</span>
                        </div>
                    ) : error ? (
                        <div className="bg-[#E25555]/10 border border-[#E25555]/20 p-4 rounded-xl flex items-center gap-3 text-[#E25555]">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    ) : data ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            
                            {/* 1. Main Strength Chart */}
                            <div className="bg-[#11162A]/60 backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 md:p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-[#EDEFF5] font-bold text-lg flex items-center gap-2">
                                        <BarChart2 className="w-5 h-5 text-[#F5A623]" />
                                        {activeView === 'sav' ? 'Sarvashtakvarga (SAV)' : `Binnashtakvarga (BAV) - ${selectedPlanet}`}
                                    </h3>
                                    
                                    {activeView === 'bav' && (
                                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                                            {PLANETS.map(p => (
                                                <button
                                                    key={p}
                                                    onClick={() => setSelectedPlanet(p)}
                                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all whitespace-nowrap ${
                                                        selectedPlanet === p 
                                                            ? 'bg-[#F5A623]/20 text-[#F5A623] border-[#F5A623]/30' 
                                                            : 'bg-[#11162A] text-[#6F768A] border-[rgba(255,255,255,0.08)] hover:border-[#F5A623]/30'
                                                    }`}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Chart Grid */}
                                <div className="grid grid-cols-12 gap-2 h-[250px] items-end relative pb-8">
                                    {/* Threshold Line (28 for SAV, 4 for BAV) */}
                                    <div 
                                        className="absolute left-0 right-0 border-t border-dashed border-[#EDEFF5]/20 z-0 pointer-events-none flex items-end justify-end pr-2 text-[10px] text-[#6F768A] font-bold uppercase tracking-wider"
                                        style={{ bottom: activeView === 'sav' ? '50%' : '50%' }} // Approx visual center
                                    >
                                        Avg ({activeView === 'sav' ? 28 : 4})
                                    </div>

                                    {SIGNS.map((sign, idx) => {
                                        const points = activeView === 'sav' 
                                            ? data.sav[idx] 
                                            : data.bavs[selectedPlanet][idx];
                                        
                                        const heightPct = (points / (activeView === 'sav' ? 45 : 8)) * 100; // Visual scaling
                                        const houseNum = getHouseNumber(idx);
                                        const isStrong = points >= (activeView === 'sav' ? 28 : 4);

                                        return (
                                            <div key={sign} className="flex flex-col items-center justify-end h-full group relative z-10">
                                                {/* Tooltip */}
                                                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0B0F1A] border border-[rgba(255,255,255,0.1)] p-2 rounded-lg shadow-xl z-20 pointer-events-none whitespace-nowrap">
                                                    <p className="text-xs font-bold text-[#EDEFF5]">{sign}</p>
                                                    <p className="text-[10px] text-[#A9B0C2]">House {houseNum}</p>
                                                    <p className="text-sm font-black text-[#F5A623]">{points} Points</p>
                                                </div>

                                                <motion.div 
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${heightPct}%` }}
                                                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                                                    className={`w-full max-w-[40px] rounded-t-lg transition-colors ${
                                                        isStrong 
                                                            ? 'bg-gradient-to-t from-[#2ED573]/80 to-[#2ED573]' 
                                                            : 'bg-gradient-to-t from-[#E25555]/80 to-[#E25555]'
                                                    } relative group-hover:brightness-110`}
                                                >
                                                    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-black/60">
                                                        {points}
                                                    </div>
                                                </motion.div>
                                                
                                                <div className="mt-2 text-center">
                                                    <p className="text-[8px] font-bold text-[#6F768A] uppercase tracking-wider truncate w-full">{sign.substring(0,3)}</p>
                                                    <p className="text-[10px] font-black text-[#EDEFF5]">H{houseNum}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 2. Analysis & Interpretation */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-[#11162A]/60 backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-2xl p-6">
                                    <h3 className="text-[#EDEFF5] font-bold text-lg mb-4 flex items-center gap-2">
                                        <Layers className="w-5 h-5 text-[#6D5DF6]" />
                                        House Strength (SAV)
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-[rgba(255,255,255,0.04)] rounded-xl border border-[rgba(255,255,255,0.08)]">
                                            <p className="text-xs font-bold text-[#2ED573] uppercase tracking-wider mb-2">Strongest Houses</p>
                                            <div className="flex gap-2 flex-wrap">
                                                {data.strongest_houses.map(h => (
                                                    <span key={h.house_idx} className="px-3 py-1 bg-[#2ED573]/10 text-[#2ED573] border border-[#2ED573]/20 rounded-lg text-xs font-bold">
                                                        House {h.house_idx} ({h.points})
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-4 bg-[rgba(255,255,255,0.04)] rounded-xl border border-[rgba(255,255,255,0.08)]">
                                            <p className="text-xs font-bold text-[#E25555] uppercase tracking-wider mb-2">Weakest Houses</p>
                                            <div className="flex gap-2 flex-wrap">
                                                {data.weakest_houses.map(h => (
                                                    <span key={h.house_idx} className="px-3 py-1 bg-[#E25555]/10 text-[#E25555] border border-[#E25555]/20 rounded-lg text-xs font-bold">
                                                        House {h.house_idx} ({h.points})
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#11162A]/60 backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-2xl p-6">
                                    <h3 className="text-[#EDEFF5] font-bold text-lg mb-4 flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-[#A9B0C2]" />
                                        Interpretation Guide
                                    </h3>
                                    <ul className="space-y-3 text-sm text-[#A9B0C2] leading-relaxed">
                                        <li className="flex gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#2ED573] mt-2 shrink-0" />
                                            <span><strong>SAV {'>'} 28:</strong> Areas of life that flow easily and bring success with less effort.</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#E25555] mt-2 shrink-0" />
                                            <span><strong>SAV {'<'} 28:</strong> Areas requiring more discipline, patience, and remedial measures.</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] mt-2 shrink-0" />
                                            <span><strong>BAV:</strong> Shows the strength of individual planets. A planet with 5+ bindus in a sign gives strong results during its transit through that sign.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    ) : null}
                </div>
            </div>
        </MainLayout>
    );
};

export default AshtakvargaStrength;
