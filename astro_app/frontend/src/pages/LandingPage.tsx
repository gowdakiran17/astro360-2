import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Target, Clock, Brain, ArrowRight, Star } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  
  console.log('🔮 LandingPage component loaded!');

  return (
    <div className="min-h-screen text-white" style={{
      background: 'linear-gradient(135deg, #2D1B69 0%, #1E3A8A 50%, #050816 100%)'
    }}>
      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 overflow-hidden">
        {/* Animated stars background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.7 + 0.3
              }}
            />
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto text-center z-10">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center mb-8 gap-2">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl md:text-4xl font-bold" style={{ color: '#FBBF24' }}>
              Bhava360
            </h1>
          </div>

          {/* Main Headline */}
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Ancient Wisdom,
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Modern Precision
            </span>
          </h2>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" style={{ color: '#E5E7EB' }}>
            AI-powered Vedic & KP astrology for precise life guidance. 
            Get personalized insights backed by 5,000 years of celestial wisdom.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/home')}
              className="group px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #2D1B69 0%, #1E3A8A 100%)' }}
            >
              Get Your Free Chart
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/home')}
              className="px-8 py-4 backdrop-blur-sm rounded-full font-semibold text-lg transition-colors border"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(251, 191, 36, 0.3)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            >
              Explore Features
            </button>
          </div>

          {/* Trust Badge */}
          <p className="mt-8 text-sm flex items-center justify-center gap-2" style={{ color: '#E5E7EB', opacity: 0.7 }}>
            <Star className="w-4 h-4" style={{ color: '#FBBF24', fill: '#FBBF24' }} />
            Trusted by seekers worldwide
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20" style={{ backgroundColor: 'rgba(5, 8, 22, 0.5)' }}>
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Bhava360?
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="backdrop-blur-sm p-8 rounded-2xl border transition-colors" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6" style={{
                background: 'linear-gradient(135deg, #2D1B69 0%, #1E3A8A 100%)'
              }}>
                <Brain className="w-7 h-7" />
              </div>
              <h4 className="text-2xl font-bold mb-4">AI-Powered Insights</h4>
              <p className="leading-relaxed" style={{ color: '#E5E7EB' }}>
                Advanced algorithms interpret your chart with precision, 
                offering personalized guidance that adapts to your unique cosmic blueprint.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="backdrop-blur-sm p-8 rounded-2xl border transition-colors" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6" style={{
                background: 'linear-gradient(135deg, #1E3A8A 0%, #FBBF24 100%)'
              }}>
                <Target className="w-7 h-7" />
              </div>
              <h4 className="text-2xl font-bold mb-4">KP System Precision</h4>
              <p className="leading-relaxed" style={{ color: '#E5E7EB' }}>
                Krishnamurti Paddhati delivers pinpoint timing predictions. 
                Know exactly when opportunities and challenges will arrive.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="backdrop-blur-sm p-8 rounded-2xl border transition-colors" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6" style={{
                background: 'linear-gradient(135deg, #FBBF24 0%, #2D1B69 100%)'
              }}>
                <Clock className="w-7 h-7" />
              </div>
              <h4 className="text-2xl font-bold mb-4">Real-Time Transits</h4>
              <p className="leading-relaxed" style={{ color: '#E5E7EB' }}>
                Track planetary movements affecting you now. Get daily guidance 
                on the best times for decisions, actions, and rest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Your Cosmic Journey in 3 Steps
          </h3>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex items-start gap-6 group">
              <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform" style={{
                background: 'linear-gradient(135deg, #2D1B69 0%, #1E3A8A 100%)'
              }}>
                1
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-2">Enter Your Birth Details</h4>
                <p className="style={{ color: '#E5E7EB' }} text-lg">
                  Date, time, and place of birth — that's all we need to unlock your celestial blueprint.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-6 group">
              <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform" style={{
                background: 'linear-gradient(135deg, #1E3A8A 0%, #FBBF24 100%)'
              }}>
                2
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-2">Get Your Personalized Chart</h4>
                <p className="style={{ color: '#E5E7EB' }} text-lg">
                  Our AI analyzes your Vedic and KP charts instantly, revealing your strengths, challenges, and life path.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-6 group">
              <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform" style={{
                background: 'linear-gradient(135deg, #FBBF24 0%, #2D1B69 100%)'
              }}>
                3
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-2">Navigate Life with Clarity</h4>
                <p className="style={{ color: '#E5E7EB' }} text-lg">
                  Receive daily guidance, track transits, and make empowered decisions backed by ancient wisdom.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Placeholder */}
      <section className="px-6 py-20" style={{
        background: 'linear-gradient(to bottom, rgba(5, 8, 22, 0.5) 0%, #050816 100%)'
      }}>
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-12">
            Trusted by Seekers Worldwide
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="backdrop-blur-sm p-8 rounded-2xl border" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}>
              <div className="text-5xl font-bold mb-2" style={{ color: '#2D1B69' }}>5,000+</div>
              <p className="style={{ color: '#E5E7EB' }}">Charts Generated</p>
            </div>
            <div className="backdrop-blur-sm p-8 rounded-2xl border" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}>
              <div className="text-5xl font-bold mb-2" style={{ color: '#1E3A8A' }}>98%</div>
              <p className="style={{ color: '#E5E7EB' }}">Accuracy Rating</p>
            </div>
            <div className="backdrop-blur-sm p-8 rounded-2xl border" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}>
              <div className="text-5xl font-bold mb-2" style={{ color: '#FBBF24' }}>24/7</div>
              <p className="style={{ color: '#E5E7EB' }}">Instant Access</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Discover Your Cosmic Blueprint?
          </h3>
          <p className="text-xl style={{ color: '#E5E7EB' }} mb-8">
            Join thousands who've found clarity and direction through Bhava360.
          </p>
          <button
            onClick={() => navigate('/home')}
            className="group px-10 py-5 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-2xl flex items-center gap-3 mx-auto"
            style={{ background: 'linear-gradient(135deg, #2D1B69 0%, #1E3A8A 100%)' }}
          >
            Start Your Free Chart Now
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="mt-6 text-sm text-gray-400">
            No credit card required • Takes 2 minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t" style={{ 
        backgroundColor: '#050816',
        borderColor: 'rgba(255, 255, 255, 0.1)'
      }}>
        <div className="max-w-6xl mx-auto text-center" style={{ color: '#E5E7EB', opacity: 0.7 }}>
          <p className="mb-2">© 2026 Bhava360. All rights reserved.</p>
          <p className="text-sm">
            Ancient wisdom meets modern technology for your spiritual journey.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
