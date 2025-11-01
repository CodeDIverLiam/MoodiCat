import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import TaskList from '../components/lists/TaskList';
import TaskForm from '../components/forms/TaskForm';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import Empty from '../components/common/Empty';

export default function TasksPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const { 
    tasks, 
    isLoading, 
    error, 
    createTask, 
    updateTask, 
    deleteTask, 
    isCreating, 
    isUpdating, 
    isDeleting 
  } = useTasks(statusFilter);

  const handleCreate = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleFormSubmit = (data) => {
    if (editingTask) {
      updateTask({ taskId: editingTask.id, taskData: data });
    } else {
      createTask(data);
    }
    setShowForm(false);
    setEditingTask(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleDelete = (taskId) => {
    deleteTask(taskId);
  };

  const statusTabs = [
    { id: '', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

  if (showForm) {
    return (
      <TaskForm
        task={editingTask}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        isLoading={isCreating || isUpdating}
      />
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Status Filter */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {statusTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              statusFilter === tab.id
                ? 'bg-white text-teal-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Task List */}
      {tasks && tasks.length > 0 ? (
        <TaskList
          tasks={tasks}
          onUpdate={handleEdit}
          onDelete={handleDelete}
          isLoading={isDeleting}
        />
      ) : (
        <Empty
          message="No tasks found"
          action={true}
          actionText="Create your first task"
          onAction={handleCreate}
        />
      )}
    </div>
  );
}


