
import { useState, useEffect } from 'react';
import { Smile, Frown, Meh, Activity } from 'lucide-react';

const MoodLogger = () => {
    const [mood, setMood] = useState<number | null>(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const stored = localStorage.getItem(`mood_${today}`);
        if (stored) {
            setMood(parseInt(stored));
            setSaved(true);
        }
    }, []);

    const handleSave = (selectedMood: number) => {
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem(`mood_${today}`, selectedMood.toString());
        setMood(selectedMood);
        setSaved(true);
        
        // Optional: Save to backend here
    };

    const moods = [
        { val: 1, icon: Frown, label: "Rough", color: "text-red-500 bg-red-50 border-red-200" },
        { val: 2, icon: Meh, label: "Okay", color: "text-amber-500 bg-amber-50 border-amber-200" },
        { val: 3, icon: Smile, label: "Great", color: "text-green-500 bg-green-50 border-green-200" },
        { val: 4, icon: Activity, label: "Energized", color: "text-indigo-500 bg-indigo-50 border-indigo-200" }
    ];

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">How are you feeling today?</h3>
            
            {saved ? (
                <div className="text-center py-4 animate-in fade-in zoom-in duration-300">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-3">
                        {(() => {
                            const m = moods.find(m => m.val === mood);
                            const Icon = m?.icon || Smile;
                            return <Icon className={`w-8 h-8 ${m?.color.split(' ')[0]}`} />;
                        })()}
                    </div>
                    <p className="text-slate-600 font-medium">Mood Logged!</p>
                    <button 
                        onClick={() => setSaved(false)}
                        className="text-xs text-slate-400 mt-2 hover:text-indigo-600"
                    >
                        Change
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-4 gap-3">
                    {moods.map((m) => (
                        <button
                            key={m.val}
                            onClick={() => handleSave(m.val)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all hover:scale-105 ${m.color} border-transparent hover:border-current`}
                        >
                            <m.icon className="w-6 h-6" />
                            <span className="text-xs font-bold">{m.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MoodLogger;
