import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Lock, Mail, Sparkles, ChevronRight, Globe, Shield } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

// Creative Assets
import zodiacWheel from '../assets/astrology/zodiac_wheel.png';
import celestialElements from '../assets/astrology/celestial_elements.png';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isGoogleEnabled = !!googleClientId && googleClientId !== 'YOUR_GOOGLE_CLIENT_ID_HERE';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await api.post('auth/register', { email, password });
      // After registration, redirect to login or automatically log them in
      navigate('/login');
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data?.detail || 'Registration failed. This email might already be in use.');
      } else {
        setError('Connection error. Please check your internet.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await api.post('auth/google', {
        credential: credentialResponse.credential
      });
      login(response.data.access_token);
      navigate('/home');
    } catch (err) {
      setError('Google sign up failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#02040A]">
      {/* --- PREMIUM CELESTIAL BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        {/* Deep Space Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0B0E25_0%,#02040A_100%)]" />

        {/* Subtle Rotating Zodiac Wheel */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `url(${zodiacWheel})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(3px)'
          }}
        />

        {/* Floating Creative Asset (Registration Special) */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-40 -top-20 w-[600px] h-[600px] opacity-[0.15] pointer-events-none blur-sm"
          style={{
            backgroundImage: `url(${celestialElements})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />

        {/* Animated Nebulae */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-500/10 blur-[150px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-purple-500/10 blur-[150px] rounded-full"
        />

        {/* Twinkling Stars */}
        <div className="absolute inset-0 overflow-hidden" style={{ opacity: 0.5 }}>
          {Array.from({ length: 120 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: Math.random() }}
              animate={{ opacity: [0.1, 1, 0.1] }}
              transition={{
                duration: 3 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
              className="absolute bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              style={{
                width: Math.random() * 1.5 + 'px',
                height: Math.random() * 1.5 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
            />
          ))}
        </div>
      </div>

      {/* --- REGISTRATION CONTENT --- */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Brand Header */}
        <div className="text-center mb-10 group">
          <Link to="/login" className="inline-flex flex-col items-center">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 1 }}
              className="relative mb-4"
            >
              <div className="absolute inset-0 bg-amber-500/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center border border-white/20 relative z-10 shadow-2xl">
                <Sparkles className="w-8 h-8 text-[#02040A]" />
              </div>
            </motion.div>
            <h1 className="flex flex-col items-center">
              <span className="text-[14px] font-black tracking-[0.5em] text-amber-500 uppercase leading-none mb-2 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">Bhava</span>
              <span className="text-5xl font-black tracking-tighter text-white uppercase leading-none drop-shadow-2xl">360</span>
            </h1>
            <p className="mt-4 text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Your Astrology Hub</p>
          </Link>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-lg">
            <div>
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-1">Begin Your Journey</h2>
                <p className="text-white/30 text-xs">Unlock personalized insights from the stars.</p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-200 text-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-amber-500/80 ml-1">Email Address</label>
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400 group-focus-within/input:text-blue-400 transition-colors" />
                    </div>
                    <input
                      className="w-full h-14 bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/40 transition-all font-medium text-sm"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-amber-500/80 ml-1">Secure Password</label>
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400 group-focus-within/input:text-blue-400 transition-colors" />
                    </div>
                    <input
                      className="w-full h-14 bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/40 transition-all font-medium text-sm"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-14 bg-gradient-to-tr from-amber-500 to-orange-600 text-[#02040A] font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-[0_10px_30px_rgba(245,158,11,0.2)] hover:shadow-[0_15px_40px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-3 mt-8"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>

              {isGoogleEnabled ? (
                <>
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/5"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                      <span className="px-4 bg-transparent text-white/20">Or sign up with</span>
                    </div>
                  </div>

                  <div className="flex justify-center group/google">
                    <div className="relative p-[1px] rounded-xl bg-gradient-to-tr from-white/10 to-transparent group-hover/google:from-amber-500/50 transition-all duration-500">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google sign up failed.')}
                        theme="filled_black"
                        shape="pill"
                        width="100%"
                        text="signup_with"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-6 text-center text-[10px] font-black uppercase tracking-widest text-white/30">
                  Google sign-up unavailable. Set VITE_GOOGLE_CLIENT_ID.
                </div>
              )}

              <p className="mt-10 text-center text-[10px] font-black uppercase tracking-widest text-white/30">
                Already registered? <Link to="/login" className="text-amber-500 hover:text-white transition-colors ml-1 underline underline-offset-4">Sign In Now</Link>
              </p>
            </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 flex justify-center gap-6 text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
          <a href="#" className="hover:text-amber-500 transition-colors flex items-center gap-1.5"><Globe className="w-3 h-3" /> Status</a>
          <a href="#" className="hover:text-amber-500 transition-colors flex items-center gap-1.5"><Shield className="w-3 h-3" /> Privacy Policy</a>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
