import {
    Home, Star, Sparkles, Calendar, Zap, Compass,
    Grid, BarChart2, Moon, Globe, Sunrise, Clock, Users, Layers, Layout,
    TrendingUp, Activity, Crosshair, Bitcoin, Brain, Building2
} from 'lucide-react';

export const MENU_ITEMS = [
    {
        section: 'Dashboard',
        items: [
            { to: '/dashboard/main', icon: Home, label: 'Main Dashboard', description: 'Your personalized Vedic overview' },
            { to: '/ai-astrologer', icon: Sparkles, label: 'VedaAI Chat', badge: 'AI', description: 'Consult with our advanced AI astrologer' },
        ]
    },
    {
        section: 'Cosmic Intelligence Hub',
        items: [
            {
                to: '/cosmic/market-timing',
                icon: Activity,
                label: 'Market Timing Intelligence',
                purpose: 'Tell users when to buy, sell, launch, apply, negotiate.',
                uses: ['Transits', 'Dasha', 'Moon', 'Nakshatra', 'Numerology'],
                output: ['Best dates', 'Risk windows', 'Opportunity windows'],
                description: 'Astro-timing for critical decisions'
            },
            {
                to: '/cosmic/gann-trading',
                icon: Crosshair,
                label: 'Gann Trading Intelligence',
                badge: 'PREMIUM',
                purpose: 'Advanced Time-Price analysis for serious traders using Gann\'s planetary laws.',
                uses: ['Square of 9', 'Planetary Harmonics', 'Retrogrades', 'Cycle Analysis'],
                output: ['Price Targets', 'Reversal Dates', 'Cycle Warnings'],
                description: 'Planetary price and time harmonics'
            },
            {
                to: '/cosmic/crypto-stock',
                icon: Bitcoin,
                label: 'Crypto vs Stock Dashboard',
                purpose: 'Personalized financial decision engine based on your wealth DNA.',
                uses: ['Wealth DNA', 'Asset Suitability', 'Risk vs Stability', 'Personal Trends'],
                output: ['Best Asset Today', 'Crypto Score', 'Stock Score', 'Wealth Persona'],
                description: 'Personalized asset ranking system'
            },
            {
                to: '/cosmic/trading-intelligence',
                icon: TrendingUp,
                label: 'Real-time Trading Intelligence',
                badge: 'PREMIUM',
                purpose: 'Live actionable trading signals and volatility warnings.',
                uses: ['Today is a buy zone', 'Avoid new trades till Friday', 'High volatility window'],
                output: ['Buy zones', 'No-trade windows', 'Volatility alerts'],
                description: 'Actionable astro-trading signals'
            },
            {
                to: '/cosmic/market-psychology',
                icon: Brain,
                label: 'Market Psychology Intelligence',
                purpose: 'Analyze market sentiment using lunar and planetary influences.',
                uses: ['Moon', 'Rahu', 'Mercury'],
                output: ['Market fear', 'Market greed', 'Crowd behavior'],
                description: 'Lunar influence on crowd sentiment'
            },
            {
                to: '/cosmic/corporate-planning',
                icon: Building2,
                label: 'Corporate Planning Intelligence',
                purpose: 'Strategic timing for founders, managers, and HR.',
                uses: ['Organizational charts', 'Planetary periods', 'Transits'],
                output: ['When to hire', 'When to fire', 'When to expand', 'When to restructure'],
                description: 'Astro-strategy for business leaders'
            },
            {
                to: '/cosmic/team-dynamics',
                icon: Users,
                label: 'Team Dynamics Intelligence',
                purpose: 'Optimize team composition and conflict resolution.',
                uses: ['Birth charts', 'Nakshatra', 'Moon sign'],
                output: ['Team compatibility', 'Leadership alignment', 'Conflict zones'],
                description: 'Harmonize your workforce'
            },
        ]
    },
    {
        section: 'Forecasts',
        items: [
            { to: '/tools/life-predictor', icon: TrendingUp, label: 'Life Predictor', badge: 'AI', description: 'VedAstro-powered long-term predictions' },
            { to: '/tools/period-analysis', icon: Calendar, label: 'Period Analysis', badge: 'AI', description: 'Detailed Mahadasha and Antardasha' },
            { to: '/tools/sade-sati', icon: Moon, label: 'Sade Sati', description: 'Track your Saturn transit status' },
            { to: '/calculations/vimshottari', icon: Clock, label: 'Vimshottari Dasha', description: 'View full Dasha timelines' },
            { to: '/global/transits', icon: Globe, label: 'Current Transits', description: 'Real-time planetary movements' },
        ]
    },
    {
        section: 'Astro Vastu Features',
        items: [
            { to: '/vastu/personal', icon: Compass, label: 'Personal Compass', badge: 'NEW', description: 'Vastu guidance based on your chart' },
            { to: '/vastu', icon: Layout, label: 'Home Vastu Engine', badge: 'PRO', description: 'Comprehensive Vastu analysis for spaces' },
        ]
    },
    {
        section: 'Corrections & Remedies',
        items: [
            { to: '/tools/gems', icon: Grid, label: 'Gemstones', badge: 'AI', description: 'Find your perfect corrective gemstones' },
            { to: '/dashboard/remedies', icon: Sparkles, label: 'Cosmic Toolkit', badge: 'PRO', description: 'Personalized remedies and boosters' },
            { to: '/tools/numerology', icon: Sparkles, label: 'Numerology', description: 'Explore your name and birth numbers' },
        ]
    },
    {
        section: 'KP Astrology',
        badge: 'NEW',
        items: [
            { to: '/kp/dashboard', icon: Star, label: 'KP Dashboard', badge: 'NEW', description: 'Advanced KP Astrology control center' },
            { to: '/kp/chart', icon: Grid, label: 'My KP Chart', description: 'View your KP-style birth chart' },
            { to: '/kp/detailed-predictions', icon: Sparkles, label: 'Detailed Predictions', description: 'House and planet-wise KP insights' },
            { to: '/kp/precision-scoring', icon: BarChart2, label: 'Precision Scoring', description: 'Quantified planetary strengths' },
            { to: '/kp/event-potential', icon: Zap, label: 'Event Potential', description: 'Check potential for specific events' },
            { to: '/kp/timeline', icon: Calendar, label: '5-Year Timeline', description: 'Upcoming event windows' },
            { to: '/kp/complete-report', icon: Layers, label: 'Complete Report', description: 'Downloadable comprehensive KP report' },
        ]
    },
    {
        section: 'Astro Metrics',
        badge: 'ADVANCED',
        items: [
            { to: '/calculations/shodashvarga', icon: Grid, label: 'Shodashvarga Charts', description: '16 divisional charts' },
            { to: '/calculations/ashtakvarga', icon: BarChart2, label: 'Ashtakavarga Strength', description: 'House support analysis' },
            { to: '/calculations/shadbala', icon: Zap, label: 'Shadbala Energy', description: 'Planetary strength metrics' },
            { to: '/calculations/shadow-planets', icon: Layers, label: 'Shadow Planets', description: 'Karmic points and planets' },
        ]
    },
    {
        section: 'Astro Calendar',
        items: [
            { to: '/global/panchang', icon: Sunrise, label: 'Panchang', description: 'Traditional daily Vedic calendar' },
            { to: '/global/muhurata', icon: Clock, label: 'Muhurtas', description: 'Find auspicious timings' },
            { to: '/global/matching', icon: Users, label: 'Chart Compatibility', description: 'Relationship and partner matching' },
        ]
    }
];
