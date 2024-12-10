import React from 'react';
import { CheckCircle2, Circle, Trophy } from 'lucide-react';
import { Habit } from '../types/habit';
import { getProgressPercentage, getFrequencyLabel } from '../utils/habitUtils';

interface HabitCardProps {
  habit: Habit;
  onComplete: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onComplete }) => {
  const progress = getProgressPercentage(habit.progress, habit.target);
  const frequencyLabel = getFrequencyLabel(habit.frequency);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{habit.title}</h3>
          {habit.description && (
            <p className="text-gray-600 text-sm mt-1">{habit.description}</p>
          )}
        </div>
        <button
          onClick={onComplete}
          className="text-green-500 hover:text-green-600 transition-colors"
        >
          {habit.progress >= habit.target ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{frequencyLabel}</span>
          <span>{habit.progress}/{habit.target}</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 rounded-full h-2 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-600 capitalize">
            {habit.frequency}
          </span>
          <div className="flex items-center text-yellow-500">
            <Trophy className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">{habit.streak} streak</span>
          </div>
        </div>
      </div>
    </div>
  );
};