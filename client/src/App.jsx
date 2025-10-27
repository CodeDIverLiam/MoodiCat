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
          <div className="w-1/2 p-6 flex flex-col h-full">
            {/* Top Header - Fixed height */}
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <Logo />
              <div className="flex items-center gap-4">
                <div className="text-white text-2xl font-bold">MOODICAT</div>
                <button onClick={logout} className="px-3 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30">Logout</button>
              </div>
            </div>

            {/* Mood Panel - Fixed height (25-30% of available space) */}
            <div className="h-[30%] flex-shrink-0 mb-4">
              <MoodDisplayCard />
            </div>

            {/* Bottom Area - Diary and Task Panels side by side */}
            <div className="flex-1 flex gap-4 min-h-0">
              {/* Diary Panel - Left half */}
              <div className="w-1/2 min-h-0">
                <DiaryPanel />
              </div>
              
              {/* Task Panel - Right half */}
              <div className="w-1/2 min-h-0">
                <TaskPanel />
              </div>
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