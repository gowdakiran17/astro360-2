import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight, Crown, Sparkles, Moon, Coins } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay } from 'date-fns';

export interface DailyCalendarData {
    score: number;
    events?: any[];
    quality?: string;
}

interface InteractiveCalendarProps {
    currentDate: Date;
    onDateSelect: (date: Date) => void;
    dailyData?: Record<string, DailyCalendarData>;
}

const InteractiveCalendar = ({ currentDate, onDateSelect, dailyData = {} }: InteractiveCalendarProps) => {
    const [viewDate, setViewDate] = React.useState(currentDate);

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(viewDate),
        end: endOfMonth(viewDate),
    });

    // Calculate stats for the view
    const monthStats = useMemo(() => {
        let bestDay = { date: '', score: 0 };
        Object.entries(dailyData).forEach(([date, data]) => {
            if (data.score > bestDay.score && isSameMonth(new Date(date), viewDate)) {
                bestDay = { date, score: data.score };
            }
        });
        return { bestDay };
    }, [dailyData, viewDate]);

    const startDay = getDay(startOfMonth(viewDate)); // 0 = Sunday
    const emptyDays = Array(startDay).fill(null);

    const handlePrevMonth = () => setViewDate(subMonths(viewDate, 1));
    const handleNextMonth = () => setViewDate(addMonths(viewDate, 1));



    const getScoreBg = (score: number) => {
        if (score >= 80) return 'bg-[#2ED573]/20 text-[#2ED573] ring-1 ring-[#2ED573]/50';
        if (score >= 60) return 'bg-[#2ED573]/10 text-[#2ED573] ring-1 ring-[#2ED573]/30';
        if (score >= 40) return 'bg-[#F5A623]/20 text-[#F5A623] ring-1 ring-[#F5A623]/50';
        return 'bg-[#E25555]/20 text-[#E25555] ring-1 ring-[#E25555]/50';
    };

    const getEventIcon = (events: any[] = [], isBestDay: boolean) => {
        if (isBestDay) return <Crown className="w-3 h-3 text-[#F5A623] fill-[#F5A623] animate-pulse" />;

        // Check for specific keywords in event names
        const eventNames = events.map(e => (e.name || '').toLowerCase()).join(' ');

        if (eventNames.includes('finance') || eventNames.includes('wealth') || eventNames.includes('money')) {
            return <Coins className="w-3 h-3 text-[#F5A623] fill-[#F5A623]" />;
        }
        if (eventNames.includes('moon') || eventNames.includes('purnima') || eventNames.includes('amavasya')) {
            return <Moon className="w-3 h-3 text-[#6D5DF6] fill-[#6D5DF6]" />;
        }
        if (events.length > 0) {
            return <Sparkles className="w-3 h-3 text-[#6D5DF6]" />;
        }
        return null;
    };

    return (
        <div className="bg-[#11162A] rounded-xl border border-[#FFFFFF]/08 p-4 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-[#EDEFF5] text-lg font-display">
                    {format(viewDate, 'MMMM yyyy')}
                </h3>
                <div className="flex gap-2">
                    <button onClick={handlePrevMonth} className="p-1.5 hover:bg-white/10 rounded-full text-[#A9B0C2] hover:text-white transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={handleNextMonth} className="p-1.5 hover:bg-white/10 rounded-full text-[#A9B0C2] hover:text-white transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 mb-4 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <span key={i} className="text-[10px] uppercase font-bold text-[#6F768A] tracking-wider">{d}</span>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-y-4 gap-x-2 flex-1 place-items-center">
                {emptyDays.map((_, i) => <div key={`empty-${i}`} />)}

                {daysInMonth.map((date) => {
                    const dateKey = format(date, 'yyyy-MM-dd');
                    const dayData = dailyData[dateKey];
                    const score = dayData?.score;
                    const events = dayData?.events || [];

                    const isSelected = isSameDay(date, currentDate);
                    const isToday = isSameDay(date, new Date());
                    const isBestDay = dateKey === monthStats.bestDay.date;
                    const isCurrentMonth = isSameMonth(date, viewDate);

                    return (
                        <div key={dateKey} className="relative group w-full flex justify-center">
                            <button
                                onClick={() => {
                                    onDateSelect(date);
                                    if (!isCurrentMonth) setViewDate(date);
                                }}
                                className={`
                                    w-10 h-10 rounded-full flex items-center justify-center relative transition-all duration-300
                                    ${isSelected
                                        ? 'bg-[#6D5DF6] shadow-lg shadow-[#6D5DF6]/50 ring-2 ring-[#6D5DF6] ring-offset-2 ring-offset-[#0B0F1A] z-10 scale-110 text-white font-bold'
                                        : score !== undefined
                                            ? getScoreBg(score)
                                            : 'hover:bg-white/5 bg-transparent text-[#6F768A]'}
                                    ${!isCurrentMonth ? 'opacity-30 grayscale' : ''}
                                `}
                            >
                                <span className={`text-xs ${isToday && !isSelected ? 'font-bold underline underline-offset-4 decoration-[#6D5DF6]' : ''}`}>
                                    {format(date, 'd')}
                                </span>

                                {/* Floating Icon (Crown/Coin etc) */}
                                {(isBestDay || events.length > 0) && !isSelected && (
                                    <div className="absolute -top-1.5 -right-1.5 bg-[#0B0F1A] rounded-full p-0.5 shadow-sm border border-white/10">
                                        {getEventIcon(events, isBestDay)}
                                    </div>
                                )}
                            </button>

                            {/* Rich Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[180px] p-3 bg-[#0B0F1A]/95 backdrop-blur-md text-[#EDEFF5] text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-30 shadow-2xl border border-[#6D5DF6]/30 translate-y-2 group-hover:translate-y-0">
                                {score !== undefined ? (
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-0.5">
                                            <span className="font-bold text-[#EDEFF5]">{format(date, 'MMM d, yyyy')}</span>
                                            <span className={`font-bold text-xs ${score >= 75 ? 'text-[#2ED573]' : score >= 50 ? 'text-[#F5A623]' : 'text-[#E25555]'}`}>
                                                Score: {score}
                                            </span>
                                        </div>

                                        {isBestDay && (
                                            <div className="flex items-center gap-1.5 text-[#F5A623] bg-[#F5A623]/10 p-1 rounded-lg border border-[#F5A623]/20">
                                                <Crown className="w-3 h-3" />
                                                <span className="font-bold">Crown Day (Best)</span>
                                            </div>
                                        )}

                                        {events.length > 0 ? (
                                            <div className="flex flex-col gap-1">
                                                {events.slice(0, 3).map((e: any, i: number) => (
                                                    <div key={i} className="flex items-start gap-1.5 text-[#A9B0C2]">
                                                        <div className="min-w-[4px] h-[4px] rounded-full bg-[#6D5DF6] mt-1.5"></div>
                                                        <span>{e.name}</span>
                                                    </div>
                                                ))}
                                                {events.length > 3 && <span className="text-[#6F768A] pl-2">+{events.length - 3} more</span>}
                                            </div>
                                        ) : (
                                            <span className="text-[#6F768A] italic">No major events</span>
                                        )}
                                    </div>
                                ) : 'Click to Analyze'}
                                {/* Arrow */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#0B0F1A]/95"></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Enhanced Legend */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-6 text-[10px] text-[#A9B0C2] border-t border-white/10 pt-4">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#2ED573]/20 ring-1 ring-[#2ED573]/50"></div>
                    <span>Excellent (&gt;80)</span>
                </div>
                <div className="flex items-center gap-2">
                    <Crown className="w-3 h-3 text-[#F5A623] fill-[#F5A623]" />
                    <span>Crown Day</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#2ED573]/10 ring-1 ring-[#2ED573]/30"></div>
                    <span>Good (60-80)</span>
                </div>
                <div className="flex items-center gap-2">
                    <Coins className="w-3 h-3 text-[#F5A623] fill-[#F5A623]" />
                    <span>Prosperity</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F5A623]/20 ring-1 ring-[#F5A623]/50"></div>
                    <span>Average (40-60)</span>
                </div>
                <div className="flex items-center gap-2">
                    <Moon className="w-3 h-3 text-[#6D5DF6] fill-[#6D5DF6]" />
                    <span>Moon Phase</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E25555]/20 ring-1 ring-[#E25555]/50"></div>
                    <span>Caution (&lt;40)</span>
                </div>
                <div className="flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-[#6D5DF6]" />
                    <span>Special Event</span>
                </div>
            </div>
        </div>
    );
};

export default InteractiveCalendar;
