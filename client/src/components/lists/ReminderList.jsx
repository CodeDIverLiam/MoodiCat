import { Trash2, Clock } from 'lucide-react';

export default function ReminderList({ reminders, onDelete, isLoading }) {
  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };

  const getStatusColor = (isSent) => {
    return isSent ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  if (!reminders || reminders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">⏰</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No reminders found</h3>
        <p className="text-gray-600">Create your first reminder!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reminders.map((reminder) => (
        <div key={reminder.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {reminder.task?.title || 'Unknown Task'}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reminder.isSent)}`}>
                  {reminder.isSent ? 'Sent' : 'Pending'}
                </span>
              </div>
              
              <p className="text-sm text-gray-500">
                Reminder: {formatDateTime(reminder.reminderTime)}
              </p>
              
              {reminder.task?.description && (
                <p className="text-gray-600 mt-2 line-clamp-2">
                  {reminder.task.description}
                </p>
              )}
            </div>
            
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this reminder?')) {
                    onDelete(reminder.id);
                  }
                }}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

