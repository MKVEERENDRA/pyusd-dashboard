import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const sampleData = {
  automationStats: [
    { time: 'Mon', reports: 12, alerts: 8, exports: 5 },
    { time: 'Tue', reports: 15, alerts: 10, exports: 7 },
    { time: 'Wed', reports: 10, alerts: 12, exports: 6 },
    { time: 'Thu', reports: 18, alerts: 9, exports: 8 },
    { time: 'Fri', reports: 14, alerts: 11, exports: 9 },
    { time: 'Sat', reports: 8, alerts: 7, exports: 4 },
    { time: 'Sun', reports: 6, alerts: 5, exports: 3 },
  ],
};

const ExportCard: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  const motionProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    className: "bg-cyber-black/30 rounded-xl p-6 border border-cyber-green/20"
  } as const;

  return (
    <motion.div {...motionProps}>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      {children}
    </motion.div>
  );
};

const ScheduleItem: React.FC<{
  title: string;
  schedule: string;
  status: 'active' | 'paused' | 'error';
  lastRun: string;
}> = ({ title, schedule, status, lastRun }) => {
  const statusColors = {
    active: 'text-cyber-green',
    paused: 'text-cyber-yellow',
    error: 'text-cyber-pink',
  };

  return (
    <div className="flex items-center justify-between p-3 bg-cyber-black/50 rounded-lg">
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-gray-400">{schedule}</div>
      </div>
      <div className="text-right">
        <div className={`text-sm ${statusColors[status]}`}>{status}</div>
        <div className="text-xs text-gray-400">{lastRun}</div>
      </div>
    </div>
  );
};

const ExportAutomation: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState('csv');

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ExportCard title="Automated Reports">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-cyber-green">24</div>
            <div className="text-sm text-gray-400">Active automations</div>
            <div className="text-sm text-cyber-green">100% uptime</div>
          </div>
        </ExportCard>

        <ExportCard title="Data Exports">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-cyber-green">1.2K</div>
            <div className="text-sm text-gray-400">Reports generated</div>
            <div className="text-sm text-cyber-green">This month</div>
          </div>
        </ExportCard>

        <ExportCard title="Alert Rules">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-cyber-green">15</div>
            <div className="text-sm text-gray-400">Active alerts</div>
            <div className="text-sm text-cyber-yellow">2 triggered today</div>
          </div>
        </ExportCard>
      </div>

      {/* Automation Activity */}
      <ExportCard title="Automation Activity">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sampleData.automationStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="time" stroke="#ffffff40" />
              <YAxis stroke="#ffffff40" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(13, 13, 15, 0.9)',
                  border: '1px solid rgba(0, 255, 128, 0.2)',
                }}
              />
              <Line
                type="monotone"
                dataKey="reports"
                stroke="#00FF80"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="alerts"
                stroke="#FFB800"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="exports"
                stroke="#00F0FF"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#00FF80] mr-2" />
              <span className="text-sm">Reports</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#FFB800] mr-2" />
              <span className="text-sm">Alerts</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#00F0FF] mr-2" />
              <span className="text-sm">Exports</span>
            </div>
          </div>
        </div>
      </ExportCard>

      {/* Export Options and Schedules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExportCard title="Export Options">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Export Format</label>
              <div className="flex space-x-2">
                {['csv', 'json', 'pdf', 'excel'].map((format) => (
                  <button
                    key={format}
                    onClick={() => setSelectedFormat(format)}
                    className={`px-4 py-2 rounded-lg text-sm uppercase ${
                      selectedFormat === format
                        ? 'bg-cyber-green text-black'
                        : 'bg-cyber-black/50 hover:bg-cyber-black/70'
                    }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Data Selection</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Market Metrics',
                  'Whale Activity',
                  'Security Events',
                  'MEV Data',
                  'Governance',
                  'Cross-chain',
                ].map((option) => (
                  <label
                    key={option}
                    className="flex items-center space-x-2 bg-cyber-black/50 p-2 rounded-lg"
                  >
                    <input type="checkbox" className="form-checkbox text-cyber-green" />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="w-full py-2 bg-cyber-green text-black rounded-lg font-semibold hover:bg-cyber-green/90 transition-colors">
              Generate Report
            </button>
          </div>
        </ExportCard>

        <ExportCard title="Scheduled Reports">
          <div className="space-y-4">
            <ScheduleItem
              title="Daily Market Summary"
              schedule="Daily at 00:00 UTC"
              status="active"
              lastRun="2h ago"
            />
            <ScheduleItem
              title="Weekly Governance Report"
              schedule="Monday at 09:00 UTC"
              status="active"
              lastRun="2d ago"
            />
            <ScheduleItem
              title="Monthly Analytics"
              schedule="1st of month"
              status="paused"
              lastRun="29d ago"
            />
            <ScheduleItem
              title="Security Audit Log"
              schedule="Every 6 hours"
              status="error"
              lastRun="Failed"
            />
          </div>
        </ExportCard>
      </div>

      {/* Integration Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-cyber-black/50 p-4 rounded-lg">
          <h4 className="font-bold mb-2">Storage</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>IPFS</span>
              <span className="text-cyber-green">Connected</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>AWS S3</span>
              <span className="text-cyber-green">Active</span>
            </div>
          </div>
        </div>

        <div className="bg-cyber-black/50 p-4 rounded-lg">
          <h4 className="font-bold mb-2">Notifications</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Email</span>
              <span className="text-cyber-green">Enabled</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Discord</span>
              <span className="text-cyber-green">Connected</span>
            </div>
          </div>
        </div>

        <div className="bg-cyber-black/50 p-4 rounded-lg">
          <h4 className="font-bold mb-2">API Access</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>REST API</span>
              <span className="text-cyber-green">Active</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>GraphQL</span>
              <span className="text-cyber-yellow">Beta</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportAutomation;
