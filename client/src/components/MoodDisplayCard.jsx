export default function MoodDisplayCard() {
  // Mock data for today's mood
  const mockTodayMood = {
    emoji: '😊',
    label: 'Happy',
    note: 'Feeling great today! Had a productive morning and looking forward to the rest of the day.',
    time: new Date().toLocaleTimeString()
  };
  
  // Mock data for this week's mood history
  const mockWeekMoods = [
    { emoji: '😊', day: 'Mon', label: 'Happy' },
    { emoji: '😌', day: 'Tue', label: 'Calm' },
    { emoji: '😔', day: 'Wed', label: 'Sad' },
    { emoji: '😤', day: 'Thu', label: 'Frustrated' },
    { emoji: '😰', day: 'Fri', label: 'Anxious' },
    { emoji: '😴', day: 'Sat', label: 'Tired' },
    { emoji: '🤩', day: 'Sun', label: 'Excited' }
  ];

  return (
    <div className="card-modern h-full flex flex-col">
      <div className="p-4 flex-shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-6 h-6 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center">
            <span className="text-xs">😊</span>
          </div>
          <h3 className="font-bold text-gray-800 text-sm">Today's Mood</h3>
        </div>

        {/* Current Mood Display */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-3 mb-3 border border-yellow-200">
          <div className="flex items-center gap-2">
            <span className="text-xl">{mockTodayMood.emoji}</span>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-800 text-sm">{mockTodayMood.label}</h4>
              <p className="text-xs text-gray-600 line-clamp-2">{mockTodayMood.note}</p>
              <p className="text-xs text-gray-500 mt-1">{mockTodayMood.time}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mood History - Compact */}
      <div className="px-4 pb-4 flex-1 flex flex-col min-h-0">
        <h4 className="font-semibold text-gray-700 mb-2 text-sm">This Week</h4>
        <div className="flex gap-1 flex-1">
          {mockWeekMoods.map((mood, index) => (
            <div key={index} className="flex-1 bg-gray-50 rounded-lg p-1.5 text-center flex flex-col justify-center">
              <div className="text-xs mb-1">{mood.emoji}</div>
              <div className="text-xs text-gray-500">{mood.day}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
