import React from 'react';
import { Calendar, Clock, ChevronRight, ChevronDown } from 'lucide-react';

interface Antardasha {
    lord: string;
    start_date: string;
    duration_years: number;
}

interface Mahadasha {
    lord: string;
    start_date: string;
    end_date: string;
    duration_years: number;
}

interface TimelineItem {
    mahadasha: Mahadasha;
    antardashas: Antardasha[];
}

interface DashaTimelineProps {
    timeline: TimelineItem[];
    currentPeriod: {
        mahadasha: string;
        antardasha: string;
    };
}

const DashaTimeline: React.FC<DashaTimelineProps> = ({ timeline, currentPeriod }) => {
    const [expandedMd, setExpandedMd] = React.useState<string | null>(currentPeriod.mahadasha);

    return (
        <div className="space-y-4">
            {timeline.map((item, idx) => {
                const isCurrentMd = item.mahadasha.lord === currentPeriod.mahadasha;
                const isExpanded = expandedMd === item.mahadasha.lord;

                return (
                    <div
                        key={item.mahadasha.lord + idx}
                        className={`rounded-2xl border transition-all duration-300 ${isCurrentMd
                                ? 'border-[#6D5DF6]/50 bg-[#6D5DF6]/5 shadow-lg shadow-[#6D5DF6]/10'
                                : 'border-[#FFFFFF]/08 bg-[#FFFFFF]/04'
                            }`}
                    >
                        {/* Mahadasha Header */}
                        <div
                            onClick={() => setExpandedMd(isExpanded ? null : item.mahadasha.lord)}
                            className="p-5 flex items-center justify-between cursor-pointer group"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${isCurrentMd ? 'bg-[#6D5DF6] text-[#EDEFF5]' : 'bg-[#FFFFFF]/08 text-[#6F768A]'
                                    }`}>
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-bold text-[#EDEFF5]">{item.mahadasha.lord} Mahadasha</h3>
                                        {isCurrentMd && (
                                            <span className="px-2 py-0.5 bg-[#6D5DF6] text-[#EDEFF5] text-[10px] uppercase font-bold rounded-full tracking-wider">
                                                Running
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-[#6F768A]">
                                        {item.mahadasha.start_date} — {item.mahadasha.end_date}
                                        <span className="mx-2">•</span>
                                        {item.mahadasha.duration_years} years
                                    </p>
                                </div>
                            </div>
                            <div className="text-[#6F768A] group-hover:text-[#EDEFF5] transition-colors">
                                {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                            </div>
                        </div>

                        {/* Antardashas List */}
                        {isExpanded && (
                            <div className="px-5 pb-5 animate-in slide-in-from-top-2 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-4 border-t border-[#FFFFFF]/08">
                                    {item.antardashas.map((ad, adIdx) => {
                                        const isCurrentAd = isCurrentMd && ad.lord === currentPeriod.antardasha;

                                        return (
                                            <div
                                                key={ad.lord + adIdx}
                                                className={`p-4 rounded-xl border transition-all ${isCurrentAd
                                                        ? 'border-[#2ED573]/50 bg-[#2ED573]/10'
                                                        : 'border-[#FFFFFF]/04 bg-[#FFFFFF]/04 hover:bg-[#FFFFFF]/08'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-bold text-[#EDEFF5]">{ad.lord}</span>
                                                    {isCurrentAd && (
                                                        <span className="flex h-2 w-2 rounded-full bg-[#2ED573] animate-pulse" />
                                                    )}
                                                </div>
                                                <div className="flex items-center text-xs text-[#6F768A] gap-1.5">
                                                    <Clock className="w-3 h-3" />
                                                    <span>Starts {ad.start_date}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default DashaTimeline;
