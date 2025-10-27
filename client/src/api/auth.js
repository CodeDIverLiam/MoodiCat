import { api } from './client';

export const authApi = {
  // Register user
  register: (userData) => 
    api.post('/auth/register', userData).then(res => res.data),
  
  // Login user
  login: (credentials) => 
    api.post('/auth/login', credentials).then(res => res.data),
  
  // Get current user
  getCurrentUser: () => 
    api.get('/auth/me').then(res => res.data)
};

export default authApi;

