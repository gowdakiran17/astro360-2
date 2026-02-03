import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import api from '../services/api';
import CosmicWeatherCard from '../components/transits/CosmicWeatherCard';
import MajorTransits from '../components/transits/MajorTransits';
import FastTransitsStrip from '../components/transits/FastTransitsStrip';
import CosmicPriorities from '../components/transits/CosmicPriorities';
import TimelineStory from '../components/transits/TimelineStory';
import AlignmentPractice from '../components/transits/AlignmentPractice';
import TransitInspector from '../components/transits/TransitInspector';
import { useChartSettings } from '../context/ChartContext';
import { AlertTriangle } from 'lucide-react';

// --- Types ---
interface Planet {
    name: string;
    sign: string;
    longitude: number;
    house: number;
    isRetrograde?: boolean;
}

interface AIInsight {
    summary: string;
    priority_order: any[];
    action_guidance: {
        do: string[];
        avoid: string[];
    };
    alignment_practice: {
        morning: string;
        afternoon: string;
        evening: string;
    };
}

const ZODIAC_ORDER = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const Transits = () => {
    const { currentProfile } = useChartSettings();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Data States
    const [transitPlanets, setTransitPlanets] = useState<Planet[]>([]);
    const [dashaInfo, setDashaInfo] = useState<{ maha: string; antar: string; } | null>(null);
    const [moonContext, setMoonContext] = useState<{ sign: string; house: number; }>({ sign: 'Unknown', house: 1 });

    // AI States
    const [aiInsight, setAiInsight] = useState<AIInsight>({
        summary: "Aligning with the cosmos...",
        priority_order: [],
        action_guidance: { do: [], avoid: [] },
        alignment_practice: { morning: "", afternoon: "", evening: "" }
    });
    const [selectedTransit, setSelectedTransit] = useState<Planet | null>(null);
    const [timelineStory, setTimelineStory] = useState<string>("");

    useEffect(() => {
        if (currentProfile) {
            fetchData();
        }
    }, [currentProfile]);

    const getSignIndex = (signName: string) => ZODIAC_ORDER.indexOf(signName) + 1;

    const calculateHouseFromMoon = (planetSign: string, moonSign: string): number => {
        const pIdx = getSignIndex(planetSign);
        const mIdx = getSignIndex(moonSign);
        if (pIdx === 0 || mIdx === 0) return 1; // Fallback
        return ((pIdx - mIdx + 12) % 12) + 1;
    };

    const fetchData = async () => {
        if (!currentProfile) return;

        setLoading(true);
        setError(null);
        try {
            // 1. Prepare Payloads
            const natalPayload = {
                date: currentProfile.date,
                time: currentProfile.time,
                timezone: currentProfile.timezone,
                latitude: currentProfile.latitude,
                longitude: currentProfile.longitude,
                location: currentProfile.location
            };

            const now = new Date();
            const transitPayload = {
                date: now.toLocaleDateString("en-GB"), // DD/MM/YYYY
                time: now.toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' }),
                timezone: currentProfile.timezone,
                latitude: currentProfile.latitude,
                longitude: currentProfile.longitude,
                location_name: currentProfile.location
            };

            // 2. Fetch Natal & Transits (Parallel)
            const [natalRes, transitRes] = await Promise.all([
                api.post('chart/birth', natalPayload),
                api.post('chart/transits', transitPayload)
            ]);

            const natalPlanets = natalRes.data.planets;
            const rawTransitPlanets = transitRes.data.planets;

            // 3. Process Context (Moon Sign)
            const natalMoon = natalPlanets.find((p: any) => p.name === "Moon");
            const natalMoonSign = natalMoon?.sign || "Aries";
            const natalMoonLon = natalMoon?.longitude || 0;

            // 4. Enhance Transit Data (Calculate House from Moon)
            const enhancedPlanets = rawTransitPlanets.map((p: any) => ({
                ...p,
                house: calculateHouseFromMoon(p.sign, natalMoonSign)
            }));
            setTransitPlanets(enhancedPlanets);

            // 5. Update Moon Context State
            const currentMoon = enhancedPlanets.find((p: any) => p.name === "Moon");
            setMoonContext({
                sign: currentMoon?.sign || "Unknown",
                house: currentMoon?.house || 1
            });

            // 6. Fetch Dasha (Needs Moon Longitude)
            let currentDasha = null;
            try {
                const dashaRes = await api.post('chart/dasha', {
                    birth_details: natalPayload,
                    moon_longitude: natalMoonLon
                });
                const summary = dashaRes.data.summary;
                if (summary) {
                    currentDasha = {
                        maha: summary.current_mahadasha.lord,
                        antar: summary.current_antardasha.lord
                    };
                    setDashaInfo(currentDasha);
                }
            } catch (dashaErr) {
                console.warn("Dasha fetch failed:", dashaErr);
            }

            // 7. Fetch AI Insights
            const aiPayload = {
                chart_data: {
                    ascendant: { sign: natalRes.data.ascendant.sign },
                    moon_sign: natalMoonSign,
                    current_dasha: currentDasha ? `${currentDasha.maha}-${currentDasha.antar}` : "Unknown"
                },
                transits: enhancedPlanets.map((p: any) => ({
                    name: p.name,
                    sign: p.sign,
                    house: p.house,
                    is_retrograde: p.isRetrograde
                }))
            };

            try {
                const insightRes = await api.post('ai/transits/daily-insight', aiPayload);
                const data = insightRes.data.data;
                const status = insightRes.data.status;

                if ((status === "success" || status === "partial_success") && data && data.summary) {
                    setAiInsight({
                        summary: data.summary,
                        priority_order: data.priority_order || [],
                        action_guidance: data.action_guidance || { do: [], avoid: [] },
                        alignment_practice: data.alignment_practice || generateFallbackPractice()
                    });
                } else {
                    useFallbackInsight(enhancedPlanets);
                }
            } catch (aiError) {
                console.error("AI Insight Error:", aiError);
                useFallbackInsight(enhancedPlanets);
            }

            // 8. Fetch Timeline (Real)
            try {
                const timelineRes = await api.post('ai/transits/timeline', { current_date: now.toLocaleDateString("en-GB") });
                if (timelineRes.data.status === "success" || timelineRes.data.status === "partial_success") {
                    setTimelineStory(timelineRes.data.data.story);
                    setTimelineEvents(timelineRes.data.data.events || []);
                }
            } catch (err) {
                console.warn("Timeline fetch failed:", err);
            }

        } catch (err) {
            console.error("Error loading transits page:", err);
            setError("Failed to align with the stars. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // UI Helper
    const [timelineEvents, setTimelineEvents] = useState<any[]>([]);

    const useFallbackInsight = (planets: any[]) => {
        const moon = planets.find(p => p.name === "Moon");
        const moonSign = moon ? moon.sign : "the Sky";
        setAiInsight({
            summary: `The Moon shifts through ${moonSign}, highlighting emotional clarity. Trust your intuition today.`,
            priority_order: [
                { title: `Moon in ${moonSign}`, subtitle: "Emotional Focus", why: "Luna guides your inner state today.", action: "Reflect and journal.", score: 9 },
                { title: "Saturn Structure", subtitle: "Discipline", why: "Saturn asks for patience.", action: "Organize your tasks.", score: 8 }
            ],
            action_guidance: {
                do: ["Stay grounded", "Complete pending tasks"],
                avoid: ["Hasty decisions", "Unnecessary conflict"]
            },
            alignment_practice: generateFallbackPractice()
        });
    };

    const generateFallbackPractice = () => ({
        morning: "Take 5 deep breaths to center yourself.",
        afternoon: "Focus on one major task at a time.",
        evening: "Review your day with gratitude."
    });

    const handlePlanetClick = (planetName: string) => {
        const planet = transitPlanets.find(p => p.name === planetName);
        if (planet) {
            setSelectedTransit(planet);
        }
    };

    return (
        <MainLayout title="Cosmic Transits" breadcrumbs={['Forecasting', 'Transits']}>
            <div className="min-h-screen bg-[#030014] bg-gradient-to-b from-[#0B0122] via-[#050816] to-[#030014] relative font-sans -mx-4 -my-4 md:-mx-8 md:-my-8 px-4 md:px-8 py-8 overflow-hidden text-slate-100">

                {/* Mystical Background Elements (from Home) */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-indigo-500/5 blur-[120px] rounded-full animate-pulse-slow opacity-20" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-amber-600/5 blur-[120px] rounded-full animate-pulse-slow opacity-20" style={{ animationDelay: '3s' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.03)_0%,transparent_70%)]" />
                </div>

                {/* Star Field Background */}
                <div className="fixed inset-0 pointer-events-none z-[1]">
                    {Array.from({ length: 150 }, (_, i) => (
                        <div
                            key={i}
                            className="absolute w-0.5 h-0.5 bg-white rounded-full animate-twinkle opacity-20"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${3 + Math.random() * 4}s`
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 max-w-[1200px] mx-auto space-y-12 pb-20">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-4 mb-3">
                                <h1 className="text-4xl md:text-5xl font-serif text-white tracking-wide">Daily Transits 2.0</h1>
                                <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-widest border border-amber-500/30">
                                    LIVE FEED
                                </span>
                            </div>
                            <p className="text-slate-300 max-w-2xl text-base leading-relaxed">
                                Your personalized cosmic weather report. Navigate planetary currents with Moon-centric insights and AI-powered guidance.
                            </p>
                        </div>
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-4 text-red-200">
                            <AlertTriangle className="w-5 h-5" />
                            {error}
                        </div>
                    )}

                    {/* 1. Cosmic Weather Card */}
                    <CosmicWeatherCard
                        date={new Date()}
                        quote={aiInsight.summary}
                        moonSign={moonContext.sign}
                        moonHouse={moonContext.house}
                        dasha={dashaInfo}
                        loading={loading}
                        onAskAI={() => console.log("Open AI Chat")}
                    />

                    {/* 2. Major Transits (Slow Moving) */}
                    <MajorTransits
                        planets={transitPlanets}
                        loading={loading}
                        onPlanetClick={handlePlanetClick}
                    />

                    {/* 3. Fast Transits (Daily Movers) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-3">
                            <FastTransitsStrip
                                planets={transitPlanets}
                                loading={loading}
                                onPlanetClick={handlePlanetClick}
                            />
                        </div>
                    </div>

                    {/* 4. Cosmic Priorities & Guidance */}
                    <CosmicPriorities
                        priorities={aiInsight.priority_order}
                        guidance={aiInsight.action_guidance}
                        loading={loading}
                    />

                    {/* 5. Timeline & Alignment */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <TimelineStory
                            story={timelineStory}
                            events={timelineEvents.length > 0 ? timelineEvents : [
                                { date: "Upcoming", event: "Calculating planetary shifts...", impact: "Low" }
                            ]}
                            loading={loading}
                        />
                        <AlignmentPractice
                            practices={aiInsight.alignment_practice}
                            loading={loading}
                        />
                    </div>

                </div>

                {/* 6. Transit Inspector Modal */}
                {selectedTransit && (
                    <TransitInspector
                        transit={selectedTransit}
                        onClose={() => setSelectedTransit(null)}
                    />
                )}

            </div>
        </MainLayout>
    );
};

export default Transits;
