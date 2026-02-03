import React from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashaContext {
    mahadasha: string;
    antardasha: string;
    house: number;
    house_name: string;
    strength: number;
    time_remaining: string;
    theme: string;
}

interface TransitTrigger {
    planet: string;
    planet_symbol: string;
    aspect_type: string;
    aspect_degrees: number;
    target_point: string;
    urgency: string;
    effect: string;
}

interface NakshatraContext {
    current_nakshatra: string;
    nakshatra_lord: string;
    deity: string;
    pada: number;
    tarabala: number;
    tarabala_name: string;
    tarabala_strength: number;
    theme: string;
}

interface OptimalAction {
    action: string;
    timing: string;
    hora: string;
    reason: string;
    cta_buttons: Array<{
        label: string;
        action: string;
        time?: string;
        context?: string;
    }>;
}

interface HoroscopeCardProps {
    life_area: string;
    icon: string;
    favorability: number;
    favorability_label: string;
    dasha_context: DashaContext;
    transit_trigger: TransitTrigger;
    nakshatra_context: NakshatraContext;
    synthesis: string;
    optimal_action: OptimalAction;
    ai_confidence: number;
}

// Life area color schemes
const LIFE_AREA_COLORS: Record<string, {
    gradient: string;
    glow: string;
    border: string;
    badge: string;
}> = {
    CAREER: {
        gradient: 'from-indigo-500/20 to-purple-600/10',
        glow: 'shadow-indigo-500/20',
        border: 'border-indigo-500/30',
        badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    },
    RELATIONS: {
        gradient: 'from-pink-500/20 to-rose-600/10',
        glow: 'shadow-pink-500/20',
        border: 'border-pink-500/30',
        badge: 'bg-pink-500/20 text-pink-300 border-pink-500/30'
    },
    WELLNESS: {
        gradient: 'from-emerald-500/20 to-teal-600/10',
        glow: 'shadow-emerald-500/20',
        border: 'border-emerald-500/30',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    BUSINESS: {
        gradient: 'from-blue-500/20 to-cyan-600/10',
        glow: 'shadow-blue-500/20',
        border: 'border-blue-500/30',
        badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    },
    WEALTH: {
        gradient: 'from-amber-500/20 to-yellow-600/10',
        glow: 'shadow-amber-500/20',
        border: 'border-amber-500/30',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    }
};

const HoroscopeCard: React.FC<HoroscopeCardProps> = ({
    life_area,
    icon,
    favorability,
    favorability_label,
    dasha_context,
    transit_trigger,
    nakshatra_context,
    synthesis,
    optimal_action,
    ai_confidence
}) => {
    const colors = LIFE_AREA_COLORS[life_area] || LIFE_AREA_COLORS.CAREER;
    const navigate = useNavigate();
    const [showToast, setShowToast] = React.useState(false);
    const [toastMessage, setToastMessage] = React.useState('');

    // Handle Set Alert button
    const handleSetAlert = (button: any) => {
        const alertTime = button.time || optimal_action.timing;
        const message = `✅ Alert set for ${alertTime}`;
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);

        // In a real app, this would call checking for notification permissions
        // and scheduling a push notification or backend job
        console.log(`Alert set for ${life_area}: ${optimal_action.action} at ${alertTime}`);
    };

    // Handle Ask AI button
    const handleAskAI = (button: any) => {
        console.log("Ask AI clicked", button);
        setToastMessage('💬 Opening AI Chat...');
        setShowToast(true);

        // Prepare context for the AI
        const context = {
            type: 'horoscope_followup',
            life_area,
            dasha: `${dasha_context.mahadasha}-${dasha_context.antardasha}`,
            transit: `${transit_trigger.planet} ${transit_trigger.aspect_type} ${transit_trigger.target_point}`,
            nakshatra: nakshatra_context.current_nakshatra,
            prediction: synthesis,
            question: `I'd like to know more about the ${life_area} prediction: "${synthesis}". specifically regarding the ${transit_trigger.planet} transit.`
        };

        // Store context in session storage to be picked up by the VedaAI page
        sessionStorage.setItem('veda_ai_context', JSON.stringify(context));

        // Simulate delay for effect then redirect
        setTimeout(() => {
            setShowToast(false);
            console.log("Navigating to /ai-astrologer");
            navigate('/ai-astrologer');
        }, 1000);
    };

    const handleButtonClick = (button: any) => {
        if (button.action === 'alert') {
            handleSetAlert(button);
        } else if (button.action === 'ask_ai') {
            handleAskAI(button);
        } else {
            // Fallback for unknown actions
            console.log('Unknown action:', button.action);
        }
    };

    // Determine progress bar color based on favorability
    const getProgressColor = () => {
        if (favorability >= 90) return 'bg-gradient-to-r from-emerald-400 to-green-500';
        if (favorability >= 75) return 'bg-gradient-to-r from-blue-400 to-cyan-500';
        if (favorability >= 60) return 'bg-gradient-to-r from-amber-400 to-yellow-500';
        return 'bg-gradient-to-r from-rose-400 to-red-500';
    };

    // Star rating based on favorability
    const getStarRating = () => {
        if (favorability >= 90) return 5;
        if (favorability >= 75) return 4;
        if (favorability >= 60) return 3;
        if (favorability >= 45) return 2;
        return 1;
    };

    const stars = getStarRating();

    // Tarabala color coding
    const getTarabalaColor = () => {
        if (nakshatra_context.tarabala_strength >= 90) return 'text-emerald-400';
        if (nakshatra_context.tarabala_strength >= 50) return 'text-amber-400';
        return 'text-rose-400';
    };

    // Urgency badge styling
    const getUrgencyStyle = () => {
        if (transit_trigger.urgency === 'Peak today') return 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse';
        if (transit_trigger.urgency === 'Building') return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    };

    return (
        <div
            className={`flex-shrink-0 w-[420px] bg-gradient-to-br ${colors.gradient} backdrop-blur-sm border ${colors.border} rounded-3xl p-7 hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl ${colors.glow} animate-fadeInUp`}
            style={{ animationDelay: '0ms' }}
        >
            {/* Header with Star Rating */}
            <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                    <span className="text-4xl">{icon}</span>
                    <div>
                        <h3 className="text-white font-black text-xl tracking-tight">{life_area}</h3>
                        <div className="flex items-center gap-1 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-3 h-3 ${i < stars ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-black text-white mb-1">{favorability}%</div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{favorability_label}</p>
                </div>
            </div>

            {/* Favorability Bar */}
            <div className="mb-6">
                <div className="h-2.5 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${getProgressColor()} transition-all duration-1000 ease-out`}
                        style={{ width: `${favorability}%` }}
                    />
                </div>
            </div>

            {/* Dasha Engine */}
            <div className="mb-4 p-5 rounded-2xl bg-slate-800/40 border border-white/5">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <h4 className="text-[10px] font-black text-amber-300 uppercase tracking-[0.15em]">Dasha Engine</h4>
                </div>
                <p className="text-white font-bold text-base mb-1">
                    {dasha_context.mahadasha} → {dasha_context.antardasha}
                </p>
                <p className="text-slate-400 text-xs font-medium mb-3">
                    House {dasha_context.house} ({dasha_context.house_name})
                </p>
                <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10 mb-4">
                    <p className="text-amber-200/90 text-sm leading-relaxed italic">
                        <span className="text-amber-400 font-bold not-italic mr-1">AI Insight:</span>
                        {dasha_context.theme}
                    </p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Time Remaining</p>
                    <p className="text-slate-300 text-xs font-bold">{dasha_context.time_remaining}</p>
                </div>
                <div className="mt-2 h-1 bg-slate-700/50 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400/50 w-3/4" />
                </div>
            </div>

            {/* Transit Trigger */}
            <div className="mb-4 p-5 rounded-2xl bg-slate-800/40 border border-white/5">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    <h4 className="text-[10px] font-black text-blue-300 uppercase tracking-[0.15em]">Transit Trigger</h4>
                </div>
                <p className="text-white font-bold text-base mb-2">
                    {transit_trigger.planet_symbol} {transit_trigger.planet} {transit_trigger.aspect_type} {transit_trigger.target_point}
                </p>
                <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 mb-3">
                    <p className="text-blue-200/90 text-sm leading-relaxed">
                        <span className="text-blue-400 font-bold mr-1">Cosmic Effect:</span>
                        {transit_trigger.effect}
                    </p>
                </div>
                <span className={`inline-block px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border ${getUrgencyStyle()}`}>
                    {transit_trigger.urgency === 'Peak today' && '🔥 '}
                    {transit_trigger.urgency}
                </span>
            </div>

            {/* Nakshatra Intelligence */}
            <div className="mb-5 p-5 rounded-2xl bg-purple-900/20 border border-purple-500/10">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    <h4 className="text-[10px] font-black text-purple-300 uppercase tracking-[0.15em]">Nakshatra Intelligence</h4>
                </div>
                <div className="flex justify-between items-start mb-2">
                    <p className="text-white font-bold text-base">
                        {nakshatra_context.current_nakshatra}
                    </p>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className={`w-1.5 h-1.5 rounded-full ${i < nakshatra_context.pada ? 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.6)]' : 'bg-slate-700'}`}
                            />
                        ))}
                    </div>
                </div>
                <div className="p-3 bg-purple-500/5 rounded-xl border border-purple-500/10 mb-3">
                    <p className="text-purple-200/90 text-sm leading-relaxed">
                        <span className="text-purple-400 font-bold mr-1">Spiritual Guidance:</span>
                        {nakshatra_context.theme}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border bg-purple-500/20 border-purple-500/30 ${getTarabalaColor()}`}>
                        {nakshatra_context.tarabala_name} ({nakshatra_context.tarabala_strength}%)
                    </span>
                </div>
            </div>

            {/* Vedant's Insight */}
            <div className="mb-5 p-5 rounded-2xl bg-gradient-to-br from-indigo-900/30 to-violet-900/20 border border-indigo-500/20">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-base">🔮</span>
                    <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.15em]">Vedant's Insight</h4>
                </div>
                <p className="text-slate-200 text-base leading-relaxed font-medium">
                    {synthesis}
                </p>
            </div>

            {/* Optimal Action */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-900/20 to-orange-900/10 border border-amber-500/20">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">⚡</span>
                    <h4 className="text-[10px] font-black text-amber-300 uppercase tracking-[0.15em]">Optimal Action</h4>
                </div>
                <p className="text-white font-bold text-base mb-3">
                    {optimal_action.action}
                </p>
                <p className="text-amber-200 text-sm font-semibold mb-4">
                    🕐 {optimal_action.timing} <span className="text-amber-400/70">({optimal_action.hora})</span>
                </p>

                {/* CTA Buttons */}
                <div className="flex gap-2 relative">
                    {showToast && (
                        <div className="absolute bottom-full left-0 right-0 mb-2 py-2 px-3 bg-slate-900/90 border border-amber-500/30 rounded-lg text-xs text-amber-100 text-center shadow-xl backdrop-blur-md animate-fadeIn z-50">
                            {toastMessage}
                        </div>
                    )}
                    {optimal_action.cta_buttons.map((button, index) => (
                        <button
                            key={index}
                            onClick={() => handleButtonClick(button)}
                            className="flex-1 px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-sm font-bold rounded-xl border border-amber-500/30 hover:border-amber-400/50 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/20 active:scale-95"
                        >
                            {button.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* AI Confidence */}
            <div className="mt-4 text-center">
                <p className="text-xs text-slate-500 font-medium">
                    AI Confidence: <span className="text-slate-400 font-bold">{ai_confidence}%</span>
                </p>
            </div>
        </div>
    );
};

export default HoroscopeCard;
