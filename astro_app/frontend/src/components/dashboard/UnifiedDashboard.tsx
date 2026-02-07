import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useChartSettings } from '../../context/ChartContext';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../LoadingSpinner';
import { RefreshCw, Star, Clock, Sparkles, Activity, ShieldCheck, TrendingUp, ChevronDown, Grid } from 'lucide-react';

// Import all web components from ./modern/
import PlanetaryStatus from './modern/PlanetaryStatus';
import NakshatraIntelligenceCenter from './modern/NakshatraIntelligenceCenter';
import DailyHoroscopes from './modern/DailyHoroscopes';
import CosmicHero from './modern/CosmicHero';
import OverviewKPIRow from './modern/OverviewKPIRow';
import UniversalChart from '../charts/UniversalChart';

const CollapsibleSection = ({ title, icon: Icon, children, defaultOpen = false }: { title: string, icon: any, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-stone-800 pt-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 group"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-amber-500 group-hover:text-amber-400 transition-colors" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-400 group-hover:text-stone-300 transition-colors">{title}</h2>
        </div>
        <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          {children}
        </div>
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
  // const [dashaData, setDashaData] = useState<any>(null); // Replaced with local logic inside fetchData, or keep if used elsewhere
  const [dashaData, setDashaData] = useState<any>(null);
  const [periodOverview, setPeriodOverview] = useState<any>(null);
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
      const [chartRes, overviewRes] = await Promise.allSettled([
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
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center p-4 font-sans text-[#EDEFF5]">
        <div className="relative max-w-lg w-full text-center">
            <h2 className="text-3xl font-bold mb-4 font-serif text-[#F5A623]">Bhava360</h2>
            <button onClick={() => navigate('/login')} className="px-6 py-3 bg-[#E25555] hover:bg-red-700 rounded-xl font-bold text-white transition-colors">Sign In</button>
        </div>
      </div>
    );
  }

  if (!currentProfile || isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-[#EDEFF5] selection:bg-amber-900/30 font-sans relative overflow-x-hidden -mt-20 md:mt-0">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none opacity-20" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
      }} />
      <div className="fixed inset-0 bg-gradient-to-b from-[#11162A]/0 via-[#11162A]/50 to-[#0B0F1A] pointer-events-none" />

      {/* Header - Minimal & Calm (Mobile Only) */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0B0F1A]/90 backdrop-blur-xl border-b border-white/5 md:hidden">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#F5A623] to-red-800 flex items-center justify-center shadow-[0_0_10px_-2px_rgba(245,158,11,0.3)]">
                <Sparkles className="w-3 h-3 text-[#EDEFF5]" />
             </div>
             <span className="text-xs font-bold tracking-widest text-[#A9B0C2] font-serif">BHAVA 360</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => fetchData(currentProfile, selectedDate)}
              className="text-[#6F768A] hover:text-[#F5A623] transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <div className="w-7 h-7 rounded-full bg-[#11162A] border border-white/10 flex items-center justify-center text-xs text-[#A9B0C2] font-serif">
              {currentProfile?.name?.charAt(0)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Vertical Layout */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 pb-24 space-y-12 pt-24 md:pt-6">
        
        {/* 1. Daily Guidance (Top 20%) */}
        <section>
          <CosmicHero
            chartData={chartData}
            panchangData={periodOverview?.daily_analysis?.panchang}
            dailyHoroscopeData={dailyHoroscopeData}
          />
        </section>

        {/* 2. Life Areas Summary (Second Priority) */}
        {dailyHoroscopeData && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2 px-1">
              <Activity className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-400">Life Areas</h2>
            </div>
            <DailyHoroscopes
              dailyHoroscopeData={dailyHoroscopeData}
              onRefresh={() => fetchData(currentProfile, selectedDate)}
              mode="summary"
            />
          </section>
        )}

        {/* 3. Insights & Forecasts (Third Priority - Collapsible) */}
        <section className="space-y-2">
            
            <CollapsibleSection title="Dashas & Transits" icon={Clock} defaultOpen={false}>
                 <div className="py-2">
                     <OverviewKPIRow />
                 </div>
            </CollapsibleSection>

            {chartData && (
                <CollapsibleSection title="Birth Chart" icon={Grid} defaultOpen={true}>
                     <div className="py-2 flex justify-center bg-[#1c1917]/50 rounded-xl p-4">
                        <UniversalChart data={chartData} className="w-full max-w-[350px]" />
                     </div>
                </CollapsibleSection>
            )}

            {chartData && (
                <CollapsibleSection title="Planetary Status" icon={Star}>
                     <div className="py-2">
                        <PlanetaryStatus chartData={chartData} />
                     </div>
                </CollapsibleSection>
            )}

             {dashaData && (
                <CollapsibleSection title="Nakshatra Intelligence" icon={Sparkles}>
                     <div className="py-2">
                        <NakshatraIntelligenceCenter chartData={chartData} />
                     </div>
                </CollapsibleSection>
            )}

        </section>

        {/* 4. Reference & Depth (Low Priority) */}
        <section className="space-y-8 pt-8 opacity-80 hover:opacity-100 transition-opacity duration-500">
            
             {/* Corrections & Remedies */}
             <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2 px-1">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">Remedies</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Gemstone Card */}
                  <div className="bg-[#1c1917] border border-stone-800 rounded-xl p-5 relative overflow-hidden group hover:border-amber-900/50 hover:shadow-[0_0_15px_-3px_rgba(245,158,11,0.1)] transition-all duration-500">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                          <Sparkles className="w-16 h-16 text-stone-400" />
                      </div>
                      <div className="relative z-10">
                        <span className="inline-block px-2 py-0.5 rounded bg-stone-800 text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-2">Gemstone</span>
                        <h3 className="text-base font-serif text-stone-300 mb-1">Ruby (Manik)</h3>
                        <p className="text-xs text-stone-500 mb-4 leading-relaxed">Strengthens the Sun for vitality and confidence.</p>
                        <button className="text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-amber-500 transition-colors">View Details →</button>
                      </div>
                  </div>

                  {/* Mantra Card */}
                  <div className="bg-[#1c1917] border border-stone-800 rounded-xl p-5 relative overflow-hidden group hover:border-amber-900/50 hover:shadow-[0_0_15px_-3px_rgba(245,158,11,0.1)] transition-all duration-500">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                          <Activity className="w-16 h-16 text-stone-400" />
                      </div>
                      <div className="relative z-10">
                        <span className="inline-block px-2 py-0.5 rounded bg-stone-800 text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-2">Mantra</span>
                        <h3 className="text-base font-serif text-stone-300 mb-1">Om Surya Namaha</h3>
                        <p className="text-xs text-stone-500 mb-4 leading-relaxed">Chant 108 times at sunrise.</p>
                        <button className="text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-amber-500 transition-colors">Start →</button>
                      </div>
                  </div>
                </div>
            </div>

             {/* Market Intelligence */}
             <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2 px-1">
                  <TrendingUp className="w-4 h-4 text-amber-500" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">Market Pulse</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#1c1917] border border-stone-800 rounded-xl p-5 group hover:border-emerald-900/50 transition-all duration-500">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-stone-300">Crypto Timing</h3>
                            <span className="text-[10px] font-bold bg-emerald-900/20 text-emerald-500 px-2 py-0.5 rounded uppercase">Bullish</span>
                        </div>
                        <p className="text-xs text-stone-500 leading-relaxed">Mercury favors altcoin volatility.</p>
                    </div>
                    
                    <div className="bg-[#1c1917] border border-stone-800 rounded-xl p-5 group hover:border-red-900/50 transition-all duration-500">
                         <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-stone-300">Indices</h3>
                            <span className="text-[10px] font-bold bg-red-900/20 text-red-500 px-2 py-0.5 rounded uppercase">Caution</span>
                        </div>
                        <p className="text-xs text-stone-500 leading-relaxed">Saturn resistance ahead.</p>
                    </div>
                </div>
            </div>
        </section>

      </div>
    </div>
  );
};

export default UnifiedDashboard;