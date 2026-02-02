import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, LogOut, Home, Star, Sparkles, Zap, ChevronLeft } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: string[];
  showHeader?: boolean;
  disableContentPadding?: boolean;
  theme?: 'default' | 'cosmic';
}

const MainLayout = ({ children, title, showHeader = true, disableContentPadding = false }: MainLayoutProps) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Update document title
  useEffect(() => {
    if (title) {
      document.title = `${title} | Astro360`;
    }
  }, [title]);

  const bgClass = 'bg-[#050816]';
  const headerClass = 'bg-transparent text-white border-b border-white/5 backdrop-blur-md';

  const isHubPage = location.pathname === '/home';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bgClass} selection:bg-amber-500/30`}>
      <div className="flex flex-col min-h-screen transition-all duration-300 relative overflow-hidden">
        {/* Sky Background Overlays */}
        <div className="fixed inset-0 pointer-events-none opacity-40">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-900/10 blur-[100px] rounded-full" />
        </div>

        <div className="sticky top-0 z-30">
          {showHeader && (
            <>
              <header className={`h-16 md:h-20 flex items-center justify-between px-6 md:px-12 transition-colors duration-300 ${headerClass}`} >
                <div className="flex items-center gap-4">
                  {!isHubPage && (
                    <button
                      onClick={() => navigate('/home')}
                      className="p-2 -ml-2 text-white/40 hover:text-amber-500 transition-colors group"
                      title="Back to Hub"
                    >
                      <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                    </button>
                  )}
                  <div className="flex flex-col cursor-pointer" onClick={() => navigate('/home')}>
                    <span className="text-xs font-black tracking-[0.4em] text-amber-500 uppercase leading-none mb-1">Astro</span>
                    <div className="text-2xl font-black tracking-tighter text-white uppercase leading-none">
                      360
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 md:gap-8">
                  <div className="hidden md:flex items-center gap-1.5 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 text-[10px] font-black tracking-widest uppercase text-amber-500/80">
                    <Sparkles className="w-3 h-3" />
                    Premium Oracle
                  </div>

                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-[#050816] text-sm font-black shadow-lg shadow-amber-500/20 border border-amber-400/50">
                    {user?.email?.charAt(0).toUpperCase() || 'S'}
                  </div>
                  <button onClick={() => logout()} className="p-2 text-white/60 hover:text-amber-500 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </header>

              {/* Celestial Accent Line */}
              {!isHubPage && (
                <div className="h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
              )}
            </>
          )}
        </div>

        <main className={`flex-1 relative z-10 ${disableContentPadding ? '' : 'p-6 md:p-12'} text-white pb-32`} >
          {children}
        </main>

        {/* Celestial Bottom Navigation Bar - Mobile First */}
        <nav className="md:hidden fixed bottom-6 left-6 right-6 h-16 bg-[#0A0D1E]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] flex items-center justify-around px-6 z-50 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
          <button
            id="nav-hub"
            onClick={() => navigate('/home')}
            className={`flex flex-col items-center gap-1 relative group transition-all duration-300 ${location.pathname === '/home' ? 'text-amber-500' : 'text-white/40'}`}
          >
            {location.pathname === '/home' && (
              <div className="absolute -top-1 w-1 h-1 bg-amber-500 rounded-full shadow-[0_0_10px_#F59E0B]" />
            )}
            <Home className={`w-5 h-5 transition-transform duration-300 ${location.pathname === '/home' ? 'scale-110 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]' : ''}`} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Sky</span>
          </button>

          <button
            onClick={() => {
              if (window.location.pathname !== '/home') {
                navigate('/home');
                setTimeout(() => {
                  document.getElementById('charts-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              } else {
                document.getElementById('charts-section')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className={`flex flex-col items-center gap-1 relative transition-all duration-300 ${location.pathname === '/my-charts' ? 'text-amber-500' : 'text-white/40'}`}
          >
            <Star className={`w-5 h-5 transition-transform duration-300 ${location.pathname === '/my-charts' ? 'scale-110 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]' : ''}`} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Stars</span>
          </button>

          <div className="relative -top-8 px-2">
            <button
              onClick={() => navigate('/ai-astrologer')}
              className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 text-[#050816] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.3)] border-4 border-[#0A0D1E] transition-all active:scale-90 group"
            >
              <Sparkles className="w-7 h-7 group-hover:rotate-12 transition-transform duration-500" />
            </button>
          </div>

          <button
            id="nav-kp"
            onClick={() => navigate('/kp/dashboard')}
            className={`flex flex-col items-center gap-1 relative transition-all duration-300 ${location.pathname.startsWith('/kp') ? 'text-amber-500' : 'text-white/40'}`}
          >
            <Zap className={`w-5 h-5 transition-transform duration-300 ${location.pathname.startsWith('/kp') ? 'scale-110 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]' : ''}`} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Nadi</span>
          </button>

          <button
            onClick={() => navigate('/account/profile')}
            className={`flex flex-col items-center gap-1 relative transition-all duration-300 ${location.pathname === '/account/profile' ? 'text-amber-500' : 'text-white/40'}`}
          >
            <User className={`w-5 h-5 transition-transform duration-300 ${location.pathname === '/account/profile' ? 'scale-110 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]' : ''}`} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Soul</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default MainLayout;
