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
    'Sun': { gradient: 'from-orange-500 to-amber-600' },
    'Moon': { gradient: 'from-blue-400 to-indigo-300' },
    'Mars': { gradient: 'from-red-600 to-rose-500' },
    'Mercury': { gradient: 'from-emerald-400 to-teal-500' },
    'Jupiter': { gradient: 'from-amber-400 to-yellow-500' },
    'Venus': { gradient: 'from-pink-400 to-rose-400' },
    'Saturn': { gradient: 'from-indigo-600 to-purple-700' },
    'Rahu': { gradient: 'from-slate-600 to-gray-700' },
    'Ketu': { gradient: 'from-orange-700 to-amber-800' }
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
        <div className={`border transition-all duration-300 ${isOpen ? 'bg-slate-800/40 border-slate-700/50 my-4 rounded-2xl shadow-lg' : 'bg-slate-900/20 border-white/5 rounded-xl hover:bg-slate-800/30 mb-3'}`}>
            <button
                onClick={onClick}
                className="w-full px-6 py-5 flex items-center justify-between text-left group"
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${bgClass} border border-white/5 transition-transform group-hover:scale-105`}>
                        <Icon className={`w-5 h-5 ${colorClass}`} />
                    </div>
                    <div>
                        <h3 className={`text-base font-bold ${isOpen ? 'text-white' : 'text-slate-200'} transition-colors`}>{title}</h3>
                        {subtitle && <p className="text-sm text-slate-400 italic mt-0.5">{subtitle}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {score && (
                        <div className={`hidden md:flex flex-col items-end mr-2 transition-opacity ${isOpen ? 'opacity-0' : 'opacity-100'}`}>
                            <span className={`text-lg font-bold ${score >= 70 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>{score}%</span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Potential</span>
                        </div>
                    )}
                    <div className={`p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-white/10 rotate-180' : 'text-slate-500 group-hover:text-white'}`}>
                        <ChevronDown className={`w-4 h-4 ${isOpen ? 'text-white' : 'text-slate-500'}`} />
                    </div>
                </div>
            </button>
            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="px-6 pb-6 pt-2 border-t border-white/5">
                    {children}
                </div>
            </div>
        </div>
    );
};

const DetailCard = ({ title, children, className = "" }: { title: string, children: React.ReactNode, className?: string }) => (
    <div className={`bg-slate-900/50 rounded-xl border border-white/5 overflow-hidden ${className}`}>
        <div className="bg-white/5 px-4 py-3 border-b border-white/5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{title}</h4>
        </div>
        <div className="p-4">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Col: House Insights (2/3 width) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="bg-slate-800/50 px-3 py-1 rounded-full border border-white/10">
                            <span className={`text-sm font-bold ${score >= 70 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>{score}% Potential</span>
                        </div>
                        {prediction?.trend && (
                            <div className="flex items-center gap-1 text-sm text-slate-400">
                                {prediction.trend === 'up' ? <TrendingUp className="w-3 h-3 text-emerald-400" /> : <TrendingDown className="w-3 h-3 text-rose-400" />}
                                <span className="uppercase tracking-wider text-[10px] font-bold">Trend</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {insights.map((insight, idx) => (
                            <div key={idx} className={`p-4 rounded-xl border ${insight.status === 'positive' ? 'bg-emerald-900/10 border-emerald-500/20' :
                                insight.status === 'caution' ? 'bg-rose-900/10 border-rose-500/20' :
                                    'bg-slate-800/40 border-slate-700/50'
                                }`}>
                                <div className="flex items-start gap-3">
                                    {insight.status === 'positive' ? <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> :
                                        insight.status === 'caution' ? <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" /> :
                                            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                    }
                                    <div>
                                        <p className={`text-xs font-bold uppercase mb-1 ${insight.status === 'positive' ? 'text-emerald-300' :
                                            insight.status === 'caution' ? 'text-rose-300' :
                                                'text-slate-300'
                                            }`}>{insight.houseName}</p>
                                        <p className="text-sm text-slate-300 leading-snug">{insight.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {prediction?.summary && (
                        <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-900/20 to-violet-900/20 border border-indigo-500/20 mt-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-indigo-400" />
                                <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">AI Insight</span>
                            </div>
                            <p className="text-sm text-slate-200 italic leading-relaxed">"{prediction.summary}"</p>
                        </div>
                    )}
                </div>

                {/* Right Col: Planetary Influences (1/3 width) */}
                <div className="space-y-4">
                    <DetailCard title="Planetary Influences">
                        <div className="space-y-3">
                            {karakas.map((p: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold bg-gradient-to-br ${PLANET_UI_CONFIG[p.name]?.gradient || 'from-slate-600 to-slate-700'}`}>
                                        {p.name.slice(0, 2)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white font-medium">{p.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{getSignName(p)} • {p.nakshatra || '-'}</p>
                                    </div>
                                    <div className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${p.dignityStatus === 'exalted' ? 'bg-emerald-500/20 text-emerald-300' :
                                        p.dignityStatus === 'debilitated' ? 'bg-rose-500/20 text-rose-300' :
                                            'bg-slate-700 text-slate-300'
                                        }`}>
                                        {p.dignityStatus || 'Neutral'}
                                    </div>
                                </div>
                            ))}
                            {karakas.length === 0 && <p className="text-sm text-slate-500 italic">No major planetary influences detected.</p>}
                        </div>
                    </DetailCard>

                    <DetailCard title="Key Themes">
                        <div className="flex flex-wrap gap-2">
                            {HOUSE_SIGNIFICATIONS[domain].themes.map((theme, i) => (
                                <span key={i} className="px-2 py-1 bg-white/5 border border-white/5 rounded-md text-[10px] text-slate-300 uppercase tracking-wide">
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
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg shadow-lg shadow-indigo-500/20">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        Your Cosmic Consultation
                    </h2>
                    <p className="text-slate-400 mt-1 ml-14">Detailed analysis of your life's blueprint</p>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-xs font-medium text-slate-300 border border-white/5 transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refresh
                </button>
            </div>

            {/* Accordion Container */}
            <div className="bg-[#0F0F16] border border-white/5 rounded-3xl p-6 shadow-2xl">

                {/* 1. Your Cosmic Identity */}
                <AccordionItem
                    icon={Star}
                    title="Your Cosmic Identity"
                    subtitle={`Ascendant in ${ascSign} • Moon in ${moonSign}`}
                    isOpen={openSection === 'identity'}
                    onClick={() => toggleSection('identity')}
                    colorClass="text-violet-400"
                    bgClass="bg-violet-500/10"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <p className="text-slate-300 italic mb-6 leading-relaxed text-lg">
                                "With <span className="text-violet-300 font-bold">{ascSign}</span> rising, you present yourself to the world with specific qualities. Your <span className="text-indigo-300 font-bold">{moonSign}</span> Moon reveals your emotional core, while your <span className="text-amber-300 font-bold">{sunSign}</span> Sun drives your soul's purpose."
                            </p>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { icon: Crown, label: "Lagna", sign: ascSign, color: "violet", desc: "Self, Body" },
                                    { icon: Moon, label: "Rashi", sign: moonSign, color: "indigo", desc: "Mind, Emotions" },
                                    { icon: Sun, label: "Sun", sign: sunSign, color: "amber", desc: "Soul, Ego" }
                                ].map((item, i) => (
                                    <div key={i} className={`bg-slate-800/40 p-4 rounded-xl border border-${item.color}-500/20 text-center`}>
                                        <item.icon className={`w-5 h-5 mx-auto mb-2 text-${item.color}-400`} />
                                        <p className="text-sm font-bold text-white mb-1">{item.sign}</p>
                                        <p className={`text-[10px] uppercase font-bold text-${item.color}-300/70`}>{item.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-slate-900/50 rounded-xl border border-white/5 p-4 flex flex-col justify-center text-center">
                            <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-3">
                                <Sparkles className="w-8 h-8 text-violet-400" />
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Chart Ruler</p>
                            <p className="text-xl font-bold text-white mb-2">{getDomainKarakas('health')[0]?.name || 'Jupiter'}</p>
                            <p className="text-xs text-slate-500">Guides your life path and overall destiny.</p>
                        </div>
                    </div>
                </AccordionItem>

                {/* 2. Life Mission (Career) */}
                <AccordionItem
                    icon={Target}
                    title="Your Life Mission & Purpose"
                    subtitle="Career path and karmic calling"
                    isOpen={openSection === 'career'}
                    onClick={() => toggleSection('career')}
                    colorClass="text-blue-400"
                    bgClass="bg-blue-500/10"
                    score={careerScore}
                >
                    {renderBentoGrid('career', 'career', careerScore)}
                </AccordionItem>

                {/* 3. Wealth & Prosperity */}
                <AccordionItem
                    icon={Wallet}
                    title="Wealth & Prosperity Patterns"
                    subtitle="Financial potential and luck"
                    isOpen={openSection === 'wealth'}
                    onClick={() => toggleSection('wealth')}
                    colorClass="text-emerald-400"
                    bgClass="bg-emerald-500/10"
                    score={wealthScore}
                >
                    {renderBentoGrid('wealth', 'wealth', wealthScore)}
                </AccordionItem>

                {/* 4. Love & Relationships */}
                <AccordionItem
                    icon={Heart}
                    title="Love & Relationships"
                    subtitle="Connection and harmony"
                    isOpen={openSection === 'relationships'}
                    onClick={() => toggleSection('relationships')}
                    colorClass="text-rose-400"
                    bgClass="bg-rose-500/10"
                    score={relatScore}
                >
                    {renderBentoGrid('relationships', 'love', relatScore)}
                </AccordionItem>

                {/* 5. Health & Vitality */}
                <AccordionItem
                    icon={Activity}
                    title="Health & Vitality"
                    subtitle="Physical well-being and energy"
                    isOpen={openSection === 'health'}
                    onClick={() => toggleSection('health')}
                    colorClass="text-teal-400"
                    bgClass="bg-teal-500/10"
                    score={healthScore}
                >
                    {renderBentoGrid('health', 'health', healthScore)}
                </AccordionItem>

                {/* 6. Current Cosmic Weather */}
                <AccordionItem
                    icon={RefreshCw}
                    title="Current Cosmic Weather"
                    subtitle="Daily energy forecast"
                    isOpen={openSection === 'weather'}
                    onClick={() => toggleSection('weather')}
                    colorClass="text-cyan-400"
                    bgClass="bg-cyan-500/10"
                >
                    <p className="text-slate-300 italic mb-6 leading-relaxed">
                        "The planets are always moving. Here is how the current transits are influencing your chart right now."
                    </p>

                    {periodOverview?.daily_analysis ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 p-5 rounded-xl border border-cyan-500/20">
                                <div className="flex items-center gap-2 mb-3">
                                    <Zap className="w-4 h-4 text-cyan-400" />
                                    <span className="text-xs font-bold text-cyan-300 uppercase">Opportunities</span>
                                </div>
                                <p className="text-sm text-slate-200">{periodOverview.daily_analysis.recommendation}</p>
                            </div>
                            <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 p-5 rounded-xl border border-amber-500/20">
                                <div className="flex items-center gap-2 mb-3">
                                    <Shield className="w-4 h-4 text-amber-400" />
                                    <span className="text-xs font-bold text-amber-300 uppercase">Challenges</span>
                                </div>
                                <p className="text-sm text-slate-200">Patience may be tested today. Avoid impulsive decisions.</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400">Daily forecast data is currently updating. Please check back shortly.</p>
                    )}
                </AccordionItem>

                {/* 7. Sacred Guidance & Remedies (Highlighted) */}
                <AccordionItem
                    icon={Shield}
                    title="Sacred Guidance & Remedies"
                    subtitle="Mantras, gemstones, and rituals"
                    isOpen={openSection === 'remedies'}
                    onClick={() => toggleSection('remedies')}
                    colorClass="text-amber-400"
                    bgClass="bg-amber-500/20"
                >
                    <div className="rounded-xl overflow-hidden border border-amber-500/20 mb-6 bg-gradient-to-b from-amber-900/10 to-transparent">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Sparkles className="w-5 h-5 text-amber-400" />
                                <h4 className="text-lg font-bold text-white">Remedies for {currentDashaMaha} Dasha</h4>
                            </div>
                            <p className="text-slate-300 mb-6 text-sm leading-relaxed">
                                You are currently running the Dasha of <span className="text-amber-300 font-bold">{currentDashaMaha}</span>.
                                To harmonize this energy and remove obstacles, the following Vedic remedies are recommended.
                            </p>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                {/* Mantra */}
                                <div className="bg-slate-900/60 p-4 rounded-xl border border-amber-500/10 flex items-start gap-4 lg:col-span-2">
                                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 font-serif font-bold text-xl">ॐ</div>
                                    <div>
                                        <p className="text-xs text-amber-400/80 font-bold uppercase mb-1">Sacred Mantra</p>
                                        <p className="text-lg text-white font-medium italic">"{remedyData?.mantra}"</p>
                                        <p className="text-xs text-slate-500 mt-1">Chant 108 times daily during sunrise</p>
                                    </div>
                                </div>

                                {/* Gemstone */}
                                <div className="bg-slate-900/60 p-4 rounded-xl border border-purple-500/10 flex items-start gap-4">
                                    <div className="p-2 bg-purple-500/10 rounded-lg">
                                        <DiamondIcon className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-purple-400/80 font-bold uppercase mb-1">Gemstone</p>
                                        <p className="text-white font-medium">{remedyData?.gemstone}</p>
                                        <p className="text-xs text-slate-500 mt-1">Wear on right hand</p>
                                    </div>
                                </div>

                                {/* Rituals */}
                                <div className="bg-slate-900/60 p-4 rounded-xl border border-emerald-500/10 lg:col-span-3">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Star className="w-4 h-4 text-emerald-400" />
                                        <span className="text-xs text-emerald-400/80 font-bold uppercase">Daily Practices</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        {remedyData?.recommendations.map((rec, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-slate-300 bg-emerald-500/5 px-3 py-2 rounded-lg border border-emerald-500/5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                {rec}
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
