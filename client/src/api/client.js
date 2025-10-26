import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:10000/api/v1',
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aiDiaryToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('aiDiaryToken');
      localStorage.removeItem('aiDiaryUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
