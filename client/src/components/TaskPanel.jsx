import { useState } from "react";
import { Plus, CheckCircle, Circle, Trash2, Edit3 } from "lucide-react";
import { useTasks } from "../hooks/useTasks";

export default function TaskPanel() {
  const [newTask, setNewTask] = useState('');
  const { 
    tasks = [], 
    isLoading, 
    error,
    createTask, 
    updateTask, 
    deleteTask,
    isCreating,
    isUpdating,
    isDeleting,
    createError,
    updateError,
    deleteError
  } = useTasks();

  const toggleTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    updateTask({ 
      taskId: id, 
      taskData: { ...task, status: newStatus } 
    });
  };

  const addTask = () => {
    if (newTask.trim() && !isCreating) {
      createTask({
        title: newTask,
        description: '',
        status: 'pending',
        dueDate: new Date().toISOString().split('T')[0]
      });
      setNewTask('');
    }
  };

  const handleDeleteTask = (id) => {
    deleteTask(id);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;

  return (
    <div className="card-modern h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-gray-800">Tasks</h3>
          </div>
          <div className="text-sm text-gray-500">
            {completedTasks}/{totalTasks} completed
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-teal-400 to-cyan-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
          ></div>
        </div>
      </div>

      {/* Add Task */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex gap-3">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
          />
                  <button
                    onClick={addTask}
                    disabled={isCreating || !newTask.trim()}
                    className="w-12 h-12 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center hover:from-teal-500 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Plus className="w-5 h-5 text-white" />
                    )}
                  </button>
        </div>
      </div>

      {/* Error Messages */}
      {createError && (
        <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {createError?.response?.data?.message || 'Failed to create task'}
        </div>
      )}
      {updateError && (
        <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {updateError?.response?.data?.message || 'Failed to update task'}
        </div>
      )}
      {deleteError && (
        <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {deleteError?.response?.data?.message || 'Failed to delete task'}
        </div>
      )}

      {/* Task List */}
      <div className="flex-1 p-6 overflow-y-auto space-y-3 custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-sm">No tasks yet. Add one above!</p>
          </div>
        ) : (
          tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
              task.status === 'completed' 
                ? 'bg-gray-50 border-gray-200 opacity-60' 
                : 'bg-white border-gray-200 hover:border-teal-200'
            }`}
          >
            <button
              onClick={() => toggleTask(task.id)}
              className="flex-shrink-0"
            >
              {task.status === 'completed' ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400 hover:text-teal-500" />
              )}
            </button>
            
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {task.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(task.priority || 'medium')}`}>
                  {task.priority || 'medium'}
                </span>
                <span className="text-xs text-gray-500">{task.dueDate}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                <Edit3 className="w-3 h-3 text-gray-600" />
              </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        disabled={isDeleting}
                        className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 disabled:opacity-50"
                      >
                        {isDeleting ? (
                          <div className="w-3 h-3 border border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="w-3 h-3 text-red-600" />
                        )}
                      </button>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );
}
