import { Calendar, ChevronRight } from 'lucide-react';

interface TimelineEvent {
    date: string;
    event: string;
    impact: 'High' | 'Medium' | 'Low';
    description?: string;
}

interface TimelineStoryProps {
    story: string;
    events: TimelineEvent[];
    loading?: boolean;
}

const TimelineStory = ({ story, events, loading }: TimelineStoryProps) => {

    // Helper to get color by impact
    const getImpactColor = (impact: string) => {
        switch (impact) {
            case 'High': return 'text-red-400 bg-red-400/10 border-red-400/20';
            case 'Medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            default: return 'text-blue-300 bg-blue-300/10 border-blue-300/20';
        }
    };

    if (loading) return <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />;

    return (
        <div className="bg-[#0A0F1E] border border-white/5 rounded-3xl overflow-hidden">
            <div className="p-6 md:p-8">

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-xl font-serif text-white">Upcoming 30 Days</h3>
                        <p className="text-slate-400 text-sm uppercase tracking-wider font-bold">Timeline Story</p>
                    </div>
                </div>

                {/* Narrative */}
                <div className="mb-8 relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-500 to-transparent rounded-full" />
                    <p className="pl-6 text-slate-200/90 text-lg leading-relaxed italic border-l-0 font-medium">
                        "{story || "The cosmic currents are shifting. Use this time to prepare for upcoming changes in your sector of career and relationships."}"
                    </p>
                </div>

                {/* Events List */}
                <div className="space-y-4">
                    {events.map((evt, i) => (
                        <div key={i} className="flex gap-4 items-center group cursor-pointer hover:bg-white/5 p-3 rounded-xl transition-colors">
                            {/* Date Bubble */}
                            <div className="flex-shrink-0 w-20 h-20 bg-[#151c2f] rounded-xl flex flex-col items-center justify-center border border-white/5 group-hover:border-white/10">
                                <span className="text-sm text-slate-400 font-bold uppercase">{evt.date.split(' ')[0]}</span>
                                <span className="text-2xl font-bold text-white">{evt.date.split(' ')[1]}</span>
                            </div>

                            {/* Event Info */}
                            <div className="flex-grow">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getImpactColor(evt.impact)}`}>
                                        {evt.impact}
                                    </span>
                                    <h4 className="font-bold text-white text-lg">{evt.event}</h4>
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    {evt.description || "Significant planetary movement affecting your chart."}
                                </p>
                            </div>

                            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-6 border-t border-white/5 text-center">
                    <button className="text-sm text-amber-400 hover:text-white transition-colors font-medium">
                        View Full Monthly Calendar →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TimelineStory;
