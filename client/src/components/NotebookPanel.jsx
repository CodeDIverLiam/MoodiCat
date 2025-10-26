import { useState } from "react";
import Heatmap from "./Heatmap";
import MoodBar from "./MoodBar";
import ImportantCard from "./ImportantCard";
import TimeSelector from "./TimeSelector";
import TaskListNotebook from "./TaskListNotebook";

export default function NotebookPanel() {
  const [selectedTime, setSelectedTime] = useState('morning');

  return (
    <aside className="w-full h-full dot-pattern overflow-y-auto shadow-lg">
      <div className="p-6 space-y-8">
        {/* Upper part: calendar + mood + important items */}
        <div className="space-y-6">
          {/* Contribution calendar */}
          <div className="mb-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Activity Heatmap</h3>
            <Heatmap />
          </div>
          
          {/* Weekly mood bar and important items card - horizontal layout */}
          <div className="grid grid-cols-2 gap-4 items-stretch">
            <MoodBar />
            <ImportantCard />
          </div>
        </div>
        
        {/* Lower part: time blocks + task list */}
        <div className="space-y-6">
          <h3 className="font-bold text-lg text-gray-800">Time Blocks & Tasks</h3>
          
          <div className="grid grid-cols-10 gap-6">
            {/* Left: time selector - 30% */}
            <div className="col-span-3 space-y-4">
              <h4 className="font-medium text-sm text-gray-700">Select Time</h4>
              <TimeSelector 
                selectedTime={selectedTime} 
                onTimeChange={setSelectedTime} 
              />
            </div>
            
            {/* Right: task list - 70% */}
            <div className="col-span-7 space-y-4">
              <h4 className="font-medium text-sm text-gray-700">Tasks</h4>
              <TaskListNotebook selectedTime={selectedTime} />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
