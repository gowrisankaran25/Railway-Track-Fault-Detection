import os

components = {
    "dashboard/src/components/Sidebar.jsx": """import React from 'react';
import { NavLink } from 'react-router-dom';
import { Map, BarChart2, Settings, AlertCircle } from 'lucide-react';

export default function Sidebar() {
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
        <div className="status-indicator">
          <div className="pulse-dot"></div>
          <span>System Online</span>
        </div>
      </div>
    </div>
  );
}
""",
    "dashboard/src/pages/Stats.jsx": """import React from 'react';
import { Activity, AlertOctagon, CheckCircle } from 'lucide-react';

export default function Stats() {
  return (
    <div className="page-container">
      <h1 className="page-title">Analytics & Statistics</h1>
      
      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{backgroundColor: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent)'}}>
            <Activity size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Inspections</h3>
            <p className="stat-value">1,248</p>
            <span className="stat-trend positive">+12% this week</span>
          </div>
        </div>
        
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{backgroundColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--critical)'}}>
            <AlertOctagon size={24} />
          </div>
          <div className="stat-content">
            <h3>Critical Faults</h3>
            <p className="stat-value">42</p>
            <span className="stat-trend negative">-5% this week</span>
          </div>
        </div>
        
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{backgroundColor: 'rgba(16, 185, 129, 0.2)', color: 'var(--minor)'}}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>Resolved Issues</h3>
            <p className="stat-value">892</p>
            <span className="stat-trend positive">+18% this week</span>
          </div>
        </div>
      </div>
      
      <div className="charts-container">
        <div className="chart-panel glass-panel">
          <h3>Faults by Severity</h3>
          <div className="mock-chart">
            <div className="chart-bar" style={{height: '80%', backgroundColor: 'var(--minor)'}}><span>Minor</span></div>
            <div className="chart-bar" style={{height: '50%', backgroundColor: 'var(--major)'}}><span>Major</span></div>
            <div className="chart-bar" style={{height: '30%', backgroundColor: 'var(--critical)'}}><span>Critical</span></div>
          </div>
        </div>
        
        <div className="chart-panel glass-panel">
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
        </div>
      </div>
    </div>
  );
}
""",
    "dashboard/src/pages/Settings.jsx": """import React from 'react';
import { Save, Bell, Shield, Map as MapIcon } from 'lucide-react';

export default function Settings() {
  return (
    <div className="page-container">
      <h1 className="page-title">System Settings</h1>
      
      <div className="settings-layout">
        <div className="settings-sidebar glass-panel">
          <ul className="settings-menu">
            <li className="active"><Bell size={18}/> Notifications</li>
            <li><MapIcon size={18}/> Map Preferences</li>
            <li><Shield size={18}/> Security & Roles</li>
          </ul>
        </div>
        
        <div className="settings-content glass-panel">
          <h2>Notification Preferences</h2>
          <p className="settings-desc">Configure how and when you receive alerts for track faults.</p>
          
          <div className="form-group">
            <label className="switch-label">
              <div>
                <strong>Critical Fault SMS Alerts</strong>
                <p>Send an SMS immediately when a critical fault is detected.</p>
              </div>
              <input type="checkbox" defaultChecked className="toggle" />
            </label>
          </div>
          
          <div className="form-group">
            <label className="switch-label">
              <div>
                <strong>Email Daily Summary</strong>
                <p>Receive a daily digest of all inspections and faults.</p>
              </div>
              <input type="checkbox" defaultChecked className="toggle" />
            </label>
          </div>
          
          <div className="form-group">
            <label>Alert Phone Number</label>
            <input type="text" className="text-input" defaultValue="+91 98765 43210" />
          </div>
          
          <button className="primary-btn"><Save size={18} /> Save Changes</button>
        </div>
      </div>
    </div>
  );
}
""",
    "dashboard/src/App.jsx": """import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';

function App() {
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

export default App;
"""
}

css_append = """

/* Sidebar & Layout updates */
.app-container {
  display: flex;
  flex-direction: row;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 250px;
  height: 100vh;
  border-radius: 0;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 0;
  z-index: 200;
}

.sidebar-header {
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--border);
}

.sidebar-header h2 {
  font-size: 1.5rem;
  letter-spacing: 1px;
}

.sidebar-nav {
  padding: 24px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s;
}

.nav-item:hover {
  background: rgba(255,255,255,0.05);
  color: var(--text-primary);
}

.nav-item.active {
  background: rgba(59, 130, 246, 0.15);
  color: var(--accent);
  border-left: 3px solid var(--accent);
}

.sidebar-footer {
  padding: 24px;
  border-top: 1px solid var(--border);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.pulse-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--minor);
  box-shadow: 0 0 10px var(--minor);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

/* Stats Page */
.page-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 1.8rem;
  margin-bottom: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 30px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content h3 { font-size: 0.9rem; color: var(--text-secondary); font-weight: 500; }
.stat-value { font-size: 2rem; font-weight: 700; margin: 4px 0; }
.stat-trend { font-size: 0.8rem; }
.stat-trend.positive { color: var(--minor); }
.stat-trend.negative { color: var(--critical); }

.charts-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
}

.chart-panel h3 {
  font-size: 1.1rem;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 10px;
}

.mock-chart {
  height: 200px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding-top: 20px;
  position: relative;
}

.chart-bar {
  width: 40px;
  border-radius: 6px 6px 0 0;
  position: relative;
  transition: height 0.5s ease;
}

.chart-bar span {
  position: absolute;
  bottom: -25px;
  width: 100%;
  text-align: center;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.mock-chart.trend {
  border-left: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.trend-line {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
}

.trend-point {
  position: absolute;
  width: 8px; height: 8px;
  background: var(--accent);
  border-radius: 50%;
  transform: translate(-50%, 50%);
  z-index: 10;
}

/* Settings */
.settings-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 24px;
}

.settings-menu {
  list-style: none;
}

.settings-menu li {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 8px;
  cursor: pointer;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.settings-menu li:hover { background: rgba(255,255,255,0.05); }
.settings-menu li.active { background: rgba(59, 130, 246, 0.15); color: var(--accent); }

.settings-content h2 { font-size: 1.3rem; margin-bottom: 8px; }
.settings-desc { color: var(--text-secondary); margin-bottom: 24px; font-size: 0.9rem; }

.form-group {
  margin-bottom: 24px;
  background: rgba(0,0,0,0.1);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid var(--border);
}

.switch-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.switch-label p { font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px; }

.text-input {
  width: 100%;
  padding: 12px;
  background: rgba(0,0,0,0.2);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: white;
  margin-top: 8px;
}

.primary-btn {
  background: var(--accent);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  margin-top: 16px;
}

.primary-btn:hover { background: #2563eb; }
"""

import os
for filepath, content in components.items():
    full_path = os.path.join(r"d:\railway-track-fault-detection", filepath)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

with open(r"d:\railway-track-fault-detection\dashboard\src\index.css", "a", encoding="utf-8") as f:
    f.write(css_append)

print("Dashboard pages expanded successfully!")
