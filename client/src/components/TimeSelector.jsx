import { useState } from "react";

export default function TimeSelector({ selectedTime, onTimeChange }) {
  const timeBlocks = [
    { id: 'morning', label: 'Morning', time: '06:00–12:00' },
    { id: 'noon', label: 'Noon', time: '12:00–14:00' },
    { id: 'afternoon', label: 'Afternoon', time: '14:00–18:00' },
    { id: 'evening', label: 'Evening', time: '18:00–24:00' },
    { id: 'midnight', label: 'Midnight', time: '00:00–06:00' }
  ];

  return (
    <div className="space-y-2 h-full">
      <h3 className="font-bold text-sm text-gray-800 mb-2 flex items-center">
        ⏰ Time Select
      </h3>
      {timeBlocks.map((block) => (
        <button
          key={block.id}
          onClick={() => onTimeChange(block.id)}
          className={`w-full p-3 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer ${
            selectedTime === block.id
              ? 'shadow-lg transform scale-105'
              : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md'
          }`}
          style={selectedTime === block.id ? {
            backgroundColor: '#F4A261',
            borderColor: '#F4A261',
            color: 'white'
          } : {}}
        >
          <div className={`font-medium text-sm ${selectedTime === block.id ? 'text-white' : 'text-gray-800'}`}>
            {block.label}
          </div>
          <div className={`text-xs ${selectedTime === block.id ? 'text-white' : 'text-gray-600'}`}>
            {block.time}
          </div>
        </button>
      ))}
    </div>
  );
}