export const calculateStreak = (completedDates: Date[], frequency: 'daily' | 'weekly' | 'monthly'): number => {
  if (completedDates.length === 0) return 0;
  
  const sortedDates = [...completedDates].sort((a, b) => b.getTime() - a.getTime());
  let streak = 1;
  
  const getTimeDifference = (date1: Date, date2: Date) => {
    const diffTime = Math.abs(date1.getTime() - date2.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isConsecutive = (date1: Date, date2: Date, frequency: 'daily' | 'weekly' | 'monthly'): boolean => {
    const diffDays = getTimeDifference(date1, date2);
    
    switch (frequency) {
      case 'daily':
        return diffDays <= 1;
      case 'weekly':
        return diffDays <= 7;
      case 'monthly':
        // Check if the dates are in consecutive months
        const months = date1.getMonth() - date2.getMonth();
        const years = date1.getFullYear() - date2.getFullYear();
        return Math.abs(months + years * 12) <= 1;
      default:
        return false;
    }
  };
  
  for (let i = 1; i < sortedDates.length; i++) {
    if (isConsecutive(sortedDates[i-1], sortedDates[i], frequency)) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const getProgressPercentage = (progress: number, target: number): number => {
  return Math.min(Math.round((progress / target) * 100), 100);
};

export const getFrequencyLabel = (frequency: 'daily' | 'weekly' | 'monthly'): string => {
  switch (frequency) {
    case 'daily':
      return 'Today';
    case 'weekly':
      return 'This Week';
    case 'monthly':
      return 'This Month';
  }
};