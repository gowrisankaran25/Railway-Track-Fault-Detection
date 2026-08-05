import React from 'react';
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
