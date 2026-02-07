import api from './api';
import { UserProfile } from '../context/ChartContext';
import { formatInTimeZone } from 'date-fns-tz';
import {
  GuidancePayload,
  GuidanceStatus,
  GuidanceRowCompact,
  GuidanceHero,
  DecisionCompass,
  EnergyFlowPeriod,
  InteractionCategory,
  CommunicationQuality,
  WorkplaceClimate,
  MoneyMood,
  EmotionalWeather,
  DailyRemedy
} from '../types/guidance';
import { VEDIC_REMEDIES } from '../data/remedyData';

// --- Helpers ---

const pad2 = (n: number) => `${n}`.padStart(2, '0');

export const formatDdMmYyyy = (date: Date) => {
  const dd = pad2(date.getDate());
  const mm = pad2(date.getMonth() + 1);
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

export const formatDateKey = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = pad2(date.getMonth() + 1);
  const dd = pad2(date.getDate());
  return `${yyyy}-${mm}-${dd}`;
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const statusFromScore = (score: number): GuidanceStatus => {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'favorable';
  if (score >= 50) return 'neutral';
  if (score >= 30) return 'sensitive';
  return 'caution';
};

const getGreeting = (now: Date) => {
  const h = now.getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const jdToDate = (jd: number) => {
  const ms = (jd - 2440587.5) * 86400000;
  return new Date(ms);
};

const formatJdTime = (jd: number, timezone: string) => {
  return formatInTimeZone(jdToDate(jd), timezone, 'h:mm a');
};

type RemedyContext = {
  weekday: string;
  dashaLord?: string;
  nakshatraLord?: string;
  transitPlanet?: string;
};

const getDailyRemedy = (ctx: RemedyContext): DailyRemedy => {
  const planetMap: Record<string, string> = {
    'Sunday': 'Sun', 'Monday': 'Moon', 'Tuesday': 'Mars', 'Wednesday': 'Mercury',
    'Thursday': 'Jupiter', 'Friday': 'Venus', 'Saturday': 'Saturn'
  };
  const preferred = ctx.dashaLord || ctx.nakshatraLord || ctx.transitPlanet || planetMap[ctx.weekday] || 'Sun';
  const planet = VEDIC_REMEDIES[preferred] ? preferred : (planetMap[ctx.weekday] || 'Sun');
  const remedyData = VEDIC_REMEDIES[planet];
  
  const type: DailyRemedy['type'] =
    planet === 'Venus' ? 'gemstone'
    : planet === 'Jupiter' ? 'charity'
    : planet === 'Saturn' ? 'charity'
    : planet === 'Mercury' ? 'mantra'
    : planet === 'Moon' ? 'mantra'
    : planet === 'Mars' ? 'ritual'
    : 'ritual';

  let desc = '';
  let instr = '';
  
  if (type === 'mantra') {
    desc = `Chant the ${planet} Beej Mantra`;
    instr = `Recite: "${remedyData.mantra}" 108 times using a ${remedyData.rudraksha} mala.`;
  } else if (type === 'gemstone') {
    desc = `Wear or honor ${remedyData.gemstone}`;
    instr = `If you have a ${remedyData.gemstone}, wear it. Or keep a ${remedyData.color.replace('bg-', '')} cloth with you.`;
  } else if (type === 'charity') {
    desc = `Donate ${remedyData.donation.split(' ')[1] || 'items'}`;
    instr = remedyData.donation;
  } else {
    desc = 'Perform a simple ritual';
    instr = remedyData.karma;
  }

  return {
    type,
    description: desc,
    instructions: instr,
    bestTime: type === 'mantra' ? 'Morning (Brahma Muhurta)' : 'During the day',
    basedOn: `Derived from active lord (${planet})`
  };
};

const generateInteractionForecast = (
  horoscopes: any[],
  _dateKey: string,
  _profileId: string
): InteractionCategory[] => {
  const getScore = (area: string) => clamp(Math.round(horoscopes.find((h: any) => h.life_area === area)?.favorability || 50), 0, 100);

  const getStatus = (score: number) => statusFromScore(score);
  const relScore = getScore('RELATIONSHIPS');
  const careerScore = getScore('CAREER') || getScore('BUSINESS');

  if (!horoscopes?.length) return [];

  return [
    {
      id: 'romantic',
      label: 'Romantic',
      icon: '💑',
      subcategories: [
        {
          id: 'partner',
          title: 'Partner / Spouse',
          emoji: '💖',
          score: relScore,
          status: getStatus(relScore),
          overview: 'Relationship tone follows today’s relationship indicators.',
          energyDescription: 'Aim for clarity and proportionate responses.',
          goodFor: ['Quality time', 'Deep listening'],
          avoid: ['Criticism', 'Reactivity'],
          bestTiming: null,
          powerMove: 'Ask one clear question and listen fully.'
        },
        {
          id: 'dating',
          title: 'Dating / New',
          emoji: '🌹',
          score: relScore,
          status: getStatus(relScore),
          overview: 'Keep interactions simple and honest.',
          energyDescription: 'Let consistency do the work.',
          goodFor: ['Authentic conversation'],
          avoid: ['Rushing intimacy'],
          bestTiming: null,
          powerMove: 'Match pace to comfort, not excitement.'
        }
      ]
    },
    {
      id: 'workplace',
      label: 'Work',
      icon: '💼',
      subcategories: [
        {
          id: 'manager',
          title: 'Manager / Boss',
          emoji: '👔',
          score: careerScore,
          status: getStatus(careerScore),
          overview: 'Career tone follows today’s career indicators.',
          energyDescription: 'Lead with specifics and a clear next step.',
          goodFor: ['Updates', 'Proposing solutions'],
          avoid: ['Escalations without preparation'],
          bestTiming: null,
          powerMove: 'Present a solution with constraints.'
        },
        {
          id: 'colleagues',
          title: 'Colleagues',
          emoji: '👥',
          score: careerScore,
          status: getStatus(careerScore),
          overview: 'Collaboration depends on clarity and timing.',
          energyDescription: 'Reduce ambiguity; confirm ownership.',
          goodFor: ['Brainstorming', 'Helping others'],
          avoid: ['Gossip', 'Overpromising'],
          bestTiming: null,
          powerMove: 'Document decisions in one message.'
        }
      ]
    },
  ];
};

// --- Main Service ---

const profileFingerprint = (profile: UserProfile) => {
  const rawId = profile.raw?.id ?? '';
  const date = profile.date ?? '';
  const time = profile.time ?? '';
  const timezone = profile.timezone ?? '';
  const latitude = profile.latitude ?? '';
  const longitude = profile.longitude ?? '';
  const location = profile.location ?? '';
  const name = profile.name ?? '';
  return [rawId, date, time, timezone, latitude, longitude, location, name].join('|');
};

const cacheKey = (profile: UserProfile, dateKey: string) => `guidance_cache_v4:${profileFingerprint(profile)}:${dateKey}`;

const saveCache = (profile: UserProfile, dateKey: string, payload: GuidancePayload) => {
  try {
    localStorage.setItem(cacheKey(profile, dateKey), JSON.stringify(payload));
  } catch { /* ignore */ }
};

const loadCache = (profile: UserProfile, dateKey: string): GuidancePayload | null => {
  try {
    const raw = localStorage.getItem(cacheKey(profile, dateKey));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

export interface LoadGuidanceOptions {
  date?: Date;
  forceRefresh?: boolean;
}

export const guidanceService = {
  loadDaily: async (profile: UserProfile, options: LoadGuidanceOptions = {}): Promise<{ payload: GuidancePayload; fromCache: boolean }> => {
    const now = options.date ? new Date(options.date) : new Date();
    const dateKey = formatDateKey(now);
    const profileId = profile.raw?.id || profile.name;

    if (!options.forceRefresh) {
      const cached = loadCache(profile, dateKey);
      if (cached) return { payload: cached, fromCache: true };
    }

    const ddmmyyyy = formatDdMmYyyy(now);
    const time = `${pad2(now.getHours())}:${pad2(now.getMinutes())}`;

    // 1. Fetch Backend Data
    const chartData = {
      date: profile.date, time: profile.time, timezone: profile.timezone,
      latitude: profile.latitude, longitude: profile.longitude, location: profile.location, name: profile.name
    };
    const panchangReq = { date: ddmmyyyy, time, timezone: profile.timezone, latitude: profile.latitude, longitude: profile.longitude };

    // Use Promise.allSettled for robustness
    const [dailyHoroscopeRes, livePanchangRes, plannerMomentsRes] = await Promise.allSettled([
      api.post('/ai/daily-horoscopes', { chart_data: chartData, current_date: now.toISOString() }),
      api.post('/chart/live-panchang', panchangReq),
      api.post('/chart/planner/moments', panchangReq)
    ]);

    // Extract data with fallbacks
    const daily =
      dailyHoroscopeRes.status === 'fulfilled' && dailyHoroscopeRes.value.data?.status === 'success'
        ? (dailyHoroscopeRes.value.data?.data || {})
        : {};
    const livePanchang = livePanchangRes.status === 'fulfilled' ? (livePanchangRes.value.data?.current || livePanchangRes.value.data?.data?.current || {}) : {};
    const planner = plannerMomentsRes.status === 'fulfilled' ? (plannerMomentsRes.value.data || {}) : {};
    
    // Log errors if any (for debugging)
    if (dailyHoroscopeRes.status === 'rejected') console.error('Daily Horoscope API failed:', dailyHoroscopeRes.reason);
    if (livePanchangRes.status === 'rejected') console.error('Live Panchang API failed:', livePanchangRes.reason);
    if (plannerMomentsRes.status === 'rejected') console.error('Planner Moments API failed:', plannerMomentsRes.reason);

    const horoscopes = (daily.horoscopes || []) as any[];
    if (!horoscopes.length) {
      throw new Error('Daily horoscopes unavailable');
    }
    const sortedByScore = [...horoscopes].sort((a, b) => (b?.favorability || 0) - (a?.favorability || 0));
    const bestHoro = sortedByScore[0];
    const worstHoro = sortedByScore[sortedByScore.length - 1];
    
    // 2. Derive Core Metrics (From real horoscope data if possible)
    const careerHoro = horoscopes.find(h => h.life_area === 'CAREER');
    const wealthHoro = horoscopes.find(h => h.life_area === 'WEALTH');
    const loveHoro = horoscopes.find(h => h.life_area === 'RELATIONSHIPS');
    const healthHoro = horoscopes.find(h => h.life_area === 'WELLNESS');
    const emotionalHoro = horoscopes.find(h => h.life_area === 'EMOTIONAL');
    const decisionsHoro = horoscopes.find(h => h.life_area === 'DECISIONS');

    const moodScore = clamp(Math.round(emotionalHoro?.favorability ?? loveHoro?.favorability ?? 50), 0, 100);
    const energyScore = clamp(Math.round(healthHoro?.favorability ?? 50), 0, 100);
    
    // 3. Construct Sections
    
    // Header
    const weekdayLabel = now.toLocaleDateString('en-US', { weekday: 'long' });
    const header = {
      dateLabel: now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
      weekdayLabel,
      greeting: getGreeting(now),
      vedicLine: `${livePanchang.tithi || 'Tithi'} • ${livePanchang.nakshatra || 'Nakshatra'}`,
      moonPhase: { name: livePanchang.phase_name || 'Moon', illumination: livePanchang.illumination }
    };

    // Quick Metrics (Using Real Data)
    const quickMetrics = [
      { key: 'MOOD', label: 'Mood', icon: 'mood', status: statusFromScore(moodScore), score: moodScore, hint: 'internal state' },
      { key: 'ENERGY', label: 'Energy', icon: 'energy', status: statusFromScore(energyScore), score: energyScore, hint: 'vitality' },
      { key: 'CAREER_WORK', label: 'Career', icon: 'career', status: statusFromScore(Math.round(careerHoro?.favorability ?? 50)), score: Math.round(careerHoro?.favorability ?? 50), hint: 'professional' },
      { key: 'WEALTH_MONEY', label: 'Money', icon: 'money', status: statusFromScore(Math.round(wealthHoro?.favorability ?? 50)), score: Math.round(wealthHoro?.favorability ?? 50), hint: 'finances' },
      { key: 'RELATIONSHIPS', label: 'Relationships', icon: 'love', status: statusFromScore(Math.round(loveHoro?.favorability ?? 50)), score: Math.round(loveHoro?.favorability ?? 50), hint: 'connection' },
      { key: 'HEALTH_ENERGY', label: 'Health', icon: 'health', status: statusFromScore(Math.round(healthHoro?.favorability ?? 50)), score: Math.round(healthHoro?.favorability ?? 50), hint: 'wellness' }
    ] as any;

    // Hero
    const overallBand = String(daily.confidence?.band || '').toUpperCase();
    const hero: GuidanceHero = {
      themeHeadline: daily.overall_theme || 'Daily focus',
      paragraphs: [
        horoscopes[0]?.synthesis,
        decisionsHoro?.synthesis,
        careerHoro?.synthesis
      ].filter(Boolean).map((s: any) => String(s)).slice(0, 3),
      tone: overallBand === 'OBSERVATIONAL' ? 'cautious' : 'balanced',
      avoidLine: daily.neutral_day ? 'Avoid forcing outcomes without activation.' : (worstHoro?.synthesis ? String(worstHoro.synthesis).slice(0, 80) : 'Avoid rushing key decisions without confirmation.'),
      primaryFocus: daily.primary_focus || (bestHoro?.life_area ? String(bestHoro.life_area) : 'Focus'),
      cosmicReason: horoscopes[0]?.dasha_context?.theme || horoscopes[0]?.transit_trigger?.effect || ''
    };

    const buildRow = (area: any, label: string, icon: string, h: any, askAiTopic: any): GuidanceRowCompact | null => {
      if (!h) return null;
      const synthesis = String(h.synthesis || '').trim();
      return {
        area,
        label,
        icon,
        status: statusFromScore(Math.round(h.favorability || 0)),
        score: Math.round(h.favorability || 0),
        overview: synthesis ? `${synthesis.slice(0, 90)}${synthesis.length > 90 ? '…' : ''}` : '',
        context: h.dasha_context?.theme || '',
        oneLineFocus: h.optimal_action?.action || '',
        expanded: {
          tone: h.confidence?.band || 'Balanced',
          guidanceLines: synthesis ? [synthesis] : [],
          goodFor: h.optimal_action?.action ? [h.optimal_action.action] : [],
          avoid: h.activation?.activated ? [] : ['Forcing outcomes'],
          focusAdvice: h.activation?.activated ? 'Prioritize the activated area and keep scope tight.' : 'Keep routines stable and avoid over-committing.',
          askAiTopic
        }
      };
    };

    const lifeGuidance = [
      buildRow('CAREER_WORK', 'Career', 'star', careerHoro || horoscopes.find(h => h.life_area === 'BUSINESS'), 'career'),
      buildRow('WEALTH_MONEY', 'Money', 'star', wealthHoro, 'money'),
      buildRow('RELATIONSHIPS', 'Relationships', 'star', loveHoro, 'relationships'),
      buildRow('HEALTH_ENERGY', 'Health', 'star', healthHoro, 'health'),
      buildRow('DECISIONS_COMMUNICATION', 'Decisions', 'star', decisionsHoro, 'decisions')
    ].filter(Boolean) as GuidanceRowCompact[];

    // Interaction Forecast (The big new one)
    const interactionForecast = generateInteractionForecast(horoscopes, dateKey, profileId);

    // Decision Compass
    const decisionsScore = clamp(Math.round(decisionsHoro?.favorability ?? energyScore), 0, 100);
    const decisionCompass: DecisionCompass = {
      overallScore: decisionsScore,
      recommendation: decisionsScore >= 80 ? 'Proceed' : decisionsScore >= 60 ? 'Proceed Carefully' : decisionsScore >= 40 ? 'Delay' : 'Avoid',
      reasoning: decisionsHoro?.synthesis || decisionsHoro?.dasha_context?.theme || 'Decision tone is based on today’s activation strength.',
      smallDecisions: { status: decisionsScore >= 50 ? 'go' : 'caution', guidance: decisionsScore >= 50 ? 'Proceed with simple choices.' : 'Keep choices reversible.' },
      mediumDecisions: { status: decisionsScore >= 70 ? 'go' : decisionsScore >= 50 ? 'caution' : 'avoid', guidance: 'Prefer explicit trade-offs and written checks.' },
      bigDecisions: { status: decisionsScore >= 85 ? 'go' : decisionsScore >= 60 ? 'caution' : 'avoid', guidance: 'Avoid irreversible commitments without confirmation.' },
      emotionalDecisions: { status: moodScore >= 60 ? 'go' : 'avoid', guidance: moodScore >= 60 ? 'Name the feeling, then decide.' : 'Delay decisions driven by mood.' }
    };

    // Energy Flow
    const morningLevel = clamp(energyScore + 10, 0, 100);
    const afternoonLevel = clamp(energyScore, 0, 100);
    const eveningLevel = clamp(energyScore - 15, 0, 100);
    const energyFlow: EnergyFlowPeriod[] = [
      { period: 'morning', label: 'Morning', timeRange: '06:00 - 12:00', energyLevel: morningLevel, energyLabel: statusFromScore(morningLevel), bestFor: ['Deep work'], avoid: ['Overcommitting'] },
      { period: 'afternoon', label: 'Afternoon', timeRange: '12:00 - 17:00', energyLevel: afternoonLevel, energyLabel: statusFromScore(afternoonLevel), bestFor: ['Coordination'], avoid: ['Multi-tasking'] },
      { period: 'evening', label: 'Evening', timeRange: '17:00 - 22:00', energyLevel: eveningLevel, energyLabel: statusFromScore(eveningLevel), bestFor: ['Recovery'], avoid: ['Late decisions'] }
    ];

    // Detailed Metrics (Using Real Data)
    const commScore = (careerHoro?.favorability || 70) * 0.6 + (loveHoro?.favorability || 70) * 0.4;
    const communicationQuality: CommunicationQuality = {
      listeningQuality: Math.round(commScore + 10), 
      speakingClarity: Math.round(commScore), 
      emotionalReactivity: Math.round(100 - commScore), 
      overall: Math.round(commScore),
      contextAdvice: { 
        office: careerHoro?.optimal_action?.action || 'Be clear.', 
        family: 'Listen more.', 
        clients: 'Emphasize value.', 
        manager: 'Report facts.' 
      }
    };

    const workplaceClimate: WorkplaceClimate = {
      officeVibe: Math.round(careerHoro?.favorability || 75), 
      authorityPressure: Math.round(100 - (careerHoro?.favorability || 75)), 
      teamCooperation: Math.round((careerHoro?.favorability || 75) + 10), 
      visibilityLevel: 60,
      strategy: careerHoro?.optimal_action?.action || 'Collaborate and share credit.'
    };

    const moneyMood: MoneyMood = {
      riskAppetite: Math.round((wealthHoro?.favorability || 60) * 0.8), 
      spendingCaution: Math.round(100 - (wealthHoro?.favorability || 60)), 
      savingMindset: Math.round((wealthHoro?.favorability || 60) + 20),
      goodFor: ['Budgeting'], avoid: ['Impulse buys']
    };

    const emotionalWeather: EmotionalWeather = {
      type: moodScore > 70 ? 'sunny' : moodScore > 40 ? 'cloudy' : 'stormy',
      forecast: loveHoro?.synthesis?.slice(0, 50) + '...' || 'Clearing up by evening.',
      copingStrategies: ['Deep breathing'],
      selfCare: ['Walk in nature']
    };

    const primaryHoro = careerHoro || wealthHoro || loveHoro || healthHoro || decisionsHoro || emotionalHoro || horoscopes[0];
    const dashaCtx = primaryHoro?.dasha_context;
    const nakCtx = primaryHoro?.nakshatra_context;
    const remedy = getDailyRemedy({
      weekday: weekdayLabel,
      dashaLord: dashaCtx?.antardasha,
      nakshatraLord: nakCtx?.nakshatra_lord,
      transitPlanet: primaryHoro?.transit_trigger?.planet
    });

    const activities = sortedByScore.slice(0, 5).map((h: any) => ({
      name: h.life_area,
      rating: clamp(Math.round((h.favorability || 0) / 20), 1, 5),
      bestTime: h.optimal_action?.timing || '',
      reason: h.transit_trigger?.effect || h.dasha_context?.theme || ''
    }));

    const transits = horoscopes
      .filter((h: any) => h.transit_trigger?.planet)
      .slice(0, 8)
      .map((h: any) => {
        const impact: 'high' | 'medium' | 'low' =
          h.transit_trigger.urgency === 'Peak' ? 'high'
          : h.transit_trigger.urgency === 'Building' ? 'medium'
          : 'low';
        return {
        planet: h.transit_trigger.planet,
        event: `${h.transit_trigger.aspect_type} ${h.transit_trigger.target_point}`,
        date: header.dateLabel,
          impact,
        description: h.transit_trigger.effect
        };
      });

    const payload: GuidancePayload = {
      dateKey,
      header,
      quickMetrics,
      hero,
      lifeGuidance,
      interactionForecast,
      decisionCompass,
      energyFlow,
      communicationQuality,
      workplaceClimate,
      moneyMood,
      emotionalWeather,
      oneMistake: worstHoro?.life_area ? `Avoid forcing outcomes in ${String(worstHoro.life_area).toLowerCase()} without clear activation.` : 'Avoid forcing outcomes without clear activation.',
      onePowerAction: bestHoro?.optimal_action?.action || 'Take one focused step and follow through.',
      nakshatra: {
        name: nakCtx?.current_nakshatra || livePanchang.nakshatra || 'Unknown',
        deity: nakCtx?.deity || '',
        symbol: '',
        quality: nakCtx?.theme || '',
        insight: bestHoro?.synthesis || '',
        mantra: daily.power_mantra || ''
      },
      panchang: {
        auspiciousTimes: planner.moments?.filter((m: any) => m.type === 'golden').map((m: any) => ({ name: 'Golden Time', start: formatJdTime(m.start, profile.timezone), end: formatJdTime(m.end, profile.timezone), activities: ['Important work'] })) || [],
        inauspiciousTimes: [],
        tithi: livePanchang.tithi, yoga: livePanchang.yoga, karana: livePanchang.karana
      },
      activities,
      dasha: {
        mahaDasha: { planet: dashaCtx?.mahadasha || 'Unknown', endDate: '' },
        antarDasha: { planet: dashaCtx?.antardasha || 'Unknown', endDate: '' },
        pratyantarDasha: { planet: dashaCtx?.pratyantar || 'Unknown', endDate: '' },
        percentComplete: 0,
        theme: dashaCtx?.theme || '',
        daysRemaining: 0
      },
      transits,
      remedy,
      userStats: {
        streakDays: 0,
        moodHistory: [],
        challengesCompleted: 0
      },
      sourceMeta: {
        generatedAtIso: new Date().toISOString(),
        profileName: profile.name
      }
    };

    if (horoscopes.length) saveCache(profile, dateKey, payload);
    return { payload, fromCache: false };
  }
};
