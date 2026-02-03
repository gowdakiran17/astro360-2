import React from 'react';
import { ChevronRight, Clock } from 'lucide-react';

interface TimelineEvent {
    date: string;
    event: string;
    impact: 'High' | 'Medium' | 'Low';
}

interface TransitTimelineProps {
    story: string;
    events: TimelineEvent[];
    loading: boolean;
}

const TransitTimeline: React.FC<TransitTimelineProps> = ({ story, events, loading }) => {
    return (
        <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-serif text-white">Upcoming 30 Days</h2>
                <div className="flex items-center gap-2 text-xs font-black text-amber-500 uppercase tracking-widest border border-amber-500/30 px-3 py-1.5 rounded-full">
                    <Clock className="w-3 h-3" />
                    Timeline Story
                </div>
            </div>

            {/* AI Narrative Box */}
            <div className="mb-10 p-6 rounded-2xl bg-[#0F1426] border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[50px] rounded-full" />

                {loading ? (
                    <div className="space-y-2 animate-pulse">
                        <div className="h-4 bg-white/10 rounded w-full" />
                        <div className="h-4 bg-white/10 rounded w-5/6" />
                    </div>
                ) : (
                    <p className="text-slate-300 leading-relaxed text-sm md:text-base italic font-serif relative z-10">
                        "{story}"
                    </p>
                )}
            </div>

            {/* Timeline Events */}
            <div className="relative border-l-2 border-white/5 ml-4 md:ml-8 space-y-10 py-4">
                {events.map((event, index) => (
                    <div key={index} className="relative pl-8 group">
                        {/* Dot */}
                        <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-[#030014] ${event.impact === 'High' ? 'bg-red-500' :
                            event.impact === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'
                            }`} />

                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest w-24">
                                {event.date}
                            </span>
                            <div className="flex-1 p-4 rounded-xl bg-white/5 border border-white/5 group-hover:border-white/10 transition-colors">
                                <span className="text-sm font-bold text-slate-200">{event.event}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="mt-8 flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors ml-auto">
                View Full Almanac <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default TransitTimeline;
