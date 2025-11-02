import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../api/reports';

export const useDailySummary = (date) => {
  const { data: summary, isLoading, error } = useQuery({
    queryKey: ['reports', 'daily-summary', date],
    queryFn: () => reportsApi.getDailySummary(date),
    enabled: !!date
  });

  return {
    summary,
    isLoading,
    error
  };
};

// Hook for the today's mood panel
export const useTodayMoodSummary = () => {
  const { data: mood, isLoading, error, refetch } = useQuery({
    queryKey: ['reports', 'today-mood-summary'],
    queryFn: () => reportsApi.getTodayMoodSummary(),
    // Optional: refetch every 5 minutes
    refetchInterval: 300000,
  });

  return {
    mood,
    isLoading,
    error,
    refetch
  };
};