import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Target, Star, Layers, Calendar, Clock,
    Sparkles, BarChart3, CheckCircle2, ArrowRight
} from 'lucide-react';

const KPDashboard: React.FC = () => {
    const navigate = useNavigate();

    const features = [
        {
            id: 'detailed-predictions',
            title: 'Detailed Predictions',
            subtitle: 'Deep Dive',
            description: 'Mercury Antardasha analysis with Star Lord connections and period activations',
            icon: Target,
            color: 'from-[#6D5DF6]/20 to-[#6D5DF6]/5',
            badge: 'Deep Dive',
            path: '/kp/detailed-predictions'
        },
        {
            id: 'precision-scoring',
            title: 'Precision Scoring',
            subtitle: 'Exclusive',
            description: 'Mathematical percentage scores (72% EXCELLENT) with color-coded ratings',
            icon: BarChart3,
            color: 'from-[#2ED573]/20 to-[#2ED573]/5',
            badge: 'Exclusive',
            path: '/kp/precision-scoring'
        },
        {
            id: 'potential-of-planet',
            title: 'Potential of Planet',
            subtitle: 'Destiny',
            description: 'Event potential checker: Job Promotion (YES), Foreign Travel (YES), Lottery (NO)',
            icon: Sparkles,
            color: 'from-[#6D5DF6]/20 to-[#6D5DF6]/5',
            badge: 'Destiny',
            path: '/kp/event-potential'
        },
        {
            id: '3-layer-script',
            title: '3-Layer Script',
            subtitle: 'Core Logic',
            description: 'Sun → Star Lord → Sub Lord breakdown for every planet',
            icon: Layers,
            color: 'from-[#F5A623]/20 to-[#F5A623]/5',
            badge: 'Core Logic',
            path: '/kp/three-layer-script'
        },
        {
            id: '5-year-timeline',
            title: '5-Year Timeline',
            subtitle: 'Roadmap',
            description: 'Complete Mahadasha-Antardasha timeline with exact dates',
            icon: Calendar,
            color: 'from-[#6D5DF6]/20 to-[#6D5DF6]/5',
            badge: 'Roadmap',
            path: '/kp/timeline'
        },
        {
            id: 'accurate-timing',
            title: 'Accurate Timing',
            subtitle: 'Precision',
            description: 'Sub-period analysis with quality ratings for every Antardasha',
            icon: Clock,
            color: 'from-[#E25555]/20 to-[#E25555]/5',
            badge: 'Precision',
            path: '/kp/accurate-timing'
        },
        {
            id: 'nakshatra-nadi',
            title: 'Nakshatra Nadi',
            subtitle: 'Specialized',
            description: "Pt. Dinesh Guruji's 3-Layer Decision Engine & Hit Theory analysis",
            icon: Star,
            color: 'from-[#F5A623]/20 to-[#F5A623]/5',
            badge: 'Specialized',
            path: '/kp/nakshatra-nadi'
        }
    ];

    const categoryReports = [
        { name: 'Career & Profession', icon: '💼', color: 'bg-[#6D5DF6]/10 text-[#6D5DF6]', path: '/kp/category/career' },
        { name: 'Love & Marriage', icon: '💕', color: 'bg-[#E25555]/10 text-[#E25555]', path: '/kp/category/love' },
        { name: 'Finance & Wealth', icon: '💰', color: 'bg-[#2ED573]/10 text-[#2ED573]', path: '/kp/category/finance' },
        { name: 'Property & Real Estate', icon: '🏠', color: 'bg-[#F5A623]/10 text-[#F5A623]', path: '/kp/category/property' },
        { name: 'Health & Wellness', icon: '🏥', color: 'bg-[#E25555]/10 text-[#E25555]', path: '/kp/category/health' },
        { name: 'Name & Fame', icon: '⭐', color: 'bg-[#F5A623]/10 text-[#F5A623]', path: '/kp/category/fame' }
    ];

    return (
        <div className="min-h-screen bg-[#0B0F1A] p-6 text-[#EDEFF5]">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="text-center mb-6">
                    <div className="inline-block px-4 py-1 bg-[#11162A] text-[#F5A623] rounded-full text-sm font-semibold mb-4 border border-[rgba(255,255,255,0.08)]">
                        UNMATCHED DEPTH
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#EDEFF5] mb-4">
                        The Most Advanced KP Report Features
                    </h1>
                    <p className="text-lg text-[#A9B0C2] max-w-3xl mx-auto">
                        We don't just give you a chart. We decode your destiny using the most precise predictive logic available today.
                    </p>
                </div>
            </div>

            {/* Main Features Grid */}
            <div className="max-w-7xl mx-auto mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.id}
                                onClick={() => navigate(feature.path)}
                                className="group relative bg-[rgba(255,255,255,0.04)] rounded-2xl border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.06)] transition-all duration-300 cursor-pointer overflow-hidden"
                            >
                                {/* Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                                {/* Content */}
                                <div className="relative p-6">
                                    {/* Icon and Badge */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-xl bg-[#11162A] border border-[rgba(255,255,255,0.08)] text-[#F5A623]`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <span className="px-3 py-1 bg-[#11162A] text-[#A9B0C2] border border-[rgba(255,255,255,0.08)] rounded-full text-xs font-semibold">
                                            {feature.badge}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-[#EDEFF5] mb-2">
                                        {feature.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-[#A9B0C2] text-sm mb-4">
                                        {feature.description}
                                    </p>

                                    {/* Arrow */}
                                    <div className="flex items-center text-[#6F768A] group-hover:text-[#F5A623] transition-colors">
                                        <span className="text-sm font-semibold mr-2">Explore</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Category Reports Section */}
            <div className="max-w-7xl mx-auto mb-12">
                <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-[#EDEFF5] mb-2">
                        Nakshatra KP Highlights
                    </h2>
                    <p className="text-[#A9B0C2] mb-6">
                        Star Lord + Sub Lord logic with Mahadasha timelines. Get detailed insights for every life area.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryReports.map((category) => (
                            <div
                                key={category.name}
                                onClick={() => navigate(category.path)}
                                className={`bg-[#11162A] border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.06)] rounded-xl p-4 cursor-pointer hover:scale-105 transition-transform duration-200`}
                            >
                                <div className="flex items-center space-x-3 text-[#EDEFF5]">
                                    <span className="text-2xl">{category.icon}</span>
                                    <span className="font-semibold">{category.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* My KP Chart */}
                    <div
                        onClick={() => navigate('/kp/chart')}
                        className="bg-[#11162A] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 text-[#EDEFF5] cursor-pointer hover:bg-[rgba(255,255,255,0.06)] transition-all duration-300"
                    >
                        <Star className="w-12 h-12 mb-4 text-[#F5A623]" />
                        <h3 className="text-2xl font-bold mb-2">My KP Chart</h3>
                        <p className="text-[#A9B0C2] mb-4">
                            View your complete KP chart with Star Lords, Sub Lords, and house cusps
                        </p>
                        <div className="flex items-center text-sm font-semibold text-[#F5A623]">
                            <span>View Chart</span>
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                    </div>

                    {/* Complete Report */}
                    <div
                        onClick={() => navigate('/kp/complete-report')}
                        className="bg-gradient-to-br from-[#6D5DF6] to-[#5B4BC4] rounded-2xl shadow-lg p-8 text-[#EDEFF5] cursor-pointer hover:shadow-2xl transition-all duration-300"
                    >
                        <CheckCircle2 className="w-12 h-12 mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Complete KP Report</h3>
                        <p className="text-[#EDEFF5]/80 mb-4">
                            Get your full KP analysis with all features combined in one comprehensive report
                        </p>
                        <div className="flex items-center text-sm font-semibold">
                            <span>Generate Report</span>
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KPDashboard;
