import { useState } from "react";
import { Plus, Heart, Edit3, Trash2 } from "lucide-react";
import { useDiary } from "../hooks/useDiary";
import DiaryList from "./lists/DiaryList";
import DiaryForm from "./forms/DiaryForm";

export default function DiaryPanel() {
  const [newEntryContent, setNewEntryContent] = useState('');
  const [editingEntry, setEditingEntry] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const { 
    entries = [], 
    isLoading, 
    error,
    createEntry, 
    updateEntry, 
    deleteEntry,
    isCreating,
    isUpdating,
    isDeleting,
    createError,
    updateError,
    deleteError
  } = useDiary('today');

  const addEntry = () => {
    if (newEntryContent.trim() && !isCreating) {
      const today = new Date().toISOString().split('T')[0];
      createEntry({
        title: `Entry ${new Date().toLocaleTimeString()}`,
        content: newEntryContent,
        mood: 'neutral',
        entryDate: today
      });
      setNewEntryContent('');
    }
  };

  const handleDeleteEntry = (id) => {
    deleteEntry(id);
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleFormSubmit = (data) => {
    if (editingEntry) {
      updateEntry({ 
        entryId: editingEntry.id, 
        entryData: data 
      });
    }
    setShowForm(false);
    setEditingEntry(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingEntry(null);
  };

  if (showForm) {
    return (
      <div className="card-modern">
        <DiaryForm
          entry={editingEntry}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={isUpdating}
        />
      </div>
    );
  }

  return (
    <div className="card-modern">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-gray-800">Today's Diary</h3>
          </div>
        </div>
      </div>

      {/* Add Entry */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex gap-3">
          <input
            type="text"
            value={newEntryContent}
            onChange={(e) => setNewEntryContent(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addEntry()}
            placeholder="How was your day?"
            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
          />
          <button
            onClick={addEntry}
            disabled={isCreating || !newEntryContent.trim()}
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
          {createError?.response?.data?.message || 'Failed to create diary entry'}
        </div>
      )}
      {updateError && (
        <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {updateError?.response?.data?.message || 'Failed to update diary entry'}
        </div>
      )}
      {deleteError && (
        <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {deleteError?.response?.data?.message || 'Failed to delete diary entry'}
        </div>
      )}

      {/* Diary List */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📖</div>
            <p className="text-sm">No diary entries for today. Add one above!</p>
          </div>
        ) : (
          <DiaryList
            entries={entries}
            onUpdate={handleEditEntry}
            onDelete={handleDeleteEntry}
            isLoading={isDeleting}
          />
        )}
      </div>
    </div>
  );
}
