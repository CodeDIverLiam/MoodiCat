import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useReminders } from '../hooks/useReminders';
import { useTasks } from '../hooks/useTasks';
import ReminderList from '../components/lists/ReminderList';
import ReminderForm from '../components/forms/ReminderForm';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import Empty from '../components/common/Empty';

export default function RemindersPage() {
  const [showForm, setShowForm] = useState(false);
  
  const { 
    reminders, 
    isLoading: remindersLoading, 
    error: remindersError, 
    createReminder, 
    deleteReminder, 
    isCreating, 
    isDeleting 
  } = useReminders();

  const { 
    tasks, 
    isLoading: tasksLoading 
  } = useTasks();

  const handleCreate = () => {
    setShowForm(true);
  };

  const handleFormSubmit = (data) => {
    createReminder(data);
    setShowForm(false);
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const handleDelete = (reminderId) => {
    deleteReminder(reminderId);
  };

  if (showForm) {
    return (
      <ReminderForm
        tasks={tasks}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        isLoading={isCreating}
      />
    );
  }

  if (remindersLoading || tasksLoading) {
    return <Loading />;
  }

  if (remindersError) {
    return <ErrorState error={remindersError} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Reminders</h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
        >
          <Plus className="w-4 h-4" />
          New Reminder
        </button>
      </div>

      {/* Reminder List */}
      {reminders && reminders.length > 0 ? (
        <ReminderList
          reminders={reminders}
          onDelete={handleDelete}
          isLoading={isDeleting}
        />
      ) : (
        <Empty
          message="No reminders found"
          action={true}
          actionText="Create your first reminder"
          onAction={handleCreate}
        />
      )}
    </div>
  );
}
