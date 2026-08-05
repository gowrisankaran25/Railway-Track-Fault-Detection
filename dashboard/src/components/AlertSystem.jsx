import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Bell, BellRing, X, Check, AlertTriangle, Info, AlertCircle, Clock, Settings, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockAlerts = [
  {
    id: 'ALT-001',
    type: 'critical',
    title: 'Critical Track Fault Detected',
    message: 'Crack detected at Sector 4, Delhi Division. Immediate inspection required.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    acknowledged: false,
    source: 'AI Detection System',
    location: '28.6400, 77.1600'
  },
  {
    id: 'ALT-002',
    type: 'warning',
    title: 'Weather Alert - Heavy Rain Expected',
    message: 'Heavy rainfall predicted in next 2 hours. Track inspection sensitivity adjusted.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    acknowledged: false,
    source: 'Weather Service',
    location: 'New Delhi Region'
  },
  {
    id: 'ALT-003',
    type: 'info',
    title: 'Inspector Dispatched',
    message: 'Inspector Rajesh Kumar dispatched to fault FLT-001. ETA: 15 minutes.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    acknowledged: true,
    source: 'Dispatch System',
    location: 'Sector 4'
  },
  {
    id: 'ALT-004',
    type: 'critical',
    title: 'SLA Breach Warning',
    message: 'Fault FLT-002 approaching SLA limit. 45 minutes remaining.',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    acknowledged: false,
    source: 'SLA Monitor',
    location: '28.6650, 77.1400'
  }
];

const alertConfig = {
  critical: { color: '#ef4444', icon: AlertTriangle, label: 'Critical' },
  warning: { color: '#f59e0b', icon: AlertCircle, label: 'Warning' },
  info: { color: '#3b82f6', icon: Info, label: 'Info' },
  success: { color: '#10b981', icon: Check, label: 'Success' }
};

export default function AlertSystem() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setUnreadCount(alerts.filter(a => !a.acknowledged).length);
  }, [alerts]);

  const acknowledgeAlert = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const acknowledgeAll = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, acknowledged: true })));
  };

  const getAlertIcon = (type) => {
    const Icon = alertConfig[type]?.icon || Info;
    return <Icon size={20} />;
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Alert Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowSettings(!showSettings)}
        style={{ position: 'relative' }}
      >
        {unreadCount > 0 ? <BellRing size={20} /> : <Bell size={20} />}
        {unreadCount > 0 && (
          <Badge style={{
            position: 'absolute', top: '-4px', right: '-4px',
            background: '#ef4444', color: 'white',
            fontSize: '0.7rem', padding: '2px 6px', minWidth: '18px',
            borderRadius: '50%'
          }}>
            {unreadCount}
          </Badge>
        )}
      </Button>

      {/* Alert Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            style={{
              position: 'absolute', top: '100%', right: 0,
              width: '400px', maxHeight: '500px',
              zIndex: 1000,
              marginTop: '8px'
            }}
          >
            <Card className="glass-panel" style={{ padding: '0' }}>
              <CardHeader style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <CardTitle style={{ fontSize: '1rem', margin: 0 }}>Alerts & Notifications</CardTitle>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="ghost" size="icon" onClick={() => setSoundEnabled(!soundEnabled)}>
                      {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
                      <X size={18} />
                    </Button>
                  </div>
                </div>
                <CardDescription style={{ margin: '8px 0 0 0' }}>
                  {unreadCount} unread alerts
                </CardDescription>
              </CardHeader>

              <CardContent style={{ padding: '0', maxHeight: '400px', overflowY: 'auto' }}>
                {alerts.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <Bell size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                    <p>No alerts</p>
                  </div>
                ) : (
                  <div>
                    {alerts.map((alert, index) => {
                      const config = alertConfig[alert.type];
                      return (
                        <motion.div
                          key={alert.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          style={{
                            padding: '16px',
                            borderBottom: '1px solid var(--border)',
                            background: !alert.acknowledged ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                            cursor: 'pointer'
                          }}
                          onClick={() => !alert.acknowledged && acknowledgeAlert(alert.id)}
                        >
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{
                              width: '36px', height: '36px', borderRadius: '8px',
                              background: `${config.color}20`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: config.color, flexShrink: 0
                            }}>
                              {getAlertIcon(alert.type)}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600' }}>{alert.title}</h4>
                                <Badge variant={alert.type === 'critical' ? 'critical' : alert.type === 'warning' ? 'major' : 'minor'} style={{ fontSize: '0.65rem' }}>
                                  {config.label}
                                </Badge>
                              </div>
                              <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                                {alert.message}
                              </p>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>
                                  {alert.source} • {formatTimeAgo(alert.timestamp)}
                                </span>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  {!alert.acknowledged && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => { e.stopPropagation(); acknowledgeAlert(alert.id); }}
                                      style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                                    >
                                      <Check size={14} style={{ marginRight: '4px' }} />
                                      Ack
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => { e.stopPropagation(); dismissAlert(alert.id); }}
                                    style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                                  >
                                    <X size={14} />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>

              {alerts.length > 0 && (
                <div style={{ padding: '12px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                  <Button variant="ghost" size="sm" onClick={acknowledgeAll} disabled={unreadCount === 0}>
                    Acknowledge All
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings size={16} style={{ marginRight: '4px' }} />
                    Alert Settings
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
