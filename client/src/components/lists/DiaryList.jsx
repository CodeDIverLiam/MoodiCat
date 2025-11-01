import { Edit3, Trash2 } from 'lucide-react';

export default function DiaryList({ entries, onUpdate, onDelete, isLoading }) {
  const getMoodEmoji = (mood) => {
    switch (mood) {
      case 'happy':
        return '😊';
      case 'sad':
        return '😢';
      case 'neutral':
        return '😐';
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
      case 'neutral':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-4xl mb-2">📖</div>
        <p className="text-sm text-gray-500">No diary entries for today</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="flex items-center gap-3 p-3 rounded-lg border bg-white border-gray-200 hover:border-teal-200 transition-all"
        >
          <div className="flex-shrink-0">
            <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-medium text-gray-800 truncate">{entry.title || '(无标题)'}</h4>
              {entry.mood && (
                <span className={`px-2 py-1 text-xs rounded-full border ${getMoodColor(entry.mood)}`}>
                  {entry.mood}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{entry.content || '(无内容)'}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(entry.entryDate).toLocaleTimeString()}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdate(entry)}
              className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
            >
              <Edit3 className="w-3 h-3 text-gray-600" />
            </button>
            <button
              onClick={() => onDelete(entry.id)}
              disabled={isLoading}
              className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-3 h-3 border border-red-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Trash2 className="w-3 h-3 text-red-600" />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
