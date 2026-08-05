import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AlertCircle, Lock, Mail, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    const success = login(email, password);
    if (success) {
      toast.success('Login Successful');
      navigate('/');
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-dark)'
    }}>
      <Card className="glass-panel" style={{ width: '400px', padding: '40px' }}>
        <CardHeader style={{ textAlign: 'center', paddingBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', marginBottom: '10px' }}>
            <AlertCircle color="var(--accent)" size={32} />
            <CardTitle style={{ fontSize: '1.5rem' }}>RCC <span style={{color: 'var(--accent)'}}>Login</span></CardTitle>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Secure Command Center Access
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', top: '14px', left: '14px', color: 'var(--text-secondary)' }} />
              <Input 
                type="email" 
                placeholder="Officer Email / Badge ID" 
                style={{ paddingLeft: '40px' }}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', top: '14px', left: '14px', color: 'var(--text-secondary)' }} />
              <Input 
                type="password" 
                placeholder="Secure Password" 
                style={{ paddingLeft: '40px' }}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked /> Remember Me
              </label>
              <span style={{ cursor: 'pointer', color: 'var(--accent)' }}>Forgot Password?</span>
            </div>
            
            <Button type="submit" style={{ justifyContent: 'center', marginTop: '10px' }}>
              Authenticate <ArrowRight size={18} style={{marginLeft: '8px'}} />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
