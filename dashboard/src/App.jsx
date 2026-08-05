import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import Login from './pages/Login';
import SystemHealth from './pages/SystemHealth';
import { default as Archive } from './pages/Archive';
import Drones from './pages/Drones';
import Inspectors from './pages/Inspectors';
import PredictiveMaintenance from './pages/PredictiveMaintenance';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import CollaborationPanel from './components/CollaborationPanel';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function AppLayout({ children }) {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <header className="header">
          <h1><span>Railway</span> Command Center</h1>
          <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
            <span className="hide-mobile" style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>Live Monitoring Active</span>
            <div style={{width: '10px', height: '10px', borderRadius: '50%', background: 'var(--minor)', boxShadow: '0 0 10px var(--minor)'}}></div>
            <CollaborationPanel />
          </div>
        </header>
        <main className="main-content">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

function MainApp() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
        <Route path="/stats" element={<ProtectedRoute><AppLayout><Stats /></AppLayout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />
        <Route path="/system-health" element={<ProtectedRoute><AppLayout><SystemHealth /></AppLayout></ProtectedRoute>} />
        <Route path="/archive" element={<ProtectedRoute><AppLayout><Archive /></AppLayout></ProtectedRoute>} />
        <Route path="/drones" element={<ProtectedRoute><AppLayout><Drones /></AppLayout></ProtectedRoute>} />
        <Route path="/inspectors" element={<ProtectedRoute><AppLayout><Inspectors /></AppLayout></ProtectedRoute>} />
        <Route path="/predictive" element={<ProtectedRoute><AppLayout><PredictiveMaintenance /></AppLayout></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{
          style: { background: 'var(--bg-card)', color: 'var(--text-primary)', backdropFilter: 'blur(10px)', border: '1px solid var(--border)' }
        }} />
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
