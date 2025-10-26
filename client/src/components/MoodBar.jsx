import { useState } from "react";

export default function MoodBar() {
  const [weekData] = useState([
    { day: 'Mon', mood: 4, energy: 5 },
    { day: 'Tue', mood: 3, energy: 4 },
    { day: 'Wed', mood: 5, energy: 3 },
    { day: 'Thu', mood: 2, energy: 4 },
    { day: 'Fri', mood: 4, energy: 5 },
    { day: 'Sat', mood: 5, energy: 4 },
    { day: 'Sun', mood: 3, energy: 3 },
  ]);

  const getMoodColor = (mood) => {
    if (mood <= 1) return 'bg-red-400';
    if (mood <= 2) return 'bg-yellow-400';
    if (mood <= 3) return 'bg-green-300';
    if (mood <= 4) return 'bg-green-400';
    return 'bg-green-500';
  };

  const getEnergyColor = (energy) => {
    if (energy <= 1) return 'bg-blue-200';
    if (energy <= 2) return 'bg-blue-300';
    if (energy <= 3) return 'bg-blue-400';
    if (energy <= 4) return 'bg-blue-500';
    return 'bg-blue-600';
  };

  return (
    <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-lg h-full flex flex-col">
      <h3 className="font-bold text-sm text-gray-800 mb-2 flex items-center">
        📊 Weekly Mood & Energy
      </h3>
      
      <div className="flex-1 space-y-2">
        {/* Mood block */}
        <div className="bg-gray-50 p-2 rounded-md border border-gray-200">
          <h4 className="font-semibold text-sm text-gray-800 mb-2 flex items-center">
            😊 Weekly Mood
          </h4>
          <div className="flex items-end gap-1 h-6">
            {weekData.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-5 rounded-t-sm ${getMoodColor(item.mood)} hover:opacity-80 transition-opacity`}
                  style={{ height: `${Math.max(item.mood * 3, 2)}px` }}
                ></div>
                <div className="text-xs text-gray-500 mt-1 font-medium">{item.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Energy block */}
        <div className="bg-gray-50 p-2 rounded-md border border-gray-200">
          <h4 className="font-semibold text-sm text-gray-800 mb-2 flex items-center">
            ⚡ Weekly Energy
          </h4>
          <div className="flex items-end gap-1 h-6">
            {weekData.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-5 rounded-t-sm ${getEnergyColor(item.energy)} hover:opacity-80 transition-opacity`}
                  style={{ height: `${Math.max(item.energy * 3, 2)}px` }}
                ></div>
                <div className="text-xs text-gray-500 mt-1 font-medium">{item.day}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
