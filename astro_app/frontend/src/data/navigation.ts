import {
    Home, Star, Sparkles, Calendar, Zap, Compass,
    Grid, BarChart2, Moon, Globe, Sunrise, Clock, Users, Layers, Layout,
    Briefcase, TrendingUp
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
            { to: '/cosmic/business', icon: Briefcase, label: 'Business & Finance', description: 'Astrological insights for markets and business' },
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
