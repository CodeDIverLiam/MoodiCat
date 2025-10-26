import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth';

export const useAuth = () => {
  const queryClient = useQueryClient();

  // Get current user
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getCurrentUser,
    retry: false,
    enabled: !!localStorage.getItem('aiDiaryToken')
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem('aiDiaryToken', data.token);
      localStorage.setItem('aiDiaryUser', JSON.stringify(data.user));
      queryClient.setQueryData(['auth', 'me'], data.user);
    }
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      // After successful registration, automatically login
      loginMutation.mutate({
        username: data.username,
        password: data.password
      });
    }
  });

  // Logout function
  const logout = () => {
    localStorage.removeItem('aiDiaryToken');
    localStorage.removeItem('aiDiaryUser');
    queryClient.clear();
    window.location.href = '/login';
  };

  return {
    user,
    isLoading,
    error,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error
  };
};
