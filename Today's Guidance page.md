# 🎯 COMPLETE TRAE AI PROMPT: TODAY'S GUIDANCE PAGE

**Copy this entire prompt into Trae AI (Gemini-3-Pro-Preview or Claude-Sonnet-4):**

---

```
You are building the MOST IMPORTANT page of a Vedic Astrology PWA: the "TODAY'S GUIDANCE" page. This page must make users open the app EVERY MORNING. It's their daily life operating system.

## 🎯 CORE MISSION

When a user opens this page at 7 AM, within 10 seconds they must know:
1. How today FEELS (calm/intense/mixed)
2. What ONE thing matters most today
3. WHEN to do important things
4. What NOT to do or when to be careful
5. One powerful action to take today

## 📱 TECHNICAL SPECIFICATIONS

**Platform:** React PWA (Progressive Web App)
**Framework:** React 18+ with TypeScript
**Styling:** Tailwind CSS v3
**State Management:** Zustand or Redux Toolkit
**API:** REST endpoints (already built)
**Build Tool:** Vite
**Mobile-First:** 100% responsive
**Offline Support:** Service Worker with cache
**Performance Target:** < 2s initial load on 3G

## 🎨 DESIGN SYSTEM

### Color Palette
```css
/* Base - Dark Cosmic Theme */
--bg-primary: #0A0E27;
--bg-secondary: #141829;
--bg-tertiary: #1E2139;
--bg-elevated: #252840;

/* Daily Gradients (Change based on ruling planet) */
--gradient-sunday: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
--gradient-monday: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
--gradient-tuesday: linear-gradient(135deg, #F43B47 0%, #453A94 100%);
--gradient-wednesday: linear-gradient(135deg, #11998E 0%, #38EF7D 100%);
--gradient-thursday: linear-gradient(135deg, #FFD89B 0%, #19547B 100%);
--gradient-friday: linear-gradient(135deg, #F857A6 0%, #FF5858 100%);
--gradient-saturday: linear-gradient(135deg, #434343 0%, #000000 100%);

/* Status Colors */
--status-excellent: #10B981;
--status-favorable: #34D399;
--status-neutral: #F59E0B;
--status-sensitive: #8B5CF6;
--status-caution: #EF4444;

/* Text */
--text-primary: #F9FAFB;
--text-secondary: #D1D5DB;
--text-muted: #9CA3AF;

/* Accents */
--accent-primary: #8B5CF6;
--accent-secondary: #EC4899;
--accent-tertiary: #14B8A6;

/* Glass Effects */
--glass-bg: rgba(30, 33, 57, 0.6);
--glass-border: rgba(255, 255, 255, 0.1);
```

### Typography
```css
/* Fonts */
font-family: 'Inter', -apple-system, system-ui, sans-serif;

/* Scale */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */

/* Weights */
--weight-regular: 400;
--weight-medium: 500;
--weight-semibold: 600;
--weight-bold: 700;
```

### Spacing
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
```

### Animations
```css
/* Smooth entrance */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Pulse for streak */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Shimmer for loading */
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
```

---

## 📋 COMPLETE PAGE STRUCTURE

Build this EXACT structure with ALL sections:

```
┌─────────────────────────────────────────────┐
│  A. STICKY HEADER                           │
│  - Date & Vedic Calendar                    │
│  - Streak Counter 🔥                        │
│  - Personalized Greeting                    │
│  - Pull-to-Refresh                          │
├─────────────────────────────────────────────┤
│  B. QUICK GLANCE METRICS                    │
│  - Horizontal Scrollable Row                │
│  - 6 Cards: Mood, Energy, Career, Money,    │
│    Love, Health                             │
│  - Tap to scroll to detailed section        │
├─────────────────────────────────────────────┤
│  C. TIMELINE TABS                           │
│  - [● Today] [○ Tomorrow] [○ This Week]     │
├─────────────────────────────────────────────┤
│  D. MAIN GUIDANCE CARD (HERO)               │
│  - Animated constellation background        │
│  - Daily gradient based on ruling planet    │
│  - Theme headline                           │
│  - 2-3 paragraph narrative                  │
│  - Best Time, Avoid, Focus                  │
│  - Save, Share, Ask AI buttons              │
├─────────────────────────────────────────────┤
│  E. TODAY'S LIFE GUIDANCE                   │
│  - 6 Expandable Domain Cards:               │
│    1. Career & Work                         │
│    2. Wealth & Money                        │
│    3. Relationships                         │
│    4. Health & Energy                       │
│    5. Communication                         │
│    6. Decisions & Choices                   │
│  Each expanded shows:                       │
│  - Status & Score                           │
│  - Context explanation                      │
│  - Good For (4-6 bullets)                   │
│  - Avoid (2-4 bullets)                      │
│  - Best Timing                              │
│  - One Power Action                         │
│  - Subdomains (tabs)                        │
│  - Situations (accordion)                   │
│  - Ask AI CTA                               │
├─────────────────────────────────────────────┤
│  F. TODAY'S INTERACTION FORECAST            │
│  - Tab Navigation:                          │
│    [Romantic] [Work] [Family]               │
│    [Professional] [Financial] [Health]      │
│  - Per Tab, Multiple Subcategories:         │
│                                             │
│  ROMANTIC TAB:                              │
│  • Partner/Spouse                           │
│  • Dating/New Romance                       │
│                                             │
│  WORK TAB:                                  │
│  • With Manager/Boss                        │
│  • With Colleagues/Team                     │
│  • Job Interview Today                      │
│  • Client Meetings                          │
│                                             │
│  FAMILY TAB:                                │
│  • With Parents                             │
│  • With Siblings                            │
│  • With Children                            │
│                                             │
│  PROFESSIONAL TAB:                          │
│  • Mentors & Advisors                       │
│  • New Connections                          │
│                                             │
│  FINANCIAL TAB:                             │
│  • Business Partners                        │
│  • Investors & Stakeholders                 │
│  • Financial Advisors                       │
│                                             │
│  HEALTH TAB:                                │
│  • Doctors & Medical                        │
│  • Therapists & Counselors                  │
│  • Wellness Practitioners                   │
│                                             │
│  Each subcategory expanded shows:           │
│  - Status & Score                           │
│  - Overview & Energy Description            │
│  - Good For (4-6 items)                     │
│  - Avoid (2-4 items)                        │
│  - Best Timing                              │
│  - Power Move                               │
│  - Conversation Starters                    │
│  - Questions to Ask                         │
│  - Strategy Tips                            │
│  - Specific Scenarios                       │
│  - Connection Metrics (if romantic)         │
│  - Ask AI CTA                               │
├─────────────────────────────────────────────┤
│  G. DECISION COMPASS                        │
│  - Visual compass graphic (SVG)             │
│  - Overall score /10                        │
│  - Recommendation: Proceed/Careful/Delay    │
│  - Small Decisions guidance                 │
│  - Medium Decisions guidance                │
│  - Big Decisions guidance                   │
│  - Best Decision Window timing              │
├─────────────────────────────────────────────┤
│  H. ENERGY MANAGEMENT PLAN                  │
│  - Visual energy timeline                   │
│  - 3 Periods: Morning, Afternoon, Evening   │
│  Each shows:                                │
│  - Energy % and level                       │
│  - Best activities for this period          │
│  - What to avoid                            │
│  - Cautions (if any)                        │
│  - Optimization tips                        │
├─────────────────────────────────────────────┤
│  I. COMMUNICATION QUALITY INDEX             │
│  - 4 Metrics with gauges:                   │
│    • Listening Quality                      │
│    • Speaking Clarity                       │
│    • Emotional Reactivity                   │
│    • Overall Communication                  │
│  - Context-specific advice for:             │
│    • Office meetings                        │
│    • Family conversations                   │
│    • Client calls                           │
│    • Manager discussions                    │
├─────────────────────────────────────────────┤
│  J. WORKPLACE CLIMATE                       │
│  - 4 Gauges:                                │
│    • Office Vibe                            │
│    • Authority Pressure                     │
│    • Team Cooperation                       │
│    • Visibility Level                       │
│  - Behavioral strategy for today            │
│  - What to do, what to avoid                │
├─────────────────────────────────────────────┤
│  K. MONEY MOOD TODAY                        │
│  - 3 Indicators:                            │
│    • Risk Appetite                          │
│    • Spending Caution                       │
│    • Saving Mindset                         │
│  - Good For / Avoid                         │
│  - NO promises of gains                     │
├─────────────────────────────────────────────┤
│  L. EMOTIONAL WEATHER REPORT                │
│  - Weather visual (sunny/cloudy/stormy)     │
│  - Emotional forecast                       │
│  - Coping strategies                        │
│  - Self-care suggestions                    │
├─────────────────────────────────────────────┤
│  M. ONE MISTAKE TO AVOID                    │
│  - Single impactful warning                 │
│  - Short, memorable, practical              │
│  - Based on day's vulnerabilities           │
├─────────────────────────────────────────────┤
│  N. ONE POWER ACTION                        │
│  - Single most impactful action             │
│  - Aligned with day's strengths             │
│  - Clear, achievable                        │
│  - Mark as Done checkbox                    │
├─────────────────────────────────────────────┤
│  O. DAILY TAROT CARD                        │
│  - Animated card flip on load               │
│  - Beautiful card illustration              │
│  - Card name and meaning                    │
│  - Personalized interpretation              │
│  - Premium: Pull more cards button          │
├─────────────────────────────────────────────┤
│  P. NAKSHATRA WISDOM                        │
│  - Current Moon nakshatra                   │
│  - Deity, Symbol, Quality                   │
│  - Today's insight                          │
│  - Mantra with audio playback               │
│  - Learn More button                        │
├─────────────────────────────────────────────┤
│  Q. PANCHANG DETAILS                        │
│  - Tithi, Yoga, Karana                      │
│  - Auspicious times (Abhijit, Brahma)       │
│  - Inauspicious times (Rahu Kaal, Gulika)   │
│  - Color-coded time bars                    │
│  - Set reminder buttons                     │
├─────────────────────────────────────────────┤
│  R. ACTIVITY RECOMMENDATIONS                │
│  - 8-10 activities with star ratings:       │
│    • Career Moves                           │
│    • Romance                                │
│    • Financial Decisions                    │
│    • Medical Treatment                      │
│    • Travel                                 │
│    • Contracts & Agreements                 │
│    • Learning & Education                   │
│    • Social Events                          │
│  - Tap for best timing                      │
├─────────────────────────────────────────────┤
│  S. DAILY AFFIRMATION                       │
│  - Personalized affirmation                 │
│  - Based on chart context                   │
│  - Beautiful typography & background        │
│  - Audio playback option                    │
│  - Save, Share, Next buttons                │
├─────────────────────────────────────────────┤
│  T. CURRENT DASHA PERIOD                    │
│  - Maha Dasha                               │
│  - Antar Dasha                              │
│  - Pratyantar Dasha                         │
│  - % Complete progress bar                  │
│  - Current theme                            │
│  - Days remaining                           │
│  - View Full Timeline link                  │
├─────────────────────────────────────────────┤
│  U. TRANSIT ALERTS                          │
│  - Upcoming transits (next 7 days)          │
│  - Currently active transits                │
│  - Impact level indicators                  │
│  - Set reminders                            │
│  - View All Transits link                   │
├─────────────────────────────────────────────┤
│  V. MOOD TRACKER                            │
│  - 5 emoji mood selector                    │
│  - Weekly mood history                      │
│  - Astrological correlations                │
│  - Pattern insights                         │
├─────────────────────────────────────────────┤
│  W. DAILY REMEDY                            │
│  - Today's remedy based on chart            │
│  - Type: Mantra/Gemstone/Charity/Ritual     │
│  - Instructions                             │
│  - Best timing                              │
│  - Mark Done checkbox                       │
│  - Remedies streak counter                  │
├─────────────────────────────────────────────┤
│  X. GUIDED MEDITATION                       │
│  - Meditation based on dominant planet      │
│  - Duration: 3-5 minutes                    │
│  - Play button                              │
│  - Beautiful space visual                   │
│  - Audio with background music              │
├─────────────────────────────────────────────┤
│  Y. LUCKY ELEMENTS                          │
│  - Lucky Color (with swatch)                │
│  - Lucky Number                             │
│  - Lucky Direction                          │
│  - Lucky Gemstone                           │
│  - Lucky Time Range                         │
│  - Day Quality (star rating)                │
│  - Set as Wallpaper button                  │
│  - Share button                             │
├─────────────────────────────────────────────┤
│  Z. DAILY CHALLENGE                         │
│  - Today's cosmic challenge                 │
│  - Why this challenge (astrological reason) │
│  - Mark Done button                         │
│  - Challenge streak counter                 │
│  - Share completion                         │
├─────────────────────────────────────────────┤
│  AA. DASHAS & TRANSITS (COLLAPSIBLE)        │
│  - "Why Today Is Like This"                 │
│  - Current dasha details                    │
│  - Key transits explanation                 │
│  - Nakshatra technical details              │
│  - Hidden by default (for astrology nerds)  │
├─────────────────────────────────────────────┤
│  AB. TOMORROW SNEAK PEEK                    │
│  - Tomorrow's theme (1-2 lines)             │
│  - Teaser content                           │
│  - "Unlock Full Preview" CTA (premium)      │
│  - Encourages return tomorrow               │
├─────────────────────────────────────────────┤
│  AC. PREMIUM UPSELL (SUBTLE)                │
│  - Non-blocking placement                   │
│  - Preview of premium features              │
│  - 7-day free trial CTA                     │
│  - Benefits list                            │
│  - No fear-based language                   │
└─────────────────────────────────────────────┘
```

---

## 📊 DATA STRUCTURES

### Main API Response Type
```typescript
interface TodaysGuidanceData {
  meta: {
    date: string;
    userId: string;
    generatedAt: string;
    vedicDate: {
      tithi: string;
      tithiEndTime: string;
      nakshatra: string;
      nakshatraEndTime: string;
      yoga: string;
      karana: string;
      paksha: 'Shukla' | 'Krishna';
      moonPhase: number; // 0-100
      sunrise: string;
      sunset: string;
    };
  };
  
  userStats: {
    streakDays: number;
    totalVisits: number;
    remediesCompleted: number;
    challengesCompleted: number;
    moodHistory: { date: string; mood: number }[];
  };
  
  mainGuidance: {
    theme: string; // Headline
    narrative: string; // 300-500 words
    tone: 'empowering' | 'cautious' | 'balanced' | 'transformative';
    bestTime: { start: string; end: string; activity: string }[];
    avoid: string[];
    focus: string[];
    cosmicReason: string; // Hidden by default
  };
  
  quickMetrics: {
    mood: number;
    energy: number;
    career: number;
    money: number;
    love: number;
    health: number;
  };
  
  lifeDomains: {
    domain: 'career' | 'money' | 'relationships' | 'health' | 'communication' | 'decisions';
    icon: string;
    label: string;
    status: 'excellent' | 'favorable' | 'neutral' | 'sensitive' | 'caution';
    score: number;
    overview: string;
    context: string;
    goodFor: string[];
    avoid: string[];
    bestTiming: { start: string; end: string } | null;
    oneAction: string;
    subdomains?: { name: string; guidance: string }[];
    situations?: { situation: string; advice: string }[];
  }[];
  
  interactionForecast: {
    category: 'romantic' | 'workplace' | 'family' | 'professional' | 'financial' | 'health';
    subcategories: {
      id: string;
      title: string;
      emoji: string;
      status: 'excellent' | 'favorable' | 'neutral' | 'sensitive' | 'caution';
      score: number;
      overview: string;
      energyDescription: string;
      goodFor: string[];
      avoid: string[];
      bestTiming: { start: string; end: string; activity: string } | null;
      powerMove: string;
      conversationStarters?: string[];
      questionsToAsk?: string[];
      strategyTips?: string[];
      scenarios?: { situation: string; advice: string }[];
      metrics?: { label: string; value: number }[];
    }[];
  }[];
  
  decisionCompass: {
    overallScore: number; // 0-10
    recommendation: 'proceed' | 'careful' | 'delay';
    reasoning: string;
    smallDecisions: { status: 'go' | 'caution' | 'avoid'; guidance: string };
    mediumDecisions: { status: 'go' | 'caution' | 'avoid'; guidance: string };
    bigDecisions: { status: 'go' | 'caution' | 'avoid'; guidance: string; waitDays?: number };
    bestWindow: { start: string; end: string } | null;
  };
  
  energyFlow: {
    period: 'morning' | 'afternoon' | 'evening';
    label: string;
    timeRange: string;
    energyLevel: number;
    energyLabel: string;
    bestFor: string[];
    avoid: string[];
    caution?: string;
  }[];
  
  communicationQuality: {
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
  };
  
  workplaceClimate: {
    officeVibe: number;
    authorityPressure: number;
    teamCooperation: number;
    visibilityLevel: number;
    strategy: string;
  };
  
  moneyMood: {
    riskAppetite: number;
    spendingCaution: number;
    savingMindset: number;
    goodFor: string[];
    avoid: string[];
  };
  
  emotionalWeather: {
    type: 'sunny' | 'cloudy' | 'calm' | 'stormy' | 'mixed';
    forecast: string;
    copingStrategies: string[];
    selfCare: string[];
  };
  
  oneMistake: string;
  onePowerAction: string;
  
  tarot: {
    cardName: string;
    cardImage: string;
    meaning: string;
    interpretation: string;
  };
  
  nakshatra: {
    name: string;
    deity: string;
    symbol: string;
    quality: string;
    insight: string;
    mantra: string;
    mantraAudio: string;
  };
  
  panchang: {
    auspiciousTimes: { name: string; start: string; end: string; activities: string[] }[];
    inauspiciousTimes: { name: string; start: string; end: string; avoid: string[] }[];
  };
  
  activities: {
    name: string;
    rating: number; // 1-5 stars
    bestTime: string;
    reason: string;
  }[];
  
  affirmation: {
    text: string;
    basedOn: string;
    audioUrl?: string;
  };
  
  dasha: {
    mahaDasha: { planet: string; endDate: string };
    antarDasha: { planet: string; endDate: string };
    pratyantarDasha: { planet: string; endDate: string };
    percentComplete: number;
    theme: string;
    daysRemaining: number;
  };
  
  transits: {
    planet: string;
    event: string;
    date: string;
    impact: 'high' | 'medium' | 'low';
    description: string;
  }[];
  
  remedy: {
    type: 'mantra' | 'gemstone' | 'charity' | 'fasting' | 'ritual';
    description: string;
    instructions: string;
    bestTime: string;
    basedOn: string;
  };
  
  meditation: {
    title: string;
    duration: number;
    audioUrl: string;
    description: string;
  };
  
  luckyElements: {
    color: string;
    colorHex: string;
    number: number;
    direction: string;
    gemstone: string;
    timeRange: string;
    dayQuality: number; // 0-5
  };
  
  challenge: {
    title: string;
    description: string;
    reason: string;
  };
  
  tomorrowPreview: {
    theme: string;
    teaser: string;
  };
}
```

---

## 💻 IMPLEMENTATION REQUIREMENTS

### 1. Component Architecture

Create these files:

```
src/pages/
└── TodaysGuidance/
    ├── TodaysGuidancePage.tsx          # Main page
    ├── components/
    │   ├── StickyHeader.tsx
    │   ├── QuickMetricsRow.tsx
    │   ├── TimelineTabs.tsx
    │   ├── MainGuidanceCard.tsx
    │   ├── LifeGuidanceSection.tsx
    │   │   └── LifeDomainCard.tsx
    │   ├── InteractionForecastSection.tsx
    │   │   └── InteractionCard.tsx
    │   ├── DecisionCompass.tsx
    │   ├── EnergyManagementPlan.tsx
    │   ├── CommunicationQuality.tsx
    │   ├── WorkplaceClimate.tsx
    │   ├── MoneyMood.tsx
    │   ├── EmotionalWeather.tsx
    │   ├── OneMistake.tsx
    │   ├── OnePowerAction.tsx
    │   ├── DailyTarotCard.tsx
    │   ├── NakshatraWisdom.tsx
    │   ├── PanchangDetails.tsx
    │   ├── ActivityRecommendations.tsx
    │   ├── DailyAffirmation.tsx
    │   ├── CurrentDasha.tsx
    │   ├── TransitAlerts.tsx
    │   ├── MoodTracker.tsx
    │   ├── DailyRemedy.tsx
    │   ├── GuidedMeditation.tsx
    │   ├── LuckyElements.tsx
    │   ├── DailyChallenge.tsx
    │   ├── WhyTodayIsLikeThis.tsx
    │   ├── TomorrowSneakPeek.tsx
    │   └── PremiumUpsell.tsx
    ├── hooks/
    │   ├── useTodaysGuidance.ts
    │   ├── useStreakCounter.ts
    │   ├── useMoodTracking.ts
    │   └── useDailyTheme.ts
    ├── utils/
    │   ├── themeSelector.ts
    │   └── animationHelpers.ts
    └── styles/
        └── guidance.module.css
```

### 2. Main Page Component

```typescript
// src/pages/TodaysGuidance/TodaysGuidancePage.tsx

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTodaysGuidance } from './hooks/useTodaysGuidance';
import { useStreakCounter } from './hooks/useStreakCounter';
import { useDailyTheme } from './hooks/useDailyTheme';

// Import all components
import StickyHeader from './components/StickyHeader';
import QuickMetricsRow from './components/QuickMetricsRow';
import TimelineTabs from './components/TimelineTabs';
import MainGuidanceCard from './components/MainGuidanceCard';
import LifeGuidanceSection from './components/LifeGuidanceSection';
import InteractionForecastSection from './components/InteractionForecastSection';
import DecisionCompass from './components/DecisionCompass';
import EnergyManagementPlan from './components/EnergyManagementPlan';
import CommunicationQuality from './components/CommunicationQuality';
import WorkplaceClimate from './components/WorkplaceClimate';
import MoneyMood from './components/MoneyMood';
import EmotionalWeather from './components/EmotionalWeather';
import OneMistake from './components/OneMistake';
import OnePowerAction from './components/OnePowerAction';
import DailyTarotCard from './components/DailyTarotCard';
import NakshatraWisdom from './components/NakshatraWisdom';
import PanchangDetails from './components/PanchangDetails';
import ActivityRecommendations from './components/ActivityRecommendations';
import DailyAffirmation from './components/DailyAffirmation';
import CurrentDasha from './components/CurrentDasha';
import TransitAlerts from './components/TransitAlerts';
import MoodTracker from './components/MoodTracker';
import DailyRemedy from './components/DailyRemedy';
import GuidedMeditation from './components/GuidedMeditation';
import LuckyElements from './components/LuckyElements';
import DailyChallenge from './components/DailyChallenge';
import WhyTodayIsLikeThis from './components/WhyTodayIsLikeThis';
import TomorrowSneakPeek from './components/TomorrowSneakPeek';
import PremiumUpsell from './components/PremiumUpsell';

const TodaysGuidancePage: React.FC = () => {
  const { data, loading, error, refetch } = useTodaysGuidance();
  const { streak, updateStreak } = useStreakCounter();
  const theme = useDailyTheme();
  
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeline, setSelectedTimeline] = useState<'today' | 'tomorrow' | 'week'>('today');
  
  useEffect(() => {
    updateStreak();
  }, []);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  
  if (loading && !data) {
    return <LoadingSkeleton />;
  }
  
  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }
  
  if (!data) return null;
  
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Sticky Header */}
      <StickyHeader
        date={data.meta.date}
        vedicDate={data.meta.vedicDate}
        streak={streak}
        userName="User"
        onRefresh={handleRefresh}
        refreshing={refreshing}
        theme={theme}
      />
      
      <main className="pb-20">
        {/* Quick Metrics */}
        <QuickMetricsRow metrics={data.quickMetrics} theme={theme} />
        
        {/* Timeline Tabs */}
        <div className="px-4 pt-6">
          <TimelineTabs
            selected={selectedTimeline}
            onSelect={setSelectedTimeline}
            theme={theme}
          />
        </div>
        
        {/* Main Guidance Card */}
        <MainGuidanceCard guidance={data.mainGuidance} theme={theme} />
        
        {/* Today's Life Guidance */}
        <LifeGuidanceSection domains={data.lifeDomains} theme={theme} />
        
        {/* Today's Interaction Forecast */}
        <InteractionForecastSection
          interactions={data.interactionForecast}
          theme={theme}
        />
        
        {/* Decision Compass */}
        <DecisionCompass compass={data.decisionCompass} theme={theme} />
        
        {/* Energy Management Plan */}
        <EnergyManagementPlan energyFlow={data.energyFlow} theme={theme} />
        
        {/* Communication Quality */}
        <CommunicationQuality
          communication={data.communicationQuality}
          theme={theme}
        />
        
        {/* Workplace Climate */}
        <WorkplaceClimate workplace={data.workplaceClimate} theme={theme} />
        
        {/* Money Mood */}
        <MoneyMood money={data.moneyMood} theme={theme} />
        
        {/* Emotional Weather */}
        <EmotionalWeather weather={data.emotionalWeather} theme={theme} />
        
        {/* One Mistake to Avoid */}
        <OneMistake mistake={data.oneMistake} theme={theme} />
        
        {/* One Power Action */}
        <OnePowerAction action={data.onePowerAction} theme={theme} />
        
        {/* Daily Tarot Card */}
        <DailyTarotCard tarot={data.tarot} theme={theme} />
        
        {/* Nakshatra Wisdom */}
        <NakshatraWisdom nakshatra={data.nakshatra} theme={theme} />
        
        {/* Panchang Details */}
        <PanchangDetails panchang={data.panchang} theme={theme} />
        
        {/* Activity Recommendations */}
        <ActivityRecommendations
          activities={data.activities}
          theme={theme}
        />
        
        {/* Daily Affirmation */}
        <DailyAffirmation affirmation={data.affirmation} theme={theme} />
        
        {/* Current Dasha */}
        <CurrentDasha dasha={data.dasha} theme={theme} />
        
        {/* Transit Alerts */}
        <TransitAlerts transits={data.transits} theme={theme} />
        
        {/* Mood Tracker */}
        <MoodTracker
          moodHistory={data.userStats.moodHistory}
          theme={theme}
        />
        
        {/* Daily Remedy */}
        <DailyRemedy remedy={data.remedy} theme={theme} />
        
        {/* Guided Meditation */}
        <GuidedMeditation meditation={data.meditation} theme={theme} />
        
        {/* Lucky Elements */}
        <LuckyElements lucky={data.luckyElements} theme={theme} />
        
        {/* Daily Challenge */}
        <DailyChallenge
          challenge={data.challenge}
          streak={data.userStats.challengesCompleted}
          theme={theme}
        />
        
        {/* Why Today Is Like This (Collapsible) */}
        <WhyTodayIsLikeThis
          dasha={data.dasha}
          transits={data.transits}
          nakshatra={data.nakshatra}
          theme={theme}
        />
        
        {/* Tomorrow Sneak Peek */}
        <TomorrowSneakPeek preview={data.tomorrowPreview} theme={theme} />
        
        {/* Premium Upsell */}
        <PremiumUpsell theme={theme} />
      </main>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-bg-primary p-4 space-y-4 animate-pulse">
    <div className="h-32 bg-bg-secondary rounded-2xl" />
    <div className="grid grid-cols-3 gap-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-24 bg-bg-secondary rounded-xl" />
      ))}
    </div>
    <div className="h-64 bg-bg-secondary rounded-2xl" />
    <div className="h-48 bg-bg-secondary rounded-2xl" />
  </div>
);

const ErrorState = ({ error, onRetry }: { error: Error; onRetry: () => void }) => (
  <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
    <div className="text-center">
      <div className="text-6xl mb-4">🌙</div>
      <h2 className="text-xl font-semibold mb-2">Unable to load guidance</h2>
      <p className="text-text-secondary mb-6">{error.message}</p>
      <button
        onClick={onRetry}
        className="bg-accent-primary hover:bg-accent-primary/80 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

export default TodaysGuidancePage;
```

### 3. API Hook

```typescript
// src/pages/TodaysGuidance/hooks/useTodaysGuidance.ts

import { useState, useEffect } from 'react';
import { TodaysGuidanceData } from '../types';

export const useTodaysGuidance = () => {
  const [data, setData] = useState<TodaysGuidanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/guidance/today', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch guidance');
      }
      
      const guidanceData = await response.json();
      setData(guidanceData);
      
      // Cache for offline use
      localStorage.setItem('cached_guidance', JSON.stringify({
        data: guidanceData,
        timestamp: Date.now()
      }));
      
    } catch (err) {
      setError(err as Error);
      
      // Try to load from cache
      const cached = localStorage.getItem('cached_guidance');
      if (cached) {
        const { data: cachedData } = JSON.parse(cached);
        setData(cachedData);
      }
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};
```

### 4. Streak Counter Hook

```typescript
// src/pages/TodaysGuidance/hooks/useStreakCounter.ts

import { useState, useEffect } from 'react';

export const useStreakCounter = () => {
  const [streak, setStreak] = useState(0);
  
  const updateStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem('guidance_streak');
    
    if (!stored) {
      localStorage.setItem('guidance_streak', JSON.stringify({
        lastVisit: today,
        streak: 1
      }));
      setStreak(1);
      return;
    }
    
    const { lastVisit, streak: currentStreak } = JSON.parse(stored);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (lastVisit === today) {
      setStreak(currentStreak);
    } else if (lastVisit === yesterdayStr) {
      const newStreak = currentStreak + 1;
      localStorage.setItem('guidance_streak', JSON.stringify({
        lastVisit: today,
        streak: newStreak
      }));
      setStreak(newStreak);
    } else {
      localStorage.setItem('guidance_streak', JSON.stringify({
        lastVisit: today,
        streak: 1
      }));
      setStreak(1);
    }
  };
  
  useEffect(() => {
    updateStreak();
  }, []);
  
  return { streak, updateStreak };
};
```

---

## 🎯 CRITICAL REQUIREMENTS

### Performance
- Initial load < 2 seconds on 3G
- Lazy load images
- Code split by route
- Service Worker for offline
- IndexedDB for caching

### Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus indicators

### Animations
- Smooth 60fps animations
- Respect prefers-reduced-motion
- Stagger animations for lists
- Pull-to-refresh animation
- Skeleton screens

### Mobile Optimization
- Touch-friendly tap targets (min 44x44px)
- Horizontal scroll with snap points
- Bottom sheet for modals
- Haptic feedback on interactions
- Native-like transitions

### Analytics
Track these events:
- page_view
- section_expanded
- cta_clicked
- mood_tracked
- challenge_completed
- remedy_marked_done
- share_initiated
- premium_clicked

---

## ✅ DELIVERABLES

Build and provide:

1. ✅ Complete TodaysGuidancePage.tsx with ALL sections
2. ✅ All 35+ individual components (fully functional)
3. ✅ All hooks (useTodaysGuidance, useStreakCounter, etc.)
4. ✅ TypeScript types for all data structures
5. ✅ Tailwind CSS styling (mobile-first)
6. ✅ Animations using Framer Motion
7. ✅ Service Worker for offline support
8. ✅ Loading and error states
9. ✅ Pull-to-refresh functionality
10. ✅ Analytics integration
11. ✅ README with setup instructions
12. ✅ Component documentation

---

## 🚀 START BUILDING NOW

Create the COMPLETE Today's Guidance page with:
- ALL sections implemented
- EVERY component fully functional
- Beautiful, polished UI
- Smooth animations
- Perfect mobile UX
- Production-ready code

DO NOT SKIP ANY SECTION. Build EVERYTHING listed above.

Make this the BEST daily guidance page users have ever experienced!
```

---
# 🎯 COMPREHENSIVE "RELATIONSHIP & INTERACTIONS" SECTION

Perfect idea! This addresses a **massive user need** - people want specific guidance for their daily interactions across ALL relationship types, not just romantic. Let me design a complete, practical section.

---

## 📋 CONCEPT: "TODAY'S INTERACTIONS GUIDE"

Instead of just "Love & Relationships", create a **comprehensive interaction forecast** covering:

1. **Romantic Partnership** (lovers, spouse)
2. **Workplace Relationships** (boss, colleagues, interviews)
3. **Family Dynamics** (parents, siblings, children)
4. **Professional Networking** (clients, partners, mentors)
5. **Financial Partnerships** (business partners, investors)
6. **Health & Wellness Interactions** (doctors, therapists, healers)

---

## 🎨 COMPLETE SECTION DESIGN

### MAIN SECTION: "TODAY'S INTERACTION FORECAST"

```
╔════════════════════════════════════════════════════╗
║                                                    ║
║       👥 TODAY'S INTERACTION FORECAST              ║
║       ────────────────────────────────             ║
║       How to navigate every relationship today     ║
║                                                    ║
╠════════════════════════════════════════════════════╣
║                                                    ║
║  [Tab: Romantic] [Tab: Work] [Tab: Family]        ║
║  [Tab: Professional] [Tab: Financial] [Tab: All]  ║
║                                                    ║
╚════════════════════════════════════════════════════╝
```

---

## 📱 DETAILED IMPLEMENTATION

### 1. ROMANTIC PARTNERSHIP TAB

```
┌──────────────────────────────────────────────┐
│  💑 ROMANTIC PARTNERSHIP                     │
│  ────────────────────────────────────        │
│  Today's Connection Quality: ⭐⭐⭐⭐☆ 8/10   │
│                                              │
│  OVERALL VIBE:                               │
│  Your partner may be more sensitive today.   │
│  Focus on listening rather than solving.     │
│  Physical affection speaks louder than       │
│  words right now.                            │
│                                              │
│  ✅ BEST FOR TODAY:                          │
│  • Quality time together (no screens)        │
│  • Cooking a meal together                   │
│  • Light, playful conversation               │
│  • Planning something fun for weekend        │
│  • Showing appreciation through small acts   │
│                                              │
│  ⚠️ AVOID TODAY:                             │
│  • Bringing up serious relationship talks    │
│  • Criticizing or correcting them            │
│  • Making big commitments or decisions       │
│  • Comparing them to others                  │
│                                              │
│  ⏰ BEST TIMING FOR CONVERSATIONS:           │
│  Evening 7:00 PM - 9:00 PM                   │
│  (Moon in favorable position)                │
│                                              │
│  🎯 ONE POWERFUL ACTION:                     │
│  Ask them: "What made you smile today?"      │
│  and genuinely listen to their answer.       │
│                                              │
│  💬 CONVERSATION STARTERS:                   │
│  • "I was thinking about..."                 │
│  • "Remember when we..."                     │
│  • "What would make you happy this week?"    │
│                                              │
│  ⚡ IF CONFLICT ARISES:                      │
│  → Take a 15-minute pause before responding  │
│  → Use "I feel..." instead of "You always..."│
│  → Wait until tomorrow for difficult topics  │
│                                              │
│  📊 COMPATIBILITY METER TODAY:               │
│  Emotional: ████████░░ 80%                   │
│  Physical:  ██████░░░░ 60%                   │
│  Mental:    ███████░░░ 70%                   │
│                                              │
│  [🤖 Ask AI: "How to handle..."]             │
│  [📅 Set Reminder for Best Time]             │
└──────────────────────────────────────────────┘
```

---

### 2. WORKPLACE RELATIONSHIPS TAB

```
┌──────────────────────────────────────────────┐
│  💼 WORKPLACE RELATIONSHIPS                  │
│  ────────────────────────────────────        │
│  Professional Climate: Strong 🟢             │
│                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                              │
│  👔 WITH YOUR MANAGER/BOSS:                  │
│  ────────────────────────────────────        │
│  Status: Favorable ⭐⭐⭐⭐☆                  │
│                                              │
│  Today's Energy:                             │
│  Your boss is receptive to new ideas.        │
│  Authority figures notice your work.         │
│  This is your window to shine.               │
│                                              │
│  ✅ Good For:                                │
│  • Presenting project updates                │
│  • Asking for resources/support              │
│  • Sharing achievements (subtly)             │
│  • Proposing solutions to problems           │
│                                              │
│  ⚠️ Avoid:                                   │
│  • Complaining about workload                │
│  • Bringing up salary (wait 3 days)          │
│  • Office politics or gossip                 │
│                                              │
│  ⏰ Best Time: 2:00 PM - 4:00 PM             │
│                                              │
│  💡 Power Move:                              │
│  "I completed X and wanted to share          │
│   how it impacted Y metric."                 │
│                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                              │
│  👥 WITH COLLEAGUES/TEAM:                    │
│  ────────────────────────────────────        │
│  Status: Collaborative ⭐⭐⭐⭐⭐             │
│                                              │
│  Today's Energy:                             │
│  Team chemistry is excellent today.          │
│  People are open to collaboration.           │
│  Your ideas will be well-received.           │
│                                              │
│  ✅ Good For:                                │
│  • Leading team meetings                     │
│  • Brainstorming sessions                    │
│  • Offering help to struggling teammates     │
│  • Building rapport over lunch/coffee        │
│                                              │
│  ⚠️ Avoid:                                   │
│  • Taking sole credit for team wins          │
│  • Being overly competitive                  │
│  • Dismissing others' ideas quickly          │
│                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                              │
│  🎤 JOB INTERVIEW TODAY?                     │
│  ────────────────────────────────────        │
│  Timing: Excellent ✨                        │
│  Confidence: High                            │
│                                              │
│  Best Interview Window:                      │
│  10:00 AM - 12:00 PM (Peak clarity)          │
│                                              │
│  Your Strengths Today:                       │
│  ✓ Articulate communication                  │
│  ✓ Confident body language                   │
│  ✓ Quick thinking                            │
│                                              │
│  Watch Out For:                              │
│  ⚠ Don't undersell yourself                  │
│  ⚠ Ask for what you're worth                 │
│                                              │
│  Power Phrases to Use:                       │
│  • "In my previous role, I..."               │
│  • "I'm excited about..."                    │
│  • "My approach to challenges is..."         │
│                                              │
│  Questions to Ask Them:                      │
│  • "What does success look like in           │
│     this role in 6 months?"                  │
│  • "What's the team dynamic like?"           │
│  • "What are the growth opportunities?"      │
│                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                              │
│  🤝 CLIENT MEETINGS:                         │
│  ────────────────────────────────────        │
│  Persuasion Power: Very High 🔥              │
│                                              │
│  Your Edge Today:                            │
│  • Natural charm and likability              │
│  • Strong negotiation position               │
│  • Ability to read the room                  │
│                                              │
│  Strategy:                                   │
│  → Lead with value, not price                │
│  → Listen 70%, talk 30%                      │
│  → Ask for the sale confidently              │
│                                              │
│  [🤖 Ask AI about specific situation]        │
│  [📊 See Detailed Workplace Analysis]        │
└──────────────────────────────────────────────┘
```

---

### 3. FAMILY DYNAMICS TAB

```
┌──────────────────────────────────────────────┐
│  👨‍👩‍👧‍👦 FAMILY DYNAMICS                          │
│  ────────────────────────────────────        │
│  Family Harmony Level: Moderate 🟡           │
│                                              │
│  👪 WITH PARENTS:                            │
│  ────────────────────────────────────        │
│  Emotional Temperature: Sensitive            │
│                                              │
│  What's Happening:                           │
│  Parents may be more traditional or          │
│  protective today. Patience is key.          │
│                                              │
│  ✅ Good Conversations:                      │
│  • Asking for their advice (they'll love it) │
│  • Sharing good news or achievements         │
│  • Planning family gatherings                │
│  • Showing appreciation                      │
│                                              │
│  ⚠️ Avoid:                                   │
│  • Arguing about lifestyle choices           │
│  • Defensive reactions                       │
│  • Major announcements (wait 2 days)         │
│                                              │
│  💡 Smart Move:                              │
│  Call them just to say you were thinking     │
│  of them. No agenda. Just connection.        │
│                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                              │
│  👫 WITH SIBLINGS:                           │
│  ────────────────────────────────────        │
│  Connection Quality: Good                    │
│                                              │
│  Energy: Light and playful communication     │
│  works best today.                           │
│                                              │
│  ✅ Good For:                                │
│  • Catching up casually                      │
│  • Sharing memes/humor                       │
│  • Planning something together               │
│  • Being supportive                          │
│                                              │
│  ⚠️ Avoid:                                   │
│  • Bringing up old conflicts                 │
│  • Comparing achievements                    │
│  • Asking for big favors                     │
│                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                              │
│  👶 WITH CHILDREN (If Applicable):           │
│  ────────────────────────────────────        │
│  Parenting Energy: Patient & Creative        │
│                                              │
│  Best Approach Today:                        │
│  • Quality over quantity time                │
│  • Active listening                          │
│  • Creative activities together              │
│  • Gentle discipline (firm but calm)         │
│                                              │
│  ⏰ Best Bonding Time:                       │
│  Evening 6:00 PM - 8:00 PM                   │
│                                              │
│  [🤖 Get Specific Family Advice]             │
└──────────────────────────────────────────────┘
```

---

### 4. PROFESSIONAL NETWORKING TAB

```
┌──────────────────────────────────────────────┐
│  🌐 PROFESSIONAL NETWORKING                  │
│  ────────────────────────────────────        │
│  Network Expansion Potential: High ⭐⭐⭐⭐⭐  │
│                                              │
│  🤝 MENTORS & ADVISORS:                      │
│  ────────────────────────────────────        │
│  Receptivity: Very High                      │
│                                              │
│  Today's Opportunity:                        │
│  Senior professionals are generous with      │
│  their time and wisdom today.                │
│                                              │
│  ✅ Excellent For:                           │
│  • Reaching out for advice                   │
│  • Asking for introductions                  │
│  • Seeking career guidance                   │
│  • Expressing gratitude for past help        │
│                                              │
│  💬 How to Reach Out:                        │
│  "Hi [Name], I've been thinking about        │
│   [topic] and would love your perspective.   │
│   Would you have 15 minutes sometime         │
│   this week?"                                │
│                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                              │
│  👔 CLIENTS & PARTNERS:                      │
│  ────────────────────────────────────        │
│  Trust Building: Favorable                   │
│                                              │
│  ✅ Good For:                                │
│  • Proposing new ideas                       │
│  • Asking for feedback                       │
│  • Negotiating terms                         │
│  • Strengthening relationships               │
│                                              │
│  Strategy:                                   │
│  → Focus on their goals, not just yours      │
│  → Be solution-oriented                      │
│  → Follow up promptly on commitments         │
│                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                              │
│  🆕 NEW CONNECTIONS:                         │
│  ────────────────────────────────────        │
│  First Impression Power: Strong              │
│                                              │
│  Your Energy Today:                          │
│  • Naturally charismatic                     │
│  • Memorable presence                        │
│  • Easy rapport building                     │
│                                              │
│  Best Platforms Today:                       │
│  ✓ LinkedIn outreach                         │
│  ✓ Industry events                           │
│  ✓ Coffee meetings                           │
│                                              │
│  Opening Line Template:                      │
│  "I came across your work on [X] and         │
│   was impressed by [specific detail].        │
│   I'd love to connect and learn more         │
│   about [their area]."                       │
│                                              │
│  [🤖 Get Networking Scripts]                 │
│  [📧 Draft Connection Message]               │
└──────────────────────────────────────────────┘
```

---

### 5. FINANCIAL PARTNERSHIPS TAB

```
┌──────────────────────────────────────────────┐
│  💰 FINANCIAL PARTNERSHIPS                   │
│  ────────────────────────────────────        │
│  Money Discussion Climate: Cautious 🟡       │
│                                              │
│  💼 BUSINESS PARTNERS:                       │
│  ────────────────────────────────────        │
│  Decision Alignment: Moderate                │
│                                              │
│  Today's Vibe:                               │
│  Partners may be more conservative.          │
│  Focus on data and long-term vision.         │
│                                              │
│  ✅ Good Topics:                             │
│  • Reviewing current strategies              │
│  • Planning for next quarter                 │
│  • Discussing minor adjustments              │
│  • Celebrating small wins                    │
│                                              │
│  ⚠️ Delay:                                   │
│  • Major financial commitments               │
│  • Risky investment decisions                │
│  • Profit distribution discussions           │
│                                              │
│  ⏰ Best Meeting Time:                       │
│  10:00 AM - 11:30 AM                         │
│  (Mutual clarity is highest)                 │
│                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                              │
│  🏦 INVESTORS & STAKEHOLDERS:                │
│  ────────────────────────────────────        │
│  Pitch Power: Above Average                  │
│                                              │
│  If Presenting Today:                        │
│  → Lead with traction and metrics            │
│  → Be conservative with projections          │
│  → Have backup plans ready                   │
│  → Show you've done deep research            │
│                                              │
│  What Resonates Today:                       │
│  ✓ Practical, grounded approach              │
│  ✓ Risk mitigation strategies                │
│  ✓ Long-term sustainability                  │
│                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                              │
│  💵 FINANCIAL ADVISORS/ACCOUNTANTS:          │
│  ────────────────────────────────────        │
│  Clarity: Good day for questions             │
│                                              │
│  ✅ Good For:                                │
│  • Understanding your financial picture      │
│  • Asking for explanations                   │
│  • Planning tax strategies                   │
│  • Reviewing portfolio                       │
│                                              │
│  Questions to Ask:                           │
│  • "What should I prioritize this quarter?"  │
│  • "Are there any risks I'm not seeing?"     │
│  • "How can I optimize X?"                   │
│                                              │
│  [💡 Generate Discussion Agenda]             │
└──────────────────────────────────────────────┘
```

---

### 6. HEALTH & WELLNESS INTERACTIONS TAB

```
┌──────────────────────────────────────────────┐
│  🏥 HEALTH & WELLNESS INTERACTIONS           │
│  ────────────────────────────────────        │
│  Healing Energy: Favorable 🟢                │
│                                              │
│  👨‍⚕️ DOCTORS & MEDICAL PROFESSIONALS:        │
│  ────────────────────────────────────        │
│  Communication Clarity: Excellent            │
│                                              │
│  If You Have an Appointment:                 │
│  ✓ You'll articulate symptoms clearly        │
│  ✓ Doctor will be attentive                  │
│  ✓ Good day for test results                 │
│  ✓ Treatment decisions are supported         │
│                                              │
│  Come Prepared With:                         │
│  • List of symptoms & timeline               │
│  • Questions about treatment options         │
│  • Your concerns & priorities                │
│                                              │
│  Questions to Ask:                           │
│  • "What are all my options?"                │
│  • "What would you recommend and why?"       │
│  • "What should I watch for?"                │
│                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                              │
│  🧘 THERAPISTS & COUNSELORS:                 │
│  ────────────────────────────────────        │
│  Emotional Openness: High                    │
│                                              │
│  Session Quality Today:                      │
│  You're more willing to be vulnerable.       │
│  Insights come easier.                       │
│  Breakthroughs are possible.                 │
│                                              │
│  Best Focus Areas:                           │
│  • Relationship patterns                     │
│  • Career stress                             │
│  • Self-worth issues                         │
│  • Communication skills                      │
│                                              │
│  💡 Insight:                                 │
│  Don't rush the process. Let silence         │
│  be okay. Your subconscious is active.       │
│                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                              │
│  💆 WELLNESS PRACTITIONERS:                  │
│  ────────────────────────────────────        │
│  (Yoga, Massage, Acupuncture, Healers)       │
│                                              │
│  Receptivity to Treatment: Very High         │
│                                              │
│  Your Body Today:                            │
│  • More sensitive to energy work             │
│  • Better mind-body connection               │
│  • Healing happens faster                    │
│                                              │
│  ✅ Excellent For:                           │
│  • First sessions with new practitioners     │
│  • Deep tissue work                          │
│  • Energy healing                            │
│  • Trying new modalities                     │
│                                              │
│  ⏰ Best Time for Sessions:                  │
│  Morning 8:00 AM - 10:00 AM                  │
│  (Body is most receptive)                    │
│                                              │
│  [📅 Book Wellness Appointment]              │
│  [🤖 Get Health Questions Template]          │
└──────────────────────────────────────────────┘
```

---

## 🎨 COMPONENT IMPLEMENTATION

### Complete Interactive Component

```typescript
interface InteractionCategory {
  id: string;
  label: string;
  icon: string;
  enabled: boolean; // Based on user profile
  subcategories: InteractionSubcategory[];
}

interface InteractionSubcategory {
  id: string;
  title: string;
  emoji: string;
  status: 'excellent' | 'favorable' | 'neutral' | 'sensitive' | 'caution';
  score: number; // 0-100
  
  overview: string;
  energyDescription: string;
  
  goodFor: string[];
  avoid: string[];
  bestTiming: TimeWindow | null;
  powerMove: string;
  
  // Contextual content
  conversationStarters?: string[];
  questionsToAsk?: string[];
  strategyTips?: string[];
  warningFlags?: string[];
  
  // Specific scenarios
  scenarios?: {
    situation: string;
    advice: string;
  }[];
  
  // Metrics (optional)
  metrics?: {
    label: string;
    value: number;
  }[];
}

const InteractionForecast: React.FC = () => {
  const { data } = useTodayGuidance();
  const [activeCategory, setActiveCategory] = useState('romantic');
  const [expandedSub, setExpandedSub] = useState<string | null>(null);
  
  const categories: InteractionCategory[] = [
    {
      id: 'romantic',
      label: 'Romantic',
      icon: '💑',
      enabled: true,
      subcategories: [
        {
          id: 'partner',
          title: 'Your Partner/Spouse',
          emoji: '💖',
          status: 'favorable',
          score: 80,
          overview: 'Your partner may be more sensitive today',
          energyDescription: 'Focus on listening rather than solving',
          goodFor: [
            'Quality time together (no screens)',
            'Cooking a meal together',
            'Light, playful conversation',
            'Planning something fun for weekend',
            'Showing appreciation through small acts'
          ],
          avoid: [
            'Bringing up serious relationship talks',
            'Criticizing or correcting them',
            'Making big commitments or decisions',
            'Comparing them to others'
          ],
          bestTiming: {
            start: '19:00',
            end: '21:00',
            activity: 'Meaningful conversations'
          },
          powerMove: 'Ask them: "What made you smile today?" and genuinely listen',
          conversationStarters: [
            '"I was thinking about..."',
            '"Remember when we..."',
            '"What would make you happy this week?"'
          ],
          scenarios: [
            {
              situation: 'If Conflict Arises',
              advice: 'Take a 15-minute pause before responding. Use "I feel..." instead of "You always...". Wait until tomorrow for difficult topics.'
            }
          ],
          metrics: [
            { label: 'Emotional', value: 80 },
            { label: 'Physical', value: 60 },
            { label: 'Mental', value: 70 }
          ]
        },
        {
          id: 'dating',
          title: 'Dating / New Romance',
          emoji: '🌹',
          status: 'excellent',
          score: 92,
          overview: 'Great day for first dates or deepening connection',
          energyDescription: 'Your charm is natural and effortless today',
          goodFor: [
            'First dates (plan for evening)',
            'Asking someone out',
            'DTR (Define The Relationship) talk',
            'Meeting their friends',
            'Being authentic and vulnerable'
          ],
          avoid: [
            'Playing games or being manipulative',
            'Rushing physical intimacy',
            'Oversharing past relationship drama'
          ],
          bestTiming: {
            start: '18:00',
            end: '21:00',
            activity: 'First dates or romantic conversations'
          },
          powerMove: 'Be genuinely curious. Ask deeper questions and listen.',
          conversationStarters: [
            '"What\'s something you\'re passionate about?"',
            '"What\'s a perfect day look like for you?"',
            '"What made you who you are today?"'
          ]
        }
      ]
    },
    
    {
      id: 'workplace',
      label: 'Work',
      icon: '💼',
      enabled: true,
      subcategories: [
        {
          id: 'manager',
          title: 'With Your Manager/Boss',
          emoji: '👔',
          status: 'favorable',
          score: 88,
          overview: 'Your boss is receptive to new ideas',
          energyDescription: 'Authority figures notice your work',
          goodFor: [
            'Presenting project updates',
            'Asking for resources/support',
            'Sharing achievements (subtly)',
            'Proposing solutions to problems'
          ],
          avoid: [
            'Complaining about workload',
            'Bringing up salary (wait 3 days)',
            'Office politics or gossip'
          ],
          bestTiming: {
            start: '14:00',
            end: '16:00',
            activity: 'Important professional conversations'
          },
          powerMove: '"I completed X and wanted to share how it impacted Y metric."',
          strategyTips: [
            'Lead with results, not just effort',
            'Have specific asks, not vague requests',
            'Show you understand business priorities'
          ]
        },
        {
          id: 'colleagues',
          title: 'With Colleagues/Team',
          emoji: '👥',
          status: 'excellent',
          score: 95,
          overview: 'Team chemistry is excellent today',
          energyDescription: 'People are open to collaboration',
          goodFor: [
            'Leading team meetings',
            'Brainstorming sessions',
            'Offering help to struggling teammates',
            'Building rapport over lunch/coffee'
          ],
          avoid: [
            'Taking sole credit for team wins',
            'Being overly competitive',
            'Dismissing others\' ideas quickly'
          ],
          bestTiming: {
            start: '10:00',
            end: '12:00',
            activity: 'Team collaboration'
          },
          powerMove: 'Publicly appreciate a colleague who helped you'
        },
        {
          id: 'interview',
          title: 'Job Interview Today?',
          emoji: '🎤',
          status: 'excellent',
          score: 93,
          overview: 'Timing is excellent for interviews',
          energyDescription: 'Your communication is clear and confident',
          goodFor: [
            'Articulating your value',
            'Asking smart questions',
            'Reading the room',
            'Negotiating compensation'
          ],
          avoid: [
            'Underselling yourself',
            'Being too humble',
            'Accepting first offer without negotiation'
          ],
          bestTiming: {
            start: '10:00',
            end: '12:00',
            activity: 'Interview'
          },
          powerMove: 'Ask: "What does success look like in this role in 6 months?"',
          conversationStarters: [
            '"In my previous role, I..."',
            '"I\'m excited about..."',
            '"My approach to challenges is..."'
          ],
          questionsToAsk: [
            'What does success look like in this role in 6 months?',
            'What\'s the team dynamic like?',
            'What are the growth opportunities?',
            'Why is this position open?'
          ]
        },
        {
          id: 'clients',
          title: 'Client Meetings',
          emoji: '🤝',
          status: 'favorable',
          score: 85,
          overview: 'High persuasion power today',
          energyDescription: 'Natural charm and strong negotiation position',
          goodFor: [
            'Sales presentations',
            'Pitching proposals',
            'Negotiating contracts',
            'Building relationships'
          ],
          avoid: [
            'Being too aggressive',
            'Overselling',
            'Ignoring their concerns'
          ],
          bestTiming: {
            start: '14:00',
            end: '16:00',
            activity: 'Client meetings'
          },
          powerMove: 'Lead with value, not price. Listen 70%, talk 30%.',
          strategyTips: [
            'Ask for the sale confidently',
            'Have case studies ready',
            'Address objections proactively'
          ]
        }
      ]
    },
    
    {
      id: 'family',
      label: 'Family',
      icon: '👨‍👩‍👧‍👦',
      enabled: true,
      subcategories: [
        {
          id: 'parents',
          title: 'With Parents',
          emoji: '👪',
          status: 'sensitive',
          score: 65,
          overview: 'Parents may be more traditional today',
          energyDescription: 'Patience is key',
          goodFor: [
            'Asking for their advice',
            'Sharing good news',
            'Planning family gatherings',
            'Showing appreciation'
          ],
          avoid: [
            'Arguing about lifestyle choices',
            'Defensive reactions',
            'Major announcements'
          ],
          bestTiming: {
            start: '17:00',
            end: '19:00',
            activity: 'Family calls'
          },
          powerMove: 'Call them just to say you were thinking of them. No agenda.'
        },
        {
          id: 'siblings',
          title: 'With Siblings',
          emoji: '👫',
          status: 'favorable',
          score: 78,
          overview: 'Light and playful communication works best',
          energyDescription: 'Good connection quality',
          goodFor: [
            'Catching up casually',
            'Sharing humor',
            'Planning something together',
            'Being supportive'
          ],
          avoid: [
            'Bringing up old conflicts',
            'Comparing achievements',
            'Asking for big favors'
          ],
          bestTiming: null,
          powerMove: 'Share a funny memory from childhood'
        },
        {
          id: 'children',
          title: 'With Children',
          emoji: '👶',
          status: 'favorable',
          score: 82,
          overview: 'Patient and creative parenting energy',
          energyDescription: 'Quality over quantity time',
          goodFor: [
            'Active listening',
            'Creative activities together',
            'Teaching moments',
            'Gentle discipline'
          ],
          avoid: [
            'Harsh punishment',
            'Being distracted',
            'Comparing to other kids'
          ],
          bestTiming: {
            start: '18:00',
            end: '20:00',
            activity: 'Quality bonding time'
          },
          powerMove: 'Put your phone away. Be fully present for 30 minutes.'
        }
      ]
    },
    
    {
      id: 'professional',
      label: 'Professional',
      icon: '🌐',
      enabled: true,
      subcategories: [
        {
          id: 'mentors',
          title: 'Mentors & Advisors',
          emoji: '🎓',
          status: 'excellent',
          score: 91,
          overview: 'Senior professionals are generous today',
          energyDescription: 'Excellent for seeking guidance',
          goodFor: [
            'Asking for advice',
            'Requesting introductions',
            'Seeking career guidance',
            'Expressing gratitude'
          ],
          avoid: [
            'Being too demanding',
            'Not doing your homework first',
            'Ignoring their advice'
          ],
          bestTiming: {
            start: '10:00',
            end: '11:30',
            activity: 'Mentor conversations'
          },
          powerMove: 'Ask: "What\'s one thing you wish you knew at my stage?"',
          conversationStarters: [
            '"I\'ve been thinking about [topic] and would love your perspective"',
            '"I\'m at a crossroads with [situation]. May I get your thoughts?"'
          ]
        },
        {
          id: 'networking',
          title: 'New Connections',
          emoji: '🆕',
          status: 'favorable',
          score: 84,
          overview: 'Strong first impression power',
          energyDescription: 'Naturally charismatic today',
          goodFor: [
            'LinkedIn outreach',
            'Industry events',
            'Coffee meetings',
            'Asking for introductions'
          ],
          avoid: [
            'Hard selling yourself',
            'Being inauthentic',
            'Not following up'
          ],
          bestTiming: null,
          powerMove: 'Send a personalized connection message, not generic',
          conversationStarters: [
            '"I came across your work on [X] and was impressed by [specific detail]"'
          ]
        }
      ]
    },
    
    {
      id: 'financial',
      label: 'Financial',
      icon: '💰',
      enabled: true,
      subcategories: [
        {
          id: 'business_partners',
          title: 'Business Partners',
          emoji: '💼',
          status: 'neutral',
          score: 68,
          overview: 'Partners may be more conservative',
          energyDescription: 'Focus on data and long-term vision',
          goodFor: [
            'Reviewing current strategies',
            'Planning for next quarter',
            'Discussing minor adjustments',
            'Celebrating small wins'
          ],
          avoid: [
            'Major financial commitments',
            'Risky investment decisions',
            'Profit distribution discussions'
          ],
          bestTiming: {
            start: '10:00',
            end: '11:30',
            activity: 'Partner meetings'
          },
          powerMove: 'Lead with metrics and conservative projections',
          strategyTips: [
            'Show you\'ve done deep research',
            'Have backup plans ready',
            'Focus on risk mitigation'
          ]
        },
        {
          id: 'investors',
          title: 'Investors & Stakeholders',
          emoji: '🏦',
          status: 'favorable',
          score: 77,
          overview: 'Above average pitch power',
          energyDescription: 'They\'re receptive to practical approaches',
          goodFor: [
            'Presenting traction',
            'Sharing metrics',
            'Discussing long-term sustainability',
            'Asking smart questions'
          ],
          avoid: [
            'Overly optimistic projections',
            'Ignoring risks',
            'Being unprepared for questions'
          ],
          bestTiming: {
            start: '14:00',
            end: '16:00',
            activity: 'Investor meetings'
          },
          powerMove: 'Show traction first, then vision',
          strategyTips: [
            'Lead with what\'s working',
            'Be honest about challenges',
            'Have a clear ask'
          ]
        },
        {
          id: 'financial_advisors',
          title: 'Financial Advisors',
          emoji: '💵',
          status: 'favorable',
          score: 79,
          overview: 'Good day for financial questions',
          energyDescription: 'Clarity in understanding complex topics',
          goodFor: [
            'Understanding your financial picture',
            'Asking questions',
            'Planning tax strategies',
            'Reviewing portfolio'
          ],
          avoid: [
            'Making rushed decisions',
            'Not asking for clarification',
            'Ignoring their expertise'
          ],
          bestTiming: null,
          powerMove: 'Come with a written list of questions',
          questionsToAsk: [
            'What should I prioritize this quarter?',
            'Are there any risks I\'m not seeing?',
            'How can I optimize [specific area]?'
          ]
        }
      ]
    },
    
    {
      id: 'health',
      label: 'Health',
      icon: '🏥',
      enabled: true,
      subcategories: [
        {
          id: 'doctors',
          title: 'Doctors & Medical',
          emoji: '👨‍⚕️',
          status: 'excellent',
          score: 89,
          overview: 'Communication clarity is excellent',
          energyDescription: 'You\'ll articulate symptoms clearly',
          goodFor: [
            'Medical appointments',
            'Getting test results',
            'Treatment decisions',
            'Second opinions'
          ],
          avoid: [
            'Not asking questions',
            'Downplaying symptoms',
            'Ignoring your intuition'
          ],
          bestTiming: {
            start: '09:00',
            end: '11:00',
            activity: 'Medical appointments'
          },
          powerMove: 'Come with a written list of symptoms and questions',
          questionsToAsk: [
            'What are all my options?',
            'What would you recommend and why?',
            'What should I watch for?',
            'When should I follow up?'
          ]
        },
        {
          id: 'therapists',
          title: 'Therapists & Counselors',
          emoji: '🧘',
          status: 'excellent',
          score: 91,
          overview: 'High emotional openness',
          energyDescription: 'Breakthroughs are possible',
          goodFor: [
            'Deep sessions',
            'Exploring patterns',
            'Being vulnerable',
            'Processing emotions'
          ],
          avoid: [
            'Rushing the process',
            'Intellectualizing feelings',
            'Avoiding difficult topics'
          ],
          bestTiming: {
            start: '15:00',
            end: '17:00',
            activity: 'Therapy sessions'
          },
          powerMove: 'Don\'t rush. Let silence be okay.',
          strategyTips: [
            'Your subconscious is active',
            'Trust the process',
            'Be honest, even if uncomfortable'
          ]
        },
        {
          id: 'wellness',
          title: 'Wellness Practitioners',
          emoji: '💆',
          status: 'excellent',
          score: 87,
          overview: 'Very high receptivity to treatment',
          energyDescription: 'Better mind-body connection',
          goodFor: [
            'First sessions with new practitioners',
            'Deep tissue work',
            'Energy healing',
            'Trying new modalities'
          ],
          avoid: [
            'Skipping sessions',
            'Not communicating discomfort',
            'Rushing recovery'
          ],
          bestTiming: {
            start: '08:00',
            end: '10:00',
            activity: 'Wellness sessions'
          },
          powerMove: 'Book that healing session you\'ve been postponing'
        }
      ]
    }
  ];
  
  const activeData = categories.find(c => c.id === activeCategory);
  
  return (
    <section id="interaction-forecast" className="px-4 py-8">
      <SectionHeader
        title="Today's Interaction Forecast"
        subtitle="Navigate every relationship with cosmic intelligence"
        icon="👥"
      />
      
      {/* Category Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="mb-6"
      >
        <div className="flex gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                px-4 py-2 rounded-full whitespace-nowrap transition-all
                ${activeCategory === cat.id 
                  ? 'bg-accent-primary text-white' 
                  : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                }
              `}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </ScrollView>
      
      {/* Subcategories */}
      <div className="space-y-3">
        {activeData?.subcategories.map(sub => (
          <InteractionCard
            key={sub.id}
            data={sub}
            isExpanded={expandedSub === sub.id}
            onToggle={() => setExpandedSub(
              expandedSub === sub.id ? null : sub.id
            )}
          />
        ))}
      </div>
    </section>
  );
};

const InteractionCard: React.FC<{
  data: InteractionSubcategory;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ data, isExpanded, onToggle }) => {
  const statusConfig = {
    excellent: { 
      color: 'text-green-400', 
      bg: 'bg-green-400/10', 
      dot: 'bg-green-400',
      label: 'Excellent'
    },
    favorable: { 
      color: 'text-green-300', 
      bg: 'bg-green-300/10', 
      dot: 'bg-green-300',
      label: 'Favorable'
    },
    neutral: { 
      color: 'text-yellow-400', 
      bg: 'bg-yellow-400/10', 
      dot: 'bg-yellow-400',
      label: 'Neutral'
    },
    sensitive: { 
      color: 'text-purple-400', 
      bg: 'bg-purple-400/10', 
      dot: 'bg-purple-400',
      label: 'Sensitive'
    },
    caution: { 
      color: 'text-red-400', 
      bg: 'bg-red-400/10', 
      dot: 'bg-red-400',
      label: 'Caution'
    }
  }[data.status];
  
  return (
    <div className="bg-bg-secondary rounded-xl overflow-hidden border border-glass-border">
      {/* Collapsed View */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-bg-tertiary transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{data.emoji}</span>
          <div className="text-left">
            <h4 className="font-semibold">{data.title}</h4>
            <p className="text-sm text-text-secondary">{data.overview}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 ${statusConfig.bg} px-3 py-1 rounded-full`}>
            <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
            <span className={`text-sm font-medium ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
          <div className="text-lg font-bold">{data.score}</div>
          <ChevronIcon className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </button>
      
      {/* Expanded View */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="px-4 pb-4 border-t border-glass-border space-y-4">
              {/* Energy Description */}
              <div className="mt-4 italic text-sm text-text-muted">
                {data.energyDescription}
              </div>
              
              {/* Good For */}
              <div>
                <h5 className="text-sm font-semibold text-green-400 mb-2">
                  ✅ Good For Today:
                </h5>
                <ul className="space-y-1">
                  {data.goodFor.map((item, i) => (
                    <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Avoid */}
              {data.avoid.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold text-red-400 mb-2">
                    ⚠️ Avoid Today:
                  </h5>
                  <ul className="space-y-1">
                    {data.avoid.map((item, i) => (
                      <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                        <span className="text-red-400 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Best Timing */}
              {data.bestTiming && (
                <div className="bg-accent-primary/10 rounded-lg p-3 border-l-4 border-accent-primary">
                  <h5 className="text-sm font-semibold mb-1">⏰ Best Timing:</h5>
                  <p className="text-sm">
                    {data.bestTiming.start} - {data.bestTiming.end}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    {data.bestTiming.activity}
                  </p>
                </div>
              )}
              
              {/* Power Move */}
              <div className="bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 rounded-lg p-3 border-l-4 border-accent-primary">
                <h5 className="text-sm font-semibold mb-1">💡 Power Move:</h5>
                <p className="text-sm">{data.powerMove}</p>
              </div>
              
              {/* Conversation Starters */}
              {data.conversationStarters && (
                <div>
                  <h5 className="text-sm font-semibold mb-2">💬 Conversation Starters:</h5>
                  <div className="space-y-2">
                    {data.conversationStarters.map((starter, i) => (
                      <div key={i} className="bg-bg-tertiary rounded p-2 text-sm">
                        {starter}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Questions to Ask */}
              {data.questionsToAsk && (
                <div>
                  <h5 className="text-sm font-semibold mb-2">❓ Questions to Ask:</h5>
                  <ul className="space-y-1">
                    {data.questionsToAsk.map((q, i) => (
                      <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                        <span className="text-accent-primary mt-0.5">•</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Strategy Tips */}
              {data.strategyTips && (
                <div>
                  <h5 className="text-sm font-semibold mb-2">🎯 Strategy Tips:</h5>
                  <ul className="space-y-1">
                    {data.strategyTips.map((tip, i) => (
                      <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                        <span className="text-accent-primary mt-0.5">→</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Scenarios */}
              {data.scenarios && (
                <div>
                  <h5 className="text-sm font-semibold mb-2">📝 Specific Scenarios:</h5>
                  <Accordion items={data.scenarios.map(s => ({
                    title: s.situation,
                    content: s.advice
                  }))} />
                </div>
              )}
              
              {/* Metrics */}
              {data.metrics && (
                <div>
                  <h5 className="text-sm font-semibold mb-3">📊 Connection Metrics:</h5>
                  {data.metrics.map(metric => (
                    <div key={metric.label} className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{metric.label}</span>
                        <span className="font-semibold">{metric.value}%</span>
                      </div>
                      <div className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent-primary rounded-full transition-all duration-1000"
                          style={{ width: `${metric.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* AI Chat CTA */}
              <button className="w-full bg-accent-primary hover:bg-accent-primary/80 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <span>🤖</span>
                <span>Ask AI about this interaction</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
```

---


---

This is a **game-changing feature** that makes your app indispensable for daily decision-making across ALL relationships! 🚀