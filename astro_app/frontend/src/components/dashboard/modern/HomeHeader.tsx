import React from 'react';
import { Share2, Download, MapPin } from 'lucide-react';

interface HomeHeaderProps {
  userName: string;
  location?: string;
  date?: string;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ userName, location = "New Delhi, IN" }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-6 w-full">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em]">{getGreeting()}</p>
          </div>
          <div className="h-[1px] w-12 bg-emerald-500/20" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
          Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-indigo-400 to-purple-400">{userName}</span>
        </h1>
        <div className="flex items-center text-slate-500 text-sm gap-5">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_theme(colors.emerald.500)]"></span>
            <span className="font-medium tracking-wide">Cosmic Alignment Active</span>
          </span>
          {location && (
            <span className="flex items-center gap-2 text-xs bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md text-slate-300 font-bold shadow-2xl">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {location}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900/60 border border-white/10 rounded-2xl text-xs font-black text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all backdrop-blur-xl uppercase tracking-widest">
          <Download className="w-4 h-4 text-emerald-400" />
          Export
        </button>
        <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black transition-all shadow-xl shadow-emerald-500/20 border border-emerald-400/30 active:scale-95 uppercase tracking-widest">
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>
    </div>
  );
};

export default HomeHeader;
