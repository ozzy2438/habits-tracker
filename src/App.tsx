import React from 'react';
import { Layout } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Habit, HabitFormData } from './types/habit';
import { HabitCard } from './components/HabitCard';
import { HabitForm } from './components/HabitForm';
import { Stats } from './components/Stats';
import { generateId, calculateStreak } from './utils/habitUtils';

function App() {
  const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);

  const handleAddHabit = (data: HabitFormData) => {
    const newHabit: Habit = {
      ...data,
      id: generateId(),
      progress: 0,
      streak: 0,
      createdAt: new Date(),
      completedDates: [],
    };
    setHabits([...habits, newHabit]);
  };

  const handleCompleteHabit = (habitId: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const today = new Date();
        const isAlreadyCompletedToday = habit.completedDates.some(
          date => date.toDateString() === today.toDateString()
        );

        if (!isAlreadyCompletedToday) {
          const updatedCompletedDates = [...habit.completedDates, today];
          return {
            ...habit,
            progress: habit.progress + 1,
            completedDates: updatedCompletedDates,
            streak: calculateStreak(updatedCompletedDates, habit.frequency),
          };
        }
      }
      return habit;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Layout className="w-8 h-8 text-green-500 mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">Habit Tracker</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <Stats habits={habits} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="grid gap-6">
                {habits.map(habit => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onComplete={() => handleCompleteHabit(habit.id)}
                  />
                ))}
                {habits.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <p className="text-gray-500">No habits yet. Create one to get started!</p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <HabitForm onSubmit={handleAddHabit} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;