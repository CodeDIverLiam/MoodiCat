import { api } from './client';

export const reportsApi = {
  // Get daily summary
  getDailySummary: (date) => 
    api.get('/reports/daily-summary', { params: { date } }).then(res => res.data),
  
  // Get mood trend
  getMoodTrend: (period = 'last30days') => 
    api.get('/reports/mood-trend', { params: { period } }).then(res => res.data)
};

export default reportsApi;


