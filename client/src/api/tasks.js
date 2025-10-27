import { api } from './client';

export const tasksApi = {
  // Get tasks with optional status filter
  getTasks: (status) => 
    api.get('/tasks', { params: { status } }).then(res => res.data),
  
  // Get single task
  getTask: (taskId) => 
    api.get(`/tasks/${taskId}`).then(res => res.data),
  
  // Create task
  createTask: (taskData) => 
    api.post('/tasks', taskData).then(res => res.data),
  
  // Update task
  updateTask: (taskId, taskData) => 
    api.put(`/tasks/${taskId}`, taskData).then(res => res.data),
  
  // Delete task
  deleteTask: (taskId) => 
    api.delete(`/tasks/${taskId}`).then(res => res.data)
};

export default tasksApi;

