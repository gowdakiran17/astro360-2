import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import HoroscopeCard from './HoroscopeCard';

interface DailyHoroscopesProps {
    dailyHoroscopeData?: any;
    onRefresh?: () => void;
}

const DailyHoroscopes: React.FC<DailyHoroscopesProps> = ({ dailyHoroscopeData, onRefresh }) => {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current && dailyHoroscopeData) {
            const cardWidth = 440; // 420px + 20px gap
            const newIndex = direction === 'left'
                ? Math.max(0, currentCardIndex - 1)
                : Math.min(dailyHoroscopeData.horoscopes.length - 1, currentCardIndex + 1);

            setCurrentCardIndex(newIndex);
            scrollContainerRef.current.scrollTo({
                left: newIndex * cardWidth,
                behavior: 'smooth'
            });
        }
    };

    if (!dailyHoroscopeData) {
        return (
            <div className="w-full py-16">
                <div className="flex flex-col items-center justify-center gap-6">
                    <div className="relative w-20 h-20">
                        <div className="absolute inset-0 rounded-full border-4 border-amber-500/20" />
                        <div className="absolute inset-0 rounded-full border-4 border-t-amber-500 animate-spin" />
                        <RefreshCw className="absolute inset-0 m-auto w-8 h-8 text-amber-400" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-12">
            {/* Horoscope Cards Carousel */}
            <div className="relative group/carousel">
                {/* Enhanced Scroll Buttons - Hidden on Mobile, shown on hover desktop */}
                <button
                    onClick={() => scroll('left')}
                    disabled={currentCardIndex === 0}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-slate-900/80 hover:bg-amber-500 backdrop-blur-md border border-white/10 rounded-full hidden md:flex items-center justify-center text-white transition-all hover:scale-110 shadow-2xl disabled:opacity-0 pointer-events-auto opacity-0 group-hover/carousel:opacity-100"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                    onClick={() => scroll('right')}
                    disabled={currentCardIndex === dailyHoroscopeData.horoscopes.length - 1}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-slate-900/80 hover:bg-amber-500 backdrop-blur-md border border-white/10 rounded-full hidden md:flex items-center justify-center text-white transition-all hover:scale-110 shadow-2xl disabled:opacity-0 pointer-events-auto opacity-0 group-hover/carousel:opacity-100"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Scrollable Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 md:px-0 py-4 scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {dailyHoroscopeData.horoscopes.map((card: any, index: number) => (
                        <div key={index} className="snap-center shrink-0 w-[85vw] md:w-[420px]" style={{ animationDelay: `${index * 100}ms` }}>
                            <HoroscopeCard {...card} />
                        </div>
                    ))}
                </div>

                {/* Progress Dots */}
                <div className="flex items-center justify-center gap-3 mt-8">
                    {dailyHoroscopeData.horoscopes.map((_: any, index: number) => (
                        <button
                            key={index}
                            onClick={() => {
                                setCurrentCardIndex(index);
                                if (scrollContainerRef.current) {
                                    scrollContainerRef.current.scrollTo({
                                        left: index * (window.innerWidth < 768 ? window.innerWidth * 0.85 : 440),
                                        behavior: 'smooth'
                                    });
                                }
                            }}
                            className={`transition-all duration-500 rounded-full ${index === currentCardIndex
                                    ? 'w-10 h-1.5 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                                    : 'w-1.5 h-1.5 bg-slate-700 hover:bg-slate-500'
                                }`}
                            aria-label={`Go to card ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Footer Info */}
            <div className="flex flex-col items-center gap-4 pt-4">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
                    Celestial Cycle: {dailyHoroscopeData.date}
                </p>
                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        className="inline-flex items-center gap-3 px-8 py-3 bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-white/5 transition-all hover:border-amber-500/30 active:scale-95"
                    >
                        <RefreshCw className="w-3 h-3" />
                        Re-Calibrate Daily Feed
                    </button>
                )}
            </div>
        </div>
    );
};

export default DailyHoroscopes;
