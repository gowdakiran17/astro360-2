import { useEffect, useState } from 'react';

const todayKey = () => new Date().toISOString().split('T')[0];

const yesterdayKey = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

export const useDailyStreak = () => {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const today = todayKey();
    const lastVisit = localStorage.getItem('last_visit_date');
    const currentStreak = parseInt(localStorage.getItem('user_streak') || '0');

    if (lastVisit === today) {
      setStreak(currentStreak || 1);
      return;
    }

    if (lastVisit === yesterdayKey()) {
      const next = (currentStreak || 0) + 1;
      localStorage.setItem('user_streak', next.toString());
      localStorage.setItem('last_visit_date', today);
      setStreak(next);
      return;
    }

    localStorage.setItem('user_streak', '1');
    localStorage.setItem('last_visit_date', today);
    setStreak(1);
  }, []);

  return { streak };
};

