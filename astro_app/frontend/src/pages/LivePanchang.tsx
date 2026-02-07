import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import MainLayout from '../components/layout/MainLayout';
import {
    RefreshCw, Sun, Moon, Clock, Calendar,
    Zap, Layers, Sunrise, Sunset, MoveUp, MoveDown, Info
} from 'lucide-react';

const ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const LivePanchang = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [panchangData, setPanchangData] = useState<any>(null);
    const [error, setError] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());

    // Default location (Bengaluru)
    const [location] = useState({
        name: "Bengaluru, Karnataka, IN",
        latitude: 12.97,
        longitude: 77.59,
        timezone: "+05:30"
    });

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (user) {
            fetchPanchang();
        }
    }, [user]);

    const fetchPanchang = async () => {
        setLoading(true);
        setError('');
        try {
            const now = new Date();
            const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
            const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

            const response = await api.post('chart/live-panchang', {
                date: dateStr,
                time: timeStr,
                timezone: location.timezone,
                latitude: location.latitude,
                longitude: location.longitude
            });
            setPanchangData(response.data);
        } catch (err: any) {
            console.error("Failed to fetch panchang", err);
            const msg = err.response?.data?.detail || "Unable to load Panchang data. Please check your connection.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (date: Date) => date.toLocaleTimeString([], { hour12: false });
    const formatDate = (date: Date) => date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const formatJDToTime = (jd: number) => {
        if (!jd) return '--:--';
        const date = new Date((jd - 2440587.5) * 86400000);

        // Parse timezone offset from meta or location (e.g., "+05:30")
        const tzStr = panchangData?.meta?.timezone || location.timezone;
        const sign = tzStr[0] === '+' ? 1 : -1;
        const [hours, minutes] = tzStr.substring(1).split(':').map(Number);
        const offsetMs = sign * (hours * 3600000 + minutes * 60000);

        const localDate = new Date(date.getTime() + offsetMs);
        return localDate.getUTCHours().toString().padStart(2, '0') + ':' +
            localDate.getUTCMinutes().toString().padStart(2, '0');
    };

    const TimelineBar = ({ label, segments, currentMinutes, color }: any) => {
        return (
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${color} shadow-[0_0_8px_rgba(0,0,0,0.3)]`} />
                    <span className="text-[10px] font-black text-[#6F768A] uppercase tracking-[0.2em]">{label}</span>
                </div>
                <div className="h-8 bg-[#0B0F1A]/50 rounded-lg overflow-hidden flex relative border border-[rgba(255,255,255,0.08)]">
                    {segments.map((seg: any, idx: number) => {
                        const width = ((seg.end - seg.start) / 1440) * 100;
                        const left = (seg.start / 1440) * 100;
                        return (
                            <div
                                key={`${label}-${idx}-${seg.start}-${seg.end}`}
                                className={`absolute h-full flex items-center px-4 transition-all hover:brightness-110 cursor-default ${idx % 2 === 0 ? 'opacity-90' : 'opacity-100'}`}
                                style={{
                                    width: `${width}%`,
                                    left: `${left}%`,
                                    backgroundColor: label === 'Tithi' ? (idx % 2 === 0 ? '#D98E15' : '#F5A623') :
                                        label === 'Nakshatra' ? (idx % 2 === 0 ? '#27B561' : '#2ED573') :
                                            label === 'Yoga' ? (idx % 2 === 0 ? '#5B4BC4' : '#6D5DF6') : '#E25555'
                                }}
                            >
                                <span className="text-[10px] font-black text-[#0B0F1A] truncate drop-shadow-sm">{seg.name}</span>
                            </div>
                        );
                    })}
                    <div
                        className="absolute top-0 bottom-0 w-0.5 bg-[#EDEFF5] z-10 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                        style={{ left: `${(currentMinutes / 1440) * 100}%` }}
                    />
                </div>
            </div>
        );
    };

    const MoonGraphic = ({ illumination, phaseName }: any) => {
        const isWaxing = !phaseName.includes('Waning');

        return (
            <div className="relative w-40 h-40 glass-card flex items-center justify-center shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="absolute bg-[#EDEFF5] rounded-full animate-twinkle" style={{
                            width: 1.5,
                            height: 1.5,
                            top: `${(i * 17) % 100}%`,
                            left: `${(i * 23) % 100}%`,
                            animationDelay: `${i * 0.2}s`
                        }} />
                    ))}
                </div>
                <svg width="80" height="80" viewBox="0 0 100 100" className="drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    <circle cx="50" cy="50" r="45" fill="#0B0F1A" />
                    <path
                        d={`M 50 5 A 45 45 0 1 ${isWaxing ? 1 : 0} 50 95 A ${45 * (Math.abs(50 - illumination) / 50)} 45 0 1 ${illumination > 50 ? (isWaxing ? 1 : 0) : (isWaxing ? 0 : 1)} 50 5`}
                        fill="#EDEFF5"
                    />
                </svg>
                <div className="absolute bottom-4 left-0 right-0 text-center">
                    <p className="text-[10px] font-black text-[#6D5DF6] uppercase tracking-widest drop-shadow-md">{illumination.toFixed(1)}% Illuminated</p>
                </div>
            </div>
        );
    };

    return (
        <MainLayout title="Live Panchang" breadcrumbs={['Global Tools', 'Panchang']}>
            <div className="w-full space-y-6 pb-20 px-6">
                <div className="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-[#F5A623] rounded-2xl text-[#0B0F1A] shadow-xl shadow-orange-900/20">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-[#EDEFF5] flex items-center gap-2">
                                Live Panchang
                                <span className="px-2 py-0.5 bg-[#F5A623]/20 text-[#F5A623] text-[10px] uppercase tracking-widest rounded-md font-bold border border-[#F5A623]/20">Live</span>
                            </h1>
                            <p className="text-sm text-[#A9B0C2] mt-1">Real-time vedic calendar information • {location.name}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="text-2xl font-black text-[#EDEFF5] tracking-tighter tabular-nums">
                            {formatTime(currentTime)}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-[#6F768A] uppercase tracking-widest mt-1">
                            <div className="h-2 w-2 rounded-full bg-[#2ED573] animate-pulse shadow-[0_0_8px_rgba(46,213,115,0.5)]" />
                            LIVE • {formatDate(currentTime)}
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-[#E25555]/10 border border-[#E25555]/20 text-[#E25555] p-6 rounded-3xl flex items-center gap-4">
                        <Info className="w-5 h-5" />
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="py-40 flex flex-col items-center justify-center animate-pulse">
                        <div className="h-12 w-12 border-4 border-[rgba(255,255,255,0.1)] border-t-[#F5A623] rounded-full animate-spin" />
                        <p className="mt-4 text-xs font-bold text-[#6F768A] uppercase tracking-[0.3em]">Calculating Panchang...</p>
                    </div>
                ) : panchangData && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="glass-card p-6 space-y-8">
                                <div className="flex items-center gap-3 mb-2">
                                    <Calendar className="w-5 h-5 text-[#6F768A]" />
                                    <h3 className="font-black text-[#EDEFF5] text-sm uppercase tracking-widest">Panchang Timeline</h3>
                                </div>
                                <TimelineBar
                                    label="Tithi"
                                    segments={panchangData.timeline.tithi}
                                    currentMinutes={currentTime.getHours() * 60 + currentTime.getMinutes()}
                                    color="bg-[#F5A623]"
                                />
                                <TimelineBar
                                    label="Nakshatra"
                                    segments={panchangData.timeline.nakshatra}
                                    currentMinutes={currentTime.getHours() * 60 + currentTime.getMinutes()}
                                    color="bg-[#2ED573]"
                                />
                                <TimelineBar
                                    label="Yoga"
                                    segments={panchangData.timeline.yoga}
                                    currentMinutes={currentTime.getHours() * 60 + currentTime.getMinutes()}
                                    color="bg-[#6D5DF6]"
                                />
                                <TimelineBar
                                    label="Karana"
                                    segments={panchangData.timeline.karana}
                                    currentMinutes={currentTime.getHours() * 60 + currentTime.getMinutes()}
                                    color="bg-[#E25555]"
                                />
                            </div>

                            <div className="glass-card p-6 overflow-hidden">
                                <div className="flex items-center gap-3 mb-6">
                                    <Layers className="w-5 h-5 text-[#6F768A]" />
                                    <h3 className="font-black text-[#EDEFF5] text-sm uppercase tracking-widest">Lagna Journey Across the Day</h3>
                                </div>
                                <div className="h-[300px] w-full relative pt-4 pb-8">
                                    <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-[8px] font-black text-[#6F768A] uppercase tracking-tighter pr-2 border-r border-[rgba(255,255,255,0.08)]">
                                        {ZODIAC_SIGNS.slice().reverse().map(sign => <div key={sign}>{sign}</div>)}
                                    </div>
                                    <div className="ml-12 h-full relative">
                                        {[...Array(12)].map((_, i) => (
                                            <div key={i} className="absolute w-full border-t border-[rgba(255,255,255,0.08)]" style={{ top: `${(i / 11) * 100}%` }} />
                                        ))}
                                        {[...Array(7)].map((_, j) => (
                                            <div key={j} className="absolute h-full border-l border-[rgba(255,255,255,0.08)]" style={{ left: `${(j / 6) * 100}%` }} />
                                        ))}
                                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                            <path
                                                d={`M 0 ${((11 - panchangData.lagna_journey[0].sign_idx) / 11) * 100}% ${panchangData.lagna_journey.map((pt: any) => `L ${(pt.time / 1440) * 100}% ${((11 - pt.sign_idx) / 11) * 100}%`).join(' ')}`}
                                                fill="none" stroke="#6D5DF6" strokeWidth="2.5" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(109,93,246,0.4)]"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-12 mt-2 flex justify-between text-[8px] font-black text-[#6F768A] uppercase tracking-widest">
                                        {['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'].map((t, i) => <div key={`${t}-${i}`}>{t}</div>)}
                                    </div>
                                </div>
                                <p className="text-[9px] font-bold text-[#6F768A] uppercase text-center mt-4">Lagna changes roughly every 2 hours. The step chart tracks each zodiac sign until the next transition.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="glass-card p-6 flex flex-col items-center text-center">
                                <div className="flex items-center gap-3 w-full mb-6">
                                    <Moon className="w-5 h-5 text-[#6F768A]" />
                                    <h3 className="font-black text-[#EDEFF5] text-sm uppercase tracking-widest">Moon Visualization</h3>
                                </div>
                                <MoonGraphic illumination={panchangData.current.illumination} phaseName={panchangData.current.phase_name} />
                                <div className="mt-6 space-y-1">
                                    <p className="text-xl font-black text-[#EDEFF5] tracking-tight">{panchangData.current.phase_name}</p>
                                    <p className="text-xs font-bold text-[#6F768A] uppercase tracking-widest">Current Lunar Phase</p>
                                </div>
                                <div className="grid grid-cols-2 w-full gap-4 mt-8 pt-6 border-t border-[rgba(255,255,255,0.08)]">
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-[#6F768A] uppercase mb-1">Direction</p>
                                        <div className="p-3 bg-[rgba(255,255,255,0.04)] rounded-xl border border-[rgba(255,255,255,0.08)]">
                                            <p className="text-sm font-black text-[#EDEFF5] tabular-nums">{panchangData.current.azimuth.toFixed(1)}°</p>
                                            <p className="text-[8px] font-bold text-[#6F768A] uppercase mt-0.5">Azimuth</p>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-[#6F768A] uppercase mb-1">Elevation</p>
                                        <div className="p-3 bg-[rgba(255,255,255,0.04)] rounded-xl border border-[rgba(255,255,255,0.08)]">
                                            <p className="text-sm font-black text-[#EDEFF5] tabular-nums">{panchangData.current.elevation.toFixed(1)}°</p>
                                            <p className="text-[8px] font-bold text-[#6F768A] uppercase mt-0.5">Alt/Alt</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <Zap className="w-5 h-5 text-[#6F768A]" />
                                    <h3 className="font-black text-[#EDEFF5] text-sm uppercase tracking-widest">Tithi Progress</h3>
                                </div>
                                <div className="text-center mb-6">
                                    <p className="text-2xl font-black text-[#EDEFF5] tracking-tight">{panchangData.current.tithi}</p>
                                    <p className="text-[10px] font-bold text-[#6F768A] uppercase tracking-widest mt-1">Status: Active</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black text-[#6F768A] uppercase tracking-tighter">
                                        <span>Lunar Month Progress</span>
                                        <span className="text-[#EDEFF5]">{(panchangData.current.tithi_progress * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="h-4 bg-[#0B0F1A]/50 rounded-full overflow-hidden border border-[rgba(255,255,255,0.08)] p-0.5">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#F5A623] via-[#D98E15] to-[#E25555] rounded-full shadow-[0_0_10px_rgba(245,158,11,0.3)] transition-all duration-1000"
                                            style={{ width: `${panchangData.current.tithi_progress * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[8px] font-bold text-[#6F768A] uppercase tracking-widest pt-1">
                                        <span>{formatJDToTime(panchangData.current.tithi_start)}</span>
                                        <span>{formatJDToTime(panchangData.current.tithi_end)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card bg-[#0B0F1A]/40 p-6 shadow-2xl relative overflow-hidden ring-1 ring-[rgba(255,255,255,0.08)]">
                                <div className="absolute top-0 right-0 p-8 transform translate-x-1/4 -translate-y-1/4 opacity-[0.03] rotate-12 pointer-events-none">
                                    <Sunrise className="w-48 h-48 text-[#6D5DF6]" />
                                </div>
                                <div className="flex items-center gap-3 mb-8 relative z-10">
                                    <Sun className="w-5 h-5 text-[#6D5DF6]" />
                                    <h3 className="font-black text-[#6D5DF6] text-sm uppercase tracking-widest">Sun & Moon Timeline</h3>
                                </div>
                                <div className="space-y-6 relative z-10">
                                    <div className="flex items-center justify-between group cursor-default">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-[#F5A623]/10 rounded-xl text-[#F5A623] group-hover:bg-[#F5A623]/20 transition-all border border-[#F5A623]/10">
                                                <Sunrise className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs font-bold text-[#A9B0C2] tracking-wide">Sunrise</span>
                                        </div>
                                        <div className="text-sm font-black text-[#EDEFF5] tabular-nums">{formatJDToTime(panchangData.current.sunrise)}</div>
                                    </div>
                                    <div className="flex items-center justify-between group cursor-default">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-[#F5A623]/10 rounded-xl text-[#F5A623] group-hover:bg-[#F5A623]/20 transition-all border border-[#F5A623]/10">
                                                <Sunset className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs font-bold text-[#A9B0C2] tracking-wide">Sunset</span>
                                        </div>
                                        <div className="text-sm font-black text-[#EDEFF5] tabular-nums">{formatJDToTime(panchangData.current.sunset)}</div>
                                    </div>
                                    <div className="flex items-center justify-between group cursor-default">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-[#6D5DF6]/10 rounded-xl text-[#6D5DF6] group-hover:bg-[#6D5DF6]/20 transition-all border border-[#6D5DF6]/10">
                                                <MoveUp className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs font-bold text-[#A9B0C2] tracking-wide">Moonrise</span>
                                        </div>
                                        <div className="text-sm font-black text-[#EDEFF5] tabular-nums">
                                            {panchangData.current.moonrise ? formatJDToTime(panchangData.current.moonrise) : '--:--'}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between group cursor-default">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-[#6D5DF6]/10 rounded-xl text-[#6D5DF6] group-hover:bg-[#6D5DF6]/20 transition-all border border-[#6D5DF6]/10">
                                                <MoveDown className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs font-bold text-[#A9B0C2] tracking-wide">Moonset</span>
                                        </div>
                                        <div className="text-sm font-black text-[#EDEFF5] tabular-nums">
                                            {panchangData.current.moonset ? formatJDToTime(panchangData.current.moonset) : '--:--'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!loading && panchangData && (
                    <div className="glass-card bg-[#6D5DF6]/5 border-[#6D5DF6]/10 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-[#6D5DF6]/10 rounded-2xl text-[#6D5DF6] border border-[#6D5DF6]/10">
                                <Info className="w-5 h-5" />
                            </div>
                            <p className="text-sm text-[#A9B0C2] font-medium leading-relaxed max-w-2xl">
                                Panchang is the ancient Vedic calendar based on 5 parameters. It defines the energy and quality of time for any given moment. Study the Lagna Journey and Tithi status for auspicious timing selection.
                            </p>
                        </div>
                        <button
                            onClick={fetchPanchang}
                            className="flex items-center px-6 py-3 bg-[#F5A623] text-[#0B0F1A] rounded-xl text-sm font-black shadow-xl shadow-orange-900/30 hover:bg-[#D98E15] transition-all active:scale-95 whitespace-nowrap border border-[#F5A623]/20"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" /> REFRESH DATA
                        </button>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default LivePanchang;
