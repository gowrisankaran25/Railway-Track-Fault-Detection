import axios from 'axios';

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
