import { useState, useEffect } from 'react'; // 1. 导入 useEffect
import { useDailySummary, useMoodTrend } from '../hooks/useReports';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';

// 简单的图表占位符（用于显示AI分析结果）
function MoodChart({ data }) {
  if (!data || data.length === 0) {
    return (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">📊</div>
          <p>No mood data found for this period.</p>
          <p className="text-sm text-gray-400 mt-2">
            Write some diary entries, and the AI will analyze your mood trend here!
          </p>
        </div>
    );
  }

  // 将数据显示为列表（证明API对接成功）
  return (
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-700">AI Mood Analysis Results:</h4>
        <div className="p-4 bg-gray-50 rounded-lg max-h-60 overflow-y-auto">
        <pre className="text-xs text-gray-600">
          {JSON.stringify(data, null, 2)}
        </pre>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          (Note: A charting library like 'Recharts' or 'Chart.js' can be installed to visualize this data.)
        </p>
      </div>
  );
}

export default function ReportsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // 2. 为解析后的心情数据添加 state
  const [moodData, setMoodData] = useState([]);

  const {
    summary,
    isLoading: summaryLoading,
    error: summaryError
  } = useDailySummary(selectedDate);

  const {
    trend, // 'trend' 现在是后端返回的 JSON 字符串
    isLoading: trendLoading,
    error: trendError
  } = useMoodTrend('last30days');

  // 3. 使用 useEffect 在 'trend' 数据加载后解析它
  useEffect(() => {
    if (trend && !trendError) {
      try {
        // 后端返回的是一个 JSON 字符串，我们需要解析它
        const parsedData = JSON.parse(trend);
        setMoodData(parsedData);
      } catch (e) {
        console.error("Failed to parse mood trend JSON:", e);
        // 如果AI返回的不是标准JSON，在这里处理
        setMoodData([{ date: "Error", mood: "Failed to parse AI response" }]);
      }
    }
  }, [trend, trendError]); // 当 trend 或 trendError 变化时触发

  // 4. 更新 Loading 状态
  if (summaryLoading) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
          <Loading />
        </div>
    );
  }

  // 5. 更新 Error 状态
  if (summaryError || trendError) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
          <ErrorState error={summaryError || trendError} onRetry={() => window.location.reload()} />
        </div>
    );
  }

  return (
      <div className="space-y-6">
        {/* Header (保持不变) */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Date for Summary
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

        {/* Daily Summary (保持不变) */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Daily Summary ({selectedDate})</h3>
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
                <div className="bg-blue-50 p-4 rounded-lg md:col-span-3">
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

        {/* 6. Mood Trend (替换为新的 MoodChart 组件) */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Mood Trend (Last 30 Days)</h3>
          {trendLoading ? (
              <Loading />
          ) : (
              <MoodChart data={moodData} />
          )}
        </div>
      </div>
  );
}