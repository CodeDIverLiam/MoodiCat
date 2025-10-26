import { motion } from "framer-motion";

export default function ImportantCard() {
  return (
    <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-lg h-full flex flex-col">
      <div className="flex-1 space-y-3">
        {/* Tasks block */}
        <div className="space-y-2">
          <h3 className="font-bold text-sm text-gray-800 mb-2 flex items-center">
            ✔ Important Tasks
          </h3>
          <div className="space-y-1">
            <div className="flex items-center space-x-2 p-2 rounded-md bg-green-50 border border-green-200">
              <span className="text-green-600 text-sm">✅</span>
              <span className="text-xs text-gray-800">Call mom for her birthday</span>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-md bg-red-50 border border-red-200">
              <span className="text-red-500 text-sm">🔴</span>
              <span className="text-xs text-gray-800">Grocery shopping</span>
            </div>
          </div>
        </div>

        {/* Feelings block */}
        <div className="flex-1 space-y-2">
          <h3 className="font-bold text-sm text-gray-800 mb-2 flex items-center">
            💭 Today's Mood
          </h3>
          <div className="space-y-1 text-xs text-gray-600">
            <p className="text-gray-700 leading-relaxed">
              Feeling grateful and energized today! ✨ The morning coffee tasted especially good, and I'm excited about the new project.
            </p>
            <p className="text-gray-500 italic text-xs">
              "Every small step counts towards a bigger journey."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
