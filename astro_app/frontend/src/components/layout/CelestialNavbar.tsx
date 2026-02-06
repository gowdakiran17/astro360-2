import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home, Sparkles, Zap, User,
    Bell, LayoutGrid, LogOut, BrainCircuit,
    ShieldCheck, HelpCircle, ChevronRight,
    Crown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChartSettings } from '../../context/ChartContext';
import BrandLogo from './BrandLogo';

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
                    className={`w-full h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 transition-all duration-300 ${isScrolled ? 'shadow-2xl' : ''}`}
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
                                    className={`relative px-2 py-2 rounded-md transition-colors ${active ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                                >
                                    <div className="relative flex items-center gap-2.5">
                                        <item.icon className={`w-4.5 h-4.5 ${active ? 'text-white' : 'text-slate-400'}`} />
                                        <span className="text-xs font-semibold uppercase tracking-wider">{item.label}</span>
                                    </div>
                                    {active && <div className="absolute left-0 right-0 -bottom-1 h-0.5 bg-indigo-500 rounded" />}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Soul Portal - Right Side */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleChartStyle}
                                className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all border border-slate-800"
                            >
                                <LayoutGrid className="w-5 h-5" />
                            </button>

                            <button className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all border border-slate-800 relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-950 animate-pulse" />
                            </button>
                        </div>

                        {/* HIGH-END SOUL PORTAL */}
                        <div
                            className="relative group/portal"
                            onMouseEnter={() => setIsProfileOpen(true)}
                            onMouseLeave={() => setIsProfileOpen(false)}
                        >
                            <button className="h-10 px-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3 hover:bg-slate-800 transition-all">
                                <div className="relative">
                                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-[#050816] font-black text-sm">
                                        {userInitial}
                                    </div>
                                </div>
                                <div className="text-left hidden sm:block">
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs font-bold text-white leading-none tracking-tight">{userName}</p>
                                        <Crown className="w-3 h-3 text-amber-500" />
                                    </div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-amber-500/80">Portal</p>
                                </div>
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full right-0 mt-3 w-72 bg-slate-950 border border-slate-800 p-3 rounded-2xl shadow-2xl z-[110]"
                                    >
                                        <div className="p-4 mb-2 bg-slate-900 rounded-xl border border-slate-800">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                                    <Crown className="w-6 h-6 text-amber-500" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black uppercase tracking-widest text-amber-500">Tier</p>
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
                                                    className="w-full flex items-center justify-between p-3.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-all"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <link.icon className="w-5 h-5" />
                                                        <span className="text-xs font-bold uppercase tracking-widest">{link.label}</span>
                                                    </div>
                                                    <ChevronRight className="w-3 h-3 opacity-50" />
                                                </button>
                                            ))}
                                        </div>

                                        <div className="h-px bg-slate-800 my-2 mx-2" />

                                        <button
                                            onClick={() => logout()}
                                            className="w-full flex items-center gap-3 p-3 text-rose-400 hover:text-white hover:bg-rose-500/10 rounded-xl transition-all"
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

            {/* --- MOBILE BOTTOM NAVIGATION --- */}
            <nav className="md:hidden fixed bottom-6 left-4 right-4 h-16 z-[100]">
                <div className="relative w-full h-full bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-around px-3 shadow-2xl">
                    {ITEMS.map((item) => {
                        const active = isActive(item.path);

                        if (item.isCenter) {
                            return (
                                <div key={item.id} className="relative -top-9 px-2">
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => navigate(item.path)}
                                        className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-slate-950"
                                    >
                                        <item.icon className="w-7 h-7" />
                                    </motion.button>
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 text-center mt-1">{item.label}</p>
                                </div>
                            );
                        }

                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.path)}
                                className={`flex flex-col items-center gap-1 relative py-1 transition-all ${active ? 'text-white' : 'text-slate-400'
                                    }`}
                            >
                                <item.icon className="w-5.5 h-5.5 transition-transform duration-500" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </>
    );
};

export default CelestialNavbar;
