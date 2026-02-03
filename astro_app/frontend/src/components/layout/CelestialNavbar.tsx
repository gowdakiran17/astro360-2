import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home, Star, Sparkles, Zap, User,
    Bell, LayoutGrid, LogOut, BrainCircuit,
    ShieldCheck, HelpCircle, ChevronRight,
    Crown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChartSettings } from '../../context/ChartContext';

interface NavItem {
    id: string;
    label: string;
    icon: any;
    path: string;
    isCenter?: boolean;
}

const ITEMS: NavItem[] = [
    { id: 'home', label: 'Sky', icon: Home, path: '/home' },
    { id: 'charts', label: 'Stars', icon: Star, path: '/my-charts' },
    { id: 'ai', label: 'Divine AI', icon: Sparkles, path: '/ai-astrologer', isCenter: true },
    { id: 'kp', label: 'Nadi', icon: Zap, path: '/kp/dashboard' },
    { id: 'cosmic', label: 'Cosmic', icon: BrainCircuit, path: '/ai-astrologer' }, // Replaced Soul with Cosmic
];

const CelestialNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { toggleChartStyle } = useChartSettings();

    const [isScrolled, setIsScrolled] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path: string) => {
        if (path === '/home') return location.pathname === '/home';
        return location.pathname.startsWith(path);
    };

    const userEmail = user?.email || 'Astro Soul';
    const userInitial = userEmail.charAt(0).toUpperCase();
    const userName = userEmail.split('@')[0];

    return (
        <>
            {/* --- DESKTOP TOP NAVIGATION --- */}
            <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 hidden md:block px-6 py-4`}>
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className={`mx-auto max-w-7xl h-20 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl flex items-center justify-between px-10 transition-all duration-500 ${isScrolled ? 'bg-[#0A0D1E]/90 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] scale-[0.98]' : 'bg-white/[0.03] scale-100'
                        }`}
                >
                    {/* Logo Section */}
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => navigate('/home')}
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-amber-500 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-700" />
                            <div className="relative flex flex-col items-center">
                                <span className="text-[10px] font-black tracking-[0.4em] text-amber-500 uppercase leading-none mb-1">Astro</span>
                                <span className="text-2xl font-black tracking-tighter text-white uppercase leading-none">360</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Navigation Links */}
                    <nav className="flex items-center gap-2 bg-white/5 p-1.5 rounded-[2rem] border border-white/5">
                        {ITEMS.map((item) => {
                            const active = isActive(item.path);
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => navigate(item.path)}
                                    className={`relative px-6 py-2.5 rounded-[1.5rem] transition-all duration-500 group ${active ? 'text-white' : 'text-white/40 hover:text-white'
                                        }`}
                                >
                                    {active && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-orange-500/10 rounded-[1.5rem] border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
                                        />
                                    )}
                                    <div className="relative flex items-center gap-2.5">
                                        <item.icon className={`w-4.5 h-4.5 transition-all duration-700 ${active ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'text-current group-hover:scale-110'}`} />
                                        <span className="text-xs font-black uppercase tracking-[0.2em]">{item.label}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Soul Portal - Right Side */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleChartStyle}
                                className="p-3 text-white/40 hover:text-amber-400 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10 group"
                            >
                                <LayoutGrid className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                            </button>

                            <button className="p-3 text-white/40 hover:text-amber-400 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10 relative group">
                                <Bell className="w-5 h-5 group-hover:shake transition-all" />
                                <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0A0D1E] animate-pulse" />
                            </button>
                        </div>

                        {/* HIGH-END SOUL PORTAL */}
                        <div
                            className="relative group/portal"
                            onMouseEnter={() => setIsProfileOpen(true)}
                            onMouseLeave={() => setIsProfileOpen(false)}
                        >
                            <button className="h-14 px-5 rounded-[2rem] bg-gradient-to-br from-white/5 to-white/[0.01] border border-white/10 flex items-center gap-4 hover:border-amber-500/30 transition-all duration-500 shadow-xl group/btn">
                                <div className="relative">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-[#050816] font-black text-sm relative z-10 shadow-lg group-hover/btn:scale-110 transition-transform duration-500">
                                        {userInitial}
                                    </div>
                                    <div className="absolute -inset-1.5 border border-amber-500/20 rounded-full animate-spin-slow opacity-0 group-hover/portal:opacity-100 transition-opacity" />
                                    <div className="absolute -inset-1 border border-amber-500/40 rounded-full scale-110 blur-sm opacity-0 group-hover/portal:opacity-50 transition-opacity" />
                                </div>
                                <div className="text-left">
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs font-black text-white leading-none tracking-tight">{userName}</p>
                                        <Crown className="w-3 h-3 text-amber-500" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/80 mt-1">Soul Portal</p>
                                </div>
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full right-0 mt-4 w-72 bg-[#0A0D1E]/95 backdrop-blur-3xl border border-white/10 p-3 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] z-[110]"
                                    >
                                        <div className="p-4 mb-2 bg-white/5 rounded-[1.5rem] border border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                                    <Crown className="w-6 h-6 text-amber-500" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black uppercase tracking-widest text-amber-500">Celestial Tier</p>
                                                    <p className="text-sm font-bold text-white">Premium Oracle</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            {[
                                                { label: 'My Cosmic Profile', icon: User, path: '/account/profile' },
                                                { label: 'Intelligence Hub', icon: BrainCircuit, path: '/ai-astrologer' },
                                                { label: 'Divine Protection', icon: ShieldCheck, path: '/security' },
                                                { label: 'Celestial Support', icon: HelpCircle, path: '/support' },
                                            ].map((link, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => navigate(link.path)}
                                                    className="w-full flex items-center justify-between p-3.5 text-white/50 hover:text-white hover:bg-white/[0.04] rounded-2xl transition-all group/link"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <link.icon className="w-5 h-5 group-hover/link:text-amber-400 transition-colors" />
                                                        <span className="text-xs font-black uppercase tracking-widest">{link.label}</span>
                                                    </div>
                                                    <ChevronRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all" />
                                                </button>
                                            ))}
                                        </div>

                                        <div className="h-px bg-white/10 my-2 mx-4" />

                                        <button
                                            onClick={() => logout()}
                                            className="w-full flex items-center gap-3 p-4 text-rose-400 hover:text-white hover:bg-rose-500/10 rounded-2xl transition-all group/exit"
                                        >
                                            <LogOut className="w-4 h-4 group-hover/exit:-translate-x-1 transition-transform" />
                                            <span className="text-xs font-black uppercase tracking-[0.2em]">Dissolve Connection</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </header>

            {/* --- MOBILE BOTTOM NAVIGATION --- */}
            <nav className="md:hidden fixed bottom-8 left-6 right-6 h-20 z-[100]">
                <div className="relative w-full h-full bg-[#0A0D1E]/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex items-center justify-around px-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                    {ITEMS.map((item) => {
                        const active = isActive(item.path);

                        if (item.isCenter) {
                            return (
                                <div key={item.id} className="relative -top-10 px-2 group">
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => navigate(item.path)}
                                        className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-600 text-[#050816] rounded-full flex items-center justify-center shadow-[0_-5px_20px_rgba(251,191,36,0.4)] border-4 border-[#0A0D1E] relative z-10"
                                    >
                                        <item.icon className="w-7 h-7" />
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="absolute inset-0 bg-white/20 rounded-full"
                                        />
                                    </motion.button>
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-500 text-center mt-2">Divine AI</p>
                                </div>
                            );
                        }

                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.path)}
                                className={`flex flex-col items-center gap-1.5 relative py-2 transition-all duration-500 ${active ? 'text-amber-400 scale-110' : 'text-white/30'
                                    }`}
                            >
                                {active && (
                                    <motion.div
                                        layoutId="mobileActive"
                                        className="absolute -top-2 w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_12px_#F59E0B]"
                                        transition={{ type: "spring", bounce: 0.4 }}
                                    />
                                )}
                                <item.icon className="w-5.5 h-5.5 transition-transform duration-500" />
                                <span className="text-[10px] font-black uppercase tracking-[0.1em]">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </>
    );
};

export default CelestialNavbar;
