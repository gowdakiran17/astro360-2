import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import { GitCommit } from 'lucide-react';

// interface LifePathTabProps {
//     // Mocking data prop for now until we hook up the API fully
//     // or we can invoke it if passed. 
//     // Ideally this component fetches its own data or receives it.
// }

import { DailyCalendarData } from '../InteractiveCalendar';
import { DashboardOverviewResponse } from '../../../types/periodAnalysis';

interface LifePathTabProps {
    data: DashboardOverviewResponse;
    selectedDate?: Date;
    onDateChange?: (date: Date) => void;
    dailyData?: Record<string, DailyCalendarData>;
}

const LifePathTab = ({ data: _overviewData }: LifePathTabProps) => {
    // Mock Data mimicking the backend structure
    const chartData = [
        { year: '2026', score: 65, dasha: 'Jupiter', transit: 'Saturn in Pisces' },
        { year: '2027', score: 72, dasha: 'Jupiter', transit: 'Jupiter in Leo' },
        { year: '2028', score: 60, dasha: 'Saturn', transit: 'Saturn in Aries' },
        { year: '2029', score: 55, dasha: 'Saturn', transit: 'Rahu in Virgo' },
        { year: '2030', score: 45, dasha: 'Saturn', transit: 'Mars Retrograde' },
        { year: '2031', score: 50, dasha: 'Saturn', transit: 'Jupiter in Libra' },
        { year: '2032', score: 80, dasha: 'Mercury', transit: 'Exalted Sun' },
    ];

    // Gradient definitions
    const gradientOffset = () => {
        const dataMax = Math.max(...chartData.map((i) => i.score));
        const dataMin = Math.min(...chartData.map((i) => i.score));

        if (dataMax <= 0) {
            return 0;
        }
        if (dataMin >= 0) {
            return 1;
        }

        return dataMax / (dataMax - dataMin);
    };

    const off = gradientOffset();

    const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
        if (active && payload && payload.length) {
            const d = payload[0].payload;
            return (
                <div className="bg-[#0B0F1A] border border-[#FFFFFF]/08 p-4 rounded-lg shadow-xl z-50 max-w-xs">
                    <p className="text-[#EDEFF5] font-bold text-lg mb-1">{d.year}</p>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-[#A9B0C2]">Life Score:</span>
                            <span className={`font-bold ${d.score > 60 ? 'text-[#2ED573]' : 'text-[#F5A623]'}`}>{d.score}/100</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#A9B0C2]">Dasha Ruler:</span>
                            <span className="text-[#6D5DF6]">{d.dasha}</span>
                        </div>
                        <div className="pt-2 border-t border-[#FFFFFF]/10 mt-2">
                            <span className="text-xs text-[#6F768A] block mb-1">Key Transits</span>
                            <span className="text-[#A9B0C2] text-xs italic">{d.transit}</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#6D5DF6]/20 to-[#11162A] p-8 rounded-2xl border border-[#6D5DF6]/30 relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-[#EDEFF5] mb-2">Your Cosmic Narrative</h2>
                    <p className="text-[#A9B0C2] text-lg max-w-3xl">
                        "You are entering a chapter of <span className="text-[#EDEFF5] font-bold">Resilient Growth</span>.
                        While Saturn demands discipline in 2028, the upcoming Mercury period in 2032 signals a major breakthrough."
                    </p>
                </div>
                {/* Background decoration */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#6D5DF6]/20 rounded-full blur-3xl"></div>
            </div>

            {/* Timeline Chart */}
            <div className="bg-[#FFFFFF]/04 p-6 rounded-xl border border-[#FFFFFF]/08">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-[#EDEFF5] flex items-center gap-2">
                        <GitCommit className="w-5 h-5 text-[#6D5DF6]" />
                        Pro Life Path (5-Year Trend)
                    </h3>
                    <div className="flex gap-4 text-xs font-medium">
                        <span className="flex items-center gap-1 text-[#2ED573]"><div className="w-2 h-2 rounded-full bg-[#2ED573]"></div> Peak Performance</span>
                        <span className="flex items-center gap-1 text-[#F5A623]"><div className="w-2 h-2 rounded-full bg-[#F5A623]"></div> Challenge / Growth</span>
                    </div>
                </div>

                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset={off} stopColor="#2ED573" stopOpacity={0.3} />
                                    <stop offset={off} stopColor="#F5A623" stopOpacity={0.3} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                            <XAxis
                                dataKey="year"
                                stroke="#6F768A"
                                tick={{ fill: '#6F768A' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                domain={[0, 100]}
                                hide
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6D5DF6', strokeWidth: 1, strokeDasharray: '5 5' }} />

                            <Area
                                type="monotone"
                                dataKey="score"
                                stroke="#6D5DF6"
                                fill="url(#splitColor)"
                                strokeWidth={3}
                                animationDuration={1500}
                            />

                            {/* Event Markers (Mock) */}
                            <ReferenceLine x="2028" stroke="#E25555" strokeDasharray="3 3" label={{ position: 'top', value: 'Saturn Return', fill: '#E25555', fontSize: 12 }} />
                            <ReferenceLine x="2032" stroke="#2ED573" strokeDasharray="3 3" label={{ position: 'top', value: 'Career Peak', fill: '#2ED573', fontSize: 12 }} />

                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Predictions Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "Career & Wealth", prob: "High", date: "Late 2027", desc: "Promotion or new business venture indicated by Jupiter transit." },
                    { title: "Relationships", prob: "Medium", date: "Mid 2029", desc: "Stability returns after a period of fluctuation." },
                    { title: "Relocation", prob: "Low", date: "2030", desc: "Minor travel indicated, but permanent move unlikely." }
                ].map((card, i) => (
                    <div key={i} className="bg-[#FFFFFF]/04 p-6 rounded-xl border border-[#FFFFFF]/08 hover:border-[#6D5DF6]/50 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="font-bold text-[#EDEFF5]">{card.title}</h4>
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase
                                ${card.prob === 'High' ? 'bg-[#2ED573]/20 text-[#2ED573]' : 'bg-[#FFFFFF]/10 text-[#A9B0C2]'}
                            `}>{card.prob} Probability</span>
                        </div>
                        <p className="text-2xl font-bold text-[#EDEFF5] mb-1">{card.date}</p>
                        <p className="text-sm text-[#A9B0C2]">{card.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LifePathTab;
