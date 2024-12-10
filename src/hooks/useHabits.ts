import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';
import { calculateStreak } from '../utils/habitUtils';

type Habit = Database['public']['Tables']['habits']['Row'];
type HabitCompletion = Database['public']['Tables']['habit_completions']['Row'];

export function useHabits(userId: string) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHabits();
  }, [userId]);

  async function fetchHabits() {
    try {
      const { data: habits, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (habitsError) throw habitsError;

      const { data: completions, error: completionsError } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', userId);

      if (completionsError) throw completionsError;

      const habitsWithStreaks = habits.map(habit => {
        const habitCompletions = completions.filter(c => c.habit_id === habit.id);
        const completionDates = habitCompletions.map(c => new Date(c.completed_at));
        const streak = calculateStreak(completionDates, habit.frequency);
        return { ...habit, streak };
      });

      setHabits(habitsWithStreaks);
    } catch (error) {
      console.error('Error fetching habits:', error);
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  }

  async function addHabit(data: Omit<Habit, 'id' | 'created_at' | 'progress' | 'streak' | 'user_id'>) {
    try {
      const { data: habit, error } = await supabase
        .from('habits')
        .insert([
          {
            ...data,
            progress: 0,
            streak: 0,
            user_id: userId,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setHabits(prev => [habit, ...prev]);
      toast.success('Habit created successfully');
    } catch (error) {
      console.error('Error adding habit:', error);
      toast.error('Failed to create habit');
    }
  }

  async function completeHabit(habitId: string) {
    try {
      const today = new Date().toISOString();
      
      // Check if already completed today
      const { data: existingCompletion } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('habit_id', habitId)
        .eq('user_id', userId)
        .gte('completed_at', new Date().setHours(0, 0, 0, 0).toISOString())
        .lte('completed_at', new Date().setHours(23, 59, 59, 999).toISOString())
        .single();

      if (existingCompletion) {
        toast.error('Already completed today');
        return;
      }

      // Add completion
      const { error: completionError } = await supabase
        .from('habit_completions')
        .insert([
          {
            habit_id: habitId,
            user_id: userId,
            completed_at: today,
          },
        ]);

      if (completionError) throw completionError;

      // Update habit progress
      const habit = habits.find(h => h.id === habitId);
      if (!habit) return;

      const { error: updateError } = await supabase
        .from('habits')
        .update({ progress: habit.progress + 1 })
        .eq('id', habitId);

      if (updateError) throw updateError;

      // Refresh habits to update streaks and progress
      await fetchHabits();
      toast.success('Progress updated');
    } catch (error) {
      console.error('Error completing habit:', error);
      toast.error('Failed to update progress');
    }
  }

  return {
    habits,
    loading,
    addHabit,
    completeHabit,
  };
}