import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import HoroscopeCard from './HoroscopeCard';

interface DailyHoroscopesProps {
    chartData: any;
    dashaData?: any;
}

const DailyHoroscopes: React.FC<DailyHoroscopesProps> = ({ chartData, dashaData }) => {
    const [horoscopeData, setHoroscopeData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchDailyHoroscopes();
    }, [chartData]);

    const fetchDailyHoroscopes = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('http://localhost:8000/api/ai/daily-horoscopes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chart_data: chartData,
                    dasha_data: dashaData,
                    current_date: new Date().toISOString()
                }),
            });

            const result = await response.json();

            if (result.status === 'success') {
                setHoroscopeData(result.data);
            } else {
                setError(result.message || 'Failed to generate horoscopes');
            }
        } catch (err) {
            console.error('Error fetching daily horoscopes:', err);
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current && horoscopeData) {
            const cardWidth = 440; // 420px + 20px gap
            const newIndex = direction === 'left'
                ? Math.max(0, currentCardIndex - 1)
                : Math.min(horoscopeData.horoscopes.length - 1, currentCardIndex + 1);

            setCurrentCardIndex(newIndex);
            scrollContainerRef.current.scrollTo({
                left: newIndex * cardWidth,
                behavior: 'smooth'
            });
        }
    };

    if (loading) {
        return (
            <div className="w-full py-16">
                <div className="flex flex-col items-center justify-center gap-6">
                    <div className="relative w-20 h-20">
                        <div className="absolute inset-0 rounded-full border-4 border-amber-500/20" />
                        <div className="absolute inset-0 rounded-full border-4 border-t-amber-500 animate-spin" />
                        <RefreshCw className="absolute inset-0 m-auto w-8 h-8 text-amber-400" />
                    </div>
                    <p className="text-slate-300 font-bold text-lg">Calculating cosmic alignments...</p>
                    <p className="text-slate-500 text-sm">Synthesizing Dasha, Transits & Nakshatra intelligence</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full py-16">
                <div className="flex flex-col items-center justify-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                        <span className="text-4xl">⚠️</span>
                    </div>
                    <p className="text-red-400 font-bold text-lg">{error}</p>
                    <button
                        onClick={fetchDailyHoroscopes}
                        className="px-6 py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold rounded-xl border border-amber-500/30 transition-all hover:scale-105"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!horoscopeData) {
        return null;
    }

    return (
        <div className="w-full space-y-8">
            {/* Enhanced Overall Theme Header */}
            <div className="relative bg-gradient-to-br from-teal-900/40 via-cyan-900/30 to-blue-900/20 backdrop-blur-md border border-teal-500/30 rounded-3xl p-8 overflow-hidden shadow-2xl shadow-teal-500/10">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(20,184,166,0.3)_0%,transparent_50%)] animate-pulse-slow" />
                    <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(6,182,212,0.3)_0%,transparent_50%)] animate-pulse-slow" style={{ animationDelay: '1s' }} />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl animate-pulse">✨</span>
                        <h3 className="text-amber-300 font-black text-sm uppercase tracking-[0.2em]">
                            Today's Cosmic Decree
                        </h3>
                    </div>

                    <p className="text-white text-xl font-bold leading-relaxed mb-6 max-w-4xl">
                        {horoscopeData.overall_theme}
                    </p>

                    {/* Enhanced Quick Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="group bg-slate-800/50 hover:bg-slate-800/70 rounded-2xl p-4 border border-white/10 hover:border-teal-500/30 transition-all duration-300 hover:scale-105">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">🔮</span>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Power Frequency</p>
                            </div>
                            <p className="text-amber-200 font-black text-base italic">"{horoscopeData.power_mantra}"</p>
                        </div>

                        <div className="group bg-slate-800/50 hover:bg-slate-800/70 rounded-2xl p-4 border border-white/10 hover:border-teal-500/30 transition-all duration-300 hover:scale-105">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">⭐</span>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Primary Focus</p>
                            </div>
                            <p className="text-white font-black text-base">{horoscopeData.primary_focus}</p>
                        </div>

                        <div className="group bg-slate-800/50 hover:bg-slate-800/70 rounded-2xl p-4 border border-white/10 hover:border-teal-500/30 transition-all duration-300 hover:scale-105">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">🎨</span>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Harmonic Color</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg shadow-amber-500/50" />
                                <p className="text-white font-black text-base">{horoscopeData.harmonic_color}</p>
                            </div>
                        </div>

                        <div className="group bg-slate-800/50 hover:bg-slate-800/70 rounded-2xl p-4 border border-white/10 hover:border-teal-500/30 transition-all duration-300 hover:scale-105">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">🧭</span>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Optimal Direction</p>
                            </div>
                            <p className="text-white font-black text-base">{horoscopeData.optimal_direction}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Horoscope Cards Carousel */}
            <div className="relative">
                {/* Enhanced Scroll Buttons */}
                <button
                    onClick={() => scroll('left')}
                    disabled={currentCardIndex === 0}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-slate-800/90 hover:bg-slate-700/90 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                    onClick={() => scroll('right')}
                    disabled={currentCardIndex === horoscopeData.horoscopes.length - 1}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-slate-800/90 hover:bg-slate-700/90 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Scrollable Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-5 overflow-x-auto scrollbar-hide px-14 py-4 scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {horoscopeData.horoscopes.map((card: any, index: number) => (
                        <div key={index} style={{ animationDelay: `${index * 100}ms` }}>
                            <HoroscopeCard {...card} />
                        </div>
                    ))}
                </div>

                {/* Progress Dots */}
                <div className="flex items-center justify-center gap-2 mt-6">
                    {horoscopeData.horoscopes.map((_: any, index: number) => (
                        <button
                            key={index}
                            onClick={() => {
                                setCurrentCardIndex(index);
                                if (scrollContainerRef.current) {
                                    scrollContainerRef.current.scrollTo({
                                        left: index * 440,
                                        behavior: 'smooth'
                                    });
                                }
                            }}
                            className={`transition-all duration-300 rounded-full ${index === currentCardIndex
                                    ? 'w-8 h-2 bg-amber-500'
                                    : 'w-2 h-2 bg-slate-600 hover:bg-slate-500'
                                }`}
                            aria-label={`Go to card ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Footer Info */}
            <div className="text-center space-y-3">
                <p className="text-xs text-slate-500 font-medium">
                    Generated on {horoscopeData.date} • AI Provider: {horoscopeData.ai_provider}
                </p>
                <button
                    onClick={fetchDailyHoroscopes}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800/40 hover:bg-slate-700/40 text-slate-300 text-sm font-bold rounded-xl border border-white/10 transition-all hover:border-amber-500/30 hover:scale-105"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh Horoscopes
                </button>
            </div>
        </div>
    );
};

export default DailyHoroscopes;
