import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Progress } from '../components/ui/progress';
import { MapPin, Navigation, Phone, Mail, Clock, CheckCircle, AlertCircle, UserPlus, Search, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

const mockInspectors = [
  {
    id: 'INS-001',
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh.k@railway.gov.in',
    status: 'available',
    currentLocation: { lat: 28.6139, lng: 77.2090, address: 'Connaught Place, New Delhi' },
    assignedFaults: 0,
    completedToday: 5,
    skills: ['track_inspection', 'welding', 'signaling'],
    lastActive: '2 min ago',
    rating: 4.8
  },
  {
    id: 'INS-002',
    name: 'Priya Sharma',
    phone: '+91 98765 43211',
    email: 'priya.s@railway.gov.in',
    status: 'on_duty',
    currentLocation: { lat: 28.6400, lng: 77.1600, address: 'Sector 4, Delhi' },
    assignedFaults: 2,
    completedToday: 3,
    skills: ['track_inspection', 'electrical'],
    lastActive: 'Just now',
    rating: 4.9
  },
  {
    id: 'INS-003',
    name: 'Amit Verma',
    phone: '+91 98765 43212',
    email: 'amit.v@railway.gov.in',
    status: 'unavailable',
    currentLocation: { lat: 28.5800, lng: 77.1200, address: 'Base Station, New Delhi' },
    assignedFaults: 0,
    completedToday: 0,
    skills: ['track_inspection', 'mechanical'],
    lastActive: '1 hour ago',
    rating: 4.5
  },
  {
    id: 'INS-004',
    name: 'Sneha Patel',
    phone: '+91 98765 43213',
    email: 'sneha.p@railway.gov.in',
    status: 'available',
    currentLocation: { lat: 28.6700, lng: 77.1800, address: 'Sector 7, Delhi' },
    assignedFaults: 0,
    completedToday: 4,
    skills: ['track_inspection', 'civil'],
    lastActive: '5 min ago',
    rating: 4.7
  },
  {
    id: 'INS-005',
    name: 'Vikram Singh',
    phone: '+91 98765 43214',
    email: 'vikram.s@railway.gov.in',
    status: 'on_duty',
    currentLocation: { lat: 28.6200, lng: 77.1400, address: 'Sector 2, Delhi' },
    assignedFaults: 1,
    completedToday: 6,
    skills: ['track_inspection', 'welding', 'mechanical'],
    lastActive: 'Just now',
    rating: 4.6
  }
];

const mockCriticalFaults = [
  { id: 'FLT-001', type: 'Crack', location: { lat: 28.6400, lng: 77.1600 }, severity: 'critical', detectedAt: '2026-01-15 10:30' },
  { id: 'FLT-002', type: 'Misalignment', location: { lat: 28.6650, lng: 77.1400 }, severity: 'critical', detectedAt: '2026-01-15 11:15' },
];

export default function Inspectors() {
  const [inspectors, setInspectors] = useState(mockInspectors);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInspector, setSelectedInspector] = useState(null);
  const [isAddingInspector, setIsAddingInspector] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#10b981';
      case 'on_duty': return '#3b82f6';
      case 'unavailable': return '#64748b';
      default: return '#64748b';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'available': return 'Available';
      case 'on_duty': return 'On Duty';
      case 'unavailable': return 'Unavailable';
      default: return status;
    }
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  const findNearestInspector = (faultLocation) => {
    return inspectors
      .filter(insp => insp.status === 'available')
      .map(insp => ({
        ...insp,
        distance: calculateDistance(
          faultLocation.lat, faultLocation.lng,
          insp.currentLocation.lat, insp.currentLocation.lng
        )
      }))
      .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))[0];
  };

  const handleAutoAssign = (fault) => {
    const nearest = findNearestInspector(fault.location);
    if (nearest) {
      setInspectors(prev => prev.map(insp => 
        insp.id === nearest.id 
          ? { ...insp, status: 'on_duty', assignedFaults: insp.assignedFaults + 1 }
          : insp
      ));
      alert(`Auto-assigned ${nearest.name} to fault ${fault.id} (${nearest.distance} km away)`);
    } else {
      alert('No available inspectors nearby');
    }
  };

  const filteredInspectors = inspectors.filter(inspector => {
    const matchesSearch = inspector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspector.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inspector.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-container" style={{ padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 className="page-title">Inspector Management</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          GPS-based inspector assignment and real-time tracking
        </p>
      </div>

      {/* Critical Faults Quick Assign */}
      <Card className="glass-panel" style={{ marginBottom: '24px', padding: '20px' }}>
        <CardHeader style={{ paddingBottom: '12px' }}>
          <CardTitle style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={20} color="#ef4444" />
            Critical Faults - Auto Assign
          </CardTitle>
          <CardDescription>Automatically assign nearest available inspector</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {mockCriticalFaults.map(fault => (
              <div key={fault.id} style={{
                flex: 1, minWidth: '280px', padding: '16px',
                background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>{fault.type}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Detected: {fault.detectedAt}
                  </div>
                </div>
                <Button size="sm" onClick={() => handleAutoAssign(fault)}>
                  <Navigation size={16} style={{ marginRight: '4px' }} />
                  Auto Assign
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
          <Search size={18} style={{ 
            position: 'absolute', left: '12px', top: '50%', 
            transform: 'translateY(-50%)', color: 'var(--text-secondary)' 
          }} />
          <Input
            placeholder="Search inspectors by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border)',
            background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '0.9rem'
          }}
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="on_duty">On Duty</option>
          <option value="unavailable">Unavailable</option>
        </select>
        <Button onClick={() => setIsAddingInspector(true)}>
          <UserPlus size={18} style={{ marginRight: '8px' }} />
          Add Inspector
        </Button>
      </div>

      {/* Inspector Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {filteredInspectors.map((inspector, index) => (
          <motion.div
            key={inspector.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-panel" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => setSelectedInspector(inspector)}>
              <CardContent style={{ padding: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.2rem', fontWeight: '700', color: 'white'
                    }}>
                      {inspector.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>{inspector.name}</h3>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{inspector.id}</p>
                    </div>
                  </div>
                  <Badge style={{ 
                    background: `${getStatusColor(inspector.status)}20`, 
                    color: getStatusColor(inspector.status),
                    border: `1px solid ${getStatusColor(inspector.status)}40`
                  }}>
                    {getStatusLabel(inspector.status)}
                  </Badge>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                    <MapPin size={14} color="var(--text-secondary)" />
                    <span style={{ color: 'var(--text-secondary)' }}>{inspector.currentLocation.address}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                    <Clock size={14} color="var(--text-secondary)" />
                    <span style={{ color: 'var(--text-secondary)' }}>{inspector.lastActive}</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.1)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--accent)' }}>{inspector.assignedFaults}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Assigned</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.1)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>{inspector.completedToday}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Completed Today</div>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Performance Rating</span>
                    <span style={{ fontWeight: '600' }}>{inspector.rating}/5.0</span>
                  </div>
                  <Progress value={inspector.rating * 20} className="h-2" />
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {inspector.skills.map(skill => (
                    <Badge key={skill} variant="outline" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                      {skill.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Inspector Detail Modal */}
      {selectedInspector && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setSelectedInspector(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel"
            style={{ maxWidth: '500px', width: '100%', padding: '30px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>{selectedInspector.name}</h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedInspector(null)}>
                ✕
              </Button>
            </div>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Phone</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={16} />
                    {selectedInspector.phone}
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Email</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={16} />
                    {selectedInspector.email}
                  </div>
                </div>
              </div>

              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Current Location</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} />
                  {selectedInspector.currentLocation.address}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Lat: {selectedInspector.currentLocation.lat.toFixed(4)}, Lng: {selectedInspector.currentLocation.lng.toFixed(4)}
                </div>
              </div>

              <div style={{ padding: '16px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.9rem', marginBottom: '12px', fontWeight: '600' }}>Today's Performance</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>{selectedInspector.completedToday}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Faults Resolved</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent)' }}>{selectedInspector.rating}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Rating</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <Button className="flex-1">
                  <Phone size={18} style={{ marginRight: '8px' }} />
                  Call
                </Button>
                <Button variant="outline" className="flex-1">
                  <Navigation size={18} style={{ marginRight: '8px' }} />
                  Track Location
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
