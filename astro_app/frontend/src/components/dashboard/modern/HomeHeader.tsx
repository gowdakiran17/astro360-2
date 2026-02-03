import React, { useState, useEffect } from 'react';
import { Share2, Download, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface HomeHeaderProps {
  userName: string;
  location?: string;
  date?: string;
  showActions?: boolean;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ userName, location = "New Delhi, IN", showActions = true }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Auspicious Morning";
    if (hour < 18) return "Blessed Afternoon";
    return "Harmonious Evening";
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-10 w-full relative z-10">
      {/* Cursor Aura Effect */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-[-1] hidden lg:block"
        animate={{
          background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(245, 158, 11, 0.05), transparent 80%)`
        }}
      />

      <div className="w-full relative group">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="px-5 py-2.5 bg-gradient-to-r from-amber-500/25 to-orange-500/10 border border-amber-500/30 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.3)] backdrop-blur-3xl relative overflow-hidden group/greeting">
            <div className="absolute inset-0 bg-amber-400/10 animate-pulse" />
            <p className="text-xs font-black text-amber-500 uppercase tracking-[0.4em] relative z-10 flex items-center gap-2">
              <Sparkles className="w-3 h-3 animate-spin-slow" />
              {getGreeting()}
            </p>
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 120 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-px bg-gradient-to-r from-amber-500/50 to-transparent"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-[7rem] font-black text-white mb-4 tracking-tighter uppercase leading-[0.85] relative">
            <span className="block text-white/90">Hello,</span>
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-amber-200 via-white to-orange-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]">
                {userName}
              </span>
              {/* Dynamic Underline */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.5, delay: 1 }}
                className="absolute -bottom-2 left-0 right-0 h-1 md:h-2 bg-gradient-to-r from-amber-500 to-transparent rounded-full origin-left"
              />
            </span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="flex flex-wrap items-center gap-6 md:gap-10 mt-10"
        >
          <div className="flex items-center gap-4 group/status">
            <div className="relative">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)]" />
              <div className="absolute inset-0 w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping opacity-70" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400 group-hover/status:text-emerald-300 transition-colors">
              Celestial Sync Active
            </span>
          </div>

          {location && (
            <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.08] px-6 py-3 rounded-2xl backdrop-blur-3xl text-white shadow-2xl group/loc hover:bg-white/[0.06] hover:border-amber-500/30 transition-all duration-700 font-bold overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-transparent opacity-0 group-hover/loc:opacity-100 transition-opacity" />
              <MapPin className="w-4.5 h-4.5 text-amber-500 group-hover/loc:scale-110 group-hover/loc:rotate-12 transition-all duration-500 relative z-10" />
              <div className="flex flex-col relative z-10">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 mb-0.5">Current Realm</span>
                <span className="text-xs font-black uppercase tracking-[0.15em]">{location}</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {showActions && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex gap-4 w-full md:w-auto self-end mb-2"
        >
          <button className="flex-1 md:flex-none flex items-center justify-center gap-4 px-10 py-5 bg-white/[0.05] border border-white/[0.15] rounded-[2rem] text-xs font-black text-white hover:bg-white/[0.1] hover:border-amber-500/40 transition-all duration-700 backdrop-blur-3xl uppercase tracking-[0.3em] group/act shadow-2xl">
            <Download className="w-5.5 h-5.5 text-amber-500 group-hover/act:-translate-y-1.5 transition-all duration-500" />
            <span className="whitespace-nowrap">Archive Insights</span>
          </button>

          <button className="flex-1 md:flex-none flex items-center justify-center gap-4 px-10 py-5 bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-[#050816] rounded-[2rem] text-xs font-black transition-all duration-700 shadow-[0_20px_40px_rgba(245,158,11,0.2)] border border-white/30 active:scale-95 uppercase tracking-[0.3em] group/act-s">
            <Share2 className="w-5.5 h-5.5 group-hover/act-s:rotate-[30deg] transition-all duration-700" />
            <span className="whitespace-nowrap">Unveil Share</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default HomeHeader;
