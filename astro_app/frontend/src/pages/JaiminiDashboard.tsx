import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import MainLayout from '../components/layout/MainLayout';
import {
    Loader2, AlertCircle, Sparkles, User, MapPin, 
    Crown, Layers, GitMerge
} from 'lucide-react';
import { useChartSettings } from '../context/ChartContext';
// import { AnimatePresence, motion } from 'framer-motion';

interface JaiminiData {
    karakas: any[];
    karakamsa?: {
        sign: string;
        longitude: number;
        chart: string;
    };
    arudha_padas?: Record<string, {
        sign: string;
        house_num: number;
        lord: string;
        lord_sign: string;
    }>;
    chara_dasha?: any[];
    aspects?: any;
    error?: string;
    padas?: Record<string, number>;
}

const JaiminiDashboard = () => {
    const { currentProfile, settings } = useChartSettings();
    const [loading, setLoading] = useState(false);
    const [jaiminiData, setJaiminiData] = useState<JaiminiData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchJaiminiData = useCallback(async () => {
        if (!currentProfile) return;

        setLoading(true);
        setError(null);
        try {
            const birthDetails = {
                date: currentProfile.date,
                time: currentProfile.time,
                latitude: currentProfile.latitude,
                longitude: currentProfile.longitude,
                timezone: currentProfile.timezone
            };

            const response = await api.post('/chart/birth', birthDetails);
            if (response.data && response.data.jaimini) {
                setJaiminiData(response.data.jaimini);
            } else {
                setError("Jaimini data not available in chart response.");
            }
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.detail || 'Failed to fetch Jaimini details.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, [currentProfile, settings]);

    useEffect(() => {
        if (currentProfile) {
            fetchJaiminiData();
        }
    }, [currentProfile, fetchJaiminiData]);

    if (!currentProfile) {
        return (
            <MainLayout breadcrumbs={['Calculations', 'Jaimini']}>
                <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A] text-[#EDEFF5]">
                    <div className="text-center space-y-4">
                        <User className="w-12 h-12 text-[#6F768A] mx-auto" />
                        <p className="text-[#A9B0C2]">Please select a profile to view Jaimini Astrology.</p>
                    </div>
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout breadcrumbs={['Calculations', 'Jaimini']}>
            <div className="min-h-screen w-full bg-[#0B0F1A] text-[#EDEFF5] relative overflow-hidden font-sans p-6 md:p-8">
                
                {/* Background Effects */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] bg-[#6D5DF6]/5 blur-[120px] rounded-full opacity-20" />
                    <div className="absolute bottom-[-10%] right-[20%] w-[50%] h-[50%] bg-[#F5A623]/5 blur-[120px] rounded-full opacity-20" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto space-y-8">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-2xl font-black text-[#EDEFF5] uppercase tracking-wider flex items-center gap-3">
                                <Sparkles className="w-8 h-8 text-[#6D5DF6]" />
                                Jaimini Sutras
                            </h1>
                            <p className="text-[#A9B0C2] text-sm mt-2">Sign-based astrology: Karakas, Arudha Padas, and Chara Dasha.</p>
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
                            <Loader2 className="w-12 h-12 text-[#6D5DF6] animate-spin" />
                            <span className="text-[#A9B0C2] font-bold uppercase tracking-widest text-xs animate-pulse">Decoding Sutras...</span>
                        </div>
                    ) : jaiminiData && !jaiminiData.error ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            
                            {/* 1. Jaimini Karakas (Soul Planets) */}
                            <div className="lg:col-span-1 bg-[#11162A]/60 backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-2xl p-6">
                                <h3 className="text-[#EDEFF5] font-bold text-lg mb-6 flex items-center gap-2">
                                    <Crown className="w-5 h-5 text-[#F5A623]" />
                                    Chara Karakas (7)
                                </h3>
                                
                                {/* Karakamsa Highlight */}
                                {jaiminiData.karakamsa && (
                                    <div className="mb-6 p-4 bg-[#6D5DF6]/10 border border-[#6D5DF6]/20 rounded-xl flex items-center justify-between">
                                        <div>
                                            <p className="text-[#6D5DF6] text-[10px] font-black uppercase tracking-widest mb-1">Karakamsa (Swamsa)</p>
                                            <p className="text-[#EDEFF5] font-bold text-lg">{jaiminiData.karakamsa.sign}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[#A9B0C2] text-xs">Navamsa (D9)</span>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    {jaiminiData.karakas && Object.entries(jaiminiData.karakas).map(([key, data]: [string, any]) => (
                                        <div key={key} className="flex items-center justify-between p-3 bg-[rgba(255,255,255,0.04)] rounded-xl border border-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.08)] transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold 
                                                    ${key === 'Atmakaraka' ? 'bg-[#F5A623] text-black' : 'bg-[#11162A] text-[#A9B0C2] border border-[rgba(255,255,255,0.1)]'}`}>
                                                    {(data.name || data.planet || '??').substring(0, 2)}
                                                </div>
                                                <div>
                                                    <p className="text-[#EDEFF5] font-bold text-sm">{key}</p>
                                                    <p className="text-[#6F768A] text-[10px] uppercase tracking-wider">{data.name || data.planet}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[#EDEFF5] font-mono text-xs">{(data.degree ?? data.degrees ?? 0).toFixed(2)}°</p>
                                                <p className="text-[#A9B0C2] text-[10px]">{data.sign}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 2. Arudha Padas */}
                            <div className="lg:col-span-2 bg-[#11162A]/60 backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-2xl p-6">
                                <h3 className="text-[#EDEFF5] font-bold text-lg mb-6 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-[#6D5DF6]" />
                                    Arudha Padas (Manifested Self)
                                </h3>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {/* AL and UL Highlight */}
                                    <div className="p-4 bg-[#F5A623]/10 border border-[#F5A623]/20 rounded-xl text-center">
                                        <p className="text-[#F5A623] text-xs font-black uppercase tracking-widest mb-1">Arudha Lagna (AL)</p>
                                        <p className="text-[#EDEFF5] font-bold text-xl">{jaiminiData.arudha_padas?.['AL']?.sign || '-'}</p>
                                    </div>
                                    <div className="p-4 bg-[#6D5DF6]/10 border border-[#6D5DF6]/20 rounded-xl text-center">
                                        <p className="text-[#6D5DF6] text-xs font-black uppercase tracking-widest mb-1">Upapada Lagna (UL)</p>
                                        <p className="text-[#EDEFF5] font-bold text-xl">{jaiminiData.arudha_padas?.['UL']?.sign || '-'}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                    {jaiminiData.arudha_padas && Object.entries(jaiminiData.arudha_padas).map(([key, data]) => {
                                        if (key === 'AL' || key === 'UL') return null;
                                        return (
                                            <div key={key} className="p-3 bg-[rgba(255,255,255,0.04)] rounded-xl border border-[rgba(255,255,255,0.08)] text-center">
                                                <p className="text-[#6F768A] text-[10px] font-bold uppercase mb-1">{key}</p>
                                                <p className="text-[#EDEFF5] text-sm font-medium">{data.sign}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>


                            {/* 3. Chara Dasha (Basic View) */}
                            <div className="lg:col-span-3 bg-[#11162A]/60 backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-2xl p-6">
                                <h3 className="text-[#EDEFF5] font-bold text-lg mb-6 flex items-center gap-2">
                                    <Layers className="w-5 h-5 text-[#2ED573]" />
                                    Chara Dasha Periods
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {jaiminiData.chara_dasha && jaiminiData.chara_dasha.map((period: any, idx: number) => (
                                        <div key={idx} className="p-4 bg-[rgba(255,255,255,0.04)] rounded-xl border border-[rgba(255,255,255,0.08)] relative overflow-hidden group hover:bg-[rgba(255,255,255,0.06)] transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[#EDEFF5] font-bold text-lg">{period.sign_name}</span>
                                                <span className="text-[#6F768A] text-xs bg-black/20 px-2 py-0.5 rounded">{period.duration}y</span>
                                            </div>
                                            <div className="text-[#A9B0C2] text-xs space-y-0.5">
                                                <p>Age: {period.start_year} - {period.end_year}</p>
                                            </div>
                                            {/* Progress bar effect if current? (Optional logic) */}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 4. Jaimini Aspects */}
                            <div className="lg:col-span-3 bg-[#11162A]/60 backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-2xl p-6">
                                <h3 className="text-[#EDEFF5] font-bold text-lg mb-6 flex items-center gap-2">
                                    <GitMerge className="w-5 h-5 text-[#E25555]" />
                                    Rashi Drishti (Sign Aspects)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {jaiminiData.aspects && Object.entries(jaiminiData.aspects).map(([planet, data]: [string, any]) => (
                                        <div key={planet} className="p-4 bg-[rgba(255,255,255,0.04)] rounded-xl border border-[rgba(255,255,255,0.08)]">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-6 h-6 rounded-full bg-[#11162A] border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[10px] font-bold text-[#A9B0C2]">
                                                    {planet.substring(0, 2)}
                                                </div>
                                                <span className="text-[#EDEFF5] font-bold">{planet}</span>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <div>
                                                    <p className="text-[#6F768A] text-[10px] uppercase tracking-wider mb-1">Aspects Signs</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {data.aspects_signs.map((sign: string) => (
                                                            <span key={sign} className="px-1.5 py-0.5 bg-[#F5A623]/10 text-[#F5A623] text-[10px] rounded border border-[#F5A623]/20">
                                                                {sign}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                {data.aspects_planets.length > 0 && (
                                                    <div>
                                                        <p className="text-[#6F768A] text-[10px] uppercase tracking-wider mb-1">Aspects Planets</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {data.aspects_planets.map((p: string) => (
                                                                <span key={p} className="px-1.5 py-0.5 bg-[#6D5DF6]/10 text-[#6D5DF6] text-[10px] rounded border border-[#6D5DF6]/20">
                                                                    {p}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    ) : null}
                </div>
            </div>
        </MainLayout>
    );
};

export default JaiminiDashboard;
