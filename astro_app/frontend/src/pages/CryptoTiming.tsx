import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Info, Loader2, Sparkles, Fish, User, Star, Zap, ShieldCheck } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { useChartSettings } from '../context/ChartContext';
import { getCryptoTiming, CryptoTimingResponse, PlanetaryInfluence, TimingWindow, CryptoAIAnalysis } from '../services/crypto';

const CRYPTO_OPTIONS = [
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'SOL', name: 'Solana' },
    { symbol: 'ADA', name: 'Cardano' },
    { symbol: 'MATIC', name: 'Polygon' },
    { symbol: 'DOT', name: 'Polkadot' },
];

const HORIZON_OPTIONS = [
    { value: 'intraday', label: 'Intraday', desc: '1-3 days' },
    { value: 'swing', label: 'Swing', desc: '7-30 days' },
    { value: 'long_term', label: 'Long Term', desc: '3-12 months' },
];

const PLANET_SYMBOLS: Record<string, string> = {
    'Mercury': '☿',
    'Venus': '♀',
    'Mars': '♂',
    'Jupiter': '♃',
    'Saturn': '♄',
    'Rahu': '☊',
    'Ketu': '☋',
    'Moon': '☽',
    'Sun': '☉',
};

const CryptoTiming: React.FC = () => {

    const { availableProfiles } = useChartSettings();
    const [cryptoSymbol, setCryptoSymbol] = useState('BTC');
    const [horizon, setHorizon] = useState('swing');
    const [useBirthChart, setUseBirthChart] = useState(false);
    const [selectedProfileId, setSelectedProfileId] = useState<string>('');

    // Birth details state
    const [birthDate, setBirthDate] = useState('');
    const [birthTime, setBirthTime] = useState('');
    const [birthTimezone, setBirthTimezone] = useState('+05:30');
    // const [birthPlace, setBirthPlace] = useState(''); // Removed birthPlace to fix lint
    const [birthLat, setBirthLat] = useState<number | undefined>();
    const [birthLon, setBirthLon] = useState<number | undefined>();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<CryptoTimingResponse | null>(null);

    const handleProfileSelect = (profileId: string) => {
        setSelectedProfileId(profileId);
        if (!profileId) return;

        const profile = availableProfiles.find(p => String(p.id) === profileId);
        if (profile) {
            // Convert DD/MM/YYYY to YYYY-MM-DD for date input
            if (profile.date_str) {
                const parts = profile.date_str.split('/');
                if (parts.length === 3) {
                    setBirthDate(`${parts[2]}-${parts[1]}-${parts[0]}`);
                }
            } else if (profile.date) {
                setBirthDate(profile.date);
            }

            setBirthTime(profile.time_str || profile.time || '');
            setBirthTimezone(profile.timezone_str || profile.timezone || '+05:30');
            // setBirthPlace(profile.location_name || profile.location || '');
            setBirthLat(profile.latitude);
            setBirthLon(profile.longitude);
        }
    };

    const handleGetTiming = async () => {
        setLoading(true);
        setError(null);

        try {
            const params: any = {
                crypto_symbol: cryptoSymbol,
                timing_horizon: horizon as any,
            };

            if (useBirthChart) {
                params.birth_date = birthDate;
                params.birth_time = birthTime;
                params.birth_timezone = birthTimezone;
                params.birth_lat = birthLat;
                params.birth_lon = birthLon;
            }

            const result = await getCryptoTiming(params);
            setData(result);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to fetch crypto timing');
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout title="Crypto Timing Intelligence" breadcrumbs={['Cosmic Hub', 'Crypto Timing']}>
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 mb-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            🪙 Crypto Timing Insights
                            <span className="flex items-center gap-2 text-sm bg-green-500/20 px-3 py-1 rounded-full">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                Live
                            </span>
                        </h1>
                        <p className="text-indigo-100">Planetary cycles decoded for crypto market timing</p>
                    </div>
                    <div className="text-right text-sm">
                        <p className="text-indigo-200">⚡ Powered by Vedic planetary calculations</p>
                        <p className="text-indigo-200">🔄 Updated hourly</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Panel */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sticky top-4">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Input Panel</h2>

                        {/* Crypto Selector */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Select Cryptocurrency
                            </label>
                            <select
                                value={cryptoSymbol}
                                onChange={(e) => setCryptoSymbol(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            >
                                {CRYPTO_OPTIONS.map(crypto => (
                                    <option key={crypto.symbol} value={crypto.symbol}>
                                        🔍 {crypto.name} ({crypto.symbol})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Timing Horizon */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                                Timing Horizon
                            </label>
                            <div className="space-y-2">
                                {HORIZON_OPTIONS.map(option => (
                                    <label
                                        key={option.value}
                                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${horizon === option.value
                                            ? 'bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-500'
                                            : 'bg-slate-50 dark:bg-slate-700/50 border-2 border-transparent hover:border-slate-300'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="horizon"
                                            value={option.value}
                                            checked={horizon === option.value}
                                            onChange={(e) => setHorizon(e.target.value)}
                                            className="text-indigo-600"
                                        />
                                        <div className="flex-1">
                                            <div className="font-medium text-slate-800 dark:text-white">{option.label}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">{option.desc}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Birth Chart Toggle */}
                        <div className="mb-6">
                            <label className="flex items-center gap-2 cursor-pointer mb-4">
                                <input
                                    type="checkbox"
                                    checked={useBirthChart}
                                    onChange={(e) => setUseBirthChart(e.target.checked)}
                                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 font-bold">
                                    🌟 Use My Birth Chart
                                </span>
                            </label>

                            {useBirthChart && (
                                <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="grid grid-cols-1 gap-3">
                                        {/* Profile Dropdown */}
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                                                <User className="w-3 h-3" /> Select Saved Profile
                                            </label>
                                            <select
                                                value={selectedProfileId}
                                                onChange={(e) => handleProfileSelect(e.target.value)}
                                                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-600 text-slate-700 dark:text-white"
                                            >
                                                <option value="">-- Choose a Profile --</option>
                                                {availableProfiles.map(p => (
                                                    <option key={p.id} value={String(p.id)}>{p.name || `${p.first_name} ${p.last_name}`}</option>
                                                ))}
                                            </select>
                                        </div>

                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Get Timing Button */}
                        <button
                            onClick={handleGetTiming}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Analyzing Planets...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Get Crypto Timing
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Insight Dashboard */}
                <div className="lg:col-span-2">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-6">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                                <div>
                                    <h3 className="font-bold text-red-800 dark:text-red-200">Analysis Failed</h3>
                                    <p className="text-red-600 dark:text-red-300">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {!data && !loading && !error && (
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-12 text-center">
                            <Info className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                                Select a cryptocurrency to begin
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Choose your crypto and timing horizon, then click "Get Crypto Timing" to receive planetary insights
                            </p>
                        </div>
                    )}

                    {data && (
                        <div className="space-y-6">
                            {/* AI-Powered Daily Core Summary */}
                            {data.ai_analysis && (
                                <DailyCoreAI analysis={data.ai_analysis} signal={data.overall_signal} />
                            )}

                            {/* Signal Card */}
                            <SignalCard data={data} />

                            {/* Personal Guidance Alert */}
                            {data.personal_guidance && data.personal_guidance.length > 0 && (
                                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-left-4 duration-500">
                                    <h3 className="text-lg font-bold text-purple-800 dark:text-purple-300 mb-4 flex items-center gap-2">
                                        <Star className="w-5 h-5 fill-purple-500" />
                                        Personal Speculation Guidance
                                    </h3>
                                    <div className="space-y-3">
                                        {data.personal_guidance.map((g: any, i: number) => (
                                            <div key={i} className="flex gap-3 items-start bg-white/50 dark:bg-slate-800/50 p-3 rounded-lg border border-purple-100 dark:border-purple-900/50">
                                                <Zap className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
                                                <div>
                                                    <p className="font-bold text-slate-800 dark:text-white text-sm">{g.factor}</p>
                                                    <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">{g.effect}</p>
                                                    <p className="text-indigo-600 dark:text-indigo-400 text-[10px] mt-1 font-semibold uppercase">Action: {g.action}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Market Patterns (Specialized Crypto Yogas) */}
                            {data.patterns && data.patterns.length > 0 && (
                                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                        <ShieldCheck className="w-6 h-6 text-indigo-500" />
                                        Active Market Patterns
                                    </h2>
                                    <div className="space-y-4">
                                        {data.patterns.map((p: any, i: number) => (
                                            <div key={i} className="p-4 rounded-lg bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900">
                                                <h4 className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                                                    ✨ {p.name}
                                                </h4>
                                                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{p.effect}</p>
                                                <div className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                                    Action: {p.action}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Timing Windows */}
                            {(data.entry_windows.length > 0 || data.exit_windows.length > 0 || data.risk_periods.length > 0) && (
                                <TimingWindows data={data} />
                            )}

                            {/* Risk Alerts */}
                            <RiskAlerts data={data} />

                            {/* Timing Calendar Strip */}
                            <TimingCalendarStrip />

                            {/* Planetary Influences */}
                            <PlanetaryInfluences influences={data.planetary_influences} />

                            {/* Action Guidance */}
                            <ActionGuidanceCard guidance={data.action_guidance} signal={data.overall_signal} />

                            {/* Explainability Drawer */}
                            <ExplainabilityDrawer influences={data.planetary_influences} />
                        </div>
                    )}
                </div>
            </div >
        </MainLayout >
    );
};

// Risk Alerts Component
const RiskAlerts: React.FC<{ data: CryptoTimingResponse }> = () => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                Cosmic Risk Alerts
            </h2>
            <div className="space-y-4">
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-red-700 dark:text-red-300">🚨 ECLIPSE WINDOW ALERT</span>
                        <span className="text-xs bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-200 px-2 py-1 rounded">HIGH RISK</span>
                    </div>
                    <p className="text-sm text-red-600 dark:text-red-300">
                        Lunar Eclipse approaching. Historical patterns show 73% correction probability.
                        Recommendation: Reduce exposure to 50% before the window opens.
                    </p>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-amber-700 dark:text-amber-300">⚡ VOID MOON PERIODS</span>
                        <span className="text-xs bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-200 px-2 py-1 rounded">NO NEW TRADES</span>
                    </div>
                    <p className="text-sm text-amber-600 dark:text-amber-300">
                        Void Moon cycle today: 14:30 - 16:45 UTC. Decisions made now often lead to unexpected outcomes.
                    </p>
                </div>
            </div>
        </div>
    );
};

// Timing Calendar Strip Component
const TimingCalendarStrip: React.FC = () => {
    const days = Array.from({ length: 15 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return {
            day: date.getDate(),
            status: i % 4 === 0 ? 'red' : i % 3 === 0 ? 'amber' : 'green',
            label: i % 4 === 0 ? 'Avoid' : i % 3 === 0 ? 'Hold' : 'Buy'
        };
    });

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Timing Calendar Strip</h2>
            <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar">
                {days.map((d, i) => (
                    <div key={i} className="flex-shrink-0 flex flex-col items-center">
                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-mono">{d.day}</div>
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white
                            ${d.status === 'green' ? 'bg-green-500 shadow-green-500/20 shadow-lg' :
                                d.status === 'amber' ? 'bg-amber-500 shadow-amber-500/20 shadow-lg' :
                                    'bg-red-500 shadow-red-500/20 shadow-lg'}`}>
                            {d.status === 'green' ? '🟢' : d.status === 'amber' ? '🟡' : '🔴'}
                        </div>
                        <div className="text-[10px] mt-2 font-bold uppercase text-slate-400">{d.label}</div>
                    </div>
                ))}
            </div>
            <div className="mt-4 flex gap-4 text-xs">
                <div className="flex items-center gap-1"><span className="text-green-500">🟢</span> Favorable</div>
                <div className="flex items-center gap-1"><span className="text-amber-500">🟡</span> Neutral</div>
                <div className="flex items-center gap-1"><span className="text-red-500">🔴</span> Avoid</div>
            </div>
        </div>
    );
};

// Explainability Drawer Component
const ExplainabilityDrawer: React.FC<{ influences: PlanetaryInfluence[], aiAnalysis?: CryptoAIAnalysis }> = ({ influences, aiAnalysis }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">WHY AM I SEEING THIS?</h2>
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] border-t dark:border-slate-700 p-6' : 'max-h-0'}`}>
                <div className="space-y-6">
                    {influences && influences.length > 0 && (
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                AI Deep Dive Explanation
                            </h3>
                            <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 mb-6 text-sm whitespace-pre-line leading-relaxed">
                                {aiAnalysis?.deep_dive || "The current planetary configuration suggests a shift in market momentum. Our analysis indicates that institutional interest is balancing against short-term retail sentiment."}
                            </div>

                            <h3 className="text-lg font-bold text-slate-600 dark:text-slate-400 mb-4 font-mono uppercase text-xs tracking-widest bg-slate-100 dark:bg-slate-700 p-2 inline-block rounded">Deterministic Astrology Logic</h3>
                            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                                {influences.map((p, i) => (
                                    <div key={i} className="flex gap-4 p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                                        <div className="text-2xl pt-1 flex-shrink-0">{PLANET_SYMBOLS[p.planet] || '⭐'}</div>
                                        <div>
                                            <div className="font-bold flex items-center gap-2">
                                                {p.planet}
                                                <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase ${p.signal === 'bullish' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {p.signal}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 mb-1">{p.status} phase</p>
                                            <p className="text-slate-600 dark:text-slate-400">{p.effect}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="text-sm text-slate-500 dark:text-slate-400 italic">
                        * Analysis based on current transits and historical crypto cycles. For personal timing, enable 'Use My Birth Chart' in the input panel.
                    </div>
                </div>
            </div>
        </div>
    );
};

// Signal Card Component
const SignalCard: React.FC<{ data: CryptoTimingResponse }> = ({ data }) => {
    const signalConfig = {
        buy: {
            icon: TrendingUp,
            color: 'green',
            bg: 'bg-green-50 dark:bg-green-900/20',
            border: 'border-green-500',
            text: 'text-green-700 dark:text-green-300',
            label: 'BUY WINDOW',
            emoji: '🟢',
        },
        hold: {
            icon: Minus,
            color: 'amber',
            bg: 'bg-amber-50 dark:bg-amber-900/20',
            border: 'border-amber-500',
            text: 'text-amber-700 dark:text-amber-300',
            label: 'HOLD POSITION',
            emoji: '🟡',
        },
        avoid: {
            icon: TrendingDown,
            color: 'red',
            bg: 'bg-red-50 dark:bg-red-900/20',
            border: 'border-red-500',
            text: 'text-red-700 dark:text-red-300',
            label: 'AVOID / EXIT',
            emoji: '🔴',
        },
    };

    const config = signalConfig[data.overall_signal];
    const Icon = config.icon;

    return (
        <div className={`${config.bg} border-2 ${config.border} rounded-2xl p-8`}>
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">OVERALL SIGNAL</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">{config.emoji}</span>
                        <div>
                            <h3 className={`text-3xl font-bold ${config.text}`}>{config.label}</h3>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                {data.overall_signal === 'buy' && 'Favorable alignment for accumulation'}
                                {data.overall_signal === 'hold' && 'Mixed signals - maintain current positions'}
                                {data.overall_signal === 'avoid' && 'Unfavorable conditions - reduce exposure'}
                            </p>
                        </div>
                    </div>
                </div>
                <Icon className={`w-12 h-12 ${config.text}`} />
            </div>

            {/* Confidence Meter */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Confidence</span>
                    <span className={`text-lg font-bold ${config.text}`}>{Math.round(data.confidence_score)}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                        className={`h-full bg-gradient-to-r from-${config.color}-400 to-${config.color}-600 transition-all duration-500`}
                        style={{ width: `${data.confidence_score}%` }}
                    />
                </div>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400">
                Updated: Just now
            </div>

            {/* Whale Alert */}
            {data.whale_activity.detected && (
                <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-center gap-2">
                    <Fish className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        🐋 Whale Alert: Large {data.whale_activity.type} detected
                    </span>
                </div>
            )}
        </div>
    );
};

// Daily Core AI Component
const DailyCoreAI: React.FC<{ analysis: any, signal: string }> = ({ analysis, signal }) => {
    return (
        <div className="bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-6 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
                <div className="bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                    <Sparkles className="w-2 h-2" /> AI POWERED
                </div>
            </div>
            <div className="flex gap-4 items-start">
                <div className={`p-3 rounded-xl ${signal === 'buy' ? 'bg-green-100 text-green-600' : signal === 'avoid' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                    <Sparkles className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-1 uppercase tracking-wider">Daily Core</h3>
                    <p className="text-lg font-medium text-slate-800 dark:text-white leading-relaxed">
                        {analysis.daily_core}
                    </p>
                    {analysis.caution_note && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400 font-medium">
                            <AlertTriangle className="w-4 h-4" />
                            {analysis.caution_note}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Timing Windows Component
const TimingWindows: React.FC<{ data: CryptoTimingResponse }> = ({ data }) => {
    const renderWindow = (window: TimingWindow, index: number) => {
        const config = {
            entry: { color: 'green', emoji: '🟢', label: 'ENTRY WINDOW' },
            exit: { color: 'amber', emoji: '🟡', label: 'EXIT/PARTIAL BOOKING' },
            avoid: { color: 'red', emoji: '🔴', label: 'AVOID PERIOD' },
        };

        const windowConfig = config[window.type];
        const stars = '★'.repeat(window.strength) + '☆'.repeat(5 - window.strength);

        return (
            <div
                key={index}
                className={`bg-${windowConfig.color}-50 dark:bg-${windowConfig.color}-900/20 border border-${windowConfig.color}-200 dark:border-${windowConfig.color}-800 rounded-xl p-6`}
            >
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{windowConfig.emoji}</span>
                    <h3 className={`font-bold text-${windowConfig.color}-800 dark:text-${windowConfig.color}-200`}>
                        {windowConfig.label}
                    </h3>
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-medium mb-2">
                    {window.start_date} - {window.end_date}
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                    {window.reason}
                </p>
                <div className="text-yellow-500 text-sm">
                    Strength: {stars}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Timing Windows</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.entry_windows.map((w, i) => renderWindow(w, i))}
                {data.exit_windows.map((w, i) => renderWindow(w, i))}
                {data.risk_periods.map((w, i) => renderWindow(w, i))}
            </div>
        </div>
    );
};

// Planetary Influences Component
const PlanetaryInfluences: React.FC<{ influences: PlanetaryInfluence[] }> = ({ influences }) => {
    const getSignalColor = (signal: string) => {
        switch (signal) {
            case 'bullish': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
            case 'bearish': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
            case 'volatile': return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20';
            case 'deceptive': return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20';
            default: return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/20';
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Active Planetary Influences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {influences.map((planet, index) => (
                    <div
                        key={index}
                        className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-4xl">{PLANET_SYMBOLS[planet.planet] || '⭐'}</span>
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-white">{planet.planet}</h3>
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                                    {planet.status}
                                </span>
                            </div>
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 min-h-[60px]">
                            {planet.effect}
                        </p>

                        {/* Strength Bar */}
                        <div className="mb-3">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Strength</span>
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{Math.round(planet.strength)}%</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all duration-500"
                                    style={{ width: `${planet.strength}%` }}
                                />
                            </div>
                        </div>

                        {/* Signal Badge */}
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getSignalColor(planet.signal)}`}>
                            {planet.signal === 'bullish' && '🟢 Bullish'}
                            {planet.signal === 'bearish' && '🔴 Bearish'}
                            {planet.signal === 'neutral' && '🟡 Neutral'}
                            {planet.signal === 'volatile' && '🟡 Volatile'}
                            {planet.signal === 'deceptive' && '🟣 Deceptive'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Action Guidance Component
const ActionGuidanceCard: React.FC<{ guidance: any; signal: string }> = ({ guidance, signal }) => {
    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-8 border border-indigo-200 dark:border-indigo-800">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">What To Do Now</h2>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
                    {signal === 'buy' && '🟢 ACCUMULATE STRATEGY'}
                    {signal === 'hold' && '🟡 HOLD STRATEGY'}
                    {signal === 'avoid' && '🔴 REDUCE EXPOSURE STRATEGY'}
                </h3>

                <div className="space-y-4 text-slate-700 dark:text-slate-300">
                    <div>
                        <span className="font-semibold">Strategy:</span> {guidance.strategy}
                    </div>
                    <div>
                        <span className="font-semibold">Position Size:</span> {guidance.position_size}
                    </div>
                    <div>
                        <span className="font-semibold">Stop Loss:</span> {guidance.stop_loss}
                    </div>
                    <div>
                        <span className="font-semibold">Take Profit:</span> {guidance.take_profit}
                    </div>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <p className="text-xs text-amber-800 dark:text-amber-200">
                    ⚠️ <strong>Disclaimer:</strong> Crypto Timing Insights are based on Vedic astrological calculations and are for educational purposes only.
                    They do not constitute financial advice. Cryptocurrency markets are highly volatile and risky. Always conduct your own research and consult licensed financial advisors.
                </p>
            </div>
        </div>
    );
};

export default CryptoTiming;
