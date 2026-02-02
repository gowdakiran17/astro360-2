import { useState, useEffect } from 'react';
import api from '../../../services/api';
import {
  Star, Sparkles, Heart, Activity, Wallet,
  Moon, Sun, Target, Shield, Gem, BookOpen, Clock,
  ChevronDown, ChevronUp, RefreshCw, Zap, Compass,
  Users, TrendingUp, Brain, Flame
} from 'lucide-react';

interface AstrologerConsultationProps {
  chartData: any;
  dashaData: any;
}

const SECTION_ICONS: Record<string, any> = {
  cosmic_identity: Star,
  life_mission: Compass,
  wealth_patterns: Wallet,
  relationships: Heart,
  health_patterns: Activity,
  current_period: Clock,
  sacred_guidance: Shield
};

const SECTION_COLORS: Record<string, string> = {
  cosmic_identity: 'from-violet-600 to-purple-700',
  life_mission: 'from-amber-500 to-orange-600',
  wealth_patterns: 'from-emerald-500 to-green-600',
  relationships: 'from-pink-500 to-rose-600',
  health_patterns: 'from-cyan-500 to-teal-600',
  current_period: 'from-blue-500 to-indigo-600',
  sacred_guidance: 'from-yellow-500 to-amber-600'
};

const AstrologerConsultation: React.FC<AstrologerConsultationProps> = ({ chartData, dashaData }) => {
  const [reading, setReading] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    cosmic_identity: true,
    life_mission: true,
    wealth_patterns: false,
    relationships: false,
    health_patterns: false,
    current_period: true,
    sacred_guidance: false
  });
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    { main: "Consulting the cosmic forces...", sub: "Aligning planetary coordinates" },
    { main: "Decrypting celestial patterns...", sub: "Analyzing house significations" },
    { main: "Interpreting dasha cycles...", sub: "Mapping time-based influences" },
    { main: "Preparing your personalized predictions...", sub: "Finalizing sacred insights" }
  ];

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % loadingMessages.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const fetchReading = async () => {
    if (!chartData) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('ai/comprehensive-reading', {
        chart_data: chartData,
        dasha_data: dashaData
      });

      if (response.data?.status === 'success' && response.data.data) {
        setReading(response.data.data);
      } else {
        setError('Unable to generate reading');
      }
    } catch (err: any) {
      console.error('Reading error:', err);
      setError(err.message || 'Failed to generate reading');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (chartData && !reading) {
      fetchReading();
    }
  }, [chartData]);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 rounded-2xl p-8 border border-indigo-500/30 shadow-[0_0_50px_rgba(79,70,229,0.2)] overflow-hidden relative">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-purple-600/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        </div>

        <div className="flex flex-col items-center justify-center py-16 relative z-10">
          <div className="relative mb-12">
            {/* Multi-layered Rotating Circles */}
            <div className="w-32 h-32 rounded-full border border-dashed border-indigo-500/30 animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-0 m-auto w-24 h-24 rounded-full border border-double border-purple-500/40 animate-[spin_7s_linear_infinite_reverse]" />
            <div className="absolute inset-0 m-auto w-16 h-16 rounded-full border-t-2 border-amber-400 animate-spin" />

            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
            </div>

            {/* Orbiting Planets */}
            <div className="absolute inset-0 animate-[spin_4s_linear_infinite]">
              <div className="w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_10px_#f59e0b] absolute -top-1.5 left-1/2 -translate-x-1/2" />
            </div>
            <div className="absolute inset-0 animate-[spin_6s_linear_infinite_reverse]">
              <div className="w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa] absolute top-1/2 -right-1 -translate-y-1/2" />
            </div>
          </div>

          <div className="text-center space-y-3">
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-white to-amber-200 animate-pulse">
              {loadingMessages[loadingStep].main}
            </h3>
            <p className="text-indigo-300/70 text-sm tracking-widest uppercase font-medium">
              {loadingMessages[loadingStep].sub}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-64 h-1 bg-slate-800 rounded-full mt-10 overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-amber-400 transition-all duration-1000 ease-in-out"
              style={{ width: `${((loadingStep + 1) / loadingMessages.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (error || !reading) {
    return (
      <div className="bg-gradient-to-br from-slate-900/80 to-indigo-950/80 rounded-2xl p-8 border border-white/10">
        <div className="text-center py-8">
          <Star className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Your Cosmic Consultation</h3>
          <p className="text-slate-400 mb-6">Get a comprehensive reading of your birth chart</p>
          <button
            onClick={fetchReading}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl text-white font-semibold hover:from-amber-400 hover:to-orange-500 transition-all flex items-center gap-2 mx-auto"
          >
            <Sparkles className="w-5 h-5" />
            Generate AI Reading
          </button>
          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
        </div>
      </div>
    );
  }

  const renderSection = (key: string, data: any) => {
    if (!data || typeof data !== 'object') return null;

    const Icon = SECTION_ICONS[key] || Star;
    const colorClass = SECTION_COLORS[key] || 'from-slate-600 to-slate-700';
    const isExpanded = expandedSections[key];
    const title = data.title || key.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());

    return (
      <div key={key} className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-lg relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        <button
          onClick={() => toggleSection(key)}
          className="w-full flex items-center justify-between p-4 hover:bg-white/10 transition-colors relative z-10"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-md`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-slate-300" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-300" />
          )}
        </button>

        {isExpanded && (
          <div className="px-4 pb-4 space-y-4 relative z-10">
            {data.summary && (
              <p className="text-slate-200 leading-relaxed border-l-2 border-amber-500/50 pl-4 italic relative z-10">
                {data.summary}
              </p>
            )}

            {key === 'cosmic_identity' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.ascendant_meaning && (
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-violet-400" />
                      <span className="text-violet-300 text-sm font-medium">Ascendant</span>
                    </div>
                    <p className="text-slate-200 text-sm">{data.ascendant_meaning}</p>
                  </div>
                )}
                {data.moon_meaning && (
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Moon className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-300 text-sm font-medium">Moon</span>
                    </div>
                    <p className="text-slate-200 text-sm">{data.moon_meaning}</p>
                  </div>
                )}
                {data.sun_meaning && (
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-300 text-sm font-medium">Sun</span>
                    </div>
                    <p className="text-slate-200 text-sm">{data.sun_meaning}</p>
                  </div>
                )}
              </div>
            )}

            {key === 'life_mission' && (
              <>
                {data.career_themes && (
                  <div className="flex flex-wrap gap-2">
                    {data.career_themes.map((theme: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-amber-500/20 text-amber-200 rounded-full text-sm relative z-10">
                        {theme}
                      </span>
                    ))}
                  </div>
                )}
                {data.advice && (
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-300 text-sm font-medium">Guidance</span>
                    </div>
                    <p className="text-slate-200 text-sm">{data.advice}</p>
                  </div>
                )}
              </>
            )}

            {key === 'wealth_patterns' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.strengths && (
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300 text-sm font-medium">Strengths</span>
                    </div>
                    <p className="text-slate-200 text-sm">{data.strengths}</p>
                  </div>
                )}
                {data.challenges && (
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-orange-400" />
                      <span className="text-orange-300 text-sm font-medium">Challenges</span>
                    </div>
                    <p className="text-slate-200 text-sm">{data.challenges}</p>
                  </div>
                )}
                {data.timing && (
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-300 text-sm font-medium">Timing</span>
                    </div>
                    <p className="text-slate-200 text-sm">{data.timing}</p>
                  </div>
                )}
              </div>
            )}

            {key === 'relationships' && (
              <div className="space-y-4">
                {data.partner_type && (
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-pink-400" />
                      <span className="text-pink-300 text-sm font-medium">Ideal Partner</span>
                    </div>
                    <p className="text-slate-200 text-sm">{data.partner_type}</p>
                  </div>
                )}
                {data.advice && (
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4 text-rose-400" />
                      <span className="text-rose-300 text-sm font-medium">Advice</span>
                    </div>
                    <p className="text-slate-200 text-sm">{data.advice}</p>
                  </div>
                )}
              </div>
            )}

            {key === 'health_patterns' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.strengths && (
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Flame className="w-4 h-4 text-teal-400" />
                      <span className="text-teal-300 text-sm font-medium">Strengths</span>
                    </div>
                    <p className="text-slate-200 text-sm">{data.strengths}</p>
                  </div>
                )}
                {data.recommendations && (
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-cyan-400" />
                      <span className="text-cyan-300 text-sm font-medium">Recommendations</span>
                    </div>
                    <p className="text-slate-200 text-sm">{data.recommendations}</p>
                  </div>
                )}
              </div>
            )}

            {key === 'current_period' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.opportunities && (
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-green-400" />
                      <span className="text-green-300 text-sm font-medium">Opportunities</span>
                    </div>
                    <p className="text-slate-200 text-sm">{data.opportunities}</p>
                  </div>
                )}
                {data.challenges && (
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-orange-400" />
                      <span className="text-orange-300 text-sm font-medium">Challenges</span>
                    </div>
                    <p className="text-slate-200 text-sm">{data.challenges}</p>
                  </div>
                )}
              </div>
            )}

            {key === 'sacred_guidance' && (
              <div className="space-y-4">
                {data.mantras && data.mantras.length > 0 && (
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-300 text-sm font-medium">Sacred Mantras</span>
                    </div>
                    <ul className="space-y-2">
                      {data.mantras.map((mantra: string, idx: number) => (
                        <li key={idx} className="text-slate-200 text-sm flex items-start gap-2">
                          <span className="text-yellow-400">•</span>
                          {mantra}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {data.gemstones && data.gemstones.length > 0 && (
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <Gem className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-300 text-sm font-medium">Gemstones</span>
                    </div>
                    <ul className="space-y-2">
                      {data.gemstones.map((gem: string, idx: number) => (
                        <li key={idx} className="text-slate-200 text-sm flex items-start gap-2">
                          <span className="text-purple-400">•</span>
                          {gem}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {data.lifestyle && (
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-300 text-sm font-medium">Daily Practice</span>
                    </div>
                    <p className="text-slate-200 text-sm">{data.lifestyle}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-indigo-950/80 rounded-2xl border border-white/10 overflow-hidden">
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Your Cosmic Consultation</h2>
              <p className="text-slate-400 text-sm">AI-Powered Birth Chart Reading</p>
            </div>
          </div>
          <button
            onClick={fetchReading}
            disabled={isLoading}
            className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-slate-300 text-sm flex items-center gap-2 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {reading.greeting && (
          <div className="mt-6 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20">
            <p className="text-amber-100 text-lg leading-relaxed">{reading.greeting}</p>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {['cosmic_identity', 'life_mission', 'wealth_patterns', 'relationships', 'health_patterns', 'current_period', 'sacred_guidance'].map(key =>
          reading[key] && renderSection(key, reading[key])
        )}

        {reading.closing && (
          <div className="p-8 bg-gradient-to-br from-indigo-900/40 via-violet-900/40 to-slate-900/40 rounded-2xl border border-indigo-500/30 text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Star className="w-10 h-10 text-amber-400 mx-auto mb-4 animate-pulse" />
            <p className="text-indigo-100 text-xl italic leading-relaxed font-medium">{reading.closing}</p>
          </div>
        )}

        {reading.generated_by && (
          <div className="flex items-center justify-center gap-2 pt-6 opacity-40">
            <Brain className="w-3 h-3 text-indigo-400" />
            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">
              Cognitive Core: {reading.provider === 'replit-gemini' ? 'Gemini Pro' : reading.provider || 'AI Engine'}
              {reading.model && ` • ${reading.model}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AstrologerConsultation;
