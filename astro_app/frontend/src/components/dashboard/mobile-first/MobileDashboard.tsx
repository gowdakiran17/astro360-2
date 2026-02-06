import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { useChartSettings } from '../../../context/ChartContext';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../LoadingSpinner';

// Mobile-first components
import MobileHeader from './MobileHeader';
import MobileHero from './MobileHero';
import MobileQuickStats from './MobileQuickStats';
import MobilePlanetaryStatus from './MobilePlanetaryStatus';
import MobileDashaCard from './MobileDashaCard';
import MobileInsights from './MobileInsights';
import MobileNavigation from './MobileNavigation';
import MobileBottomNav from './MobileBottomNav';

const MobileDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentProfile, switchProfile } = useChartSettings();
  const { user, isLoading: authLoading } = useAuth();

  const [chartData, setChartData] = useState<any>(null);

  const [dashaData, setDashaData] = useState<any>(null);
  const [periodOverview, setPeriodOverview] = useState<any>(null);
  const [aiPredictions, setAiPredictions] = useState<any>(null);
  const [dailyHoroscopeData, setDailyHoroscopeData] = useState<any>(null);
  const [selectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

      const [, chartRes, overviewRes] = await Promise.allSettled([
        api.post('chart/panchang', panchangPayload),
        api.post('chart/birth', birthDetails),
        api.post('chart/period/overview', {
          birth_details: birthDetails,
          analysis_date: targetDate.toISOString().split('T')[0]
        })
      ]);

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

  if (authLoading) return <LoadingSpinner />;

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 text-indigo-600">⭐</div>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Welcome to Astro360</h2>
            <p className="text-slate-600 mb-6">Sign in to access your personalized dashboard</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentProfile || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <MobileHeader 
        userName={currentProfile?.name || 'User'}
        location={currentProfile?.location}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        isMenuOpen={isMenuOpen}
      />

      {/* Mobile Navigation Drawer */}
      <MobileNavigation 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        userName={currentProfile?.name}
        userEmail={user?.email}
      />

      {/* Main Content */}
      <main className="pb-20">
        <div className="px-4 pt-4 space-y-6">
          {/* Hero Section */}
          <MobileHero 
            chartData={chartData}
            panchangData={periodOverview?.daily_analysis?.panchang}
            dailyHoroscopeData={dailyHoroscopeData}
          />

          {/* Quick Stats */}
          <MobileQuickStats 
            chartData={chartData}
            onRefresh={() => fetchData(currentProfile, selectedDate)}
            isLoading={isLoading}
          />

          {/* Current Dasha */}
          {dashaData && (
            <MobileDashaCard 
              dashaData={dashaData}
            />
          )}

          {/* Planetary Status */}
          {chartData && (
            <MobilePlanetaryStatus chartData={chartData} />
          )}

          {/* Daily Insights */}
          {dailyHoroscopeData && (
            <MobileInsights 
              insights={dailyHoroscopeData}
              aiPredictions={aiPredictions}
            />
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default MobileDashboard;