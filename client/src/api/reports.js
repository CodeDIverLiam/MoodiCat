import { api } from './client';

export const reportsApi = {
  getDailySummary: (date) =>
      api.get('/reports/daily-summary', { params: { date } }).then(res => res.data),

  getMoodTrend: (period = 'last30days') =>
      api.get('/reports/mood-trend', { params: { period } }).then(res => res.data),

  getTodayMoodSummary: () =>
      api.get('/reports/today-mood-summary').then(res => res.data)
};

export default reportsApi;