import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Activity, TrendingUp, AlertTriangle, Calendar, MapPin, Clock, ArrowUpRight, ArrowDownRight, Zap, Shield, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';

const mockTrackSegments = [
  {
    id: 'SEG-001',
    name: 'Delhi-Agra Main Line',
    location: 'Sector 4, Delhi Division',
    healthScore: 92,
    riskLevel: 'low',
    lastInspection: '2026-01-15',
    nextInspection: '2026-02-15',
    faultHistory: 2,
    trafficLoad: 'high',
    age: 8,
    predictedFailure: 0.05,
    maintenancePriority: 'routine',
    weatherImpact: 'minimal'
  },
  {
    id: 'SEG-002',
    name: 'Mumbai-Pune Express Corridor',
    location: 'Sector 7, Mumbai Division',
    healthScore: 78,
    riskLevel: 'medium',
    lastInspection: '2026-01-10',
    nextInspection: '2026-01-25',
    faultHistory: 5,
    trafficLoad: 'very-high',
    age: 12,
    predictedFailure: 0.18,
    maintenancePriority: 'scheduled',
    weatherImpact: 'moderate'
  },
  {
    id: 'SEG-003',
    name: 'Kolkata-Chennai Route',
    location: 'Sector 2, Kolkata Division',
    healthScore: 45,
    riskLevel: 'critical',
    lastInspection: '2026-01-05',
    nextInspection: '2026-01-12',
    faultHistory: 12,
    trafficLoad: 'high',
    age: 18,
    predictedFailure: 0.42,
    maintenancePriority: 'urgent',
    weatherImpact: 'severe'
  },
  {
    id: 'SEG-004',
    name: 'Bangalore-Hyderabad Line',
    location: 'Sector 9, Bangalore Division',
    healthScore: 88,
    riskLevel: 'low',
    lastInspection: '2026-01-18',
    nextInspection: '2026-02-18',
    faultHistory: 1,
    trafficLoad: 'medium',
    age: 5,
    predictedFailure: 0.03,
    maintenancePriority: 'routine',
    weatherImpact: 'minimal'
  },
  {
    id: 'SEG-005',
    name: 'Chennai-Madurai Corridor',
    location: 'Sector 5, Chennai Division',
    healthScore: 65,
    riskLevel: 'medium',
    lastInspection: '2026-01-08',
    nextInspection: '2026-01-22',
    faultHistory: 7,
    trafficLoad: 'high',
    age: 14,
    predictedFailure: 0.25,
    maintenancePriority: 'scheduled',
    weatherImpact: 'moderate'
  }
];

const mockMaintenanceSchedule = [
  { id: 1, segment: 'SEG-003', type: 'Emergency Repair', date: '2026-01-12', status: 'in-progress', team: 'Team Alpha' },
  { id: 2, segment: 'SEG-002', type: 'Scheduled Maintenance', date: '2026-01-25', status: 'pending', team: 'Team Beta' },
  { id: 3, segment: 'SEG-005', type: 'Preventive Inspection', date: '2026-01-22', status: 'pending', team: 'Team Gamma' },
  { id: 4, segment: 'SEG-001', type: 'Routine Check', date: '2026-02-15', status: 'scheduled', team: 'Team Delta' },
];

export default function PredictiveMaintenance() {
  const [segments, setSegments] = useState(mockTrackSegments);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getHealthBgColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getRiskBadge = (level) => {
    const variants = {
      low: { variant: 'minor', label: 'Low Risk' },
      medium: { variant: 'major', label: 'Medium Risk' },
      critical: { variant: 'critical', label: 'Critical Risk' }
    };
    return variants[level] || variants.low;
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      routine: 'bg-blue-100 text-blue-800',
      scheduled: 'bg-yellow-100 text-yellow-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority] || colors.routine;
  };

  const overallHealth = Math.round(segments.reduce((acc, seg) => acc + seg.healthScore, 0) / segments.length);
  const criticalSegments = segments.filter(s => s.riskLevel === 'critical').length;
  const urgentMaintenance = segments.filter(s => s.maintenancePriority === 'urgent').length;

  return (
    <div className="page-container" style={{ padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 className="page-title">Predictive Maintenance</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          AI-powered track health analysis and maintenance scheduling
        </p>
      </div>

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <Card className="glass-panel">
          <CardHeader style={{ paddingBottom: '12px' }}>
            <CardDescription style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} /> Overall Network Health
            </CardDescription>
            <CardTitle style={{ fontSize: '2.5rem', fontWeight: '700', color: getHealthColor(overallHealth) }}>
              {overallHealth}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <ArrowUpRight size={16} className="text-green-500" />
              <span className="text-green-500">+3.2%</span>
              <span style={{ color: 'var(--text-secondary)' }}>vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader style={{ paddingBottom: '12px' }}>
            <CardDescription style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} /> Critical Segments
            </CardDescription>
            <CardTitle style={{ fontSize: '2.5rem', fontWeight: '700', color: '#ef4444' }}>
              {criticalSegments}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <ArrowDownRight size={16} className="text-green-500" />
              <span className="text-green-500">-1</span>
              <span style={{ color: 'var(--text-secondary)' }}>from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader style={{ paddingBottom: '12px' }}>
            <CardDescription style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wrench size={16} /> Urgent Maintenance
            </CardDescription>
            <CardTitle style={{ fontSize: '2.5rem', fontWeight: '700', color: '#f59e0b' }}>
              {urgentMaintenance}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <Clock size={16} style={{ color: 'var(--text-secondary)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Next: 2 days</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader style={{ paddingBottom: '12px' }}>
            <CardDescription style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={16} /> Predicted Failures
            </CardDescription>
            <CardTitle style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--accent)' }}>
              {(segments.reduce((acc, seg) => acc + seg.predictedFailure, 0) * 100).toFixed(1)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <Zap size={16} style={{ color: 'var(--text-secondary)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Next 30 days</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="segments" style={{ marginBottom: '30px' }}>
        <TabsList>
          <TabsTrigger value="segments">Track Segments</TabsTrigger>
          <TabsTrigger value="schedule">Maintenance Schedule</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="segments">
          <div style={{ display: 'grid', gap: '20px' }}>
            {segments.map((segment, index) => {
              const riskBadge = getRiskBadge(segment.riskLevel);
              return (
                <motion.div
                  key={segment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-panel" style={{ cursor: 'pointer' }} onClick={() => setSelectedSegment(segment)}>
                    <CardContent style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>{segment.name}</h3>
                            <Badge variant={riskBadge.variant}>{riskBadge.label}</Badge>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            <MapPin size={14} />
                            <span>{segment.location}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '2rem', fontWeight: '700', color: getHealthColor(segment.healthScore) }}>
                            {segment.healthScore}%
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Health Score</div>
                        </div>
                      </div>

                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Health Index</span>
                          <span style={{ fontWeight: '600' }}>{segment.healthScore}%</span>
                        </div>
                        <Progress value={segment.healthScore} className="h-2" />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', fontSize: '0.85rem' }}>
                        <div>
                          <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Traffic Load</div>
                          <div style={{ fontWeight: '600', textTransform: 'capitalize' }}>{segment.trafficLoad}</div>
                        </div>
                        <div>
                          <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Track Age</div>
                          <div style={{ fontWeight: '600' }}>{segment.age} years</div>
                        </div>
                        <div>
                          <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Fault History</div>
                          <div style={{ fontWeight: '600' }}>{segment.faultHistory} incidents</div>
                        </div>
                        <div>
                          <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Failure Risk</div>
                          <div style={{ fontWeight: '600', color: segment.predictedFailure > 0.3 ? '#ef4444' : 'inherit' }}>
                            {(segment.predictedFailure * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Priority</div>
                          <Badge style={{ fontSize: '0.75rem', padding: '2px 8px' }} className={getPriorityBadge(segment.maintenancePriority)}>
                            {segment.maintenancePriority}
                          </Badge>
                        </div>
                        <div>
                          <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Weather Impact</div>
                          <div style={{ fontWeight: '600', textTransform: 'capitalize' }}>{segment.weatherImpact}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="schedule">
          <div style={{ display: 'grid', gap: '16px' }}>
            {mockMaintenanceSchedule.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-panel">
                  <CardContent style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ 
                      width: '48px', height: '48px', borderRadius: '12px', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backgroundColor: item.status === 'in-progress' ? 'rgba(239, 68, 68, 0.1)' : 
                                     item.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 
                                     'rgba(59, 130, 246, 0.1)'
                    }}>
                      <Wrench size={24} color={
                        item.status === 'in-progress' ? '#ef4444' : 
                        item.status === 'pending' ? '#f59e0b' : 
                        '#3b82f6'
                      } />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>{item.type}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={14} /> {item.segment}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={14} /> {item.date}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Shield size={14} /> {item.team}
                        </span>
                      </div>
                    </div>
                    <Badge variant={
                      item.status === 'in-progress' ? 'critical' : 
                      item.status === 'pending' ? 'major' : 'minor'
                    }>
                      {item.status}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Fault Trends</CardTitle>
                <CardDescription>Monthly fault detection patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '12px', paddingTop: '20px' }}>
                  {[65, 45, 78, 52, 38, 62, 48, 71, 55, 42, 68, 58].map((value, index) => (
                    <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div 
                        style={{ 
                          width: '100%', height: `${value}%`, 
                          background: `hsl(${210 + value}, 70%, 50%)`,
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.3s ease'
                        }}
                      />
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Maintenance Efficiency</CardTitle>
                <CardDescription>Resolution time metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                      <span>Critical Faults</span>
                      <span style={{ fontWeight: '600' }}>2.3h avg</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                      <span>Major Faults</span>
                      <span style={{ fontWeight: '600' }}>8.5h avg</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                      <span>Minor Faults</span>
                      <span style={{ fontWeight: '600' }}>24h avg</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Cost Impact Analysis</CardTitle>
                <CardDescription>Savings from early detection</CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '3rem', fontWeight: '700', color: '#10b981', marginBottom: '8px' }}>
                    ₹4.2Cr
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Estimated savings this quarter
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px', fontSize: '0.85rem' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>127</div>
                      <div style={{ color: 'var(--text-secondary)' }}>Faults Prevented</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>89%</div>
                      <div style={{ color: 'var(--text-secondary)' }}>Detection Rate</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>156</div>
                      <div style={{ color: 'var(--text-secondary)' }}>Hours Saved</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Segment Detail Modal */}
      {selectedSegment && (
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
          onClick={() => setSelectedSegment(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel"
            style={{ maxWidth: '600px', width: '100%', padding: '30px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>{selectedSegment.name}</h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedSegment(null)}>
                ✕
              </Button>
            </div>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Health Score</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: getHealthColor(selectedSegment.healthScore) }}>
                    {selectedSegment.healthScore}%
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Risk Level</div>
                  <Badge variant={getRiskBadge(selectedSegment.riskLevel).variant}>
                    {getRiskBadge(selectedSegment.riskLevel).label}
                  </Badge>
                </div>
              </div>
              <div style={{ padding: '16px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.9rem', marginBottom: '12px', fontWeight: '600' }}>AI Recommendations</div>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <li>Schedule inspection within {selectedSegment.riskLevel === 'critical' ? '48 hours' : '7 days'}</li>
                  <li>Monitor weather conditions for {selectedSegment.weatherImpact} impact</li>
                  <li>Consider temporary speed restrictions if health drops below 60%</li>
                  <li>Review maintenance history for recurring patterns</li>
                </ul>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <Button className="flex-1">Schedule Maintenance</Button>
                <Button variant="outline" className="flex-1">View Full History</Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
