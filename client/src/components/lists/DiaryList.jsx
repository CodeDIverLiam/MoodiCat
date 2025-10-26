import { useState } from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import DiaryForm from '../forms/DiaryForm';

export default function DiaryList({ entries, onUpdate, onDelete, isLoading }) {
  const [editingEntry, setEditingEntry] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewingEntry, setViewingEntry] = useState(null);

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleView = (entry) => {
    setViewingEntry(entry);
  };

  const handleFormSubmit = (data) => {
    if (editingEntry) {
      onUpdate(editingEntry.id, data);
    }
    setShowForm(false);
    setEditingEntry(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingEntry(null);
  };

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case 'happy':
        return '😊';
      case 'sad':
        return '😢';
      default:
        return '😐';
    }
  };

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'happy':
        return 'bg-green-100 text-green-800';
      case 'sad':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (showForm) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">
          {editingEntry ? 'Edit Entry' : 'Create Entry'}
        </h3>
        <DiaryForm
          entry={editingEntry}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={isLoading}
        />
      </div>
    );
  }

  if (viewingEntry) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{viewingEntry.title}</h3>
          <button
            onClick={() => setViewingEntry(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getMoodEmoji(viewingEntry.mood)}</span>
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${getMoodColor(viewingEntry.mood)}`}>
              {viewingEntry.mood}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(viewingEntry.entryDate).toLocaleDateString()}
            </span>
          </div>
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{viewingEntry.content}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📖</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No diary entries found</h3>
        <p className="text-gray-600">Start writing your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <div key={entry.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{entry.title}</h3>
                <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMoodColor(entry.mood)}`}>
                  {entry.mood}
                </span>
              </div>
              
              <p className="text-sm text-gray-500 mb-2">
                {new Date(entry.entryDate).toLocaleDateString()}
              </p>
              
              <p className="text-gray-600 line-clamp-3">{entry.content}</p>
            </div>
            
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => handleView(entry)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleEdit(entry)}
                className="p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this entry?')) {
                    onDelete(entry.id);
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
