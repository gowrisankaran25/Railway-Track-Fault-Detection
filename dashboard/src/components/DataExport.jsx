import React, { useState } from 'react';
import { Download, FileText, Calendar, Filter, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectItem } from './ui/select';
import { Input } from './ui/input';
// import { Badge } from './ui/badge';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const exportFormats = [
  { id: 'pdf', name: 'PDF Report', icon: FileText, description: 'Professional formatted report with charts' },
  { id: 'csv', name: 'CSV Data', icon: FileText, description: 'Raw data for spreadsheet analysis' },
  { id: 'excel', name: 'Excel Workbook', icon: FileText, description: 'Multi-sheet workbook with pivot tables' },
  { id: 'json', name: 'JSON API', icon: FileText, description: 'Structured data for system integration' }
];

const reportTemplates = [
  { id: 'daily', name: 'Daily Summary', description: '24-hour fault detection summary' },
  { id: 'weekly', name: 'Weekly Analysis', description: '7-day trend analysis and insights' },
  { id: 'monthly', name: 'Monthly Report', description: '30-day comprehensive report' },
  { id: 'sla', name: 'SLA Compliance', description: 'Service level agreement performance' },
  { id: 'inspector', name: 'Inspector Performance', description: 'Team productivity and efficiency' }
];

export default function DataExport() {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [selectedTemplate, setSelectedTemplate] = useState('daily');
  const [dateRange, setDateRange] = useState('7d');
  const [isExporting, setIsExporting] = useState(false);
  const [exportHistory, setExportHistory] = useState([
    { id: 1, name: 'Daily Summary', format: 'pdf', date: '2024-01-15 10:30', status: 'completed' },
    { id: 2, name: 'Weekly Analysis', format: 'excel', date: '2024-01-14 15:45', status: 'completed' },
    { id: 3, name: 'SLA Compliance', format: 'pdf', date: '2024-01-13 09:20', status: 'failed' }
  ]);

  const handleExport = () => {
    setIsExporting(true);
    
    setTimeout(() => {
      setIsExporting(false);
      const newExport = {
        id: exportHistory.length + 1,
        name: reportTemplates.find(t => t.id === selectedTemplate)?.name,
        format: selectedFormat,
        date: new Date().toLocaleString(),
        status: 'completed'
      };
      setExportHistory([newExport, ...exportHistory]);
      toast.success(`Export completed: ${newExport.name}.${selectedFormat}`);
    }, 2000);
  };

  const getStatusIcon = (status) => {
    return status === 'completed' 
      ? <CheckCircle size={16} color="#10b981" />
      : <XCircle size={16} color="#ef4444" />;
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Download size={24} color="var(--accent)" /> Data Export & Reporting
        </h2>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
          Generate and download reports in various formats
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Export Configuration */}
        <Card className="glass-panel" style={{ padding: '24px' }}>
          <CardHeader style={{ paddingBottom: '16px' }}>
            <CardTitle style={{ fontSize: '1.1rem' }}>Export Configuration</CardTitle>
            <CardDescription>Configure your export parameters</CardDescription>
          </CardHeader>
          <CardContent style={{ paddingTop: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Report Template
                </label>
                <Select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)}>
                  {reportTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name} - {template.description}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Export Format
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {exportFormats.map(format => (
                    <div
                      key={format.id}
                      onClick={() => setSelectedFormat(format.id)}
                      style={{
                        padding: '16px',
                        border: `2px solid ${selectedFormat === format.id ? 'var(--accent)' : 'var(--border)'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        background: selectedFormat === format.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                        transition: 'all 0.2s'
                      }}
                    >
                      <format.icon size={20} style={{ marginBottom: '8px', color: 'var(--accent)' }} />
                      <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{format.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{format.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Date Range
                </label>
                <Select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </Select>
              </div>

              {dateRange === 'custom' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>From</label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>To</label>
                    <Input type="date" />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                <input type="checkbox" id="includeCharts" defaultChecked />
                <label htmlFor="includeCharts" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                  Include charts and visualizations
                </label>
              </div>

              <Button 
                onClick={handleExport} 
                disabled={isExporting}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Download size={18} style={{ marginRight: '8px' }} />
                {isExporting ? 'Generating Report...' : 'Export Report'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Export History */}
        <Card className="glass-panel" style={{ padding: '24px' }}>
          <CardHeader style={{ paddingBottom: '16px' }}>
            <CardTitle style={{ fontSize: '1.1rem' }}>Export History</CardTitle>
            <CardDescription>Recent exports</CardDescription>
          </CardHeader>
          <CardContent style={{ paddingTop: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {exportHistory.map((exportItem, index) => (
                <motion.div
                  key={exportItem.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    padding: '12px',
                    background: 'rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{exportItem.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {exportItem.format.toUpperCase()} • {exportItem.date}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {getStatusIcon(exportItem.status)}
                    <span style={{
                      fontSize: '0.65rem',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: exportItem.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: exportItem.status === 'completed' ? '#10b981' : '#ef4444',
                      border: exportItem.status === 'completed' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
                    }}>
                      {exportItem.status}
                    </span>
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
