import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { diaryApi } from '../api/diary';

export const useDiary = (startDate, endDate) => {
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: ['diary'] });
    }
  });

  // Update entry mutation
  const updateMutation = useMutation({
    mutationFn: ({ entryId, entryData }) => diaryApi.updateEntry(entryId, entryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diary'] });
    }
  });

  // Delete entry mutation
  const deleteMutation = useMutation({
    mutationFn: diaryApi.deleteEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diary'] });
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
