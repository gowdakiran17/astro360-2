import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Eye, EyeOff, Sparkles, Star } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen flex items-center justify-center bg-[#0C0A09] relative overflow-hidden px-4 font-sans">
      
      {/* --- BACKGROUND ATMOSPHERE --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Soft Warm Radial Glow */}
        <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(251,191,36,0.08)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(220,38,38,0.05)_0%,transparent_70%)] blur-3xl" />
        
        {/* Subtle Star Dust / Grain */}
        <div className="absolute inset-0 opacity-[0.07]" style={{ filter: 'url(#noise)' }} />
        
        {/* Abstract Constellation Hints */}
        <div className="absolute top-20 left-10 opacity-20 animate-pulse" style={{ animationDuration: '4s' }}>
          <Star className="w-2 h-2 text-amber-200" />
        </div>
        <div className="absolute bottom-40 right-20 opacity-10 animate-pulse" style={{ animationDuration: '6s' }}>
          <Star className="w-3 h-3 text-amber-100" />
        </div>
      </div>

      {/* --- MAIN CARD --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[420px] bg-[#FAFAF9] rounded-3xl shadow-2xl shadow-black/50 relative z-10 overflow-hidden"
      >
        <div className="p-8 md:p-10">
          
          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full" />
              <div className="relative w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 rotate-3">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-stone-900 mb-2">Welcome Back</h1>
            <p className="text-stone-500 text-sm font-medium leading-relaxed">
              Your personal astrology space,<br/>guided by intelligence
            </p>
          </div>

          {/* ERROR STATE */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-medium"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </motion.div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wide ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-stone-400 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <input
                  className="w-full h-12 bg-white border border-stone-200 rounded-xl pl-11 pr-4 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wide ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-stone-400 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <input
                  className="w-full h-12 bg-white border border-stone-200 rounded-xl pl-11 pr-12 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 inset-y-0 pr-4 flex items-center text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link 
                to="/forgot-password" 
                className="text-xs font-semibold text-stone-500 hover:text-amber-600 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold tracking-wide rounded-xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2 text-sm"
              type="submit"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          {/* DIVIDER */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-[#FAFAF9] text-stone-400 text-xs font-medium uppercase">Or</span>
            </div>
          </div>

          {/* SOCIAL LOGIN */}
          <div className="space-y-3">
            {isGoogleEnabled ? (
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google login failed.')}
                  theme="outline"
                  shape="pill"
                  width="100%"
                  text="signin_with"
                  size="large"
                />
              </div>
            ) : (
              <button disabled className="w-full h-11 border border-stone-200 bg-white text-stone-400 rounded-full flex items-center justify-center gap-2 text-sm font-medium cursor-not-allowed opacity-60">
                <span className="w-4 h-4 rounded-full bg-stone-300" /> Google Login Unavailable
              </button>
            )}
            
            {/* Optional Birth Details Link */}
            {/* 
            <button className="w-full h-11 border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 rounded-full flex items-center justify-center gap-2 text-sm font-medium transition-colors">
              <Moon className="w-4 h-4" /> Login using Birth Details
            </button> 
            */}
          </div>

          {/* FOOTER */}
          <p className="mt-8 text-center text-stone-500 text-sm">
            New here?{' '}
            <Link to="/register" className="text-amber-600 hover:text-amber-700 font-bold transition-colors">
              Create an account
            </Link>
          </p>

        </div>
        
        {/* Bottom Decorative Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-red-500 to-amber-500" />
      </motion.div>

      {/* SVG Filters for Texture */}
      <svg className="hidden">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
      </svg>

    </div>
  );
};

export default Login;
