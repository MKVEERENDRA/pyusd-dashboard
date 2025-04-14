import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const sampleData = {
  mevActivity: [
    { time: '00:00', sandwiches: 5, frontRuns: 3, backRuns: 2 },
    { time: '04:00', sandwiches: 7, frontRuns: 4, backRuns: 3 },
    { time: '08:00', sandwiches: 4, frontRuns: 6, backRuns: 4 },
    { time: '12:00', sandwiches: 8, frontRuns: 5, backRuns: 3 },
    { time: '16:00', sandwiches: 6, frontRuns: 7, backRuns: 5 },
    { time: '20:00', sandwiches: 9, frontRuns: 4, backRuns: 2 },
  ],
  protectionStats: [
    { type: 'Protected', value: 85 },
    { type: 'At Risk', value: 12 },
    { type: 'Attacked', value: 3 },
  ],
};

const MevCard: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  const motionProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    className: "bg-cyber-black/30 rounded-xl p-6 border border-cyber-pink/20"
  } as const;

  return (
    <motion.div {...motionProps}>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      {children}
    </motion.div>
  );
};

const MevAnalysis: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MevCard title="MEV Protection">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-cyber-pink">97%</div>
            <div className="text-sm text-gray-400">Transactions protected</div>
            <div className="text-sm text-cyber-green">+2.5% vs last week</div>
          </div>
        </MevCard>

        <MevCard title="Value Saved">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-cyber-pink">$52.8K</div>
            <div className="text-sm text-gray-400">Protected from MEV</div>
            <div className="text-sm text-cyber-green">Last 24 hours</div>
          </div>
        </MevCard>

        <MevCard title="Active Searchers">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-cyber-pink">24</div>
            <div className="text-sm text-gray-400">MEV bots detected</div>
            <div className="text-sm text-cyber-yellow">5 new this week</div>
          </div>
        </MevCard>
      </div>

      {/* MEV Activity Chart */}
      <MevCard title="MEV Activity Timeline">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sampleData.mevActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="time" stroke="#ffffff40" />
              <YAxis stroke="#ffffff40" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(13, 13, 15, 0.9)',
                  border: '1px solid rgba(255, 0, 128, 0.2)',
                }}
              />
              <Line
                type="monotone"
                dataKey="sandwiches"
                stroke="#FF0080"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="frontRuns"
                stroke="#7928CA"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="backRuns"
                stroke="#FF4D4D"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#FF0080] mr-2" />
              <span className="text-sm">Sandwich Attacks</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#7928CA] mr-2" />
              <span className="text-sm">Front Running</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#FF4D4D] mr-2" />
              <span className="text-sm">Back Running</span>
            </div>
          </div>
        </div>
      </MevCard>

      {/* Protection Stats and Recent Attacks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MevCard title="Protection Statistics">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sampleData.protectionStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="type" stroke="#ffffff40" />
                <YAxis stroke="#ffffff40" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(13, 13, 15, 0.9)',
                    border: '1px solid rgba(255, 0, 128, 0.2)',
                  }}
                />
                <Bar dataKey="value" fill="#FF0080" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </MevCard>

        <MevCard title="Recent MEV Activities">
          <div className="space-y-4">
            {[
              {
                type: 'Sandwich Attack',
                status: 'Blocked',
                value: '$12.5K',
                time: '2m ago',
                attacker: '0x742d...3f9b',
              },
              {
                type: 'Front Running',
                status: 'Detected',
                value: '$8.2K',
                time: '5m ago',
                attacker: '0x891a...4c2d',
              },
              {
                type: 'Back Running',
                status: 'Blocked',
                value: '$5.7K',
                time: '8m ago',
                attacker: '0x456f...1a9e',
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-cyber-black/50 rounded-lg"
              >
                <div>
                  <div className="font-semibold">{activity.type}</div>
                  <div className="text-sm text-gray-400">{activity.attacker}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono text-cyber-pink">{activity.value}</div>
                  <div className="text-xs text-gray-400">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </MevCard>
      </div>

      {/* Protection Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-cyber-black/50 p-4 rounded-lg">
          <h4 className="font-bold mb-2">Protection Methods</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Private RPC</span>
              <span className="text-cyber-green">Active</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Flashbots RPC</span>
              <span className="text-cyber-green">Enabled</span>
            </div>
          </div>
        </div>

        <div className="bg-cyber-black/50 p-4 rounded-lg">
          <h4 className="font-bold mb-2">Risk Assessment</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Current Risk</span>
              <span className="text-cyber-yellow">Medium</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Network Load</span>
              <span className="text-cyber-yellow">75%</span>
            </div>
          </div>
        </div>

        <div className="bg-cyber-black/50 p-4 rounded-lg">
          <h4 className="font-bold mb-2">Network Stats</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Gas Price</span>
              <span className="text-cyber-yellow">45 Gwei</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Block Time</span>
              <span className="text-cyber-green">12.1s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MevAnalysis;
