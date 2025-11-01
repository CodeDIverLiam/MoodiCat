import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useDiary } from '../hooks/useDiary';
import DiaryList from '../components/lists/DiaryList';
import DiaryForm from '../components/forms/DiaryForm';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import Empty from '../components/common/Empty';

// Helper function to get local date string (YYYY-MM-DD) - not UTC
const getLocalDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function DiaryPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Set default date range (last 30 days) using local timezone
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    setEndDate(getLocalDateString(today));
    setStartDate(getLocalDateString(thirtyDaysAgo));
  }, []);

  const { 
    entries, 
    isLoading, 
    error, 
    createEntry, 
    updateEntry, 
    deleteEntry, 
    isCreating, 
    isUpdating, 
    isDeleting 
  } = useDiary(startDate, endDate);

  const handleCreate = () => {
    setEditingEntry(null);
    setShowForm(true);
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleFormSubmit = (data) => {
    if (editingEntry) {
      updateEntry({ entryId: editingEntry.id, entryData: data });
    } else {
      createEntry(data);
    }
    setShowForm(false);
    setEditingEntry(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingEntry(null);
  };

  const handleDelete = (entryId) => {
    deleteEntry(entryId);
  };

  if (showForm) {
    return (
      <DiaryForm
        entry={editingEntry}
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
        <h2 className="text-2xl font-bold text-gray-900">Diary</h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
        >
          <Plus className="w-4 h-4" />
          New Entry
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="flex gap-4 items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Diary List */}
      {entries && entries.length > 0 ? (
        <DiaryList
          entries={entries}
          onUpdate={handleEdit}
          onDelete={handleDelete}
          isLoading={isDeleting}
        />
      ) : (
        <Empty
          message="No diary entries found"
          action={true}
          actionText="Write your first entry"
          onAction={handleCreate}
        />
      )}
    </div>
  );
}


