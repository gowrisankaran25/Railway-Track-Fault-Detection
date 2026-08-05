import React, { useState, useEffect, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Activity, MapPin, AlertTriangle, X, Camera, AlertCircle } from 'lucide-react';
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
  const [filteredFaults, setFilteredFaults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFault, setSelectedFault] = useState(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchFaults = async () => {
      setLoading(true);
      const data = await getFaults();
      setFaults(data);
      setFilteredFaults(data);
      setLoading(false);
    };
    fetchFaults();
  }, []);

  // Using OpenStreetMap for a stable, high-quality graphic roadmap
  const tileLayerUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  return (
    <div className="dashboard-grid" style={{position: 'relative'}}>
      <div className="glass-panel map-wrapper" style={{ padding: '8px', zIndex: 1 }}>
        <MapContainer center={[28.6500, 77.1500]} zoom={14} className="map-container">
          <TileLayer
            key={theme}
            url={tileLayerUrl}
            attribution='&copy; OpenStreetMap contributors'
          />
          
          <Circle center={[28.6400, 77.1600]} pathOptions={{color: 'transparent', fillColor: '#ef4444', fillOpacity: 0.15}} radius={800} />
          <Circle center={[28.6650, 77.1400]} pathOptions={{color: 'transparent', fillColor: '#f59e0b', fillOpacity: 0.15}} radius={600} />

          {filteredFaults.map(fault => (
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
        
        {/* <WeatherWidget /> */}
        
        {/* <SearchFilterBar onFilter={handleFilter} filters={filters} /> */}
        
        <div className="fault-list">
          {filteredFaults.length === 0 && !loading && (
            <p style={{color: 'var(--text-secondary)', textAlign: 'center', padding: '20px'}}>
              No active faults detected.
            </p>
          )}
          {filteredFaults.map(fault => (
            <div key={fault.report_id} className="fault-item" onClick={() => setSelectedFault(fault)}>
              <div className="fault-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h3 style={{textTransform: 'capitalize', margin: 0}}>{fault.fault_type.replace('_', ' ')}</h3>
                </div>
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
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '8px',
                flex: 1,
                display: 'flex',
                boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8)'
              }}>
                <img 
                  src={selectedFault.image_url || 'https://images.unsplash.com/photo-1541818293963-356a422a59a7?auto=format&fit=crop&q=80&w=800'} 
                  alt="Track Fault" 
                  style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    objectFit: 'cover',
                    zIndex: 0,
                    opacity: 0.8
                  }} 
                  onError={(e) => {
                    console.log('Image failed to load, falling back to color');
                    e.target.style.display = 'none';
                  }}
                />
                
                <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1, backgroundImage: 'linear-gradient(rgba(0,255,0,0.03) 1px, transparent 1px)', backgroundSize: '100% 4px', pointerEvents: 'none'}}></div>

                <div className="yolo-box" style={{
                  borderColor: selectedFault.severity === 'critical' ? '#ef4444' : '#f59e0b',
                  zIndex: 2
                }}>
                  <span className="yolo-label" style={{
                    backgroundColor: selectedFault.severity === 'critical' ? '#ef4444' : '#f59e0b'
                  }}>
                    {selectedFault.fault_type} {(selectedFault.confidence_score * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="feed-hud" style={{
                  textShadow: '0px 0px 8px #000, 0px 0px 4px #10b981',
                  zIndex: 2
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
                  <button 
                    className="primary-btn dispatch-btn" 
                    onClick={() => {
                      import('react-hot-toast').then(module => {
                        module.default.success(`Inspector dispatched to Lat: ${parseFloat(selectedFault.lat).toFixed(3)}`);
                        setSelectedFault({...selectedFault, status: 'dispatched'});
                      });
                    }}
                  >
                    Dispatch Inspector
                  </button>
                  <button 
                    className="secondary-btn"
                    onClick={() => {
                      import('react-hot-toast').then(module => {
                        module.default.error(`Fault marked as False Positive`);
                        setSelectedFault(null);
                      });
                    }}
                  >
                    Mark False Positive
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
