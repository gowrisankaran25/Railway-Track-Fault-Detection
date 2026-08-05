import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
// import { Badge } from '../components/ui/badge';
import { Select, SelectItem } from '../components/ui/select';
import { Archive as ArchiveIcon, Search, Calendar, Filter, Download, Eye, Trash2, FolderOpen, FileText, X } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const mockArchives = [
  { 
    id: 'ARC-001', 
    name: 'January 2026 Fault Reports', 
    type: 'fault_reports', 
    date: '2026-01-31', 
    size: '245 MB', 
    records: 1523, 
    status: 'archived',
    description: 'Complete fault detection data for January 2026'
  },
  { 
    id: 'ARC-002', 
    name: 'Q4 2025 Drone Logs', 
    type: 'drone_logs', 
    date: '2025-12-31', 
    size: '1.2 GB', 
    records: 45678, 
    status: 'archived',
    description: 'Drone flight logs and telemetry data'
  },
  { 
    id: 'ARC-003', 
    name: 'December 2025 Maintenance Records', 
    type: 'maintenance', 
    date: '2025-12-31', 
    size: '89 MB', 
    records: 234, 
    status: 'archived',
    description: 'Track maintenance and repair records'
  },
  { 
    id: 'ARC-004', 
    name: 'November 2025 Inspector Reports', 
    type: 'inspector_reports', 
    date: '2025-11-30', 
    size: '156 MB', 
    records: 890, 
    status: 'archived',
    description: 'Field inspector daily reports'
  },
  { 
    id: 'ARC-005', 
    name: 'Q3 2025 Weather Data', 
    type: 'weather', 
    date: '2025-09-30', 
    size: '45 MB', 
    records: 2190, 
    status: 'archived',
    description: 'Historical weather impact analysis data'
  }
];

const archiveTypes = [
  { id: 'all', name: 'All Types' },
  { id: 'fault_reports', name: 'Fault Reports' },
  { id: 'drone_logs', name: 'Drone Logs' },
  { id: 'maintenance', name: 'Maintenance Records' },
  { id: 'inspector_reports', name: 'Inspector Reports' },
  { id: 'weather', name: 'Weather Data' }
];

export default function ArchivePage() {
  const [archives, setArchives] = useState(mockArchives);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedArchive, setSelectedArchive] = useState(null);

  const filteredArchives = archives.filter(archive => {
    const matchesSearch = archive.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         archive.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || archive.type === typeFilter;
    const matchesDate = dateFilter === 'all' || archive.date.includes(dateFilter);
    return matchesSearch && matchesType && matchesDate;
  });

  const handleView = (archive) => {
    setSelectedArchive(archive);
    toast.success(`Opening archive: ${archive.name}`);
  };

  const handleDownload = (archive) => {
    toast.success(`Downloading: ${archive.name} (${archive.size})`);
  };

  const handleDelete = (archiveId) => {
    setArchives(prev => prev.filter(a => a.id !== archiveId));
    toast.success('Archive deleted successfully');
  };

  const getTypeIcon = (type) => {
    return <FileText size={18} color="var(--accent)" />;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'fault_reports': return '#ef4444';
      case 'drone_logs': return '#3b82f6';
      case 'maintenance': return '#10b981';
      case 'inspector_reports': return '#f59e0b';
      case 'weather': return '#8b5cf6';
      default: return '#64748b';
    }
  };

  return (
    <div className="page-container" style={{ padding: '20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArchiveIcon size={28} color="var(--accent)" /> Historical Data Archive
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
          Access and manage historical fault detection and maintenance data
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
            <Search size={18} style={{ 
              position: 'absolute', left: '12px', top: '50%', 
              transform: 'translateY(-50%)', color: 'var(--text-secondary)' 
            }} />
            <Input
              placeholder="Search archives by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            {archiveTypes.map(type => (
              <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
            ))}
          </Select>
          <Select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="2026">2026</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
          </Select>
          <Button variant="outline">
            <Filter size={18} style={{ marginRight: '8px' }} /> Advanced Filters
          </Button>
        </div>
      </Card>

      {/* Archive Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <Card className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent)' }}>{archives.length}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Archives</div>
        </Card>
        <Card className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>
            {archives.reduce((sum, a) => sum + a.records, 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Records</div>
        </Card>
        <Card className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#3b82f6' }}>
            {archives.reduce((sum, a) => sum + parseFloat(a.size), 0).toFixed(1)} GB
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Storage</div>
        </Card>
        <Card className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b' }}>5</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Archive Types</div>
        </Card>
      </div>

      {/* Archives Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {filteredArchives.map((archive, index) => (
          <motion.div
            key={archive.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-panel" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => handleView(archive)}>
              <CardContent style={{ padding: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '8px',
                      background: `${getTypeColor(archive.type)}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <FolderOpen size={24} color={getTypeColor(archive.type)} />
                    </div>
                    <div>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>{archive.name}</h3>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{archive.id}</p>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#10b981',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}>
                    {archive.type.replace('_', ' ')}
                  </span>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.4' }}>
                  {archive.description}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.1)', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>Records</div>
                    <div style={{ fontSize: '1rem', fontWeight: '600' }}>{archive.records.toLocaleString()}</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.1)', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>Size</div>
                    <div style={{ fontSize: '1rem', fontWeight: '600' }}>{archive.size}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} />
                    {archive.date}
                  </span>
                  <span style={{
                    fontSize: '0.65rem',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#10b981',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}>{archive.status}</span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    style={{ flex: 1 }}
                    onClick={(e) => { e.stopPropagation(); handleView(archive); }}
                  >
                    <Eye size={14} style={{ marginRight: '4px' }} /> View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); handleDownload(archive); }}
                  >
                    <Download size={14} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); handleDelete(archive.id); }}
                  >
                    <Trash2 size={14} color="#ef4444" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredArchives.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          <Archive size={64} style={{ opacity: 0.3, marginBottom: '16px' }} />
          <p style={{ fontSize: '1.1rem' }}>No archives found</p>
          <p style={{ fontSize: '0.9rem' }}>Try adjusting your search or filters</p>
        </div>
      )}

      {/* Archive View Modal */}
      {selectedArchive && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ width: '100%', maxWidth: '600px' }}
          >
            <Card className="glass-panel" style={{ background: 'var(--bg-card)' }}>
              <CardHeader style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <CardTitle>{selectedArchive.name}</CardTitle>
                  <CardDescription>{selectedArchive.id} • {selectedArchive.date}</CardDescription>
                </div>
                <Button variant="ghost" onClick={() => setSelectedArchive(null)} style={{ padding: '8px' }}>
                  <X size={20} />
                </Button>
              </CardHeader>
              <CardContent style={{ padding: '24px' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{selectedArchive.description}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Total Records</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>{selectedArchive.records.toLocaleString()}</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>File Size</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>{selectedArchive.size}</div>
                  </div>
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '16px', borderRadius: '8px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FileText size={24} />
                  <div>
                    <div style={{ fontWeight: '600' }}>Dataset Ready</div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>The archive has been verified and is ready for download or analysis.</div>
                  </div>
                </div>
              </CardContent>
              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <Button variant="outline" onClick={() => setSelectedArchive(null)}>Close</Button>
                <Button onClick={() => handleDownload(selectedArchive)}>
                  <Download size={16} style={{ marginRight: '8px' }} /> Download Archive
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
