import { useState } from "react";
import { Plus, Edit3, Calendar, Heart } from "lucide-react";
import { useDiary } from "../hooks/useDiary";

export default function DiaryPanel() {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  
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
  } = useDiary(startDate, endDate);

  return (
    <div className="card-modern h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-gray-800">My Diary</h3>
          </div>
          <button 
            onClick={() => {/* TODO: Open create form */}}
            className="w-8 h-8 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full flex items-center justify-center hover:from-teal-500 hover:to-cyan-600 transition-all"
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>
        
        {/* Date Filter */}
        <div className="flex gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-400"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-400"
          />
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

      {/* Diary Entries */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📖</div>
            <p className="text-sm">No diary entries found for this date range.</p>
          </div>
        ) : (
          entries.map((entry) => (
          <div key={entry.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{entry.mood}</span>
                <h4 className="font-semibold text-gray-800">{entry.title}</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{entry.date}</span>
                <button className="w-6 h-6 bg-white rounded-full flex items-center justify-center hover:bg-gray-100">
                  <Edit3 className="w-3 h-3 text-gray-600" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{entry.content}</p>
            <div className="flex gap-2">
              {entry.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          ))
        )}
      </div>

      {/* Quick Add */}
      <div className="p-6 border-t border-gray-100">
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="w-5 h-5 text-teal-600" />
            <span className="font-semibold text-gray-800">Quick Entry</span>
          </div>
          <textarea
            placeholder="How was your day?"
            className="w-full p-3 border border-teal-200 rounded-lg focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 resize-none"
            rows={3}
          />
          <div className="flex justify-between items-center mt-3">
            <div className="flex gap-2">
              {['😊', '😌', '😔', '😤'].map((emoji, index) => (
                <button key={index} className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-50">
                  <span className="text-sm">{emoji}</span>
                </button>
              ))}
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-teal-400 to-cyan-500 text-white rounded-lg text-sm font-medium hover:from-teal-500 hover:to-cyan-600 transition-all">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
