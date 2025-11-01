import { useState } from 'react';
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
import ReportsPage from './pages/ReportsPage';
import { useTodayMoodSummary } from './hooks/useReports'; // 1. Import new hook

/**
 * [NEW] Small panel component to display today's mood
 */
function TodayMoodPanel() {
    const { mood, isLoading } = useTodayMoodSummary();

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            );
        }
        // Check if mood is likely an emoji (basic check)
        if (mood && mood.length <= 2 && mood.codePointAt(0) > 255) {
            return <span className="text-lg">{mood}</span>;
        }
        // Otherwise, show as text
        return <span className="text-xs font-semibold">{mood || '...'}</span>;
    };

    return (
        <div
            title="Today's AI Mood Summary"
            className="px-3 py-2 bg-white/20 text-white rounded-lg flex items-center justify-center min-w-[80px]"
        >
            {renderContent()}
        </div>
    );
}

function MainLayout() {
    const { logout } = useAuth();

    return (
        <div className="min-h-screen" style={{backgroundColor: '#38BECF'}}>
            <div className="fixed inset-0 pointer-events-none z-0">
                <img
                    src={moodicatImage}
                    alt="Moodicat Mascot"
                    className="absolute bottom-0 right-0 w-96 h-96 object-contain opacity-20"
                />
            </div>

            <div className="relative z-10 flex h-screen">
                <div className="w-1/2 p-6">
                    <AIChatPanel />
                </div>

                <div className="w-1/2 p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6 flex-shrink-0">
                        <Logo />
                        <div className="flex items-center gap-4">
                            <div className="text-white text-2xl font-bold">MOODICAT</div>

                            {/* 2. Add the new TodayMoodPanel here */}
                            <TodayMoodPanel />

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
            <Route path="/reports" element={
                <ProtectedRoute>
                    <div className="p-8" style={{backgroundColor: '#E0F7FA', minHeight: '100vh'}}>
                        <div className="max-w-4xl mx-auto">
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