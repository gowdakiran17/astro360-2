import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Sparkles, ChevronRight, Globe, Shield } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';

// Creative Assets
import zodiacWheel from '../assets/astrology/zodiac_wheel.png';
import celestialElements from '../assets/astrology/celestial_elements.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
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
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);

      const response = await api.post('auth/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      login(response.data.access_token);
      navigate('/home');
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 401) {
          setError('Invalid email or password. Please try again.');
        } else if (err.response.status >= 500) {
          setError('Server is starting up. Please wait a moment and try again.');
        } else {
          setError(err.response.data?.detail || 'Login failed. Please try again.');
        }
      } else {
        setError('Connection error. Please check your internet and try again.');
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
      setError('Google login failed. Please try again.');
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
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url(${zodiacWheel})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(2px)'
          }}
        />

        {/* Floating Celestial Elements (Left) */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-20 top-1/4 w-96 h-96 opacity-10 pointer-events-none blur-sm"
          style={{
            backgroundImage: `url(${celestialElements})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />

        {/* Floating Celestial Elements (Right) */}
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -right-20 bottom-1/4 w-96 h-96 opacity-10 pointer-events-none blur-sm"
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
        <div className="absolute inset-0 overflow-hidden" style={{ opacity: 0.6 }}>
          {Array.from({ length: 150 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: Math.random() }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{
                duration: 2 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
              className="absolute bg-white rounded-full"
              style={{
                width: Math.random() * 2 + 'px',
                height: Math.random() * 2 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                boxShadow: '0 0 5px rgba(255,255,255,0.8)'
              }}
            />
          ))}
        </div>
      </div>

      {/* --- LOGIN CONTENT --- */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Brand Identity */}
        <div className="text-center mb-10 group">
          <div className="inline-flex flex-col items-center">
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
          </div>
        </div>

        {/* --- GLASSMORPHISM LOGIN CARD --- */}
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-indigo-500/20 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />

          <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl overflow-hidden">
            {/* Subtle zodiac texture inside card */}
            <div
              className="absolute inset-0 opacity-[0.02] pointer-events-none"
              style={{
                backgroundImage: `url(${zodiacWheel})`,
                backgroundSize: '150%',
                backgroundPosition: 'center',
              }}
            />
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Bhava 360 Portal</h2>
              <p className="text-white/40 text-xs tracking-wide">Enter your details to access your dashboard.</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-200 text-sm"
              >
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-amber-500/80 ml-1">Email Address</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Mail className="h-5 w-5 text-white/20 group-focus-within/input:text-amber-500 transition-colors" />
                  </div>
                  <input
                    className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all font-medium text-sm"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-amber-500/80">Password</label>
                  <Link to="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">Forgot Password?</Link>
                </div>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Lock className="h-5 w-5 text-white/20 group-focus-within/input:text-amber-500 transition-colors" />
                  </div>
                  <input
                    className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all font-medium text-sm"
                    type="password"
                    placeholder="Enter your password"
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
                  <div className="w-5 h-5 border-2 border-[#02040A]/30 border-t-[#02040A] rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
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
                    <span className="px-4 bg-transparent text-white/20">Or sign in with</span>
                  </div>
                </div>

                <div className="flex justify-center group/google">
                  <div className="relative p-[1px] rounded-xl bg-gradient-to-tr from-white/10 to-transparent group-hover/google:from-amber-500/50 transition-all duration-500">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => {
                        setError('Google login failed. Please try again.');
                      }}
                      theme="filled_black"
                      shape="pill"
                      width="100%"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-6 text-center text-[10px] font-black uppercase tracking-widest text-white/30">
                Google sign-in unavailable. Set VITE_GOOGLE_CLIENT_ID.
              </div>
            )}

            <p className="mt-10 text-center text-[10px] font-black uppercase tracking-widest text-white/30">
              New here? <Link to="/register" className="text-amber-500 hover:text-white transition-colors ml-1">Create an account</Link>
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-6 text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
          <a href="#" className="hover:text-amber-500 transition-colors flex items-center gap-1.5"><Globe className="w-3 h-3" /> Status</a>
          <a href="#" className="hover:text-amber-500 transition-colors flex items-center gap-1.5"><Shield className="w-3 h-3" /> Privacy Policy</a>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
