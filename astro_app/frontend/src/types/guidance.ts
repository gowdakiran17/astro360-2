export type GuidanceStatus = 'excellent' | 'favorable' | 'neutral' | 'sensitive' | 'caution';

export type GuidanceArea =
  | 'CAREER_WORK'
  | 'WEALTH_MONEY'
  | 'RELATIONSHIPS'
  | 'HEALTH_ENERGY'
  | 'DECISIONS_COMMUNICATION';

export type RotatingCardType =
  | 'CONVERSATION_QUALITY'
  | 'WORKPLACE_CLIMATE'
  | 'MONEY_MOOD'
  | 'EMOTIONAL_WEATHER'
  | 'ONE_POWERFUL_ACTION'
  | 'PERSONAL_INSIGHT';

export interface GuidanceQuickMetric {
  key: GuidanceArea | 'MOOD' | 'ENERGY' | 'LOVE';
  label: string;
  icon: 'mood' | 'energy' | 'career' | 'money' | 'relationships' | 'health' | 'love' | 'decisions';
  status: GuidanceStatus;
  score: number;
  hint: string;
}

export interface GuidanceTimeWindow {
  label?: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  type: 'best' | 'neutral' | 'avoid';
  activity?: string;
}

export interface GuidanceHero {
  themeHeadline: string;
  paragraphs: string[];
  tone: 'empowering' | 'cautious' | 'balanced' | 'transformative';
  bestWindow?: GuidanceTimeWindow;
  avoidLine: string;
  primaryFocus: string;
  cosmicReason?: string;
}

export interface GuidanceRowExpanded {
  tone: string;
  guidanceLines: string[];
  bestWindow?: GuidanceTimeWindow;
  goodFor: string[];
  avoid: string[];
  focusAdvice: string;
  askAiTopic: 'career' | 'money' | 'relationships' | 'health' | 'decisions';
  subdomains?: { name: string; guidance: string }[];
  situations?: { situation: string; advice: string }[];
}

export interface GuidanceRowCompact {
  area: GuidanceArea;
  label: string;
  icon: string;
  status: GuidanceStatus;
  score: number;
  overview: string;
  context: string;
  oneLineFocus: string;
  expanded: GuidanceRowExpanded;
}

export interface DecisionCompass {
  overallScore: number;
  recommendation: 'Proceed' | 'Proceed Carefully' | 'Delay' | 'Avoid';
  reasoning: string;
  smallDecisions: { status: 'go' | 'caution' | 'avoid'; guidance: string };
  mediumDecisions: { status: 'go' | 'caution' | 'avoid'; guidance: string };
  bigDecisions: { status: 'go' | 'caution' | 'avoid'; guidance: string; waitDays?: number };
  emotionalDecisions: { status: 'go' | 'avoid'; guidance?: string };
  bestWindow?: GuidanceTimeWindow;
}

export interface EnergyFlowPeriod {
  period: 'morning' | 'afternoon' | 'evening';
  label: string;
  timeRange: string;
  energyLevel: number;
  energyLabel: string;
  bestFor: string[];
  avoid: string[];
  caution?: string;
}

export interface InteractionSubcategory {
  id: string;
  title: string;
  emoji: string;
  status: GuidanceStatus;
  score: number;
  overview: string;
  energyDescription: string;
  goodFor: string[];
  avoid: string[];
  bestTiming: GuidanceTimeWindow | null;
  powerMove: string;
  conversationStarters?: string[];
  questionsToAsk?: string[];
  strategyTips?: string[];
  scenarios?: { situation: string; advice: string }[];
  metrics?: { label: string; value: number }[];
}

export interface InteractionCategory {
  id: string; // romantic, workplace, etc.
  label: string;
  icon: string; // emoji or svg path
  subcategories: InteractionSubcategory[];
}

export interface CommunicationQuality {
  listeningQuality: number;
  speakingClarity: number;
  emotionalReactivity: number;
  overall: number;
  contextAdvice: {
    office: string;
    family: string;
    clients: string;
    manager: string;
  };
}

export interface WorkplaceClimate {
  officeVibe: number;
  authorityPressure: number;
  teamCooperation: number;
  visibilityLevel: number;
  strategy: string;
}

export interface MoneyMood {
  riskAppetite: number;
  spendingCaution: number;
  savingMindset: number;
  goodFor: string[];
  avoid: string[];
}

export interface EmotionalWeather {
  type: 'sunny' | 'cloudy' | 'calm' | 'stormy' | 'mixed';
  forecast: string;
  copingStrategies: string[];
  selfCare: string[];
}

export interface TarotCard {
  cardName: string;
  cardImage: string; // path to asset
  meaning: string;
  interpretation: string;
}

export interface NakshatraWisdom {
  name: string;
  deity: string;
  symbol: string;
  quality: string;
  insight: string;
  mantra: string;
  mantraAudio?: string;
}

export interface PanchangDetails {
  auspiciousTimes: { name: string; start: string; end: string; activities: string[] }[];
  inauspiciousTimes: { name: string; start: string; end: string; avoid: string[] }[];
  tithi: string;
  yoga: string;
  karana: string;
}

export interface ActivityRecommendation {
  name: string;
  rating: number; // 1-5
  bestTime: string;
  reason: string;
}

export interface DailyAffirmation {
  text: string;
  basedOn: string;
  audioUrl?: string;
}

export interface DashaInfo {
  mahaDasha: { planet: string; endDate: string };
  antarDasha: { planet: string; endDate: string };
  pratyantarDasha: { planet: string; endDate: string };
  percentComplete: number;
  theme: string;
  daysRemaining: number;
}

export interface TransitAlert {
  planet: string;
  event: string;
  date: string;
  impact: 'high' | 'medium' | 'low';
  description: string;
}

export interface DailyRemedy {
  type: 'mantra' | 'gemstone' | 'charity' | 'fasting' | 'ritual';
  description: string;
  instructions: string;
  bestTime: string;
  basedOn: string;
}

export interface GuidedMeditation {
  title: string;
  duration: number; // minutes
  audioUrl?: string;
  description: string;
}

export interface LuckyElements {
  color: string;
  colorHex: string;
  number: number;
  direction: string;
  gemstone: string;
  timeRange: string;
  dayQuality: number; // 0-5
}

export interface DailyChallenge {
  title: string;
  description: string;
  reason: string;
}

export interface TomorrowPreview {
  theme: string;
  teaser: string;
}

export interface GuidancePayload {
  dateKey: string;
  header: {
    dateLabel: string;
    weekdayLabel: string;
    greeting: string;
    vedicLine: string;
    moonPhase: { name: string; illumination?: number };
  };
  
  // Sections
  quickMetrics: GuidanceQuickMetric[];
  hero: GuidanceHero;
  lifeGuidance: GuidanceRowCompact[];
  interactionForecast: InteractionCategory[]; // NEW
  decisionCompass: DecisionCompass;
  energyFlow: EnergyFlowPeriod[]; // NEW (renamed from energyManagement)
  
  // Metrics & Weather
  communicationQuality: CommunicationQuality; // NEW
  workplaceClimate: WorkplaceClimate; // NEW
  moneyMood: MoneyMood; // NEW
  emotionalWeather: EmotionalWeather; // NEW
  
  // Single Items
  oneMistake: string; // NEW
  onePowerAction: string; // NEW
  
  // Tools
  tarot?: TarotCard; // NEW
  nakshatra: NakshatraWisdom; // NEW
  panchang: PanchangDetails; // NEW
  activities?: ActivityRecommendation[]; // NEW
  affirmation?: DailyAffirmation; // NEW
  dasha: DashaInfo; // NEW
  transits: TransitAlert[]; // NEW
  remedy: DailyRemedy; // NEW
  meditation?: GuidedMeditation; // NEW
  luckyElements?: LuckyElements; // NEW
  challenge?: DailyChallenge; // NEW
  tomorrowPreview?: TomorrowPreview; // NEW (renamed from tomorrowHint)

  // Meta
  userStats: {
    streakDays: number;
    moodHistory: { date: string; mood: number }[];
    challengesCompleted: number;
  };
  sourceMeta: {
    generatedAtIso: string;
    profileName: string;
  };
}
