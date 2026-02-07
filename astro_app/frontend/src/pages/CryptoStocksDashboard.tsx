import { useEffect, useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import LiveTicker from '../components/dashboard/LiveTicker';
import { useChartSettings } from '../context/ChartContext';
import { businessService } from '../services/business';
import { 
  Activity, Target, Zap, AlertTriangle, 
  HelpCircle, Brain, TrendingUp, TrendingDown,
  Sparkles, Clock, Calendar, Globe
} from 'lucide-react';

const CryptoStocksDashboard = () => {
  const { currentProfile } = useChartSettings();
  const [profile, setProfile] = useState<any>(null);
  const [overlay, setOverlay] = useState<any>(null);
  const [performance, setPerformance] = useState<any>(null);
  
  // Asset Selector State
  const [assetList, setAssetList] = useState<string[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string>("");
  const [assetAnalysis, setAssetAnalysis] = useState<any>(null);
  const [analyzingAsset, setAnalyzingAsset] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentProfile) return;

      try {
        setLoading(true);
        // Map currentProfile to backend expected format
        const requestData = {
          date: currentProfile.date, // DD/MM/YYYY
          time: currentProfile.time, // HH:MM
          location: currentProfile.location,
          latitude: currentProfile.latitude,
          longitude: currentProfile.longitude,
          timezone: currentProfile.timezone
        };

        // 1. Fetch Critical Financial Profile
        const profileData = await businessService.getFinancialProfile(requestData);
        setProfile(profileData);

        // 2. Fetch Secondary Data in Parallel (Failures won't block profile)
        try {
            const [overlayData, performanceData, assetsData] = await Promise.all([
                businessService.getMarketOverlay(requestData),
                businessService.getPerformanceStats(),
                businessService.getAssetList()
            ]);
            setOverlay(overlayData);
            setPerformance(performanceData);
            setAssetList(assetsData.assets);
        } catch (secondaryErr) {
            console.warn("Secondary data fetch failed (Overlay/Stats/Assets)", secondaryErr);
            // Attempt to recover Assets at least, as they are needed for selector
            try {
                const assetsData = await businessService.getAssetList();
                setAssetList(assetsData.assets);
            } catch (e) {
                console.error("Failed to recover asset list", e);
            }
        }

      } catch (err) {
        console.error("Failed to fetch financial profile", err);
        setError("Failed to generate your financial profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentProfile]);

  const handleAssetSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const asset = e.target.value;
      setSelectedAsset(asset);
      setAnalysisError(null);
      if (!asset) {
          setAssetAnalysis(null);
          return;
      }

      setAnalyzingAsset(true);
      try {
          const result = await businessService.analyzeAsset({
              user_profile: profile,
              asset_name: asset,
              latitude: currentProfile?.latitude,
              longitude: currentProfile?.longitude
          });
          setAssetAnalysis(result);
      } catch (err: any) {
          console.error("Analysis failed", err);
          if (err.response && err.response.status === 403) {
              setAnalysisError("Access Denied: This feature is available for Premium users only.");
          } else {
              setAnalysisError("Failed to analyze asset. Please try again later.");
          }
      } finally {
          setAnalyzingAsset(false);
      }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case "Strong Buy": return "bg-[#2ED573] text-[#0B0F1A]";
      case "Buy": return "bg-[#2ED573]/20 text-[#2ED573]";
      case "Hold": return "bg-[#F5A623]/20 text-[#F5A623]";
      case "Reduce": return "bg-[#E25555]/20 text-[#E25555]";
      default: return "bg-[#E25555]/20 text-[#E25555]";
    }
  };

  if (loading) {
    return (
      <MainLayout title="Financial DNA" breadcrumbs={['Cosmic Hub', 'Business', 'Crypto vs Stocks']}>
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6D5DF6]"></div>
        </div>
      </MainLayout>
    );
  }

  if (error || !profile) {
    return (
      <MainLayout title="Financial DNA" breadcrumbs={['Cosmic Hub', 'Business', 'Crypto vs Stocks']}>
        <div className="p-8 text-center text-[#E25555]">
          {error || "Profile not found."}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Crypto vs Stock Dashboard" breadcrumbs={['Cosmic Hub', 'Business', 'Financial Profile']}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 1. PERSONAL WEALTH DNA (Top Banner) */}
        <div className="bg-gradient-to-r from-[#6D5DF6] to-[#5B4BC4] rounded-2xl p-8 text-[#EDEFF5] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Brain className="w-64 h-64" />
          </div>
          <div className="relative z-10">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#EDEFF5]/70 mb-2">Your Financial Personality</h2>
            <h1 className="text-4xl font-bold mb-4">{profile.persona.type}</h1>
            <p className="text-lg text-[#EDEFF5]/90 max-w-2xl leading-relaxed">
              {profile.persona.description}
            </p>
          </div>
        </div>

        {/* LIVE TICKER */}
        <LiveTicker />

        {/* LIVE MARKET OVERLAY (Moved Up) */}
        {overlay && (
          <div className="bg-[#11162A] text-[#EDEFF5] rounded-2xl p-6 shadow-xl border border-[rgba(255,255,255,0.08)] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-20">
                <Activity className="w-32 h-32 text-[#6D5DF6]" />
             </div>
             
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 bg-[#6D5DF6]/20 rounded-lg text-[#6D5DF6]">
                      <Zap className="w-6 h-6" />
                   </div>
                   <div>
                      <h2 className="text-xl font-bold">Live Market Overlay</h2>
                      <p className="text-[#6F768A] text-sm">Personal Suitability × Market Conditions × Planetary Cycles</p>
                   </div>
                   <div className="ml-auto flex items-center gap-2">
                      <span className="animate-pulse w-2 h-2 bg-[#2ED573] rounded-full"></span>
                      <span className="text-xs font-mono text-[#2ED573]">LIVE FEED</span>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {/* 1. GMRI Gauge */}
                   <div className="bg-[#11162A]/50 rounded-xl p-4 border border-[rgba(255,255,255,0.08)] text-center flex flex-col items-center justify-center">
                      <h3 className="text-sm font-semibold text-[#6F768A] mb-4">Global Market Risk Index (GMRI)</h3>
                      <div className="relative w-32 h-32 flex items-center justify-center">
                         <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                            <circle 
                                cx="50" cy="50" r="45" fill="none" 
                                stroke={overlay.gmri.score > 60 ? '#E25555' : overlay.gmri.score > 30 ? '#F5A623' : '#2ED573'} 
                                strokeWidth="10" 
                                strokeDasharray={`${overlay.gmri.score * 2.83} 283`}
                                className="transition-all duration-1000 ease-out"
                            />
                         </svg>
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold">{overlay.gmri.score}</span>
                            <span className={`text-xs font-bold uppercase ${overlay.gmri.score > 60 ? 'text-[#E25555]' : overlay.gmri.score > 30 ? 'text-[#F5A623]' : 'text-[#2ED573]'}`}>
                                {overlay.gmri.level}
                            </span>
                         </div>
                      </div>
                      <div className="mt-4 text-xs text-[#6F768A]">
                          Vol: {overlay.gmri.components.moon_volatility} | Merc: {overlay.gmri.components.mercury_risk}
                      </div>
                   </div>

                   {/* 2. Personal Alignment Signals */}
                   <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Crypto */}
                      <div className="bg-[#11162A]/50 rounded-xl p-4 border border-[rgba(255,255,255,0.08)]">
                         <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold text-lg">Crypto Alignment</h4>
                                <div className="text-xs text-[#6F768A] mt-1">
                                   Suitability: {profile.scores.crypto}% | Strength: {Math.round(overlay.market_strength.crypto_strength)}%
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded text-xs font-bold ${getSignalColor(overlay.alignment.crypto.signal)}`}>
                                {overlay.alignment.crypto.signal}
                            </span>
                         </div>
                         <div className="w-full bg-[rgba(255,255,255,0.08)] rounded-full h-2 mb-2">
                            <div className="bg-[#6D5DF6] h-2 rounded-full transition-all duration-1000" style={{ width: `${overlay.alignment.crypto.score}%` }}></div>
                         </div>
                         <div className="text-right text-2xl font-bold text-[#6D5DF6]">{overlay.alignment.crypto.score}/100</div>
                      </div>

                      {/* Stocks */}
                      <div className="bg-[#11162A]/50 rounded-xl p-4 border border-[rgba(255,255,255,0.08)]">
                         <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold text-lg">Stocks Alignment</h4>
                                <div className="text-xs text-[#6F768A] mt-1">
                                   Suitability: {profile.scores.stocks}% | Strength: {Math.round(overlay.market_strength.stock_strength)}%
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded text-xs font-bold ${getSignalColor(overlay.alignment.stocks.signal)}`}>
                                {overlay.alignment.stocks.signal}
                            </span>
                         </div>
                         <div className="w-full bg-[rgba(255,255,255,0.08)] rounded-full h-2 mb-2">
                            <div className="bg-[#2ED573] h-2 rounded-full transition-all duration-1000" style={{ width: `${overlay.alignment.stocks.score}%` }}></div>
                         </div>
                         <div className="text-right text-2xl font-bold text-[#2ED573]">{overlay.alignment.stocks.score}/100</div>
                      </div>
                      
                      <div className="sm:col-span-2 mt-2 p-3 bg-[#6D5DF6]/10 border border-[#6D5DF6]/30 rounded-lg flex items-center gap-3">
                          <Brain className="w-5 h-5 text-[#6D5DF6]" />
                          <p className="text-sm text-[#A9B0C2]">
                              <span className="font-bold">Recommendation:</span> {overlay.message}
                          </p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* ASSET SELECTOR INTELLIGENCE */}
        <div className="bg-[#11162A] rounded-xl p-6 shadow-sm border border-[rgba(255,255,255,0.08)]">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#6D5DF6] rounded-lg text-white">
                    <Target className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-[#EDEFF5]">Asset Intelligence Engine</h2>
                    <p className="text-[#6F768A] text-sm">Select an asset to see if it fits YOUR chart today.</p>
                </div>
            </div>

            <div className="mb-6">
                <select 
                    className="w-full md:w-1/3 p-3 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0B0F1A] text-[#EDEFF5] focus:ring-2 focus:ring-[#6D5DF6] outline-none transition-all"
                    value={selectedAsset}
                    onChange={handleAssetSelect}
                >
                    <option value="">-- Select Asset to Analyze --</option>
                    {assetList.map(a => (
                        <option key={a} value={a}>{a}</option>
                    ))}
                </select>
            </div>

            {analysisError && (
                <div className="p-4 mb-6 rounded-lg bg-[#E25555]/20 border border-[#E25555]/30 text-[#E25555] flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="text-sm font-medium">{analysisError}</span>
                </div>
            )}

            {analyzingAsset && (
                <div className="p-8 text-center text-[#6F768A] animate-pulse">
                    Running Personal Suitability + Market Overlay + Asset DNA...
                </div>
            )}

            {assetAnalysis && !analyzingAsset && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
                    {/* 1. Asset Status & Live Price */}
                    <div className="rounded-xl bg-[#11162A] border border-[rgba(255,255,255,0.08)] overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
                        <div className={`p-4 text-center font-bold text-white text-lg tracking-wide uppercase ${
                            assetAnalysis.recommendation.color === 'green' ? 'bg-[#2ED573]' : 
                            assetAnalysis.recommendation.color === 'red' ? 'bg-[#E25555]' :
                            assetAnalysis.recommendation.color === 'orange' ? 'bg-[#F5A623]' :
                            'bg-[#6F768A]'
                        }`}>
                            {assetAnalysis.recommendation.status}
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-center items-center">
                            {assetAnalysis.market_data.live_price && (
                                <>
                                    <div className="text-3xl font-bold text-[#EDEFF5] mb-2">
                                        ${assetAnalysis.market_data.live_price.toLocaleString()}
                                    </div>
                                    <div className={`flex items-center px-3 py-1 rounded-full text-sm font-bold ${assetAnalysis.market_data.live_change >= 0 ? 'bg-[#2ED573]/20 text-[#2ED573]' : 'bg-[#E25555]/20 text-[#E25555]'}`}>
                                        {assetAnalysis.market_data.live_change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                                        {assetAnalysis.market_data.live_change}%
                                    </div>
                                </>
                            )}
                            <div className="mt-4 pt-4 w-full border-t border-[rgba(255,255,255,0.08)] text-center">
                                <span className="text-xs text-[#6F768A] uppercase font-semibold">Planetary Rulers</span>
                                <div className="text-sm font-medium text-[#A9B0C2] mt-1">
                                    {assetAnalysis.rulers.join(' + ')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Market Trend */}
                    <div className="rounded-xl bg-[#11162A] border border-[rgba(255,255,255,0.08)] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-semibold text-[#6F768A] uppercase">Market Trend</span>
                            <Activity className="w-5 h-5 text-[#6D5DF6]" />
                        </div>
                        <div className="text-2xl font-bold text-[#EDEFF5] mb-1">
                            {assetAnalysis.market_data.trend}
                        </div>
                        {assetAnalysis.market_data.astrology_trend && assetAnalysis.market_data.astrology_trend !== assetAnalysis.market_data.trend && (
                            <div className="flex items-center text-xs text-[#6D5DF6] mb-4 bg-[#6D5DF6]/20 px-2 py-1 rounded w-fit">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Astro Signal: {assetAnalysis.market_data.astrology_trend}
                            </div>
                        )}
                        <div className="mt-auto">
                            <div className="flex justify-between text-xs text-[#6F768A] mb-1">
                                <span>Momentum Strength</span>
                                <span>{assetAnalysis.market_data.strength}/100</span>
                            </div>
                            <div className="w-full bg-[#0B0F1A] h-3 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${
                                    assetAnalysis.market_data.strength > 70 ? 'bg-[#2ED573]' :
                                    assetAnalysis.market_data.strength > 40 ? 'bg-[#6D5DF6]' : 'bg-[#F5A623]'
                                }`} style={{width: `${assetAnalysis.market_data.strength}%`}}></div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Personal Fit */}
                    <div className="rounded-xl bg-[#11162A] border border-[rgba(255,255,255,0.08)] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-semibold text-[#6F768A] uppercase">Your Alignment</span>
                            <Target className="w-5 h-5 text-[#6D5DF6]" />
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center relative my-2">
                             <div className="relative w-24 h-24 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                                    <circle 
                                        cx="50" cy="50" r="45" fill="none" 
                                        stroke={assetAnalysis.personal_data.suitability_score > 75 ? '#2ED573' : assetAnalysis.personal_data.suitability_score > 50 ? '#6D5DF6' : '#F5A623'} 
                                        strokeWidth="8" 
                                        strokeDasharray={`${assetAnalysis.personal_data.suitability_score * 2.83} 283`}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-xl font-bold text-[#EDEFF5]">{assetAnalysis.personal_data.suitability_score}%</span>
                                </div>
                            </div>
                            <div className="text-lg font-bold mt-2 text-[#A9B0C2]">{assetAnalysis.personal_data.fit_label}</div>
                        </div>
                        <div className="text-xs text-center text-[#6F768A] mt-2">
                            Matches {assetAnalysis.personal_data.risk_profile} Profile
                        </div>
                    </div>

                    {/* 4. Advice & Timing */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-1 rounded-xl bg-[#11162A] border border-[#6D5DF6]/30 p-6 flex flex-col">
                         <div className="flex items-center gap-2 mb-4 text-[#6D5DF6]">
                             <Clock className="w-5 h-5" />
                             <span className="text-sm font-bold uppercase tracking-wide">Strategic Window</span>
                         </div>
                         
                         <div className="mb-4">
                             <div className="text-xs text-[#6D5DF6] mb-1">Best Time to Act</div>
                             <div className="text-lg font-bold text-[#EDEFF5]">
                                 {assetAnalysis.recommendation.timing_window}
                             </div>
                         </div>

                         <div className="flex-1 bg-[#0B0F1A]/50 rounded-lg p-3 text-sm italic text-[#A9B0C2] border-l-2 border-[#6D5DF6]">
                             "{assetAnalysis.recommendation.summary}"
                         </div>

                         {assetAnalysis.market_data.warnings.length > 0 && (
                            <div className="mt-4 space-y-1">
                                {assetAnalysis.market_data.warnings.map((w: string, i: number) => (
                                    <div key={i} className="flex items-center text-[10px] text-[#F5A623] font-medium">
                                        <AlertTriangle className="w-3 h-3 mr-1 flex-shrink-0" /> {w}
                                    </div>
                                ))}
                            </div>
                         )}
                    </div>
                </div>
            )}
        </div>

        {/* LIVE MARKET OVERLAY REMOVED (Moved Up) */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 2. ASSET SUITABILITY SCORECARD */}
          <div className="bg-[#11162A] rounded-xl p-6 shadow-sm border border-[#6D5DF6]/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#6D5DF6]/20 rounded-lg text-[#6D5DF6]">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#EDEFF5]">Asset Suitability</h3>
            </div>
            
            <div className="space-y-6">
              {[
                { label: 'Crypto Suitability', score: profile.scores.crypto, color: 'bg-[#6D5DF6]' },
                { label: 'Stocks Suitability', score: profile.scores.stocks, color: 'bg-[#2ED573]' },
                { label: 'Trading Suitability', score: profile.scores.trading, color: 'bg-[#F5A623]' },
                { label: 'Long-Term Wealth', score: profile.scores.long_term, color: 'bg-[#6D5DF6]' }
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-[#A9B0C2]">{item.label}</span>
                    <span className="font-bold text-[#EDEFF5]">
                      {item.score} <span className="text-xs font-normal text-[#6F768A]">
                        ({item.score > 80 ? 'Strong' : item.score > 60 ? 'Good' : item.score > 40 ? 'Moderate' : 'Low'})
                      </span>
                    </span>
                  </div>
                  <div className="h-2 bg-[#0B0F1A] rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} transition-all duration-1000`} 
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
                <h4 className="font-semibold text-[#EDEFF5] mb-4">Core Traits</h4>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: 'Risk (R)', val: profile.traits?.risk_appetite },
                        { label: 'Patience (P)', val: profile.traits?.patience },
                        { label: 'Intelligence (T)', val: profile.traits?.intelligence },
                        { label: 'Stability (E)', val: profile.traits?.emotional_stability }
                    ].map((t, i) => (
                        <div key={i} className="text-center p-3 bg-[#0B0F1A]/50 rounded-lg border border-white/5">
                            <div className="text-2xl font-bold text-[#6D5DF6]">{t.val}</div>
                            <div className="text-xs text-[#6F768A] uppercase tracking-wide">{t.label}</div>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* 3. RISK vs PATIENCE MAP */}
          <div className="bg-[#11162A] rounded-xl p-6 shadow-sm border border-[#6D5DF6]/30 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#F5A623]/20 rounded-lg text-[#F5A623]">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#EDEFF5]">Risk vs Patience</h3>
            </div>
            
            <div className="flex-1 flex items-center justify-center relative min-h-[200px]">
              {/* Coordinate System Background */}
              <div className="absolute inset-0 border-l border-b border-[#6D5DF6]/30 m-8"></div>
              
              {/* Quadrant Labels */}
              <span className="absolute top-4 right-4 text-xs font-bold text-[#6F768A]">High Risk / High Patience</span>
              <span className="absolute bottom-4 right-4 text-xs font-bold text-[#6F768A]">High Risk / Low Patience</span>
              <span className="absolute bottom-4 left-12 text-xs font-bold text-[#6F768A]">Low Risk</span>
              
              {/* User Dot */}
              <div 
                className="absolute w-6 h-6 bg-[#6D5DF6] rounded-full border-4 border-[#0B0F1A] shadow-lg flex items-center justify-center z-10 transition-all duration-1000"
                style={{ 
                  left: `${profile.traits?.risk_appetite}%`, 
                  bottom: `${profile.traits?.patience}%` 
                }}
              >
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              
              {/* Zones */}
              <div className="absolute inset-0 m-8 opacity-10 pointer-events-none">
                <div className="w-full h-full bg-gradient-to-tr from-[#11162A] to-[#6D5DF6]/40 rounded-lg"></div>
              </div>
            </div>
            <p className="text-center text-sm text-[#6F768A] mt-4">
              Your position based on Risk Appetite (X) vs Patience (Y).
            </p>
          </div>

          {/* 5. TODAY'S BEST ASSET */}
          <div className="bg-[#11162A] rounded-xl p-6 shadow-sm border border-[#6D5DF6]/30 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#2ED573]/20 rounded-lg text-[#2ED573]">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#EDEFF5]">Today's Strategy</h3>
            </div>
            
            <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4">
              <div>
                <span className="text-sm font-semibold text-[#6F768A] uppercase tracking-wider">Best Asset Today</span>
                <div className="text-3xl font-bold text-[#2ED573] mt-1">{profile.recommendation.best_asset_today}</div>
              </div>
              
              <div className="w-full h-px bg-white/10"></div>
              
              <div>
                <span className="text-sm font-semibold text-[#6F768A] uppercase tracking-wider">Approach With Caution</span>
                <div className="text-xl font-bold text-[#A9B0C2] mt-1">{profile.recommendation.avoid_asset_today}</div>
              </div>

              {profile.recommendation.guidance && (
                <div className="mt-4 p-3 bg-[#6D5DF6]/10 rounded-lg text-sm text-[#6D5DF6] italic">
                  "{profile.recommendation.guidance}"
                </div>
              )}
            </div>
          </div>

        </div>

        {/* 6 & 7. TRENDS & OPPORTUNITIES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 6. PERSONAL MARKET TREND */}
          <div className="bg-[#11162A] rounded-xl p-6 shadow-sm border border-[#6D5DF6]/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#6D5DF6]/20 rounded-lg text-[#6D5DF6]">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#EDEFF5]">Personal Market Trend</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#6D5DF6]/10 rounded-lg border border-[#6D5DF6]/20">
                <div>
                  <h4 className="font-semibold text-[#EDEFF5]">Financial Luck Cycle</h4>
                  <p className="text-sm text-[#6D5DF6]">Cautious wealth phase until Feb 10</p>
                </div>
                <span className="text-2xl">😐</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#2ED573]/10 rounded-lg border border-[#2ED573]/20">
                <div>
                  <h4 className="font-semibold text-[#EDEFF5]">Risk Appetite</h4>
                  <p className="text-sm text-[#2ED573]">High stability today</p>
                </div>
                <span className="text-2xl">🛡️</span>
              </div>
            </div>
          </div>

      {/* 7. Next Opportunity Windows */}
      <section className="mb-8">
        <h3 className="text-xl font-bold text-[#EDEFF5] mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#F5A623]" />
          Next Opportunity Windows
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-[#11162A] border border-white/10 rounded-lg p-4 hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="text-xs text-[#F5A623] font-bold uppercase mb-1">High Probability</div>
                    <div className="text-lg font-semibold text-[#EDEFF5] mb-2">Oct 14 - Oct 28</div>
                    <div className="text-xs text-[#A9B0C2]">
                        Mercury enters Libra (5th House), favoring tech stocks.
                    </div>
                </div>
            ))}
        </div>
      </section>
        </div>

        {/* 4. WHY THIS IS YOUR PROFILE (AI Insights) */}
        <div className="bg-[#11162A] rounded-xl p-6 border border-[#6D5DF6]/30">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-5 h-5 text-[#6D5DF6]" />
            <h3 className="font-bold text-[#EDEFF5]">Why This Is Your Profile</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {profile.insights.map((insight: string, i: number) => (
              <div key={i} className="bg-[#0B0F1A] p-4 rounded-lg shadow-sm text-sm text-[#A9B0C2] border-l-4 border-[#6D5DF6]">
                {insight}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
      {/* 8. Long-Term Wealth Path */}
      <section className="mb-8">
        <div className="bg-gradient-to-r from-[#11162A] to-[#0B0F1A] rounded-xl border border-white/10 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Globe className="w-32 h-32 text-[#6D5DF6]" />
            </div>
            
            <div className="relative z-10">
                <h3 className="text-xl font-bold text-[#EDEFF5] mb-2 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-[#6D5DF6]" />
                    Long-Term Wealth Path
                </h3>
                <p className="text-[#A9B0C2] mb-6 max-w-2xl">
                    Your chart indicates wealth accumulation through technology and foreign markets. 
                    The upcoming Jupiter transit in 2025 will activate your 11th house of gains.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-[#0B0F1A]/50 rounded-lg p-4 border border-white/5">
                        <div className="text-xs text-[#6F768A] uppercase mb-1">Primary Wealth Source</div>
                        <div className="text-[#EDEFF5] font-semibold">Innovation & Tech</div>
                    </div>
                    <div className="bg-[#0B0F1A]/50 rounded-lg p-4 border border-white/5">
                        <div className="text-xs text-[#6F768A] uppercase mb-1">Lucky Asset Class</div>
                        <div className="text-[#EDEFF5] font-semibold">Large Cap Growth</div>
                    </div>
                    <div className="bg-[#0B0F1A]/50 rounded-lg p-4 border border-white/5">
                        <div className="text-xs text-[#6F768A] uppercase mb-1">Karmic Blockage</div>
                        <div className="text-[#EDEFF5] font-semibold">Real Estate (Avoid)</div>
                    </div>
                </div>
            </div>
        </div>
      </section>

          {/* 8. WARNING / RISK ASSESSMENT */}
          <div className="bg-[#11162A] rounded-xl p-6 shadow-sm border border-[#6D5DF6]/30">
             <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#E25555]/20 rounded-lg text-[#E25555]">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#EDEFF5]">Risk Assessment</h3>
            </div>

            <div className="p-4 bg-[#E25555]/10 rounded-lg border border-[#E25555]/30">
              <h4 className="font-bold text-[#E25555] mb-2">Critical Warning</h4>
              <p className="text-sm text-[#EDEFF5] leading-relaxed">
                Based on your chart, high-risk trading during periods of emotional instability increases loss probability significantly. 
                Your "Capital Preserver" traits suggest that chasing losses can lead to deeper financial setbacks. Stick to your strategy.
              </p>
            </div>
            
            <div className="mt-6">
               <h4 className="font-semibold text-[#EDEFF5] mb-3">AI Money Coach Suggestions</h4>
               <div className="space-y-2">
                 {['Should I buy Bitcoin now?', 'Is this a good time for long-term stocks?', 'Why am I losing money lately?'].map((q, i) => (
                   <button key={i} className="w-full text-left p-3 rounded-lg bg-[#0B0F1A] hover:bg-white/5 text-sm text-[#A9B0C2] transition-colors flex items-center gap-2">
                     <HelpCircle className="w-4 h-4 text-[#6D5DF6]" />
                     {q}
                   </button>
                 ))}
               </div>
            </div>
          </div>

        </div>

        {/* ACCURACY & PERFORMANCE ENGINE */}
        <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#6D5DF6] rounded-lg text-white">
                    <Activity className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-[#EDEFF5]">Accuracy & Performance Engine</h2>
                    <p className="text-[#6F768A]">Audited results of our astro-trading signals vs control group.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Core Metrics */}
                <div className="bg-[#11162A] rounded-xl p-6 shadow-sm border border-[#6D5DF6]/30">
                     <h3 className="font-bold mb-4 text-[#EDEFF5]">Signal Accuracy (30d)</h3>
                     <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[#6F768A]">Win Rate</span>
                            <span className="text-2xl font-bold text-[#2ED573]">{performance?.metrics.win_rate}%</span>
                        </div>
                        <div className="h-2 bg-[#0B0F1A] rounded-full overflow-hidden">
                            <div className="h-full bg-[#2ED573]" style={{width: `${performance?.metrics.win_rate}%`}}></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <div className="text-[#6F768A]">Crypto</div>
                                <div className="font-semibold text-[#6D5DF6]">{performance?.metrics.crypto_win_rate}%</div>
                            </div>
                            <div>
                                <div className="text-[#6F768A]">Stocks</div>
                                <div className="font-semibold text-[#6D5DF6]">{performance?.metrics.stocks_win_rate}%</div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-white/10">
                            <span className="text-sm text-[#6F768A]">Avoid Accuracy</span>
                            <span className="text-sm font-bold text-[#F5A623]">{performance?.metrics.avoid_accuracy}%</span>
                        </div>
                     </div>
                </div>

                {/* Control Group */}
                <div className="bg-[#11162A] rounded-xl p-6 shadow-sm border border-[#6D5DF6]/30">
                     <h3 className="font-bold mb-4 text-[#EDEFF5]">Control Group (Random)</h3>
                     <div className="flex items-end gap-4 mb-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-[#6F768A]">{performance?.metrics.control_group_win_rate}%</div>
                            <div className="text-xs text-[#6F768A]">Random Signal</div>
                        </div>
                        <div className="text-center pb-1">
                            <span className="text-sm font-bold text-[#2ED573]">+{performance?.metrics.alpha_vs_control}%</span>
                            <div className="text-xs text-[#6F768A]">Our Alpha</div>
                        </div>
                     </div>
                     <p className="text-sm text-[#6F768A] mb-4">
                        Our Astro Engine consistently beats random market noise, proving the signal is not luck.
                     </p>
                     
                     <div className="p-3 bg-[#0B0F1A] rounded-lg text-xs">
                        <div className="flex justify-between mb-1">
                            <span className="text-[#6F768A]">High Suitability Win Rate</span>
                            <span className="font-bold text-[#2ED573]">{performance?.validation.high_suitability_win_rate}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#6F768A]">Low Suitability Win Rate</span>
                            <span className="font-bold text-[#E25555]">{performance?.validation.low_suitability_win_rate}%</span>
                        </div>
                     </div>
                </div>

                {/* AI Trust Layer */}
                <div className="bg-gradient-to-br from-[#11162A] to-[#0B0F1A] text-white rounded-xl p-6 shadow-sm border border-[#6D5DF6]/30 flex flex-col justify-between">
                     <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Brain className="w-5 h-5 text-[#6D5DF6]" />
                            <h3 className="font-bold text-[#EDEFF5]">AI Trust Layer</h3>
                        </div>
                        <p className="italic text-[#A9B0C2] text-sm leading-relaxed mb-4">
                            "{performance?.ai_explanation}"
                        </p>
                     </div>
                     
                     {/* Anti-Blame Shield */}
                     <div className="mt-4 pt-4 border-t border-indigo-800/50">
                        <div className="flex items-start gap-2 text-xs text-indigo-300/80">
                            <AlertTriangle className="w-3 h-3 mt-0.5 text-orange-400" />
                            <span>
                                Reminder: Losses often occur when trading against your suitability profile during high-risk windows.
                            </span>
                        </div>
                     </div>
                </div>
            </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default CryptoStocksDashboard;
