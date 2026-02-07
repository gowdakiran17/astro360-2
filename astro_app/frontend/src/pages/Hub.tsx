import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  LayoutDashboard, Calendar, Activity, 
  Sparkles, BarChart2, MapPin, 
  Search, 
  Moon, Clock, Globe, Grid, 
  Gem, Grid3X3, 
  Sun, TrendingUp, Star, RefreshCw, Compass, Crown, Navigation,
  FileText, Heart, Briefcase, Layers, ChevronDown, ChevronUp, UserCheck, Briefcase as BriefcaseIcon,
  AlertTriangle, Shield
} from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { useChartSettings } from '../context/ChartContext';
import CreateChartModal from '../components/CreateChartModal';
import MobileHeader from '../components/dashboard/mobile-first/MobileHeader';

// --- COLOR SYSTEM & THEME ---
const THEME = {
  bg: 'bg-[#0B0F1A]',
  cardBg: 'bg-[rgba(255,255,255,0.04)]',
  cardBorder: 'border-[rgba(255,255,255,0.08)]',
  primary: 'text-[#F5A623]',
  primaryBg: 'bg-[#F5A623]',
  secondary: 'text-[#6D5DF6]',
  danger: 'text-[#E25555]',
  textMain: 'text-[#EDEFF5]',
  textSecondary: 'text-[#A9B0C2]',
  textMuted: 'text-[#6F768A]',
};

// --- BENTO CARD COMPONENT ---
const BentoCard = ({ 
  to, 
  title, 
  icon: Icon, 
  badge,
  span = "col-span-1",
  variant = "default",
  description,
  layout = "default",
  onClick
}: { 
  to: string, 
  title: string, 
  icon: any, 
  badge?: string,
  span?: string,
  variant?: "default" | "primary" | "secondary" | "accent" | "pro",
  description?: string,
  layout?: "default" | "horizontal" | "vertical" | "compact" | "minimal",
  onClick?: () => void
}) => {
  const navigate = useNavigate();
  
  // Dynamic styles based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case "primary": // Dashboard - Gold/Orange
        return "bg-[#F5A623]/10 border-[#F5A623]/20 hover:bg-[#F5A623]/20 hover:border-[#F5A623]/40";
      case "secondary": // AI - Purple
        return "bg-[#6D5DF6]/10 border-[#6D5DF6]/20 hover:bg-[#6D5DF6]/20 hover:border-[#6D5DF6]/40";
      case "accent": // My Charts - Red/Pink
        return "bg-[#E25555]/10 border-[#E25555]/20 hover:bg-[#E25555]/20 hover:border-[#E25555]/40";
      case "pro": // Financial - Emerald
        return "bg-[#10B981]/10 border-[#10B981]/20 hover:bg-[#10B981]/20 hover:border-[#10B981]/40";
      default:
        return "bg-[#161B2C] border-white/5 hover:bg-[#1C2237] hover:border-white/10";
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case "primary": return "text-[#F5A623]";
      case "secondary": return "text-[#6D5DF6]";
      case "accent": return "text-[#E25555]";
      case "pro": return "text-[#10B981]";
      default: return "text-slate-400 group-hover:text-white";
    }
  };

  // Layout content logic
  const renderContent = () => {
    switch (layout) {
      case "horizontal": // Wide cards (Icon right, text left)
        return (
          <div className="flex flex-row items-center justify-between h-full gap-4 relative z-10">
            <div className="flex flex-col justify-center flex-1">
              <h3 className={`font-bold text-lg leading-tight mb-2 ${variant === 'default' ? 'text-slate-200' : 'text-white'}`}>{title}</h3>
              {description && <p className="text-xs text-slate-400 font-medium leading-relaxed opacity-80">{description}</p>}
            </div>
            <div className={`p-4 rounded-2xl ${variant === 'default' ? 'bg-white/5' : 'bg-white/10'} ${getIconColor()}`}>
              <Icon className="w-8 h-8" />
            </div>
          </div>
        );
      case "vertical": // Tall cards (Icon bottom large, text top)
        return (
          <div className="flex flex-col h-full relative z-10">
            <div className="mb-auto">
               <h3 className={`font-bold text-xl leading-tight mb-2 ${variant === 'default' ? 'text-slate-200' : 'text-white'}`}>{title}</h3>
               {description && <p className="text-sm text-slate-400 font-medium leading-relaxed opacity-80">{description}</p>}
            </div>
            <div className={`mt-4 self-end p-4 rounded-3xl ${variant === 'default' ? 'bg-white/5' : 'bg-white/10'} ${getIconColor()} transform transition-transform group-hover:scale-110 duration-300`}>
               <Icon className="w-10 h-10" />
            </div>
          </div>
        );
      case "compact": // Small square cards
         return (
           <div className="flex flex-col h-full justify-between relative z-10">
             <div className={`${getIconColor()} mb-2`}>
                <Icon className="w-6 h-6" />
             </div>
             <div>
                <h3 className={`font-bold text-sm leading-tight ${variant === 'default' ? 'text-slate-200' : 'text-white'}`}>{title}</h3>
             </div>
           </div>
         );
      case "minimal": // Text only with small icon
        return (
            <div className="flex items-center gap-3 h-full relative z-10">
                <Icon className={`w-5 h-5 ${getIconColor()}`} />
                <h3 className={`font-medium text-sm ${variant === 'default' ? 'text-slate-300' : 'text-white'}`}>{title}</h3>
            </div>
        );
      default: // Default (Standard Bento)
        return (
          <div className="flex flex-col h-full relative z-10">
            <div className={`mb-4 p-2.5 rounded-xl w-fit ${variant === 'default' ? 'bg-white/5' : 'bg-white/10'} ${getIconColor()}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="mt-auto">
              <h3 className={`font-bold text-base leading-tight mb-1 ${variant === 'default' ? 'text-slate-200' : 'text-white'}`}>{title}</h3>
              {description && <p className="text-[10px] text-slate-500 font-medium line-clamp-2">{description}</p>}
            </div>
          </div>
        );
    }
  };

  return (
    <button 
      onClick={() => {
        if (onClick) onClick();
        else navigate(to);
      }}
      className={`
        ${span} w-full relative p-5 rounded-[2rem] border transition-all duration-300 group overflow-hidden h-full text-left shadow-sm
        ${getVariantStyles()}
        hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20
      `}
    >
      {/* Subtle Background Gradient for Depth */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none`} />
      
      {badge && (
        <span className={`absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md z-20 shadow-sm
            ${variant === 'pro' ? 'bg-[#10B981] text-[#0B0F1A]' : 'bg-white text-black'}
        `}>
          {badge}
        </span>
      )}
      
      {renderContent()}
      
      {/* Decorative Circle */}
      <div className={`absolute -right-12 -bottom-12 w-40 h-40 rounded-full blur-3xl opacity-[0.08] pointer-events-none
         ${variant === 'primary' ? 'bg-[#F5A623]' : 
           variant === 'secondary' ? 'bg-[#6D5DF6]' : 
           variant === 'accent' ? 'bg-[#E25555]' : 
           variant === 'pro' ? 'bg-[#10B981]' : 
           'bg-white'}`} 
       />
    </button>
  );
};

const ProfileCard = ({ profile, isActive, onClick }: { profile: any, isActive: boolean, onClick: () => void }) => {
  const displayName = profile.name || (profile.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : 'Unnamed Chart');
  const locationName = profile.location_name || profile.location || 'Unknown Location';
  
  return (
    <button 
    onClick={onClick}
    className={`w-full p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 text-left
      ${isActive 
        ? 'bg-[#F5A623]/10 border-[#F5A623]/30 shadow-[0_0_15px_rgba(245,166,35,0.1)]' 
        : 'bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.08)] hover:border-white/20'
      }
    `}
  >
    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
      ${isActive ? 'bg-[#F5A623] text-black' : 'bg-slate-800 text-slate-400'}
    `}>
      {displayName.charAt(0)}
    </div>
    <div>
      <h3 className={`font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>{displayName}</h3>
      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
        <MapPin className="w-3 h-3" />
        {locationName.split(',')[0]}
      </div>
    </div>
    {isActive && (
      <div className="ml-auto">
        <span className="w-3 h-3 block rounded-full bg-[#F5A623] shadow-[0_0_8px_#F5A623]" />
      </div>
    )}
  </button>
  );
};

// --- NORMAL USER CONFIG ---
const NORMAL_MODULES = [
    // LARGE CARDS (Top Priority)
    { 
        to: "/ai-astrologer", 
        title: "Ask AI Astrologer", 
        icon: Sparkles, 
        badge: "AI",
        span: "col-span-2 lg:col-span-2 row-span-2", 
        variant: "secondary",
        layout: "vertical",
        description: "Ask about career, marriage, money, health."
    },
    { 
        to: "/dashboard/main", 
        title: "Today's Guidance", 
        icon: Sun, 
        span: "col-span-2 lg:col-span-2", 
        variant: "primary",
        layout: "horizontal",
        description: "Daily planetary influence summary."
    },
    { 
        to: "/dashboard/main?tab=visual", // Assuming tab param works or just links to dashboard
        title: "My Birth Chart", 
        icon: LayoutDashboard, 
        span: "col-span-1 lg:col-span-1",
        variant: "default",
        layout: "default",
        description: "Chart overview."
    },
    { 
        to: "/calculations/vimshottari", 
        title: "Dasha", 
        icon: Clock, 
        span: "col-span-1 lg:col-span-1",
        variant: "default",
        layout: "default",
        description: "Current life phase."
    },
    
    // DAILY & PRACTICAL
    { 
        to: "/global/panchang", 
        title: "Panchang", 
        icon: Calendar, 
        span: "col-span-1", 
        layout: "compact" 
    },
    { 
        to: "/global/transits", 
        title: "Transits", 
        icon: Globe, 
        span: "col-span-1", 
        layout: "compact" 
    },
    { 
        to: "/tools/period-analysis", 
        title: "Life Events", 
        icon: Star, 
        span: "col-span-1", 
        layout: "compact" 
    },
    { 
        to: "/dashboard/remedies", 
        title: "Remedies", 
        icon: Gem, 
        span: "col-span-1", 
        layout: "compact" 
    },

    // LIFE TOPICS
    { 
        to: "/global/matching", 
        title: "Love & Marriage", 
        icon: Heart, 
        span: "col-span-1", 
        layout: "compact" 
    },
    { 
        to: "/ai-astrologer?topic=career", 
        title: "Career & Money", 
        icon: Briefcase, 
        span: "col-span-1", 
        layout: "compact" 
    },
    { 
        to: "/calculations/solar-return", 
        title: "Yearly Forecast", 
        icon: RefreshCw, 
        span: "col-span-1", 
        layout: "compact" 
    },
    { 
        to: "/reports", // Placeholder
        title: "Full Reports", 
        icon: FileText, 
        span: "col-span-1", 
        layout: "compact" 
    },
];

// --- ASTROLOGER USER CONFIG ---
const ASTRO_GROUPS = [
    {
        id: "primary",
        title: "Primary Tools",
        modules: [
            { to: "/ai-astrologer", title: "AI Oracle Pro", icon: Sparkles, badge: "PRO", span: "col-span-2 lg:col-span-2", variant: "secondary", layout: "horizontal", description: "Deep analysis of logic, yogas, & timing." },
            { to: "/dashboard/main", title: "Dashboard", icon: LayoutDashboard, span: "col-span-2 lg:col-span-1", variant: "primary", layout: "default", description: "Overview." },
            { to: "/dashboard/main?tab=visual", title: "Charts Hub", icon: Grid, span: "col-span-1", variant: "default", layout: "default", description: "D1-D60." },
            { to: "/calculations/vimshottari", title: "Running Dasha", icon: Clock, span: "col-span-1", variant: "default", layout: "default" },
        ]
    },
    {
        id: "core",
        title: "Core Analysis",
        modules: [
            { to: "/dashboard/main?tab=chart", title: "Planetary Analysis", icon: Activity, span: "col-span-1", layout: "compact" },
            { to: "/calculations/shodashvarga", title: "Divisional Charts", icon: Layers, span: "col-span-1", layout: "compact" },
            { to: "/calculations/shadbala", title: "Balas & Strength", icon: BarChart2, span: "col-span-1", layout: "compact" },
            { to: "/calculations/yogas", title: "Yogas", icon: Crown, span: "col-span-1", layout: "compact" },
            { to: "/calculations/nakshatra", title: "Nakshatra Explorer", icon: Star, span: "col-span-2", layout: "horizontal", description: "Detailed star analysis." },
            { to: "/calculations/doshas", title: "Doshas", icon: AlertTriangle, span: "col-span-1", layout: "compact" },
            { to: "/dashboard/remedies", title: "Remedies", icon: Shield, span: "col-span-1", layout: "compact" },
        ]
    },
    {
        id: "systems",
        title: "Specialized Systems",
        modules: [
            { to: "/kp/dashboard", title: "KP System", icon: Grid3X3, span: "col-span-1", layout: "compact" },
            { to: "/calculations/jaimini", title: "Jaimini", icon: Compass, span: "col-span-1", layout: "compact" },
            { to: "/calculations/ashtakvarga", title: "Ashtakavarga", icon: Grid, span: "col-span-1", layout: "compact" },
            { to: "/tools/shadow-planets", title: "Shadow Planets", icon: Moon, span: "col-span-1", layout: "compact" },
            { to: "/calculations/sarvatobhadra", title: "Sarvatobhadra", icon: Grid, span: "col-span-1", layout: "compact" },
            { to: "/calculations/panchapakshi", title: "Panchapakshi", icon: Moon, span: "col-span-1", layout: "compact" },
            { to: "/cosmic/market-timing", title: "Financial Astro", icon: TrendingUp, span: "col-span-2", variant: "pro", layout: "horizontal", description: "Market & Crypto Timing." },
        ]
    },
    {
        id: "timing",
        title: "Timing & Utilities",
        modules: [
            { to: "/global/transits", title: "Transits", icon: Globe, span: "col-span-1", layout: "compact" },
            { to: "/calculations/transits", title: "Adv. Transits", icon: Navigation, span: "col-span-1", layout: "compact" },
            { to: "/tools/period-analysis", title: "Events", icon: Calendar, span: "col-span-1", layout: "compact" },
            { to: "/calculations/solar-return", title: "Solar Return", icon: RefreshCw, span: "col-span-1", layout: "compact" },
            { to: "/calculations/tithi-pravesh", title: "Tithi Pravesh", icon: Moon, span: "col-span-1", layout: "compact" },
            { to: "/global/panchang", title: "Panchang", icon: Sun, span: "col-span-1", layout: "compact" },
            { to: "/global/muhurata", title: "Muhurtas", icon: Clock, span: "col-span-1", layout: "compact" },
            { to: "/global/matching", title: "Matching", icon: Heart, span: "col-span-1", layout: "compact" },
            { to: "/reports", title: "Reports", icon: FileText, span: "col-span-1", layout: "compact" },
        ]
    }
];

const Hub = () => {
  // const { user } = useAuth(); // Unused
  const { currentProfile, switchProfile, availableProfiles, refreshProfiles, isLoadingProfiles } = useChartSettings();
  // const navigate = useNavigate(); // Unused in this component scope
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleSearch, setModuleSearch] = useState('');
  
  // ROLE STATE
  const [userRole, setUserRole] = useState<'normal' | 'astrologer'>('normal');
  const [showHiddenNormal, setShowHiddenNormal] = useState(false);

  // Helper to get display name safely
  const getDisplayName = (p: any) => {
    if (p.name) return p.name;
    if (p.first_name) return `${p.first_name} ${p.last_name || ''}`.trim();
    return 'Unnamed Chart';
  };

  // Filter profiles
  const filteredProfiles = availableProfiles.filter(p => 
    getDisplayName(p).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- RENDER: NO CHART SELECTED ---
  if (!currentProfile) {
    return (
      <MainLayout showHeader={false} disableContentPadding={true}>
        <div className={`min-h-screen ${THEME.bg} p-6 flex flex-col justify-center max-w-md mx-auto`}>
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#F5A623] to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-500/20">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to Bhava360</h1>
            <p className="text-slate-400">Select a chart to begin your cosmic journey.</p>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text"
              placeholder="Search charts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#151926] border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#F5A623] transition-colors"
            />
          </div>

          {/* Chart List */}
          <div className="space-y-3 mb-6 max-h-[40vh] overflow-y-auto pr-1 custom-scrollbar">
            {isLoadingProfiles ? (
              <div className="text-center py-8 text-slate-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F5A623] mx-auto mb-2"></div>
                <p>Loading charts...</p>
              </div>
            ) : filteredProfiles.length > 0 ? (
              filteredProfiles.map(profile => (
                <ProfileCard 
                  key={profile.id} 
                  profile={profile} 
                  isActive={false} 
                  onClick={() => switchProfile(profile)} 
                />
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 bg-[#161B2C]/50 rounded-xl border border-dashed border-slate-700">
                <p>No charts found.</p>
                <p className="text-xs mt-1 text-slate-600">Create your first chart to get started</p>
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full py-4 bg-[#F5A623] hover:bg-[#E09612] text-black font-bold rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Plus className="w-5 h-5" />
            Create New Chart
          </button>
        </div>

        <CreateChartModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onChartCreated={refreshProfiles}
        />
      </MainLayout>
    );
  }

  // --- RENDER: MAIN HUB ---
  return (
    <MainLayout showHeader={true} disableContentPadding={true}>
      <div className={`min-h-screen ${THEME.bg} flex flex-col`}>
        
        {/* MAIN CONTENT AREA */}
        <div className="flex-1 overflow-y-auto pb-24">
          
          {/* MOBILE TOP NAV */}
          <div className="lg:hidden">
            <MobileHeader 
              userName={getDisplayName(currentProfile)}
              location={(currentProfile as any).location_name || (currentProfile as any).location || 'Unknown Location'}
              onMenuToggle={() => setIsMobileSidebarOpen(true)}
              isMenuOpen={isMobileSidebarOpen}
            />
          </div>

          {/* HERO HEADER */}
          <div className="relative overflow-hidden bg-[#0B0F1A] border-b border-[rgba(255,255,255,0.08)] pb-8 pt-10 px-6 md:px-8">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#F5A623]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5A623]/10 border border-[#F5A623]/20 w-fit mb-4">
                    <div className="w-2 h-2 rounded-full bg-[#F5A623] animate-pulse" />
                    <span className="text-[10px] font-bold text-[#F5A623] tracking-wide uppercase">Celestial Sync Active</span>
                  </div>
                  
                  <h1 className="text-3xl md:text-5xl font-black text-[#EDEFF5] mb-2 tracking-tighter leading-none">
                    HELLO, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EDEFF5] via-[#A9B0C2] to-[#6F768A]">{currentProfile.name.toUpperCase()}</span>
                  </h1>
                  
                  <div className="inline-flex items-center gap-3 text-[#A9B0C2] text-sm">
                    <MapPin className="w-4 h-4 text-[#F5A623]" />
                    <span className="font-medium">{(currentProfile as any).location_name || (currentProfile as any).location || 'Unknown Location'}</span>
                  </div>
                </div>

                {/* Role Switcher & Search */}
                <div className="flex flex-col gap-3 w-full md:w-auto items-end">
                    <div className="bg-[#11162A] p-1 rounded-lg border border-[rgba(255,255,255,0.08)] flex items-center">
                        <button 
                            onClick={() => setUserRole('normal')}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${userRole === 'normal' ? 'bg-white text-black shadow-md' : 'text-[#6F768A] hover:text-white'}`}
                        >
                            <UserCheck className="w-3 h-3" /> Personal
                        </button>
                        <button 
                            onClick={() => setUserRole('astrologer')}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${userRole === 'astrologer' ? 'bg-[#6D5DF6] text-white shadow-md' : 'text-[#6F768A] hover:text-white'}`}
                        >
                            <BriefcaseIcon className="w-3 h-3" /> Astrologer
                        </button>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F768A]" />
                        <input 
                            type="text"
                            placeholder={userRole === 'normal' ? "Ask AI about your future..." : "Find chart tool..."}
                            value={moduleSearch}
                            onChange={(e) => setModuleSearch(e.target.value)}
                            className="w-full bg-[#11162A] border border-[rgba(255,255,255,0.08)] rounded-xl py-3 pl-10 pr-4 text-sm text-[#EDEFF5] placeholder:text-[#6F768A] focus:outline-none focus:border-[#F5A623] transition-colors shadow-lg"
                        />
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT LAYOUT */}
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-12">
            
            {userRole === 'normal' ? (
                // --- NORMAL USER LAYOUT ---
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-8">
                        {NORMAL_MODULES.map((module: any, idx) => (
                             <motion.div
                                key={module.title}
                                className={module.span}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <BentoCard 
                                    to={module.to}
                                    title={module.title}
                                    icon={module.icon}
                                    badge={module.badge}
                                    span={module.span}
                                    variant={module.variant as any}
                                    layout={module.layout}
                                    description={module.description}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Hidden Advanced Tools */}
                    <div className="border-t border-white/5 pt-4">
                        <button 
                            onClick={() => setShowHiddenNormal(!showHiddenNormal)}
                            className="w-full py-3 flex items-center justify-center gap-2 text-[#6F768A] hover:text-[#EDEFF5] text-sm font-medium transition-colors"
                        >
                            {showHiddenNormal ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            {showHiddenNormal ? "Hide Advanced Tools" : "Show Advanced Tools (KP, Jaimini, etc.)"}
                        </button>
                        
                        <AnimatePresence>
                            {showHiddenNormal && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 overflow-hidden"
                                >
                                    {[
                                        { to: "/kp/dashboard", title: "KP System", icon: Grid3X3 },
                                        { to: "/calculations/jaimini", title: "Jaimini", icon: Compass },
                                        { to: "/calculations/ashtakvarga", title: "Ashtakavarga", icon: Grid },
                                        { to: "/calculations/shadbala", title: "Shadbala", icon: BarChart2 },
                                    ].map((m) => (
                                        <BentoCard key={m.title} to={m.to} title={m.title} icon={m.icon} layout="minimal" />
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            ) : (
                // --- ASTROLOGER LAYOUT ---
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
                    {ASTRO_GROUPS.map((group) => (
                        <div key={group.id} className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#6D5DF6]/20 to-transparent opacity-50"></div>
                                <h2 className="text-xs font-black text-[#6D5DF6] uppercase tracking-[0.2em]">{group.title}</h2>
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#6D5DF6]/20 to-transparent opacity-50"></div>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                                {group.modules.map((module: any, idx) => (
                                    <motion.div
                                        key={module.title}
                                        className={module.span || "col-span-1"}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <BentoCard 
                                            to={module.to}
                                            title={module.title}
                                            icon={module.icon}
                                            badge={module.badge}
                                            span="col-span-1" // Override span for wrapper, pass logic to card or handle here? 
                                            // BentoCard has 'span' prop which applies class to button. 
                                            // If I wrap in div, the div needs the span class.
                                            // module.span contains "col-span-X".
                                            variant={module.variant as any}
                                            layout={module.layout}
                                            description={module.description}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
          </div>
        </div>
      </div>

      <CreateChartModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onChartCreated={refreshProfiles}
      />
    </MainLayout>
  );
};

export default Hub;
