
import { useEffect, useState } from 'react';
import { useChartSettings } from '../context/ChartContext';
import MainLayout from '../components/layout/MainLayout';
import api from '../services/api';
import { 
    Ghost, Clock, AlertTriangle, Shield,
    Info
} from 'lucide-react';
// import { AnimatePresence, motion } from 'framer-motion';

interface ShadowPlanet {
    name: string;
    longitude: number;
    type: 'Malefic' | 'Benefic';
    description: string;
    sign: string;
    nakshatra: string;
}

const ShadowPlanets = () => {
    const { currentProfile, settings } = useChartSettings();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ShadowPlanet[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchShadowPlanets = async () => {
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
            const response = await api.post('/chart/shadow-planets', payload);
            setData(response.data);
        } catch (err: any) {
            console.error("Error fetching shadow planets:", err);
            setError("Failed to load Shadow Planets.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentProfile) {
            fetchShadowPlanets();
        }
    }, [currentProfile, settings]);

    if (!currentProfile) {
        return (
            <MainLayout breadcrumbs={['Calculations', 'Shadow Planets']}>
                <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A] text-[#EDEFF5]">
                    <p className="text-[#A9B0C2]">Please select a profile.</p>
                </div>
            </MainLayout>
        );
    }

    const upagrahas = data.filter(p => !['Gulika', 'Mandi', 'Yamaghantaka'].includes(p.name));
    const timePoints = data.filter(p => ['Gulika', 'Mandi', 'Yamaghantaka'].includes(p.name));

    return (
        <MainLayout breadcrumbs={['Calculations', 'Shadow Planets']}>
            <div className="min-h-screen w-full bg-[#0B0F1A] text-[#EDEFF5] relative overflow-hidden font-sans p-6 md:p-8">
                
                {/* Background Effects */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#E25555]/5 blur-[120px] rounded-full opacity-20" />
                    <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#6D5DF6]/5 blur-[120px] rounded-full opacity-20" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto space-y-8">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-black text-[#EDEFF5] uppercase tracking-wider flex items-center gap-3">
                                <Ghost className="w-8 h-8 text-[#A9B0C2]" />
                                Shadow Planets (Upagrahas)
                            </h1>
                            <p className="text-[#A9B0C2] text-sm mt-2">The unseen forces derived from the Sun and Time.</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Ghost className="w-12 h-12 text-[#6D5DF6] animate-pulse" />
                            <span className="text-[#A9B0C2] font-bold uppercase tracking-widest text-xs">Summoning Shadows...</span>
                        </div>
                    ) : error ? (
                        <div className="bg-[#E25555]/10 border border-[#E25555]/20 p-4 rounded-xl text-[#E25555]">
                            {error}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            
                            {/* 1. Time-Based Shadows (Gulika/Mandi) */}
                            <div className="space-y-6">
                                <h3 className="text-[#EDEFF5] font-bold text-lg flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-[#F5A623]" />
                                    Time-Based Shadows (Kaala)
                                </h3>
                                <div className="space-y-4">
                                    {timePoints.map((p) => (
                                        <div key={p.name} className="bg-[#11162A]/60 backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 hover:border-[#F5A623]/30 transition-colors">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="text-xl font-bold text-[#EDEFF5]">{p.name}</h4>
                                                    <p className="text-xs text-[#A9B0C2]">{p.description}</p>
                                                </div>
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                    p.type === 'Benefic' ? 'bg-[#2ED573]/10 text-[#2ED573]' : 'bg-[#E25555]/10 text-[#E25555]'
                                                }`}>
                                                    {p.type}
                                                </span>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div className="p-3 bg-[rgba(255,255,255,0.04)] rounded-xl">
                                                    <p className="text-[10px] text-[#6F768A] uppercase font-bold tracking-wider mb-1">Sign</p>
                                                    <p className="font-bold text-[#EDEFF5]">{p.sign}</p>
                                                </div>
                                                <div className="p-3 bg-[rgba(255,255,255,0.04)] rounded-xl">
                                                    <p className="text-[10px] text-[#6F768A] uppercase font-bold tracking-wider mb-1">Nakshatra</p>
                                                    <p className="font-bold text-[#EDEFF5]">{p.nakshatra}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4 flex items-center gap-2 text-xs text-[#6F768A]">
                                                <Info className="w-3 h-3" />
                                                <span>Longitude: {p.longitude.toFixed(2)}°</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 2. Mathematical Shadows (Dhuma etc) */}
                            <div className="space-y-6">
                                <h3 className="text-[#EDEFF5] font-bold text-lg flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-[#E25555]" />
                                    Mathematical Shadows (Surya)
                                </h3>
                                <div className="bg-[#11162A]/60 backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-2xl p-6">
                                    <div className="space-y-6">
                                        {upagrahas.map((p) => (
                                            <div key={p.name} className="border-b border-[rgba(255,255,255,0.04)] last:border-0 pb-4 last:pb-0">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-bold text-[#EDEFF5]">{p.name}</span>
                                                    <span className={`text-[10px] font-bold uppercase ${
                                                        p.type === 'Benefic' ? 'text-[#2ED573]' : 'text-[#E25555]'
                                                    }`}>
                                                        {p.type}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs text-[#A9B0C2]">
                                                    <span>{p.sign} • {p.nakshatra}</span>
                                                    <span>{p.longitude.toFixed(2)}°</span>
                                                </div>
                                                <p className="text-[10px] text-[#6F768A] mt-1">{p.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-[#11162A]/60 backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-2xl p-6">
                                    <h3 className="text-[#EDEFF5] font-bold text-lg mb-4 flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-[#A9B0C2]" />
                                        Significance
                                    </h3>
                                    <p className="text-sm text-[#A9B0C2] leading-relaxed mb-4">
                                        Shadow planets (Upagrahas) are non-luminous points that modify the results of the houses they occupy. 
                                        <strong> Gulika</strong> and <strong>Mandi</strong> are particularly potent for timing tragic events or health issues, 
                                        while <strong>Yamaghantaka</strong> can indicate auspicious timing but reduced longevity.
                                    </p>
                                    <p className="text-sm text-[#A9B0C2] leading-relaxed">
                                        Mathematical points like <strong>Dhuma</strong> and <strong>Vyatipata</strong> act as "burning" points, 
                                        often causing sudden disruptions or mental anguish when transited by key planets.
                                    </p>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default ShadowPlanets;
