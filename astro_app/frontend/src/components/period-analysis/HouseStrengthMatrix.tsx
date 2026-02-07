import { Star, TrendingUp, AlertCircle, ChevronDown, ChevronUp, CheckCircle, Sparkles, Zap, Shield, Flame, Gem, BookOpen } from 'lucide-react';
import { HouseStrength } from '../../types/periodAnalysis';
import { useState } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

interface HouseStrengthMatrixProps {
    strengths: {
        strongest_houses: HouseStrength[];
        sav: number[]; // Array of 12 scores
    };
}

// PREMIUM DATA MODEL
const HOUSE_DATA = [
    {
        name: "Self",
        full: "Self & Vitality",
        desc: "Body, appearance, vitality",
        keywords: ["Health", "Identity"],
        remedy: "Practice Sun Salutations at sunrise.",
        mantra: "Om Suryaya Namaha",
        gemstone: "Ruby",
        archetype: "The Sovereign",
        insight: "This house governs your physical vessel and how you project yourself to the world. A strong score here indicates robust health and charismatic presence.",
        activities: ["Health routine", "Grooming"],
        cautions: ["Neglect", "Ego"],
        purushartha: "Dharma",
        karaka: "Sun"
    },
    {
        name: "Wealth",
        full: "Wealth & Family",
        desc: "Finance, speech, family",
        keywords: ["Assets", "Speech"],
        remedy: "Donate food to the needy on Thursdays.",
        mantra: "Om Brihaspataye Namaha",
        gemstone: "Yellow Sapphire",
        archetype: "The Treasurer",
        insight: "Your accumulated resources, lineage, and the power of your voice. Strength here ensures financial stability and harmonious family bonds.",
        activities: ["Investment", "Family time"],
        cautions: ["Speech", "Spending"],
        purushartha: "Artha",
        karaka: "Jupiter"
    },
    {
        name: "Siblings",
        full: "Courage & Siblings",
        desc: "Courage, communication",
        keywords: ["Bravery", "Skills"],
        remedy: "Practice silence (Mauna) for 1 hour.",
        mantra: "Om Angarakaya Namaha",
        gemstone: "Red Coral",
        archetype: "The Warrior",
        insight: "The seat of your willpower and initiative. This energy drives you to take action, communicate effectively, and defend your boundaries.",
        activities: ["Writing", "Short travel"],
        cautions: ["Arguments", "Documents"],
        purushartha: "Kama",
        karaka: "Mars"
    },
    {
        name: "Home",
        full: "Home & Happiness",
        desc: "Mother, home, peace",
        keywords: ["Property", "Comfort"],
        remedy: "Keep the North-East corner of home clean.",
        mantra: "Om Somaya Namaha",
        gemstone: "Pearl",
        archetype: "The Nurturer",
        insight: "Your emotional anchor and inner sanctuary. It reflects your peace of mind, relationship with the mother, and physical property.",
        activities: ["Buy property", "Decor"],
        cautions: ["Conflict", "Vehicle"],
        purushartha: "Moksha",
        karaka: "Moon"
    },
    {
        name: "Creativity",
        full: "Creativity & Children",
        desc: "Intelligence, progeny",
        keywords: ["Ideas", "Romance"],
        remedy: "Chant Gayatri Mantra for clarity.",
        mantra: "Om Gram Grim Grum Sah Gurave Namah",
        gemstone: "Topaz",
        archetype: "The Creator",
        insight: "The spark of divine intelligence within you. This house rules your creative output, children, and speculation/investment luck.",
        activities: ["Creative work", "Trading"],
        cautions: ["Gambling", "Ego"],
        purushartha: "Dharma",
        karaka: "Jupiter"
    },
    {
        name: "Health",
        full: "Health & Service",
        desc: "Health, enemies, service",
        keywords: ["Routine", "Service"],
        remedy: "Feed stray animals or birds.",
        mantra: "Om Shanaye Namaha",
        gemstone: "Blue Sapphire",
        archetype: "The Healer",
        insight: "Your capacity to solve problems, overcome debts/enemies, and serve others. It's the house of daily grind and resilience.",
        activities: ["Checkup", "Service"],
        cautions: ["Debt", "Diet"],
        purushartha: "Artha",
        karaka: "Mars"
    },
    {
        name: "Partner",
        full: "Partnership & Marriage",
        desc: "Spouse, business",
        keywords: ["Spouse", "Contracts"],
        remedy: "Offer flowers to clear water sources.",
        mantra: "Om Shukraya Namaha",
        gemstone: "Diamond",
        archetype: "The Lover",
        insight: "How you relate to the 'Other'. Be it a spouse or a business partner, this house governs all contractual and committed unions.",
        activities: ["Contracts", "Network"],
        cautions: ["Conflict", "Fine print"],
        purushartha: "Kama",
        karaka: "Venus"
    },
    {
        name: "Change",
        full: "Transformation & Occult",
        desc: "Sudden events, occult",
        keywords: ["Occult", "Change"],
        remedy: "Donate to medical charities.",
        mantra: "Om Namo Bhagavate Rudraya",
        gemstone: "Blue Sapphire",
        archetype: "The Mystic",
        insight: "The house of hidden depths, sudden gains/losses, and deep transformation. It rules longevity and unearned wealth.",
        activities: ["Research", "Meditation"],
        cautions: ["Risks", "Sudden events"],
        purushartha: "Moksha",
        karaka: "Saturn"
    },
    {
        name: "Fortune",
        full: "Fortune & Dharma",
        desc: "Luck, higher learning",
        keywords: ["Luck", "Philosophy"],
        remedy: "Visit a temple or spiritual place.",
        mantra: "Om Gurave Namaha",
        gemstone: "Yellow Sapphire",
        archetype: "The Sage",
        insight: "Your reservoir of past-life merit (Bagya). It attracts mentors, higher knowledge, and divine grace into your life.",
        activities: ["Scriptures", "Temple"],
        cautions: ["Elders", "Dogmatism"],
        purushartha: "Dharma",
        karaka: "Jupiter"
    },
    {
        name: "Career",
        full: "Career & Status",
        desc: "Profession, fame",
        keywords: ["Job", "Authority"],
        remedy: "Offer water to the Sun at sunrise.",
        mantra: "Om Budhaya Namaha",
        gemstone: "Emerald",
        archetype: "The Ruler",
        insight: "Your public standing and command over the world (Karma). This is the apex of the chart, ruling career and reputation.",
        activities: ["Job app", "Meet boss"],
        cautions: ["Insubordination", "Reputation"],
        purushartha: "Artha",
        karaka: "Mercury"
    },
    {
        name: "Gains",
        full: "Gains & Network",
        desc: "Profits, friends",
        keywords: ["Profits", "Wishes"],
        remedy: "Share your gains with community.",
        mantra: "Om Vishnave Namaha",
        gemstone: "Topaz",
        archetype: "The Networker",
        insight: "The fulfillment of desires and gains from your work. It rules your social circles, elder siblings, and liquidity.",
        activities: ["Socialize", "Goals"],
        cautions: ["Greed", "Friends"],
        purushartha: "Kama",
        karaka: "Jupiter"
    },
    {
        name: "Loss",
        full: "Loss & Spirituality",
        desc: "Expenses, moksha",
        keywords: ["Expenses", "Solitude"],
        remedy: "Meditation before sleep.",
        mantra: "Om Namah Shivaya",
        gemstone: "Amethyst",
        archetype: "The Ascetic",
        insight: "The house of letting go. It governs expenses, foreign lands, sleep, and final liberation (Moksha).",
        activities: ["Charity", "Retreat"],
        cautions: ["Waste", "Sleep"],
        purushartha: "Moksha",
        karaka: "Saturn"
    }
];

const DetailedHouseCard = ({ index, score, isExpanded, onToggle }: { index: number, score: number, isExpanded: boolean, onToggle: () => void }) => {
    let status = 'neutral';
    let color = 'text-[#A9B0C2]';
    let borderColor = 'border-[#FFFFFF]/08';
    let trend = 'neutral';
    if (score >= 32) {
        status = 'strong';
        color = 'text-[#2ED573]';
        borderColor = 'border-[#2ED573]/30';
        trend = 'up';
    } else if (score >= 28) {
        status = 'neutral';
        color = 'text-[#F5A623]';
        borderColor = 'border-[#F5A623]/30';
        trend = 'flat';
    } else {
        status = 'weak';
        color = 'text-[#E25555]';
        borderColor = 'border-[#E25555]/30';
        trend = 'down';
    }

    const house = HOUSE_DATA[index];

    return (
        <div className={`group rounded-[1.5rem] border transition-all duration-300 relative overflow-hidden ${borderColor} ${isExpanded ? 'bg-[#11162A] shadow-2xl ring-1 ring-[#FFFFFF]/10 z-20 col-span-1 md:col-span-2 lg:col-span-3 scale-[1.02]' : 'bg-[#11162A]/60 hover:bg-[#11162A]/80'}`}>
            <button onClick={onToggle} className="p-5 w-full text-left focus:outline-none">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] lg:text-xs font-black text-[#A9B0C2] uppercase tracking-[0.2em] bg-[#FFFFFF]/04 px-2 py-1 rounded-lg border border-[#FFFFFF]/08">H{index + 1}</span>
                        <span className="text-[10px] lg:text-xs font-bold px-2 py-1 bg-[#F5A623]/10 text-[#F5A623] rounded-lg border border-[#F5A623]/20 uppercase tracking-wider">{house.purushartha}</span>
                        {isExpanded && <span className="text-[10px] lg:text-xs px-2 py-1 bg-[#6D5DF6]/10 text-[#6D5DF6] rounded-lg border border-[#6D5DF6]/20 flex items-center gap-1.5 uppercase tracking-wider font-bold"><Sparkles className="w-3 h-3" /> {house.archetype}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                        {status === 'strong' && <Sparkles className="w-4 h-4 text-[#2ED573] animate-pulse" />}
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-[#6F768A]" /> : <ChevronDown className="w-5 h-5 text-[#6F768A]" />}
                    </div>
                </div>

                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h4 className={`font-black mb-1 leading-tight ${isExpanded ? 'text-[#EDEFF5] text-3xl lg:text-4xl tracking-tight' : 'text-[#EDEFF5] text-lg lg:text-xl'}`}>{house.full}</h4>
                        {!isExpanded && <div className="flex flex-wrap gap-1.5 mt-2">{house.keywords.map(k => <span key={k} className="text-[10px] font-bold uppercase tracking-wider text-[#A9B0C2] bg-[#FFFFFF]/04 px-2 py-1 rounded-md border border-[#FFFFFF]/08">{k}</span>)}</div>}
                    </div>
                    <div className="text-right shrink-0">
                        <div className="flex items-center justify-end gap-2">
                            {trend === 'up' && <TrendingUp className="w-4 h-4 text-[#2ED573]" />}
                            {trend === 'down' && <AlertCircle className="w-4 h-4 text-[#E25555]" />}
                            <span className={`font-black font-display tracking-tighter ${color} ${isExpanded ? 'text-5xl lg:text-6xl drop-shadow-lg' : 'text-3xl lg:text-4xl'}`}>{score}</span>
                        </div>
                    </div>
                </div>
            </button>

            {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-[#FFFFFF]/08 animate-fade-in-down">

                    {/* 1. Deep Insight Block */}
                    <div className="mb-6 bg-[#0B0F1A] p-5 lg:p-6 rounded-2xl border border-[#FFFFFF]/08 shadow-inner">
                        <h5 className="text-xs font-black text-[#6F768A] uppercase tracking-widest mb-3 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" /> Cosmic Insight
                        </h5>
                        <p className="text-base lg:text-lg text-[#EDEFF5] leading-relaxed font-medium">
                            "{house.insight}"
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                        {/* 2. Action Plan Columns */}
                        <div className="bg-[#2ED573]/05 rounded-2xl p-4 lg:p-5 border border-[#2ED573]/10">
                            <h5 className="text-[10px] lg:text-xs font-black text-[#2ED573] uppercase tracking-widest mb-4 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Best Alignment</h5>
                            <ul className="space-y-3">{house.activities.map((act, i) => <li key={i} className="text-sm text-[#EDEFF5] flex items-start gap-2.5 font-medium"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#2ED573] shadow-[0_0_8px_rgba(46,213,115,0.5)]"></div> {act}</li>)}</ul>
                        </div>
                        <div className="bg-[#E25555]/05 rounded-2xl p-4 lg:p-5 border border-[#E25555]/10">
                            <h5 className="text-[10px] lg:text-xs font-black text-[#E25555] uppercase tracking-widest mb-4 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Shadows to Watch</h5>
                            <ul className="space-y-3">{house.cautions.map((c, i) => <li key={i} className="text-sm text-[#EDEFF5] flex items-start gap-2.5 font-medium"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#E25555] shadow-[0_0_8px_rgba(226,85,85,0.5)]"></div> {c}</li>)}</ul>
                        </div>

                        {/* 3. The Cosmic Apothecary (Remedies) */}
                        <div className="bg-[#6D5DF6]/05 rounded-2xl p-4 lg:p-5 border border-[#6D5DF6]/10 flex flex-col justify-between">
                            <div>
                                <h5 className="text-[10px] lg:text-xs font-black text-[#6D5DF6] uppercase tracking-widest mb-4 flex items-center gap-2"><Shield className="w-4 h-4" /> Cosmic Remedy</h5>
                                <p className="text-sm text-[#EDEFF5] indent-2 italic mb-4 font-medium leading-relaxed">"{house.remedy}"</p>
                            </div>
                            <div className="space-y-3 pt-4 border-t border-[#6D5DF6]/10">
                                <div className="flex items-center gap-3">
                                    <Flame className="w-4 h-4 text-[#F5A623]" />
                                    <span className="text-[10px] font-bold text-[#A9B0C2] uppercase tracking-wider">Mantra:</span>
                                    <span className="text-sm font-bold text-[#EDEFF5] tracking-wide">{house.mantra}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Gem className="w-4 h-4 text-[#6D5DF6]" />
                                    <span className="text-[10px] font-bold text-[#A9B0C2] uppercase tracking-wider">Gem:</span>
                                    <span className="text-sm font-bold text-[#EDEFF5] tracking-wide">{house.gemstone}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const HouseStrengthMatrix = ({ strengths }: HouseStrengthMatrixProps) => {
    const [expandedHouse, setExpandedHouse] = useState<number | null>(null);
    const scores = strengths.sav || [];

    // Prepare Data for Radar Chart
    const radarData = scores.map((score, i) => ({
        subject: `H${i + 1}`,
        A: score,
        fullMark: 40
    }));

    return (
        <div className="bg-[#11162A]/60 backdrop-blur-xl border border-[#FFFFFF]/08 rounded-3xl p-6 relative overflow-visible z-10"> {/* overflow-visible for expanded cards */}
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5A623]/05 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 relative z-10 gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-br from-[#F5A623]/20 to-[#6D5DF6]/20 rounded-2xl border border-[#F5A623]/20 shadow-lg shadow-[#F5A623]/10">
                        <Star className="w-8 h-8 text-[#F5A623]" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-[#EDEFF5] font-display uppercase tracking-wider">Life Balance Matrix</h3>
                        <p className="text-base text-[#A9B0C2] mt-1 font-medium">12-Point Analysis & Strength Distribution</p>
                    </div>
                </div>
                <button className="text-xs font-bold text-[#F5A623] bg-[#F5A623]/10 hover:bg-[#F5A623]/20 px-4 py-2 rounded-full border border-[#F5A623]/20 transition-colors flex items-center gap-2 self-start md:self-auto shadow-lg">
                    <Zap className="w-4 h-4" /> AI Insights Active
                </button>
            </div>

            {/* Radar Chart Section */}
            <div className="mb-10 h-[280px] w-full bg-[#0B0F1A]/30 rounded-3xl border border-[#FFFFFF]/08 relative mx-auto">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                        <PolarGrid stroke="#1E293B" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#A9B0C2', fontSize: 11, fontWeight: 'bold' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 45]} tick={false} axisLine={false} />
                        <Radar name="Strength" dataKey="A" stroke="#6D5DF6" strokeWidth={3} fill="#6D5DF6" fillOpacity={0.2} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(11, 15, 26, 0.95)', borderColor: '#1E293B', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                            itemStyle={{ color: '#EDEFF5' }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
                {/* Overlay Title */}
                <div className="absolute top-4 left-6 pointer-events-none">
                    <span className="text-[10px] font-bold text-[#6F768A] uppercase tracking-widest">Strength Geomap</span>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10 transition-all">
                {scores.map((score, idx) => (
                    <DetailedHouseCard
                        key={idx}
                        index={idx}
                        score={score}
                        isExpanded={expandedHouse === idx}
                        onToggle={() => setExpandedHouse(expandedHouse === idx ? null : idx)}
                    />
                ))}
            </div>
        </div>
    );
};

export default HouseStrengthMatrix;
