import { useState } from 'react';
import { useDailySummary } from '../hooks/useReports';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import { CheckCircle, Circle } from 'lucide-react';
import { getMoodEmoji, getMoodColor } from '../utils/moodEmoji';

export default function ReportsPage() {
  const getTodayDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getTodayDateString());

  const {
    summary,
    isLoading: summaryLoading,
    error: summaryError
  } = useDailySummary(selectedDate);

  if (summaryLoading) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
          <Loading />
        </div>
    );
  }
  if (summaryError) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
          <ErrorState error={summaryError} onRetry={() => window.location.reload()} />
        </div>
    );
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Date
              </label>
              <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Daily Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Daily Summary ({selectedDate})</h3>
          {summary ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {summary.tasksCompleted || 0}
                    </div>
                    <div className="text-sm text-green-800">Tasks Completed</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {summary.tasksPending || 0}
                    </div>
                    <div className="text-sm text-yellow-800">Tasks Pending</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg md:col-span-3">
                    <div className="text-sm text-blue-800">
                      <div className="font-semibold mb-2">AI Suggestion:</div>
                      <div>{summary.aiSuggestion || 'No suggestions available'}</div>
                    </div>
                  </div>
                </div>
                {summary.moodAnalysis && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-sm text-purple-900">
                      <div className="font-semibold mb-2">Mood Analysis:</div>
                      <div className="text-purple-800 leading-relaxed">{summary.moodAnalysis}</div>
                    </div>
                  </div>
                )}
              </div>
          ) : (
              <div className="text-center py-8 text-gray-500">
                No data available for this date
              </div>
          )}
        </div>

        {/* Diary Entries */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Diary Entries</h3>
          {summary && summary.entries && summary.entries.length > 0 ? (
              <div className="space-y-3">
                {summary.entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 rounded-lg border bg-gray-50 border-gray-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <span className="text-xl">{getMoodEmoji(entry.mood)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-sm font-medium text-gray-800">
                            {entry.title || '(No title)'}
                          </h4>
                          {entry.mood && (
                            <span className={`px-2 py-1 text-xs rounded-full border ${getMoodColor(entry.mood)}`}>
                              {entry.mood}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2 whitespace-pre-wrap">
                          {entry.content || '(No content)'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {entry.createdAt ? new Date(entry.createdAt).toLocaleString() : 
                           (entry.entryDate ? new Date(entry.entryDate).toLocaleDateString() : '')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
          ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📖</div>
                <p>No diary entries for this date</p>
              </div>
          )}
        </div>

        {/* Tasks */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Tasks</h3>
          {summary && summary.tasks && summary.tasks.length > 0 ? (
              <div className="space-y-2">
                {summary.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      task.status === 'completed' 
                        ? 'bg-gray-50 border-gray-200 opacity-60' 
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {task.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                      )}
                      {task.updatedAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          Updated: {new Date(task.updatedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
          ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📝</div>
                <p>No tasks for this date</p>
              </div>
          )}
        </div>
      </div>
  );
}