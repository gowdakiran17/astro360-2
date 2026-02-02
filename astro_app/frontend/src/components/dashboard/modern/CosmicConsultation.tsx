import React, { useState } from 'react';
import {
    Sparkles, Star, ChevronDown, Heart, Activity,
    Wallet, Shield, Zap, RefreshCw, Sun, Moon,
    Target, Crown, TrendingUp, TrendingDown, CheckCircle, AlertCircle, Info
} from 'lucide-react';

interface CosmicConsultationProps {
    chartData: any;
    dashaData?: any;
    periodOverview?: any;
    aiPredictions?: any;
}

// --- Constants & Data ---

const HOUSE_SIGNIFICATIONS: Record<string, { houses: number[]; karakas: string[]; themes: string[] }> = {
    career: {
        houses: [10, 2, 11],
        karakas: ['Sun', 'Mercury', 'Jupiter', 'Saturn'],
        themes: ['Professional success', 'Wealth accumulation', 'Income and gains']
    },
    relationships: {
        houses: [7, 5, 11],
        karakas: ['Venus', 'Jupiter', 'Moon'],
        themes: ['Marriage and partnerships', 'Romance and children', 'Social connections']
    },
    health: {
        houses: [1, 6, 8],
        karakas: ['Sun', 'Mars', 'Moon'],
        themes: ['Vitality and constitution', 'Disease resistance', 'Longevity']
    },
    wealth: {
        houses: [2, 11, 9],
        karakas: ['Jupiter', 'Venus', 'Mercury'],
        themes: ['Accumulated wealth', 'Income sources', 'Fortune and luck']
    },
    spiritual: {
        houses: [9, 12, 5],
        karakas: ['Jupiter', 'Ketu', 'Moon'],
        themes: ['Dharma and philosophy', 'Liberation and transcendence', 'Past life merits']
    }
};

const PLANETARY_REMEDIES: Record<string, {
    deity: string;
    mantra: string;
    recommendations: string[];
    gemstone: string;
}> = {
    'Sun': {
        deity: 'Lord Vishnu / Surya',
        mantra: 'Om Hring Hrang Suryay Namah',
        recommendations: ['Perform Surya Namaskar', 'Serve your father', 'Donate wheat/copper'],
        gemstone: 'Ruby'
    },
    'Moon': {
        deity: 'Lord Shiva',
        mantra: 'Om Som Somay Namah',
        recommendations: ['Meditation', 'Respect mother', 'Donate milk/rice'],
        gemstone: 'Pearl'
    },
    'Mars': {
        deity: 'Lord Hanuman',
        mantra: 'Om Ang Angarkay Namah',
        recommendations: ['Recite Hanuman Chalisa', 'Exercise regularly', 'Donate red lentils'],
        gemstone: 'Red Coral'
    },
    'Mercury': {
        deity: 'Lord Ganesha',
        mantra: 'Om Bum Budhay Namah',
        recommendations: ['Chant Ganesh Mantra', 'Care for plants', 'Donate green clothes'],
        gemstone: 'Emerald'
    },
    'Jupiter': {
        deity: 'Lord Vishnu',
        mantra: 'Om Brim Brihaspataye Namah',
        recommendations: ['Respect teachers', 'Read scriptures', 'Donate turmeric/gold'],
        gemstone: 'Yellow Sapphire'
    },
    'Venus': {
        deity: 'Goddess Lakshmi',
        mantra: 'Om Shum Shukray Namah',
        recommendations: ['Worship Lakshmi', 'Keep surroundings clean', 'Donate white sweets'],
        gemstone: 'Diamond/Zircon'
    },
    'Saturn': {
        deity: 'Lord Shani',
        mantra: 'Om Sham Shanishcharay Namah',
        recommendations: ['Help the needy', 'Light lamp under Peepal tree', 'Donate black sesame'],
        gemstone: 'Blue Sapphire'
    },
    'Rahu': {
        deity: 'Goddess Durga',
        mantra: 'Om Ram Rahave Namah',
        recommendations: ['Worship Durga', 'Feed birds', 'Donate coconut'],
        gemstone: 'Gomed (Hessonite)'
    },
    'Ketu': {
        deity: 'Lord Ganesha',
        mantra: 'Om Kem Ketave Namah',
        recommendations: ['Spiritual retreat', 'Feed dogs', 'Donate blankets'],
        gemstone: 'Cat\'s Eye'
    }
};

const PLANET_UI_CONFIG: Record<string, { gradient: string }> = {
    'Sun': { gradient: 'from-yellow-400 to-orange-600' },
    'Moon': { gradient: 'from-blue-400 to-indigo-500' },
    'Mars': { gradient: 'from-orange-600 to-red-600' },
    'Mercury': { gradient: 'from-emerald-400 to-teal-500' },
    'Jupiter': { gradient: 'from-yellow-400 to-amber-500' },
    'Venus': { gradient: 'from-pink-400 to-rose-400' },
    'Saturn': { gradient: 'from-blue-600 to-indigo-700' },
    'Rahu': { gradient: 'from-slate-600 to-gray-700' },
    'Ketu': { gradient: 'from-amber-700 to-orange-800' }
};

// --- Helper Functions ---

const getSignName = (planet: any) => planet?.zodiac_sign || planet?.sign || '-';

const calculateScore = (domain: string, planets: any[]) => {
    const domInfo = HOUSE_SIGNIFICATIONS[domain];
    if (!domInfo) return 50;

    let score = 50;
    for (const planet of planets) {
        if (domInfo.karakas.includes(planet.name)) {
            if (!planet.retrograde) score += 5;
            if (planet.dignityStatus === 'exalted') score += 10;
            else if (planet.dignityStatus === 'own') score += 7;
            else if (planet.dignityStatus === 'debilitated') score -= 8;
        }
    }
    return Math.min(95, Math.max(35, score));
};

// --- Components ---

const AccordionItem = ({
    icon: Icon,
    title,
    subtitle,
    children,
    isOpen,
    onClick,
    colorClass = "text-indigo-400",
    bgClass = "bg-indigo-500/10",
    score
}: {
    icon: any;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClick: () => void;
    colorClass?: string;
    bgClass?: string;
    score?: number;
}) => {
    return (
        <div className={`transition-all duration-700 ${isOpen ? 'bg-white/[0.08] border-white/[0.15] my-10 rounded-[2.5rem] shadow-2xl scale-[1.01]' : 'bg-white/[0.05] border-white/[0.1] rounded-[2rem] hover:bg-white/[0.08] mb-4'} border overflow-hidden group/accordion relative backdrop-blur-md`}>
            {isOpen && <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-yellow-500/[0.05] to-transparent pointer-events-none" />}
            <button
                onClick={onClick}
                className="w-full px-6 md:px-10 py-6 md:py-8 flex items-center justify-between text-left group/btn relative z-10"
            >
                <div className="flex items-center gap-5 md:gap-7">
                    <div className={`p-3.5 rounded-2xl ${bgClass} border border-white/[0.08] transition-all duration-700 group-hover/btn:scale-110 group-hover/btn:rotate-6 shadow-xl`}>
                        <Icon className={`w-5 h-5 md:w-6 md:h-6 ${colorClass}`} />
                    </div>
                    <div>
                        <h3 className={`text-base md:text-lg font-black tracking-tight ${isOpen ? 'text-white' : 'text-white'} transition-colors uppercase tracking-[0.2em] leading-none mb-1.5`}>{title}</h3>
                        {subtitle && <p className="text-sm text-white font-black uppercase tracking-[0.1em] opacity-70 truncate max-w-[180px] md:max-w-none">{subtitle}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-4 md:gap-8">
                    {score && (
                        <div className={`hidden sm:flex flex-col items-end mr-2 transition-all duration-700 ${isOpen ? 'opacity-0 scale-90 translate-x-4' : 'opacity-100 translate-x-0'}`}>
                            <span className={`text-2xl font-black tracking-tighter ${score >= 70 ? 'text-yellow-400' : score >= 50 ? 'text-orange-400' : 'text-red-400'}`}>{score}%</span>
                            <span className="text-xs text-white uppercase font-black tracking-[0.2em]">Matrix</span>
                        </div>
                    )}
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-700 border border-white/5 ${isOpen ? 'bg-white/10 rotate-180 shadow-xl' : 'bg-white/5 group-hover/btn:bg-white/10'}`}>
                        <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-yellow-400' : 'text-white group-hover:text-white'}`} />
                    </div>
                </div>
            </button>
            <div
                className={`overflow-hidden transition-all duration-700 ease-in-out ${isOpen ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="px-6 md:px-12 pb-10 pt-4 border-t border-white/[0.08] relative z-10">
                    {children}
                </div>
            </div>
        </div>
    );
};

const DetailCard = ({ title, children, className = "" }: { title: string, children: React.ReactNode, className?: string }) => (
    <div className={`bg-white/[0.06] rounded-[2rem] border border-white/[0.12] overflow-hidden group/detail shadow-xl ${className}`}>
        <div className="bg-white/[0.04] px-6 py-4 border-b border-white/[0.08]">
            <h4 className="text-xs font-black text-white uppercase tracking-[0.3em]">{title}</h4>
        </div>
        <div className="p-7">
            {children}
        </div>
    </div>
);

const CosmicConsultation: React.FC<CosmicConsultationProps> = ({ chartData, dashaData, periodOverview, aiPredictions }) => {
    const [openSection, setOpenSection] = useState<string | null>('identity');

    if (!chartData) return null;

    const planets = chartData.planets || [];
    const ascendant = chartData.ascendant;
    const sun = planets.find((p: any) => p.name === 'Sun');
    const moon = planets.find((p: any) => p.name === 'Moon');
    const ascSign = getSignName(ascendant);
    const sunSign = getSignName(sun);
    const moonSign = getSignName(moon);

    const currentDashaMaha = dashaData?.current?.maha || 'Sun';
    const remedyData = PLANETARY_REMEDIES[currentDashaMaha] || PLANETARY_REMEDIES['Sun'];

    const toggleSection = (id: string) => {
        setOpenSection(openSection === id ? null : id);
    };

    // --- Calculations ---

    const getHouseStrength = (houseNum: number, domain: string) => {
        const domainInfo = HOUSE_SIGNIFICATIONS[domain];
        if (!domainInfo) return 25;

        const domainPlanets = domainInfo.karakas;
        let strength = 25;

        for (const planet of planets) {
            if (domainPlanets.includes(planet.name)) {
                if (!planet.retrograde) strength += 3;
                if (planet.dignityStatus === 'exalted') strength += 5;
                if (planet.dignityStatus === 'own') strength += 4;
                if (planet.dignityStatus === 'debilitated') strength -= 4;
            }
        }
        // Simple mock logic for house variation based on index
        const houseIndex = (houseNum - 1) % 12;
        strength += (houseIndex % 3) * 2;
        return Math.min(40, Math.max(15, strength));
    };

    const getHouseName = (house: number, domain: string) => {
        const names: Record<number, Record<string, string>> = {
            1: { health: 'Vitality House (1st)' },
            2: { career: 'Wealth House (2nd)', wealth: 'Accumulation House (2nd)' },
            5: { relationships: 'Romance House (5th)' },
            7: { relationships: 'Partnership House (7th)' },
            9: { wealth: 'Luck House (9th)', spiritual: 'Dharma House (9th)' },
            10: { career: 'Profession House (10th)' },
            11: { career: 'Gains House (11th)', wealth: 'Income House (11th)', relationships: 'Social House (11th)' },
            12: { spiritual: 'Liberation House (12th)' }
        };
        return names[house]?.[domain] || `House ${house}`;
    };

    const getHouseInsights = (domain: string) => {
        const domInfo = HOUSE_SIGNIFICATIONS[domain];
        if (!domInfo) return [];

        return domInfo.houses.map(house => {
            const strength = getHouseStrength(house, domain);
            let status: 'positive' | 'neutral' | 'caution' = strength > 30 ? 'positive' : strength < 20 ? 'caution' : 'neutral';
            let description = '';

            // Simplified varied descriptions
            if (status === 'positive') description = `Strong placement in the ${getHouseName(house, domain)} indicates favorable outcomes and natural support.`;
            else if (status === 'caution') description = `The ${getHouseName(house, domain)} requires attention. Obstacles may arise that need patience.`;
            else description = `Moderate strength in the ${getHouseName(house, domain)}. Progress depends on consistent effort.`;

            return { house, houseName: getHouseName(house, domain), strength, status, description };
        });
    };

    const getDomainKarakas = (domain: string) => {
        const domInfo = HOUSE_SIGNIFICATIONS[domain];
        if (!domInfo) return [];
        return planets.filter((p: any) => domInfo.karakas.includes(p.name));
    };

    // Scores
    const careerScore = calculateScore('career', planets);
    const wealthScore = calculateScore('wealth', planets);
    const relatScore = calculateScore('relationships', planets);
    const healthScore = calculateScore('health', planets);

    // Render Helpers
    const renderBentoGrid = (domain: string, aiKey: string, score: number) => {
        const insights = getHouseInsights(domain);
        const karakas = getDomainKarakas(domain);
        const prediction = aiPredictions?.[aiKey];

        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                {/* Left Col: House Insights (2/3 width) */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="flex flex-wrap items-center gap-6 mb-2">
                        <div className="bg-yellow-500/10 px-6 py-2.5 rounded-full border border-yellow-500/20 shadow-xl backdrop-blur-md">
                            <span className={`text-base font-black tracking-tight ${score >= 70 ? 'text-yellow-400' : score >= 50 ? 'text-orange-400' : 'text-red-400'}`}>{score}% Potential Matrix</span>
                        </div>
                        {prediction?.trend && (
                            <div className="flex items-center gap-3 text-white bg-white/[0.04] px-5 py-2.5 rounded-full border border-white/[0.1] shadow-xl">
                                {prediction.trend === 'up' ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : <TrendingDown className="w-4 h-4 text-rose-400" />}
                                <span className="uppercase tracking-[0.3em] text-sm font-black">Celestial Vector</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {insights.map((insight, idx) => (
                            <div key={idx} className={`p-8 rounded-[2rem] border transition-all duration-700 hover:scale-[1.03] shadow-xl ${insight.status === 'positive' ? 'bg-yellow-500/[0.04] border-yellow-500/20' :
                                insight.status === 'caution' ? 'bg-orange-500/[0.04] border-orange-500/20' :
                                    'bg-white/[0.06] border-white/[0.12]'
                                }`}>
                                <div className="flex flex-col gap-5">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xl ${insight.status === 'positive' ? 'bg-yellow-500/10 border-yellow-500/20' : insight.status === 'caution' ? 'bg-orange-500/10 border-orange-500/20' : 'bg-white/5 border-white/10'}`}>
                                        {insight.status === 'positive' ? <CheckCircle className="w-5 h-5 text-yellow-500 shrink-0" /> :
                                            insight.status === 'caution' ? <AlertCircle className="w-5 h-5 text-orange-500 shrink-0" /> :
                                                <Info className="w-5 h-5 text-white shrink-0" />
                                        }
                                    </div>
                                    <div>
                                        <p className={`text-sm font-black uppercase tracking-[0.3em] mb-2.5 ${insight.status === 'positive' ? 'text-yellow-400' :
                                            insight.status === 'caution' ? 'text-orange-400' :
                                                'text-white'
                                            }`}>{insight.houseName}</p>
                                        <p className="text-sm text-white leading-relaxed font-black tracking-tight uppercase">{insight.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {prediction?.summary && (
                        <div className="p-10 rounded-[2.5rem] bg-gradient-to-r from-yellow-500/[0.08] via-white/[0.03] to-transparent border border-white/[0.1] mt-8 relative overflow-hidden group/ai-box shadow-2xl">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl opacity-50" />
                            <div className="flex items-center gap-4 mb-6 relative z-10">
                                <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 group-hover/ai-box:rotate-[-12deg] transition-transform duration-700">
                                    <Sparkles className="w-6 h-6 text-yellow-400" />
                                </div>
                                <span className="text-base font-black text-yellow-400 uppercase tracking-[0.4em]">Cosmic Intelligence Synthesis</span>
                            </div>
                            <p className="text-lg md:text-xl text-white italic leading-relaxed font-bold relative z-10 drop-shadow-md">"{prediction.summary}"</p>
                        </div>
                    )}
                </div>

                {/* Right Col: Planetary Influences (1/3 width) */}
                <div className="space-y-4">
                    <DetailCard title="Planetary Influences">
                        <div className="space-y-3">
                            {karakas.map((p: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.01] border border-white/[0.03] hover:bg-white/[0.03] transition-all group/planet">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black bg-gradient-to-br ${PLANET_UI_CONFIG[p.name]?.gradient || 'from-slate-600 to-slate-700'} shadow-lg group-hover/planet:scale-110 transition-transform`}>
                                        {p.name.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white font-black tracking-tight">{p.name}</p>
                                        <p className="text-sm text-white font-bold uppercase tracking-widest truncate opacity-70">{getSignName(p)} • {p.nakshatra || '-'}</p>
                                    </div>
                                    <div className={`text-sm uppercase font-black px-2.5 py-1 rounded-full border ${p.dignityStatus === 'exalted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                        p.dignityStatus === 'debilitated' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                            'bg-white/5 text-white border-white/10'
                                        }`}>
                                        {p.dignityStatus || 'Neutral'}
                                    </div>
                                </div>
                            ))}
                            {karakas.length === 0 && <p className="text-sm text-white italic">No major planetary influences detected.</p>}
                        </div>
                    </DetailCard>

                    <DetailCard title="Key Themes">
                        <div className="flex flex-wrap gap-2">
                            {HOUSE_SIGNIFICATIONS[domain].themes.map((theme, i) => (
                                <span key={i} className="px-2 py-1 bg-white/5 border border-white/5 rounded-md text-sm text-white uppercase tracking-wide">
                                    {theme}
                                </span>
                            ))}
                        </div>
                    </DetailCard>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-12">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 px-4">
                <div className="flex items-center gap-7">
                    <div className="p-5 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-[2rem] shadow-2xl shadow-yellow-500/20 border border-white/20 relative group/header-icon overflow-hidden">
                        <div className="absolute inset-0 bg-white/30 translate-y-full group-hover/header-icon:translate-y-0 transition-transform duration-700" />
                        <Sparkles className="w-8 h-8 text-white relative z-10 shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase mb-2 leading-none">Cosmic Consultation</h2>
                        <p className="text-base text-yellow-500/70 font-black uppercase tracking-[0.4em]">Multidimensional analysis of your life blueprint</p>
                    </div>
                </div>
                <button className="w-full sm:w-auto flex items-center justify-center gap-4 px-8 py-4 bg-yellow-500/10 hover:bg-yellow-500/20 rounded-full text-base font-black text-yellow-400 border border-yellow-500/20 transition-all duration-700 uppercase tracking-[0.2em] group/refresh shadow-xl backdrop-blur-md">
                    <RefreshCw className="w-5 h-5 group-hover/refresh:rotate-180 transition-transform duration-1000" />
                    <span>Synchronize Matrix</span>
                </button>
            </div>

            {/* Accordion Container */}
            <div className="bg-white/[0.08] backdrop-blur-3xl border border-white/[0.15] rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group/consult">
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-indigo-500/[0.02] to-transparent pointer-events-none" />

                {/* 1. Your Cosmic Identity */}
                <AccordionItem
                    icon={Star}
                    title="Cosmic Identity"
                    subtitle={`${ascSign} Array • ${moonSign} Frequency`}
                    isOpen={openSection === 'identity'}
                    onClick={() => toggleSection('identity')}
                    colorClass="text-yellow-400"
                    bgClass="bg-yellow-500/10"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                        <div className="lg:col-span-2">
                            <div className="relative mb-12 group/quote px-4 md:px-0">
                                <div className="absolute -left-4 md:-left-8 top-0 text-7xl text-yellow-500/10 font-serif leading-none italic">"</div>
                                <p className="text-white italic leading-relaxed text-xl md:text-2xl font-bold pl-2 md:pl-4 tracking-tight drop-shadow-sm">
                                    With <span className="text-yellow-400 font-black uppercase tracking-tight">{ascSign}</span> coding your presence, you navigate reality. Your <span className="text-orange-400 font-black uppercase tracking-tight">{moonSign}</span> frequency governs the mind, while the <span className="text-yellow-400 font-black uppercase tracking-tight">{sunSign}</span> solar driver powers your fundamental archetype.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {[
                                    { icon: Crown, label: "Lagna", sign: ascSign, color: "yellow", desc: "Primal Identity" },
                                    { icon: Moon, label: "Rashi", sign: moonSign, color: "orange", desc: "Mental Vector" },
                                    { icon: Sun, label: "Sun", sign: sunSign, color: "yellow", desc: "Solar Core" }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/[0.04] p-8 rounded-[2.5rem] border border-white/[0.08] text-center hover:bg-white/[0.08] transition-all duration-700 group/id-item shadow-xl hover:scale-[1.05]">
                                        <div className={`w-14 h-14 rounded-2xl bg-${item.color}-500/10 border border-${item.color}-500/20 flex items-center justify-center mx-auto mb-5 group-hover/id-item:rotate-12 transition-transform shadow-xl`}>
                                            <item.icon className={`w-7 h-7 text-${item.color}-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]`} />
                                        </div>
                                        <p className="text-base font-black text-white mb-2 uppercase tracking-wide leading-none">{item.sign}</p>
                                        <p className={`text-sm uppercase font-black tracking-[0.3em] text-${item.color}-400 opacity-80 mb-4`}>{item.label}</p>
                                        <div className="h-0.5 w-8 bg-white/10 mx-auto rounded-full" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white/[0.04] rounded-[2.5rem] border border-white/[0.1] p-10 flex flex-col justify-center text-center relative overflow-hidden group/chart-ruler shadow-2xl hover:bg-white/[0.06] transition-all duration-700">
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/[0.08] to-transparent opacity-0 group-hover/chart-ruler:opacity-100 transition-opacity" />
                            <div className="w-24 h-24 rounded-[2.5rem] bg-yellow-500/10 flex items-center justify-center mx-auto mb-8 border border-yellow-500/20 shadow-2xl shadow-yellow-500/10 relative z-10 group-hover/chart-ruler:rotate-[-12deg] transition-transform">
                                <Sparkles className="w-12 h-12 text-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.4)]" />
                            </div>
                            <p className="text-base font-black text-white uppercase tracking-[0.4em] mb-3 relative z-10">Matrix Guardian</p>
                            <p className="text-4xl font-black text-white mb-6 tracking-tighter relative z-10 uppercase">{getDomainKarakas('health')[0]?.name || 'Jupiter'}</p>
                            <p className="text-sm text-white font-bold leading-relaxed relative z-10 px-4 opacity-90 italic">The primary resonant intelligence guiding your structural evolution and global trajectory.</p>
                        </div>
                    </div>
                </AccordionItem>

                {/* 2. Life Mission (Career) */}
                <AccordionItem
                    icon={Target}
                    title="Life Mission & Purpose"
                    subtitle="Karmic Calling Matrix"
                    isOpen={openSection === 'career'}
                    onClick={() => toggleSection('career')}
                    colorClass="text-yellow-400"
                    bgClass="bg-yellow-500/10"
                    score={careerScore}
                >
                    {renderBentoGrid('career', 'career', careerScore)}
                </AccordionItem>

                {/* 3. Wealth & Prosperity */}
                <AccordionItem
                    icon={Wallet}
                    title="Wealth & Prosperity"
                    subtitle="Abundance Potential"
                    isOpen={openSection === 'wealth'}
                    onClick={() => toggleSection('wealth')}
                    colorClass="text-yellow-400"
                    bgClass="bg-yellow-500/10"
                    score={wealthScore}
                >
                    {renderBentoGrid('wealth', 'wealth', wealthScore)}
                </AccordionItem>

                {/* 4. Love & Relationships */}
                <AccordionItem
                    icon={Heart}
                    title="Love & Connection"
                    subtitle="Relational Harmony"
                    isOpen={openSection === 'relationships'}
                    onClick={() => toggleSection('relationships')}
                    colorClass="text-orange-400"
                    bgClass="bg-orange-500/10"
                    score={relatScore}
                >
                    {renderBentoGrid('relationships', 'love', relatScore)}
                </AccordionItem>

                {/* 5. Health & Vitality */}
                <AccordionItem
                    icon={Activity}
                    title="Health & Vitality"
                    subtitle="Structural Integrity"
                    isOpen={openSection === 'health'}
                    onClick={() => toggleSection('health')}
                    colorClass="text-yellow-400"
                    bgClass="bg-yellow-500/10"
                    score={healthScore}
                >
                    {renderBentoGrid('health', 'health', healthScore)}
                </AccordionItem>

                {/* 6. Current Cosmic Weather */}
                <AccordionItem
                    icon={RefreshCw}
                    title="Cosmic Weather"
                    subtitle="Real-time Frequency Broadcast"
                    isOpen={openSection === 'weather'}
                    onClick={() => toggleSection('weather')}
                    colorClass="text-yellow-400"
                    bgClass="bg-yellow-500/10"
                >
                    <p className="text-white italic mb-10 leading-relaxed font-bold text-lg drop-shadow-sm px-2">
                        "The celestial bodies are in constant flux. Below is the current configuration's impact on your natal matrix."
                    </p>

                    {periodOverview?.daily_analysis ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-yellow-500/[0.08] to-orange-500/[0.08] p-8 rounded-[2rem] border border-yellow-500/20 shadow-xl relative overflow-hidden group/opt">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl opacity-50" />
                                <div className="flex items-center gap-4 mb-5 relative z-10">
                                    <div className="p-2.5 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                                        <Zap className="w-5 h-5 text-yellow-400" />
                                    </div>
                                    <span className="text-base font-black text-yellow-400 uppercase tracking-[0.3em]">Quantum Opportunities</span>
                                </div>
                                <p className="text-base text-white font-black tracking-tight leading-relaxed uppercase">{periodOverview.daily_analysis.recommendation}</p>
                            </div>
                            <div className="bg-gradient-to-br from-orange-500/[0.08] to-red-500/[0.08] p-8 rounded-[2rem] border border-orange-500/20 shadow-xl relative overflow-hidden group/ch">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl opacity-50" />
                                <div className="flex items-center gap-4 mb-5 relative z-10">
                                    <div className="p-2.5 bg-orange-500/10 rounded-xl border border-orange-500/20">
                                        <Shield className="w-5 h-5 text-orange-400" />
                                    </div>
                                    <span className="text-base font-black text-orange-400 uppercase tracking-[0.3em]">Vector Challenges</span>
                                </div>
                                <p className="text-base text-white font-black tracking-tight leading-relaxed uppercase">Internal resistance may manifest. Prioritize strategic patience over tactical velocity.</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-white italic font-black uppercase tracking-widest text-center py-10">Neural link initializing... Matrix broadcast pending.</p>
                    )}
                </AccordionItem>

                {/* 7. Sacred Guidance & Remedies (Highlighted) */}
                <AccordionItem
                    icon={Shield}
                    title="Sacred Guidance & Remedies"
                    subtitle="Vedic Harmonization Protocol"
                    isOpen={openSection === 'remedies'}
                    onClick={() => toggleSection('remedies')}
                    colorClass="text-yellow-400"
                    bgClass="bg-yellow-500/20"
                >
                    <div className="rounded-[2.5rem] overflow-hidden border border-yellow-500/20 mb-10 bg-gradient-to-b from-yellow-500/[0.06] to-transparent relative group/remedy-box shadow-2xl">
                        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-yellow-500/[0.04] to-transparent pointer-events-none" />
                        <div className="p-8 md:p-12 relative z-10">
                            <div className="flex items-center gap-7 mb-10">
                                <div className="p-4 bg-yellow-500/10 rounded-[1.5rem] border border-yellow-500/20 shadow-2xl shadow-yellow-500/10 group-hover/remedy-box:scale-110 group-hover/remedy-box:rotate-[15deg] transition-all duration-700">
                                    <Sparkles className="w-8 h-8 text-yellow-400" />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-white tracking-tighter uppercase leading-none mb-2">Remedies for {currentDashaMaha} Phase</h4>
                                    <p className="text-sm text-yellow-500/70 font-black uppercase tracking-[0.3em] opacity-80">Divine Frequency Alignment</p>
                                </div>
                            </div>
                            <p className="text-white mb-12 text-lg md:text-xl leading-relaxed font-bold italic drop-shadow-sm">
                                You are currently under the recursive influence of <span className="text-yellow-400 font-black uppercase tracking-tight">{currentDashaMaha}</span>.
                                To synchronize with this planetary matrix and mitigate dissonance, implement the following sacred harmonization protocols.
                            </p>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Mantra */}
                                <div className="bg-white/[0.04] p-8 md:p-10 rounded-[2.5rem] border border-yellow-500/20 flex flex-col md:flex-row items-start gap-8 lg:col-span-2 relative group/mantra hover:bg-white/[0.06] transition-all duration-700 shadow-xl">
                                    <div className="p-6 bg-yellow-500/10 rounded-[1.8rem] text-yellow-400 font-serif font-black text-5xl shadow-2xl border border-yellow-500/20 group-hover/mantra:scale-110 transition-transform flex items-center justify-center min-w-[100px] h-[100px]">ॐ</div>
                                    <div>
                                        <p className="text-sm text-yellow-500/60 font-black uppercase tracking-[0.4em] mb-4">Celestial Sonic Core</p>
                                        <p className="text-2xl text-white font-black italic tracking-wide leading-tight uppercase drop-shadow-md">"{remedyData?.mantra}"</p>
                                        <div className="flex items-center gap-4 mt-8">
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.6)]" />
                                            <p className="text-sm text-white uppercase font-black tracking-[0.3em] opacity-80">Invoke 108 units during Brahma Muhurta</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Gemstone */}
                                <div className="bg-white/[0.04] p-8 md:p-10 rounded-[2.5rem] border border-orange-500/20 flex flex-col items-center text-center group/gem hover:bg-white/[0.06] transition-all duration-700 shadow-xl">
                                    <div className="p-6 bg-orange-500/10 rounded-[1.8rem] border border-orange-500/20 mb-8 group-hover/gem:rotate-[20deg] transition-transform duration-700 shadow-2xl shadow-orange-500/10">
                                        <DiamondIcon className="w-10 h-10 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.4)]" />
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-sm text-orange-400/60 font-black uppercase tracking-[0.4em]">Resonant Gem</p>
                                        <p className="text-xl text-white font-black uppercase tracking-tighter leading-none">{remedyData?.gemstone}</p>
                                        <div className="h-0.5 w-8 bg-white/10 mx-auto rounded-full" />
                                        <p className="text-sm text-white uppercase font-black tracking-[0.3em]">Adorn on Solar Terminal</p>
                                    </div>
                                </div>

                                {/* Rituals */}
                                <div className="bg-white/[0.04] p-8 md:p-12 rounded-[2.5rem] border border-emerald-500/20 lg:col-span-3 group/rituals hover:bg-white/[0.06] transition-all duration-700 shadow-xl">
                                    <div className="flex items-center gap-5 mb-10">
                                        <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                            <Star className="w-5 h-5 text-emerald-400 animate-twinkle" />
                                        </div>
                                        <span className="text-base font-black text-emerald-400/70 uppercase tracking-[0.4em]">Daily Neural Harmonization</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {remedyData?.recommendations.map((rec, i) => (
                                            <div key={i} className="flex items-center gap-5 text-sm text-white bg-white/[0.02] px-8 py-5 rounded-[1.8rem] border border-white/[0.08] hover:border-emerald-500/30 hover:bg-white/[0.05] transition-all font-black uppercase tracking-tight group/rec shadow-lg">
                                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 group-hover/rec:scale-[1.4] transition-all shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
                                                <span className="opacity-90 leading-tight">{rec}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </AccordionItem>

            </div>
        </div>
    );
};

// Simple Icon component for the Diamond
const DiamondIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M6 3h12l4 6-10 13L2 9z" />
    </svg>
);

export default CosmicConsultation;
