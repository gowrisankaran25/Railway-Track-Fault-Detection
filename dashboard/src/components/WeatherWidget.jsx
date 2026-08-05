import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Thermometer, Wind, Droplets, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

const mockWeatherData = {
  location: 'New Delhi, India',
  temperature: 32,
  condition: 'partly_cloudy',
  humidity: 65,
  windSpeed: 12,
  precipitation: 20,
  forecast: [
    { day: 'Today', temp: 32, condition: 'partly_cloudy', precipitation: 20 },
    { day: 'Tomorrow', temp: 34, condition: 'sunny', precipitation: 5 },
    { day: 'Wed', temp: 28, condition: 'cloudy', precipitation: 40 },
    { day: 'Thu', temp: 26, condition: 'rain', precipitation: 80 },
    { day: 'Fri', temp: 29, condition: 'partly_cloudy', precipitation: 25 },
  ]
};

const weatherRiskLevels = {
  low: { color: '#10b981', label: 'Low Risk', impact: 'minimal' },
  moderate: { color: '#f59e0b', label: 'Moderate Risk', impact: 'moderate' },
  high: { color: '#ef4444', label: 'High Risk', impact: 'severe' },
  critical: { color: '#dc2626', label: 'Critical Risk', impact: 'extreme' }
};

const getWeatherIcon = (condition) => {
  switch (condition) {
    case 'sunny': return <Sun size={24} color="#f59e0b" />;
    case 'rain': return <CloudRain size={24} color="#3b82f6" />;
    case 'cloudy': return <Cloud size={24} color="#94a3b8" />;
    case 'partly_cloudy': return <Cloud size={24} color="#64748b" />;
    default: return <Sun size={24} color="#f59e0b" />;
  }
};

const calculateWeatherRisk = (weather) => {
  let riskScore = 0;
  
  // Temperature risk
  if (weather.temperature > 35) riskScore += 30;
  else if (weather.temperature > 30) riskScore += 15;
  else if (weather.temperature < 5) riskScore += 20;
  
  // Precipitation risk
  if (weather.precipitation > 70) riskScore += 40;
  else if (weather.precipitation > 40) riskScore += 25;
  else if (weather.precipitation > 20) riskScore += 10;
  
  // Wind risk
  if (weather.windSpeed > 20) riskScore += 20;
  else if (weather.windSpeed > 15) riskScore += 10;
  
  // Humidity risk
  if (weather.humidity > 80) riskScore += 10;
  
  if (riskScore >= 70) return 'critical';
  if (riskScore >= 50) return 'high';
  if (riskScore >= 30) return 'moderate';
  return 'low';
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState(mockWeatherData);
  const [riskLevel, setRiskLevel] = useState('low');

  useEffect(() => {
    const risk = calculateWeatherRisk(weather);
    setRiskLevel(risk);
  }, [weather]);

  const riskInfo = weatherRiskLevels[riskLevel];

  return (
    <Card className="glass-panel" style={{ padding: '20px' }}>
      <CardContent style={{ padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1rem', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Thermometer size={18} color="var(--accent)" />
              Weather Conditions
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{weather.location}</p>
          </div>
          <Badge variant={riskLevel === 'critical' ? 'critical' : riskLevel === 'high' ? 'major' : 'minor'}>
            {riskInfo.label}
          </Badge>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '50%', 
            background: 'rgba(255,255,255,0.05)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {getWeatherIcon(weather.condition)}
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', lineHeight: 1 }}>{weather.temperature}°C</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
              {weather.condition.replace('_', ' ')}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
          <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
            <Droplets size={18} color="#3b82f6" style={{ marginBottom: '4px' }} />
            <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{weather.humidity}%</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Humidity</div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
            <Wind size={18} color="#64748b" style={{ marginBottom: '4px' }} />
            <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{weather.windSpeed} km/h</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Wind</div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
            <CloudRain size={18} color="#8b5cf6" style={{ marginBottom: '4px' }} />
            <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{weather.precipitation}%</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Rain</div>
          </div>
        </div>

        {riskLevel !== 'low' && (
          <div style={{ 
            padding: '12px', background: `${riskInfo.color}20`, 
            border: `1px solid ${riskInfo.color}40`, borderRadius: '8px',
            display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px'
          }}>
            <AlertTriangle size={18} color={riskInfo.color} />
            <div style={{ fontSize: '0.85rem' }}>
              <span style={{ fontWeight: '600', color: riskInfo.color }}>Weather Alert:</span> Track inspection sensitivity adjusted for {riskInfo.impact} weather conditions
            </div>
          </div>
        )}

        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>5-Day Forecast</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {weather.forecast.map((day, index) => (
              <div key={index} style={{ 
                flex: 1, textAlign: 'center', padding: '8px',
                background: 'rgba(255,255,255,0.03)', borderRadius: '6px',
                fontSize: '0.75rem'
              }}>
                <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>{day.day}</div>
                <div style={{ marginBottom: '4px' }}>{getWeatherIcon(day.condition)}</div>
                <div style={{ fontWeight: '600' }}>{day.temp}°</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
