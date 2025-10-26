import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SimpleLogin from './pages/SimpleLogin';
import ProtectedRoute from './components/common/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import AIChatPanel from './components/AIChatPanel';
import MoodDisplayCard from './components/MoodDisplayCard';
import DiaryPanel from './components/DiaryPanel';
import TaskPanel from './components/TaskPanel';
import Logo from './components/Logo';
import AITest from './components/AITest';
import moodicatImage from './assets/moodicat_cry.png';

// 认证后的主界面
function MainLayout() {
  const [activePanel, setActivePanel] = useState('mood');
  const { logout } = useAuth();

  return (
      <div className="min-h-screen" style={{backgroundColor: '#38BECF'}}>
        {/* Background Mascot */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <img 
            src={moodicatImage} 
            alt="Moodicat Mascot" 
            className="absolute bottom-0 right-0 w-96 h-96 object-contain opacity-20"
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex h-screen">
          {/* Left Side - AI Chat Panel */}
          <div className="w-1/2 p-6">
            <AIChatPanel />
          </div>

          {/* Right Side - Content Panels */}
          <div className="w-1/2 p-6">
            {/* Header with Logo */}
            <div className="flex items-center justify-between mb-6">
              <Logo />
              <div className="flex items-center gap-4">
                <div className="text-white text-2xl font-bold">MOODICAT</div>
                <button onClick={logout} className="px-3 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30">Logout</button>
              </div>
            </div>

            {/* Panel Selection Buttons */}
            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => setActivePanel('mood')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activePanel === 'mood'
                    ? 'bg-white text-teal-600 shadow-lg transform scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
              Mood
              </button>
              <button
                onClick={() => setActivePanel('diary')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activePanel === 'diary'
                    ? 'bg-white text-teal-600 shadow-lg transform scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                Diary
              </button>
              <button
                onClick={() => setActivePanel('tasks')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activePanel === 'tasks'
                    ? 'bg-white text-teal-600 shadow-lg transform scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                Tasks
              </button>
              <button
                onClick={() => setActivePanel('test')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activePanel === 'test'
                    ? 'bg-white text-teal-600 shadow-lg transform scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                🧪 Test
              </button>
            </div>

            {/* Panel Content */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              {activePanel === 'mood' && <MoodDisplayCard />}
              {activePanel === 'diary' && <DiaryPanel />}
              {activePanel === 'tasks' && <TaskPanel />}
              {activePanel === 'test' && <AITest />}
            </div>
          </div>
        </div>
      </div>
  );
}

export default function App() {
  const { user, isLoading } = useAuth();

  // 全局加载态
  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#38BECF'}}>
        <div className="text-center">
        <img src="client/src/assets/moodicat_cry.png" alt="loading cat" className="w-24 h-24 mx-auto mb-4" />
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <SimpleLogin />} />
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      } />
      <Route path="*" element={user ? <Navigate to="/" replace /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}