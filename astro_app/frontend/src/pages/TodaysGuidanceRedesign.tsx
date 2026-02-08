import { useCallback, useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '../components/layout/MainLayout';
import { useChart } from '../context/ChartContext';
import TimelineTabs from '../components/guidance/today/TimelineTabs';

// New Redesigned Components
import ScoreCircleHero from '../components/guidance/redesign/ScoreCircleHero';
import LifeAreasRail from '../components/guidance/redesign/LifeAreasRail';
import TodaysFocusCard from '../components/guidance/redesign/TodaysFocusCard';
import CosmicContextAccordion from '../components/guidance/redesign/CosmicContextAccordion';
import DailyExtrasTabs from '../components/guidance/redesign/DailyExtrasTabs';

import { guidanceService } from '../services/guidance';
import { GuidancePayload } from '../types/guidance';
import { useDailyStreak } from '../utils/guidance/useDailyStreak';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const profileFingerprint = (profile: any) => {
    const rawId = profile?.raw?.id ?? '';
    const date = profile?.date ?? '';
    const time = profile?.time ?? '';
    const timezone = profile?.timezone ?? '';
    const latitude = profile?.latitude ?? '';
    const longitude = profile?.longitude ?? '';
    const location = profile?.location ?? '';
    const name = profile?.name ?? '';
    return [rawId, date, time, timezone, latitude, longitude, location, name].join('|');
};

const TodaysGuidanceRedesign = () => {
    const navigate = useNavigate();
    const { currentProfile } = useChart();
    const { streak } = useDailyStreak();
    const [payload, setPayload] = useState<GuidancePayload | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [timeline, setTimeline] = useState<'today' | 'tomorrow' | 'week'>('today');
    const prevTimelineRef = useRef(timeline);
    const [activeArea, setActiveArea] = useState<string | undefined>(undefined);

    const load = useCallback(async (forceRefresh: boolean) => {
        if (!currentProfile) return;
        const loadingProfileId = profileFingerprint(currentProfile);

        setIsLoading(true);
        setError(null);

        const targetDate = new Date();
        if (timeline === 'tomorrow') {
            targetDate.setDate(targetDate.getDate() + 1);
        }

        try {
            const res = await guidanceService.loadDaily(currentProfile, { forceRefresh, date: targetDate });
            if (profileFingerprint(currentProfile) === loadingProfileId) {
                setPayload(res.payload);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load guidance');
        } finally {
            setIsLoading(false);
        }
    }, [currentProfile, timeline]);

    useEffect(() => {
        load(false);
    }, [load]);

    useEffect(() => {
        if (prevTimelineRef.current !== timeline) {
            prevTimelineRef.current = timeline;
            load(true);
        }
    }, [timeline, load]);

    // Transform payload data for components
    const getOverallScore = () => {
        if (!payload?.quickMetrics) return 65;
        const scores = payload.quickMetrics.map((m: any) => m.score || 0);
        return Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length);
    };

    const getLifeAreas = () => {
        if (!payload?.quickMetrics) return [];
        return payload.quickMetrics.map((m: any) => ({
            key: m.key,
            label: m.label,
            score: m.score || 50,
            icon: m.icon || 'default',
        }));
    };

    const getFocusData = () => ({
        primaryFocus: payload?.hero?.themeHeadline || payload?.hero?.primaryFocus || 'Focus on what matters most today',
        actions: payload?.hero?.paragraphs?.slice(0, 3) || [],
        avoid: payload?.hero?.avoidLine || (typeof payload?.oneMistake === 'string' ? payload?.oneMistake : undefined),
        insight: payload?.hero?.cosmicReason,
    });

    const getCosmicData = () => ({
        dasha: payload?.dasha ? {
            period: `${payload.dasha.mahaDasha?.planet || 'Maha'} - ${payload.dasha.antarDasha?.planet || 'Antar'}`,
            theme: payload.dasha.theme || 'Current planetary period influence',
        } : undefined,
        transit: payload?.transits?.[0] ? {
            planet: payload.transits[0].planet,
            event: payload.transits[0].event,
            effect: payload.transits[0].description,
        } : undefined,
        moon: payload?.nakshatra ? {
            phase: payload.header?.moonPhase?.name || 'Waxing',
            nakshatra: payload.nakshatra.name || 'Nakshatra',
        } : undefined,
    });

    const getExtrasData = () => ({
        tarot: payload?.tarot ? {
            cardName: payload.tarot.cardName,
            meaning: payload.tarot.meaning,
            interpretation: payload.tarot.interpretation,
        } : undefined,
        lucky: payload?.luckyElements ? {
            color: payload.luckyElements.color,
            colorHex: payload.luckyElements.colorHex,
            number: payload.luckyElements.number,
            direction: payload.luckyElements.direction,
            timeRange: payload.luckyElements.timeRange,
        } : undefined,
        remedy: payload?.remedy ? {
            title: payload.remedy.type,
            description: payload.remedy.description,
            type: payload.remedy.type || 'Remedy',
        } : undefined,
    });

    // No profile state
    if (!currentProfile) {
        return (
            <MainLayout title="Today's Guidance" breadcrumbs={['Home', 'Daily Guidance']} showHeader={true}>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-white/40" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">No Profile Selected</h2>
                    <p className="text-white/60 mb-6">Please select or create a profile to view daily guidance.</p>
                    <button
                        onClick={() => navigate('/profiles')}
                        className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-medium transition-colors"
                    >
                        Select Profile
                    </button>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout title="Today's Guidance" breadcrumbs={['Home', 'Daily Guidance']} showHeader={true} disableContentPadding={true}>
            <div className="min-h-screen bg-gradient-to-b from-[#0B0F1A] via-[#0d1224] to-[#0B0F1A]">

                {/* Timeline Tabs - Top */}
                <div className="sticky top-0 z-30 bg-[#0B0F1A]/90 backdrop-blur-xl border-b border-white/5 py-3 px-4">
                    <div className="max-w-md mx-auto">
                        <TimelineTabs selected={timeline} onSelect={setTimeline} />
                    </div>
                </div>

                {/* Main Content */}
                {error && !payload ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
                            <AlertCircle className="w-8 h-8 text-red-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Connection Error</h3>
                        <p className="text-red-200/80 mb-8 max-w-xs text-sm">{error}</p>
                        <button
                            onClick={() => load(true)}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-all"
                        >
                            <RefreshCw className="w-4 h-4" /> Retry
                        </button>
                    </div>
                ) : !payload || isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-6">
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl">✨</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-white font-bold text-lg mb-1">Reading the Stars...</p>
                            <p className="text-white/40 text-sm">Calculating your cosmic guidance</p>
                        </div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="pb-20"
                    >
                        {/* Section 1: Score Circle Hero */}
                        <ScoreCircleHero
                            score={getOverallScore()}
                            theme={payload.hero?.themeHeadline || "A balanced day awaits you"}
                            dateLabel={payload.header?.dateLabel || new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            vedicLabel={payload.header?.vedicLine}
                            moonPhase={payload.header?.moonPhase?.name}
                        />

                        {/* Section 2: Life Areas Rail */}
                        <LifeAreasRail
                            areas={getLifeAreas()}
                            activeKey={activeArea}
                            onSelect={setActiveArea}
                        />

                        {/* Section 3: Today's Focus */}
                        <TodaysFocusCard {...getFocusData()} />

                        {/* Section 4: Cosmic Context */}
                        <CosmicContextAccordion cosmic={getCosmicData()} />

                        {/* Section 5: Daily Extras */}
                        <DailyExtrasTabs {...getExtrasData()} />

                        {/* Streak Badge */}
                        {streak > 0 && (
                            <div className="flex justify-center py-6">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
                                    <span className="text-lg">🔥</span>
                                    <span className="text-sm font-bold text-amber-400">{streak} Day Streak</span>
                                </div>
                            </div>
                        )}

                        {/* Pull to Refresh hint */}
                        <div className="flex justify-center pb-8">
                            <button
                                onClick={() => load(true)}
                                className="flex items-center gap-2 text-xs text-white/30 hover:text-white/50 transition-colors"
                            >
                                <RefreshCw className="w-3 h-3" />
                                <span>Tap to refresh</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </MainLayout>
    );
};

export default TodaysGuidanceRedesign;
