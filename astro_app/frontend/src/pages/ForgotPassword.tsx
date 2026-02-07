import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import api from '../services/api';
import { Mail, ChevronRight, ArrowLeft, Sparkles, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setError('');
    setIsSubmitting(true);
    
    try {
      // Assuming endpoint exists or mocking it for UI completeness
      // await api.post('auth/forgot-password', { email });
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSent(true);
    } catch (err: any) {
      setError('Failed to send reset link. Please try again.');
    } finally {
      setIsSubmitting(false);
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
        <div className="absolute top-20 left-10 opacity-20 animate-pulse" style={{ animationDuration: '6s' }}>
          <Star className="w-2 h-2 text-amber-200" />
        </div>
        <div className="absolute bottom-40 right-20 opacity-10 animate-pulse" style={{ animationDuration: '4s' }}>
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
          
          <div className="mb-8">
            <Link to="/login" className="inline-flex items-center text-stone-500 hover:text-amber-600 transition-colors mb-6 text-sm font-medium group">
              <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Login
            </Link>
            
            <div className="relative inline-flex items-center justify-center mb-6 block">
              <div className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full" />
              <div className="relative w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 rotate-6">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-stone-900 mb-2">Reset Password</h2>
            <p className="text-stone-500 text-sm font-medium">Enter your email to receive a reset link.</p>
          </div>

          {isSent ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-100 p-6 rounded-2xl text-center"
            >
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-green-800 font-bold mb-2">Check your inbox</h3>
              <p className="text-green-700 text-sm mb-4">
                We've sent a password reset link to <span className="font-semibold">{email}</span>
              </p>
              <button 
                onClick={() => setIsSent(false)}
                className="text-green-700 text-xs font-bold hover:text-green-800 underline uppercase tracking-wide"
              >
                Try another email
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {error}
                </div>
              )}

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
                    Send Reset Link <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>
          )}

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

export default ForgotPassword;
