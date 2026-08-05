import React, { useState } from 'react';
import { Save, Bell, Shield, Map as MapIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('notifications');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="page-container" style={{padding: '20px'}}>
      <h1 className="page-title" style={{marginBottom: '24px'}}>System Settings</h1>
      
      <Card className="glass-panel" style={{ padding: '24px' }}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList style={{ marginBottom: '24px' }}>
            <TabsTrigger value="notifications">
              <Bell size={16} style={{marginRight: '8px'}} /> Notifications
            </TabsTrigger>
            <TabsTrigger value="map">
              <MapIcon size={16} style={{marginRight: '8px'}} /> Map Preferences
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield size={16} style={{marginRight: '8px'}} /> Security & Roles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications">
            <CardHeader style={{ paddingLeft: 0, paddingRight: 0 }}>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how and when you receive alerts for track faults.</CardDescription>
            </CardHeader>
            <CardContent style={{ paddingLeft: 0, paddingRight: 0, paddingTop: 0 }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>Critical Fault SMS Alerts</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Send an SMS immediately when a critical fault is detected.</div>
                  </div>
                  <input type="checkbox" checked={smsAlerts} onChange={(e) => setSmsAlerts(e.target.checked)} style={{ width: '20px', height: '20px' }} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>Email Daily Summary</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Receive a daily digest of all inspections and faults.</div>
                  </div>
                  <input type="checkbox" checked={emailDigest} onChange={(e) => setEmailDigest(e.target.checked)} style={{ width: '20px', height: '20px' }} />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Alert Phone Number</label>
                  <Input 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                  />
                </div>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="map">
            <CardHeader style={{ paddingLeft: 0, paddingRight: 0 }}>
              <CardTitle>Map Preferences</CardTitle>
              <CardDescription>Customize the default view and behavior of the live map.</CardDescription>
            </CardHeader>
            <CardContent style={{ paddingLeft: 0, paddingRight: 0, paddingTop: 0 }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>Show Heatmap by Default</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Display predictive fault zones automatically on map load.</div>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>Cluster Map Markers</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Group nearby fault markers together to reduce clutter.</div>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
                </div>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="security">
            <CardHeader style={{ paddingLeft: 0, paddingRight: 0 }}>
              <CardTitle>Security & Roles</CardTitle>
              <CardDescription>Manage your account security and division access.</CardDescription>
            </CardHeader>
            <CardContent style={{ paddingLeft: 0, paddingRight: 0, paddingTop: 0 }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>Two-Factor Authentication (2FA)</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Require an OTP code when logging into the Command Center.</div>
                  </div>
                  <input type="checkbox" style={{ width: '20px', height: '20px' }} />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Change Password</label>
                  <Input type="password" placeholder="New Password" style={{marginBottom: '12px'}} />
                  <Input type="password" placeholder="Confirm Password" />
                </div>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
        
        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
          <Button onClick={handleSave}>
            <Save size={18} style={{marginRight: '8px'}} /> Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
}
