import { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { MENU_ITEMS } from '../data/navigation';
import { Plus, Search, MapPin, Edit2, Trash2, Star, Sparkles } from 'lucide-react';
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
            title="Astro360"
            breadcrumbs={['Hub']}
            showHeader={true}
            disableContentPadding={true}
        >
            <div className="min-h-screen bg-[#050816] bg-gradient-to-b from-[#050816] via-[#1A1B4B] to-[#0A0D1E] pb-32">
                {/* Mystical Background Elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full animate-pulse-slow" />
                    <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-amber-900/10 blur-[100px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />

                    {/* Decorative Celestial Patterns */}
                    <div className="absolute top-1/4 right-[5%] opacity-[0.03] rotate-12">
                        <Star className="w-64 h-64 text-amber-500" />
                    </div>
                    <div className="absolute bottom-1/4 left-[20%] opacity-[0.02] -rotate-12">
                        <Sparkles className="w-96 h-96 text-purple-500" />
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.01]">
                        <div className="w-full h-full border border-white/10 rounded-full scale-110" />
                        <div className="w-full h-full border border-white/10 rounded-full scale-125 top-20" />
                    </div>
                </div>

                <div className="relative z-10 max-w-[1600px] mx-auto pt-8 px-6 md:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                        {/* LEFT COLUMN: Vertical Chart List */}
                        <div className="lg:col-span-4 xl:col-span-3">
                            <div className="flex flex-col gap-6 lg:sticky lg:top-24">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                                            <Star className="w-5 h-5 text-amber-500 fill-amber-500/20 animate-pulse" />
                                            Celestial Belt
                                        </h2>
                                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.3em]">Personal Circle</p>
                                    </div>
                                    <button
                                        onClick={() => setIsCreateModalOpen(true)}
                                        className="p-2.5 bg-amber-500 text-[#050816] rounded-xl hover:bg-amber-400 transition-all active:scale-90 shadow-lg shadow-amber-500/20"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="relative group/search">
                                    <input
                                        type="text"
                                        placeholder="Search souls..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-2xl text-xs text-white placeholder-white/20 focus:outline-none backdrop-blur-md transition-all font-medium"
                                    />
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/40 group-focus-within/search:text-amber-500 transition-colors" />
                                </div>

                                <div className="space-y-4 lg:max-h-[calc(100vh-250px)] lg:overflow-y-auto pr-2 custom-scrollbar">
                                    {isLoadingProfiles ? (
                                        <div className="h-44 flex items-center justify-center">
                                            <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                                        </div>
                                    ) : (
                                        filteredCharts.map((chart) => {
                                            const isActive = currentProfile?.raw?.id === chart.id;
                                            return (
                                                <div
                                                    key={chart.id}
                                                    onClick={() => handleSwitch(chart)}
                                                    className={`w-full p-4 rounded-3xl border transition-all duration-500 cursor-pointer relative overflow-hidden group/chart flex items-center gap-4 ${isActive
                                                        ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.3)]'
                                                        : 'bg-white/5 border-white/5 hover:border-amber-500/20 hover:bg-white/10'
                                                        }`}
                                                >
                                                    <div className={`w-12 h-12 flex-shrink-0 rounded-2xl flex items-center justify-center text-2xl transition-all duration-700 ${isActive
                                                        ? 'bg-amber-500 text-[#050816]'
                                                        : 'bg-white/5 text-amber-500/60 border border-white/10'
                                                        }`}>
                                                        {getZodiacSign(chart)}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <h3 className={`text-sm font-black tracking-tight truncate ${isActive ? 'text-amber-400' : 'text-white'}`}>
                                                            {chart.first_name} {chart.last_name || ''}
                                                        </h3>
                                                        <p className="text-[10px] text-white/30 font-bold flex items-center gap-1 truncate">
                                                            <MapPin className="w-3 h-3" />
                                                            {chart.location_name?.split(',')[0] || 'Unknown'}
                                                        </p>
                                                    </div>

                                                    <div className="flex gap-1 opacity-0 group-hover/chart:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleEdit(chart); }}
                                                            className="p-1.5 hover:text-amber-400 text-white/20 transition-colors"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(chart); }}
                                                            className="p-1.5 hover:text-red-400 text-white/20 transition-colors"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Navigation & Content */}
                        <div className="lg:col-span-8 xl:col-span-9 space-y-16">
                            {/* Celestial Header */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black tracking-[0.3em] text-amber-500/80 uppercase">Celestial Hub</span>
                                    <HomeHeader
                                        userName={currentProfile?.name || (user as any)?.name || 'Soul'}
                                        location={currentProfile?.location}
                                        showActions={false}
                                    />
                                </div>

                                {/* Cosmic Wisdom Panel */}
                                <div className="hidden xl:flex items-center gap-6 p-6 rounded-[2.5rem] bg-white/5 border border-white/5 backdrop-blur-xl max-w-sm group/wisdom hover:bg-white/10 transition-all duration-500">
                                    <div className="w-12 h-12 flex-shrink-0 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20 group-hover/wisdom:scale-110 transition-transform">
                                        <Sparkles className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-500/60">Cosmic Wisdom</span>
                                        <p className="text-[11px] text-white/50 font-medium italic leading-relaxed">
                                            "The stars do not pull us back, they simply show us the way forward."
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Categories */}
                            <div className="space-y-20">
                                {MENU_ITEMS.map((section, sectionIdx) => (
                                    <div key={sectionIdx} className="space-y-8">
                                        <div className="flex items-center gap-6">
                                            <h2 className="text-[10px] font-black text-amber-500/40 tracking-[0.5em] uppercase whitespace-nowrap">
                                                {section.section}
                                            </h2>
                                            <div className="h-px w-full bg-gradient-to-r from-amber-500/10 via-white/5 to-transparent" />
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                                            {section.items.map((item, itemIdx) => (
                                                <Link
                                                    key={itemIdx}
                                                    to={item.to}
                                                    className="group relative flex flex-col p-8 bg-white/[0.03] backdrop-blur-3xl border border-white/[0.05] rounded-[3rem] hover:bg-white/[0.08] hover:border-amber-500/30 transition-all duration-700 shadow-2xl overflow-hidden hover:-translate-y-2"
                                                >
                                                    {/* Interactive Light Sweep */}
                                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                                                        <div className="absolute inset-[-100%] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent rotate-[35deg] translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-[1500ms] ease-in-out" />
                                                    </div>

                                                    {/* Decorative Star Path / Orbit */}
                                                    <svg className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all duration-1000 pointer-events-none" viewBox="0 0 100 100">
                                                        <path
                                                            d="M10,90 Q50,10 90,90"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="0.5"
                                                            className="text-amber-500"
                                                        />
                                                        <circle cx="50" cy="50" r="1" fill="currentColor" className="text-amber-400 animate-pulse" />
                                                    </svg>

                                                    <div className="relative z-10 flex flex-col items-center text-center gap-8">
                                                        {/* Cosmic Icon Portal */}
                                                        <div className="relative">
                                                            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-slate-900 to-slate-800 border border-white/10 flex items-center justify-center relative z-20 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] group-hover:border-amber-500/40 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all duration-700">
                                                                <item.icon className="w-8 h-8 text-white group-hover:text-amber-400 transition-all duration-700 group-hover:scale-110" />
                                                            </div>
                                                            {/* Portal Aura / Pulse */}
                                                            <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-2xl opacity-0 group-hover:opacity-60 group-hover:animate-pulse transition-opacity duration-700" />
                                                            <div className="absolute -inset-1 rounded-full border border-amber-500/10 scale-90 opacity-0 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000" />
                                                        </div>

                                                        <div className="space-y-3">
                                                            <h3 className="text-[12px] font-black text-white group-hover:text-amber-200 transition-colors uppercase tracking-[0.2em] leading-relaxed">
                                                                {item.label}
                                                            </h3>
                                                            <div className="flex justify-center gap-2">
                                                                {item.badge && (
                                                                    <span className="inline-block text-[8px] px-3 py-1 rounded-full font-black uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-lg shadow-amber-500/5">
                                                                        {item.badge}
                                                                    </span>
                                                                )}
                                                                <span className="w-8 h-[1px] bg-white/10 group-hover:w-16 group-hover:bg-amber-500/30 transition-all duration-700 mt-2 self-center" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Corner Decoration */}
                                                    <div className="absolute bottom-4 right-4 w-4 h-4 border-r border-b border-white/10 group-hover:border-amber-500/40 transition-colors" />
                                                    <div className="absolute top-4 left-4 w-4 h-4 border-l border-t border-white/10 group-hover:border-amber-500/40 transition-colors" />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Support & Management */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-32">
                                <div className="group relative p-10 rounded-[3rem] bg-gradient-to-br from-white/5 to-purple-900/10 border border-white/5 overflow-hidden shadow-2xl transition-all hover:bg-white/10">
                                    <div className="relative z-10 flex flex-col gap-8">
                                        <div className="space-y-3">
                                            <h3 className="text-3xl font-black text-white tracking-tight">Oracle Support</h3>
                                            <p className="text-sm text-white/30 font-medium leading-relaxed max-w-xs">Connect with our celestial experts for personalized guidance.</p>
                                        </div>
                                        <button className="w-max px-10 py-4 bg-amber-500 hover:bg-amber-400 text-[#050816] text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all active:scale-95 shadow-xl shadow-amber-500/20">
                                            Invoke Expert
                                        </button>
                                    </div>
                                </div>
                                <div className="group relative p-10 rounded-[3rem] bg-gradient-to-br from-white/5 to-amber-900/5 border border-white/5 overflow-hidden shadow-2xl transition-all hover:bg-white/10">
                                    <div className="relative z-10 flex flex-col gap-8">
                                        <div className="space-y-3">
                                            <h3 className="text-3xl font-black text-white tracking-tight">Universe Settings</h3>
                                            <p className="text-sm text-white/30 font-medium leading-relaxed max-w-xs">Configure your cosmic experience and subscriptions.</p>
                                        </div>
                                        <button className="w-max px-10 py-4 bg-white/5 hover:bg-white/10 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all border border-white/10 active:scale-95">
                                            Manage Path
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
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
