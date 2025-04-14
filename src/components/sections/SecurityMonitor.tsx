import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getSecurityOverview, getSecurityRiskScores, getVulnerabilities, getSecurityEvents, getSecurityMeasures } from '../../services/api';
import type { SecurityOverview, SecurityRiskScore, Vulnerability, SecurityEvent, SecurityMeasures } from '../../services/api';

// Initial loading state data
const initialData = {
  riskScores: [
    { time: '00:00', score: 15 },
    { time: '04:00', score: 12 },
    { time: '08:00', score: 18 },
    { time: '12:00', score: 14 },
    { time: '16:00', score: 11 },
    { time: '20:00', score: 13 },
  ],
  vulnerabilities: [
    { type: 'Critical', count: 0 },
    { type: 'High', count: 1 },
    { type: 'Medium', count: 3 },
    { type: 'Low', count: 8 },
  ],
  recentEvents: [
    {
      id: 1,
      type: 'info',
      message: 'New contract interaction from verified address',
      timestamp: '5m ago',
    },
    {
      id: 2,
      type: 'warning',
      message: 'Unusual gas price spike detected',
      timestamp: '15m ago',
    },
    {
      id: 3,
      type: 'info',
      message: 'Successful audit check completed',
      timestamp: '1h ago',
    },
  ],
};

const SecurityCard: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-cyber-black/30 rounded-xl p-6 border border-cyber-orange/20"
  >
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    {children}
  </motion.div>
);

const StatusIndicator: React.FC<{
  status: 'safe' | 'warning' | 'danger';
}> = ({ status }) => {
  const colors = {
    safe: 'bg-cyber-green',
    warning: 'bg-cyber-yellow',
    danger: 'bg-cyber-pink',
  };

  return (
    <div className="flex items-center">
      <div className={`w-2 h-2 rounded-full ${colors[status]} mr-2 animate-pulse`} />
      <span className="text-sm">
        {status === 'safe' && 'System Secure'}
        {status === 'warning' && 'Elevated Risk'}
        {status === 'danger' && 'Critical Alert'}
      </span>
    </div>
  );
};

const SecurityMonitor: React.FC = () => {
  const [overview, setOverview] = useState<SecurityOverview | null>(null);
  const [riskScores, setRiskScores] = useState<SecurityRiskScore[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [measures, setMeasures] = useState<SecurityMeasures | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        const [overviewData, riskScoresData, vulnerabilitiesData, eventsData, measuresData] = await Promise.all([
          getSecurityOverview(),
          getSecurityRiskScores(),
          getVulnerabilities(),
          getSecurityEvents(),
          getSecurityMeasures()
        ]);

        setOverview(overviewData);
        setRiskScores(riskScoresData);
        setVulnerabilities(vulnerabilitiesData);
        setEvents(eventsData);
        setMeasures(measuresData);
      } catch (error) {
        console.error('Error fetching security data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSecurityData();

    // Refresh data every 5 minutes
    const interval = setInterval(fetchSecurityData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-orange"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SecurityCard title="Overall Security Status">
          <div className="space-y-4">
            <div className="text-3xl font-bold text-cyber-green">{overview?.securityScore}/100</div>
            <StatusIndicator status={overview?.status || 'safe'} />
            <div className="text-sm text-gray-400">
              Last updated: {overview?.lastUpdated}
            </div>
          </div>
        </SecurityCard>

        <SecurityCard title="Active Threats">
          <div className="space-y-4">
            <div className="text-3xl font-bold text-cyber-yellow">{overview?.activeThreats}</div>
            <div className="text-sm text-gray-400">
              {overview?.threatSeverity} severity threat{overview?.activeThreats !== 1 ? 's' : ''} detected
            </div>
            <div className="text-sm text-cyber-yellow">
              Under investigation
            </div>
          </div>
        </SecurityCard>

        <SecurityCard title="Protected Assets">
          <div className="space-y-4">
            <div className="text-3xl font-bold text-cyber-blue">
              ${(overview?.protectedAssets || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">
              Total value secured
            </div>
            <div className="text-sm text-cyber-green">
              100% funds safe
            </div>
          </div>
        </SecurityCard>
      </div>

      {/* Risk Score Trend */}
      <SecurityCard title="Risk Score Trend">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={riskScores}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="time" stroke="#ffffff40" />
              <YAxis stroke="#ffffff40" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(13, 13, 15, 0.9)',
                  border: '1px solid rgba(255, 126, 0, 0.2)',
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#FF7E00"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SecurityCard>

      {/* Vulnerabilities and Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SecurityCard title="Vulnerability Distribution">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vulnerabilities}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="type" stroke="#ffffff40" />
                <YAxis stroke="#ffffff40" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(13, 13, 15, 0.9)',
                    border: '1px solid rgba(255, 126, 0, 0.2)',
                  }}
                />
                <Bar dataKey="count" fill="#FF7E00" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SecurityCard>

        <SecurityCard title="Recent Security Events">
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 bg-cyber-black/50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      event.type === 'warning' ? 'bg-cyber-yellow' : 'bg-cyber-blue'
                    }`}
                  />
                  <div>
                    <div className="text-sm">{event.message}</div>
                    <div className="text-xs text-gray-400">{event.timestamp}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SecurityCard>
      </div>

      {/* Security Measures */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-cyber-black/50 p-4 rounded-lg">
          <h4 className="font-bold mb-2">Access Control</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Multi-sig Required</span>
              <span className="text-cyber-green">
                {measures?.accessControl.multiSigRequired ? `Yes (${measures.accessControl.multiSigThreshold})` : 'No'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Time Lock</span>
              <span className="text-cyber-green">{measures?.accessControl.timeLock}</span>
            </div>
          </div>
        </div>

        <div className="bg-cyber-black/50 p-4 rounded-lg">
          <h4 className="font-bold mb-2">Monitoring</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Anomaly Detection</span>
              <span className="text-cyber-green">{measures?.monitoring.anomalyDetection ? 'Active' : 'Inactive'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Real-time Alerts</span>
              <span className="text-cyber-green">{measures?.monitoring.realTimeAlerts ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
        </div>

        <div className="bg-cyber-black/50 p-4 rounded-lg">
          <h4 className="font-bold mb-2">Compliance</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Last Audit</span>
              <span className="text-cyber-green">{measures?.compliance.lastAudit}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Certification</span>
              <span className="text-cyber-green">{measures?.compliance.certificationValid ? 'Valid' : 'Invalid'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityMonitor;
