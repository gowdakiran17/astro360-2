import { useCallback, useEffect, useMemo, useState, useRef, Suspense, lazy } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useChart } from '../context/ChartContext';
import StickyTodayHeader from '../components/guidance/today/StickyTodayHeader';
import QuickGlanceRail from '../components/guidance/today/QuickGlanceRail';
import TimelineTabs from '../components/guidance/today/TimelineTabs';
import GuidanceHeroCard from '../components/guidance/today/GuidanceHeroCard';

// Lazy load below-the-fold and heavy components for performance
const LifeGuidanceAccordion = lazy(() => import('../components/guidance/today/LifeGuidanceAccordion'));
const InteractionForecastSection = lazy(() => import('../components/guidance/today/InteractionForecastSection'));
const DecisionCompassCard = lazy(() => import('../components/guidance/today/DecisionCompassCard'));
const EnergyManagementCard = lazy(() => import('../components/guidance/today/EnergyManagementCard'));
const OneMistake = lazy(() => import('../components/guidance/today/OneMistake'));
const OnePowerAction = lazy(() => import('../components/guidance/today/OnePowerAction'));
const MoodTracker = lazy(() => import('../components/guidance/today/MoodTracker'));
const DailyRemedyCard = lazy(() => import('../components/guidance/today/DailyRemedy'));
const DailyChallengeCard = lazy(() => import('../components/guidance/today/DailyChallenge'));
const WhyTodayIsLikeThis = lazy(() => import('../components/guidance/today/WhyTodayIsLikeThis'));
const TomorrowSneakPeek = lazy(() => import('../components/guidance/today/TomorrowSneakPeek'));
const PremiumUpsell = lazy(() => import('../components/guidance/today/PremiumUpsell'));
// Existing widgets now being added to the page
const DailyTarotCard = lazy(() => import('../components/guidance/today/DailyTarotCard'));
const DailyAffirmationCard = lazy(() => import('../components/guidance/today/DailyAffirmation'));
const LuckyElementsCard = lazy(() => import('../components/guidance/today/LuckyElements'));
const ActivityRecommendations = lazy(() => import('../components/guidance/today/ActivityRecommendations'));
// New widgets
const MostImportantWidget = lazy(() => import('../components/guidance/today/MostImportantWidget'));
const PlanetaryCyclesWidget = lazy(() => import('../components/guidance/today/PlanetaryCyclesWidget'));
const TransitCalendarWidget = lazy(() => import('../components/guidance/today/TransitCalendarWidget'));
const HowToMakeTodayGreatWidget = lazy(() => import('../components/guidance/today/HowToMakeTodayGreatWidget'));

import { guidanceService } from '../services/guidance';
import { GuidancePayload } from '../types/guidance';
import { usePullToRefresh } from '../utils/guidance/usePullToRefresh';
import { useDailyStreak } from '../utils/guidance/useDailyStreak';
import { trackGuidanceEvent } from '../utils/guidance/metrics';
import { createGuidanceShareImage } from '../utils/guidance/shareCard';
import { selectRotation } from '../utils/guidance/rotation';
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

const TodaysGuidance = () => {
  const navigate = useNavigate();
  const { currentProfile } = useChart();
  const { streak } = useDailyStreak();
  const [payload, setPayload] = useState<GuidancePayload | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<'today' | 'tomorrow' | 'week'>('today');

  // Track previous timeline to detect changes
  const prevTimelineRef = useRef(timeline);

  // UI State
  const [activeMetricKey, setActiveMetricKey] = useState<any>(undefined);
  const [openArea, setOpenArea] = useState<any>(undefined);
  const [isSaved, setIsSaved] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Simple skeleton for loading widgets
  const WidgetSkeleton = ({ height = "h-48" }: { height?: string }) => (
    <div className={`w-full ${height} bg-white/5 rounded-3xl animate-pulse border border-white/5`} />
  );

  const load = useCallback(async (forceRefresh: boolean) => {
    if (!currentProfile) return;

    // Create a local reference to the profile ID we are loading for
    const loadingProfileId = profileFingerprint(currentProfile);

    setIsLoading(true);
    setIsOffline(false);
    setError(null);

    // Calculate target date based on timeline
    const targetDate = new Date();
    if (timeline === 'tomorrow') {
      targetDate.setDate(targetDate.getDate() + 1);
    }
    // Note: 'week' view currently falls back to today as we await weekly endpoint

    try {
      const res = await guidanceService.loadDaily(currentProfile, { forceRefresh, date: targetDate });

      // Race Condition Check: Ensure we are still looking at the same profile
      if (profileFingerprint(currentProfile) === loadingProfileId) {
        setPayload(res.payload);
      }
    } catch (e) {
      console.error("Failed to load guidance:", e);
      // Only attempt cache fallback if we're still on the same profile
      if (profileFingerprint(currentProfile) === loadingProfileId) {
        try {
          const cached = await guidanceService.loadDaily(currentProfile, { forceRefresh: false, date: targetDate });
          setPayload(cached.payload);
          setIsOffline(true);
        } catch {
          setError("Unable to load guidance. Please check your connection.");
        }
      }
    } finally {
      // Only turn off loading if we're still on the same profile
      if (profileFingerprint(currentProfile) === loadingProfileId) {
        setIsLoading(false);
      }
    }
  }, [currentProfile, timeline]);

  useEffect(() => {
    if (currentProfile) {
      // Check if timeline actually changed (not just initial mount)
      const timelineChanged = prevTimelineRef.current !== timeline;
      prevTimelineRef.current = timeline;

      if (timelineChanged) {
        // Clear payload to show loading state when switching tabs
        setPayload(null);
        // Force refresh when timeline changes to get fresh data for new date
        void load(true);
      } else {
        // Initial load or profile change - use cache if available
        void load(false);
      }
    }
  }, [load, currentProfile, timeline]);


  const onRefresh = useCallback(async () => {
    trackGuidanceEvent('pull_to_refresh');
    await load(true);
  }, [load]);

  const { state: pull, bind } = usePullToRefresh(onRefresh);

  const header = useMemo(() => {
    if (!payload) return null;
    return (
      <StickyTodayHeader
        greeting={payload.header.greeting}
        profileName={payload.sourceMeta.profileName}
        weekdayLabel={payload.header.weekdayLabel}
        dateLabel={payload.header.dateLabel}
        vedicLine={payload.header.vedicLine}
        moonPhaseName={payload.header.moonPhase.name}
        moonIllumination={payload.header.moonPhase.illumination}
        streak={streak}
        pull={pull}
      />
    );
  }, [payload, pull, streak]);

  // Metric tap handler
  useEffect(() => {
    if (!payload || !activeMetricKey) return;
    trackGuidanceEvent('quick_metric_tap', { key: activeMetricKey });
    const isArea = payload.lifeGuidance.some((r) => r.area === activeMetricKey);
    if (isArea) {
      setOpenArea(activeMetricKey);
      document.getElementById('life-guidance')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Scroll to specific section based on key
      const sectionMap: Record<string, string> = {
        'MOOD': 'emotional-weather',
        'ENERGY': 'energy-flow',
        'LOVE': 'interaction-forecast'
      };
      const id = sectionMap[activeMetricKey];
      if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeMetricKey, payload]);

  const onSave = useCallback(() => {
    if (!payload) return;
    setIsSaved(!isSaved); // Simple toggle for UI
    trackGuidanceEvent('save', { dateKey: payload.dateKey, saved: !isSaved });
  }, [payload, isSaved]);

  const onShare = useCallback(async () => {
    if (!payload) return;
    setIsSharing(true);
    try {
      const { blob, fileName } = await createGuidanceShareImage(payload as any); // Type assertion for compat
      const file = new File([blob], fileName, { type: 'image/png' });
      if (navigator.share) {
        await navigator.share({
          title: 'Today’s Guidance',
          text: `${payload.header.weekdayLabel} — ${payload.hero.primaryFocus}`,
          files: [file]
        });
      }
    } catch (e) { console.error(e); }
    finally { setIsSharing(false); }
  }, [payload]);

  // Compute rotation
  const rotationTypes = useMemo(() => {
    if (!payload || !currentProfile) return [];
    const profileKey = profileFingerprint(currentProfile);
    const rotationKey = `guidance_rotation:${profileKey}:${payload.dateKey}`;
    return selectRotation({
      rotationKey,
      seed: `${profileKey}:${payload.dateKey}`,
      lastExpandedArea: openArea
    });
  }, [currentProfile, payload, openArea]);

  const showAll = false; // Set to true to debug/show all sections

  // Loading / Error / Empty States
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
      <div {...bind} className="min-h-screen relative overflow-hidden">

        {/* Premium animated gradient background */}
        <div className="fixed inset-0 bg-[#0B0F1A] pointer-events-none" />
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 pb-20">
          {/* Mobile: Full Width Sticky Header */}
          <div className="md:hidden">
            {header}
          </div>

          {/* Responsive Mission Control Layout */}
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-6 md:pt-10">

            <div className="space-y-6">
              {/* Global Timeline Filter */}
              <div className="flex justify-center pb-2">
                <div className="w-full max-w-md">
                  <TimelineTabs selected={timeline} onSelect={setTimeline} />
                </div>
              </div>

              {isOffline && (
                <div className="mx-auto max-w-md rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-center text-xs font-bold text-amber-200 uppercase tracking-wide">
                  ⚠️ Offline Mode • Showing cached guidance
                </div>
              )}

              {error && !payload ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Connection Error</h3>
                  <p className="text-red-200/80 mb-8 max-w-xs text-sm leading-relaxed">{error}</p>
                  <button
                    onClick={() => load(true)}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95"
                  >
                    <RefreshCw className="w-4 h-4" /> Retry Connection
                  </button>
                </div>
              ) : !payload || isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-6">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl">✨</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold text-lg mb-1">Aligning Stars...</p>
                    <p className="text-white/40 text-sm">Calculating planetary positions</p>
                  </div>
                </div>
              ) : (
                // MISSION CONTROL GRID SYSTEM
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">

                  {/* === LEFT SIDEBAR: CONTEXT & NAVIGATION === */}
                  {/* Desktop: Col 1-3 | Tablet: Col 1-4 */}
                  <aside className="hidden md:block md:col-span-4 lg:col-span-3 sticky top-28 space-y-8">

                    {/* Date & Context Card */}
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl shadow-2xl shadow-black/20">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-2 h-8 bg-indigo-500 rounded-full" />
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Today</div>
                          <h1 className="text-2xl font-black text-white">{payload.header.weekdayLabel}</h1>
                        </div>
                      </div>

                      <div className="text-white/70 font-medium mb-8 text-sm border-b border-white/10 pb-6">
                        {payload.header.dateLabel}
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-2xl bg-black/20 border border-white/5 flex flex-col items-center text-center">
                          <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-1">Streak</span>
                          <span className="text-amber-400 font-black text-xl">🔥 {streak}</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-black/20 border border-white/5 flex flex-col items-center text-center">
                          <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-1">Moon</span>
                          <span className="text-purple-300 font-bold text-sm leading-tight mt-1">{payload.header.moonPhase.name}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Pulse */}
                    <div>
                      <div className="flex items-center justify-between px-1 mb-3">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Daily Pulse</div>
                      </div>
                      <QuickGlanceRail metrics={payload.quickMetrics} activeKey={activeMetricKey} onSelect={setActiveMetricKey} mode="grid" />
                    </div>
                  </aside>

                  {/* === CENTER STAGE: FEED === */}
                  {/* Desktop: Col 4-9 | Tablet: Col 5-12 */}
                  <main className="col-span-1 md:col-span-8 lg:col-span-6 space-y-8 min-w-0">

                    {/* Mobile Quick Glance (Visible only on mobile) */}
                    <div className="md:hidden">
                      <div className="flex items-center justify-between px-1 mb-3">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Daily Pulse</div>
                      </div>
                      <QuickGlanceRail metrics={payload.quickMetrics} activeKey={activeMetricKey} onSelect={setActiveMetricKey} mode="grid" />
                    </div>

                    {/* Hero Section */}
                    <section aria-label="Daily Focus">
                      <GuidanceHeroCard hero={payload.hero} onSave={onSave} onShare={onShare} isSaved={isSaved} isSharing={isSharing} />
                    </section>



                    {/* Life Guidance Deep Dive */}
                    <section id="life-guidance" aria-label="Detailed Guidance">
                      <Suspense fallback={<WidgetSkeleton height="h-96" />}>
                        <LifeGuidanceAccordion rows={payload.lifeGuidance} openArea={openArea} onOpenAreaChange={setOpenArea} />
                      </Suspense>
                    </section>

                    {/* Actionable Insights Grid */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Suspense fallback={<WidgetSkeleton />}>
                        <OneMistake mistake={payload.oneMistake} />
                      </Suspense>
                      {(showAll || rotationTypes.includes('ONE_POWERFUL_ACTION')) && (
                        <Suspense fallback={<WidgetSkeleton />}>
                          <OnePowerAction action={payload.onePowerAction} />
                        </Suspense>
                      )}
                    </section>

                    {/* Interaction Forecast & Decision Compass Group */}
                    <div className="space-y-4">
                      {/* Interaction Forecast */}
                      <section id="interaction-forecast" aria-label="Social Interactions">
                        <Suspense fallback={<WidgetSkeleton height="h-64" />}>
                          <InteractionForecastSection interactions={payload.interactionForecast} />
                        </Suspense>
                      </section>

                      {/* Decision Compass */}
                      <section>
                        <Suspense fallback={<WidgetSkeleton />}>
                          <DecisionCompassCard compass={payload.decisionCompass} />
                        </Suspense>
                      </section>
                    </div>
                  </main>

                  {/* === RIGHT SIDEBAR: TOOLS & WIDGETS === */}
                  {/* Desktop: Col 10-12 | Tablet: Moves to bottom or handled by reflow */}
                  <aside className="col-span-1 md:col-span-12 lg:col-span-3 space-y-6 lg:sticky lg:top-28">

                    {/* Most Important - NEW */}
                    <Suspense fallback={<WidgetSkeleton />}>
                      <MostImportantWidget
                        focus={payload.hero?.primaryFocus || "Focus on meaningful connections"}
                        priority={payload.lifeGuidance?.[0]?.label || "Relationships"}
                      />
                    </Suspense>

                    {/* Energy Flow */}
                    <div id="energy-flow">
                      <Suspense fallback={<WidgetSkeleton />}>
                        <EnergyManagementCard energyFlow={payload.energyFlow} />
                      </Suspense>
                    </div>

                    {/* Lucky Elements - Existing but now added */}
                    {payload.luckyElements && (
                      <Suspense fallback={<WidgetSkeleton />}>
                        <LuckyElementsCard lucky={payload.luckyElements} />
                      </Suspense>
                    )}

                    {/* Daily Tarot - Existing but now added */}
                    {payload.tarot && (
                      <Suspense fallback={<WidgetSkeleton height="h-96" />}>
                        <DailyTarotCard tarot={payload.tarot} />
                      </Suspense>
                    )}

                    {/* Planetary Cycles - NEW */}
                    <Suspense fallback={<WidgetSkeleton />}>
                      <PlanetaryCyclesWidget />
                    </Suspense>

                    {/* Transit Calendar - NEW */}
                    <Suspense fallback={<WidgetSkeleton />}>
                      <TransitCalendarWidget transits={payload.transits} />
                    </Suspense>

                    {/* Daily Affirmation - Existing but now added */}
                    {payload.affirmation && (
                      <Suspense fallback={<WidgetSkeleton />}>
                        <DailyAffirmationCard affirmation={payload.affirmation} />
                      </Suspense>
                    )}

                    {/* Activity Recommendations - Existing but now added */}
                    {payload.activities && payload.activities.length > 0 && (
                      <Suspense fallback={<WidgetSkeleton />}>
                        <ActivityRecommendations activities={payload.activities} />
                      </Suspense>
                    )}

                    {/* Mood Tracker */}
                    <Suspense fallback={<WidgetSkeleton />}>
                      <MoodTracker moodHistory={payload.userStats?.moodHistory || []} />
                    </Suspense>

                    {/* Daily Challenge */}
                    {payload.challenge && (
                      <Suspense fallback={<WidgetSkeleton />}>
                        <DailyChallengeCard challenge={payload.challenge} streak={payload.userStats?.streakDays || 0} />
                      </Suspense>
                    )}

                    {/* How to Make Today Great - NEW */}
                    <Suspense fallback={<WidgetSkeleton />}>
                      <HowToMakeTodayGreatWidget />
                    </Suspense>

                    {/* Why Today Is Like This */}
                    <Suspense fallback={<WidgetSkeleton height="h-64" />}>
                      <WhyTodayIsLikeThis
                        dasha={payload.dasha}
                        transits={payload.transits}
                        nakshatra={payload.nakshatra}
                      />
                    </Suspense>

                    {/* Daily Remedy */}
                    {payload.remedy && (
                      <Suspense fallback={<WidgetSkeleton />}>
                        <DailyRemedyCard remedy={payload.remedy} />
                      </Suspense>
                    )}

                    {/* Tomorrow Preview */}
                    {payload.tomorrowPreview && (
                      <Suspense fallback={<WidgetSkeleton />}>
                        <TomorrowSneakPeek preview={payload.tomorrowPreview} />
                      </Suspense>
                    )}

                    <Suspense fallback={<WidgetSkeleton height="h-24" />}>
                      <PremiumUpsell />
                    </Suspense>
                  </aside>

                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TodaysGuidance;
