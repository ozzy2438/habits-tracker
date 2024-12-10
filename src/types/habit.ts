export interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  target: number;
  progress: number;
  streak: number;
  createdAt: Date;
  completedDates: Date[];
}

export type HabitFormData = Omit<Habit, 'id' | 'progress' | 'streak' | 'createdAt' | 'completedDates'>;