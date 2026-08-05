import os

files = {
    "dashboard/src/components/BottomNav.jsx": """import React from 'react';
import { NavLink } from 'react-router-dom';
import { Map, BarChart2, Navigation, Settings } from 'lucide-react';

export default function BottomNav() {
  return (
    <div className="bottom-nav glass-panel">
      <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
        <Map size={24} />
      </NavLink>
      <NavLink to="/drones" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
        <Navigation size={24} />
      </NavLink>
      <NavLink to="/stats" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
        <BarChart2 size={24} />
      </NavLink>
      <NavLink to="/settings" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
        <Settings size={24} />
      </NavLink>
    </div>
  );
}
""",
    "dashboard/src/pages/Drones.jsx": """import React from 'react';
import { Battery, Wifi, Navigation, BatteryCharging, PowerOff } from 'lucide-react';
import { motion } from 'framer-motion';

const DRONES = [
  { id: 'DRN-Alpha', status: 'patrolling', battery: 78, location: 'Sector 4', signal: 'Strong', lastUpdate: 'Just now' },
  { id: 'DRN-Beta', status: 'charging', battery: 12, location: 'Base Station 1', signal: 'Strong', lastUpdate: '2 min ago' },
  { id: 'DRN-Gamma', status: 'patrolling', battery: 45, location: 'Sector 9', signal: 'Weak', lastUpdate: '45 sec ago' },
  { id: 'DRN-Delta', status: 'offline', battery: 0, location: 'Maintenance', signal: 'None', lastUpdate: '1 day ago' },
];

export default function Drones() {
  const getStatusColor = (status) => {
    switch (status) {
      case 'patrolling': return 'var(--minor)'; // Green
      case 'charging': return 'var(--major)'; // Yellow
      case 'offline': return 'var(--critical)'; // Red
      default: return 'var(--text-secondary)';
    }
  };

  const getBatteryIcon = (battery, status) => {
    if (status === 'charging') return <BatteryCharging size={20} color="var(--major)" />;
    if (battery > 60) return <Battery size={20} color="var(--minor)" />;
    if (battery > 20) return <Battery size={20} color="var(--major)" />;
    return <Battery size={20} color="var(--critical)" />;
  };

  return (
    <div className="page-container" style={{padding: '20px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
        <h1 className="page-title" style={{marginBottom: 0}}>Fleet Management</h1>
        <button className="primary-btn">Deploy All Drones</button>
      </div>

      <div className="drone-grid">
        {DRONES.map((drone, idx) => (
          <motion.div 
            key={drone.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel" 
            style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Navigation size={20} color="var(--accent)" /> {drone.id}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: getStatusColor(drone.status), boxShadow: `0 0 8px ${getStatusColor(drone.status)}` }} />
                <span style={{ fontSize: '0.8rem', textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{drone.status}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'rgba(0,0,0,0.1)', padding: '15px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {getBatteryIcon(drone.battery, drone.status)}
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Battery</div>
                  <div style={{ fontWeight: 'bold' }}>{drone.battery}%</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {drone.status === 'offline' ? <PowerOff size={20} color="var(--critical)" /> : <Wifi size={20} color={drone.signal === 'Strong' ? 'var(--minor)' : 'var(--major)'} />}
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Signal</div>
                  <div style={{ fontWeight: 'bold' }}>{drone.signal}</div>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Location: <strong style={{ color: 'var(--text-primary)' }}>{drone.location}</strong></span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{drone.lastUpdate}</span>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
              <button className="secondary-btn" style={{flex: 1, padding: '8px', fontSize: '0.85rem'}} disabled={drone.status === 'offline'}>Return to Base</button>
              <button className="secondary-btn" style={{flex: 1, padding: '8px', fontSize: '0.85rem'}} disabled={drone.status === 'offline'}>View Cam</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
"""
}

sidebar_update = """import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Map, BarChart2, Settings, AlertCircle, Sun, Moon, Bell, LogOut, User, Navigation } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Sidebar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);

  const simulateAlert = () => {
    toast.error('New Critical Fault Detected: Track Misalignment (Lat: 28.67, Lng: 77.12)', { duration: 5000 });
  };

  return (
    <div className="sidebar glass-panel">
      <div className="sidebar-header">
        <AlertCircle color="var(--accent)" size={28} />
        <h2>RCC</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Map size={20} />
          <span>Live Map</span>
        </NavLink>
        <NavLink to="/drones" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Navigation size={20} />
          <span>Drone Fleet</span>
        </NavLink>
        <NavLink to="/stats" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <BarChart2 size={20} />
          <span>Statistics</span>
        </NavLink>
        <NavLink to="/settings" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>
      
      <div className="sidebar-footer" style={{ padding: '20px' }}>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
            <div style={{ background: 'var(--accent)', padding: '8px', borderRadius: '50%' }}>
              <User size={16} color="white" />
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{user.role}</p>
            </div>
          </div>
        )}
        
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
          <button onClick={toggleTheme} className="icon-btn" title="Toggle Theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={simulateAlert} className="icon-btn" title="Test Notification">
            <Bell size={18} />
            <span className="badge-dot"></span>
          </button>
          <button onClick={logout} className="icon-btn" title="Log Out">
            <LogOut size={18} />
          </button>
        </div>
        <div className="status-indicator">
          <div className="pulse-dot"></div>
          <span>System Online</span>
        </div>
      </div>
    </div>
  );
}
"""

app_update = """import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Drones from './pages/Drones';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';

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
        <Route path="/drones" element={<ProtectedRoute><AppLayout><Drones /></AppLayout></ProtectedRoute>} />
        <Route path="/stats" element={<ProtectedRoute><AppLayout><Stats /></AppLayout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />
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
"""

css_append = """

/* Drone Grid */
.drone-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

/* Mobile Responsive Adjustments */
.bottom-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: var(--bg-card);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--border);
  z-index: 1000;
  justify-content: space-around;
  align-items: center;
  padding: 0 10px;
}

.bottom-nav .nav-item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  color: var(--text-secondary);
}

.bottom-nav .nav-item.active {
  color: var(--accent);
  background: rgba(59, 130, 246, 0.1);
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
  
  .bottom-nav {
    display: flex;
  }
  
  .app-container {
    flex-direction: column;
  }
  
  .main-wrapper {
    margin-bottom: 60px; /* Space for bottom nav */
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
    grid-template-rows: 50vh auto;
  }
  
  .hide-mobile {
    display: none;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .settings-layout {
    flex-direction: column;
  }
  
  .modal-overlay {
    width: 90%;
    left: 5%;
    top: 5%;
    height: 90%;
  }
}
"""

files["dashboard/src/components/Sidebar.jsx"] = sidebar_update
files["dashboard/src/App.jsx"] = app_update

for filepath, content in files.items():
    full_path = os.path.join(r"d:\railway-track-fault-detection", filepath)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

with open(r"d:\railway-track-fault-detection\dashboard\src\index.css", "a", encoding="utf-8") as f:
    f.write(css_append)

print("Drones and Mobile Responsive Mode applied successfully!")
