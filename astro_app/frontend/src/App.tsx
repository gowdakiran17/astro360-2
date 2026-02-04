import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ChartProvider } from './context/ChartContext';
import { Loader2 } from 'lucide-react';

// Eager load critical components
import MainLayout from './components/layout/MainLayout';
import LoadingSpinner from './components/LoadingSpinner';
import Login from './pages/Login';
import Register from './pages/Register';
import Hub from './pages/Hub';
import MainDashboard from './pages/MainDashboard';
import AstrologyHome from './pages/AstrologyHome';
import LandingPage from './pages/LandingPage';
import MyCharts from './pages/MyCharts';
import LifePredictorPage from './pages/LifePredictorPage';
import ChartRectification from './pages/ChartRectification';
import EventsCalibration from './pages/EventsCalibration';
import ZodiacCalibration from './pages/ZodiacCalibration';
import BiodataCalibration from './pages/BiodataCalibration';
import Shodashvarga from './pages/Shodashvarga';
import AshtakvargaStrength from './pages/AshtakvargaStrength';
import ShadbalaEnergy from './pages/ShadbalaEnergy';
import VimshottariDasha from './pages/VimshottariDasha';
import ShadowPlanets from './pages/ShadowPlanets';
import Transits from './pages/Transits';
import LivePanchang from './pages/LivePanchang';
import Muhurata from './pages/Muhurata';
import ChartCompatibility from './pages/ChartCompatibility';
import StyleGuide from './pages/StyleGuide';
import ZodiacProfile from './pages/ZodiacProfile';
import DailyHoroscope from './pages/DailyHoroscope';
import UserProfile from './pages/UserProfile';
import CosmicHub from './pages/CosmicHub';
import MarketTiming from './pages/MarketTiming';
import GannIntelligence from './pages/GannIntelligence';
import CryptoStocksDashboard from './pages/CryptoStocksDashboard';
import CryptoTiming from './pages/CryptoTiming';
import RealTimeTrading from './pages/RealTimeTrading';
const MarketPsychology = lazy(() => import('./pages/MarketPsychology'));
const CorporatePlanning = lazy(() => import('./pages/CorporatePlanning'));
const TeamDynamics = lazy(() => import('./pages/TeamDynamics'));
import RemediesPage from './pages/dashboard/RemediesPage';


// Lazy load feature modules (Tools)
const VastuCompass = lazy(() => import('./pages/VastuCompass'));
const Gemstones = lazy(() => import('./pages/Gemstones'));
const Numerology = lazy(() => import('./pages/Numerology'));
const SadeSati = lazy(() => import('./pages/SadeSati'));
const BlueprintDashboard = lazy(() => import('./pages/BlueprintDashboard'));
const ReportDashboard = lazy(() => import('./pages/ReportDashboard')); // Premium Reports
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MatchMaking = lazy(() => import('./pages/MatchMaking'));
const PeriodAnalysisPage = lazy(() => import('./pages/PeriodAnalysisPage'));
const PersonalVastu = lazy(() => import('./pages/PersonalVastu')); // New Feature

// KP Astrology Pages
const KPDashboard = lazy(() => import('./pages/kp/KPDashboard'));
const KPChart = lazy(() => import('./pages/kp/KPChart'));
const KPTimeline = lazy(() => import('./pages/kp/KPTimeline'));
const KPDetailedPredictions = lazy(() => import('./pages/kp/KPDetailedPredictions'));
const KPPrecisionScoring = lazy(() => import('./pages/kp/KPPrecisionScoring'));
const KPEventPotential = lazy(() => import('./pages/kp/KPEventPotential'));
const KPCompleteReport = lazy(() => import('./pages/kp/KPCompleteReport'));
const KPCategoryReport = lazy(() => import('./pages/kp/KPCategoryReport'));
const KPThreeLayerScript = lazy(() => import('./pages/kp/KPThreeLayerScript'));
const KPAccurateTiming = lazy(() => import('./pages/kp/KPAccurateTiming'));
const NakshatraNadiDashboard = lazy(() => import('./pages/kp/NakshatraNadiDashboard'));

const VedaAI = lazy(() => import('./pages/VedaAI'));

// Loading Fallback
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-900">
    <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Allow unauthenticated access locally or check user
  // For demo purposes, we might be lenient or strict based on auth setup
  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <ChartProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Main App Routes */}
                <Route path="/" element={<LandingPage />} />

                <Route path="/home" element={
                  <ProtectedRoute>
                    <Hub />
                  </ProtectedRoute>
                } />

                <Route path="/astrology-home" element={
                  <ProtectedRoute>
                    <AstrologyHome />
                  </ProtectedRoute>
                } />

                <Route path="/dashboard/main" element={
                  <ProtectedRoute>
                    <MainDashboard />
                  </ProtectedRoute>
                } />

                <Route path="/ai-astrologer" element={
                  <MainLayout title="VedaAI Chat" breadcrumbs={['Dashboard', 'VedaAI']} showHeader={true} disableContentPadding={true}>
                    <VedaAI />
                  </MainLayout>
                } />

                <Route path="/ai-guru" element={
                  <MainLayout title="AI Guru Teacher" breadcrumbs={['Dashboard', 'Learning Gateway']} showHeader={true} disableContentPadding={true}>
                    <VedaAI />
                  </MainLayout>
                } />

                <Route path="/ai-horary" element={
                  <MainLayout title="Horary Prasna" breadcrumbs={['Dashboard', 'Event Prediction']} showHeader={true} disableContentPadding={true}>
                    <VedaAI />
                  </MainLayout>
                } />

                <Route path="/my-charts" element={
                  <ProtectedRoute>
                    <MyCharts />
                  </ProtectedRoute>
                } />

                {/* Cosmic Intelligence Hub */}
                <Route path="/cosmic" element={
                  <ProtectedRoute>
                    <CosmicHub />
                  </ProtectedRoute>
                } />
                <Route path="/cosmic/market-timing" element={
                  <ProtectedRoute>
                    <MarketTiming />
                  </ProtectedRoute>
                } />

                <Route path="/cosmic/gann-trading" element={
                  <ProtectedRoute>
                    <GannIntelligence />
                  </ProtectedRoute>
                } />

                <Route path="/cosmic/crypto-stock" element={
                  <ProtectedRoute>
                    <CryptoStocksDashboard />
                  </ProtectedRoute>
                } />

                <Route path="/cosmic/crypto-timing" element={
                  <ProtectedRoute>
                    <CryptoTiming />
                  </ProtectedRoute>
                } />

                <Route path="/cosmic/trading-intelligence" element={
                  <ProtectedRoute>
                    <RealTimeTrading />
                  </ProtectedRoute>
                } />

                <Route path="/cosmic/market-psychology" element={
                  <ProtectedRoute>
                    <MarketPsychology />
                  </ProtectedRoute>
                } />

                <Route path="/cosmic/corporate-planning" element={
                  <ProtectedRoute>
                    <CorporatePlanning />
                  </ProtectedRoute>
                } />

                <Route path="/cosmic/team-dynamics" element={
                  <ProtectedRoute>
                    <TeamDynamics />
                  </ProtectedRoute>
                } />

                {/* Advanced Analytics */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />

                {/* Research Module */}


                {/* Vastu Compass */}
                <Route path="/vastu" element={
                  <ProtectedRoute>
                    <VastuCompass />
                  </ProtectedRoute>
                } />

                <Route path="/vastu/personal" element={
                  <ProtectedRoute>
                    <PersonalVastu />
                  </ProtectedRoute>
                } />

                {/* Tools Routes */}
                <Route path="/tools">
                  <Route path="vastu" element={<ProtectedRoute><VastuCompass /></ProtectedRoute>} />
                  <Route path="gems" element={<ProtectedRoute><Gemstones /></ProtectedRoute>} />
                  <Route path="numerology" element={<ProtectedRoute><Numerology /></ProtectedRoute>} />
                  <Route path="numerology/blueprint" element={<ProtectedRoute><BlueprintDashboard /></ProtectedRoute>} />
                  <Route path="sade-sati" element={
                    <ProtectedRoute>
                      <SadeSati />
                    </ProtectedRoute>
                  } />
                  <Route path="match" element={<ProtectedRoute><MatchMaking /></ProtectedRoute>} />
                  <Route path="rectification" element={<ProtectedRoute><ChartRectification /></ProtectedRoute>} />
                  <Route path="calibration" element={<ProtectedRoute><EventsCalibration /></ProtectedRoute>} />
                  <Route path="zodiac" element={<ProtectedRoute><ZodiacCalibration /></ProtectedRoute>} />
                  <Route path="biodata" element={<ProtectedRoute><BiodataCalibration /></ProtectedRoute>} />
                  <Route path="period-analysis" element={<ProtectedRoute><PeriodAnalysisPage /></ProtectedRoute>} />
                  <Route path="life-predictor" element={
                    <MainLayout title="Life Predictor" breadcrumbs={['Tools', 'Life Predictor']} showHeader={true}>
                      <LifePredictorPage />
                    </MainLayout>
                  } />
                </Route>

                {/* Reports */}
                <Route path="/reports/premium" element={<ProtectedRoute><ReportDashboard /></ProtectedRoute>} />

                {/* Advanced Calculations Routes */}
                <Route path="/calculations/shodashvarga" element={<ProtectedRoute><Shodashvarga /></ProtectedRoute>} />
                <Route path="/calculations/ashtakvarga" element={<ProtectedRoute><AshtakvargaStrength /></ProtectedRoute>} />
                <Route path="/calculations/shadbala" element={<ProtectedRoute><ShadbalaEnergy /></ProtectedRoute>} />

                <Route path="/calculations/vimshottari" element={<ProtectedRoute><VimshottariDasha /></ProtectedRoute>} />
                <Route path="/calculations/shadow-planets" element={<ProtectedRoute><ShadowPlanets /></ProtectedRoute>} />

                {/* Global Features */}
                <Route path="/global/transits" element={<ProtectedRoute><Transits /></ProtectedRoute>} />
                <Route path="/global/panchang" element={<ProtectedRoute><LivePanchang /></ProtectedRoute>} />
                <Route path="/global/muhurata" element={<ProtectedRoute><Muhurata /></ProtectedRoute>} />
                <Route path="/global/matching" element={<ProtectedRoute><ChartCompatibility /></ProtectedRoute>} />

                {/* Remedies & Recommendations */}
                <Route path="/dashboard/remedies" element={
                  <ProtectedRoute>
                    <RemediesPage />
                  </ProtectedRoute>
                } />

                {/* Design System & Deliverables */}
                <Route path="/style-guide" element={<StyleGuide />} />
                <Route path="/zodiac/profile" element={<ZodiacProfile />} />
                <Route path="/horoscope/daily" element={<DailyHoroscope />} />
                <Route path="/account/profile" element={<UserProfile />} />

                {/* KP Astrology Routes */}
                <Route path="/kp/dashboard" element={
                  <MainLayout title="KP Astrology" breadcrumbs={['KP Astrology', 'Dashboard']} showHeader={true} disableContentPadding={true}>
                    <ProtectedRoute><KPDashboard /></ProtectedRoute>
                  </MainLayout>
                } />
                <Route path="/kp/chart" element={
                  <MainLayout title="KP Chart" breadcrumbs={['KP Astrology', 'My KP Chart']} showHeader={true} disableContentPadding={true}>
                    <ProtectedRoute><KPChart /></ProtectedRoute>
                  </MainLayout>
                } />
                <Route path="/kp/detailed-predictions" element={
                  <MainLayout title="Detailed Predictions" breadcrumbs={['KP Astrology', 'Predictions']} showHeader={true} disableContentPadding={true}>
                    <ProtectedRoute><KPDetailedPredictions /></ProtectedRoute>
                  </MainLayout>
                } />
                <Route path="/kp/precision-scoring" element={
                  <MainLayout title="Precision Scoring" breadcrumbs={['KP Astrology', 'Scoring']} showHeader={true} disableContentPadding={true}>
                    <ProtectedRoute><KPPrecisionScoring /></ProtectedRoute>
                  </MainLayout>
                } />
                <Route path="/kp/event-potential" element={
                  <MainLayout title="Event Potential" breadcrumbs={['KP Astrology', 'Potential']} showHeader={true} disableContentPadding={true}>
                    <ProtectedRoute><KPEventPotential /></ProtectedRoute>
                  </MainLayout>
                } />
                <Route path="/kp/three-layer-script" element={
                  <MainLayout title="3-Layer Script" breadcrumbs={['KP Astrology', 'Script']} showHeader={true} disableContentPadding={true}>
                    <ProtectedRoute><KPThreeLayerScript /></ProtectedRoute>
                  </MainLayout>
                } />
                <Route path="/kp/timeline" element={
                  <MainLayout title="5-Year Timeline" breadcrumbs={['KP Astrology', 'Timeline']} showHeader={true} disableContentPadding={true}>
                    <ProtectedRoute><KPTimeline /></ProtectedRoute>
                  </MainLayout>
                } />
                <Route path="/kp/accurate-timing" element={
                  <MainLayout title="Accurate Timing" breadcrumbs={['KP Astrology', 'Timing']} showHeader={true} disableContentPadding={true}>
                    <ProtectedRoute><KPAccurateTiming /></ProtectedRoute>
                  </MainLayout>
                } />
                <Route path="/kp/complete-report" element={
                  <MainLayout title="Complete KP Report" breadcrumbs={['KP Astrology', 'Full Report']} showHeader={true} disableContentPadding={true}>
                    <ProtectedRoute><KPCompleteReport /></ProtectedRoute>
                  </MainLayout>
                } />
                <Route path="/kp/category/:category" element={
                  <MainLayout title="Category Report" breadcrumbs={['KP Astrology', 'Category']} showHeader={true} disableContentPadding={true}>
                    <ProtectedRoute><KPCategoryReport /></ProtectedRoute>
                  </MainLayout>
                } />
                <Route path="/kp/nakshatra-nadi" element={
                  <MainLayout title="Nakshatra Nadi" breadcrumbs={['KP Astrology', 'Nadi Analysis']} showHeader={true} disableContentPadding={true}>
                    <ProtectedRoute><NakshatraNadiDashboard /></ProtectedRoute>
                  </MainLayout>
                } />

                {/* Fallbacks */}
                <Route path="/tools/*" element={<ProtectedRoute><MainDashboard /></ProtectedRoute>} />
                <Route path="/calculations/*" element={<ProtectedRoute><MyCharts /></ProtectedRoute>} />
                <Route path="/global/*" element={<ProtectedRoute><MyCharts /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/home" replace />} />
              </Routes>
            </Suspense>
          </ChartProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
