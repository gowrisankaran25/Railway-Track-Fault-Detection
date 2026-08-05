import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Map, BarChart2, Settings, AlertCircle, Sun, Moon, Bell, LogOut, User, Activity, Archive as ArchiveIcon, Navigation, Users, Zap } from 'lucide-react';
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
        <NavLink to="/inspectors" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Users size={20} />
          <span>Inspectors</span>
        </NavLink>
        <NavLink to="/predictive" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Zap size={20} />
          <span>Predictive Maintenance</span>
        </NavLink>
        <NavLink to="/system-health" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Activity size={20} />
          <span>System Health</span>
        </NavLink>
        <NavLink to="/archive" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <ArchiveIcon size={20} />
          <span>Archive</span>
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
          {/* <AlertSystem /> */}
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
