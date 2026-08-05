import os

files = {
    "dashboard/src/context/ThemeContext.jsx": """import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-mode' : '';
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
""",
    "dashboard/src/App.jsx": """import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import Dashboard from './pages/Dashboard';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';

function AppContent() {
  return (
    <Router>
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
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-right" toastOptions={{
        style: { background: 'var(--bg-card)', color: 'var(--text-primary)', backdropFilter: 'blur(10px)', border: '1px solid var(--border)' }
      }} />
      <AppContent />
    </ThemeProvider>
  );
}
""",
    "dashboard/src/components/Sidebar.jsx": """import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Map, BarChart2, Settings, AlertCircle, Sun, Moon, Bell } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import toast from 'react-hot-toast';

export default function Sidebar() {
  const { theme, toggleTheme } = useContext(ThemeContext);

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
      
      <div className="sidebar-footer">
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
          <button onClick={toggleTheme} className="icon-btn" title="Toggle Theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={simulateAlert} className="icon-btn" title="Test Notification">
            <Bell size={18} />
            <span className="badge-dot"></span>
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
    "dashboard/src/pages/Stats.jsx": """import React, { useState, useEffect } from 'react';
import { Activity, AlertOctagon, CheckCircle, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { getDashboardStats } from '../services/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

export default function Stats() {
  const [stats, setStats] = useState({
    total_faults: 0,
    critical_faults: 0,
    pending_verifications: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getDashboardStats();
      if (data) setStats(data);
    };
    fetchStats();
  }, []);

  const exportPDF = async () => {
    const toastId = toast.loading('Generating Report...');
    const element = document.getElementById('report-content');
    
    // Temporarily fix styles for html2canvas
    const originalBg = document.body.style.background;
    document.body.style.background = 'var(--bg-dark)';
    
    try {
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: null, logging: false });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('RCC_Maintenance_Report.pdf');
      toast.success('Report Downloaded!', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate report', { id: toastId });
    }
    
    document.body.style.background = originalBg;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } })
  };

  return (
    <div className="page-container" id="report-content" style={{padding: '20px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
        <h1 className="page-title" style={{marginBottom: 0}}>Analytics & Statistics</h1>
        <button onClick={exportPDF} className="primary-btn" style={{marginTop: 0}}>
          <Download size={18} /> Export PDF Report
        </button>
      </div>
      
      <div className="stats-grid">
        <motion.div custom={0} initial="hidden" animate="visible" variants={cardVariants} className="stat-card glass-panel">
          <div className="stat-icon" style={{backgroundColor: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent)'}}>
            <Activity size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Faults</h3>
            <p className="stat-value">{stats.total_faults}</p>
            <span className="stat-trend positive">Live from DB</span>
          </div>
        </motion.div>
        
        <motion.div custom={1} initial="hidden" animate="visible" variants={cardVariants} className="stat-card glass-panel">
          <div className="stat-icon" style={{backgroundColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--critical)'}}>
            <AlertOctagon size={24} />
          </div>
          <div className="stat-content">
            <h3>Critical Faults</h3>
            <p className="stat-value">{stats.critical_faults}</p>
            <span className="stat-trend negative">Requires attention</span>
          </div>
        </motion.div>
        
        <motion.div custom={2} initial="hidden" animate="visible" variants={cardVariants} className="stat-card glass-panel">
          <div className="stat-icon" style={{backgroundColor: 'rgba(16, 185, 129, 0.2)', color: 'var(--minor)'}}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>Pending Verification</h3>
            <p className="stat-value">{stats.pending_verifications}</p>
            <span className="stat-trend positive">Awaiting inspection</span>
          </div>
        </motion.div>
      </div>
      
      <div className="charts-container">
        <motion.div custom={3} initial="hidden" animate="visible" variants={cardVariants} className="chart-panel glass-panel">
          <h3>Faults by Severity</h3>
          <div className="mock-chart">
            <div className="chart-bar" style={{height: '80%', backgroundColor: 'var(--minor)'}}><span>Minor</span></div>
            <div className="chart-bar" style={{height: '50%', backgroundColor: 'var(--major)'}}><span>Major</span></div>
            <div className="chart-bar" style={{height: '30%', backgroundColor: 'var(--critical)'}}><span>Critical</span></div>
          </div>
        </motion.div>
        
        <motion.div custom={4} initial="hidden" animate="visible" variants={cardVariants} className="chart-panel glass-panel">
          <h3>Inspection Activity (7 Days)</h3>
          <div className="mock-chart trend">
            <div className="trend-point" style={{bottom: '20%', left: '0%'}}></div>
            <div className="trend-point" style={{bottom: '40%', left: '16%'}}></div>
            <div className="trend-point" style={{bottom: '35%', left: '33%'}}></div>
            <div className="trend-point" style={{bottom: '60%', left: '50%'}}></div>
            <div className="trend-point" style={{bottom: '50%', left: '66%'}}></div>
            <div className="trend-point" style={{bottom: '80%', left: '83%'}}></div>
            <div className="trend-point" style={{bottom: '75%', left: '100%'}}></div>
            <svg className="trend-line" viewBox="0 0 100 100" preserveAspectRatio="none">
               <polyline points="0,80 16,60 33,65 50,40 66,50 83,20 100,25" fill="none" stroke="var(--accent)" strokeWidth="3" />
            </svg>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
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
            key={theme} // Force re-render on theme change
            url={tileLayerUrl}
            attribution='&copy; CARTO'
          />
          
          {/* Predictive Heat Zones */}
          <Circle center={[28.6400, 77.1600]} pathOptions={{color: 'transparent', fillColor: '#ef4444', fillOpacity: 0.15}} radius={800} />
          <Circle center={[28.6650, 77.1400]} pathOptions={{color: 'transparent', fillColor: '#f59e0b', fillOpacity: 0.15}} radius={600} />

          {faults.map(fault => (
            <Marker 
              key={fault.report_id} 
              position={[fault.lat, fault.lng]} 
              icon={createCustomIcon(fault.severity)}
              eventHandlers={{ click: () => setSelectedFault(fault) }}
            >
              {/* Tooltip removed in favor of modal click */}
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

      {/* Live Camera Feed Modal */}
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
              <div className="mock-drone-feed">
                <div className="yolo-box" style={{
                  borderColor: selectedFault.severity === 'critical' ? '#ef4444' : '#f59e0b'
                }}>
                  <span className="yolo-label" style={{
                    backgroundColor: selectedFault.severity === 'critical' ? '#ef4444' : '#f59e0b'
                  }}>
                    {selectedFault.fault_type} {(selectedFault.confidence_score * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="feed-hud">
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

css_append = """

/* Light Mode Overrides */
.light-mode {
  --bg-dark: #f8fafc;
  --bg-card: rgba(255, 255, 255, 0.8);
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --border: rgba(0, 0, 0, 0.1);
}

.light-mode body {
  background-image: 
    radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.08) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(239, 68, 68, 0.05) 0px, transparent 50%);
}

.light-mode .leaflet-container {
  background: #e2e8f0 !important;
}

.light-mode .fault-item {
  background: rgba(0, 0, 0, 0.02);
  border-color: rgba(0, 0, 0, 0.05);
}

.light-mode .fault-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.light-mode .form-group {
  background: rgba(255, 255, 255, 0.5);
}

.light-mode .text-input {
  background: white;
  color: #0f172a;
}

/* Modal CSS */
.modal-overlay {
  position: absolute;
  top: 10%;
  left: 20%;
  width: 60%;
  height: 80%;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border);
  padding-bottom: 15px;
  margin-bottom: 15px;
}

.icon-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  position: relative;
}

.icon-btn:hover {
  background: rgba(255,255,255,0.1);
  color: var(--text-primary);
}

.light-mode .icon-btn:hover { background: rgba(0,0,0,0.1); }

.badge-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  background-color: var(--critical);
  border-radius: 50%;
  border: 2px solid var(--bg-card);
}

.modal-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.mock-drone-feed {
  flex: 1;
  background: #000;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  background-image: linear-gradient(rgba(0,255,0,0.03) 1px, transparent 1px);
  background-size: 100% 4px;
}

.yolo-box {
  position: absolute;
  top: 30%;
  left: 40%;
  width: 20%;
  height: 30%;
  border: 2px solid #ef4444;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
}

.yolo-label {
  position: absolute;
  top: -24px;
  left: -2px;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px 4px 4px 0;
}

.feed-hud {
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
  color: #10b981;
  font-family: monospace;
  text-shadow: 0 0 5px #10b981;
}

.modal-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba(0,0,0,0.1);
  padding: 15px;
  border-radius: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.detail-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.dispatch-btn { width: 100%; justify-content: center; }

.secondary-btn {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border);
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  width: 100%;
  justify-content: center;
}

.secondary-btn:hover { background: rgba(255,255,255,0.05); }
.light-mode .secondary-btn:hover { background: rgba(0,0,0,0.05); }
"""

for filepath, content in files.items():
    full_path = os.path.join(r"d:\railway-track-fault-detection", filepath)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

with open(r"d:\railway-track-fault-detection\dashboard\src\index.css", "a", encoding="utf-8") as f:
    f.write(css_append)

print("Advanced UI applied successfully!")
