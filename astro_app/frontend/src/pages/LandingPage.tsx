import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Target, Clock, Brain, ArrowRight, Star } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  
  console.log('🔮 LandingPage component loaded!');

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-900 text-white">
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
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-purple-400">
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
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            AI-powered Vedic & KP astrology for precise life guidance. 
            Get personalized insights backed by 5,000 years of celestial wisdom.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/home')}
              className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-semibold text-lg hover:scale-105 transition-transform shadow-lg hover:shadow-purple-500/50 flex items-center gap-2"
            >
              Get Your Free Chart
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/home')}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-full font-semibold text-lg hover:bg-white/20 transition-colors border border-white/20"
            >
              Explore Features
            </button>
          </div>

          {/* Trust Badge */}
          <p className="mt-8 text-sm text-gray-400 flex items-center justify-center gap-2">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            Trusted by seekers worldwide
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Bhava360?
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-colors">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-6">
                <Brain className="w-7 h-7" />
              </div>
              <h4 className="text-2xl font-bold mb-4">AI-Powered Insights</h4>
              <p className="text-gray-300 leading-relaxed">
                Advanced algorithms interpret your chart with precision, 
                offering personalized guidance that adapts to your unique cosmic blueprint.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-colors">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-6">
                <Target className="w-7 h-7" />
              </div>
              <h4 className="text-2xl font-bold mb-4">KP System Precision</h4>
              <p className="text-gray-300 leading-relaxed">
                Krishnamurti Paddhati delivers pinpoint timing predictions. 
                Know exactly when opportunities and challenges will arrive.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-colors">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center mb-6">
                <Clock className="w-7 h-7" />
              </div>
              <h4 className="text-2xl font-bold mb-4">Real-Time Transits</h4>
              <p className="text-gray-300 leading-relaxed">
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
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                1
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-2">Enter Your Birth Details</h4>
                <p className="text-gray-300 text-lg">
                  Date, time, and place of birth — that's all we need to unlock your celestial blueprint.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-6 group">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                2
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-2">Get Your Personalized Chart</h4>
                <p className="text-gray-300 text-lg">
                  Our AI analyzes your Vedic and KP charts instantly, revealing your strengths, challenges, and life path.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-6 group">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                3
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-2">Navigate Life with Clarity</h4>
                <p className="text-gray-300 text-lg">
                  Receive daily guidance, track transits, and make empowered decisions backed by ancient wisdom.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Placeholder */}
      <section className="px-6 py-20 bg-gradient-to-b from-slate-900/50 to-slate-900">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-12">
            Trusted by Seekers Worldwide
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
              <div className="text-5xl font-bold text-purple-400 mb-2">5,000+</div>
              <p className="text-gray-300">Charts Generated</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
              <div className="text-5xl font-bold text-blue-400 mb-2">98%</div>
              <p className="text-gray-300">Accuracy Rating</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
              <div className="text-5xl font-bold text-cyan-400 mb-2">24/7</div>
              <p className="text-gray-300">Instant Access</p>
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
          <p className="text-xl text-gray-300 mb-8">
            Join thousands who've found clarity and direction through Bhava360.
          </p>
          <button
            onClick={() => navigate('/home')}
            className="group px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-2xl hover:shadow-purple-500/50 flex items-center gap-3 mx-auto"
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
      <footer className="px-6 py-12 bg-slate-950 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
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
