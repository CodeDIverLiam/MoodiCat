import { useState } from "react";
import { useDiary } from "../hooks/useDiary";

export default function MoodDisplayCard() {
  const [selectedMood, setSelectedMood] = useState(null);
  
  // Get today's diary entries
  const today = new Date().toISOString().split('T')[0];
  const { 
    entries = [], 
    isLoading, 
    error,
    createEntry,
    isCreating,
    createError
  } = useDiary(today, today);
  
  // Get today's mood from entries
  const todayMood = entries.length > 0 ? {
    emoji: entries[0].mood || '😊',
    label: getMoodLabel(entries[0].mood),
    note: entries[0].content || '',
    time: new Date(entries[0].entryDate).toLocaleTimeString()
  } : null;

  const getMoodLabel = (mood) => {
    const moodMap = {
      '😊': 'Happy',
      '😌': 'Calm',
      '😔': 'Sad',
      '😤': 'Angry',
      '😰': 'Anxious',
      '😴': 'Tired',
      '🤩': 'Excited',
      '😄': 'Content'
    };
    return moodMap[mood] || 'Neutral';
  };
  
  const moods = [
    { emoji: '😊', label: 'Happy', color: 'bg-yellow-100 border-yellow-300' },
    { emoji: '😌', label: 'Calm', color: 'bg-blue-100 border-blue-300' },
    { emoji: '😔', label: 'Sad', color: 'bg-gray-100 border-gray-300' },
    { emoji: '😤', label: 'Angry', color: 'bg-red-100 border-red-300' },
    { emoji: '😰', label: 'Anxious', color: 'bg-orange-100 border-orange-300' },
    { emoji: '😴', label: 'Tired', color: 'bg-purple-100 border-purple-300' },
    { emoji: '🤩', label: 'Excited', color: 'bg-pink-100 border-pink-300' },
    { emoji: '😌', label: 'Content', color: 'bg-green-100 border-green-300' }
  ];

  const defaultTodayMood = {
    emoji: '😊',
    label: 'Happy',
    note: 'How are you feeling today?',
    time: new Date().toLocaleTimeString()
  };

  return (
    <div className="card-modern p-6">
      {/* Error Messages */}
      {createError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {createError?.response?.data?.message || 'Failed to save mood'}
        </div>
      )}
      
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center">
          <span className="text-sm">😊</span>
        </div>
        <h3 className="font-bold text-gray-800">Today's Mood</h3>
      </div>

      {/* Current Mood Display */}
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-4 mb-6 border border-yellow-200">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{todayMood?.emoji || defaultTodayMood.emoji}</span>
          <div>
            <h4 className="font-semibold text-gray-800">{todayMood?.label || defaultTodayMood.label}</h4>
            <p className="text-sm text-gray-600">{todayMood?.note || defaultTodayMood.note}</p>
            <p className="text-xs text-gray-500 mt-1">{todayMood?.time || defaultTodayMood.time}</p>
          </div>
        </div>
      </div>

      {/* Mood Selection */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-3">How are you feeling?</h4>
        <div className="grid grid-cols-4 gap-3">
          {moods.map((mood, index) => (
            <button
              key={index}
              onClick={() => setSelectedMood(mood)}
              className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                selectedMood === mood 
                  ? `${mood.color} border-opacity-100` 
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">{mood.emoji}</div>
              <div className="text-xs text-gray-600">{mood.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Mood History */}
      <div className="mt-6">
        <h4 className="font-semibold text-gray-700 mb-3">This Week</h4>
        <div className="flex gap-2">
          {['😊', '😌', '😔', '😤', '😰', '😴', '🤩'].map((emoji, index) => (
            <div key={index} className="flex-1 bg-gray-50 rounded-lg p-2 text-center">
              <div className="text-lg mb-1">{emoji}</div>
              <div className="text-xs text-gray-500">Day {index + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
