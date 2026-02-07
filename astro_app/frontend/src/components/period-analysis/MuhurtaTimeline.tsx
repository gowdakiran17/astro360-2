import { Clock, ArrowRight } from 'lucide-react';
import type { Muhurta } from '../../types/periodAnalysis';

interface MuhurtaTimelineProps {
    muhuratas: Muhurta[];
}

const MuhurtaTimeline = ({ muhuratas = [] }: MuhurtaTimelineProps) => {
    // Filter and sort muhuratas
    const timelineItems = [...muhuratas]
        .sort((a, b) => {
            // Simple string compare for HH:MM format works for same day
            return a.start_time.localeCompare(b.start_time);
        });

    const getQualityColor = (quality: string) => {
        switch (quality) {
            case 'Excellent': return 'bg-[#2ED573] text-[#2ED573]';
            case 'Good': return 'bg-[#6D5DF6] text-[#6D5DF6]';
            case 'Average': return 'bg-[#F5A623] text-[#F5A623]';
            case 'Poor': return 'bg-[#F5A623] text-[#F5A623]';
            case 'Bad':
            case 'Avoid': return 'bg-[#E25555] text-[#E25555]';
            default: return 'bg-[#6F768A] text-[#A9B0C2]';
        }
    };

    const getBarColor = (quality: string) => {
        switch (quality) {
            case 'Excellent': return 'bg-[#2ED573]';
            case 'Good': return 'bg-[#6D5DF6]';
            case 'Average': return 'bg-[#F5A623]';
            case 'Poor': return 'bg-[#F5A623]';
            case 'Bad':
            case 'Avoid': return 'bg-[#E25555]';
            default: return 'bg-[#6F768A]';
        }
    };

    return (
        <div className="glass-card p-6 h-full bg-[#11162A]/60 backdrop-blur-xl rounded-[2rem] border border-[#FFFFFF]/08">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#6D5DF6]/10 rounded-lg">
                        <Clock className="w-5 h-5 text-[#6D5DF6]" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-[#EDEFF5] font-display">Muhurta Timeline</h3>
                        <p className="text-xs text-[#6F768A]"> auspicious timings breakdown</p>
                    </div>
                </div>
            </div>

            <div className="relative pl-4 border-l border-[#FFFFFF]/08 space-y-6">
                {timelineItems.length === 0 ? (
                    <div className="text-center text-[#6F768A] py-8 italic">
                        No specific muhuratas calculated for this day.
                    </div>
                ) : (
                    timelineItems.map((item, index) => (
                        <div key={index} className="relative group">
                            {/* Dot on timeline */}
                            <div className={`absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-[#0B0F1A] ${getBarColor(item.quality)}`}></div>

                            <div className="bg-[#FFFFFF]/04 border border-[#FFFFFF]/08 rounded-xl p-3 hover:bg-[#FFFFFF]/06 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-[#EDEFF5]">{item.name}</span>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${getQualityColor(item.quality)} bg-opacity-20`}>
                                        {item.quality}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-[#A9B0C2]">
                                    <span className="font-mono bg-[#FFFFFF]/05 px-1.5 py-0.5 rounded">{item.start_time}</span>
                                    <ArrowRight className="w-3 h-3 text-[#6F768A]" />
                                    <span className="font-mono bg-[#FFFFFF]/05 px-1.5 py-0.5 rounded">{item.end_time}</span>
                                    <span className="text-[#6F768A] ml-2">• {item.type}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MuhurtaTimeline;
