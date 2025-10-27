import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { remindersApi } from '../api/reminders';

export const useReminders = () => {
  const queryClient = useQueryClient();

  // Get reminders
  const { data: reminders, isLoading, error } = useQuery({
    queryKey: ['reminders'],
    queryFn: remindersApi.getReminders
  });

  // Create reminder mutation
  const createMutation = useMutation({
    mutationFn: remindersApi.createReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    }
  });

  // Delete reminder mutation
  const deleteMutation = useMutation({
    mutationFn: remindersApi.deleteReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    }
  });

  return {
    reminders,
    isLoading,
    error,
    createReminder: createMutation.mutate,
    deleteReminder: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error,
    deleteError: deleteMutation.error
  };
};

