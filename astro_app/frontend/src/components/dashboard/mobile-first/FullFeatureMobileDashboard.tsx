import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { useChartSettings } from '../../../context/ChartContext';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../LoadingSpinner';
import { RefreshCw, Star, Clock, Home, Zap } from 'lucide-react';

// Import all web components
import PlanetaryStatus from '../modern/PlanetaryStatus';
import QuickReferenceData from '../modern/QuickReferenceData';
import NakshatraIntelligenceCenter from '../modern/NakshatraIntelligenceCenter';
import CosmicConsultation from '../modern/CosmicConsultation';
import DailyHoroscopes from '../modern/DailyHoroscopes';
import CosmicHero from '../modern/CosmicHero';

// Mobile components
import MobileHeader from './MobileHeader';
import MobileNavigation from './MobileNavigation';
import MobileBottomNav from './MobileBottomNav';

const FullFeatureMobileDashboard = () => {
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'planets' | 'dasha' | 'insights'>('overview');

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
      const [panchangRes, chartRes, overviewRes] = await Promise.allSettled([
        api.post('chart/panchang', { ...birthDetails, date: birthDetails.date, time: birthDetails.time }),
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
            api.post('ai/quick-predictions', { chart_data: chart, dasha_data: fetchedDashaData }),
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
              <Star className="w-8 h-8 text-indigo-600" />
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

  const sections = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'planets', label: 'Planets', icon: Star },
    { id: 'dasha', label: 'Dasha', icon: Clock },
    { id: 'insights', label: 'Insights', icon: Zap }
  ];

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

      {/* Section Navigation */}
      <div className="sticky top-14 z-30 bg-white border-b border-slate-200 px-4 py-2">
        <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-2 px-2 rounded-md text-xs font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="pb-20">
        <div className="px-4 pt-4 space-y-4">
          
          {/* Overview Section - All web features */}
          {activeSection === 'overview' && (
            <>
              {/* Hero with Panchang - Same as web */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                <CosmicHero 
                  chartData={chartData}
                  panchangData={periodOverview?.daily_analysis?.panchang}
                  dailyHoroscopeData={dailyHoroscopeData}
                />
              </div>

              {/* Daily Horoscopes - Same as web */}
              {dailyHoroscopeData && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-slate-900">Daily Cosmic Insights</h3>
                    <button
                      onClick={() => fetchData(currentProfile, selectedDate)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <RefreshCw className={`w-4 h-4 text-slate-600 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                  <DailyHoroscopes
                    dailyHoroscopeData={dailyHoroscopeData}
                    onRefresh={() => fetchData(currentProfile, selectedDate)}
                  />
                </div>
              )}

              {/* AI Predictions - Same as web */}
              {aiPredictions && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">AI Insights</h3>
                  <CosmicConsultation
                    chartData={chartData}
                    dashaData={dashaData}
                    periodOverview={periodOverview}
                    aiPredictions={aiPredictions}
                  />
                </div>
              )}
            </>
          )}

          {/* Planets Section - All web features */}
          {activeSection === 'planets' && (
            <>
              {/* Planetary Status - Same as web */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Planetary Resonance</h3>
                <PlanetaryStatus chartData={chartData} />
              </div>

              {/* Detailed Analysis - Same as web */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Structural Analysis</h3>
                <QuickReferenceData
                  chartData={chartData}
                  panchangData={{
                    ...(panchangData || chartData.panchang || {}),
                    place: currentProfile?.location
                  }}
                />
              </div>
            </>
          )}

          {/* Dasha Section - All web features */}
          {activeSection === 'dasha' && (
            <>
              {/* Current Dasha - Same as web */}
              {dashaData && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Current Period</h3>
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-900">{dashaData.dashas?.[0]?.planet} Dasha</p>
                    <p className="text-sm text-slate-600">Major Period</p>
                  </div>
                </div>
              )}

              {/* Nakshatra Intelligence - Same as web */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Nakshatra Intelligence</h3>
                <NakshatraIntelligenceCenter chartData={chartData} />
              </div>
            </>
          )}

          {/* Insights Section - All web features */}
          {activeSection === 'insights' && (
            <>
              {/* Unified Consultation - Same as web */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Unified Consultation</h3>
                <CosmicConsultation
                  chartData={chartData}
                  dashaData={dashaData}
                  periodOverview={periodOverview}
                  aiPredictions={aiPredictions}
                />
              </div>
            </>
          )}

          {/* Refresh Button - Same as web */}
          <button
            onClick={() => fetchData(currentProfile, selectedDate)}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Cosmic Data</span>
          </button>

        </div>
      </main>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default FullFeatureMobileDashboard;