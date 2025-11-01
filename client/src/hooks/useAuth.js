import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
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
      toast.success('Welcome back! 🎉');
    },
    onError: (error) => {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || error?.message;
      
      if (status === 401) {
        toast.error('Invalid username or password. Please try again.');
      } else if (status === 400) {
        toast.error(message || 'Please check your input and try again.');
      } else {
        toast.error(message || 'Login failed. Please try again.');
      }
    }
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data, variables) => {
      toast.success('Account created successfully! 🎉');
      // After successful registration, automatically login
      loginMutation.mutate({
        username: variables.username,
        password: variables.password
      });
    },
    onError: (error) => {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || error?.response?.data || error?.message;
      
      if (status === 409) {
        // Username already exists
        toast.error('Username already exists. Please sign in instead.', {
          duration: 5000,
        });
      } else if (status === 400) {
        toast.error(message || 'Please check your input and try again.');
      } else {
        toast.error(message || 'Registration failed. Please try again.');
      }
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


