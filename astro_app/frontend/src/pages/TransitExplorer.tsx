import { useEffect, useState } from 'react';
import { useChartSettings } from '../context/ChartContext';
import MainLayout from '../components/layout/MainLayout';
import api from '../services/api';
import UniversalChart from '../components/charts/UniversalChart';
import { 
    Navigation, Calendar, MapPin, Layers, Shield, ShieldAlert, Moon
} from 'lucide-react';

interface TransitAnalysis {
    planet: string;
    current_sign: string;
    house_from_moon: number;
    status: string;
    vedha_blocked: boolean;
    blocking_planet?: string;
    kakshya: {
        lord: string;
        has_bindu: boolean;
        status: string;
    };
    moorthi: {
        type: string;
        note: string;
    };
    score_sav: number;
}

interface TransitPlanet {
    name: string;
    longitude: number;
    zodiac_sign: string;
    nakshatra: string;
    nakshatra_pada: number;
    is_retrograde: boolean;
    speed: number;
}

interface TransitResponse {
    transit_date: string;
    analysis: TransitAnalysis[];
    transit_planets: TransitPlanet[];
}

const TransitExplorer = () => {
    const { currentProfile, settings } = useChartSettings();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<TransitResponse | null>(null);
    const [natalChart, setNatalChart] = useState<any>(null); // Store full natal chart
    const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');
    const [error, setError] = useState<string | null>(null);
    
    // Date Selection (Default Today)
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    // const [selectedTime, setSelectedTime] = useState(new Date().toTimeString().slice(0, 5));
    const selectedTime = new Date().toTimeString().slice(0, 5);

    const fetchTransits = async () => {
        if (!currentProfile) return;
        setLoading(true);
        setError(null);
        try {
            // Format date for API (YYYY-MM-DD -> DD/MM/YYYY)
            const [y, m, d] = selectedDate.split('-');
            const formattedDate = `${d}/${m}/${y}`;

            const birthPayload = {
                date: currentProfile.date,
                time: currentProfile.time,
                latitude: currentProfile.latitude,
                longitude: currentProfile.longitude,
                timezone: currentProfile.timezone,
                settings: settings
            };

            const transitPayload = {
                birth_details: birthPayload,
                transit_date: formattedDate,
                transit_time: selectedTime,
                transit_timezone: currentProfile.timezone, // Assuming user is in same TZ for now
                transit_latitude: currentProfile.latitude,
                transit_longitude: currentProfile.longitude
            };
            
            // Parallel fetch: Transits + Natal Chart (for overlay)
            const [transitRes, natalRes] = await Promise.all([
                api.post('/chart/transits/advanced', transitPayload),
                api.post('/chart/birth', birthPayload)
            ]);

            setData(transitRes.data);
            setNatalChart(natalRes.data);
        } catch (err: any) {
            console.error("Error fetching transits:", err);
            setError("Failed to calculate transits.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentProfile) {
            fetchTransits();
        }
    }, [currentProfile, selectedDate, selectedTime]);

    if (!currentProfile) {
        return (
            <MainLayout breadcrumbs={['Calculations', 'Transit Explorer']}>
                <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A] text-[#EDEFF5]">
                    <p className="text-[#A9B0C2]">Please select a profile.</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout breadcrumbs={['Calculations', 'Transit Explorer']}>
            <div className="min-h-screen w-full bg-[#0B0F1A] text-[#EDEFF5] relative overflow-hidden font-sans p-6 md:p-8">
                
                {/* Background */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#6D5DF6]/5 blur-[120px] rounded-full opacity-20" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#2ED573]/5 blur-[120px] rounded-full opacity-20" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto space-y-8">
                    
                    {/* Header & Controls */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#11162A]/60 p-6 rounded-2xl border border-[rgba(255,255,255,0.08)] backdrop-blur-md">
                        <div>
                            <h1 className="text-3xl font-black text-[#EDEFF5] uppercase tracking-wider flex items-center gap-3">
                                <Navigation className="w-8 h-8 text-[#6D5DF6]" />
                                Transit Explorer
                            </h1>
                            <p className="text-[#A9B0C2] text-sm mt-2">Gochar Analysis with Vedha, Kakshya & Moorthi Nirnaya</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 items-center">
                            {/* View Toggle */}
                            <div className="flex bg-[#0B0F1A] rounded-lg border border-[rgba(255,255,255,0.1)] p-1">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-3 py-1.5 rounded-md text-sm font-bold transition-colors ${viewMode === 'list' ? 'bg-[#6D5DF6] text-white' : 'text-[#A9B0C2] hover:text-white'}`}
                                >
                                    List
                                </button>
                                <button
                                    onClick={() => setViewMode('chart')}
                                    className={`px-3 py-1.5 rounded-md text-sm font-bold transition-colors ${viewMode === 'chart' ? 'bg-[#6D5DF6] text-white' : 'text-[#A9B0C2] hover:text-white'}`}
                                >
                                    Chart Overlay
                                </button>
                            </div>

                            <div className="flex items-center gap-2 bg-[#0B0F1A] px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.1)]">
                                <Calendar className="w-4 h-4 text-[#A9B0C2]" />
                                <input 
                                    type="date" 
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="bg-transparent border-none text-[#EDEFF5] focus:outline-none text-sm"
                                />
                            </div>
                            <div className="flex items-center gap-2 bg-[#0B0F1A] px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.1)]">
                                <MapPin className="w-4 h-4 text-[#A9B0C2]" />
                                <span className="text-sm text-[#EDEFF5] truncate max-w-[150px]">
                                    {currentProfile.name || "Current Location"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Navigation className="w-12 h-12 text-[#6D5DF6] animate-spin" />
                            <span className="text-[#A9B0C2] font-bold uppercase tracking-widest text-xs">Calculating Positions...</span>
                        </div>
                    ) : error ? (
                        <div className="bg-[#E25555]/10 border border-[#E25555]/20 p-4 rounded-xl text-[#E25555]">
                            {error}
                        </div>
                    ) : data ? (
                        <>
                            {viewMode === 'list' ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    {data.analysis.map((planet, idx) => {
                                        // Find planet detail for extra info
                                        const detail = data.transit_planets.find(p => p.name === planet.planet);
                                        if (!detail) return null;

                                        return (
                                            <TransitCard 
                                                key={idx} 
                                                analysis={planet} 
                                                detail={detail}
                                            />
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="bg-[#11162A]/60 backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 flex justify-center items-center min-h-[500px] animate-in fade-in zoom-in-95 duration-500">
                                    <div className="w-full max-w-2xl relative">
                                        <div className="absolute top-0 right-0 bg-[#0B0F1A]/80 backdrop-blur rounded-lg p-3 border border-white/10 z-10 text-xs">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-2 h-2 rounded-full bg-slate-400"></div> Natal Planets
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-[#2ED573]"></div> Transit Planets
                                            </div>
                                        </div>
                                        <UniversalChart 
                                            data={natalChart} 
                                            transits={data.transit_planets}
                                            className="w-full h-full"
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    ) : null}
                </div>
            </div>
        </MainLayout>
    );
};

const TransitCard = ({ analysis, detail }: { analysis: TransitAnalysis, detail: TransitPlanet }) => {
    // Status Colors
    const isFavorable = analysis.status === "Favorable";
    const statusColor = isFavorable ? "text-[#2ED573]" : "text-[#E25555]";
    const borderColor = isFavorable ? "border-[#2ED573]/20" : "border-[#E25555]/20";
    
    // Moorthi Color
    const moorthiColor = {
        "Gold": "text-[#F5A623]",
        "Silver": "text-[#A9B0C2]",
        "Copper": "text-[#D97757]",
        "Iron": "text-[#5C5C5C]",
        "Unknown": "text-gray-500"
    }[analysis.moorthi.type] || "text-gray-500";

    return (
        <div className={`bg-[#11162A]/60 backdrop-blur-md border ${borderColor} rounded-2xl p-6 relative overflow-hidden group hover:border-opacity-40 transition-all`}>
            
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]`}>
                        <span className="text-xl font-bold text-[#EDEFF5]">{analysis.planet.substring(0, 2)}</span>
                    </div>
                    <div>
                        <h3 className="text-[#EDEFF5] font-bold text-lg">{analysis.planet}</h3>
                        <p className="text-[#A9B0C2] text-xs flex items-center gap-1">
                            {detail.zodiac_sign} {Math.floor(detail.longitude % 30)}°{Math.round((detail.longitude % 1) * 60)}'
                            {detail.is_retrograde && <span className="text-[#E25555] font-bold ml-1">(R)</span>}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <div className={`text-sm font-bold uppercase tracking-wider ${statusColor}`}>
                        {analysis.status}
                    </div>
                    <div className="text-[10px] text-[#6F768A]">
                        {analysis.house_from_moon}H from Moon
                    </div>
                </div>
            </div>

            {/* Grid Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 bg-[rgba(255,255,255,0.02)] rounded-lg border border-[rgba(255,255,255,0.04)]">
                    <span className="text-[10px] text-[#6F768A] uppercase block mb-1">Nakshatra</span>
                    <div className="text-[#EDEFF5] text-sm font-medium truncate">
                        {detail.nakshatra}
                        <span className="text-[#A9B0C2] text-xs ml-1">({detail.nakshatra_pada})</span>
                    </div>
                </div>
                <div className="p-3 bg-[rgba(255,255,255,0.02)] rounded-lg border border-[rgba(255,255,255,0.04)]">
                    <span className="text-[10px] text-[#6F768A] uppercase block mb-1">SAV Score</span>
                    <div className="text-[#EDEFF5] text-sm font-medium">
                        {analysis.score_sav} Points
                    </div>
                </div>
            </div>

            {/* Advanced Metrics */}
            <div className="space-y-3">
                
                {/* Kakshya */}
                <div className="flex items-center justify-between text-xs p-2 rounded bg-[rgba(255,255,255,0.02)]">
                    <span className="text-[#A9B0C2] flex items-center gap-2">
                        <Layers className="w-3 h-3" /> Kakshya ({analysis.kakshya.lord})
                    </span>
                    <span className={analysis.kakshya.has_bindu ? "text-[#2ED573]" : "text-[#E25555]"}>
                        {analysis.kakshya.status}
                    </span>
                </div>

                {/* Vedha */}
                <div className="flex items-center justify-between text-xs p-2 rounded bg-[rgba(255,255,255,0.02)]">
                    <span className="text-[#A9B0C2] flex items-center gap-2">
                        <Shield className="w-3 h-3" /> Vedha Check
                    </span>
                    {analysis.vedha_blocked ? (
                        <span className="text-[#E25555] flex items-center gap-1">
                            Blocked by {analysis.blocking_planet} <ShieldAlert className="w-3 h-3" />
                        </span>
                    ) : (
                        <span className="text-[#2ED573]">Clear</span>
                    )}
                </div>

                {/* Moorthi */}
                <div className="flex items-center justify-between text-xs p-2 rounded bg-[rgba(255,255,255,0.02)]">
                    <span className="text-[#A9B0C2] flex items-center gap-2">
                        <Moon className="w-3 h-3" /> Moorthi
                    </span>
                    <span className={`font-bold ${moorthiColor}`}>
                        {analysis.moorthi.type}
                    </span>
                </div>

            </div>
        </div>
    );
};

export default TransitExplorer;
