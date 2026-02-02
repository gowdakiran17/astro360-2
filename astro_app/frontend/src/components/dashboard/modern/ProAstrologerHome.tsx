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
// PersonalizedRemedies moved to dedicated hub
import {
  Sun, ArrowRight, RefreshCw
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
          const aiRes = await api.post('ai/quick-predictions', {
            chart_data: chart,
            dasha_data: fetchedDashaData
          });
          if (aiRes.data?.status === 'success') setAiPredictions(aiRes.data.data);
        } catch (e) { console.error("AI Predictions Error:", e); }
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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">

        {/* Premium Header & Hero */}
        <div className="flex flex-col gap-6">
          <HomeHeader userName={currentProfile?.name || 'Cosmic Soul'} location={currentProfile?.location} />
          <CosmicHero chartData={chartData} panchangData={periodOverview?.daily_analysis?.panchang} />
        </div>

        {/* Remedies section moved to dedicated hub /dashboard/remedies */}

        {/* 3. Main Dashboard Grid */}
        {/* Refresh Data Toggle */}
        <div className="flex justify-end -mt-2">
          <button
            onClick={() => fetchData(currentProfile, selectedDate)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900/60 backdrop-blur-md rounded-xl border border-white/10 text-xs font-bold text-slate-300 hover:bg-slate-800/80 transition-all shadow-xl"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Cosmic Data
          </button>
        </div>

        {/* Birth Chart Overview Card */}
        {!chartData && !isLoading && (
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-amber-500/20 p-8 text-center">
            <Sun className="w-12 h-12 text-amber-400/50 mx-auto mb-4" />
            <p className="text-slate-300 font-medium">Birth chart data unavailable</p>
            <p className="text-slate-500 text-sm mt-2">Please try refreshing or check your birth details</p>
            <button
              onClick={() => fetchData(currentProfile, selectedDate)}
              className="mt-4 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-200 text-sm hover:bg-amber-500/30 transition-colors"
            >
              Retry
            </button>
          </div>
        )}
        {/* Planetary Status - Standardized Design */}
        {chartData && (
          <PlanetaryStatus chartData={chartData} />
        )}

        {/* Quick Reference Data - South Indian Chart, Moon Nakshatra, Chart Details */}
        {chartData && (
          <QuickReferenceData
            chartData={chartData}
            panchangData={{
              ...(panchangData || chartData.panchang || {}),
              place: currentProfile?.location
            }}
          />
        )}

        {/* Nakshatra Intelligence Center */}
        {chartData && (
          <NakshatraIntelligenceCenter chartData={chartData} />
        )}

        {/* Cosmic Consultation - Unified Advanced Analysis */}
        {chartData && (
          <CosmicConsultation
            chartData={chartData}
            dashaData={dashaData}
            periodOverview={periodOverview}
            aiPredictions={aiPredictions}
          />
        )}

      </div>
    </div>
  );
};

export default ProAstrologerHome;
