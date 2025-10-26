import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTasks } from '../hooks/useTasks';
import { tasksApi } from '../api/tasks';

// Mock the API
vi.mock('../api/tasks', () => ({
  tasksApi: {
    getTasks: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn()
  }
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });
  
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useTasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch tasks successfully', async () => {
    const mockTasks = [
      { id: 1, title: 'Test Task', status: 'pending' }
    ];
    
    tasksApi.getTasks.mockResolvedValue(mockTasks);

    const { result } = renderHook(() => useTasks(), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.tasks).toEqual(mockTasks);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  it('should handle API errors', async () => {
    const mockError = new Error('API Error');
    tasksApi.getTasks.mockRejectedValue(mockError);

    const { result } = renderHook(() => useTasks(), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.tasks).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toEqual(mockError);
    });
  });
});
