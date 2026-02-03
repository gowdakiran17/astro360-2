import { Sun, Moon } from 'lucide-react';

interface AlignmentPracticeProps {
    practices: {
        morning: string;
        afternoon: string;
        evening: string;
    };
    loading?: boolean;
}

const AlignmentPractice = ({ practices, loading }: AlignmentPracticeProps) => {

    if (loading) return null;

    // Fallback if empty (should come from AI)
    const safePractices = practices ? practices : {
        morning: "Set a clear intention for the day",
        afternoon: "Focus on your most impactful task",
        evening: "Disconnect and reflect"
    };

    return (
        <div className="bg-[#0A0F1E] border border-white/5 rounded-3xl p-8 md:p-10">
            <h3 className="text-xl font-serif text-white mb-8">🧘 Today's Alignment Practice</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Morning */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-orange-300 text-sm font-bold uppercase tracking-wider">
                        <Sun className="w-5 h-5" /> Morning
                    </div>
                    <p className="text-base text-slate-200 leading-relaxed border-l-2 border-orange-500/30 pl-4">
                        {safePractices.morning}
                    </p>
                </div>

                {/* Afternoon */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-yellow-300 text-sm font-bold uppercase tracking-wider">
                        <Sun className="w-5 h-5 text-yellow-500" /> Afternoon
                    </div>
                    <p className="text-base text-slate-200 leading-relaxed border-l-2 border-yellow-500/30 pl-4">
                        {safePractices.afternoon}
                    </p>
                </div>

                {/* Evening */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-violet-300 text-sm font-bold uppercase tracking-wider">
                        <Moon className="w-5 h-5" /> Evening
                    </div>
                    <p className="text-base text-slate-200 leading-relaxed border-l-2 border-violet-500/30 pl-4">
                        {safePractices.evening}
                    </p>
                </div>

            </div>
        </div>
    );
};

export default AlignmentPractice;
