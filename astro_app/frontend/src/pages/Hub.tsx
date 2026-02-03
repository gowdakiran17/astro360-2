import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import MainLayout from '../components/layout/MainLayout';
import { MENU_ITEMS } from '../data/navigation';
import { Plus, Search, MapPin, Edit2, Trash2, Star, Sparkles, BrainCircuit, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChartSettings } from '../context/ChartContext';
import HomeHeader from '../components/dashboard/modern/HomeHeader';
import CreateChartModal from '../components/CreateChartModal';
import DeleteChartModal from '../components/DeleteChartModal';
import EditChartModal from '../components/EditChartModal';

const ZODIAC_SYMBOLS: Record<number, string> = {
    1: '♈', 2: '♉', 3: '♊', 4: '♋', 5: '♌', 6: '♍',
    7: '♎', 8: '♏', 9: '♐', 10: '♑', 11: '♒', 12: '♓'
};

const StarField = () => {
    const stars = Array.from({ length: 150 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 5
    }));

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    className="absolute bg-white rounded-full opacity-40"
                    style={{
                        top: star.top,
                        left: star.left,
                        width: star.size,
                        height: star.size,
                    }}
                    animate={{
                        opacity: [0.2, 0.8, 0.2],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        delay: star.delay,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
};

const Hub = () => {
    const { user } = useAuth();
    const {
        availableProfiles,
        isLoadingProfiles,
        refreshProfiles,
        switchProfile,
        deleteChart,
        updateChart,
        currentProfile
    } = useChartSettings();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedChart, setSelectedChart] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const bgOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

    const handleSwitch = (chart: any) => {
        switchProfile(chart);
    };

    const handleDelete = (chart: any) => {
        setSelectedChart(chart);
        setIsDeleteModalOpen(true);
    };

    const handleEdit = (chart: any) => {
        setSelectedChart(chart);
        setIsEditModalOpen(true);
    };

    const filteredCharts = availableProfiles.filter(chart => {
        const query = searchQuery.toLowerCase();
        const fullName = `${chart.first_name} ${chart.last_name}`.toLowerCase();
        const location = (chart.location_name || '').toLowerCase();
        return fullName.includes(query) || location.includes(query);
    });

    const getZodiacSign = (chart: any) => {
        const month = parseInt(chart.date_str?.split('/')[1] || '1');
        return ZODIAC_SYMBOLS[month] || '♈';
    };

    return (
        <MainLayout
            title="Celestial Hub"
            showHeader={true}
            disableContentPadding={true}
        >
            <div ref={containerRef} className="min-h-screen bg-[#050816] relative overflow-hidden pb-32">
                <StarField />

                {/* Nebula Background Gradients */}
                <div className="fixed inset-0 pointer-events-none">
                    <motion.div
                        style={{ opacity: bgOpacity }}
                        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/15 blur-[150px] rounded-full"
                    />
                    <motion.div
                        style={{ opacity: bgOpacity }}
                        className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-amber-900/10 blur-[130px] rounded-full"
                    />
                    <div className="absolute top-[30%] right-[15%] w-[30%] h-[30%] bg-blue-900/10 blur-[120px] rounded-full" />
                </div>

                <div className="relative z-10 max-w-[1600px] mx-auto pt-10 px-6 md:px-12 lg:px-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                        {/* LEFT COLUMN: Celestial Belt */}
                        <div className="lg:col-span-4 xl:col-span-3">
                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="flex flex-col gap-8 lg:sticky lg:top-32"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-1">
                                        <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
                                            <div className="relative">
                                                <Star className="w-6 h-6 text-amber-500 fill-amber-500/20" />
                                                <motion.div
                                                    animate={{ opacity: [1, 0.4, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                    className="absolute inset-0 bg-amber-500 blur-md opacity-50"
                                                />
                                            </div>
                                            Celestial Belt
                                        </h2>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
                                            <p className="text-xs font-black text-white/50 uppercase tracking-[0.4em]">Personal Souls</p>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsCreateModalOpen(true)}
                                        className="h-12 w-12 bg-gradient-to-br from-amber-400 to-orange-600 text-[#050816] rounded-2xl flex items-center justify-center shadow-[0_10px_20px_rgba(245,158,11,0.2)] border border-white/20"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </motion.button>
                                </div>

                                <div className="relative group/search">
                                    <input
                                        type="text"
                                        placeholder="Invoke soul by name..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 focus:border-amber-500/40 rounded-2xl text-xs text-white placeholder-white/20 focus:outline-none backdrop-blur-3xl transition-all font-medium shadow-inner"
                                    />
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/30 group-focus-within/search:text-amber-500 transition-colors" />
                                </div>

                                <div className="space-y-4 lg:max-h-[calc(100vh-350px)] lg:overflow-y-auto pr-2 custom-scrollbar contents-fade">
                                    {isLoadingProfiles ? (
                                        <div className="h-44 flex items-center justify-center">
                                            <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
                                        </div>
                                    ) : (
                                        <AnimatePresence mode="popLayout">
                                            {filteredCharts.map((chart, idx) => {
                                                const isActive = currentProfile?.raw?.id === chart.id;
                                                return (
                                                    <motion.div
                                                        layout
                                                        key={chart.id}
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: idx * 0.05 }}
                                                        onClick={() => handleSwitch(chart)}
                                                        className={`w-full p-4 rounded-3xl border transition-all duration-500 cursor-pointer relative overflow-hidden group/chart flex items-center gap-4 ${isActive
                                                            ? 'bg-amber-500/[0.08] border-amber-500/30 shadow-[0_15px_30px_rgba(0,0,0,0.4)]'
                                                            : 'bg-white/[0.02] border-white/5 hover:border-amber-500/20 hover:bg-white/[0.05]'
                                                            }`}
                                                    >
                                                        <div className={`w-14 h-14 flex-shrink-0 rounded-2xl flex items-center justify-center text-3xl transition-all duration-700 relative z-10 ${isActive
                                                            ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-[#050816] shadow-lg shadow-amber-500/20'
                                                            : 'bg-white/10 text-amber-500/60 border border-white/20'
                                                            }`}>
                                                            {getZodiacSign(chart)}
                                                            {isActive && (
                                                                <motion.div
                                                                    layoutId="aura"
                                                                    className="absolute -inset-1 bg-amber-500/20 blur-md rounded-full -z-10"
                                                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                                                                    transition={{ duration: 3, repeat: Infinity }}
                                                                />
                                                            )}
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <h3 className={`text-sm font-black tracking-tight truncate ${isActive ? 'text-amber-400' : 'text-white'}`}>
                                                                {chart.first_name} {chart.last_name || ''}
                                                            </h3>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <MapPin className="w-3.5 h-3.5 text-white/40" />
                                                                <p className="text-xs text-white/60 font-bold tracking-wider truncate">
                                                                    {chart.location_name?.split(',')[0] || 'Unknown Origin'}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-2 opacity-0 group-hover/chart:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleEdit(chart); }}
                                                                className="p-2 hover:bg-amber-500/10 rounded-xl text-white/20 hover:text-amber-400 transition-all border border-transparent hover:border-amber-500/20"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleDelete(chart); }}
                                                                className="p-2 hover:bg-red-500/10 rounded-xl text-white/20 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </AnimatePresence>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* RIGHT COLUMN: Content Universe */}
                        <div className="lg:col-span-8 xl:col-span-9 space-y-20">
                            {/* Celestial Header */}
                            <motion.div
                                initial={{ y: -30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1 }}
                                className="flex flex-col md:flex-row md:items-center justify-between gap-10"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-px bg-amber-500" />
                                        <span className="text-xs font-black tracking-[0.5em] text-amber-500 uppercase">Celestial Odyssey</span>
                                    </div>
                                    <HomeHeader
                                        userName={currentProfile?.name || (user as any)?.name || 'Astral Soul'}
                                        location={currentProfile?.location}
                                        showActions={false}
                                    />
                                </div>

                                {/* Cosmic Wisdom Panel */}
                                <motion.div
                                    whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.08)' }}
                                    className="hidden xl:flex items-center gap-6 p-7 rounded-[3rem] bg-white/[0.04] border border-white/[0.08] backdrop-blur-3xl max-w-sm group/wisdom transition-all duration-700 shadow-2xl relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
                                    <div className="w-14 h-14 flex-shrink-0 bg-gradient-to-tr from-amber-500/20 to-orange-500/10 rounded-2xl flex items-center justify-center border border-amber-500/30 group-hover/wisdom:scale-110 transition-transform duration-700 relative overflow-hidden">
                                        <Sparkles className="w-7 h-7 text-amber-500" />
                                        <div className="absolute inset-0 bg-amber-400/10 animate-pulse" />
                                    </div>
                                    <div className="flex flex-col gap-2 relative z-10">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500/90 flex items-center gap-2">
                                            <BrainCircuit className="w-3 h-3" />
                                            Daily Oracle
                                        </span>
                                        <p className="text-sm text-white/60 font-bold italic leading-relaxed tracking-tight group-hover/wisdom:text-white/90 transition-colors">
                                            "The stars are not just lights in the sky, they are the echoes of your infinite potential."
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Main Navigation Modules */}
                            <div className="space-y-24">
                                {MENU_ITEMS.map((section, sectionIdx) => (
                                    <motion.div
                                        key={sectionIdx}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: sectionIdx * 0.1, duration: 0.8 }}
                                        className="space-y-12"
                                    >
                                        <div className="flex items-center gap-8 group/title">
                                            <h2 className="text-xs font-black text-amber-500/80 tracking-[0.6em] uppercase whitespace-nowrap group-hover/title:text-amber-500 transition-colors duration-500">
                                                {section.section}
                                            </h2>
                                            <div className="h-px w-full bg-gradient-to-r from-amber-500/30 via-white/5 to-transparent" />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                            {section.items.map((item, itemIdx) => (
                                                <Link
                                                    key={itemIdx}
                                                    to={item.to}
                                                    className="group relative flex flex-col p-10 bg-white/[0.02] backdrop-blur-3xl border border-white/[0.05] rounded-[3.5rem] hover:bg-white/[0.05] hover:border-amber-500/40 transition-all duration-700 shadow-[0_20px_40px_rgba(0,0,0,0.3)] overflow-hidden hover:-translate-y-3"
                                                >
                                                    {/* Refraction Overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

                                                    {/* Dynamic Light Sweep */}
                                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                                                        <div className="absolute inset-[-100%] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent rotate-[45deg] translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-[1200ms] ease-out" />
                                                    </div>

                                                    <div className="relative z-10 flex flex-col items-center text-center gap-10">
                                                        {/* Icon Portal Portal */}
                                                        <div className="relative">
                                                            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-slate-950 to-slate-900 border border-white/20 flex items-center justify-center relative z-20 shadow-[inset_0_4px_12px_rgba(0,0,0,0.6)] group-hover:border-amber-500/60 group-hover:shadow-[0_0_40px_rgba(245,158,11,0.25)] transition-all duration-700 overflow-hidden">
                                                                <item.icon className="w-10 h-10 text-white/60 group-hover:text-amber-400 transition-all duration-700 group-hover:scale-110 drop-shadow-2xl" />
                                                                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent" />
                                                            </div>
                                                            {/* Aura Effects */}
                                                            <div className="absolute inset-[-10%] rounded-full bg-amber-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                                            <div className="absolute -inset-2 rounded-full border border-amber-500/10 scale-90 opacity-0 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000 delay-100" />
                                                        </div>

                                                        <div className="space-y-4">
                                                            <h3 className="text-sm font-black text-white/90 group-hover:text-white transition-colors uppercase tracking-[0.25em] leading-relaxed">
                                                                {item.label}
                                                            </h3>
                                                            <div className="flex flex-col items-center gap-3">
                                                                {item.badge && (
                                                                    <span className="text-[10px] px-4 py-1.5 rounded-full font-black uppercase bg-amber-500/20 text-amber-500 border border-amber-500/30 shadow-lg tracking-widest">
                                                                        {item.badge}
                                                                    </span>
                                                                )}
                                                                <div className="w-10 h-[1px] bg-white/20 group-hover:w-20 group-hover:bg-amber-500/60 transition-all duration-700" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Corner Stylings */}
                                                    <div className="absolute bottom-6 right-6 w-5 h-5 border-r border-b border-white/[0.05] group-hover:border-amber-500/20 transition-colors duration-500" />
                                                    <div className="absolute top-6 left-6 w-5 h-5 border-l border-t border-white/[0.05] group-hover:border-amber-500/20 transition-colors duration-500" />
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Utility Sections */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 1.5 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-32"
                            >
                                <div className="group relative p-12 rounded-[4rem] bg-gradient-to-br from-white/[0.03] to-purple-950/10 border border-white/5 overflow-hidden shadow-2xl transition-all hover:bg-white/[0.05] hover:border-white/10">
                                    <div className="relative z-10 flex flex-col gap-10">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                                <h3 className="text-3xl font-black text-white tracking-tighter">Oracle Support</h3>
                                            </div>
                                            <p className="text-sm text-white/60 font-bold leading-loose max-w-sm tracking-tight">Connect with high-tier celestial experts for deeply personalized karmic guidance.</p>
                                        </div>
                                        <button className="w-max px-12 py-5 bg-amber-500 hover:bg-amber-400 text-[#050816] text-xs font-black uppercase tracking-[0.3em] rounded-2xl transition-all active:scale-95 shadow-[0_15px_30px_rgba(245,158,11,0.25)] border border-white/20">
                                            Invoke Expert
                                        </button>
                                    </div>
                                    {/* Abstract Decor */}
                                    <Star className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 rotate-12 group-hover:rotate-[30deg] transition-transform duration-1000" />
                                </div>

                                <div className="group relative p-12 rounded-[4rem] bg-gradient-to-br from-white/[0.03] to-amber-950/10 border border-white/5 overflow-hidden shadow-2xl transition-all hover:bg-white/[0.05] hover:border-white/10">
                                    <div className="relative z-10 flex flex-col gap-10">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-2 h-2 rounded-full bg-amber-500/40" />
                                                <h3 className="text-3xl font-black text-white tracking-tighter">Universe Settings</h3>
                                            </div>
                                            <p className="text-sm text-white/60 font-bold leading-loose max-w-sm tracking-tight">Fine-tune your cosmic connection, subscription paths, and notification frequency.</p>
                                        </div>
                                        <button className="w-max px-12 py-5 bg-white/5 hover:bg-white/10 text-white text-xs font-black uppercase tracking-[0.3em] rounded-2xl transition-all border border-white/20 active:scale-95 shadow-2xl">
                                            Manage Path
                                        </button>
                                    </div>
                                    <ShieldCheck className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 -rotate-12 group-hover:-rotate-[25deg] transition-transform duration-1000" />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Modals */}
            <CreateChartModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onChartCreated={refreshProfiles}
            />

            <DeleteChartModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                chart={selectedChart}
                onConfirmDelete={deleteChart}
            />

            <EditChartModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                chart={selectedChart}
                onSave={updateChart}
            />
        </MainLayout>
    );
};

export default Hub;
