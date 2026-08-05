import React, { useState } from 'react';
import { Search, Filter, X, Calendar, MapPin, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectItem } from './ui/select';

export default function SearchFilterBar({ onFilter, filters }) {
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');
  const [severityFilter, setSeverityFilter] = useState(filters.severity || 'all');
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
  const [dateRange, setDateRange] = useState(filters.dateRange || 'all');
  const [showFilters, setShowFilters] = useState(false);

  const handleApplyFilters = () => {
    onFilter({
      searchTerm,
      severity: severityFilter,
      status: statusFilter,
      dateRange
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSeverityFilter('all');
    setStatusFilter('all');
    setDateRange('all');
    onFilter({
      searchTerm: '',
      severity: 'all',
      status: 'all',
      dateRange: 'all'
    });
  };

  const activeFiltersCount = [
    searchTerm,
    severityFilter !== 'all' ? severityFilter : null,
    statusFilter !== 'all' ? statusFilter : null,
    dateRange !== 'all' ? dateRange : null
  ].filter(Boolean).length;

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: showFilters ? '16px' : 0 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ 
            position: 'absolute', left: '12px', top: '50%', 
            transform: 'translateY(-50%)', color: 'var(--text-secondary)' 
          }} />
          <Input
            placeholder="Search by fault type, location, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
            style={{ paddingLeft: '40px' }}
          />
        </div>
        <Button
          variant={showFilters ? 'default' : 'outline'}
          onClick={() => setShowFilters(!showFilters)}
          style={{ position: 'relative' }}
        >
          <Filter size={18} />
          Filters
          {activeFiltersCount > 0 && (
            <Badge style={{ 
              position: 'absolute', top: '-8px', right: '-8px',
              background: 'var(--accent)', color: 'white',
              fontSize: '0.7rem', padding: '2px 6px', minWidth: '18px'
            }}>
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" onClick={handleClearFilters}>
            <X size={18} /> Clear
          </Button>
        )}
      </div>

      {showFilters && (
        <div style={{
          padding: '20px',
          background: 'rgba(0,0,0,0.1)',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <AlertTriangle size={14} style={{ display: 'inline', marginRight: '4px' }} />
              Severity
            </label>
            <Select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="major">Major</SelectItem>
              <SelectItem value="minor">Minor</SelectItem>
            </Select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Status
            </label>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="dispatched">Dispatched</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="false_positive">False Positive</SelectItem>
            </Select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
              Date Range
            </label>
            <Select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last 90 Days</SelectItem>
            </Select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            <Button onClick={handleApplyFilters} style={{ flex: 1 }}>
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
