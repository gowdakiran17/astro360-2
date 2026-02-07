
import { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';

const DailyStreak = () => {
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const lastVisit = localStorage.getItem('last_visit_date');
        const currentStreak = parseInt(localStorage.getItem('user_streak') || '0');

        if (lastVisit === today) {
            // Already visited today
            setStreak(currentStreak);
        } else {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (lastVisit === yesterdayStr) {
                // Consecutive day
                const newStreak = currentStreak + 1;
                setStreak(newStreak);
                localStorage.setItem('user_streak', newStreak.toString());
            } else {
                // Streak broken or new user (unless it's the very first visit ever)
                // If lastVisit exists but isn't yesterday, reset to 1
                // If no lastVisit, start at 1
                setStreak(1);
                localStorage.setItem('user_streak', '1');
            }
            localStorage.setItem('last_visit_date', today);
        }
    }, []);

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full border border-orange-100 shadow-sm">
            <Flame className="w-4 h-4 fill-orange-500" />
            <span className="text-sm font-bold">{streak} Day Streak</span>
        </div>
    );
};

export default DailyStreak;
