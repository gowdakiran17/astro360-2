import React from 'react';
import { Gem, Shield, Star, AlertTriangle, Sparkles, Heart, Zap, Anchor, ArrowRight } from 'lucide-react';

interface RemediesRecommendationsProps {
    currentDasha?: {
        maha: string;
        antar?: string | null;
    } | null;
}

const PLANETARY_REMEDIES: Record<string, {
    deity: string;
    mantra: string;
    donation: string;
    fasting: string;
    recommendations: string[];
    cautions: string[];
    career: string;
    health: string;
    wealth: string;
    color: string;
}> = {
    'Sun': {
        deity: 'Lord Vishnu / Surya Narayana',
        mantra: 'Om Hring Hrang Suryay Namah',
        donation: 'Copper, Wheat, Jaggery',
        fasting: 'Sundays (Eat before sunset, avoid salt)',
        career: 'Take leadership roles, build relations with authority, maintain punctuality.',
        health: 'Strengthen vitality through Surya Namaskar, focus on heart and eye health.',
        wealth: 'Invest in secure government bonds or gold, avoid impulsive spending.',
        recommendations: [
            'Perform Surya Namaskar at sunrise',
            'Offer water (Arghya) to the Sun',
            'Respect father and elders',
            'Read Aditya Hridaya Stotra'
        ],
        cautions: [
            'Avoid ego-centric behavior',
            'Don\'t skip breakfast',
            'Avoid harsh speech with authority figures'
        ],
        color: 'emerald'
    },
    'Moon': {
        deity: 'Lord Shiva / Goddess Parvati',
        mantra: 'Om Shrang Shring Shroung Sah Chandramase Namah',
        donation: 'Milk, Rice, White Cloth, Silver',
        fasting: 'Mondays (Avoid sour food, use milk products)',
        career: 'Excel in public-facing or creative roles, trust your intuition in business.',
        health: 'Maintain emotional balance, prioritize sleep, stay hydrated.',
        wealth: 'Focus on consistent savings, avoid emotional or mood-based purchases.',
        recommendations: [
            'Meditation and deep breathing',
            'Service to mother and elderly women',
            'Drink water from silver glass',
            'Chant Shiva Panchakshari Mantra'
        ],
        cautions: [
            'Avoid staying late at night',
            'Control emotional swings',
            'Avoid isolation and negative thoughts'
        ],
        color: 'emerald'
    },
    'Mars': {
        deity: 'Lord Hanuman / Lord Kartikeya',
        mantra: 'Om Krang Kring Kroung Sah Bhaumay Namah',
        donation: 'Red Lentils (Masoor Dal), Copper, Jaggery',
        fasting: 'Tuesdays (Avoid salty/spicy food, eat jaggery)',
        career: ' Excel in technical, engineering, or real estate fields. Be bold but strategic.',
        health: 'Channel energy into sports or exercise, watch for inflammatory conditions.',
        wealth: 'Invest in real estate or land, avoid high-risk speculative gambling.',
        recommendations: [
            'Recite Hanuman Chalisa daily',
            'Maintain physical discipline and exercise',
            'Visit Hanuman temple on Tuesdays',
            'Contribute to blood donation camps'
        ],
        cautions: [
            'Avoid arguments and aggression',
            'Be extremely careful while driving',
            'Avoid hasty or impulsive decisions'
        ],
        color: 'emerald'
    },
    'Mercury': {
        deity: 'Lord Ganesha / Lord Vishnu',
        mantra: 'Om Brang Bring Broung Sah Budhay Namah',
        donation: 'Green Gram (Moong Dal), Camphor, Green Cloth',
        fasting: 'Wednesdays (Eat green vegetables, avoid dairy)',
        career: 'Great for commerce, writing, and networking. Double-check all contracts.',
        health: 'Nourish the nervous system, practice mind-calming activities, protect skin.',
        wealth: 'Focus on diversified investments, use logic rather than luck for financial growth.',
        recommendations: [
            'Worship Lord Ganesha with Durva grass',
            'Feed green fodder to cows',
            'Practice silence for some time daily',
            'Read spiritual or educational books'
        ],
        cautions: [
            'Avoid skin-related negligence',
            'Don\'t overthink small issues',
            'Be mindful of your communication'
        ],
        color: 'emerald'
    },
    'Jupiter': {
        deity: 'Lord Vishnu / Lord Brahma',
        mantra: 'Om Gram Grim Groum Sah Gurave Namah',
        donation: 'Yellow Dal (Chana Dal), Turmeric, Gold, Yellow Cloth',
        fasting: 'Thursdays (Avoid salt, use turmeric/banana)',
        career: 'Growth in teaching, advisory, law, or spiritual guidance. Share your wisdom.',
        health: 'Focus on liver health, avoid overindulgence in sugar and fatty foods.',
        wealth: 'Stable traditional investments, philanthropic giving boosts financial karma.',
        recommendations: [
            'Respect teachers and mentors',
            'Worship Banana tree on Thursdays',
            'Apply Tilak of Saffron/Turmeric',
            'Read religious scriptures daily'
        ],
        cautions: [
            'Avoid over-eating and weight gain',
            'Don\'t be judgmental of others',
            'Avoid excessive optimism without action'
        ],
        color: 'emerald'
    },
    'Venus': {
        deity: 'Goddess Lakshmi / Goddess Durga',
        mantra: 'Om Drang Dring Droung Sah Shukray Namah',
        donation: 'White Sweets, Fragrance, Silk Cloth, Curd',
        fasting: 'Fridays (Avoid sour food, eat milk-based sweets)',
        career: 'Success in luxury, art, design, or relationship-driven industries.',
        health: 'Maintain hormonal balance, prioritize reproductive health and self-care.',
        wealth: 'Wealth grows through aesthetic value and female partnerships. Avoid over-luxury.',
        recommendations: [
            'Worship Goddess Lakshmi',
            'Maintain cleanliness and use fragrance',
            'Be respectful towards partner and women',
            'Practice any form of art or music'
        ],
        cautions: [
            'Avoid luxury-driven overspending',
            'Don\'t compromise on ethics for pleasure',
            'Maintain balance in relationships'
        ],
        color: 'emerald'
    },
    'Saturn': {
        deity: 'Lord Shani / Lord Hanuman',
        mantra: 'Om Pram Prim Proum Sah Shanaye Namah',
        donation: 'Black Til, Mustard Oil, Iron, Black Cloth',
        fasting: 'Saturdays (Avoid oily food, eat khichdi)',
        career: 'Consistent hard work in long-term projects, industries involving labor or structure.',
        health: 'Focus on bone, joint, and dental health. Practice regular stretching.',
        wealth: 'Slow and steady wealth accumulation, invest in long-term stable assets.',
        recommendations: [
            'Service to laborers and poor people',
            'Light mustard oil lamp under Peepal tree',
            'Recite Shani Chalisa on Saturdays',
            'Stay disciplined and work hard'
        ],
        cautions: [
            'Avoid shortcuts and deceit',
            'Don\'t skip your responsibilities',
            'Be patient with delays and hurdles'
        ],
        color: 'emerald'
    },
    'Rahu': {
        deity: 'Goddess Durga / Lord Bhairava',
        mantra: 'Om Brang Bring Broung Sah Rahave Namah',
        donation: 'Lead, Mustard Seeds, Multi-colored Cloth',
        fasting: 'Saturdays (Avoid meat/intoxicants, eat simple food)',
        career: ' excel in tech, innovation, foreign trade, or media. Beware of illusions.',
        health: 'Focus on respiratory health, be wary of ambiguous symptoms, avoid toxicity.',
        wealth: 'Unconventional wealth paths, but avoid greed-driven high-risk speculation.',
        recommendations: [
            'Worship Goddess Durga',
            'Service to people with leprosy or disabilities',
            'Chant Rahu Stotra',
            'Stay away from intoxicants'
        ],
        cautions: [
            'Avoid confusion and illusions',
            'Don\'t indulge in speculative gambling',
            'Stay away from obsessive thoughts'
        ],
        color: 'emerald'
    },
    'Ketu': {
        deity: 'Lord Ganesha / Lord Matsya',
        mantra: 'Om Strang String Stroung Sah Ketave Namah',
        donation: 'Blankets, Sesame Seeds, Flags',
        fasting: 'Tuesdays (Avoid spicy food, eat root vegetables)',
        career: 'Growth in research, data science, spiritual fields, or forensic work.',
        health: 'Focus on gut health, be attentive to subtle intuitive health signs.',
        wealth: 'Wealth through inheritance or spiritual work. Detachment from greed helps.',
        recommendations: [
            'Worship Lord Ganesha',
            'Donate blankets to those in need',
            'Practice Vairagya (Detachment)',
            'Spend time in spiritual seclusion'
        ],
        cautions: [
            'Avoid sudden emotional outbursts',
            'Stay cautious of hidden enemies',
            'Don\'t ignore spiritual intuitive signs'
        ],
        color: 'emerald'
    }
};

const RemediesRecommendations: React.FC<RemediesRecommendationsProps> = ({ currentDasha }) => {
    const planet = currentDasha?.maha || 'Sun';
    const data = PLANETARY_REMEDIES[planet] || PLANETARY_REMEDIES['Sun'];

    return (
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-emerald-500/20 overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-600/30 to-teal-600/30 px-6 py-4 border-b border-emerald-500/20 flex items-center justify-between">
                <h2 className="text-xl font-black text-emerald-50 text-white flex items-center gap-3 tracking-tight">
                    <Gem className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                    Remedies & Recommendations
                </h2>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                    <Zap className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-200 uppercase tracking-widest">{planet} Dasha Active</span>
                </div>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
                    {/* Left Side: Visual & Primary Remedies */}
                    <div className="space-y-6">
                        <div className="relative group rounded-2xl overflow-hidden aspect-[16/9] border border-slate-700/50">
                            <img
                                src="/remedies_banner.png"
                                alt="Mystical Vedic Remedies"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-end p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-4 h-4 text-emerald-400" />
                                    <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">Planetary Wisdom</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Harness the Energy of {planet}</h3>
                                <p className="text-slate-200 text-sm leading-relaxed max-w-md">
                                    Vedic remedies are not just rituals; they are tools to align your vibration with cosmic forces.
                                    Implement these practices to mitigate challenges and amplify your success.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-700/30">
                                <div className="flex items-center gap-2 mb-2">
                                    <Anchor className="w-4 h-4 text-amber-400" />
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Main Deity</span>
                                </div>
                                <p className="text-base font-bold text-white mb-1">{data.deity}</p>
                                <p className="text-xs text-slate-400">Invoke protection and grace</p>
                            </div>
                            <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-700/30">
                                <div className="flex items-center gap-2 mb-2">
                                    <Star className="w-4 h-4 text-emerald-400" />
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Fasting / Diet</span>
                                </div>
                                <p className="text-base font-bold text-white mb-1">{data.fasting}</p>
                                <p className="text-xs text-slate-400">Spiritual & physical detoxification</p>
                            </div>
                        </div>

                        {/* Domain Specific Insights */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-900/60 rounded-2xl p-5 border border-blue-500/20 shadow-lg shadow-blue-500/5">
                                <div className="flex items-center gap-2 mb-3">
                                    <Zap className="w-5 h-5 text-blue-400" />
                                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Career & Job</h4>
                                </div>
                                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                                    {data.career}
                                </p>
                            </div>
                            <div className="bg-slate-900/60 rounded-2xl p-5 border border-rose-500/20 shadow-lg shadow-rose-500/5">
                                <div className="flex items-center gap-2 mb-3">
                                    <Heart className="w-5 h-5 text-rose-400" />
                                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Health & Vitality</h4>
                                </div>
                                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                                    {data.health}
                                </p>
                            </div>
                            <div className="col-span-1 md:col-span-2 bg-slate-900/60 rounded-2xl p-5 border border-amber-500/20 shadow-lg shadow-amber-500/5">
                                <div className="flex items-center gap-2 mb-3">
                                    <ArrowRight className="w-5 h-5 text-amber-400" />
                                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Wealth & Success</h4>
                                </div>
                                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                                    {data.wealth}
                                </p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-emerald-500/10 to-transparent rounded-2xl p-5 border border-emerald-500/20">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 border border-emerald-500/30">
                                    <Heart className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">Mantra Activation</span>
                                    <p className="text-xl font-bold text-white italic tracking-wide">"{data.mantra}"</p>
                                    <p className="text-sm text-slate-400 mt-2">Chant 108 times daily for maximum resonance and mental peace.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Actionable Steps & Cautions */}
                    <div className="space-y-6">
                        <div className="bg-slate-900/40 rounded-2xl p-6 border border-slate-700/30">
                            <div className="flex items-center gap-2 mb-4">
                                <Shield className="w-5 h-5 text-emerald-400" />
                                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Strategic Recommendations</h4>
                            </div>
                            <ul className="space-y-4">
                                {data.recommendations.map((rec, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                        <p className="text-base text-slate-200 leading-relaxed font-medium">{rec}</p>
                                    </li>
                                ))}
                                <li className="flex items-start gap-3 opacity-60 border-t border-white/5 pt-4 mt-4">
                                    <div className="w-2 h-2 rounded-full bg-slate-500 mt-1.5 flex-shrink-0" />
                                    <p className="text-sm text-slate-300 leading-relaxed italic font-medium">Regular donation to {data.donation} is highly recommended</p>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-rose-500/5 rounded-2xl p-6 border border-rose-500/20">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertTriangle className="w-5 h-5 text-rose-400" />
                                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Karmic Cautions</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.cautions.map((caution, i) => (
                                    <div key={i} className="bg-slate-900/40 rounded-xl p-4 border border-rose-500/10">
                                        <p className="text-sm font-medium text-rose-200/90 leading-relaxed">{caution}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-900/40 rounded-2xl p-6 border border-slate-700/30">
                            <div className="flex items-center gap-2 mb-4">
                                <Star className="w-5 h-5 text-purple-400" />
                                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Universal Daily Practices</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/30">
                                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Morning</p>
                                    <p className="text-sm text-white font-medium">Brahma Muhurta Meditation</p>
                                </div>
                                <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/30">
                                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Sunrise</p>
                                    <p className="text-sm text-white font-medium">Surya Arghya Offering</p>
                                </div>
                                <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/30">
                                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Noon</p>
                                    <p className="text-sm text-white font-medium">Nakshatra Mantra Chanting</p>
                                </div>
                                <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/30">
                                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Night</p>
                                    <p className="text-sm text-white font-medium">Gratitude & Reflection</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RemediesRecommendations;
