import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
// import { Badge } from './ui/badge';
import { Users, Send, MessageSquare, Clock, User, MoreVertical, Video, Phone, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const mockUsers = [
  { id: 1, name: 'Rajesh Kumar', role: 'Senior Inspector', status: 'online', avatar: 'RK' },
  { id: 2, name: 'Priya Sharma', role: 'Data Analyst', status: 'online', avatar: 'PS' },
  { id: 3, name: 'Amit Verma', role: 'Drone Operator', status: 'away', avatar: 'AV' },
  { id: 4, name: 'Sneha Patel', role: 'Maintenance Lead', status: 'online', avatar: 'SP' },
  { id: 5, name: 'Vikram Singh', role: 'System Admin', status: 'offline', avatar: 'VS' }
];

const mockMessages = [
  { id: 1, user: 'Priya Sharma', message: 'Critical fault detected at Sector 4. AI confidence 94%.', time: '2 min ago', isOwn: false },
  { id: 2, user: 'Rajesh Kumar', message: 'On my way to inspect. ETA 15 minutes.', time: '1 min ago', isOwn: false },
  { id: 3, user: 'You', message: 'Drone Alpha dispatched for aerial verification.', time: 'Just now', isOwn: true }
];

export default function CollaborationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const [users, setUsers] = useState(mockUsers);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      user: 'You',
      message: message,
      time: 'Just now',
      isOwn: true
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    toast.success('Message sent');
  };

  const onlineCount = users.filter(u => u.status === 'online').length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#10b981';
      case 'away': return '#f59e0b';
      case 'offline': return '#64748b';
      default: return '#64748b';
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Toggle Button */}
      <Button
        variant={isOpen ? 'default' : 'outline'}
        onClick={() => setIsOpen(!isOpen)}
        style={{ position: 'relative' }}
      >
        <Users size={18} style={{ marginRight: '8px' }} />
        Team
        {onlineCount > 0 && (
          <span style={{
            position: 'absolute', top: '-8px', right: '-8px',
            background: '#10b981', color: 'white',
            fontSize: '0.7rem', padding: '2px 6px', minWidth: '18px',
            borderRadius: '50%'
          }}>
            {onlineCount}
          </span>
        )}
      </Button>

      {/* Collaboration Panel */}
      <AnimatePresence>
        {isOpen && (
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
            <Card className="glass-panel" style={{ padding: 0, background: 'var(--bg-dark)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
              <CardHeader style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <CardTitle style={{ fontSize: '1rem', margin: 0 }}>Team Collaboration</CardTitle>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="ghost" size="icon">
                      <Video size={16} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Phone size={16} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
                <button
                  onClick={() => setActiveTab('chat')}
                  style={{
                    flex: 1, padding: '12px',
                    background: activeTab === 'chat' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    border: 'none', borderBottom: activeTab === 'chat' ? '2px solid var(--accent)' : 'none',
                    color: 'var(--text-primary)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem'
                  }}
                >
                  <MessageSquare size={16} /> Chat
                </button>
                <button
                  onClick={() => setActiveTab('team')}
                  style={{
                    flex: 1, padding: '12px',
                    background: activeTab === 'team' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    border: 'none', borderBottom: activeTab === 'team' ? '2px solid var(--accent)' : 'none',
                    color: 'var(--text-primary)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem'
                  }}
                >
                  <Users size={16} /> Team ({onlineCount})
                </button>
              </div>

              <CardContent style={{ padding: 0, maxHeight: '350px', overflowY: 'auto' }}>
                {activeTab === 'chat' ? (
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                      {messages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{
                            display: 'flex',
                            flexDirection: msg.isOwn ? 'row-reverse' : 'row',
                            gap: '8px'
                          }}
                        >
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: 'var(--accent)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.75rem', fontWeight: '600', color: 'white',
                            flexShrink: 0
                          }}>
                            {msg.user.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div style={{ flex: 1, maxWidth: '70%' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                              {msg.user} • {msg.time}
                            </div>
                            <div style={{
                              padding: '10px 14px',
                              borderRadius: '12px',
                              background: msg.isOwn ? 'var(--accent)' : 'rgba(0,0,0,0.1)',
                              color: msg.isOwn ? 'white' : 'var(--text-primary)',
                              fontSize: '0.85rem',
                              wordBreak: 'break-word'
                            }}>
                              {msg.message}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Input
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        style={{ flex: 1 }}
                      />
                      <Button onClick={handleSendMessage} size="icon">
                        <Send size={18} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {users.map((user) => (
                        <motion.div
                          key={user.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            background: 'rgba(0,0,0,0.1)',
                            borderRadius: '8px'
                          }}
                        >
                          <div style={{ position: 'relative' }}>
                            <div style={{
                              width: '40px', height: '40px', borderRadius: '50%',
                              background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.9rem', fontWeight: '600', color: 'white'
                            }}>
                              {user.avatar}
                            </div>
                            <div style={{
                              position: 'absolute', bottom: 0, right: 0,
                              width: '12px', height: '12px', borderRadius: '50%',
                              background: getStatusColor(user.status),
                              border: '2px solid var(--bg-card)'
                            }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.role}</div>
                          </div>
                          <span style={{
                            fontSize: '0.65rem',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: user.status === 'online' ? 'rgba(16, 185, 129, 0.2)' : user.status === 'away' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            color: user.status === 'online' ? '#10b981' : user.status === 'away' ? '#f59e0b' : '#ef4444',
                            border: `1px solid ${user.status === 'online' ? 'rgba(16, 185, 129, 0.3)' : user.status === 'away' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                          }}>
                            {user.status}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
