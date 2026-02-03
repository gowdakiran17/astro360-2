import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Sparkles, Crown, Briefcase, Heart, Coins, Activity,
    Music, HandHeart, Flame, Ban, Coffee, Tent, Lock, Eye, ChevronRight, ChevronLeft,
    Award, HeartHandshake, TrendingUp,
    Sun, Sunrise, Sunset, Moon, Compass, CheckCircle2, Circle,
    ShieldCheck as ShieldPulse, Salad, Home
} from 'lucide-react';
import { ZODIAC_LORDS, VEDIC_REMEDIES } from '../../../data/remedyData';

interface PersonalizedRemediesProps {
    chartData: any;
    dashaData?: any;
    panchangData?: any;
}



const PLANETARY_COLORS: Record<string, string> = {
    'Sun': 'Orange',
    'Moon': 'White',
    'Mars': 'Red',
    'Mercury': 'Green',
    'Jupiter': 'Mustard Yellow',
    'Venus': 'White',
    'Saturn': 'Black or Blue',
    'Rahu': 'Smoky Grey',
    'Ketu': 'Multi-color'
};



const KRS_SHIVAYA_MANTRAS: Record<string, string> = {
    'Sun': 'Om Namah Shivaya Namo Suryaya',
    'Moon': 'Om Namah Shivaya Namo Chandraya',
    'Mars': 'Om Namah Shivaya Namo Mangalaya',
    'Mercury': 'Om Namah Shivaya Namo Budhaya',
    'Jupiter': 'Om Namah Shivaya Namo Brihaspataye',
    'Venus': 'Om Namah Shivaya Namo Gauraye',
    'Saturn': 'Om Namah Shivaya Namo Shanaishcharaya',
    'Rahu': 'Om Namah Shivaya Namo Rahave',
    'Ketu': 'Om Namah Shivaya Namo Ketave'
};

const YONI_ANIMALS: Record<string, string> = {
    'Ashvini': 'Horse', 'Bharani': 'Elephant', 'Krittika': 'Sheep', 'Rohini': 'Snake',
    'Mrigashirsha': 'Snake', 'Ardra': 'Dog', 'Punarvasu': 'Cat', 'Pushya': 'Goat',
    'Ashlesha': 'Cat', 'Magha': 'Rat', 'Purva Phalguni': 'Rat', 'Uttara Phalguni': 'Cow',
    'Hasta': 'Buffalo', 'Chitra': 'Tiger', 'Svati': 'Buffalo', 'Vishakha': 'Tiger',
    'Anuradha': 'Deer', 'Jyeshtha': 'Deer', 'Mula': 'Dog', 'Purva Ashadha': 'Monkey',
    'Uttara Ashadha': 'Mongoose', 'Shravana': 'Monkey', 'Dhanishta': 'Lion',
    'Shatabhisha': 'Horse', 'Purva Bhadrapada': 'Lion', 'Uttara Bhadrapada': 'Cow', 'Revati': 'Elephant'
};

const GANESHA_FORMS: Record<string, { name: string, mantra: string }> = {
    'Ashvini': { name: 'Dvija Ganapati', mantra: 'Om Dvija Ganapataye Namah' },
    'Bharani': { name: 'Siddhi Ganapati', mantra: 'Om Siddhi Ganapataye Namah' },
    'Krittika': { name: 'Ucchhishta Ganapati', mantra: 'Om Ucchhishta Ganapataye Namah' },
    'Rohini': { name: 'Vighna Ganapati', mantra: 'Om Vighna Ganapataye Namah' },
    'Mrigashirsha': { name: 'Kshipra Ganapati', mantra: 'Om Kshipra Ganapataye Namah' },
    'Ardra': { name: 'Heramba Ganapati', mantra: 'Om Heramba Ganapataye Namah' },
    'Punarvasu': { name: 'Lakshmi Ganapati', mantra: 'Om Lakshmi Ganapataye Namah' },
    'Pushya': { name: 'Maha Ganapati', mantra: 'Om Maha Ganapataye Namah' },
    'Ashlesha': { name: 'Vijaya Ganapati', mantra: 'Om Vijaya Ganapataye Namah' },
    'Magha': { name: 'Nritya Ganapati', mantra: 'Om Nritya Ganapataye Namah' },
    'Purva Phalguni': { name: 'Urdhva Ganapati', mantra: 'Om Urdhva Ganapataye Namah' },
    'Uttara Phalguni': { name: 'Ekakshara Ganapati', mantra: 'Om Ekakshara Ganapataye Namah' },
    'Hasta': { name: 'Vara Ganapati', mantra: 'Om Vara Ganapataye Namah' },
    'Chitra': { name: 'Tryakshara Ganapati', mantra: 'Om Tryakshara Ganapataye Namah' },
    'Svati': { name: 'Kshipra Prasada Ganapati', mantra: 'Om Kshipra Prasada Ganapataye Namah' },
    'Vishakha': { name: 'Haridra Ganapati', mantra: 'Om Haridra Ganapataye Namah' },
    'Anuradha': { name: 'Ekadanta Ganapati', mantra: 'Om Ekadanta Ganapataye Namah' },
    'Jyeshtha': { name: 'Srishti Ganapati', mantra: 'Om Srishti Ganapataye Namah' },
    'Mula': { name: 'Uddanda Ganapati', mantra: 'Om Uddanda Ganapataye Namah' },
    'Purva Ashadha': { name: 'Rinamochana Ganapati', mantra: 'Om Rinamochana Ganapataye Namah' },
    'Uttara Ashadha': { name: 'Dhundhi Ganapati', mantra: 'Om Dhundhi Ganapataye Namah' },
    'Shravana': { name: 'Dvimukha Ganapati', mantra: 'Om Dvimukha Ganapataye Namah' },
    'Dhanishta': { name: 'Trimukha Ganapati', mantra: 'Om Trimukha Ganapataye Namah' },
    'Shatabhisha': { name: 'Sinha Ganapati', mantra: 'Om Sinha Ganapataye Namah' },
    'Purva Bhadrapada': { name: 'Yoga Ganapati', mantra: 'Om Yoga Ganapataye Namah' },
    'Uttara Bhadrapada': { name: 'Durga Ganapati', mantra: 'Om Durga Ganapataye Namah' },
    'Revati': { name: 'Sankatahara Ganapati', mantra: 'Om Sankatahara Ganapataye Namah' }
};

const JYOTIRLINGA_MANTRAS: Record<string, { name: string, mantra: string }> = {
    'Aries': { name: 'Somnath', mantra: 'Om Namah Shivaya Namo Somnathaya' },
    'Taurus': { name: 'Mallikarjuna', mantra: 'Om Namah Shivaya Namo Mallikarjunaya' },
    'Gemini': { name: 'Mahakaleshwar', mantra: 'Om Namah Shivaya Namo Mahakaleshwaraya' },
    'Cancer': { name: 'Omkareshwar', mantra: 'Om Namah Shivaya Namo Omkareshwaraya' },
    'Leo': { name: 'Kedarnath', mantra: 'Om Namah Shivaya Namo Kedarnathaya' },
    'Virgo': { name: 'Bhimashankar', mantra: 'Om Namah Shivaya Namo Bhimashankaraya' },
    'Libra': { name: 'Kashi Vishwanath', mantra: 'Om Namah Shivaya Namo Vishwanathaya' },
    'Scorpio': { name: 'Trimbakeshwar', mantra: 'Om Namah Shivaya Namo Trimbakeshwaraya' },
    'Sagittarius': { name: 'Vaidyanath', mantra: 'Om Namah Shivaya Namo Vaidyanathaya' },
    'Capricorn': { name: 'Nageshwar', mantra: 'Om Namah Shivaya Namo Nageshwaraya' },
    'Aquarius': { name: 'Rameshwaram', mantra: 'Om Namah Shivaya Namo Rameshwaram' },
    'Pisces': { name: 'Grishneshwar', mantra: 'Om Namah Shivaya Namo Grishneshwaraya' }
};

const NAKSHATRA_ORDER = [
    'Ashvini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
    'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Svati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

const MantraBox: React.FC<{ title: string, mantra: string }> = ({ title, mantra }) => (
    <div className="bg-white/5 border border-white/5 rounded-2xl p-6 mb-6 border-b-4 border-b-yellow-500/50 shadow-xl transition-all hover:bg-white/10 group">
        <div className="flex items-center justify-between mb-4">
            <h5 className="text-white font-bold text-sm tracking-wide">{title}</h5>
            <div className="p-2 rounded-lg bg-yellow-500/10">
                <Music className="w-4 h-4 text-yellow-400" />
            </div>
        </div>
        <p className="text-white font-medium text-lg mb-6 leading-relaxed italic">{mantra}</p>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-yellow-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
            <Activity className="w-3 h-3" />
            Chant Now
        </button>
    </div>
);

const UpcomingDatesList: React.FC<{ dates: string[] }> = ({ dates }) => (
    <div className="space-y-3 mb-8">
        <h5 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Upcoming Auspicious Days</h5>
        {dates.map((date, idx) => (
            <div key={idx} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                <span className="text-slate-300 text-sm font-medium">{date}</span>
            </div>
        ))}
    </div>
);

// Activation Remedy Card Component
const ActivationRemedyCard: React.FC<{
    type: 'Career' | 'Love',
    planetName: string,
    planetColor: string,
    nakshatraAnimal: string,
    secondPlanetName?: string, // For Love (Venus)
    location: string,
    mantra?: string // Added Mantra prop
}> = ({ type, planetName, planetColor, nakshatraAnimal, secondPlanetName, location, mantra }) => {
    const [isStarted, setIsStarted] = useState(false);
    const [progress, setProgress] = useState(1); // Day 1-10
    const [showReminder, setShowReminder] = useState(false);

    const handleStart = () => {
        setIsStarted(true);
        // In a real app, this would save to backend
    };

    return (
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-[32px] p-8 md:p-10 mb-10 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-slate-200 relative overflow-hidden group">
            {/* Ambient Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] -mr-20 -mt-20 opacity-50" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] -ml-20 -mb-20 opacity-30" />

            <div className="max-w-xl mx-auto space-y-10 relative z-10">
                {/* Header */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-2">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg ${type === 'Career' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-pink-500/20 text-pink-400'}`}>
                            {type === 'Career' ? <Briefcase className="w-6 h-6" /> : <Heart className="w-6 h-6" />}
                        </div>
                        <div>
                            <h4 className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">{type} Activation Remedy</h4>
                            <p className="text-indigo-300/80 text-sm font-medium tracking-wide border-l-2 border-indigo-500/50 pl-2 mt-1">
                                Nakshatra-Based Energy Alignment
                            </p>
                        </div>
                    </div>

                </div>

                {/* Narrative with Highlight */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 relative">
                    <p className="text-slate-300 text-sm leading-relaxed italic">
                        "Activates planetary energy connected to your karma—not by force, but by alignment. Watch for opportunities, clarity, or shifts within 6–10 days."
                    </p>
                </div>

                {/* Important Note */}
                <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 text-xs text-amber-200/80 leading-relaxed flex gap-3">
                    <Activity className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                        <span className="font-bold text-amber-400 block mb-1">Vital Requirement</span>
                        {type === 'Career'
                            ? "Correct birth time is essential. If Ascendant houses shift, results may vary."
                            : "Proceed even if birth time is unknown by using Venus (Natural Karaka)."}
                    </div>
                </div>

                {/* Steps */}
                <div className="space-y-8 relative pl-2">
                    {/* Connecting Line */}
                    <div className="absolute left-[1.35rem] top-4 bottom-8 w-0.5 bg-gradient-to-b from-indigo-500/50 via-purple-500/30 to-transparent -z-10" />

                    {/* Step 1 */}
                    <div className="flex gap-6 group/step">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-indigo-500/30 text-indigo-400 font-bold flex items-center justify-center text-sm shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.2)] group-hover/step:border-indigo-400 transition-colors">1</div>
                        <div className="pb-2">
                            <h5 className="font-bold text-white text-lg mb-2 group-hover/step:text-indigo-300 transition-colors">Identify Your Planet</h5>
                            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-3">
                                {type === 'Career'
                                    ? "Find the planet ruling your 10th House (Career & Reputation)."
                                    : "Draw the Nakshatra animal of Venus & your 7th Lord."}
                            </p>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-bold uppercase tracking-wider shadow-inner">
                                <Sparkles className="w-3 h-3" />
                                <span>Target: {planetName} {secondPlanetName ? `& ${secondPlanetName}` : ''}</span>
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-6 group/step">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-white/20 text-slate-400 font-bold flex items-center justify-center text-sm shrink-0 group-hover/step:border-white/40 transition-colors">2</div>
                        <div className="pb-2">
                            <h5 className="font-bold text-white text-lg mb-2">Use the Planet's Color</h5>
                            <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5 w-fit pr-6">
                                <div className={`w-8 h-8 rounded-full shadow-lg ${type === 'Career' ? 'bg-yellow-500' : 'bg-pink-400'}`} style={{ boxShadow: `0 0 20px ${type === 'Career' ? '#fbbf24' : '#f472b6'}60` }} />
                                <div>
                                    <span className="block text-xs text-slate-500 font-bold uppercase">Use Color</span>
                                    <span className="text-white font-bold">{planetColor}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-6 group/step">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-white/20 text-slate-400 font-bold flex items-center justify-center text-sm shrink-0 group-hover/step:border-white/40 transition-colors">3</div>
                        <div className="pb-2 w-full">
                            <h5 className="font-bold text-white text-lg mb-2">Draw the Nakshatra Animal</h5>
                            <p className="text-sm text-slate-400 leading-relaxed mb-4">
                                Draw the <strong>{nakshatraAnimal}</strong>. It represents awakening dormant energy.
                            </p>

                            {/* Dynamic Animal Image */}
                            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 group-hover/step:border-indigo-500/50 transition-all shadow-2xl">
                                <img
                                    src="/remedies/cosmic_dog.png" // Temporary fallback due to generation limits
                                    alt="Cosmic Spirit Animal"
                                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                                <div className="absolute bottom-4 left-4">
                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-slate-900/80 px-2 py-1 rounded-md backdrop-blur-md border border-indigo-500/30">Cosmic Guide</span>
                                    <h6 className="text-xl font-bold text-white mt-1 drop-shadow-md">{nakshatraAnimal} Spirit</h6>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex gap-6 group/step">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-white/20 text-slate-400 font-bold flex items-center justify-center text-sm shrink-0 group-hover/step:border-white/40 transition-colors">4</div>
                        <div className="w-full">
                            <h5 className="font-bold text-white text-lg mb-2">Activate & Place</h5>

                            {/* Gentle Mantra Insertion - Glowing */}
                            {mantra && (
                                <div className="mb-4 p-5 bg-indigo-950/40 rounded-xl border border-indigo-500/30 relative overflow-hidden group/mantra">
                                    <div className="absolute top-0 right-0 p-2 opacity-20"><Music className="w-12 h-12 text-indigo-400" /></div>
                                    <span className="block text-[10px] font-bold text-indigo-400 mb-2 uppercase tracking-wide flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                                        Gentle Mantra
                                    </span>
                                    <p className="text-slate-300 italic text-sm mb-1">"While placing it, softly chant..."</p>
                                    <p className="text-lg font-medium text-white tracking-wide leading-relaxed drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                                        "{mantra}"
                                    </p>
                                </div>
                            )}

                            <p className="text-sm text-slate-400 leading-relaxed mb-3">
                                {type === 'Career'
                                    ? "Place the drawing with your resume."
                                    : "Place in a folder with a red rose."}
                            </p>

                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-900/20 px-3 py-2 rounded-lg border border-emerald-500/20 w-fit">
                                <Compass className="w-3 h-3" />
                                <span>Zone: {location}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Block */}
                <div className="pt-8 border-t border-white/10 flex flex-col gap-4">
                    {!isStarted ? (
                        <button
                            onClick={handleStart}
                            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-[0_10px_30px_rgba(79,70,229,0.4)] hover:shadow-[0_15px_40px_rgba(79,70,229,0.5)] transform hover:-translate-y-0.5"
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            Begin 10-Day Activation
                        </button>
                    ) : (
                        <div className="bg-slate-800/50 p-6 rounded-2xl border border-indigo-500/30 space-y-4 animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex items-center justify-between text-xs font-bold text-indigo-300 uppercase tracking-widest">
                                <span>Cycle Progress</span>
                                <span>Day {progress} / 10</span>
                            </div>
                            <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                                <div style={{ width: `${progress * 10}%` }} className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full relative overflow-hidden">
                                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-2">
                                <button onClick={() => setProgress(Math.min(10, progress + 1))} className="text-xs text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-bold transition-all shadow-lg">
                                    + Mark Today
                                </button>
                                <button onClick={() => setShowReminder(!showReminder)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${showReminder ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-700 text-slate-400 hover:text-white'}`}>
                                    <Activity className="w-3 h-3" />
                                    {showReminder ? 'Active' : 'Remind'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


const getHouseSign = (houseNum: number, ascSign: string): string => {
    const zodiacOrder = [
        'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];
    const ascIndex = zodiacOrder.indexOf(ascSign);
    if (ascIndex === -1) return '';
    return zodiacOrder[(ascIndex + (houseNum - 1)) % 12];
};


const PersonalizedRemedies: React.FC<PersonalizedRemediesProps> = ({ chartData, dashaData, panchangData }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'career' | 'love' | 'wealth' | 'health'>('overview');
    const [revealedIndex, setRevealedIndex] = useState(-1); // -1 means none revealed
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    const toggleCheck = (id: string) => {
        setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    useEffect(() => {
        setRevealedIndex(-1);
    }, [activeTab]);

    // Identify Current Dasha Lords for "Active Shield"
    const currentMahadasha = dashaData?.mahadasha?.planet;
    const currentAntardasha = dashaData?.antardasha?.planet;

    if (!chartData || !chartData.ascendant) return null;

    const normalize = (s: string) => s ? (s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()) : '';
    const ascSign = normalize(chartData.ascendant.sign); // Ensure normalized
    const ascLord = ZODIAC_LORDS[ascSign];
    if (!ascLord) return null;

    const planets = chartData?.planets || [];

    // Career Logic (D1 - Rasi) - Standardized to match User Chart
    // 10th House Lord from D1 Ascendant
    const d1TenthSign = getHouseSign(10, ascSign);
    const careerLord = ZODIAC_LORDS[d1TenthSign]; // Direct D1 10th Lord

    // Love Logic (D1 - Rasi)
    // 7th House Lord from D1 Ascendant
    const d1SeventhSign = getHouseSign(7, ascSign);
    const loveLord = ZODIAC_LORDS[d1SeventhSign]; // Direct D1 7th Lord

    const VenusPlan = planets.find((p: any) => p.name === 'Venus');
    const wealthLord = ZODIAC_LORDS[getHouseSign(2, ascSign)] || ZODIAC_LORDS[getHouseSign(11, ascSign)];
    const healthLord = ascLord;

    // Narrative Logic for Personalized Rituals
    const currentMoon = chartData?.planets?.find((p: any) => p.name === 'Moon');
    const janmaNak = panchangData?.nakshatra?.name || currentMoon?.nakshatra || "Ardra";
    const janmaSign = panchangData?.rasi || currentMoon?.sign || "Cancer";

    const janmaIdx = NAKSHATRA_ORDER.indexOf(janmaNak);
    const ganesha = GANESHA_FORMS[janmaNak] || GANESHA_FORMS['Ardra'];
    const jyotirlinga = JYOTIRLINGA_MANTRAS[janmaSign] || JYOTIRLINGA_MANTRAS['Cancer'];

    const abhishekaNak = NAKSHATRA_ORDER[(janmaIdx - 1 + 27) % 27];
    const thirteenthNak = NAKSHATRA_ORDER[(janmaIdx + 12) % 27];

    // Identify the Planet Nakshatras for Visual Reality Rituals
    const careerPlan = planets.find((p: any) => p.name === careerLord);
    const lovePlan = planets.find((p: any) => p.name === loveLord) || VenusPlan;

    const careerLordNak = careerPlan?.nakshatra || "Ardra";
    const loveLordNak = lovePlan?.nakshatra || "Bharani";

    const careerAnimal = YONI_ANIMALS[careerLordNak] || "Horse";
    const loveAnimal = YONI_ANIMALS[loveLordNak] || "Elephant";

    const careerColor = PLANETARY_COLORS[careerLord] || "Red";
    const loveColor = PLANETARY_COLORS[loveLord] || "White";

    const careerMantra = KRS_SHIVAYA_MANTRAS[careerLord] || KRS_SHIVAYA_MANTRAS['Jupiter'];
    const loveMantra = KRS_SHIVAYA_MANTRAS[loveLord] || KRS_SHIVAYA_MANTRAS['Venus'];

    let displayPlanet = ascLord;
    let contextTitle = "Ultimate Cosmic Alignment";
    let contextDesc = `Integrating your ${ascLord} energy across all planes of existence.`;

    if (activeTab === 'career') {
        displayPlanet = careerLord;
        contextTitle = "Professional Zenith";
        contextDesc = `Activating material and spiritual triggers for your ${careerLord} career path.`;
    } else if (activeTab === 'love') {
        displayPlanet = loveLord;
        contextTitle = "Sacred Union Alignment";
        contextDesc = `Harmonizing ${loveLord} influences for relationship flourishing.`;
    } else if (activeTab === 'wealth') {
        displayPlanet = wealthLord;
        contextTitle = "Abundance Manifestation";
        contextDesc = `Optimizing ${wealthLord} frequencies for material stability.`;
    } else if (activeTab === 'health') {
        displayPlanet = healthLord;
        contextTitle = "Pranic Resilience";
        contextDesc = `Strengthening your core ${healthLord} field for wellness.`;
    }

    const remedy = VEDIC_REMEDIES[displayPlanet] || VEDIC_REMEDIES['Sun'];

    const tabs = [
        { id: 'overview', label: 'Soul', icon: Sparkles },
        { id: 'career', label: 'Career', icon: Briefcase },
        { id: 'love', label: 'Love', icon: Heart },
        { id: 'wealth', label: 'Wealth', icon: Coins },
        { id: 'health', label: 'Health', icon: Activity },
    ];

    const nextSecret = () => {
        if (revealedIndex < 2) setRevealedIndex(prev => prev + 1);
    };

    const prevSecret = () => {
        if (revealedIndex > 0) setRevealedIndex(prev => prev - 1);
    };

    return (
        <div className="bg-[#0A0E1F]/90 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-2xl relative">

            {/* Expanded Header */}
            <div className="px-8 py-8 border-b border-white/10 bg-gradient-to-br from-black/60 via-amber-950/20 to-black/60">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/20 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.1)] group/icon">
                            <Sparkles className="w-8 h-8 text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)] group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-serif text-white italic tracking-tight uppercase">Celestial Toolkit</h2>
                            <p className="text-xs text-amber-400/90 font-black tracking-[0.4em] uppercase mt-1">Material • Behavioral • Secret</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap relative overflow-hidden
                                    ${isActive
                                        ? 'bg-amber-600/90 text-white shadow-[0_10px_25px_rgba(245,158,11,0.3)] scale-105'
                                        : 'bg-black/60 text-slate-400 border border-white/10 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                                {tab.label}
                                {isActive && (
                                    <motion.div layoutId="activeTabGlow" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" animate={{ x: ['100%', '-100%'] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="p-8">

                {/* Active Focus Header */}
                <div className="mb-14 p-10 bg-gradient-to-r from-black/40 to-transparent rounded-[2.5rem] border-l-[3px] border-amber-500 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full" />
                    <h3 className="text-4xl font-serif text-white mb-3 italic tracking-tight">{contextTitle}</h3>
                    <p className="text-slate-400 leading-relaxed max-w-2xl font-light italic">{contextDesc}</p>
                </div>

                <div className="space-y-12">
                    {/* Section 2: Karmic Realignment (Behavioral) moved to primary slot inside tabs */}

                    {/* Section 2: Karmic Realignment (Behavioral) */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <HandHeart className="w-5 h-5 text-indigo-400" />
                            <h4 className="text-lg font-bold text-white uppercase tracking-wider text-sm opacity-80">Karmic Realignment</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <RemedyCard
                                icon={<HandHeart className="w-6 h-6 text-indigo-400" />}
                                type="Daily Habit"
                                title={remedy.karma}
                                rationale={remedy.why.karma}
                                theme="indigo"
                                imageUrl="/remedies/remedy_habit.png"
                                isDashaActive={displayPlanet === currentMahadasha || displayPlanet === currentAntardasha}
                                isChecked={checkedItems[`habit-${displayPlanet}`]}
                                onToggle={() => toggleCheck(`habit-${displayPlanet}`)}
                                timing={remedy.timing}
                            />
                            <RemedyCard
                                icon={<Coffee className="w-6 h-6 text-orange-400" />}
                                type="Healing Diet"
                                title={remedy.diet}
                                rationale={remedy.why.diet}
                                theme="orange"
                                imageUrl="/remedies/remedy_diet.png"
                                isDashaActive={displayPlanet === currentMahadasha || displayPlanet === currentAntardasha}
                            />
                            <RemedyCard
                                icon={<Ban className="w-6 h-6 text-red-500" />}
                                type="Avoidance"
                                title={remedy.abstinence}
                                rationale={remedy.why.abstinence}
                                theme="red"
                                imageUrl="/remedies/remedy_avoidance.png"
                                isDashaActive={displayPlanet === currentMahadasha || displayPlanet === currentAntardasha}
                            />
                            <RemedyCard
                                icon={<Tent className="w-6 h-6 text-blue-400" />}
                                type="Space Clearing"
                                title={remedy.environment}
                                rationale={remedy.why.environment}
                                theme="blue"
                                imageUrl="/remedies/remedy_vastu.png"
                                isDashaActive={displayPlanet === currentMahadasha || displayPlanet === currentAntardasha}
                                direction={remedy.direction}
                            />
                            <RemedyCard
                                icon={<Crown className="w-6 h-6 text-amber-400" />}
                                type="Sacred Giving"
                                title={remedy.donation}
                                rationale={remedy.why.donation}
                                theme="amber"
                                footer={`Best Day: ${remedy.day}`}
                                imageUrl="/remedies/remedy_donation.png"
                                isDashaActive={displayPlanet === currentMahadasha || displayPlanet === currentAntardasha}
                                onToggle={() => toggleCheck(`donation-${displayPlanet}`)}
                                isChecked={checkedItems[`donation-${displayPlanet}`]}
                            />

                            {/* High-Fidelity Narrative Sections */}
                            {activeTab === 'career' && (
                                <div className="lg:col-span-3 space-y-12">
                                    <div className="bg-slate-800/20 rounded-3xl p-10 border border-white/5 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 -mr-20 -mt-20 opacity-5">
                                            <Briefcase className="w-full h-full text-indigo-400" />
                                        </div>

                                        <div className="max-w-3xl relative z-10">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                                                    <Briefcase className="w-6 h-6 text-indigo-400" />
                                                </div>
                                                <h3 className="text-3xl font-bold text-white tracking-tight">Career Alignment Narrative</h3>
                                            </div>

                                            <p className="text-slate-400 text-lg leading-relaxed mb-10">
                                                Personalized rituals to help you manage any career related activities based on your birth chart. These measures align your logical efforts with the cosmic timing of your {janmaNak} birth star.
                                            </p>

                                            <div className="space-y-16">
                                                {/* Ganesha Ritual */}
                                                <section>
                                                    <h4 className="text-xl font-bold text-white mb-4">Invoke Lord Ganesha Before Starting a New Venture</h4>
                                                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                                        Before stepping into a new venture, seek the blessings of Lord Ganesha, the remover of obstacles and the harbinger of success.
                                                        Honor the specific form of Ganesha associated with your <span className="text-indigo-400 font-bold">{janmaNak}</span> nakshatra for deeper alignment.
                                                    </p>
                                                    <MantraBox title={`${ganesha.name} Mantra (${janmaNak})`} mantra={ganesha.mantra} />
                                                </section>

                                                {/* Jyotirlinga Mantra */}
                                                <section>
                                                    <h4 className="text-xl font-bold text-white mb-4">Mantra for Finding a New Job</h4>
                                                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                                        If you're facing challenges in securing a new job, chant this powerful mantra. This aligns with the Jyotirlinga connected to your <span className="text-indigo-400 font-bold">{janmaSign}</span> Moon sign.
                                                    </p>
                                                    <MantraBox title={`Jyotirlinga Mantra - ${janmaSign}`} mantra={jyotirlinga.mantra} />
                                                    <p className="text-[11px] text-slate-500 italic mt-4">
                                                        * Recommended: Chant 108 times daily for 40 consecutive days with faith and sincerity.
                                                    </p>
                                                </section>

                                                {/* Activation Remedy Card */}
                                                <ActivationRemedyCard
                                                    type="Career"
                                                    planetName={careerLord}
                                                    planetColor={careerColor.replace('bg-', '').replace('-500', '')}
                                                    nakshatraAnimal={careerAnimal}
                                                    location="Southwest area of your home or office"
                                                    mantra={careerMantra}
                                                />

                                                {/* Abhisheka Nakshatra */}
                                                <section>
                                                    <h4 className="text-xl font-bold text-white mb-4">Unlock Honor and Recognition with Your Abhisheka Nakshatra ({abhishekaNak})</h4>
                                                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                                        The nakshatra preceding your birth star is your <span className="text-indigo-400 font-bold">Abhisheka Nakshatra</span>—a powerful key to receiving honors and recognition.
                                                        On days when the transit Moon aligns with {abhishekaNak}, perform Abhishekam (sacred water offering) to Lord Shiva.
                                                    </p>
                                                    <UpcomingDatesList dates={['February 12, 2026 01:43 PM', 'March 11, 2026 10:01 PM', 'April 08, 2026 05:54 AM']} />
                                                </section>

                                                {/* 13th Nakshatra */}
                                                <section>
                                                    <h4 className="text-xl font-bold text-white mb-4">Unlock Career Success with your 13th Nakshatra Ritual</h4>
                                                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                                        The 13th nakshatra (<span className="text-indigo-400 font-bold">{thirteenthNak}</span>) from your Janma Nakshatra holds a powerful influence over your destiny.
                                                        By aligning with its ruling planet and color, you can tap into hidden opportunities.
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                                            <span className="text-[10px] text-slate-500 uppercase font-black block mb-1">Ritual Color</span>
                                                            <span className="text-white font-bold">{remedy.color.replace('bg-', '')}</span>
                                                        </div>
                                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                                            <span className="text-[10px] text-slate-500 uppercase font-black block mb-1">Target Planet</span>
                                                            <span className="text-white font-bold">{displayPlanet}</span>
                                                        </div>
                                                    </div>
                                                    <UpcomingDatesList dates={['February 05, 2026 10:58 PM', 'March 05, 2026 09:10 AM']} />
                                                </section>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Standard Cards below the narrative for quick reference */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <RemedyCard icon={<Award className="w-6 h-6 text-emerald-400" />} type="Interview Success" title={remedy.situational.interview} rationale={remedy.why.interview} theme="emerald" imageUrl="/remedies/remedy_interview.png" />
                                        <RemedyCard icon={<Sparkles className="w-6 h-6 text-amber-400" />} type="Targeted Promotion" title={remedy.situational.promotion} rationale={remedy.why.promotion} theme="amber" imageUrl="/remedies/remedy_promotion.png" timing="midday" />
                                        <RemedyCard icon={<Briefcase className="w-6 h-6 text-indigo-400" />} type="Job Opportunity" title={remedy.situational.jobSearch} rationale={remedy.why.jobSearch} theme="indigo" imageUrl="/remedies/remedy_job.png" />
                                    </div>
                                </div>
                            )}
                            {activeTab === 'health' && (
                                <div className="lg:col-span-3 space-y-12">
                                    <div className="bg-slate-800/20 rounded-3xl p-10 border border-white/5 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 -mr-20 -mt-20 opacity-5">
                                            <ShieldPulse className="w-full h-full text-emerald-400" />
                                        </div>

                                        <div className="max-w-3xl relative z-10">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                                                    <ShieldPulse className="w-6 h-6 text-emerald-400" />
                                                </div>
                                                <h3 className="text-3xl font-bold text-white tracking-tight">Vitality & Restoration Narrative</h3>
                                            </div>

                                            <p className="text-slate-400 text-lg leading-relaxed mb-10">
                                                Optimizing your physical and mental well-being by aligning with the Ayurvedic and planetary rhythms in your chart. Health is the foundation of all cosmic success.
                                            </p>

                                            <div className="space-y-16">
                                                <section>
                                                    <h4 className="text-xl font-bold text-white mb-4">Planetary Bio-Rhythm Tuning</h4>
                                                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                                        Your chart indicates a sensitivity to {displayPlanet} cycles. Following the "Sacred Diet" of {remedy.diet} and practicing {remedy.abstinence} strengthens your internal immunity (Ojas).
                                                    </p>
                                                    <MantraBox title="Health & Vitality Mantra" mantra={remedy.mantra} />
                                                </section>

                                                <section>
                                                    <h4 className="text-xl font-bold text-white mb-4">Emotional Protection with Your Birth Star</h4>
                                                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                                        Mental peace is linked to your Janma Nakshatra. Performing the {janmaNak} symbolic ritual on transit days helps calm the nervous system.
                                                    </p>
                                                    <UpcomingDatesList dates={['February 20, 2026', 'March 19, 2026']} />
                                                </section>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <RemedyCard icon={<Salad className="w-6 h-6 text-emerald-400" />} type="Sacred Diet" title={remedy.diet} rationale={remedy.why.diet} theme="emerald" footer="Ayurvedic Principle" />
                                        <RemedyCard icon={<Ban className="w-6 h-6 text-rose-400" />} type="Abstinence" title={remedy.abstinence} rationale={remedy.why.abstinence} theme="rose" footer="Vitality Guard" />
                                        <RemedyCard icon={<Home className="w-6 h-6 text-indigo-400" />} type="Environment" title={remedy.environment} rationale={remedy.why.environment} theme="indigo" footer="Vastu Alignment" />
                                    </div>
                                </div>
                            )}
                            {activeTab === 'love' && (
                                <div className="lg:col-span-3 space-y-12">
                                    <div className="bg-slate-800/20 rounded-3xl p-10 border border-white/5 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 -mr-20 -mt-20 opacity-5">
                                            <Heart className="w-full h-full text-pink-400" />
                                        </div>

                                        <div className="max-w-3xl relative z-10">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center">
                                                    <Heart className="w-6 h-6 text-pink-400" />
                                                </div>
                                                <h3 className="text-3xl font-bold text-white tracking-tight">Sacred Union Narrative</h3>
                                            </div>

                                            <p className="text-slate-400 text-lg leading-relaxed mb-10">
                                                Harmonizing your relationship frequencies through Vedic rituals. These measures address the {loveLord} influence in your life, fostering stability and deep connection.
                                            </p>

                                            <div className="space-y-16">
                                                <ActivationRemedyCard
                                                    type="Love"
                                                    planetName={loveLord}
                                                    secondPlanetName="Venus"
                                                    planetColor={loveColor.replace('bg-', '').replace('-500', '')} // Simplify color class to name
                                                    nakshatraAnimal={loveAnimal}
                                                    location="North side of your home or bedroom"
                                                    mantra={loveMantra}
                                                />

                                                <section>
                                                    <h4 className="text-xl font-bold text-white mb-4">The Shukra-Gauri Alignment</h4>
                                                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                                        For those seeking a partner or stabilizing a bond, worship Goddess Lakshmi/Parvati. This specific {remedy.color.replace('bg-', '')} theme ritual helps bypass the "fire" of conflicts.
                                                    </p>
                                                    <MantraBox title="Marriage & Harmony Mantra" mantra={remedy.mantra} />
                                                </section>

                                                <section>
                                                    <h4 className="text-xl font-bold text-white mb-4">Removing Blocks with {janmaNak} Energy</h4>
                                                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                                        If there are delays or instabilities, performing Abhishekam on your <span className="text-pink-400 font-bold">Abhisheka Nakshatra ({abhishekaNak})</span> brings the necessary purification and grace.
                                                    </p>
                                                    <UpcomingDatesList dates={['February 12, 2026', 'March 11, 2026']} />
                                                </section>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <RemedyCard icon={<HeartHandshake className="w-6 h-6 text-pink-400" />} type="Marriage Success" title={remedy.situational.marriage} rationale={remedy.why.marriage || "Enhances the physical-emotional bond."} theme="pink" imageUrl="/remedies/remedy_marriage.png" />
                                        <RemedyCard icon={<Activity className="w-6 h-6 text-rose-400" />} type="Marriage Delay" title={remedy.situational.marriageDelay} rationale={remedy.why.marriageDelay} theme="rose" imageUrl="/remedies/remedy_delay.png" timing="sunset" />
                                        <RemedyCard icon={<Sparkles className="w-6 h-6 text-indigo-400" />} type="Marital Harmony" title={remedy.situational.marriageStability} rationale={remedy.why.marriageStability} theme="indigo" imageUrl="/remedies/remedy_harmony.png" />
                                    </div>
                                </div>
                            )}
                            {activeTab === 'wealth' && (
                                <div className="lg:col-span-3 space-y-12">
                                    <div className="bg-slate-800/20 rounded-3xl p-10 border border-white/5 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 -mr-20 -mt-20 opacity-5">
                                            <Coins className="w-full h-full text-amber-400" />
                                        </div>

                                        <div className="max-w-3xl relative z-10">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                                                    <Coins className="w-6 h-6 text-amber-400" />
                                                </div>
                                                <h3 className="text-3xl font-bold text-white tracking-tight">Abundance & Flow Narrative</h3>
                                            </div>

                                            <p className="text-slate-400 text-lg leading-relaxed mb-10">
                                                Activating the {wealthLord} wealth channels in your chart. Abundance is a frequency; these rituals help you tune into the "Mahalakshmi" energy of your chart.
                                            </p>

                                            <div className="space-y-16">
                                                <section>
                                                    <h4 className="text-xl font-bold text-white mb-4">The Kuber Activation</h4>
                                                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                                        Align your commercial efforts with the planetary day of <span className="text-amber-400 font-bold">{remedy.day}</span>. Placing the {remedy.metal} artifact in the {remedy.direction} zone stabilizes liquid cash.
                                                    </p>
                                                    <MantraBox title="Wealth Manifestation Mantra" mantra={remedy.mantra} />
                                                </section>

                                                <section>
                                                    <h4 className="text-xl font-bold text-white mb-4">Strategic Business Growth</h4>
                                                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                                        During the transit of <span className="text-amber-400 font-bold">{thirteenthNak}</span> (your 13th Nakshatra), initiate new financial ventures or audit your assets.
                                                    </p>
                                                    <UpcomingDatesList dates={['February 05, 2026', 'March 05, 2026']} />
                                                </section>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <RemedyCard icon={<TrendingUp className="w-6 h-6 text-blue-500" />} type="Business Growth" title={remedy.situational.businessGrowth} rationale={remedy.why.businessGrowth} theme="blue" imageUrl="/remedies/remedy_business.png" />
                                        <RemedyCard icon={<Coins className="w-6 h-6 text-amber-500" />} type="Market Dominance" title={remedy.situational.business} rationale={remedy.why.businessGrowth} theme="amber" imageUrl="/remedies/remedy_wealth.png" direction="North" />
                                    </div>
                                </div>
                            )}

                            {/* Expanded Sacred Vault (Hidden Secrets) */}
                            <div className="relative group/vault overflow-hidden rounded-3xl min-h-[220px] bg-slate-800/40 border border-fuchsia-500/10">
                                {revealedIndex === -1 ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-xl z-20 p-8 text-center">
                                        <div className="p-4 rounded-full bg-fuchsia-500/10 mb-5 relative">
                                            <Lock className="w-8 h-8 text-fuchsia-400" />
                                            <div className="absolute inset-0 rounded-full border border-fuchsia-500/20 animate-ping" />
                                        </div>
                                        <h4 className="text-white font-bold text-lg mb-2">Sacred Mystery Vault</h4>
                                        <p className="text-xs text-slate-400 mb-6 max-w-[200px]">Unlock 3 esoteric secrets for intensive karmic shift.</p>
                                        <button
                                            onClick={() => setRevealedIndex(0)}
                                            className="px-6 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-full text-xs font-bold shadow-xl shadow-fuchsia-900/40 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Open The Vault
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-7 flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-700 relative overflow-hidden">
                                        {/* Secret Image Overlay */}
                                        <div className="absolute top-0 right-0 w-48 h-48 -mr-12 -mt-12 opacity-5 rotate-12 pointer-events-none">
                                            <img src="/remedies/remedy_secret.png" alt="" className="w-full h-full object-cover" />
                                        </div>

                                        <div className="flex items-center justify-between mb-6 relative z-10 transition-opacity">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 rounded-xl bg-fuchsia-500/10">
                                                    <Lock className="w-4 h-4 text-fuchsia-400" />
                                                </div>
                                                <span className="text-[10px] uppercase font-bold tracking-widest text-fuchsia-400/80">Gupt Upay {revealedIndex + 1}/3</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={prevSecret}
                                                    disabled={revealedIndex === 0}
                                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-20 text-slate-400"
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={nextSecret}
                                                    disabled={revealedIndex === 2}
                                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-20 text-slate-400"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <h4 className="text-white font-medium text-lg mb-3 leading-snug">
                                                {remedy.secrets[revealedIndex]}
                                            </h4>
                                            <p className="text-sm text-slate-500 leading-relaxed italic">
                                                {remedy.why.vault}
                                            </p>
                                        </div>

                                        <div className="mt-6 flex items-center gap-1.5">
                                            {[0, 1, 2].map(i => (
                                                <div
                                                    key={i}
                                                    className={`h-1 rounded-full transition-all duration-300 ${i === revealedIndex ? 'w-8 bg-fuchsia-500' : 'w-2 bg-white/10'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Sonic Healing (Mantra) */}
                    <div className="bg-gradient-to-r from-indigo-900/40 to-slate-900/40 rounded-3xl p-10 border border-white/5 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
                        <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center shrink-0">
                            <Music className="w-10 h-10 text-indigo-400" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-[10px] uppercase font-black text-amber-500 tracking-[0.4em] block">Sacred Beeja Mantra</span>
                                <MantraCounter />
                            </div>
                            <p className="text-4xl md:text-5xl font-serif text-white italic tracking-wide leading-relaxed opacity-90">"{remedy.mantra}"</p>
                            <p className="text-xs text-amber-200/40 mt-6 italic font-light">{remedy.why.mantra}</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white/5 px-6 py-4 rounded-2xl border border-white/5 whitespace-nowrap">
                            <Flame className="w-5 h-5 text-orange-500" />
                            <span className="text-white font-medium">108 Times at Sunrise</span>
                        </div>
                    </div>

                </div>

                {/* Unified Footer */}
                <div className="mt-12 p-8 bg-indigo-500/5 rounded-3xl border border-indigo-500/10 flex items-start gap-4">
                    <Sparkles className="w-6 h-6 text-indigo-400 mt-1 shrink-0" />
                    <div>
                        <h4 className="text-white font-bold mb-2">The Multi-Dimensional Shield</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            True Vedic realignment requires attacking karmic blockages from three angles: **Material** (Gemstones/Metals to balance physical chemistry),
                            **Behavioral** (Habits/Diet to rewire psychology), and **Spiritual** (Mantras/Donations to align subtle energy bodies).
                            The **Sacred Vault** provides esoteric triggers to bypass deep-rooted stubborn cycles in your {activeTab === 'overview' ? 'life' : activeTab}.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Helper Components ---

const MantraCounter: React.FC = () => {
    const [count, setCount] = useState(0);
    const [active, setActive] = useState(false);

    return (
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-xl border border-white/5">
            <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase font-black leading-none">Repetitions</span>
                <span className="text-white font-bold text-lg">{count}/108</span>
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setActive(true);
                    setCount(prev => prev < 108 ? prev + 1 : 0);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${active ? 'bg-amber-600 text-white' : 'bg-black/40 text-slate-500 border border-white/5'}`}
            >
                {count === 0 ? 'Start Japa' : 'Count'}
            </button>
        </div>
    );
};


const RemedyCard: React.FC<{
    icon: React.ReactNode,
    type: string,
    title: string,
    rationale?: string,
    theme: string,
    footer?: string,
    imageUrl?: string,
    isDashaActive?: boolean,
    isChecked?: boolean,
    onToggle?: () => void,
    timing?: string,
    direction?: string
}> = ({ icon, type, title, rationale, theme, footer, imageUrl, isDashaActive, isChecked, onToggle, timing, direction }) => {
    const getTimingIcon = () => {
        if (timing === 'sunrise') return <Sunrise className="w-3 h-3 text-orange-400" />;
        if (timing === 'sunset') return <Sunset className="w-3 h-3 text-indigo-400" />;
        if (timing === 'night') return <Moon className="w-3 h-3 text-blue-300" />;
        return <Sun className="w-3 h-3 text-yellow-400" />;
    };

    return (
        <div className={`bg-[#0A0E1F]/90 rounded-[2.5rem] p-8 border transition-all duration-500 group overflow-hidden relative flex flex-col h-full shadow-2xl backdrop-blur-2xl
            ${isDashaActive ? 'border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.15)]' : 'border-white/10'}
            ${isChecked ? 'opacity-40 grayscale-[0.5]' : ''}
        `}>
            {isDashaActive && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                    <span className="px-4 py-1 rounded-full bg-amber-600 text-[8px] font-black text-white uppercase tracking-[0.3em] shadow-lg animate-pulse border border-white/10">
                        Active Shield
                    </span>
                </div>
            )}

            {imageUrl && (
                <div className="absolute top-0 right-0 w-40 h-40 -mr-16 -mt-16 opacity-5 group-hover:opacity-20 transition-all group-hover:scale-110 rotate-12 pointer-events-none">
                    <img src={imageUrl} alt="" className="w-full h-full object-cover rounded-full" />
                </div>
            )}

            <div className="flex items-center justify-between mb-5 relative z-10">
                <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl bg-${theme}-500/10`}>{icon}</div>
                    {onToggle && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onToggle(); }}
                            className={`p-2 rounded-xl transition-all ${isChecked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                        >
                            {isChecked ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                        </button>
                    )}
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] uppercase font-bold tracking-widest text-${theme}-400/80`}>{type}</span>
                    <div className="flex gap-2">
                        {timing && <div className="p-1 rounded bg-white/5 flex items-center gap-1" title={`Best time: ${timing}`}>{getTimingIcon()}</div>}
                        {direction && <div className="p-1 rounded bg-white/5 flex items-center gap-1" title={`Direction: ${direction}`}><Compass className="w-3 h-3 text-slate-400" /></div>}
                    </div>
                </div>
            </div>

            <h4 className="text-white font-bold text-xl leading-tight group-hover:text-amber-500 transition-colors relative z-10 mb-4">{title}</h4>

            {rationale && (
                <p className="text-[11px] text-slate-400 leading-relaxed italic mb-4 relative z-10">
                    <span className={`font-bold text-${theme}-400/80 mr-1`}>Benefit:</span>
                    {rationale}
                </p>
            )}

            {imageUrl && (
                <div className="mt-auto w-full h-28 rounded-2xl overflow-hidden border border-white/5 shrink-0 opacity-30 group-hover:opacity-80 transition-all group-hover:scale-[1.02] relative z-10">
                    <img src={imageUrl} alt={type} className="w-full h-full object-cover" />
                </div>
            )}
            {footer && <div className="mt-4 pt-4 border-t border-white/5 text-[10px] font-bold text-slate-500 tracking-wider relative z-10">{footer}</div>}
        </div>
    );
};

export default PersonalizedRemedies;
