import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { useChartSettings } from '../../../context/ChartContext';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../LoadingSpinner';
import QuickReferenceData from './QuickReferenceData';
import NakshatraIntelligenceCenter from './NakshatraIntelligenceCenter';
import PlanetaryStatus from './PlanetaryStatus';
import CosmicConsultation from './CosmicConsultation';
import DailyHoroscopes from './DailyHoroscopes';
// PersonalizedRemedies moved to dedicated hub
import {
  Sun, ArrowRight, RefreshCw, Star, Sparkles
} from 'lucide-react';
import CosmicHero from './CosmicHero';
import HomeHeader from './HomeHeader';



const ProAstrologerHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentProfile, switchProfile } = useChartSettings();
  const { user, isLoading: authLoading } = useAuth();

  const [chartData, setChartData] = useState<any>(null);
  const [panchangData, setPanchangData] = useState<any>(null);
  const [dashaData, setDashaData] = useState<any>(null);
  const [periodOverview, setPeriodOverview] = useState<any>(null);
  const [aiPredictions, setAiPredictions] = useState<any>(null);
  const [dailyHoroscopeData, setDailyHoroscopeData] = useState<any>(null);
  const [selectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);


  const fetchData = useCallback(async (currentProfile: any, targetDate: Date) => {
    if (!currentProfile) return;

    setIsLoading(true);

    const formatDate = (dateStr: string) => {
      if (dateStr.includes('-')) {
        const [y, m, d] = dateStr.split('-');
        return `${d}/${m}/${y}`;
      }
      return dateStr;
    };

    const birthDetails = {
      date: formatDate(currentProfile.date),
      time: currentProfile.time,
      latitude: currentProfile.latitude,
      longitude: currentProfile.longitude,
      timezone: currentProfile.timezone
    };

    try {


      const panchangPayload = {
        ...birthDetails,
        date: birthDetails.date,
        time: birthDetails.time
      };

      const [panchangRes, chartRes, overviewRes] = await Promise.allSettled([
        api.post('chart/panchang', panchangPayload),
        api.post('chart/birth', birthDetails),
        api.post('chart/period/overview', {
          birth_details: birthDetails,
          analysis_date: targetDate.toISOString().split('T')[0]
        })
      ]);

      if (panchangRes.status === 'fulfilled') setPanchangData(panchangRes.value.data);
      if (overviewRes.status === 'fulfilled') setPeriodOverview(overviewRes.value.data);

      if (chartRes.status === 'fulfilled') {
        const chart = chartRes.value.data;
        setChartData(chart);

        let fetchedDashaData = null;
        const moon = chart?.planets?.find((p: any) => p.name === 'Moon');
        if (moon) {
          try {
            const dashaRes = await api.post('chart/dasha', {
              birth_details: birthDetails,
              moon_longitude: moon.longitude
            });
            if (dashaRes.data?.dashas) {
              fetchedDashaData = dashaRes.data;
              setDashaData(fetchedDashaData);
            }
          } catch (e) { console.error("Dasha Error:", e); }
        }

        try {
          const [aiRes, horoscopeRes] = await Promise.all([
            api.post('ai/quick-predictions', {
              chart_data: chart,
              dasha_data: fetchedDashaData
            }),
            api.post('ai/daily-horoscopes', {
              chart_data: {
                name: currentProfile?.name,
                date: birthDetails.date,
                time: birthDetails.time,
                location: currentProfile?.location,
                timezone: currentProfile?.timezone,
                latitude: currentProfile?.latitude,
                longitude: currentProfile?.longitude
              },
              dasha_data: fetchedDashaData,
              current_date: targetDate.toISOString()
            })
          ]);

          if (aiRes.data?.status === 'success') setAiPredictions(aiRes.data.data);
          if (horoscopeRes.data?.status === 'success') setDailyHoroscopeData(horoscopeRes.data.data);
        } catch (e) {
          console.error("AI/Horoscope Error:", e);
        }
      }
    } catch (e: any) {
      console.error("Fetch Data Error:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location.state?.chartData) {
      switchProfile(location.state.chartData);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, switchProfile, navigate, location.pathname]);

  useEffect(() => {
    if (!currentProfile || !user) return;
    fetchData(currentProfile, selectedDate);
  }, [user, currentProfile, selectedDate, fetchData]);



  /* 
  const getDashaInterpretation = (maha: string, _antar?: string | null) => {
    ...
  };
  */
  if (authLoading) return <LoadingSpinner />;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 flex items-center justify-center p-4">
        <div className="relative max-w-lg w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-3xl blur-xl" />
          <div className="relative bg-slate-900/90 backdrop-blur-xl p-10 rounded-3xl border border-white/10 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Sun className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Astro360</h2>
              <p className="text-lg text-amber-200/80">Professional Vedic Astrology Predictions</p>
              <p className="text-slate-400 mt-2">Unlock detailed insights into your destiny based on ancient Vedic wisdom</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-lg hover:from-amber-400 hover:to-orange-500 transition-all shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2"
            >
              Begin Your Journey
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentProfile || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-amber-500/20" />
            <div className="absolute inset-0 rounded-full border-4 border-t-amber-500 animate-spin" />
            <Sun className="absolute inset-0 m-auto w-10 h-10 text-amber-400" />
          </div>
          <p className="text-slate-300 text-lg">Consulting the cosmic forces...</p>
          <p className="text-slate-500 text-sm mt-2">Preparing your personalized predictions</p>
        </div>
      </div>
    );
  }

  // const currentDasha = getCurrentDasha();

  return (
    <div className="min-h-screen w-full bg-[#030014] bg-gradient-to-b from-[#0B0122] via-[#050816] to-[#030014] text-slate-100 relative overflow-hidden font-sans">
      {/* Mystical Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-indigo-500/5 blur-[120px] rounded-full animate-pulse-slow opacity-20" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-600/5 blur-[120px] rounded-full animate-pulse-slow opacity-20" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.03)_0%,transparent_70%)]" />

        {/* Decorative Celestial Patterns */}
        <div className="absolute top-1/4 right-[5%] opacity-[0.03] rotate-12 scale-150">
          <Star className="w-96 h-96 text-yellow-500" />
        </div>
        <div className="absolute bottom-1/4 left-[10%] opacity-[0.02] -rotate-12 scale-125">
          <Sparkles className="w-[30rem] h-[30rem] text-orange-500" />
        </div>
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

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-16 py-12 md:py-24 space-y-20 md:space-y-40">

        {/* Premium Header & Hero */}
        <div className="space-y-8 md:space-y-16">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black tracking-[0.4em] text-yellow-400 uppercase mb-2 md:mb-4 opacity-80 pl-1">Unified Celestial Intelligence</span>
            <HomeHeader userName={currentProfile?.name || 'Cosmic Soul'} location={currentProfile?.location} showActions={true} />
          </div>
          <CosmicHero
            chartData={chartData}
            panchangData={periodOverview?.daily_analysis?.panchang}
            dailyHoroscopeData={dailyHoroscopeData}
          />
        </div>

        {/* Daily Horoscopes Section */}
        {chartData && (
          <section className="space-y-8 md:space-y-12">
            <div className="flex items-center gap-6 px-2">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
              <h2 className="text-[10px] font-black text-amber-400/90 uppercase tracking-[0.5em] text-center whitespace-nowrap">Daily Cosmic Insights</h2>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
            </div>
            <div className="px-1">
              <DailyHoroscopes
                chartData={{
                  name: currentProfile?.name,
                  date: currentProfile?.date,
                  time: currentProfile?.time,
                  location: currentProfile?.location,
                  timezone: currentProfile?.timezone,
                  latitude: currentProfile?.latitude,
                  longitude: currentProfile?.longitude
                }}
                dashaData={dashaData}
                dailyHoroscopeData={dailyHoroscopeData}
                onRefresh={() => fetchData(currentProfile, selectedDate)}
              />
            </div>
          </section>
        )}

        {/* 3. Main Dashboard Grid */}
        <div className="space-y-12 md:space-y-20">
          {/* Refresh Data Toggle */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/[0.04] border border-white/[0.05] p-6 md:p-8 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_15px_rgba(251,191,36,0.8)] animate-pulse" />
              <p className="text-[10px] font-black text-slate-100 uppercase tracking-[0.2em]">System Status: <span className="text-yellow-400">Synchronized</span></p>
            </div>
            <button
              onClick={() => fetchData(currentProfile, selectedDate)}
              className="group/refresh w-full md:w-auto flex items-center justify-center gap-4 px-10 py-5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black rounded-2xl border border-white/20 text-[10px] font-black transition-all duration-500 uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(251,191,36,0.3)] active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 transition-transform duration-700 ${isLoading ? 'animate-spin' : 'group-hover/refresh:rotate-180'}`} />
              <span>Calibrate Astral Feed</span>
            </button>
          </div>

          {!chartData && !isLoading && (
            <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] border border-white/[0.05] p-20 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] to-transparent" />
              <Sun className="w-20 h-20 text-indigo-400/30 mx-auto mb-8 animate-pulse" />
              <p className="text-2xl font-black text-white uppercase tracking-tight mb-4">Astral Connection Lost</p>
              <p className="text-slate-200 font-bold mb-10 max-w-md mx-auto">The celestial currents are unreachable. Re-sync your resonance to restore the feed.</p>
              <button
                onClick={() => fetchData(currentProfile, selectedDate)}
                className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-[2rem] text-sm font-black text-white transition-all shadow-2xl shadow-indigo-500/20 uppercase tracking-widest"
              >
                Reconnect to Universe
              </button>
            </div>
          )}

          {chartData && (
            <div className="grid grid-cols-1 gap-16 md:gap-32">
              <section className="space-y-8 md:space-y-12">
                <div className="flex items-center gap-6 px-2">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
                  <h2 className="text-[10px] font-black text-yellow-400/90 uppercase tracking-[0.5em] text-center whitespace-nowrap">Planetary Resonance</h2>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
                </div>
                <div className="px-1">
                  <PlanetaryStatus chartData={chartData} />
                </div>
              </section>

              <section className="space-y-8 md:space-y-12">
                <div className="flex items-center gap-6 px-2">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
                  <h2 className="text-[10px] font-black text-yellow-400/90 uppercase tracking-[0.5em] text-center whitespace-nowrap">Structural Analysis</h2>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
                </div>
                <div className="px-1">
                  <QuickReferenceData
                    chartData={chartData}
                    panchangData={{
                      ...(panchangData || chartData.panchang || {}),
                      place: currentProfile?.location
                    }}
                  />
                </div>
              </section>

              <section className="space-y-8 md:space-y-12">
                <div className="flex items-center gap-6 px-2">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
                  <h2 className="text-[10px] font-black text-yellow-400/90 uppercase tracking-[0.5em] text-center whitespace-nowrap">Nakshatra Intelligence</h2>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
                </div>
                <div className="px-1">
                  <NakshatraIntelligenceCenter chartData={chartData} />
                </div>
              </section>

              <section className="space-y-8 md:space-y-12">
                <div className="flex items-center gap-6 px-2">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
                  <h2 className="text-[10px] font-black text-yellow-400/90 uppercase tracking-[0.5em] text-center whitespace-nowrap">Unified Consultation</h2>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
                </div>
                <div className="px-1">
                  <CosmicConsultation
                    chartData={chartData}
                    dashaData={dashaData}
                    periodOverview={periodOverview}
                    aiPredictions={aiPredictions}
                  />
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProAstrologerHome;
