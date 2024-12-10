import React from 'react';
import { Trophy, Target, Calendar, Flame } from 'lucide-react';
import { Habit } from '../types/habit';
import { getProgressPercentage } from '../utils/habitUtils';

interface StatsProps {
  habits: Habit[];
}

export const Stats: React.FC<StatsProps> = ({ habits }) => {
  const totalHabits = habits.length;
  const completedToday = habits.filter(h => 
    h.completedDates.some(date => 
      date.toDateString() === new Date().toDateString()
    )
  ).length;
  const longestStreak = Math.max(...habits.map(h => h.streak), 0);
  const averageProgress = habits.length > 0
    ? Math.round(habits.reduce((acc, h) => acc + getProgressPercentage(h.progress, h.target), 0) / habits.length)
    : 0;

  const stats = [
    { icon: Target, label: 'Total Habits', value: totalHabits },
    { icon: Calendar, label: 'Completed Today', value: completedToday },
    { icon: Flame, label: 'Longest Streak', value: longestStreak },
    { icon: Trophy, label: 'Average Progress', value: `${averageProgress}%` },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map(({ icon: Icon, label, value }) => (
        <div key={label} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icon className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-sm text-gray-600">{label}</span>
            </div>
            <span className="text-xl font-semibold text-gray-800">{value}</span>
          </div>
        </div>
      ))}
    </div>
  );
};