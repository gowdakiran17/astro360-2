import { useState } from 'react';
import {
  Briefcase, Heart, Activity, Sparkles, TrendingUp, TrendingDown,
  CheckCircle, Info, AlertCircle, Star, Sun, Moon, Wallet,
  GraduationCap, Home, BarChart3
} from 'lucide-react';

interface LifeDomainsAdvancedProps {
  chartData: any;
  dashaData?: any;
  periodOverview?: any;
  aiPredictions?: any;
}

const ALL_DOMAINS = [
  { id: 'career', label: 'Career & Profession', icon: Briefcase, color: 'blue', gradient: 'from-blue-500 to-cyan-500' },
  { id: 'relationships', label: 'Love & Relationships', icon: Heart, color: 'rose', gradient: 'from-rose-500 to-pink-500' },
  { id: 'health', label: 'Health & Vitality', icon: Activity, color: 'emerald', gradient: 'from-emerald-500 to-green-500' },
  { id: 'wealth', label: 'Wealth & Finance', icon: Wallet, color: 'amber', gradient: 'from-amber-500 to-yellow-500' },
  { id: 'spiritual', label: 'Spiritual Growth', icon: Moon, color: 'purple', gradient: 'from-purple-500 to-violet-500' },
  { id: 'business', label: 'Business & Entrepreneurship', icon: BarChart3, color: 'indigo', gradient: 'from-indigo-500 to-blue-600' },
  { id: 'education', label: 'Education & Learning', icon: GraduationCap, color: 'teal', gradient: 'from-teal-500 to-cyan-500' },
  { id: 'family', label: 'Family & Home', icon: Home, color: 'orange', gradient: 'from-orange-500 to-amber-500' }
];

const DOMAIN_TABS = [
  { id: 'career', label: 'Career & Finance', icon: Briefcase },
  { id: 'relationships', label: 'Relationships', icon: Heart },
  { id: 'health', label: 'Health & Wellness', icon: Activity },
  { id: 'spiritual', label: 'Spiritual Growth', icon: Sparkles },
  { id: 'business', label: 'Business', icon: BarChart3 },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'family', label: 'Family', icon: Home }
];

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
  spiritual: {
    houses: [9, 12, 5],
    karakas: ['Jupiter', 'Ketu', 'Moon'],
    themes: ['Dharma and philosophy', 'Liberation and transcendence', 'Past life merits']
  },
  business: {
    houses: [2, 10, 11],
    karakas: ['Mercury', 'Jupiter', 'Mars'],
    themes: ['Trade and commerce', 'Enterprise ventures', 'Business profits']
  },
  education: {
    houses: [4, 5, 9],
    karakas: ['Mercury', 'Jupiter', 'Moon'],
    themes: ['Academic success', 'Intelligence and learning', 'Higher knowledge']
  },
  family: {
    houses: [2, 4, 9],
    karakas: ['Moon', 'Jupiter', 'Venus'],
    themes: ['Family wealth', 'Home and mother', 'Father and elders']
  },
  wealth: {
    houses: [2, 11, 9],
    karakas: ['Jupiter', 'Venus', 'Mercury'],
    themes: ['Accumulated wealth', 'Income sources', 'Fortune and luck']
  }
};

const PHASE_NAMES = ['Foundation', 'Growth', 'Peak', 'Consolidation', 'Transformation'];

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

const LifeDomainsAdvanced: React.FC<LifeDomainsAdvancedProps> = ({
  chartData,
  aiPredictions
}) => {
  const [activeTab, setActiveTab] = useState('career');

  if (!chartData?.planets) return null;

  const planets = chartData.planets || [];

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

    const houseIndex = (houseNum - 1) % 12;
    strength += (houseIndex % 3) * 2;

    return Math.min(40, Math.max(15, strength));
  };

  const getCurrentPhase = () => {
    const phases = PHASE_NAMES;
    const moon = planets.find((p: any) => p.name === 'Moon');
    const moonDeg = moon?.degree || 0;
    const phaseIndex = Math.floor(moonDeg / 72) % phases.length;
    return phases[phaseIndex];
  };

  const getDomainScore = (domainId: string) => {
    const domInfo = HOUSE_SIGNIFICATIONS[domainId];
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

    // AI prediction boost if available
    const aiKey = domainId === 'relationships' ? 'love' : domainId;
    if (aiPredictions?.[aiKey]?.score) {
      score = (score + aiPredictions[aiKey].score) / 2;
    }

    return Math.min(95, Math.max(35, Math.round(score)));
  };

  const getTrend = (domainId: string) => {
    const aiKey = domainId === 'relationships' ? 'love' : domainId;
    if (aiPredictions?.[aiKey]?.trend) {
      return aiPredictions[aiKey].trend;
    }
    const score = getDomainScore(domainId);
    return score >= 65 ? 'up' : score >= 45 ? 'neutral' : 'down';
  };

  const getScores = (domain: string) => {
    const domInfo = HOUSE_SIGNIFICATIONS[domain];
    if (!domInfo) return { momentum: 50, financial: 50, gains: 50 };

    let momentum = 50;
    let financial = 50;
    let gains = 50;

    for (const planet of planets) {
      if (domInfo.karakas.includes(planet.name)) {
        if (!planet.retrograde) {
          momentum += 5;
          financial += 3;
          gains += 4;
        }
        if (planet.dignityStatus === 'exalted') {
          momentum += 8;
          financial += 6;
          gains += 7;
        } else if (planet.dignityStatus === 'own') {
          momentum += 5;
          financial += 4;
          gains += 5;
        } else if (planet.dignityStatus === 'debilitated') {
          momentum -= 6;
          financial -= 5;
          gains -= 5;
        }
      }
    }

    return {
      momentum: Math.min(95, Math.max(30, momentum)),
      financial: Math.min(95, Math.max(30, financial)),
      gains: Math.min(95, Math.max(30, gains))
    };
  };

  const getHouseInsights = (domain: string) => {
    const domInfo = HOUSE_SIGNIFICATIONS[domain];
    if (!domInfo) return [];

    const insights = [];

    for (const house of domInfo.houses) {
      const strength = getHouseStrength(house, domain);
      let description = '';
      let status: 'positive' | 'neutral' | 'caution' = 'neutral';

      if (domain === 'career') {
        if (house === 10) {
          description = strength >= 28
            ? 'High strength indicates excellent support. Expect recognition from authority and success in undertakings.'
            : 'Moderate strength offers steady progress. Focus on consistent effort.';
          status = strength >= 28 ? 'positive' : 'neutral';
        } else if (house === 2) {
          description = strength >= 28
            ? 'Strong finances ahead. Wealth accumulation is favored.'
            : 'Finances are stable. Focus on saving and avoid unnecessary expenditures.';
          status = strength >= 28 ? 'positive' : 'neutral';
        } else if (house === 11) {
          description = 'Your network and social circles are supportive. Profits and wish fulfillment are highlighted.';
          status = 'positive';
        }
      } else if (domain === 'business') {
        if (house === 10) {
          description = 'Business ventures and entrepreneurship are favored. Leadership in trade is highlighted.';
          status = 'positive';
        } else if (house === 2) {
          description = strength >= 28
            ? 'Strong capital for business. Trade and commerce bring good returns.'
            : 'Moderate capital available. Focus on steady business growth.';
          status = strength >= 28 ? 'positive' : 'neutral';
        } else if (house === 11) {
          description = 'Business profits and gains from enterprises are excellent.';
          status = 'positive';
        }
      } else if (domain === 'education') {
        if (house === 4) {
          description = 'Foundation of learning is strong. Academic environment supports growth.';
          status = 'positive';
        } else if (house === 5) {
          description = strength >= 28
            ? 'Intelligence and creative learning are excellent. Academic success is favored.'
            : 'Focus on developing intellectual abilities through consistent study.';
          status = strength >= 28 ? 'positive' : 'neutral';
        } else if (house === 9) {
          description = 'Higher education and specialized knowledge are supported. Guru blessings aid learning.';
          status = 'positive';
        }
      } else if (domain === 'family') {
        if (house === 2) {
          description = 'Family wealth and resources are available. Family support is strong.';
          status = 'positive';
        } else if (house === 4) {
          description = strength >= 28
            ? 'Home environment is harmonious. Mother and domestic happiness are favored.'
            : 'Focus on creating peace and stability at home.';
          status = strength >= 28 ? 'positive' : 'neutral';
        } else if (house === 9) {
          description = 'Father and elders bring blessings. Ancestral support is present.';
          status = 'positive';
        }
      } else if (domain === 'relationships') {
        if (house === 7) {
          description = strength >= 28
            ? 'Partnership harmony is excellent. Marriage and relationships are favored.'
            : 'Focus on communication and understanding in relationships.';
          status = strength >= 28 ? 'positive' : 'neutral';
        } else if (house === 5) {
          description = 'Romance and creative expression are highlighted.';
          status = 'positive';
        } else if (house === 11) {
          description = 'Social connections bring joy. Friendships are supportive.';
          status = 'positive';
        }
      } else if (domain === 'health') {
        if (house === 1) {
          description = strength >= 28
            ? 'Strong vitality and energy. Physical constitution is robust.'
            : 'Maintain regular health routines for optimal wellbeing.';
          status = strength >= 28 ? 'positive' : 'neutral';
        } else if (house === 6) {
          description = strength >= 28
            ? 'Good disease resistance. Health challenges are overcome.'
            : 'Take care of chronic issues. Avoid stress.';
          status = strength >= 28 ? 'positive' : 'caution';
        } else if (house === 8) {
          description = 'Transformation and healing energies support longevity.';
          status = 'neutral';
        }
      } else if (domain === 'spiritual') {
        if (house === 9) {
          description = 'Dharma and higher learning are strongly supported. Spiritual progress is assured.';
          status = 'positive';
        } else if (house === 12) {
          description = 'Meditation and spiritual practices bring deep insights.';
          status = 'positive';
        } else if (house === 5) {
          description = 'Past life merits are activated. Devotion brings fulfillment.';
          status = 'positive';
        }
      } else if (domain === 'wealth') {
        if (house === 2) {
          description = strength >= 28
            ? 'Accumulated wealth grows. Financial security is strong.'
            : 'Focus on building savings and managing resources wisely.';
          status = strength >= 28 ? 'positive' : 'neutral';
        } else if (house === 11) {
          description = 'Multiple income sources and gains are present. Prosperity is indicated.';
          status = 'positive';
        } else if (house === 9) {
          description = 'Fortune and luck support wealth creation. Blessed financial opportunities.';
          status = 'positive';
        }
      }

      insights.push({
        house,
        houseName: getHouseName(house, domain),
        strength,
        description,
        status
      });
    }

    return insights;
  };

  const getHouseName = (house: number, domain: string) => {
    const names: Record<number, Record<string, string>> = {
      1: { health: 'Vitality House (1st)' },
      2: { career: 'Wealth House (2nd)', business: 'Capital House (2nd)', family: 'Family Wealth (2nd)', wealth: 'Wealth House (2nd)' },
      4: { education: 'Foundation House (4th)', family: 'Home & Mother (4th)' },
      5: { relationships: 'Romance House (5th)', spiritual: 'Devotion House (5th)', education: 'Intelligence House (5th)' },
      6: { health: 'Health House (6th)' },
      7: { relationships: 'Partnership House (7th)' },
      8: { health: 'Longevity House (8th)' },
      9: { spiritual: 'Dharma House (9th)', education: 'Higher Learning (9th)', family: 'Father & Elders (9th)', wealth: 'Fortune House (9th)' },
      10: { career: 'Career House (10th)', business: 'Enterprise House (10th)' },
      11: { career: 'Gains House (11th)', relationships: 'Friendship House (11th)', business: 'Profits House (11th)', wealth: 'Income House (11th)' },
      12: { spiritual: 'Liberation House (12th)' }
    };
    return names[house]?.[domain] || `House ${house}`;
  };

  const getDomainKarakas = (domain: string) => {
    const domInfo = HOUSE_SIGNIFICATIONS[domain];
    if (!domInfo) return [];
    const karakaNames = domInfo.karakas;
    return planets.filter((p: any) => karakaNames.includes(p.name));
  };

  const currentPhase = getCurrentPhase();
  const scores = getScores(activeTab);
  const insights = getHouseInsights(activeTab);
  const karakaPlanets = getDomainKarakas(activeTab);

  return (
    <div className="space-y-6">
      {/* Cards Grid - All Domains At-A-Glance */}
      <div className="bg-[#0F0F16] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="bg-emerald-500/5 px-8 py-5 border-b border-emerald-500/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            Life Areas Analysis
          </h2>
          <div className="flex items-center gap-3">
            {aiPredictions?.ai_powered && (
              <div className="px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">AI-Analyzed</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ALL_DOMAINS.map((domain) => {
              const Icon = domain.icon;
              const score = getDomainScore(domain.id);
              const trend = getTrend(domain.id);
              const aiKey = domain.id === 'relationships' ? 'love' : domain.id;
              const prediction = aiPredictions?.[aiKey];

              return (
                <button
                  key={domain.id}
                  onClick={() => setActiveTab(domain.id)}
                  className={`relative group bg-slate-900/40 hover:bg-slate-800/60 rounded-2xl p-6 border transition-all text-left ${activeTab === domain.id
                    ? `border-${domain.color}-500/50 ring-1 ring-${domain.color}-500/30`
                    : `border-white/5 hover:border-white/10`
                    }`}
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-${domain.color}-500/10`}>
                          <Icon className={`w-4 h-4 text-${domain.color}-400`} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{domain.label}</span>
                      </div>
                      {trend && (
                        <div className="flex items-center gap-1">
                          {trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
                          {trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-rose-400" />}
                        </div>
                      )}
                    </div>

                    <div className="flex items-baseline gap-2 mb-3">
                      <span className={`text-2xl font-bold ${score >= 70 ? 'text-emerald-400' :
                        score >= 50 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                        {score}%
                      </span>
                      <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                        {score >= 70 ? 'Excellent' : score >= 50 ? 'Good' : 'Review'}
                      </span>
                    </div>

                    {prediction?.summary && (
                      <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 italic">{prediction.summary}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {aiPredictions?.overall_message && (
            <div className="mt-8 p-5 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
              <p className="text-emerald-200/80 text-sm leading-relaxed italic">{aiPredictions.overall_message}</p>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Tabbed Interface */}
      <div className="bg-[#0F0F16] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-white/5 bg-white/[0.02]">
          {DOMAIN_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-8 py-5 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap transition-all ${activeTab === tab.id
                  ? 'text-emerald-400 border-b-2 border-emerald-500 bg-emerald-500/5'
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Header with Phase and Scores */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                {activeTab === 'career' ? 'Professional Trajectory' :
                  activeTab === 'relationships' ? 'Relationship Dynamics' :
                    activeTab === 'health' ? 'Health & Vitality' :
                      activeTab === 'spiritual' ? 'Spiritual Journey' :
                        activeTab === 'business' ? 'Business & Entrepreneurship' :
                          activeTab === 'education' ? 'Education & Learning' :
                            activeTab === 'family' ? 'Family & Home' : 'Wealth Creation'}
              </h3>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="px-3 py-1 text-xs bg-emerald-500/30 text-emerald-200 rounded-full">
                  Current Phase: {currentPhase}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-xs text-slate-400 uppercase mb-1">Momentum</p>
                <p className={`text-xl font-bold ${scores.momentum >= 70 ? 'text-emerald-400' : scores.momentum >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {scores.momentum}%
                </p>
                <p className="text-[10px] text-slate-500">{scores.momentum >= 70 ? 'Good' : scores.momentum >= 50 ? 'Moderate' : 'Low'}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400 uppercase mb-1">Financial</p>
                <p className={`text-xl font-bold ${scores.financial >= 70 ? 'text-emerald-400' : scores.financial >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {scores.financial}%
                </p>
                <p className="text-[10px] text-slate-500">{scores.financial >= 70 ? 'Good' : scores.financial >= 50 ? 'Moderate' : 'Low'}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400 uppercase mb-1">Gains</p>
                <p className={`text-xl font-bold ${scores.gains >= 70 ? 'text-emerald-400' : scores.gains >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {scores.gains}%
                </p>
                <p className="text-[10px] text-slate-500">{scores.gains >= 70 ? 'Good' : scores.gains >= 50 ? 'Moderate' : 'Low'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Key Insights */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-semibold text-white uppercase tracking-wide">Key Insights</h4>
              </div>
              <div className="space-y-4">
                {insights.map((insight, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border ${insight.status === 'positive' ? 'bg-emerald-900/20 border-emerald-500/30' :
                      insight.status === 'caution' ? 'bg-amber-900/20 border-amber-500/30' :
                        'bg-slate-800/50 border-slate-700/30'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      {insight.status === 'positive' ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      ) : insight.status === 'caution' ? (
                        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Info className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-semibold ${insight.status === 'positive' ? 'text-emerald-200' :
                            insight.status === 'caution' ? 'text-amber-200' : 'text-white'
                            }`}>
                            {insight.houseName}
                          </span>
                          <span className="text-xs text-slate-500">({insight.strength} pts)</span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Planetary Influences */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sun className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-semibold text-white uppercase tracking-wide">Planetary Influences</h4>
              </div>
              <div className="space-y-3">
                {karakaPlanets.map((planet: any, idx: number) => {
                  const sign = planet.zodiac_sign || planet.sign || '-';
                  const nak = typeof planet.nakshatra === 'string' ? planet.nakshatra : planet.nakshatra?.name || '-';
                  return (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${PLANET_UI_CONFIG[planet.name]?.gradient || 'from-slate-600 to-slate-700'} flex items-center justify-center text-white shadow-lg`}>
                        {planet.name.slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white">{planet.name}</p>
                        <p className="text-sm text-slate-400">in {sign} • {nak}</p>
                      </div>
                      <div className="px-3 py-1 bg-slate-700/50 rounded-full text-xs text-slate-300">
                        Domain Karaka
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AI Prediction if available */}
              {(() => {
                const keyMap: Record<string, string> = {
                  'career': 'career',
                  'relationships': 'love',
                  'health': 'health',
                  'spiritual': 'spiritual',
                  'business': 'business',
                  'wealth': 'wealth',
                  'education': 'education',
                  'family': 'family'
                };
                const aiKey = keyMap[activeTab];
                const prediction = aiPredictions?.[aiKey];
                return prediction ? (
                  <div className="mt-4 p-4 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-xl border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span className="text-xs text-purple-300 uppercase">AI Insight</span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed">{prediction.summary}</p>
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifeDomainsAdvanced;
