import { api } from './client';

export const diaryApi = {
  // Get diary entries with date range
  getEntries: (startDate, endDate) => 
    api.get('/diary-entries', { 
      params: { startDate, endDate } 
    }).then(res => res.data),
  
  // Get single entry
  getEntry: (entryId) => 
    api.get(`/diary-entries/${entryId}`).then(res => res.data),
  
  // Create entry
  createEntry: (entryData) => 
    api.post('/diary-entries', entryData).then(res => res.data),
  
  // Update entry
  updateEntry: (entryId, entryData) => 
    api.put(`/diary-entries/${entryId}`, entryData).then(res => res.data),
  
  // Delete entry
  deleteEntry: (entryId) => 
    api.delete(`/diary-entries/${entryId}`).then(res => res.data)
};

export default diaryApi;


