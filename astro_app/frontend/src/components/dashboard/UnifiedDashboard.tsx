import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useChartSettings } from '../../context/ChartContext';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../LoadingSpinner';
import { RefreshCw, Star, Clock, Home, Bell, Sun } from 'lucide-react';
import BrandLogo from '../layout/BrandLogo';

// Import all web components from ./modern/
import PlanetaryStatus from './modern/PlanetaryStatus';
import QuickReferenceData from './modern/QuickReferenceData';
import NakshatraIntelligenceCenter from './modern/NakshatraIntelligenceCenter';
import DailyHoroscopes from './modern/DailyHoroscopes';
import CosmicHero from './modern/CosmicHero';
import HomeHeader from './modern/HomeHeader';
import OverviewKPIRow from './modern/OverviewKPIRow';

// Unified Tabs
const Tabs = ({ sections, activeSection, scrollToSection }: { sections: any[], activeSection: string, scrollToSection: (id: string) => void }) => {
  return (
    <div className="sticky top-[60px] z-30 bg-slate-950/90 backdrop-blur-xl px-4 py-2">
      <div className="flex space-x-1 p-1">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-2 px-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600/20 text-blue-200 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{section.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const UnifiedDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentProfile, switchProfile } = useChartSettings();
  const { user, isLoading: authLoading } = useAuth();

  const [chartData, setChartData] = useState<any>(null);
  const [panchangData, setPanchangData] = useState<any>(null);
  const [dashaData, setDashaData] = useState<any>(null);
  const [periodOverview, setPeriodOverview] = useState<any>(null);
  const [dailyHoroscopeData, setDailyHoroscopeData] = useState<any>(null);
  const [selectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  
  // View State
  const [activeSection, setActiveSection] = useState<'overview' | 'planets' | 'dasha' | 'insights'>('overview');

  // Handle Scroll for Desktop Active State
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 768) return; // Ignore on mobile
      
      const sections = ['overview', 'planets', 'dasha', 'insights'];
      for (const section of sections) {
        const element = document.getElementById(`section-${section}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveSection(section as any);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (window.innerWidth < 768) {
        setActiveSection(id as any);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        const element = document.getElementById(`section-${id}`);
        if (element) {
            const offset = 100; // Header offset
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
  };


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
          const horoscopeRes = await api.post('ai/daily-horoscopes', {
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
          });
          if (horoscopeRes.data?.status === 'success') setDailyHoroscopeData(horoscopeRes.data.data);
        } catch (e) {
          console.error("Horoscope Error:", e);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 flex items-center justify-center p-4">
        {/* Simplified Login Prompt for brevity - reusing styles from ProAstrologerHome */}
        <div className="relative max-w-lg w-full text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Bhava360</h2>
            <button onClick={() => navigate('/login')} className="px-6 py-3 bg-amber-500 rounded-xl font-bold text-black">Sign In</button>
        </div>
      </div>
    );
  }

  if (!currentProfile || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const sections = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'planets', label: 'Planets', icon: Star },
    { id: 'dasha', label: 'Nakshatra', icon: Clock }
  ];

  // Insights deprecated in new layout

  return (
    <div className="min-h-screen w-full bg-[#0B1121] text-slate-100 relative overflow-x-hidden font-sans selection:bg-blue-500/30">
      
      {/* SaaS Background - Minimal & Clean */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/5 via-[#0B1121] to-[#0B1121] pointer-events-none" />

      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" showWordmark />
            <div>
              <h1 className="text-sm font-semibold text-white">{currentProfile?.name}</h1>
              <p className="text-[10px] text-slate-400">{currentProfile?.location}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
              <Bell className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
      <Tabs sections={sections} activeSection={activeSection} scrollToSection={scrollToSection} />

      <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12 2xl:px-16 py-6 md:py-12 space-y-10 md:space-y-16">
        <div id="section-overview" className={`${activeSection === 'overview' ? 'block' : 'hidden md:block'}`}>
          <div className="space-y-6 md:space-y-10">
            <div className="hidden md:block">
              <HomeHeader userName={currentProfile?.name || 'Cosmic Soul'} location={currentProfile?.location} showActions={true} />
            </div>
            <CosmicHero
              chartData={chartData}
              panchangData={periodOverview?.daily_analysis?.panchang}
              dailyHoroscopeData={dailyHoroscopeData}
            />
            <section className="space-y-3 md:space-y-4">
              <OverviewKPIRow />
            </section>
            {chartData && (
              <section className="space-y-3 md:space-y-4">
                <DailyHoroscopes
                  dailyHoroscopeData={dailyHoroscopeData}
                  onRefresh={() => fetchData(currentProfile, selectedDate)}
                />
              </section>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-slate-800/60 rounded-xl px-4 py-3 bg-slate-900/30">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Data status: Synced</span>
          </div>
          <button
            onClick={() => fetchData(currentProfile, selectedDate)}
            className="group/refresh w-full md:w-auto flex items-center justify-center gap-3 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-all active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 transition-transform duration-700 ${isLoading ? 'animate-spin' : 'group-hover/refresh:rotate-180'}`} />
            <span>Refresh data</span>
          </button>
        </div>
        
        {!chartData && !isLoading && (
          <div className="border border-slate-800/60 rounded-2xl p-8 md:p-12 text-center bg-slate-900/30">
            <Sun className="w-10 h-10 md:w-12 md:h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-lg md:text-xl font-semibold text-slate-100 mb-2">Data unavailable</p>
            <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">We couldn’t load your chart data. Try again to refresh the dashboard.</p>
            <button
              onClick={() => fetchData(currentProfile, selectedDate)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold text-white transition-all"
            >
              Try again
            </button>
          </div>
        )}

        <div id="section-planets" className={`${activeSection === 'planets' ? 'block' : 'hidden md:block'}`}>
           {chartData && (
             <div className="grid grid-cols-1 gap-8">
               <section className="space-y-4">
                 <div>
                   <h2 className="text-sm md:text-base font-semibold text-slate-100">Chart Reference</h2>
                   <p className="text-xs text-slate-400">Panchang and structural details</p>
                 </div>
                 <QuickReferenceData
                   chartData={chartData}
                   panchangData={{
                     ...(panchangData || chartData.panchang || {}),
                     place: currentProfile?.location
                   }}
                 />
               </section>

               <section className="space-y-4">
                 <div>
                   <h2 className="text-sm md:text-base font-semibold text-slate-100">Planetary Positions</h2>
                   <p className="text-xs text-slate-400">Ascendant and key planets for this chart</p>
                 </div>
                 <PlanetaryStatus chartData={chartData} />
               </section>
             </div>
           )}
        </div>

        <div id="section-dasha" className={`${activeSection === 'dasha' ? 'block' : 'hidden md:block'}`}>
           {dashaData && (
             <div className="space-y-4">
               <div>
                 <h2 className="text-sm md:text-base font-semibold text-slate-100">Nakshatra Intelligence</h2>
                 <p className="text-xs text-slate-400">Primary Moon Nakshatra and current timelines</p>
               </div>
               <NakshatraIntelligenceCenter chartData={chartData} />
             </div>
           )}
        </div>

        {/* Insights section removed in favor of clearer Daily Horoscopes narrative */}

      </div>
    </div>
  );
};

export default UnifiedDashboard;
