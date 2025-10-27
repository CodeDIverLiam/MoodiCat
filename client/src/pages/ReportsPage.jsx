import { useState } from 'react';
import { useDailySummary, useMoodTrend } from '../hooks/useReports';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';

export default function ReportsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const { 
    summary, 
    isLoading: summaryLoading, 
    error: summaryError 
  } = useDailySummary(selectedDate);

  const { 
    trend, 
    isLoading: trendLoading, 
    error: trendError 
  } = useMoodTrend('last30days');

  if (summaryLoading || trendLoading) {
    return <Loading />;
  }

  if (summaryError || trendError) {
    return <ErrorState error={summaryError || trendError} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Daily Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Daily Summary</h3>
        {summary ? (
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
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-800">
                <div className="font-semibold mb-2">AI Suggestion:</div>
                <div>{summary.aiSuggestion || 'No suggestions available'}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No data available for this date
          </div>
        )}
      </div>

      {/* Mood Trend */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Mood Trend (Last 30 Days)</h3>
        {trend ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-gray-600">Mood trend data will be displayed here</p>
            <p className="text-sm text-gray-500 mt-2">
              This feature is coming soon!
            </p>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-4">📈</div>
            <p>Mood trend analysis is not yet implemented</p>
            <p className="text-sm text-gray-400 mt-2">
              This feature will show your emotional patterns over time
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

