import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Star, Moon, Sun, Sparkles, ArrowRight } from 'lucide-react';
import ZodiacCard from '../components/zodiac/ZodiacCard';

// Lazy load the birth chart calculator for performance
const BirthChartCalculator = lazy(() => import('../components/astrology/BirthChartCalculator'));

const ZODIAC_DATA = [
  { id: 1, name: 'Aries', symbol: '♈', element: 'fire', dates: 'Mar 21 - Apr 19', color: '#FF6B6B' },
  { id: 2, name: 'Taurus', symbol: '♉', element: 'earth', dates: 'Apr 20 - May 20', color: '#4ECDC4' },
  { id: 3, name: 'Gemini', symbol: '♊', element: 'air', dates: 'May 21 - Jun 20', color: '#45B7D1' },
  { id: 4, name: 'Cancer', symbol: '♋', element: 'water', dates: 'Jun 21 - Jul 22', color: '#96CEB4' },
  { id: 5, name: 'Leo', symbol: '♌', element: 'fire', dates: 'Jul 23 - Aug 22', color: '#FFEAA7' },
  { id: 6, name: 'Virgo', symbol: '♍', element: 'earth', dates: 'Aug 23 - Sep 22', color: '#DDA0DD' },
  { id: 7, name: 'Libra', symbol: '♎', element: 'air', dates: 'Sep 23 - Oct 22', color: '#FFB6C1' },
  { id: 8, name: 'Scorpio', symbol: '♏', element: 'water', dates: 'Oct 23 - Nov 21', color: '#8B5CF6' },
  { id: 9, name: 'Sagittarius', symbol: '♐', element: 'fire', dates: 'Nov 22 - Dec 21', color: '#FF8C42' },
  { id: 10, name: 'Capricorn', symbol: '♑', element: 'earth', dates: 'Dec 22 - Jan 19', color: '#2D3748' },
  { id: 11, name: 'Aquarius', symbol: '♒', element: 'air', dates: 'Jan 20 - Feb 18', color: '#3182CE' },
  { id: 12, name: 'Pisces', symbol: '♓', element: 'water', dates: 'Feb 19 - Mar 20', color: '#63B3ED' }
];

const AstrologyHome: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedZodiac, setSelectedZodiac] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (starsRef.current) {
        const scrolled = window.pageYOffset;
        starsRef.current.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getMoonPhase = () => {
    const day = currentTime.getDate();
    const phase = (day % 8) + 1;
    const phases = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
    return phases[phase - 1];
  };

  return (
    <div className="astrology-home" role="main" aria-label="Astrology Home Page">
      {/* Critical CSS Inline */}
      <style dangerouslySetInnerHTML={{
        __html: `
          :root {
            --space-purple: #2D1B69;
            --cosmic-blue: #1E3A8A;
            --starlight-gold: #FBBF24;
            --mystical-silver: #E5E7EB;
            --deep-space: #050816;
            --cosmic-gradient: linear-gradient(135deg, var(--space-purple) 0%, var(--cosmic-blue) 50%, var(--deep-space) 100%);
            --touch-target: 44px;
            --border-radius: 16px;
            --spacing-unit: 8px;
          }

          .astrology-home {
            min-height: 100vh;
            background: var(--cosmic-gradient);
            color: var(--mystical-silver);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            overflow-x: hidden;
          }

          .astrology-home * {
            box-sizing: border-box;
          }

          .touch-target {
            min-height: var(--touch-target);
            min-width: var(--touch-target);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }

          @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }

          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.3); }
            50% { box-shadow: 0 0 40px rgba(251, 191, 36, 0.6); }
          }

          .star-field {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
          }

          .star {
            position: absolute;
            width: 2px;
            height: 2px;
            background: var(--starlight-gold);
            border-radius: 50%;
            animation: twinkle 3s ease-in-out infinite;
          }

          .content-wrapper {
            position: relative;
            z-index: 2;
            padding: calc(var(--spacing-unit) * 3);
          }

          @media (max-width: 768px) {
            .content-wrapper {
              padding: calc(var(--spacing-unit) * 2);
            }
          }

          .visually-hidden {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
          }

          .zodiac-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: var(--border-radius);
            padding: calc(var(--spacing-unit) * 3);
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
            overflow: hidden;
          }

          .zodiac-card:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: var(--starlight-gold);
            transform: translateY(-4px);
            box-shadow: 0 10px 30px rgba(251, 191, 36, 0.2);
          }

          .zodiac-card:focus {
            outline: 2px solid var(--starlight-gold);
            outline-offset: 2px;
          }

          .progressive-disclosure {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
          }

          .progressive-disclosure.expanded {
            max-height: 500px;
          }

          .parallax-bg {
            transform: translateZ(0);
            will-change: transform;
          }
        `
      }} />

      {/* Star Field Background */}
      <div className="star-field" ref={starsRef} aria-hidden="true">
        {Array.from({ length: 100 }, (_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="content-wrapper" role="banner">
        <nav className="flex items-center justify-between mb-8" role="navigation" aria-label="Main navigation">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center touch-target" role="img" aria-label="Astrology Logo">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Astro360</h1>
              <p className="text-sm text-gray-300">{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <button
            className="touch-target bg-white/10 backdrop-blur-md rounded-lg border border-white/20 lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
              <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-4" role="menubar">
            <button onClick={() => navigate('/home')} className="touch-target px-4 py-2 text-white hover:text-yellow-400 transition-colors" role="menuitem" tabIndex={0}>Daily Horoscope</button>
            <button onClick={() => navigate('/home')} className="touch-target px-4 py-2 text-white hover:text-yellow-400 transition-colors" role="menuitem" tabIndex={0}>Birth Chart</button>
            <button onClick={() => navigate('/home')} className="touch-target px-4 py-2 text-white hover:text-yellow-400 transition-colors" role="menuitem" tabIndex={0}>Compatibility</button>
            {!user ? (
              <button onClick={() => navigate('/login')} className="touch-target px-6 py-2 bg-yellow-500 text-black rounded-lg font-bold hover:bg-yellow-400 transition-all active:scale-95" role="menuitem" tabIndex={0}>Login</button>
            ) : (
              <button onClick={() => navigate('/home')} className="touch-target px-6 py-2 bg-yellow-500 text-black rounded-lg font-bold hover:bg-yellow-400 transition-all active:scale-95" role="menuitem" tabIndex={0}>Go to Hub</button>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div id="mobile-menu" className="lg:hidden mt-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-4" role="menu">
            <button className="touch-target w-full text-left py-2 text-white hover:text-yellow-400 transition-colors" role="menuitem">Daily Horoscope</button>
            <button className="touch-target w-full text-left py-2 text-white hover:text-yellow-400 transition-colors" role="menuitem">Birth Chart</button>
            <button className="touch-target w-full text-left py-2 text-white hover:text-yellow-400 transition-colors" role="menuitem">Compatibility</button>
            <button className="touch-target w-full py-2 mt-2 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors" role="menuitem">Get Started</button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="content-wrapper text-center" role="region" aria-label="Welcome section">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Moon className="w-8 h-8 text-yellow-400 animate-float" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{getMoonPhase()} {currentTime.toLocaleTimeString()}</div>
              <div className="text-sm text-gray-300">{currentTime.toLocaleDateString()}</div>
            </div>
            <Sun className="w-8 h-8 text-yellow-500 animate-float" style={{ animationDelay: '1s' }} />
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Discover Your
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> Cosmic Path</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Unlock the mysteries of the universe with personalized astrological insights, daily guidance, and celestial wisdom.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              className="touch-target px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-yellow-500/25 transition-all hover:scale-105 animate-pulse-glow"
              aria-label="Get your free birth chart"
            >
              Get Your Free Birth Chart
              <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </button>
            <button className="touch-target px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl font-medium hover:bg-white/20 transition-all" aria-label="Learn more about astrology">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Zodiac Signs Section */}
      <section className="content-wrapper" role="region" aria-label="Zodiac signs">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Explore the Zodiac</h3>
            <p className="text-gray-300">Discover the unique traits and energies of each astrological sign</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4" role="grid" aria-label="Zodiac signs grid">
            {ZODIAC_DATA.map((sign, index) => (
              <ZodiacCard
                key={sign.id}
                id={sign.id}
                name={sign.name}
                symbol={sign.symbol}
                element={sign.element as 'fire' | 'earth' | 'air' | 'water'}
                dates={sign.dates}
                color={sign.color}
                onSelect={setSelectedZodiac}
                isSelected={selectedZodiac === sign.id}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Daily Horoscope Section */}
      <section className="content-wrapper mt-16" role="region" aria-label="Daily horoscope">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Today's Cosmic Weather</h3>
                <p className="text-gray-300">Astrological influences for {currentTime.toLocaleDateString()}</p>
              </div>
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-3xl mb-2">🌙</div>
                <h4 className="text-white font-bold mb-1">Moon Phase</h4>
                <p className="text-sm text-gray-300">Waxing Crescent</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-3xl mb-2">♃</div>
                <h4 className="text-white font-bold mb-1">Jupiter</h4>
                <p className="text-sm text-gray-300">In Taurus - Expansion</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-3xl mb-2">☿</div>
                <h4 className="text-white font-bold mb-1">Mercury</h4>
                <p className="text-sm text-gray-300">Direct - Clear Communication</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Birth Chart Calculator */}
      <section className="content-wrapper mt-16" role="region" aria-label="Birth chart calculator">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">Calculate Your Birth Chart</h3>
            <p className="text-gray-300">Enter your birth details to discover your unique cosmic blueprint</p>
          </div>

          <Suspense fallback={
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-white">Loading birth chart calculator...</p>
            </div>
          }>
            <BirthChartCalculator />
          </Suspense>
        </div>
      </section>

      {/* Footer */}
      <footer className="content-wrapper mt-16 text-center" role="contentinfo">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-bold">Astro360</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-300">Your Cosmic Companion</span>
          </div>
          <p className="text-gray-400 text-sm">
            © {currentTime.getFullYear()} Astro360. All rights reserved.
            <span className="block mt-2">Guided by the stars, powered by wisdom.</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AstrologyHome;