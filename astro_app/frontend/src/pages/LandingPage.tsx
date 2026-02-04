import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Target, Clock, Brain, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  console.log('🔮 LandingPage component loaded!');

  return (
    <div className="min-h-screen text-white bg-[#050816] font-sans selection:bg-amber-500/30">
      {/* Hero Section */}
      <section className="relative px-6 py-24 md:py-36 overflow-hidden">
        {/* Celestial Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Stars */}
          {[...Array(60)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: Math.random() * 0.5, scale: Math.random() * 0.5 + 0.5 }}
              animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.2, 1] }}
              transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 5 }}
              className="absolute w-0.5 h-0.5 bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}

          {/* Nebulae Glows */}
          <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-purple-900/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[5%] right-[-5%] w-[50%] h-[50%] bg-amber-900/10 blur-[100px] rounded-full" />
        </div>

        <div className="relative max-w-6xl mx-auto text-center z-10">
          {/* Brand Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500/5 border border-amber-500/10 backdrop-blur-md mb-12"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-black tracking-[0.4em] text-amber-400 uppercase">Celestial Odyssey Awaits</span>
          </motion.div>

          {/* Logo/Brand */}
          <div className="flex items-center justify-center mb-6 gap-3">
            <div className="relative">
              <Star className="w-10 h-10 text-amber-500 fill-amber-500/20" />
              <div className="absolute inset-0 bg-amber-500 blur-md opacity-30 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
              Bhava<span className="text-amber-500">360</span>
            </h1>
          </div>

          {/* Main Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter"
          >
            Ancient Wisdom,
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500">
              Modern Precision
            </span>
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-2xl mb-12 max-w-2xl mx-auto text-white/60 font-medium leading-relaxed"
          >
            AI-powered Vedic & KP astrology for precise life guidance.
            Get personalized insights backed by 5,000 years of celestial wisdom.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <button
              onClick={() => navigate('/login')}
              className="group relative px-10 py-5 bg-gradient-to-br from-amber-400 to-orange-600 text-[#050816] rounded-2xl font-black text-lg shadow-[0_20px_40px_rgba(245,158,11,0.2)] hover:shadow-[0_25px_50px_rgba(245,158,11,0.3)] transition-all flex items-center gap-3 overflow-hidden active:scale-95"
            >
              <span className="relative z-10">Get Your Free Chart</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-10 py-5 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl font-black text-lg text-white hover:bg-white/10 hover:border-amber-500/30 transition-all active:scale-95 uppercase tracking-widest text-sm"
            >
              Explore Features
            </button>
          </motion.div>

          {/* Trust Badge */}
          <div className="mt-16 text-xs font-black tracking-[0.3em] text-white/30 uppercase flex items-center justify-center gap-4">
            <div className="h-px w-8 bg-white/10" />
            <span className="flex items-center gap-2">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500/20" />
              Trusted by 10,000+ astral seekers
            </span>
            <div className="h-px w-8 bg-white/10" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-32 relative">
        <div className="absolute inset-0 bg-white/[0.02] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20 space-y-4">
            <div className="text-amber-500 text-xs font-black tracking-[0.5em] uppercase">The Intelligence</div>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter">
              Advanced Astrological Modules
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Feature 1 */}
            <div className="group p-10 rounded-[2.5rem] bg-[#0A0E1F]/60 backdrop-blur-3xl border border-white/5 hover:border-amber-500/30 transition-all duration-500 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[80px] rounded-full group-hover:bg-amber-500/10 transition-all" />
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-900 to-black border border-white/10 flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-700">
                <Brain className="w-8 h-8 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
              </div>
              <h4 className="text-2xl font-bold mb-4 tracking-tight group-hover:text-amber-400 transition-colors">AI-Powered Insights</h4>
              <p className="text-white/60 font-medium leading-relaxed">
                Advanced algorithms interpret your chart with precision,
                offering personalized guidance that adapts to your unique cosmic blueprint.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-10 rounded-[2.5rem] bg-[#0A0E1F]/60 backdrop-blur-3xl border border-white/5 hover:border-amber-500/30 transition-all duration-500 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[80px] rounded-full group-hover:bg-amber-500/10 transition-all" />
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-900 to-black border border-white/10 flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-700">
                <Target className="w-8 h-8 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
              </div>
              <h4 className="text-2xl font-bold mb-4 tracking-tight group-hover:text-amber-400 transition-colors">KP System Precision</h4>
              <p className="text-white/60 font-medium leading-relaxed">
                Krishnamurti Paddhati delivers pinpoint timing predictions.
                Know exactly when opportunities and challenges will arrive.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-10 rounded-[2.5rem] bg-[#0A0E1F]/60 backdrop-blur-3xl border border-white/5 hover:border-amber-500/30 transition-all duration-500 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[80px] rounded-full group-hover:bg-amber-500/10 transition-all" />
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-900 to-black border border-white/10 flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-700">
                <Clock className="w-8 h-8 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
              </div>
              <h4 className="text-2xl font-bold mb-4 tracking-tight group-hover:text-amber-400 transition-colors">Real-Time Transits</h4>
              <p className="text-white/60 font-medium leading-relaxed">
                Track planetary movements affecting you now. Get daily guidance
                on the best times for decisions, actions, and rest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Path Steps */}
      <section className="px-6 py-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <div className="text-amber-500 text-xs font-black tracking-[0.5em] uppercase">The Journey</div>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter">Your Path in 3 Steps</h3>
          </div>

          <div className="space-y-12">
            {[
              { step: 1, title: 'Enter Birth Details', desc: 'Date, time, and place of birth — the key to your celestial blueprint.' },
              { step: 2, title: 'AI Analysis', desc: 'Our VedaAI interprets your KP charts instantly, revealing your life path.' },
              { step: 3, title: 'Navigate with Clarity', desc: 'Receive daily guidance and make empowered decisions with wisdom.' }
            ].map((item) => (
              <div key={item.step} className="group flex items-start gap-10 p-8 rounded-[2rem] hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-amber-500 font-black text-2xl text-[#050816] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                  {item.step}
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-bold tracking-tight text-white/90">{item.title}</h4>
                  <p className="text-xl text-white/40 font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-6 py-32 bg-amber-500/[0.02] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="space-y-2">
              <div className="text-5xl font-black text-amber-500 tracking-tighter">10,000+</div>
              <p className="text-xs font-black tracking-[0.3em] text-white/40 uppercase">Souls Guided</p>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-black text-white tracking-tighter">98.4%</div>
              <p className="text-xs font-black tracking-[0.3em] text-white/40 uppercase">Prediction Accuracy</p>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-black text-amber-500 tracking-tighter">24/7</div>
              <p className="text-xs font-black tracking-[0.3em] text-white/40 uppercase">Celestial Access</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-40 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-12">
          <h3 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
            Ready to Discover Your <span className="text-amber-500">Cosmic Blueprint?</span>
          </h3>
          <p className="text-xl md:text-2xl text-white/60 font-medium max-w-2xl mx-auto">
            Join thousands who have found clarity and direction through the power of Bhava360.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="group relative px-12 py-6 bg-gradient-to-br from-amber-400 to-orange-600 text-[#050816] rounded-2xl font-black text-2xl shadow-[0_25px_50px_rgba(245,158,11,0.25)] hover:shadow-[0_30px_60px_rgba(245,158,11,0.35)] transition-all flex items-center gap-4 mx-auto overflow-hidden active:scale-95"
          >
            <span className="relative z-10">Start Your Free Chart</span>
            <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>
          <div className="text-xs font-black tracking-[0.4em] text-white/20 uppercase">
            No Credit Card Required • Authentic Results
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-20 border-t border-white/5 bg-[#050816]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-4">
            <Star className="w-8 h-8 text-amber-500 fill-amber-500/20" />
            <div className="text-left">
              <h4 className="text-xl font-black tracking-tight text-white leading-none">Bhava360</h4>
              <p className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase mt-1">Celestial Oracle</p>
            </div>
          </div>

          <div className="text-[10px] font-black tracking-[0.3em] text-white/20 uppercase text-center md:text-right">
            © 2026 Bhava360. All Rights Reserved.
            <div className="mt-2 text-white/10">Ancient Wisdom • Spiritual Technology</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
