import os

files = {
    "dashboard/package.json": """{
  "name": "railway-dashboard",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.5.0",
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1",
    "react-router-dom": "^6.16.0",
    "lucide-react": "^0.279.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "vite": "^4.4.5"
  }
}
""",
    "dashboard/vite.config.js": """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})
""",
    "dashboard/index.html": """<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Railway Command Center</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
""",
    "dashboard/src/main.jsx": """import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
""",
    "dashboard/src/index.css": """
:root {
  --bg-dark: #0f172a;
  --bg-card: rgba(30, 41, 59, 0.7);
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --accent: #3b82f6;
  --critical: #ef4444;
  --major: #f59e0b;
  --minor: #10b981;
  --border: rgba(255, 255, 255, 0.1);
  --glass-blur: blur(12px);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--bg-dark);
  color: var(--text-primary);
  min-height: 100vh;
  background-image: 
    radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.15) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(239, 68, 68, 0.1) 0px, transparent 50%);
  background-attachment: fixed;
}

/* Glassmorphism Classes */
.glass-panel {
  background: var(--bg-card);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.glass-panel:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
}

/* App Layout */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  padding: 20px 40px;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.header h1 span {
  color: var(--accent);
}

.main-content {
  padding: 40px;
  flex: 1;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 24px;
  height: calc(100vh - 160px);
}

/* Map specific styling */
.map-container {
  height: 100%;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
}

.leaflet-container {
  background: #1e293b !important;
}

/* Badges */
.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge.critical { background: rgba(239, 68, 68, 0.2); color: var(--critical); border: 1px solid rgba(239,68,68,0.3); }
.badge.major { background: rgba(245, 158, 11, 0.2); color: var(--major); border: 1px solid rgba(245,158,11,0.3); }
.badge.minor { background: rgba(16, 185, 129, 0.2); color: var(--minor); border: 1px solid rgba(16,185,129,0.3); }

/* Table styling */
.fault-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  max-height: 100%;
  padding-right: 8px;
}

.fault-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.05);
  cursor: pointer;
  transition: all 0.2s ease;
}

.fault-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255,255,255,0.1);
}

.fault-info h3 {
  font-size: 1rem;
  margin-bottom: 4px;
  text-transform: capitalize;
}

.fault-info p {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
""",
    "dashboard/src/App.jsx": """import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="app-container">
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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
""",
    "dashboard/src/pages/Dashboard.jsx": """import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Activity, MapPin, AlertTriangle } from 'lucide-react';

// Mock data until API is integrated
const MOCK_FAULTS = [
  { id: 1, type: 'critical', name: 'missing_fishplate', lat: 28.6500, lng: 77.1500, conf: 0.95, time: '2 mins ago' },
  { id: 2, type: 'major', name: 'crack', lat: 28.6550, lng: 77.1520, conf: 0.88, time: '15 mins ago' },
  { id: 3, type: 'minor', name: 'vegetation', lat: 28.6600, lng: 77.1480, conf: 0.76, time: '1 hour ago' },
];

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
  const [faults, setFaults] = useState(MOCK_FAULTS);

  return (
    <div className="dashboard-grid">
      <div className="glass-panel" style={{ padding: '8px' }}>
        <MapContainer center={[28.6500, 77.1500]} zoom={14} className="map-container">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          {faults.map(fault => (
            <Marker key={fault.id} position={[fault.lat, fault.lng]} icon={createCustomIcon(fault.type)}>
              <Popup>
                <div style={{ color: '#000', padding: '5px' }}>
                  <strong>{fault.name.replace('_', ' ').toUpperCase()}</strong><br/>
                  Confidence: {(fault.conf * 100).toFixed(1)}%<br/>
                  Reported: {fault.time}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>
          <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={20} color="var(--critical)" /> 
            Recent Alerts
          </h2>
        </div>
        
        <div className="fault-list">
          {faults.map(fault => (
            <div key={fault.id} className="fault-item">
              <div className="fault-info">
                <h3 style={{textTransform: 'capitalize'}}>{fault.name.replace('_', ' ')}</h3>
                <p style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin size={12} /> Lat: {fault.lat.toFixed(3)}, Lng: {fault.lng.toFixed(3)}
                </p>
                <p style={{ marginTop: '4px', fontSize: '0.75rem' }}>{fault.time}</p>
              </div>
              <span className={`badge ${fault.type}`}>{fault.type}</span>
            </div>
          ))}
        </div>
      </div>
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

print("Dashboard React files generated successfully.")
