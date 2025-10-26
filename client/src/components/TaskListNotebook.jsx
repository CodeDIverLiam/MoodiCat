import { motion, AnimatePresence } from "framer-motion";

export default function TaskListNotebook({ selectedTime }) {
  // Sample task data
  const timeBlockTasks = {
    morning: [
      { id: 1, text: "Completed the proposal", done: true },
      { id: 2, text: "Contacted old clients", done: true },
      { id: 3, text: "Recalled some old book lists", done: false }
    ],
    noon: [
      { id: 4, text: "Lunch with team", done: true },
      { id: 5, text: "Review project report", done: false }
    ],
    afternoon: [
      { id: 6, text: "Prepare for client meeting", done: false },
      { id: 7, text: "Research new technologies", done: false }
    ],
    evening: [
      { id: 8, text: "Workout at gym", done: true },
      { id: 9, text: "Read a book", done: false }
    ],
    midnight: [
      { id: 10, text: "Plan next day's tasks", done: false }
    ]
  };

  // Record items (no completion status)
  const recordItems = [
    { id: 1, text: "Accounting management optimization", emoji: "📊" },
    { id: 2, text: "Improve interpersonal skills", emoji: "🤝" },
    { id: 3, text: "Workflow process improvement", emoji: "⚙️" }
  ];

  const currentTasks = timeBlockTasks[selectedTime] || [];

  return (
    <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-lg h-full flex flex-col">
      <h3 className="font-bold text-sm text-gray-800 mb-3 flex items-center">
        📋 Task & Record Items
      </h3>
      <div className="flex-1 space-y-2 overflow-y-auto">
        {/* Tasks Section */}
        <div className="space-y-2">
          <AnimatePresence>
            {currentTasks.map((task) => (
              <motion.div
                key={task.id}
                className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <span className={`text-lg ${task.done ? "text-green-600" : "text-red-500"}`}>
                  {task.done ? "✅" : "❌"}
                </span>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${task.done ? "line-through text-gray-500" : "text-gray-800"}`}>
                    {task.text}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {currentTasks.length === 0 && (
            <div className="text-center text-gray-500 text-sm py-6 bg-gray-50 rounded-lg">
              No tasks for this time period
            </div>
          )}
        </div>

        {/* Record Items Section */}
        <div>
          <h5 className="text-xs font-semibold text-gray-600 mb-2 flex items-center">
            📝 Record Items
          </h5>
          <div className="space-y-1">
            {recordItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                <span className="text-base flex-shrink-0">{item.emoji}</span>
                <span className="text-sm text-gray-700">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
