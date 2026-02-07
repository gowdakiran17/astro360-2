
import React, { useEffect, useState } from 'react';
import { useChartSettings } from '../context/ChartContext';
import MainLayout from '../components/layout/MainLayout';
import api from '../services/api';
import { 
    Crown, TrendingUp, Star, 
    Sparkles
} from 'lucide-react';
// import { AnimatePresence, motion } from 'framer-motion';

interface Yoga {
    name: string;
    type: string;
    description: string;
    strength?: string;
}

interface YogaData {
    raja_yogas: Yoga[];
    dhana_yogas: Yoga[];
    mahapurusha_yogas: Yoga[];
    other_yogas: Yoga[];
    total_count: number;
}

const YogaAnalysis = () => {
    const { currentProfile, settings } = useChartSettings();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<YogaData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchYogas = async () => {
        if (!currentProfile) return;
        setLoading(true);
        setError(null);
        try {
            const payload = {
                date: currentProfile.date,
                time: currentProfile.time,
                latitude: currentProfile.latitude,
                longitude: currentProfile.longitude,
                timezone: currentProfile.timezone,
                settings: settings
            };
            const response = await api.post('/chart/yogas', payload);
            setData(response.data);
        } catch (err: any) {
            console.error("Error fetching yogas:", err);
            setError("Failed to load Yoga Analysis.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentProfile) {
            fetchYogas();
        }
    }, [currentProfile, settings]);

    if (!currentProfile) {
        return (
            <MainLayout breadcrumbs={['Calculations', 'Yoga Analysis']}>
                <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A] text-[#EDEFF5]">
                    <p className="text-[#A9B0C2]">Please select a profile.</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout breadcrumbs={['Calculations', 'Yoga Analysis']}>
            <div className="min-h-screen w-full bg-[#0B0F1A] text-[#EDEFF5] relative overflow-hidden font-sans p-6 md:p-8">
                
                {/* Background Effects */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#F5A623]/5 blur-[120px] rounded-full opacity-20" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#6D5DF6]/5 blur-[120px] rounded-full opacity-20" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto space-y-8">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-black text-[#EDEFF5] uppercase tracking-wider flex items-center gap-3">
                                <Crown className="w-8 h-8 text-[#F5A623]" />
                                Planetary Yogas
                            </h1>
                            <p className="text-[#A9B0C2] text-sm mt-2">Special combinations revealing power, wealth, and destiny.</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Sparkles className="w-12 h-12 text-[#6D5DF6] animate-pulse" />
                            <span className="text-[#A9B0C2] font-bold uppercase tracking-widest text-xs">Scanning Combinations...</span>
                        </div>
                    ) : error ? (
                        <div className="bg-[#E25555]/10 border border-[#E25555]/20 p-4 rounded-xl text-[#E25555]">
                            {error}
                        </div>
                    ) : data ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            
                            {/* 1. Raja Yogas (Royal) */}
                            <YogaCard 
                                title="Raja Yogas" 
                                icon={<Crown className="text-[#F5A623]" />} 
                                yogas={data.raja_yogas} 
                                emptyMsg="No major Raja Yogas found."
                                accentColor="border-[#F5A623]/30"
                            />

                            {/* 2. Dhana Yogas (Wealth) */}
                            <YogaCard 
                                title="Dhana Yogas" 
                                icon={<TrendingUp className="text-[#2ED573]" />} 
                                yogas={data.dhana_yogas} 
                                emptyMsg="No major Dhana Yogas found."
                                accentColor="border-[#2ED573]/30"
                            />

                            {/* 3. Mahapurusha Yogas (Greatness) */}
                            <YogaCard 
                                title="Pancha Mahapurusha" 
                                icon={<Star className="text-[#6D5DF6]" />} 
                                yogas={data.mahapurusha_yogas} 
                                emptyMsg="No Mahapurusha Yogas active."
                                accentColor="border-[#6D5DF6]/30"
                            />

                            {/* 4. Other Special Yogas */}
                            {data.other_yogas.length > 0 && (
                                <div className="lg:col-span-3">
                                    <YogaCard 
                                        title="Special Yogas" 
                                        icon={<Sparkles className="text-[#A9B0C2]" />} 
                                        yogas={data.other_yogas} 
                                        emptyMsg=""
                                        accentColor="border-[#EDEFF5]/20"
                                        fullWidth
                                    />
                                </div>
                            )}

                        </div>
                    ) : null}
                </div>
            </div>
        </MainLayout>
    );
};

const YogaCard = ({ title, icon, yogas, emptyMsg, accentColor, fullWidth }: any) => (
    <div className={`bg-[#11162A]/60 backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 relative overflow-hidden ${fullWidth ? 'w-full' : ''}`}>
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 ${accentColor}`} />
        
        <h3 className="text-[#EDEFF5] font-bold text-lg mb-6 flex items-center gap-2">
            {React.cloneElement(icon, { className: "w-5 h-5" })}
            {title}
            <span className="ml-auto text-xs font-medium px-2 py-1 bg-[rgba(255,255,255,0.05)] rounded-full text-[#A9B0C2]">
                {yogas.length}
            </span>
        </h3>
        
        <div className="space-y-4">
            {yogas.length > 0 ? (
                yogas.map((yoga: Yoga, idx: number) => (
                    <div key={idx} className="p-4 bg-[rgba(255,255,255,0.04)] rounded-xl border border-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)] transition-colors">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-[#EDEFF5] text-sm">{yoga.name}</h4>
                            {yoga.strength && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F768A] bg-[#0B0F1A] px-2 py-0.5 rounded">
                                    {yoga.strength}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-[#A9B0C2] leading-relaxed">{yoga.description}</p>
                    </div>
                ))
            ) : (
                <div className="text-center py-8 text-[#6F768A] text-sm italic">
                    {emptyMsg}
                </div>
            )}
        </div>
    </div>
);

export default YogaAnalysis;
