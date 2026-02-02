import React from 'react';
import { Share2, Download, MapPin } from 'lucide-react';

interface HomeHeaderProps {
  userName: string;
  location?: string;
  date?: string;
  showActions?: boolean;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ userName, location = "New Delhi, IN", showActions = true }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-14 gap-8 w-full relative z-10">
      <div className="w-full">
        <div className="flex items-center gap-4 mb-4">
          <div className="px-4 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full shadow-lg backdrop-blur-md">
            <p className="text-xs font-black text-white uppercase tracking-[0.3em]">{getGreeting()}</p>
          </div>
          <div className="h-[1px] flex-1 md:w-32 md:flex-none bg-gradient-to-r from-yellow-500/40 to-transparent" />
        </div>
        <h1 className="text-4xl md:text-8xl font-black text-white mb-3 tracking-tighter uppercase leading-[0.95]">
          Hello, <span className="text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 via-white to-orange-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.4)]">{userName}</span>
        </h1>
        <div className="flex flex-wrap items-center gap-4 md:gap-8 mt-6">
          <span className="flex items-center gap-3 px-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]"></span>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400/90 whitespace-nowrap">Celestial Alignment Active</span>
          </span>
          {location && (
            <span className="flex items-center gap-3 bg-white/[0.05] border border-white/[0.1] px-5 py-2.5 rounded-full backdrop-blur-3xl text-white shadow-2xl group/loc hover:bg-white/[0.08] transition-all duration-500 font-bold">
              <MapPin className="w-3.5 h-3.5 text-yellow-500 group-hover/loc:scale-110 transition-transform" />
              <span className="text-xs font-black uppercase tracking-[0.1em]">{location}</span>
            </span>
          )}
        </div>
      </div>

      {showActions && (
        <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 md:px-8 py-4 bg-white/[0.05] border border-white/[0.1] rounded-[1.5rem] text-xs font-black text-white hover:bg-white/[0.1] hover:text-white transition-all duration-500 backdrop-blur-3xl uppercase tracking-[0.2em] group/act">
            <Download className="w-4 h-4 text-yellow-500 group-hover/act:-translate-y-1 transition-transform" />
            <span className="whitespace-nowrap">Export</span>
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 md:px-8 py-4 bg-gradient-to-br from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-black rounded-[1.5rem] text-sm font-black transition-all duration-500 shadow-2xl shadow-yellow-500/20 border border-white/20 active:scale-95 uppercase tracking-[0.2em] group/act-s">
            <Share2 className="w-4 h-4 group-hover/act-s:rotate-12 transition-transform" />
            <span className="whitespace-nowrap">Universal Share</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeHeader;
