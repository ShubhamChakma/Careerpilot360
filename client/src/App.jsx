import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Spinner from './components/ui/Spinner';

import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import OAArenaPage from './pages/OAArena/OAArenaPage';
import SolvePage from './pages/OAArena/SolvePage';
import DocsHubPage from './pages/DocsHub/DocsHubPage';
import DocReader from './pages/DocsHub/DocReader';
import InterviewRoom from './pages/InterviewStudio/InterviewRoom';
import ScannerPage from './pages/ATSScanner/ScannerPage';
import PrepBotPage from './pages/PrepBot/PrepBotPage';
import JobPredictPage from './pages/JobPredict/JobPredictPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthStore();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><Spinner size="lg" /></div>;
  return user ? children : <Navigate to="/login" replace />;
};

export default function App() {
  const { setUser, clearUser, setLoading } = useAuthStore();
  const { isDark } = useThemeStore();

  useEffect(() => {
    if (!auth) {
      // Firebase not configured — clear loading state so the app renders
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
      else clearUser();
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <BrowserRouter>
      <div className={`min-h-screen flex flex-col ${isDark ? 'bg-[#0D0D0D] text-[#E8E8E8]' : 'bg-[#F5F5F5] text-[#1A1A1A]'}`}>
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/oa-arena" element={<ProtectedRoute><OAArenaPage /></ProtectedRoute>} />
            <Route path="/oa-arena/solve/:id" element={<ProtectedRoute><SolvePage /></ProtectedRoute>} />
            <Route path="/docs" element={<ProtectedRoute><DocsHubPage /></ProtectedRoute>} />
            <Route path="/docs/:slug" element={<ProtectedRoute><DocReader /></ProtectedRoute>} />
            <Route path="/interview" element={<ProtectedRoute><InterviewRoom /></ProtectedRoute>} />
            <Route path="/ats-scanner" element={<ProtectedRoute><ScannerPage /></ProtectedRoute>} />
            <Route path="/prep-bot" element={<ProtectedRoute><PrepBotPage /></ProtectedRoute>} />
            <Route path="/job-predict" element={<ProtectedRoute><JobPredictPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}