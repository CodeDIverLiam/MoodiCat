import { api } from './client';

export const remindersApi = {
  // Get all reminders
  getReminders: () => 
    api.get('/reminders').then(res => res.data),
  
  // Create reminder
  createReminder: (reminderData) => 
    api.post('/reminders', reminderData).then(res => res.data),
  
  // Delete reminder
  deleteReminder: (reminderId) => 
    api.delete(`/reminders/${reminderId}`).then(res => res.data)
};

export default remindersApi;

