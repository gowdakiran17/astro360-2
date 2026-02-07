
import React, { useEffect, useState } from 'react';
import { useChartSettings } from '../context/ChartContext';
import MainLayout from '../components/layout/MainLayout';
import api from '../services/api'; // Changed from named import to default import
import { 
    Star, Sparkles, Compass, Shield, Zap,
    Info, Calendar, Activity, Crown
} from 'lucide-react';
// import { AnimatePresence, motion } from 'framer-motion';

interface NakshatraData {
    birth_star: string;
    birth_pada: number;
    analysis: {
        basic: {
            lord: string;
            symbol: string;
            deity: string;
            gana: string;
            yoni: string;
            nadi: string;
            element: string;
            direction: string;
            quality: string;
            sex: string;
            lucky_letters: string;
        };
        pada_analysis: {
            focus: string;
            sound: string;
        };
    };
    navatara: Array<{
        nakshatra: string;
        lord: string;
        tara: string;
        quality: string;
        score: number;
    }>;
    current_transit: {
        current_nakshatra: string;
        name: string; // Tara name
        meaning: string;
        quality: string;
    };
}

const NakshatraExplorer = () => {
    const { currentProfile, settings } = useChartSettings();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<NakshatraData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchNakshatraData = async () => {
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
            const response = await api.post('/chart/nakshatra', payload);
            setData(response.data);
        } catch (err: any) {
            console.error("Error fetching nakshatra data:", err);
            setError("Failed to load nakshatra analysis.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentProfile) {
            fetchNakshatraData();
        }
    }, [currentProfile, settings]);

    if (!currentProfile) {
        return (
            <MainLayout breadcrumbs={['Calculations', 'Nakshatra']}>
                <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A] text-[#EDEFF5]">
                    <p className="text-[#A9B0C2]">Please select a profile.</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout breadcrumbs={['Calculations', 'Nakshatra']}>
            <div className="min-h-screen w-full bg-[#0B0F1A] text-[#EDEFF5] relative overflow-hidden font-sans p-6 md:p-8">
                
                {/* Background Effects */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#6D5DF6]/5 blur-[120px] rounded-full opacity-20" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#F5A623]/5 blur-[120px] rounded-full opacity-20" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto space-y-8">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-black text-[#EDEFF5] uppercase tracking-wider flex items-center gap-3">
                                <Star className="w-8 h-8 text-[#6D5DF6]" />
                                Nakshatra Explorer
                            </h1>
                            <p className="text-[#A9B0C2] text-sm mt-2">Deep analysis of your Birth Star and Daily Compatibility.</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Star className="w-12 h-12 text-[#6D5DF6] animate-pulse" />
                            <span className="text-[#A9B0C2] font-bold uppercase tracking-widest text-xs">Reading the Stars...</span>
                        </div>
                    ) : error ? (
                        <div className="bg-[#E25555]/10 border border-[#E25555]/20 p-4 rounded-xl text-[#E25555]">
                            {error}
                        </div>
                    ) : data ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            
                            {/* 1. Hero Card: Birth Star */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-gradient-to-br from-[#11162A] to-[#1A1F35] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#6D5DF6]/10 blur-[80px] rounded-full" />
                                    
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-3 py-1 bg-[#6D5DF6]/20 text-[#6D5DF6] border border-[#6D5DF6]/30 rounded-full text-xs font-bold uppercase tracking-wider">
                                                Birth Star
                                            </span>
                                            <span className="text-[#A9B0C2] text-sm font-medium">Pada {data.birth_pada}</span>
                                        </div>
                                        
                                        <h2 className="text-5xl md:text-6xl font-black text-[#EDEFF5] mb-2 tracking-tight">
                                            {data.birth_star}
                                        </h2>
                                        <p className="text-xl text-[#A9B0C2] font-light italic mb-8">
                                            "{data.analysis.basic.symbol}"
                                        </p>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                            <div>
                                                <p className="text-xs text-[#6F768A] uppercase font-bold tracking-wider mb-1">Lord</p>
                                                <p className="text-[#EDEFF5] font-bold text-lg flex items-center gap-2">
                                                    <Crown className="w-4 h-4 text-[#F5A623]" />
                                                    {data.analysis.basic.lord}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-[#6F768A] uppercase font-bold tracking-wider mb-1">Deity</p>
                                                <p className="text-[#EDEFF5] font-bold text-lg">{data.analysis.basic.deity}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-[#6F768A] uppercase font-bold tracking-wider mb-1">Gana</p>
                                                <p className="text-[#EDEFF5] font-bold text-lg">{data.analysis.basic.gana}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-[#6F768A] uppercase font-bold tracking-wider mb-1">Quality</p>
                                                <p className="text-[#EDEFF5] font-bold text-lg">{data.analysis.basic.quality}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Attributes Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <AttributeCard label="Yoni (Animal)" value={data.analysis.basic.yoni} icon={<Sparkles />} />
                                    <AttributeCard label="Nadi (Pulse)" value={data.analysis.basic.nadi} icon={<Activity />} />
                                    <AttributeCard label="Element" value={data.analysis.basic.element} icon={<Zap />} />
                                    <AttributeCard label="Direction" value={data.analysis.basic.direction} icon={<Compass />} />
                                    <AttributeCard label="Lucky Letters" value={data.analysis.basic.lucky_letters} icon={<Info />} />
                                    <AttributeCard label="Purushartha" value={data.analysis.pada_analysis.focus} icon={<Star />} />
                                </div>

                                {/* 3. Navatara Chakra (Compatibility) */}
                                <div className="bg-[#11162A]/60 backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-2xl p-6">
                                    <h3 className="text-[#EDEFF5] font-bold text-lg mb-6 flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-[#2ED573]" />
                                        Navatara Chakra (Compatibility)
                                    </h3>
                                    
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-[#1E293B]">
                                                    <th className="p-3 text-xs font-bold text-[#6F768A] uppercase tracking-wider">Nakshatra</th>
                                                    <th className="p-3 text-xs font-bold text-[#6F768A] uppercase tracking-wider">Tara</th>
                                                    <th className="p-3 text-xs font-bold text-[#6F768A] uppercase tracking-wider">Quality</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.navatara.map((item, idx) => (
                                                    <tr key={idx} className="border-b border-[#1E293B]/50 hover:bg-[#1E293B]/30">
                                                        <td className="p-3 text-[#EDEFF5] text-sm font-medium">{item.nakshatra}</td>
                                                        <td className="p-3 text-[#A9B0C2] text-sm">{item.tara}</td>
                                                        <td className="p-3">
                                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                                                item.quality === 'Positive' 
                                                                    ? 'bg-[#2ED573]/10 text-[#2ED573]' 
                                                                    : 'bg-[#E25555]/10 text-[#E25555]'
                                                            }`}>
                                                                {item.quality}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar: Daily Transit */}
                            <div className="space-y-6">
                                <div className="bg-[#11162A]/80 backdrop-blur-md border border-[#6D5DF6]/30 rounded-2xl p-6 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6D5DF6] to-[#F5A623]" />
                                    
                                    <h3 className="text-[#EDEFF5] font-bold text-lg mb-4 flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-[#F5A623]" />
                                        Today's Energy
                                    </h3>
                                    
                                    <div className="mb-6">
                                        <p className="text-xs text-[#6F768A] uppercase font-bold tracking-wider mb-1">Moon is in</p>
                                        <p className="text-2xl font-black text-[#EDEFF5]">{data.current_transit.current_nakshatra}</p>
                                    </div>
                                    
                                    <div className="p-4 bg-[rgba(255,255,255,0.04)] rounded-xl border border-[rgba(255,255,255,0.08)]">
                                        <p className="text-xs text-[#6F768A] uppercase font-bold tracking-wider mb-2">Tara for You</p>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xl font-bold text-[#EDEFF5]">{data.current_transit.name}</span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                                data.current_transit.quality === 'Positive' 
                                                    ? 'bg-[#2ED573]/10 text-[#2ED573]' 
                                                    : 'bg-[#E25555]/10 text-[#E25555]'
                                            }`}>
                                                {data.current_transit.quality}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[#A9B0C2] italic">
                                            "{data.current_transit.meaning}"
                                        </p>
                                    </div>
                                    
                                    <div className="mt-4 text-xs text-[#6F768A] leading-relaxed">
                                        {data.current_transit.quality === 'Positive' 
                                            ? "This is a favorable time for important activities, travel, and new beginnings."
                                            : "Exercise caution today. Avoid major decisions or risky ventures."
                                        }
                                    </div>
                                </div>

                                {/* Quick Info Box */}
                                <div className="bg-[#11162A]/60 backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-2xl p-6">
                                    <h3 className="text-[#EDEFF5] font-bold text-lg mb-4 flex items-center gap-2">
                                        <Info className="w-5 h-5 text-[#A9B0C2]" />
                                        Did you know?
                                    </h3>
                                    <p className="text-sm text-[#A9B0C2] leading-relaxed">
                                        Your Nakshatra determines your basic temperament and instinctual nature. 
                                        While the Sign (Rasi) shows how you project yourself, the Nakshatra shows how you feel and react internally.
                                    </p>
                                </div>
                            </div>

                        </div>
                    ) : null}
                </div>
            </div>
        </MainLayout>
    );
};

const AttributeCard = ({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) => (
    <div className="p-4 bg-[#11162A]/60 border border-[rgba(255,255,255,0.08)] rounded-xl hover:border-[#6D5DF6]/30 transition-colors">
        <div className="flex items-center gap-2 mb-2 text-[#6F768A]">
            {React.cloneElement(icon as React.ReactElement, { className: "w-4 h-4" })}
            <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
        </div>
        <p className="text-[#EDEFF5] font-bold text-sm truncate" title={value}>{value}</p>
    </div>
);

export default NakshatraExplorer;
