import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { diaryApi } from '../api/diary';

export const useDiary = (date = 'today') => {
  const queryClient = useQueryClient();
  
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };
  
  // Determine the date range
  const todayDate = getTodayDate();
  const startDate = date === 'today' || !date ? todayDate : date;
  const endDate = date === 'today' || !date ? todayDate : date;

  // Get diary entries
  const { data: entries, isLoading, error } = useQuery({
    queryKey: ['diary', startDate, endDate],
    queryFn: () => diaryApi.getEntries(startDate, endDate),
    enabled: !!(startDate && endDate)
  });

  // Create entry mutation
  const createMutation = useMutation({
    mutationFn: diaryApi.createEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diary', startDate, endDate] });
    }
  });

  // Update entry mutation
  const updateMutation = useMutation({
    mutationFn: ({ entryId, entryData }) => diaryApi.updateEntry(entryId, entryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diary', startDate, endDate] });
    }
  });

  // Delete entry mutation
  const deleteMutation = useMutation({
    mutationFn: diaryApi.deleteEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diary', startDate, endDate] });
    }
  });

  return {
    entries,
    isLoading,
    error,
    createEntry: createMutation.mutate,
    updateEntry: updateMutation.mutate,
    deleteEntry: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error
  };
};
