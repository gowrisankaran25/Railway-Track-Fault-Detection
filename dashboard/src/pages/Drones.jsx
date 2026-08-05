import React, { useState } from 'react';
import { Battery, Wifi, Navigation, BatteryCharging, PowerOff, X, Camera, Crosshair, Plus, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectItem } from '../components/ui/select';
import { Progress } from '../components/ui/progress';

const INITIAL_DRONES = [
  { id: 'DRN-Alpha', status: 'patrolling', battery: 78, location: 'Sector 4', signal: 'Strong', lastUpdate: 'Just now', feedUrl: '/drone_view.jpg', model: 'DJI Matrice 300' },
  { id: 'DRN-Beta', status: 'charging', battery: 12, location: 'Base Station 1', signal: 'Strong', lastUpdate: '2 min ago', feedUrl: '/drone_view.jpg', model: 'Custom ArduPilot' },
  { id: 'DRN-Gamma', status: 'patrolling', battery: 45, location: 'Sector 9', signal: 'Weak', lastUpdate: '45 sec ago', feedUrl: '/drone_view.jpg', model: 'DJI Mavic 3 Enterprise' },
  { id: 'DRN-Delta', status: 'offline', battery: 0, location: 'Maintenance', signal: 'None', lastUpdate: '1 day ago', feedUrl: '', model: 'Custom ArduPilot' },
];

export default function Drones() {
  const [drones, setDrones] = useState(INITIAL_DRONES);
  const [activeCam, setActiveCam] = useState(null);
  const [isAddingDrone, setIsAddingDrone] = useState(false);
  const [newDroneData, setNewDroneData] = useState({ id: '', model: 'DJI Matrice 300', connection: '' });

  const getStatusColor = (status) => {
    switch (status) {
      case 'patrolling': return 'var(--minor)';
      case 'charging': return 'var(--major)';
      case 'returning': return '#3b82f6';
      case 'offline': return 'var(--critical)';
      case 'pairing': return 'var(--accent)';
      default: return 'var(--text-secondary)';
    }
  };

  const getBatteryIcon = (battery, status) => {
    if (status === 'charging') return <BatteryCharging size={20} color="var(--major)" />;
    if (battery > 60) return <Battery size={20} color="var(--minor)" />;
    if (battery > 20) return <Battery size={20} color="var(--major)" />;
    return <Battery size={20} color="var(--critical)" />;
  };

  const handleDeployAll = () => {
    setDrones(prev => prev.map(d => 
      d.status === 'charging' && d.battery > 10 ? { ...d, status: 'patrolling', location: 'Deploying to Sector...' } : d
    ));
    toast.success('All available drones deployed!');
  };

  const handleReturnToBase = (id) => {
    setDrones(prev => prev.map(d => 
      d.id === id ? { ...d, status: 'returning', location: 'En route to Base Station' } : d
    ));
    toast('Drone returning to base.', { icon: '🚁' });
  };

  const handleViewCam = (drone) => {
    if (drone.status === 'offline' || drone.status === 'charging' || drone.status === 'pairing') {
      toast.error('Camera feed unavailable for this status.');
      return;
    }
    setActiveCam(drone);
  };

  const handleConnectDrone = (e) => {
    e.preventDefault();
    if (!newDroneData.id || !newDroneData.connection) {
      toast.error('Please provide Drone ID and Connection String');
      return;
    }
    
    const toastId = toast.loading('Establishing MAVLink connection...');
    
    setTimeout(() => {
      const newDrone = {
        id: newDroneData.id,
        model: newDroneData.model,
        status: 'offline', // Starts offline until deployed
        battery: 100,
        location: 'Base Station',
        signal: 'Strong',
        lastUpdate: 'Just now',
        feedUrl: '/drone_view.jpg'
      };
      
      setDrones([newDrone, ...drones]);
      setIsAddingDrone(false);
      setNewDroneData({ id: '', model: 'DJI Matrice 300', connection: '' });
      toast.success('Hardware pairing successful!', { id: toastId });
    }, 1500);
  };

  return (
    <div className="page-container" style={{padding: '20px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px'}}>
        <h1 className="page-title" style={{marginBottom: 0}}>Fleet Management</h1>
        <div style={{display: 'flex', gap: '15px'}}>
          <Button variant="outline" onClick={() => setIsAddingDrone(true)}>
            <Plus size={18} style={{marginRight: '8px'}} /> Connect Hardware
          </Button>
          <Button onClick={handleDeployAll}>Deploy All Drones</Button>
        </div>
      </div>

      <div className="drone-grid">
        {drones.map((drone, idx) => (
          <motion.div 
            key={drone.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="glass-panel" style={{ padding: '20px' }}>
              <CardContent style={{ padding: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <CardTitle style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Navigation size={18} color="var(--accent)" /> {drone.id}
                  </CardTitle>
                  <Badge variant={drone.status === 'offline' ? 'critical' : drone.status === 'charging' ? 'major' : 'minor'} style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}>
                    {drone.status}
                  </Badge>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.1)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      {getBatteryIcon(drone.battery, drone.status)}
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Battery</span>
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>{drone.battery}%</div>
                    <Progress value={drone.battery} className="h-2" style={{ marginTop: '8px' }} />
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.1)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      {drone.status === 'offline' ? <PowerOff size={18} color="var(--critical)" /> : <Wifi size={18} color={drone.signal === 'Strong' ? 'var(--minor)' : 'var(--major)'} />}
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Signal</span>
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>{drone.signal}</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '12px', marginBottom: '16px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Location: <strong style={{ color: 'var(--text-primary)' }}>{drone.location}</strong></span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{drone.lastUpdate}</span>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button 
                    variant="outline" 
                    style={{flex: 1}} 
                    disabled={drone.status === 'offline' || drone.status === 'charging' || drone.status === 'returning'}
                    onClick={() => handleReturnToBase(drone.id)}
                  >
                    Return Base
                  </Button>
                  <Button 
                    style={{flex: 1}} 
                    disabled={drone.status === 'offline' || drone.status === 'charging'}
                    onClick={() => handleViewCam(drone)}
                  >
                    <Camera size={16} style={{marginRight: '4px'}} /> View Cam
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeCam && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
              backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 2000,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
            <Card className="glass-panel" style={{ width: '80%', height: '80%', padding: 0 }}>
              <CardHeader style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <CardTitle style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <Camera size={20} color="var(--minor)" /> Live Feed: {activeCam.id}
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setActiveCam(null)}><X size={20} /></Button>
                </div>
              </CardHeader>
              
              <CardContent style={{ padding: 0, flex: 1 }}>
                <div className="mock-drone-feed" style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#000',
                  borderRadius: '0 0 8px 8px',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={activeCam.feedUrl} 
                    alt="Live Drone Feed"
                    style={{
                      width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85,
                      filter: 'contrast(110%) brightness(90%)'
                    }}
                  />
                  
                  {/* HUD Overlays */}
                  <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1, backgroundImage: 'linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px)', backgroundSize: '100% 4px', pointerEvents: 'none'}}></div>
                  
                  <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2, color: 'rgba(255,255,255,0.7)', filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.8))'}}>
                    <Crosshair size={120} strokeWidth={1.5} />
                  </div>

                  <div className="feed-hud" style={{ 
                    position: 'absolute', top: '20px', left: '20px', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '5px', 
                    color: '#10b981', fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 'bold',
                    textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 15px #000'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: 12, height: 12, background: '#ef4444', borderRadius: '50%', animation: 'pulse 1s infinite', border: '1px solid black' }} /> REC
                    </span>
                    <span>ALT: 45.2m</span>
                    <span>SPD: 12.4m/s</span>
                    <span>MODE: AUTONOMOUS</span>
                  </div>

                  <div className="feed-hud" style={{ 
                    position: 'absolute', bottom: '20px', right: '20px', zIndex: 2, 
                    color: '#10b981', fontFamily: 'monospace', fontSize: '1rem', fontWeight: 'bold', textAlign: 'right',
                    textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 15px #000'
                  }}>
                    <span>{new Date().toLocaleString()}</span><br/>
                    <span>{activeCam.location}</span>
                  </div>

                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connect Hardware Modal */}
      <AnimatePresence>
        {isAddingDrone && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="modal-overlay"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
              backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 2000,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
            <Card className="glass-panel" style={{ width: '450px', maxHeight: '90vh', overflowY: 'auto' }}>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <CardTitle style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <LinkIcon size={20} color="var(--accent)" /> Pair New Hardware
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setIsAddingDrone(false)}><X size={20} /></Button>
                </div>
              </CardHeader>
              
              <CardContent style={{ padding: '20px' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>
                Establish a secure connection with a new drone unit via MAVLink or proprietary SDK.
              </p>
              
              <form onSubmit={handleConnectDrone} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Drone Designation ID</label>
                  <Input 
                    placeholder="e.g., DRN-Epsilon" 
                    value={newDroneData.id}
                    onChange={e => setNewDroneData({...newDroneData, id: e.target.value})}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Hardware Model</label>
                  <Select 
                    value={newDroneData.model}
                    onChange={e => setNewDroneData({...newDroneData, model: e.target.value})}
                  >
                    <SelectItem value="DJI Matrice 300">DJI Matrice 300</SelectItem>
                    <SelectItem value="DJI Mavic 3 Enterprise">DJI Mavic 3 Enterprise</SelectItem>
                    <SelectItem value="Custom ArduPilot Quad">Custom ArduPilot Quad</SelectItem>
                    <SelectItem value="VTOL Fixed Wing">VTOL Fixed Wing</SelectItem>
                  </Select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Connection String (IP / Serial / TCP)</label>
                  <Input 
                    placeholder="tcp:192.168.1.50:5760" 
                    value={newDroneData.connection}
                    onChange={e => setNewDroneData({...newDroneData, connection: e.target.value})}
                  />
                </div>
                
                <Button type="submit" style={{ marginTop: '8px' }}>
                  Establish Connection
                </Button>
              </form>
            </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
