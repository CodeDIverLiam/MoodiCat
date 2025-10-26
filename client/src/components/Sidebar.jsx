import { Plus, Calendar, User, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-20 flex flex-col justify-between items-center py-8" style={{backgroundColor: '#38BECF'}}>
      <div className="flex flex-col gap-6">
        <button className="w-12 h-12 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center hover:scale-105">
          <Plus className="w-6 h-6" style={{color: '#38BECF'}} />
        </button>
        <button className="w-12 h-12 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center hover:scale-105">
          <Calendar className="w-6 h-6" style={{color: '#38BECF'}} />
        </button>
        <button className="w-12 h-12 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center hover:scale-105">
          <User className="w-6 h-6" style={{color: '#38BECF'}} />
        </button>
        <button className="w-12 h-12 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center hover:scale-105">
          <Settings className="w-6 h-6" style={{color: '#38BECF'}} />
        </button>
      </div>
      <div className="text-xs text-white font-medium">v1.0</div>
    </aside>
  );
}
