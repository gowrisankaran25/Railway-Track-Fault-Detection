import os

files = {
    "dashboard/src/context/AuthContext.jsx": """import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage on mount
    const storedUser = localStorage.getItem('rcc_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock authentication
    if (email && password) {
      const mockUser = {
        name: "Chief Engineer Sharma",
        email: email,
        role: "Divisional Officer",
        division: "Northern Railway"
      };
      setUser(mockUser);
      localStorage.setItem('rcc_user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rcc_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
""",
    "dashboard/src/pages/Login.jsx": """import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AlertCircle, Lock, Mail, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    const success = login(email, password);
    if (success) {
      toast.success('Login Successful');
      navigate('/');
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-dark)'
    }}>
      <div className="glass-panel" style={{ width: '400px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', marginBottom: '10px' }}>
          <AlertCircle color="var(--accent)" size={32} />
          <h1 style={{ fontSize: '1.5rem', mragin: 0 }}>RCC <span style={{color: 'var(--accent)'}}>Login</span></h1>
        </div>
        
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>
          Secure Command Center Access
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', top: '14px', left: '14px', color: 'var(--text-secondary)' }} />
            <input 
              type="email" 
              placeholder="Officer Email / Badge ID" 
              className="text-input" 
              style={{ paddingLeft: '40px', margin: 0 }}
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', top: '14px', left: '14px', color: 'var(--text-secondary)' }} />
            <input 
              type="password" 
              placeholder="Secure Password" 
              className="text-input" 
              style={{ paddingLeft: '40px', margin: 0 }}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked /> Remember Me
            </label>
            <span style={{ cursor: 'pointer', color: 'var(--accent)' }}>Forgot Password?</span>
          </div>
          
          <button type="submit" className="primary-btn" style={{ justifyContent: 'center', marginTop: '10px' }}>
            Authenticate <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
""",
    "dashboard/src/App.jsx": """import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)', color: 'var(--text-primary)'}}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};

// Layout wrapper for authenticated pages
function AppLayout({ children }) {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <header className="header">
          <h1><span>Railway</span> Command Center</h1>
          <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
            <span style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>Live Monitoring Active</span>
            <div style={{width: '10px', height: '10px', borderRadius: '50%', background: 'var(--minor)', boxShadow: '0 0 10px var(--minor)'}}></div>
          </div>
        </header>
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

function MainApp() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout><Dashboard /></AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/stats" element={
          <ProtectedRoute>
            <AppLayout><Stats /></AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <AppLayout><Settings /></AppLayout>
          </ProtectedRoute>
        } />
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
""",
    "dashboard/src/components/Sidebar.jsx": """import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Map, BarChart2, Settings, AlertCircle, Sun, Moon, Bell, LogOut, User } from 'lucide-react';
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
""",
    "dashboard/src/services/api.js": """import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const MOCK_FAULTS = [
  { report_id: 1, severity: 'critical', fault_type: 'missing_fishplate', lat: 28.6500, lng: 77.1500, confidence_score: 0.95, status: 'pending', reported_by: 'Drone-Alpha', detected_at: new Date(Date.now() - 120000).toISOString(), image_url: 'https://images.unsplash.com/photo-1541818293963-356a422a59a7?auto=format&fit=crop&q=80&w=800' },
  { report_id: 2, severity: 'major', fault_type: 'crack', lat: 28.6550, lng: 77.1520, confidence_score: 0.88, status: 'pending', reported_by: 'Inspector-Raj', detected_at: new Date(Date.now() - 900000).toISOString(), image_url: 'https://images.unsplash.com/photo-1580983537021-3d71206f6580?auto=format&fit=crop&q=80&w=800' },
  { report_id: 3, severity: 'minor', fault_type: 'vegetation', lat: 28.6600, lng: 77.1480, confidence_score: 0.76, status: 'resolved', reported_by: 'Drone-Beta', detected_at: new Date(Date.now() - 3600000).toISOString(), image_url: 'https://images.unsplash.com/photo-1517457223293-1811eef2a87a?auto=format&fit=crop&q=80&w=800' },
];

const MOCK_STATS = {
  total_faults: 1248,
  critical_faults: 42,
  pending_verifications: 89
};

export const getFaults = async (filters = {}) => {
  try {
    const response = await api.get('/faults', { params: filters });
    // If backend returns data, map image URLs since backend doesn't have real images yet
    return response.data.map(fault => ({
      ...fault, 
      image_url: fault.fault_type.includes('crack') ? 'https://images.unsplash.com/photo-1580983537021-3d71206f6580?auto=format&fit=crop&q=80&w=800' : 'https://images.unsplash.com/photo-1541818293963-356a422a59a7?auto=format&fit=crop&q=80&w=800'
    }));
  } catch (error) {
    console.warn('Backend connection failed. Falling back to mock data.', error.message);
    return MOCK_FAULTS;
  }
};

export const getDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    console.warn('Backend connection failed. Falling back to mock data.', error.message);
    return MOCK_STATS;
  }
};
""",
    "dashboard/src/pages/Dashboard.jsx": """import React, { useState, useEffect, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Activity, MapPin, AlertTriangle, X, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFaults } from '../services/api';
import { ThemeContext } from '../context/ThemeContext';

const createCustomIcon = (type) => {
  const color = type === 'critical' ? '#ef4444' : type === 'major' ? '#f59e0b' : '#10b981';
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${color};"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

export default function Dashboard() {
  const [faults, setFaults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFault, setSelectedFault] = useState(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchFaults = async () => {
      setLoading(true);
      const data = await getFaults();
      setFaults(data);
      setLoading(false);
    };
    fetchFaults();
  }, []);

  const tileLayerUrl = theme === 'light' 
    ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="dashboard-grid" style={{position: 'relative'}}>
      <div className="glass-panel map-wrapper" style={{ padding: '8px', zIndex: 1 }}>
        <MapContainer center={[28.6500, 77.1500]} zoom={14} className="map-container">
          <TileLayer
            key={theme}
            url={tileLayerUrl}
            attribution='&copy; CARTO'
          />
          
          <Circle center={[28.6400, 77.1600]} pathOptions={{color: 'transparent', fillColor: '#ef4444', fillOpacity: 0.15}} radius={800} />
          <Circle center={[28.6650, 77.1400]} pathOptions={{color: 'transparent', fillColor: '#f59e0b', fillOpacity: 0.15}} radius={600} />

          {faults.map(fault => (
            <Marker 
              key={fault.report_id} 
              position={[fault.lat, fault.lng]} 
              icon={createCustomIcon(fault.severity)}
              eventHandlers={{ click: () => setSelectedFault(fault) }}
            >
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 1 }}>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>
          <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={20} color="var(--critical)" /> 
            Recent Alerts {loading && <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>(Updating...)</span>}
          </h2>
        </div>
        
        <div className="fault-list">
          {faults.length === 0 && !loading && <p style={{color: 'var(--text-secondary)'}}>No active faults detected.</p>}
          {faults.map(fault => (
            <div key={fault.report_id} className="fault-item" onClick={() => setSelectedFault(fault)}>
              <div className="fault-info">
                <h3 style={{textTransform: 'capitalize'}}>{fault.fault_type.replace('_', ' ')}</h3>
                <p style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin size={12} /> Lat: {parseFloat(fault.lat).toFixed(3)}, Lng: {parseFloat(fault.lng).toFixed(3)}
                </p>
                <p style={{ marginTop: '4px', fontSize: '0.75rem' }}>
                  {new Date(fault.detected_at).toLocaleString()}
                </p>
              </div>
              <span className={`badge ${fault.severity}`}>{fault.severity}</span>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedFault && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="modal-overlay glass-panel"
          >
            <div className="modal-header">
              <h3 style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <Camera size={20} /> Field Capture Feed
              </h3>
              <button className="icon-btn" onClick={() => setSelectedFault(null)}><X size={20} /></button>
            </div>
            
            <div className="modal-content">
              <div className="mock-drone-feed" style={{
                backgroundImage: `url(${selectedFault.image_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8)'
              }}>
                <div className="yolo-box" style={{
                  borderColor: selectedFault.severity === 'critical' ? '#ef4444' : '#f59e0b'
                }}>
                  <span className="yolo-label" style={{
                    backgroundColor: selectedFault.severity === 'critical' ? '#ef4444' : '#f59e0b'
                  }}>
                    {selectedFault.fault_type} {(selectedFault.confidence_score * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="feed-hud" style={{
                  textShadow: '0px 0px 8px #000, 0px 0px 4px #10b981'
                }}>
                  <span>REC • {selectedFault.reported_by}</span>
                  <span>{new Date(selectedFault.detected_at).toLocaleTimeString()}</span>
                </div>
              </div>
              
              <div className="modal-details">
                <div className="detail-row">
                  <span>Coordinates:</span>
                  <strong>{parseFloat(selectedFault.lat).toFixed(4)}, {parseFloat(selectedFault.lng).toFixed(4)}</strong>
                </div>
                <div className="detail-row">
                  <span>Status:</span>
                  <strong style={{textTransform: 'capitalize'}}>{selectedFault.status}</strong>
                </div>
                <div className="detail-actions">
                  <button className="primary-btn dispatch-btn">Dispatch Inspector</button>
                  <button className="secondary-btn">Mark False Positive</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
"""
}

for filepath, content in files.items():
    full_path = os.path.join(r"d:\railway-track-fault-detection", filepath)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Auth and real image modal implemented successfully!")
