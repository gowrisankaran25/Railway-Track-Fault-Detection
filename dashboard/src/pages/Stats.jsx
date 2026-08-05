import React, { useState, useEffect, useContext } from 'react';
import { Activity, AlertOctagon, CheckCircle, Download, Calendar, Filter, TrendingUp, Map, Clock, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getDashboardStats } from '../services/api';
import { ThemeContext } from '../context/ThemeContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend, LineChart, Line
} from 'recharts';
import DataExport from '../components/DataExport';

// Enhanced Mock Data for Charts
const trendData = {
  '7d': [
    { day: 'Mon', faults: 45, resolved: 30, predicted: 42 },
    { day: 'Tue', faults: 52, resolved: 48, predicted: 48 },
    { day: 'Wed', faults: 38, resolved: 35, predicted: 40 },
    { day: 'Thu', faults: 65, resolved: 40, predicted: 55 },
    { day: 'Fri', faults: 41, resolved: 55, predicted: 45 },
    { day: 'Sat', faults: 29, resolved: 25, predicted: 32 },
    { day: 'Sun', faults: 18, resolved: 22, predicted: 20 },
  ],
  '30d': [
    { day: 'Week 1', faults: 288, resolved: 265, predicted: 275 },
    { day: 'Week 2', faults: 312, resolved: 298, predicted: 305 },
    { day: 'Week 3', faults: 245, resolved: 280, predicted: 260 },
    { day: 'Week 4', faults: 278, resolved: 290, predicted: 285 },
  ],
  '90d': [
    { day: 'Month 1', faults: 1150, resolved: 1100, predicted: 1120 },
    { day: 'Month 2', faults: 1080, resolved: 1120, predicted: 1100 },
    { day: 'Month 3', faults: 980, resolved: 1050, predicted: 1010 },
  ]
};

const severityData = [
  { name: 'Minor', value: 842, color: '#10b981', trend: '+5%' },
  { name: 'Major', value: 162, color: '#f59e0b', trend: '-12%' },
  { name: 'Critical', value: 75, color: '#ef4444', trend: '+8%' },
];

const resolutionData = [
  { name: 'Resolved', value: 85, color: '#3b82f6' },
  { name: 'Pending', value: 15, color: '#64748b' },
];

const faultTypeData = [
  { name: 'Crack', value: 35, color: '#ef4444' },
  { name: 'Misalignment', value: 28, color: '#f59e0b' },
  { name: 'Missing Fishplate', value: 18, color: '#3b82f6' },
  { name: 'Obstruction', value: 12, color: '#8b5cf6' },
  { name: 'Corrosion', value: 7, color: '#10b981' },
];

const regionalData = [
  { region: 'Northern', faults: 245, resolved: 230, efficiency: 94 },
  { region: 'Southern', faults: 198, resolved: 185, efficiency: 93 },
  { region: 'Eastern', faults: 178, resolved: 165, efficiency: 93 },
  { region: 'Western', faults: 156, resolved: 148, efficiency: 95 },
  { region: 'Central', faults: 134, resolved: 125, efficiency: 93 },
];

const costImpactData = [
  { month: 'Oct', prevented: 2.1, actual: 0.8 },
  { month: 'Nov', prevented: 2.8, actual: 1.2 },
  { month: 'Dec', prevented: 3.5, actual: 1.5 },
  { month: 'Jan', prevented: 4.2, actual: 1.8 },
];

export default function Stats() {
  const { theme } = useContext(ThemeContext);
  const isLight = theme === 'light';
  
  const [stats, setStats] = useState({
    total_faults: 0,
    critical_faults: 0,
    pending_verifications: 0,
    avg_resolution_time: 0,
    cost_savings: 0
  });
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedView, setSelectedView] = useState('overview');

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getDashboardStats();
      if (data) {
        setStats({
          total_faults: severityData.reduce((acc, curr) => acc + curr.value, 0),
          critical_faults: severityData[2].value,
          pending_verifications: 89,
          avg_resolution_time: 6.5,
          cost_savings: 4.2
        });
      }
    };
    fetchStats();
  }, []);

  const exportPDF = async () => {
    const toastId = toast.loading('Generating Report...');
    const element = document.getElementById('report-content');
    
    const originalBg = document.body.style.background;
    document.body.style.background = 'var(--bg-dark)';
    
    try {
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: null, logging: false });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('RCC_Maintenance_Report.pdf');
      toast.success('Report Downloaded!', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate report', { id: toastId });
    }
    
    document.body.style.background = originalBg;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } })
  };

  const axisColor = isLight ? "#64748b" : "#94a3b8";
  const gridColor = isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)";

  return (
    <div className="page-container" id="report-content" style={{padding: '20px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px'}}>
        <div>
          <h1 className="page-title" style={{marginBottom: '4px'}}>Analytics & AI Insights</h1>
          <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>Real-time fault detection analytics and predictive maintenance insights</p>
        </div>
        <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
          <Button variant="outline" onClick={exportPDF}>
            <Download size={18} style={{marginRight: '8px'}} /> Export PDF
          </Button>
          <div style={{display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.1)', padding: '4px', borderRadius: '8px'}}>
            {['7d', '30d', '90d'].map(range => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange(range)}
                style={{fontSize: '0.85rem'}}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px'}}>
        <motion.div custom={0} initial="hidden" animate="visible" variants={cardVariants} className="glass-panel" style={{padding: '20px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px'}}>
            <div style={{width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Activity size={24} />
            </div>
            <div>
              <h3 style={{fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 4px 0'}}>Total Faults (YTD)</h3>
              <p style={{fontSize: '1.8rem', fontWeight: '700', margin: 0}}>{stats.total_faults.toLocaleString()}</p>
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem'}}>
            <ArrowUpRight size={16} className="text-green-500" />
            <span className="text-green-500">+12%</span>
            <span style={{color: 'var(--text-secondary)'}}>from last year</span>
          </div>
        </motion.div>
        
        <motion.div custom={1} initial="hidden" animate="visible" variants={cardVariants} className="glass-panel" style={{padding: '20px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px'}}>
            <div style={{width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--critical)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <AlertOctagon size={24} />
            </div>
            <div>
              <h3 style={{fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 4px 0'}}>Critical Faults</h3>
              <p style={{fontSize: '1.8rem', fontWeight: '700', margin: 0}}>{stats.critical_faults}</p>
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem'}}>
            <Badge variant="critical" style={{fontSize: '0.75rem'}}>Action Required</Badge>
            <span style={{color: 'var(--text-secondary)'}}>Immediate dispatch</span>
          </div>
        </motion.div>
        
        <motion.div custom={2} initial="hidden" animate="visible" variants={cardVariants} className="glass-panel" style={{padding: '20px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px'}}>
            <div style={{width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: 'var(--minor)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <CheckCircle size={24} />
            </div>
            <div>
              <h3 style={{fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 4px 0'}}>Pending Verification</h3>
              <p style={{fontSize: '1.8rem', fontWeight: '700', margin: 0}}>{stats.pending_verifications}</p>
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem'}}>
            <Clock size={16} style={{color: 'var(--text-secondary)'}} />
            <span style={{color: 'var(--text-secondary)'}}>Awaiting human review</span>
          </div>
        </motion.div>

        <motion.div custom={3} initial="hidden" animate="visible" variants={cardVariants} className="glass-panel" style={{padding: '20px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px'}}>
            <div style={{width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Clock size={24} />
            </div>
            <div>
              <h3 style={{fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 4px 0'}}>Avg Resolution Time</h3>
              <p style={{fontSize: '1.8rem', fontWeight: '700', margin: 0}}>{stats.avg_resolution_time}h</p>
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem'}}>
            <ArrowDownRight size={16} className="text-green-500" />
            <span className="text-green-500">-18%</span>
            <span style={{color: 'var(--text-secondary)'}}>vs last month</span>
          </div>
        </motion.div>

        <motion.div custom={4} initial="hidden" animate="visible" variants={cardVariants} className="glass-panel" style={{padding: '20px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px'}}>
            <div style={{width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <DollarSign size={24} />
            </div>
            <div>
              <h3 style={{fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 4px 0'}}>Cost Savings</h3>
              <p style={{fontSize: '1.8rem', fontWeight: '700', margin: 0}}>₹{stats.cost_savings}Cr</p>
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem'}}>
            <ArrowUpRight size={16} className="text-green-500" />
            <span className="text-green-500">+24%</span>
            <span style={{color: 'var(--text-secondary)'}}>this quarter</span>
          </div>
        </motion.div>
      </div>
      
      <Tabs defaultValue="overview" style={{ marginBottom: '30px' }}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
          <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
            <motion.div custom={5} initial="hidden" animate="visible" variants={cardVariants} className="glass-panel" style={{ padding: '20px', minHeight: '350px' }}>
              <h3 style={{ marginBottom: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={20} /> Fault Trend Analysis
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={trendData[timeRange]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFaults" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="day" stroke={axisColor} fontSize={12} tickLine={false} />
                  <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: isLight ? '#fff' : '#1e293b', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: isLight ? '#0f172a' : '#f8fafc' }}
                  />
                  <Legend verticalAlign="top" height={36}/>
                  <Area type="monotone" dataKey="faults" name="Detected Faults" stroke="#ef4444" fillOpacity={1} fill="url(#colorFaults)" />
                  <Area type="monotone" dataKey="resolved" name="Resolved Issues" stroke="#10b981" fillOpacity={1} fill="url(#colorResolved)" />
                  <Area type="monotone" dataKey="predicted" name="AI Predicted" stroke="#3b82f6" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPredicted)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div custom={6} initial="hidden" animate="visible" variants={cardVariants} className="glass-panel" style={{ padding: '20px', minHeight: '350px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>Detection Breakdown</h3>
              <div style={{ display: 'flex', flex: 1, gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '10px' }}>By Severity</h4>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={severityData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke={axisColor} fontSize={12} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill: gridColor}} contentStyle={{ backgroundColor: isLight ? '#fff' : '#1e293b', border: 'none', borderRadius: '8px' }} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                        {severityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '10px' }}>Resolution Rate</h4>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={resolutionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {resolutionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: isLight ? '#fff' : '#1e293b', border: 'none', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            <motion.div custom={7} initial="hidden" animate="visible" variants={cardVariants} className="glass-panel" style={{ padding: '20px', minHeight: '350px' }}>
              <h3 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>Fault Types Distribution</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <Pie
                    data={faultTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                    stroke="none"
                  >
                    {faultTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: isLight ? '#fff' : '#1e293b', border: 'none', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <div style={{ display: 'grid', gap: '20px' }}>
            <motion.div custom={8} initial="hidden" animate="visible" variants={cardVariants} className="glass-panel" style={{ padding: '20px' }}>
              <h3 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>Severity Trends with AI Predictions</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trendData[timeRange]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="day" stroke={axisColor} fontSize={12} tickLine={false} />
                  <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: isLight ? '#fff' : '#1e293b', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: isLight ? '#0f172a' : '#f8fafc' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="faults" name="Actual Faults" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="predicted" name="AI Predicted" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {severityData.map((item, index) => (
                <motion.div key={item.name} custom={index + 9} initial="hidden" animate="visible" variants={cardVariants} className="glass-panel" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{item.name} Faults</h4>
                    <Badge variant={item.name === 'Critical' ? 'critical' : item.name === 'Major' ? 'major' : 'minor'}>
                      {item.trend}
                    </Badge>
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '700', color: item.color, marginBottom: '12px' }}>
                    {item.value}
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Resolution Rate</span>
                      <span style={{ fontWeight: '600' }}>{item.name === 'Critical' ? '94%' : item.name === 'Major' ? '88%' : '97%'}</span>
                    </div>
                    <Progress value={item.name === 'Critical' ? 94 : item.name === 'Major' ? 88 : 97} className="h-2" />
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Avg. resolution time: {item.name === 'Critical' ? '2.3h' : item.name === 'Major' ? '8.5h' : '24h'}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="regional">
          <div style={{ display: 'grid', gap: '20px' }}>
            <motion.div custom={12} initial="hidden" animate="visible" variants={cardVariants} className="glass-panel" style={{ padding: '20px' }}>
              <h3 style={{ marginBottom: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Map size={20} /> Regional Performance Analysis
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={regionalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="region" stroke={axisColor} fontSize={12} tickLine={false} />
                  <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: isLight ? '#fff' : '#1e293b', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: isLight ? '#0f172a' : '#f8fafc' }}
                  />
                  <Legend />
                  <Bar dataKey="faults" name="Total Faults" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {regionalData.map((region, index) => (
                <motion.div key={region.region} custom={index + 13} initial="hidden" animate="visible" variants={cardVariants} className="glass-panel" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{region.region}</h4>
                    <Badge variant="minor" style={{ fontSize: '0.75rem' }}>{region.efficiency}% Efficient</Badge>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.9rem' }}>
                    <div>
                      <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Total Faults</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ef4444' }}>{region.faults}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Resolved</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>{region.resolved}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Resolution Rate</span>
                      <span style={{ fontWeight: '600' }}>{region.efficiency}%</span>
                    </div>
                    <Progress value={region.efficiency} className="h-2" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cost">
          <div style={{ display: 'grid', gap: '20px' }}>
            <motion.div custom={18} initial="hidden" animate="visible" variants={cardVariants} className="glass-panel" style={{ padding: '20px' }}>
              <h3 style={{ marginBottom: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={20} /> Cost Impact Analysis
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={costImpactData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="month" stroke={axisColor} fontSize={12} tickLine={false} />
                  <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: isLight ? '#fff' : '#1e293b', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: isLight ? '#0f172a' : '#f8fafc' }}
                    formatter={(value) => `₹${value}Cr`}
                  />
                  <Legend />
                  <Bar dataKey="prevented" name="Cost Prevented" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actual" name="Actual Cost" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <motion.div custom={19} initial="hidden" animate="visible" variants={cardVariants} className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '0.9rem' }}>Total Cost Prevented (YTD)</div>
                <div style={{ fontSize: '3rem', fontWeight: '700', color: '#10b981', marginBottom: '8px' }}>₹12.6Cr</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem' }}>
                  <ArrowUpRight size={16} className="text-green-500" />
                  <span className="text-green-500">+32%</span>
                  <span style={{ color: 'var(--text-secondary)' }}>vs last year</span>
                </div>
              </motion.div>

              <motion.div custom={20} initial="hidden" animate="visible" variants={cardVariants} className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '0.9rem' }}>Faults Prevented</div>
                <div style={{ fontSize: '3rem', fontWeight: '700', color: '#3b82f6', marginBottom: '8px' }}>487</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem' }}>
                  <ArrowUpRight size={16} className="text-green-500" />
                  <span className="text-green-500">+18%</span>
                  <span style={{ color: 'var(--text-secondary)' }}>early detection</span>
                </div>
              </motion.div>

              <motion.div custom={21} initial="hidden" animate="visible" variants={cardVariants} className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '0.9rem' }}>ROI on AI System</div>
                <div style={{ fontSize: '3rem', fontWeight: '700', color: '#f59e0b', marginBottom: '8px' }}>312%</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem' }}>
                  <ArrowUpRight size={16} className="text-green-500" />
                  <span className="text-green-500">+45%</span>
                  <span style={{ color: 'var(--text-secondary)' }}>investment return</span>
                </div>
              </motion.div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
