import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import api from '../services/api';
import TransitClimateCard from '../components/transits/TransitClimateCard';
import TransitPrioritySection from '../components/transits/TransitPrioritySection';
import TransitTimeline from '../components/transits/TransitTimeline';
import TransitInspector from '../components/transits/TransitInspector';
import { useChartSettings } from '../context/ChartContext';
import { AlertTriangle, Info } from 'lucide-react';

// --- Types ---
interface TransitData {
    planets: any[];
    location_details: any;
}

interface AIInsight {
    summary: string;
    priority_order: string[];
    action_guidance: {
        do: string[];
        avoid: string[];
    };
}

const Transits = () => {
    const { currentProfile } = useChartSettings();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Data States
    const [transitData, setTransitData] = useState<TransitData | null>(null);
    const [aiInsight, setAiInsight] = useState<AIInsight>({
        summary: "Aligning with the cosmos...",
        priority_order: [],
        action_guidance: { do: [], avoid: [] }
    });
    const [timelineStory, setTimelineStory] = useState<string>("");

    // UI States
    const [selectedTransit, setSelectedTransit] = useState<any | null>(null);

    useEffect(() => {
        if (currentProfile) {
            fetchData();
        }
    }, [currentProfile]);

    const fetchData = async () => {
        if (!currentProfile) return;

        setLoading(true);
        setError(null);
        try {
            // 1. Fetch Natal Chart (for Ascendant & Moon Sign Context)
            const natalPayload = {
                date: currentProfile.date,
                time: currentProfile.time,
                timezone: currentProfile.timezone,
                latitude: currentProfile.latitude,
                longitude: currentProfile.longitude,
                location: currentProfile.location
            };

            // 2. Fetch Deterministic Transits (Source of Truth)
            const now = new Date();
            const transitDate = now.toLocaleDateString("en-GB"); // DD/MM/YYYY
            const transitTime = now.toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' });

            // We use the profile's location for transit impact relative to user
            const transitPayload = {
                date: transitDate,
                time: transitTime,
                timezone: currentProfile.timezone,
                latitude: currentProfile.latitude,
                longitude: currentProfile.longitude,
                location_name: currentProfile.location
            };

            // Run requests in parallel
            const [natalRes, transitRes] = await Promise.all([
                api.post('chart/birth', natalPayload),
                api.post('chart/transits', transitPayload)
            ]);

            const planets = transitRes.data.planets;
            setTransitData(transitRes.data);

            // Extract User Context from Natal Chart
            const ascendantSign = natalRes.data.ascendant.sign;
            const moonSign = natalRes.data.planets.find((p: any) => p.name === "Moon")?.sign || "Unknown";

            // 3. Fetch AI Insights (Explanation Layer)
            const aiPayload = {
                chart_data: {
                    ascendant: ascendantSign,
                    moon_sign: moonSign,
                },
                transits: planets.map((p: any) => ({ name: p.name, sign: p.sign, house: p.house || "Unknown" }))
            };

            try {
                const insightRes = await api.post('ai/transits/daily-insight', aiPayload);
                // Enhanced handler: Accept partial success, or fall back if data looks empty
                const data = insightRes.data.data;
                const status = insightRes.data.status;

                if ((status === "success" || status === "partial_success") && data && data.summary) {
                    // Check if data is actually robust
                    if (data.priority_order && data.priority_order.length > 0) {
                        setAiInsight(data);
                    } else {
                        // Data exists but priorities are missing - fill gaps with fallback
                        const fallback = generateFallbackInsight(planets);
                        setAiInsight({
                            ...data,
                            priority_order: fallback.priority_order,
                            action_guidance: fallback.action_guidance
                        });
                    }
                } else {
                    console.warn("AI returned fail status/empty data, using full fallback");
                    setAiInsight(generateFallbackInsight(planets));
                }
            } catch (aiError) {
                console.warn("AI Service unavailable or throttled:", aiError);
                setAiInsight(generateFallbackInsight(planets));
            }

            // 4. Fetch Timeline Story
            // Mocking timeline events for now
            const mockEvents = [
                { date: "Feb 05", event: "Sun trine Jupiter", impact: "High" },
                { date: "Feb 12", event: "Mars enters Capricorn", impact: "Medium" }
            ];
            // We deliberately don't block on this one
            try {
                const timelineRes = await api.post('ai/transits/timeline', { timeline_events: mockEvents });
                if (timelineRes.data.status === "success" || timelineRes.data.status === "partial_success") {
                    setTimelineStory(timelineRes.data.data.story);
                }
            } catch (ignored) { /* Timeline failure is non-critical */ }

        } catch (err) {
            console.error("Error loading transits page:", err);
            setError("Failed to align with the stars. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // --- Helper: Local Fallback Generator ---
    // If AI fails, we generate a basic insight based on the Moon Sign (from transitData)
    const generateFallbackInsight = (planets: any[]): AIInsight => {
        const moon = planets.find(p => p.name === "Moon");
        const moonSign = moon ? moon.sign : "the Sky";

        return {
            summary: `The Moon is currently moving through ${moonSign}. This transit brings emotional focus to the qualities of ${moonSign}—ground yourself and observe your feelings.`,
            priority_order: [`Moon in ${moonSign}`, "Solar Vitality", "Daily Routine"],
            action_guidance: {
                do: ["Stick to routine", "Stay hydrated", "Reflect on goals"],
                avoid: ["Impulsive risks", "Overthinking", "Rushing"]
            }
        };
    };

    return (
        <MainLayout title="Cosmic Transits" breadcrumbs={['Forecasting', 'Transits']}>
            <div className="min-h-screen bg-[#030014] relative overflow-hidden font-sans -mx-4 -my-4 md:-mx-8 md:-my-8 px-4 md:px-8 py-8">

                {/* Background Stars */}
                <div className="absolute inset-0 z-0">
                    {[...Array(50)].map((_, i) => (
                        <div key={i} className="absolute bg-white rounded-full opacity-20"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                width: `${Math.random() * 2 + 1}px`,
                                height: `${Math.random() * 2 + 1}px`,
                                animation: `pulse ${Math.random() * 3 + 2}s infinite`
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 max-w-[1400px] mx-auto space-y-12">

                    {/* Header with Education */}
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl md:text-4xl font-serif text-white">Daily Transits</h1>
                                <div className="group relative">
                                    <Info className="w-5 h-5 text-slate-500 hover:text-indigo-400 cursor-pointer transition-colors" />
                                    <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-indigo-900/90 border border-white/10 rounded-lg text-xs text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                        Transits track where the planets are in the sky right now relative to your birth chart. They act as "Cosmic Weather"—influencing the general mood and opportunities of the day.
                                    </div>
                                </div>
                            </div>
                            <p className="text-slate-400 max-w-xl text-sm md:text-base leading-relaxed">
                                Understanding the current planetary movements helps you navigate your day with awareness rather than reacting blindly.
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

                    {/* 1. Climate Card (AI Core Summary) */}
                    <TransitClimateCard
                        insight={aiInsight}
                        loading={loading}
                    />

                    {/* 2. Priority & Guidance */}
                    <TransitPrioritySection
                        priorities={aiInsight.priority_order}
                        actions={aiInsight.action_guidance}
                        transits={transitData?.planets || []}
                        loading={loading}
                    />

                    {/* 3. Timeline */}
                    <TransitTimeline
                        story={timelineStory}
                        events={[
                            { date: "Feb 05", event: "Sun trine Jupiter", impact: "High" as any },
                            { date: "Feb 12", event: "Mars enters Capricorn", impact: "Medium" as any },
                            { date: "Feb 18", event: "Full Moon in Leo", impact: "High" as any }
                        ]}
                        loading={loading}
                    />

                    {/* 4. Data Inspector (AI Modal) */}
                    {selectedTransit && (
                        <TransitInspector
                            transit={selectedTransit}
                            onClose={() => setSelectedTransit(null)}
                        />
                    )}

                </div>
            </div>
        </MainLayout>
    );
};

export default Transits;
