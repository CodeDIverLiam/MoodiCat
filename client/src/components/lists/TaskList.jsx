import { useState } from 'react';
import { Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import TaskForm from '../forms/TaskForm';

export default function TaskList({ tasks, onUpdate, onDelete, isLoading }) {
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleFormSubmit = (data) => {
    if (editingTask) {
      onUpdate(editingTask.id, data);
    }
    setShowForm(false);
    setEditingTask(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (showForm) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">
          {editingTask ? 'Edit Task' : 'Create Task'}
        </h3>
        <TaskForm
          task={editingTask}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={isLoading}
        />
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📋</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
        <p className="text-gray-600">Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(task.status)}`}>
                  {getStatusIcon(task.status)}
                  {task.status}
                </span>
              </div>
              
              {task.description && (
                <p className="text-gray-600 mb-2">{task.description}</p>
              )}
              
              {task.updatedAt && (
                <p className="text-sm text-gray-500">
                  Updated: {new Date(task.updatedAt).toLocaleString()}
                </p>
              )}
            </div>
            
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => handleEdit(task)}
                className="p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this task?')) {
                    onDelete(task.id);
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


