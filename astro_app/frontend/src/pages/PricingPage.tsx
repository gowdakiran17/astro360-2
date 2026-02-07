
import { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { 
    Zap, Crown, Star, 
    ArrowRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PricingPage = () => {
    const navigate = useNavigate();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

    const plans = [
        {
            id: 'free',
            name: 'Cosmic Starter',
            price: { monthly: 0, yearly: 0 },
            desc: 'Essential astrology tools for beginners.',
            features: [
                'Birth Chart (D1)',
                'Planetary Positions',
                'Basic Mahadasha',
                'Daily Horoscope',
                'Moon Sign Predictions'
            ],
            missing: [
                'Divisional Charts (D9, D10...)',
                'Detailed Predictions',
                'Astro-Vastu Analysis',
                'Gemstone Remedies',
                'Life Event Calibration'
            ],
            icon: Star,
            color: 'slate',
            cta: 'Current Plan'
        },
        {
            id: 'silver',
            name: 'Silver Pack',
            price: { monthly: 9.99, yearly: 99 },
            desc: 'Deeper insights for serious enthusiasts.',
            popular: true,
            features: [
                'All Free Features',
                'All Divisional Charts (D1-D60)',
                'Solar Return (Varshphal)',
                'Detailed Pdf Reports',
                'Transit Analysis',
                'KP Astrology Basics'
            ],
            missing: [
                'Astro-Vastu Analysis',
                'Business & Financial Astro',
                'Muhurta Finder',
                'Birth Time Rectification'
            ],
            icon: Zap,
            color: 'indigo',
            cta: 'Start Free Trial'
        },
        {
            id: 'gold',
            name: 'Gold Elite',
            price: { monthly: 19.99, yearly: 199 },
            desc: 'Professional grade tools for experts.',
            features: [
                'Everything in Silver',
                'Astro-Vastu Engine',
                'Financial & Market Timing',
                'Muhurta Finder',
                'Life Event Calibration',
                'Unlimited Chart Storage',
                'Priority Support'
            ],
            missing: [],
            icon: Crown,
            color: 'amber',
            cta: 'Get Gold Access'
        }
    ];

    return (
        <MainLayout title="Plans & Pricing" breadcrumbs={['Account', 'Subscription']}>
            <div className="max-w-7xl mx-auto py-8 px-4">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        Unlock Your <span className="text-indigo-600">Cosmic Potential</span>
                    </h1>
                    <p className="text-xl text-slate-500 mb-8">
                        Choose the perfect plan to navigate your destiny. From basic charts to professional predictive engines.
                    </p>
                    
                    {/* Toggle */}
                    <div className="inline-flex bg-slate-100 p-1 rounded-full border border-slate-200 relative">
                        <div className={`w-1/2 h-full absolute top-0 left-0 bg-white rounded-full shadow-sm border border-slate-200 transition-all duration-300 ${billingCycle === 'yearly' ? 'translate-x-full' : 'translate-x-0'}`}></div>
                        <button 
                            onClick={() => setBillingCycle('monthly')}
                            className={`relative z-10 px-6 py-2 text-sm font-bold rounded-full transition-colors ${billingCycle === 'monthly' ? 'text-indigo-600' : 'text-slate-500'}`}
                        >
                            Monthly
                        </button>
                        <button 
                            onClick={() => setBillingCycle('yearly')}
                            className={`relative z-10 px-6 py-2 text-sm font-bold rounded-full transition-colors flex items-center gap-2 ${billingCycle === 'yearly' ? 'text-indigo-600' : 'text-slate-500'}`}
                        >
                            Yearly <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full uppercase">Save 20%</span>
                        </button>
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan) => (
                        <div 
                            key={plan.id}
                            className={`relative bg-white rounded-2xl p-8 border-2 transition-all hover:-translate-y-2 hover:shadow-xl ${
                                plan.popular 
                                ? 'border-indigo-600 shadow-lg shadow-indigo-100' 
                                : 'border-slate-100 hover:border-slate-200'
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <div className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center ${
                                plan.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                                plan.color === 'amber' ? 'bg-amber-100 text-amber-600' :
                                'bg-slate-100 text-slate-600'
                            }`}>
                                <plan.icon className="w-6 h-6" />
                            </div>

                            <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                            <p className="text-slate-500 text-sm mt-2 min-h-[40px]">{plan.desc}</p>

                            <div className="my-6">
                                <span className="text-4xl font-black text-slate-900">
                                    ${billingCycle === 'yearly' ? plan.price.yearly : plan.price.monthly}
                                </span>
                                <span className="text-slate-400 font-medium">
                                    /{billingCycle === 'yearly' ? 'year' : 'mo'}
                                </span>
                            </div>

                            <button 
                                onClick={() => navigate('/checkout', { state: { plan: plan.id, cycle: billingCycle } })}
                                className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all mb-8 ${
                                    plan.id === 'free'
                                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    : plan.color === 'indigo'
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                                        : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:shadow-amber-200'
                                }`}
                            >
                                {plan.cta} <ArrowRight className="w-4 h-4" />
                            </button>

                            <div className="space-y-4">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Features</p>
                                {plan.features.map((feat, i) => (
                                    <div key={i} className="flex gap-3 items-start">
                                        <div className={`mt-0.5 min-w-[16px] h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                            plan.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                                            plan.color === 'amber' ? 'bg-amber-100 text-amber-600' :
                                            'bg-slate-200 text-slate-600'
                                        }`}>✓</div>
                                        <span className="text-sm text-slate-600 font-medium leading-tight">{feat}</span>
                                    </div>
                                ))}
                                {plan.missing.map((feat, i) => (
                                    <div key={i} className="flex gap-3 items-start opacity-50">
                                        <div className="mt-0.5 min-w-[16px] h-4 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-[10px] font-bold">✕</div>
                                        <span className="text-sm text-slate-500 leading-tight">{feat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto mt-20">
                    <h2 className="text-2xl font-bold text-center text-slate-900 mb-10">Frequently Asked Questions</h2>
                    <div className="grid gap-6">
                        {[
                            { q: "Can I upgrade or downgrade later?", a: "Yes, you can change your plan at any time. Prorated charges will apply." },
                            { q: "Is the Gold plan really unlimited?", a: "Yes, you can save unlimited charts and run unlimited detailed reports." },
                            { q: "What payment methods do you accept?", a: "We accept all major credit cards, PayPal, and Apple Pay." }
                        ].map((faq, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200">
                                <h4 className="font-bold text-slate-800 mb-2">{faq.q}</h4>
                                <p className="text-slate-500 text-sm">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </MainLayout>
    );
};

export default PricingPage;
