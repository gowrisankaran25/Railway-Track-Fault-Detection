import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
// import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Activity, Cpu, HardDrive, Wifi, Server, Database, AlertTriangle, CheckCircle, XCircle, RefreshCw, Zap, Thermometer } from 'lucide-react';
import { motion } from 'framer-motion';

const mockSystemMetrics = {
  cpu: { usage: 45, cores: 8, temperature: 52 },
  memory: { total: 32, used: 18, available: 14 },
  storage: { total: 1000, used: 650, available: 350 },
  network: { upload: 12.5, download: 45.2, latency: 23 },
  database: { connections: 45, max: 100, queryTime: 45, status: 'healthy' },
  api: { uptime: 99.8, requests: 15234, errors: 23, avgResponse: 120 },
  services: [
    { name: 'ML Detection Service', status: 'running', uptime: '15d 4h', lastRestart: '15 days ago' },
    { name: 'Drone Controller', status: 'running', uptime: '8d 12h', lastRestart: '8 days ago' },
    { name: 'Alert System', status: 'running', uptime: '30d 0h', lastRestart: '30 days ago' },
    { name: 'Data Pipeline', status: 'degraded', uptime: '2d 6h', lastRestart: '2 days ago' },
    { name: 'WebSocket Server', status: 'running', uptime: '5d 18h', lastRestart: '5 days ago' }
  ]
};

const recentAlerts = [
  { id: 1, type: 'warning', message: 'High CPU usage detected on ML server', time: '10 min ago', resolved: false },
  { id: 2, type: 'critical', message: 'Database connection pool exhausted', time: '25 min ago', resolved: true },
  { id: 3, type: 'info', message: 'Scheduled maintenance completed', time: '1 hour ago', resolved: true },
  { id: 4, type: 'warning', message: 'Storage space below 30%', time: '2 hours ago', resolved: false }
];

export default function SystemHealth() {
  const [metrics, setMetrics] = useState(mockSystemMetrics);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpu: { ...prev.cpu, usage: Math.max(20, Math.min(90, prev.cpu.usage + (Math.random() - 0.5) * 10)) },
        memory: { ...prev.memory, used: Math.max(10, Math.min(28, prev.memory.used + (Math.random() - 0.5) * 2)) },
        network: { 
          ...prev.network, 
          upload: Math.max(5, Math.min(50, prev.network.upload + (Math.random() - 0.5) * 5)),
          download: Math.max(20, Math.min(80, prev.network.download + (Math.random() - 0.5) * 10))
        }
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return '#10b981';
      case 'healthy': return '#10b981';
      case 'degraded': return '#f59e0b';
      case 'stopped': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getHealthScore = () => {
    const serviceHealth = metrics.services.filter(s => s.status === 'running').length / metrics.services.length;
    const resourceHealth = (100 - metrics.cpu.usage) / 100 * (metrics.memory.available / metrics.memory.total);
    return Math.round((serviceHealth * 0.6 + resourceHealth * 0.4) * 100);
  };

  const healthScore = getHealthScore();

  return (
    <div className="page-container" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '4px' }}>System Health Monitoring</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Real-time system metrics and service status</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="outline" onClick={() => setAutoRefresh(!autoRefresh)}>
            {autoRefresh ? 'Pause' : 'Resume'} Auto-Refresh
          </Button>
          <Button onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw size={18} style={{ marginRight: '8px', animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Health Score Overview */}
      <Card className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Overall System Health</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '3rem', fontWeight: '700', color: healthScore >= 80 ? '#10b981' : healthScore >= 60 ? '#f59e0b' : '#ef4444' }}>
                {healthScore}%
              </div>
              <div>
                <span style={{
                  fontSize: '0.85rem',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  background: healthScore >= 80 ? 'rgba(16, 185, 129, 0.2)' : healthScore >= 60 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: healthScore >= 80 ? '#10b981' : healthScore >= 60 ? '#f59e0b' : '#ef4444',
                  border: healthScore >= 80 ? '1px solid rgba(16, 185, 129, 0.3)' : healthScore >= 60 ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
                }}>
                  {healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : 'Needs Attention'}
                </span>
              </div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Health Score</span>
              <span style={{ fontWeight: '600' }}>{healthScore}%</span>
            </div>
            <Progress value={healthScore} className="h-3" />
          </div>
        </div>
      </Card>

      {/* System Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* CPU */}
        <Card className="glass-panel" style={{ padding: '20px' }}>
          <CardHeader style={{ paddingBottom: '12px' }}>
            <CardTitle style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={18} color="var(--accent)" /> CPU
            </CardTitle>
          </CardHeader>
          <CardContent style={{ paddingTop: 0 }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>{Number(metrics.cpu.usage).toFixed(1)}%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Usage across {metrics.cpu.cores} cores</div>
            </div>
            <Progress value={metrics.cpu.usage} className="h-2" style={{ marginBottom: '12px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <Thermometer size={14} />
              {metrics.cpu.temperature}°C
            </div>
          </CardContent>
        </Card>

        {/* Memory */}
        <Card className="glass-panel" style={{ padding: '20px' }}>
          <CardHeader style={{ paddingBottom: '12px' }}>
            <CardTitle style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} color="var(--accent)" /> Memory
            </CardTitle>
          </CardHeader>
          <CardContent style={{ paddingTop: 0 }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>{Number(metrics.memory.used).toFixed(1)}GB</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>of {metrics.memory.total}GB total</div>
            </div>
            <Progress value={(metrics.memory.used / metrics.memory.total) * 100} className="h-2" style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {metrics.memory.available}GB available
            </div>
          </CardContent>
        </Card>

        {/* Storage */}
        <Card className="glass-panel" style={{ padding: '20px' }}>
          <CardHeader style={{ paddingBottom: '12px' }}>
            <CardTitle style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HardDrive size={18} color="var(--accent)" /> Storage
            </CardTitle>
          </CardHeader>
          <CardContent style={{ paddingTop: 0 }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>{Number(metrics.storage.used).toFixed(1)}GB</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>of {metrics.storage.total}GB total</div>
            </div>
            <Progress value={(metrics.storage.used / metrics.storage.total) * 100} className="h-2" style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {metrics.storage.available}GB available
            </div>
          </CardContent>
        </Card>

        {/* Network */}
        <Card className="glass-panel" style={{ padding: '20px' }}>
          <CardHeader style={{ paddingBottom: '12px' }}>
            <CardTitle style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wifi size={18} color="var(--accent)" /> Network
            </CardTitle>
          </CardHeader>
          <CardContent style={{ paddingTop: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{Number(metrics.network.upload).toFixed(1)}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Upload MB/s</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{Number(metrics.network.download).toFixed(1)}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Download MB/s</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <Zap size={14} />
              {metrics.network.latency}ms latency
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services and Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Services Status */}
        <Card className="glass-panel" style={{ padding: '24px' }}>
          <CardHeader style={{ paddingBottom: '16px' }}>
            <CardTitle style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Server size={20} color="var(--accent)" /> Service Status
            </CardTitle>
            <CardDescription>Microservices and backend components</CardDescription>
          </CardHeader>
          <CardContent style={{ paddingTop: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {metrics.services.map((service, index) => (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    padding: '16px',
                    background: 'rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>{service.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Uptime: {service.uptime} • Last restart: {service.lastRestart}
                    </div>
                  </div>
                  <span style={{
                    background: `${getStatusColor(service.status)}20`,
                    color: getStatusColor(service.status),
                    border: `1px solid ${getStatusColor(service.status)}40`,
                    fontSize: '0.75rem',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}>
                    {service.status.toUpperCase()}
                  </span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="glass-panel" style={{ padding: '24px' }}>
          <CardHeader style={{ paddingBottom: '16px' }}>
            <CardTitle style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={20} color="var(--accent)" /> Recent Alerts
            </CardTitle>
            <CardDescription>System notifications and warnings</CardDescription>
          </CardHeader>
          <CardContent style={{ paddingTop: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    padding: '12px',
                    background: alert.type === 'critical' ? 'rgba(239, 68, 68, 0.1)' : 
                             alert.type === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 
                             'rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                    border: `1px solid ${alert.type === 'critical' ? 'rgba(239, 68, 68, 0.3)' : 
                                      alert.type === 'warning' ? 'rgba(245, 158, 11, 0.3)' : 
                                      'var(--border)'}`,
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start'
                  }}
                >
                  {alert.type === 'critical' ? <XCircle size={18} color="#ef4444" /> :
                   alert.type === 'warning' ? <AlertTriangle size={18} color="#f59e0b" /> :
                   <CheckCircle size={18} color="#10b981" />}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', marginBottom: '4px' }}>{alert.message}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{alert.time}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
