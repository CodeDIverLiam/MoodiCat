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

export const useMoodTrend = (period = 'last30days') => {
  const { data: trend, isLoading, error } = useQuery({
    queryKey: ['reports', 'mood-trend', period],
    queryFn: () => reportsApi.getMoodTrend(period)
  });

  return {
    trend,
    isLoading,
    error
  };
};
