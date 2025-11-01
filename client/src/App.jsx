import { useState } from 'react';
// 导入 Link 和 ReportsPage
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import SimpleLogin from './pages/SimpleLogin';
import ProtectedRoute from './components/common/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import AIChatPanel from './components/AIChatPanel';
import DiaryPanel from './components/DiaryPanel';
import TaskPanel from './components/TaskPanel';
import Logo from './components/Logo';
import AITest from './components/AITest';
import moodicatImage from './assets/moodicat_cry.png';
import ReportsPage from './pages/ReportsPage'; // 1. 导入 ReportsPage

// (MainLayout 函数已修改，添加了 "Reports" 链接)
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
                            {/* 2. 添加 Reports 链接 */}
                            <Link
                                to="/reports"
                                className="px-3 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30"
                            >
                                Reports
                            </Link>
                            <button onClick={logout} className="px-3 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30">Logout</button>
                        </div>
                    </div>

                    <div className="h-[40%] flex-shrink-0 mb-4">
                        <DiaryPanel />
                    </div>

                    <div className="flex-1 min-h-0">
                        <TaskPanel />
                    </div>

                </div>
            </div>
        </div>
    );
}

// (App 函数已修改，添加了 "/reports" 路由)
export default function App() {
    const { user, isLoading } = useAuth();

    if (isLoading && !user) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#38BECF'}}>
                <div className="text-center">
                    <img src={moodicatImage} alt="loading cat" className="w-24 h-24 mx-auto mb-4" />
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
            {/* 3. 添加新的 Reports 路由 */}
            <Route path="/reports" element={
                <ProtectedRoute>
                    <div className="p-8" style={{backgroundColor: '#E0F7FA', minHeight: '100vh'}}>
                        <div className="max-w-4xl mx-auto">
                            {/* 添加一个返回首页的链接 */}
                            <Link to="/" className="text-teal-700 hover:text-teal-900 mb-4 inline-block">
                                &larr; Back to Main
                            </Link>
                            <ReportsPage />
                        </div>
                    </div>
                </ProtectedRoute>
            } />
            <Route path="*" element={user ? <Navigate to="/" replace /> : <Navigate to="/login" replace />} />
        </Routes>
    );
}