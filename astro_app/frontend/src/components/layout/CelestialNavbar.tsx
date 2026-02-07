import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home, Sparkles, Zap, User,
    Bell, LayoutGrid, LogOut, BrainCircuit,
    ShieldCheck, HelpCircle, ChevronRight,
    Crown, Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChartSettings } from '../../context/ChartContext';
import BrandLogo from './BrandLogo';
import CalculationSettings from '../settings/CalculationSettings';

interface NavItem {
    id: string;
    label: string;
    icon: any;
    path: string;
    isCenter?: boolean;
}

const ITEMS: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home, path: '/home' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, path: '/dashboard/main' },
    { id: 'ai', label: 'AI Chat', icon: Sparkles, path: '/ai-astrologer', isCenter: true },
    { id: 'dasha', label: 'Dasha', icon: Zap, path: '/calculations/vimshottari' },
    { id: 'numerology', label: 'Numerology', icon: BrainCircuit, path: '/tools/numerology' },
];

const CelestialNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { toggleChartStyle } = useChartSettings();

    const [isScrolled, setIsScrolled] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

    const userEmail = user?.email || 'Bhava Soul';
    const userInitial = userEmail.charAt(0).toUpperCase();
    const userName = userEmail.split('@')[0];

    return (
        <>
            {/* --- DESKTOP TOP NAVIGATION --- */}
            <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 hidden md:block`}>
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className={`w-full h-16 bg-[#0B0F1A]/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 transition-all duration-300 ${isScrolled ? 'shadow-2xl' : ''}`}
                >
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/home')}>
                        <BrandLogo size="md" showWordmark />
                    </div>

                    {/* Main Navigation Links */}
                    <nav className="flex items-center gap-4">
                        {ITEMS.map((item) => {
                            const active = isActive(item.path);
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => navigate(item.path)}
                                    className={`relative px-2 py-2 rounded-md transition-colors ${active ? 'text-[#EDEFF5]' : 'text-[#A9B0C2] hover:text-[#EDEFF5]'}`}
                                >
                                    <div className="relative flex items-center gap-2.5">
                                        <item.icon className={`w-4.5 h-4.5 ${active ? 'text-[#EDEFF5]' : 'text-[#A9B0C2]'}`} />
                                        <span className="text-xs font-semibold uppercase tracking-wider">{item.label}</span>
                                    </div>
                                    {active && <div className="absolute left-0 right-0 -bottom-1 h-0.5 bg-[#F5A623] rounded" />}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Soul Portal - Right Side */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsSettingsOpen(true)}
                                className="p-2.5 text-[#A9B0C2] hover:text-[#EDEFF5] hover:bg-[#11162A] rounded-lg transition-all border border-[rgba(255,255,255,0.08)]"
                                title="Calculation Settings"
                            >
                                <Settings className="w-5 h-5" />
                            </button>

                            <button
                                onClick={toggleChartStyle}
                                className="p-2.5 text-[#A9B0C2] hover:text-[#EDEFF5] hover:bg-[#11162A] rounded-lg transition-all border border-[rgba(255,255,255,0.08)]"
                            >
                                <LayoutGrid className="w-5 h-5" />
                            </button>

                            <button className="p-2.5 text-[#A9B0C2] hover:text-[#EDEFF5] hover:bg-[#11162A] rounded-lg transition-all border border-[rgba(255,255,255,0.08)] relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-[#E25555] rounded-full border-2 border-[#0B0F1A] animate-pulse" />
                            </button>
                        </div>

                        {/* HIGH-END SOUL PORTAL */}
                        <div
                            className="relative group/portal"
                            onMouseEnter={() => setIsProfileOpen(true)}
                            onMouseLeave={() => setIsProfileOpen(false)}
                        >
                            <button className="h-10 px-3 rounded-xl bg-[#11162A] border border-[rgba(255,255,255,0.08)] flex items-center gap-3 hover:bg-[#11162A]/80 transition-all">
                                <div className="relative">
                                    <div className="w-8 h-8 rounded-full bg-[#F5A623] flex items-center justify-center text-[#0B0F1A] font-black text-sm">
                                        {userInitial}
                                    </div>
                                </div>
                                <div className="text-left hidden sm:block">
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs font-bold text-[#EDEFF5] leading-none tracking-tight">{userName}</p>
                                        <Crown className="w-3 h-3 text-[#F5A623]" />
                                    </div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[#F5A623]/80">Portal</p>
                                </div>
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full right-0 mt-3 w-72 bg-[#0B0F1A] border border-[rgba(255,255,255,0.08)] p-3 rounded-2xl shadow-2xl z-[110]"
                                    >
                                        <div className="p-4 mb-2 bg-[#11162A] rounded-xl border border-[rgba(255,255,255,0.08)]">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-center">
                                                    <Crown className="w-6 h-6 text-[#F5A623]" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black uppercase tracking-widest text-[#F5A623]">Tier</p>
                                                    <p className="text-sm font-bold text-[#EDEFF5]">Premium Oracle</p>
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
                                                    className="w-full flex items-center justify-between p-3.5 text-[#A9B0C2] hover:text-[#EDEFF5] hover:bg-[#11162A] rounded-xl transition-all"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <link.icon className="w-5 h-5" />
                                                        <span className="text-xs font-bold uppercase tracking-widest">{link.label}</span>
                                                    </div>
                                                    <ChevronRight className="w-3 h-3 opacity-50" />
                                                </button>
                                            ))}
                                        </div>

                                        <div className="h-px bg-[rgba(255,255,255,0.08)] my-2 mx-2" />

                                        <button
                                            onClick={() => logout()}
                                            className="w-full flex items-center gap-3 p-3 text-[#E25555] hover:text-[#EDEFF5] hover:bg-[#E25555]/10 rounded-xl transition-all"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Sign Out</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </header>

            {/* --- MOBILE TOP NAVIGATION --- */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-[100] h-16 bg-[#0B0F1A]/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 transition-all duration-300">
                <div onClick={() => navigate('/home')}>
                    <BrandLogo size="sm" showWordmark />
                </div>

                <div className="flex items-center gap-3">
                     <button
                        onClick={toggleChartStyle}
                        className="p-2 text-[#A9B0C2] hover:text-white rounded-lg border border-white/10 bg-[#11162A]/50"
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>

                    <div className="relative">
                        <button 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2 pl-1 pr-1 py-1 rounded-full bg-[#11162A]/50 border border-white/10"
                        >
                            <div className="w-8 h-8 rounded-full bg-[#F5A623] flex items-center justify-center text-[#0B0F1A] font-black text-xs border border-[#F5A623]/20 shrink-0">
                                {userInitial}
                            </div>
                            <span className="text-xs font-bold text-[#EDEFF5] max-w-[80px] truncate pr-2 hidden sm:block">
                                {userName}
                            </span>
                            <span className="text-xs font-bold text-[#EDEFF5] max-w-[60px] truncate pr-2 sm:hidden block">
                                {userName}
                            </span>
                        </button>
                         <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-full right-0 mt-2 w-64 bg-[#0B0F1A] border border-white/10 p-2 rounded-xl shadow-2xl z-[110]"
                                >
                                    <div className="p-3 mb-2 bg-[#11162A]/50 rounded-lg border border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[#F5A623]/10 flex items-center justify-center">
                                                <Crown className="w-4 h-4 text-[#F5A623]" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-[#F5A623]">Tier</p>
                                                <p className="text-xs font-bold text-[#EDEFF5]">Premium Oracle</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <button onClick={() => navigate('/account/profile')} className="w-full flex items-center gap-3 p-2 text-[#A9B0C2] hover:text-white hover:bg-[#11162A] rounded-lg transition-all text-xs font-bold uppercase tracking-wide">
                                            <User className="w-4 h-4" /> Profile
                                        </button>
                                        <button onClick={() => logout()} className="w-full flex items-center gap-3 p-2 text-rose-400 hover:text-white hover:bg-rose-500/10 rounded-lg transition-all text-xs font-bold uppercase tracking-wide">
                                            <LogOut className="w-4 h-4" /> Sign Out
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <CalculationSettings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </>
    );
};

export default CelestialNavbar;
