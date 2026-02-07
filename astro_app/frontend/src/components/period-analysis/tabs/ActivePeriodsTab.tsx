import { useState } from 'react';
import { DashboardOverviewResponse } from '../../../types/periodAnalysis';
import { Calendar, ChevronRight, ChevronDown, Clock, Star } from 'lucide-react';

import { DailyCalendarData } from '../InteractiveCalendar';

interface ActivePeriodsTabProps {
    data: DashboardOverviewResponse;
    selectedDate?: Date;
    onDateChange?: (date: Date) => void;
    dailyData?: Record<string, DailyCalendarData>;
}

const ActivePeriodsTab = ({ data }: ActivePeriodsTabProps) => {
    const { current, full_timeline } = data.dasha_info;
    const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>({});

    const toggleExpand = (id: string) => {
        setExpandedLevels(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Find Current Mahadasha Object
    // const currentMDLord = typeof current.current_mahadasha === 'string' ? current.current_mahadasha : current.current_mahadasha?.lord;
    // const currentMD = full_timeline.find(md => md.lord === currentMDLord) || full_timeline[0];

    const getDashaColor = (lord: string) => {
        // Map planets to colors (simplified)
        const colors: Record<string, string> = {
            Sun: 'text-[#F5A623] bg-[#F5A623]/10 border-[#F5A623]/20',
            Moon: 'text-[#EDEFF5] bg-[#EDEFF5]/10 border-[#EDEFF5]/20',
            Mars: 'text-[#E25555] bg-[#E25555]/10 border-[#E25555]/20',
            Mercury: 'text-[#2ED573] bg-[#2ED573]/10 border-[#2ED573]/20',
            Jupiter: 'text-[#F5A623] bg-[#F5A623]/10 border-[#F5A623]/20',
            Venus: 'text-[#EDEFF5] bg-[#EDEFF5]/10 border-[#EDEFF5]/20',
            Saturn: 'text-[#6D5DF6] bg-[#6D5DF6]/10 border-[#6D5DF6]/20',
            Rahu: 'text-[#A9B0C2] bg-[#A9B0C2]/10 border-[#A9B0C2]/20',
            Ketu: 'text-[#6F768A] bg-[#6F768A]/10 border-[#6F768A]/20',
        };
        return colors[lord] || 'text-[#A9B0C2] bg-[#FFFFFF]/05 border-[#FFFFFF]/10';
    };

    const renderDashaItem = (item: any, level: number, parentId: string = '') => {
        const id = parentId ? `${parentId}-${item.lord}-${item.start_date}` : `${item.lord}-${item.start_date}`;
        const isExpanded = expandedLevels[id];
        const isCurrent = item.is_current;

        // Determine if we have children to show
        const children = item.antardashas || item.pratyantardashas || item.sub_periods || [];
        const hasChildren = children.length > 0;

        return (
            <div key={id} className={`mb-2 ${level > 0 ? 'ml-6 border-l border-[#FFFFFF]/08 pl-4' : ''}`}>
                <div
                    onClick={() => hasChildren && toggleExpand(id)}
                    className={`
            flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all
            ${isCurrent ? 'bg-[#6D5DF6]/20 border-[#6D5DF6]/50 shadow-[0_0_15px_rgba(109,93,246,0.1)]' : 'bg-[#FFFFFF]/04 border-[#FFFFFF]/08 hover:border-[#FFFFFF]/20'}
          `}
                >
                    <div className="flex items-center gap-3">
                        {hasChildren && (
                            isExpanded ? <ChevronDown className="w-4 h-4 text-[#6F768A]" /> : <ChevronRight className="w-4 h-4 text-[#6F768A]" />
                        )}

                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${getDashaColor(item.lord)}`}>
                            {item.lord.slice(0, 2)}
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <span className={`font-medium ${isCurrent ? 'text-[#EDEFF5]' : 'text-[#A9B0C2]'}`}>
                                    {item.lord}
                                </span>
                                {isCurrent && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#6D5DF6]/20 text-[#6D5DF6] border border-[#6D5DF6]/30">
                                        Active
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-[#6F768A] mt-0.5">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {item.start_date} - {item.end_date}
                                </span>
                                {/* Duration could go here */}
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        {/* Score or Status placeholder */}
                        {isCurrent && <Clock className="w-4 h-4 text-[#6D5DF6] animate-pulse" />}
                    </div>
                </div>

                {/* Nested Children */}
                {isExpanded && hasChildren && (
                    <div className="mt-2 animate-in slide-in-from-top-2 duration-200">
                        {children.map((child: any) => renderDashaItem(child, level + 1, id))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Summary Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Mahadasha Card */}
                <div className="bg-[#FFFFFF]/04 p-6 rounded-xl border border-[#FFFFFF]/08 relative overflow-hidden group">
                    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                        {/* Huge Planet Icon Placeholder */}
                        <Star className="w-32 h-32 text-[#EDEFF5]" />
                    </div>
                    <h3 className="text-[#6F768A] text-xs font-bold uppercase tracking-wider mb-2">Mahadasha (Major)</h3>
                    <div className="text-3xl font-bold text-[#EDEFF5] mb-1">
                        {typeof current.current_mahadasha === 'string' ? current.current_mahadasha : current.current_mahadasha?.lord}
                    </div>
                    <div className="text-[#A9B0C2] text-sm mb-4">Focus Area: Career & Growth</div>
                    <div className="w-full bg-[#FFFFFF]/10 h-1.5 rounded-full overflow-hidden">
                        <div
                            className="bg-[#6D5DF6] h-full transition-all duration-500"
                            style={{ width: `${current.current_mahadasha?.progress_percent || 0}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-xs text-[#6F768A] mt-2">
                        <span>Started {current.current_mahadasha?.start_date}</span>
                        <span>Ends {current.current_mahadasha?.end_date}</span>
                    </div>
                </div>

                {/* Antardasha Card */}
                <div className="bg-[#FFFFFF]/04 p-6 rounded-xl border border-[#FFFFFF]/08">
                    <h3 className="text-[#6F768A] text-xs font-bold uppercase tracking-wider mb-2">Antardasha (Sub)</h3>
                    <div className="text-3xl font-bold text-[#EDEFF5] mb-1">
                        {typeof current.current_antardasha === 'string' ? current.current_antardasha : current.current_antardasha?.lord}
                    </div>
                    <div className="text-[#A9B0C2] text-sm mb-4">Sub-influence: Health</div>
                    <div className="w-full bg-[#FFFFFF]/10 h-1.5 rounded-full overflow-hidden">
                        <div
                            className="bg-[#2ED573] h-full transition-all duration-500"
                            style={{ width: `${current.current_antardasha?.progress_percent || 0}%` }}
                        ></div>
                    </div>
                </div>

                {/* Pratyantardasha Card */}
                <div className="bg-[#FFFFFF]/04 p-6 rounded-xl border border-[#FFFFFF]/08">
                    <h3 className="text-[#6F768A] text-xs font-bold uppercase tracking-wider mb-2">Pratyantar (Micro)</h3>
                    <div className="text-3xl font-bold text-[#EDEFF5] mb-1">
                        {typeof current.current_pratyantardasha === 'string' ? current.current_pratyantardasha : current.current_pratyantardasha?.lord}
                    </div>
                    <div className="text-[#A9B0C2] text-sm mb-4">Daily Energy: High</div>
                    <div className="w-full bg-[#FFFFFF]/10 h-1.5 rounded-full overflow-hidden">
                        <div
                            className="bg-[#F5A623] h-full transition-all duration-500"
                            style={{ width: `${current.current_pratyantardasha?.progress_percent || 0}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Detailed Hierarchy */}
            <div className="bg-[#FFFFFF]/04 rounded-xl border border-[#FFFFFF]/08 p-6">
                <h3 className="text-lg font-bold text-[#EDEFF5] mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#6D5DF6]" />
                    Detailed Timeline
                </h3>

                {/* Render only current MD and surroundings initially or all */}
                {full_timeline.map((md: any) => renderDashaItem(md, 0))}
            </div>
        </div>
    );
};

export default ActivePeriodsTab;
