import React from 'react';
import { Zap, Clock, Brain, Info, CheckCircle2, Hourglass, Ban, CalendarDays, Tag } from 'lucide-react';
import { computeStatusAndTiming } from '../../../utils/astroNarrative';
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

// SaaS Color Mapping
const LIFE_AREA_COLORS: Record<string, string> = {
    CAREER: 'text-indigo-400',
    RELATIONS: 'text-pink-400',
    WELLNESS: 'text-emerald-400',
    BUSINESS: 'text-blue-400',
    WEALTH: 'text-violet-400'
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
    // ai_confidence consumed via narrative.confidence
}) => {
    const accentColor = LIFE_AREA_COLORS[life_area] || 'text-slate-400';
    const navigate = useNavigate();
    const [showToast, setShowToast] = React.useState(false);
    const [toastMessage, setToastMessage] = React.useState('');
    const [showWhy, setShowWhy] = React.useState(false);

    // Handle Set Alert button
    const handleSetAlert = (button: any) => {
        const alertTime = button.time || optimal_action.timing;
        const message = `✅ Alert set for ${alertTime}`;
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        console.log(`Alert set for ${life_area}: ${optimal_action.action} at ${alertTime}`);
    };

    // Handle Ask AI button
    const handleAskAI = () => {
        setToastMessage('💬 Opening AI Chat...');
        setShowToast(true);
        const context = {
            type: 'horoscope_followup',
            life_area,
            dasha: `${dasha_context.mahadasha}-${dasha_context.antardasha}`,
            transit: `${transit_trigger.planet} ${transit_trigger.aspect_type} ${transit_trigger.target_point}`,
            nakshatra: nakshatra_context.current_nakshatra,
            prediction: synthesis,
            question: `I'd like to know more about the ${life_area} prediction: "${synthesis}". specifically regarding the ${transit_trigger.planet} transit.`
        };
        sessionStorage.setItem('veda_ai_context', JSON.stringify(context));
        setTimeout(() => {
            setShowToast(false);
            navigate('/ai-astrologer');
        }, 1000);
    };

    const handleButtonClick = (button: any) => {
        if (button.action === 'alert') {
            handleSetAlert(button);
        } else if (button.action === 'ask_ai') {
            handleAskAI();
        } else {
            console.log('Unknown action:', button.action);
        }
    };

    // Progress bar color
    const getProgressColor = () => {
        if (favorability >= 90) return 'bg-emerald-500';
        if (favorability >= 75) return 'bg-blue-500';
        if (favorability >= 60) return 'bg-amber-500';
        return 'bg-red-500';
    };

    const whyText = () => {
        const parts: string[] = [];
        if (dasha_context?.theme) parts.push(`Dasha: ${dasha_context.theme}`);
        if (transit_trigger?.effect) parts.push(`Transit: ${transit_trigger.effect}`);
        if (nakshatra_context?.theme) parts.push(`Nakshatra: ${nakshatra_context.theme}`);
        return parts.join(' • ');
    };

    const narrative = computeStatusAndTiming({
        dasha: { strength: dasha_context?.strength, theme: dasha_context?.theme, mahadasha: dasha_context?.mahadasha, antardasha: dasha_context?.antardasha, time_remaining: dasha_context?.time_remaining, house: dasha_context?.house },
        transit: { effect: transit_trigger?.effect, aspect_type: transit_trigger?.aspect_type, planet: transit_trigger?.planet, urgency: transit_trigger?.urgency },
        nakshatra: { tarabala_strength: nakshatra_context?.tarabala_strength, current_nakshatra: nakshatra_context?.current_nakshatra, theme: nakshatra_context?.theme }
    });
    const StatusIcon = narrative.status === 'PROMISED' ? CheckCircle2 : narrative.status === 'DELAYED' ? Hourglass : Ban;
    const leadText = narrative.lead(life_area);

    return (
        <div className="flex-shrink-0 w-[400px] bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all hover:shadow-xl group">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-800">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className={`text-3xl p-3 bg-slate-800 rounded-lg ${accentColor}`}>
                            {icon}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-100">{life_area}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-2xl font-bold ${accentColor}`}>{favorability}%</span>
                                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{favorability_label}</span>
                                <span className="text-[10px] text-slate-400 ml-2">Confidence {narrative.confidence}%</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200">
                            <StatusIcon className="w-3.5 h-3.5" /> {narrative.status}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200">
                            <CalendarDays className="w-3.5 h-3.5" /> {narrative.timing_window.label}
                        </span>
                    </div>
                </div>
                
                {/* Simple Progress Bar */}
                <div className="mt-4 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${getProgressColor()} transition-all duration-1000`} style={{ width: `${favorability}%` }} />
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Main Synthesis */}
                <div>
                    <div className="flex items-center gap-2 mb-2 text-slate-400">
                        <Brain className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Analysis</span>
                        <button
                          className="ml-auto text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-xs"
                          onClick={() => setShowWhy(!showWhy)}
                          aria-expanded={showWhy}
                          aria-controls="why-panel"
                        >
                          <Info className="w-3 h-3" />
                          Why this?
                        </button>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        {leadText}
                    </p>
                    {showWhy && (
                      <div id="why-panel" className="mt-3 p-3 bg-slate-800/50 border border-slate-700 rounded-lg text-xs text-slate-300">
                        {whyText() || 'Factors unavailable'}
                      </div>
                    )}
                </div>

                {/* Tokens */}
                <div className="flex flex-wrap gap-2">
                    {narrative.tokens.map((tk, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[10px] text-slate-200">
                            <Tag className="w-3 h-3" /> {tk}
                        </span>
                    ))}
                </div>

                {/* Data Grid (Dasha / Transit / Nakshatra) */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Dasha</p>
                        <p className="text-sm font-semibold text-slate-200">{dasha_context.mahadasha}-{dasha_context.antardasha}</p>
                        <p className="text-xs text-slate-400 mt-1 truncate">{dasha_context.theme}</p>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Transit</p>
                        <p className="text-sm font-semibold text-slate-200">{transit_trigger.planet} {transit_trigger.aspect_type}</p>
                        <p className="text-xs text-slate-400 mt-1 truncate">{transit_trigger.effect}</p>
                    </div>
                </div>

                {/* Action Section */}
                <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-slate-200 mb-1">Recommendation</h4>
                            <p className="text-xs text-slate-400 mb-3">{optimal_action.action}</p>
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-xs text-blue-300 font-medium">
                                    <Clock className="w-3.5 h-3.5" />
                                    {optimal_action.timing}
                                </div>
                                
                                <div className="flex gap-2 relative">
                                    {showToast && (
                                        <div className="absolute bottom-full right-0 mb-2 py-1.5 px-3 bg-slate-900 border border-slate-700 rounded shadow-lg text-xs text-white whitespace-nowrap z-10">
                                            {toastMessage}
                                        </div>
                                    )}
                                    {Array.isArray(optimal_action.cta_buttons) && optimal_action.cta_buttons.length > 0 ? (
                                      <>
                                        <button
                                          onClick={() => handleButtonClick(optimal_action.cta_buttons[0])}
                                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded transition-colors"
                                        >
                                          {optimal_action.cta_buttons[0].label}
                                        </button>
                                        {optimal_action.cta_buttons[1] && (
                                          <button
                                            onClick={() => handleButtonClick(optimal_action.cta_buttons[1])}
                                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded transition-colors"
                                          >
                                            {optimal_action.cta_buttons[1].label}
                                          </button>
                                        )}
                                      </>
                                    ) : (
                                      <button
                                        onClick={() => handleSetAlert({ action: 'alert', label: 'Plan it' })}
                                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded transition-colors"
                                      >
                                        Plan it
                                      </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="text-center">
                     <p className="text-[10px] text-slate-600 font-mono">AI Confidence: {narrative.confidence}%</p>
                </div>
            </div>
        </div>
    );
};

export default HoroscopeCard;
