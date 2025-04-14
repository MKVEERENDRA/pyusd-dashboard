import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const sampleData = {
  bridgeVolume: [
    { time: '00:00', ethereum: 1200, polygon: 800, arbitrum: 600, optimism: 400 },
    { time: '04:00', ethereum: 1500, polygon: 900, arbitrum: 700, optimism: 500 },
    { time: '08:00', ethereum: 1800, polygon: 1200, arbitrum: 900, optimism: 600 },
    { time: '12:00', ethereum: 2200, polygon: 1400, arbitrum: 1100, optimism: 800 },
    { time: '16:00', ethereum: 2500, polygon: 1600, arbitrum: 1300, optimism: 900 },
    { time: '20:00', ethereum: 2800, polygon: 1800, arbitrum: 1500, optimism: 1100 },
  ],
  distribution: [
    { chain: 'Ethereum', value: 45, color: '#627EEA' },
    { chain: 'Polygon', value: 25, color: '#8247E5' },
    { chain: 'Arbitrum', value: 20, color: '#28A0F0' },
    { chain: 'Optimism', value: 10, color: '#FF0420' },
  ],
};

const InsightCard: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-cyber-black/30 rounded-xl p-6 border border-cyber-blue/20"
  >
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    {children}
  </motion.div>
);

const ChainBadge: React.FC<{
  chain: string;
  color: string;
}> = ({ chain, color }) => (
  <div className="flex items-center space-x-2">
    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
    <span>{chain}</span>
  </div>
);

const CrossChainInsights: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InsightCard title="Total Bridges">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-cyber-blue">4</div>
            <div className="text-sm text-gray-400">Active bridge protocols</div>
            <div className="text-sm text-cyber-green">All operational</div>
          </div>
        </InsightCard>

        <InsightCard title="24h Bridge Volume">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-cyber-blue">$7.2M</div>
            <div className="text-sm text-gray-400">Total bridged value</div>
            <div className="text-sm text-cyber-green">+15.3% vs yesterday</div>
          </div>
        </InsightCard>

        <InsightCard title="Bridge Security">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-cyber-green">100%</div>
            <div className="text-sm text-gray-400">Security score</div>
            <div className="text-sm text-cyber-green">No issues detected</div>
          </div>
        </InsightCard>
      </div>

      {/* Bridge Volume Chart */}
      <InsightCard title="Cross-Chain Bridge Volume">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sampleData.bridgeVolume}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="time" stroke="#ffffff40" />
              <YAxis stroke="#ffffff40" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(13, 13, 15, 0.9)',
                  border: '1px solid rgba(0, 240, 255, 0.2)',
                }}
              />
              <Area
                type="monotone"
                dataKey="ethereum"
                stackId="1"
                stroke="#627EEA"
                fill="#627EEA"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="polygon"
                stackId="1"
                stroke="#8247E5"
                fill="#8247E5"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="arbitrum"
                stackId="1"
                stroke="#28A0F0"
                fill="#28A0F0"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="optimism"
                stackId="1"
                stroke="#FF0420"
                fill="#FF0420"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </InsightCard>

      {/* Distribution and Bridge Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InsightCard title="Chain Distribution">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sampleData.distribution}
                  dataKey="value"
                  nameKey="chain"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {sampleData.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(13, 13, 15, 0.9)',
                    border: '1px solid rgba(0, 240, 255, 0.2)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {sampleData.distribution.map((item) => (
              <ChainBadge key={item.chain} chain={item.chain} color={item.color} />
            ))}
          </div>
        </InsightCard>

        <InsightCard title="Bridge Health">
          <div className="space-y-4">
            {[
              { name: 'Wormhole', status: 'Operational', latency: '12s' },
              { name: 'Polygon Bridge', status: 'Operational', latency: '15s' },
              { name: 'Arbitrum Bridge', status: 'Operational', latency: '18s' },
              { name: 'Optimism Bridge', status: 'Operational', latency: '14s' },
            ].map((bridge) => (
              <div
                key={bridge.name}
                className="flex items-center justify-between p-3 bg-cyber-black/50 rounded-lg"
              >
                <div>
                  <div className="font-semibold">{bridge.name}</div>
                  <div className="text-sm text-gray-400">Latency: {bridge.latency}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
                  <span className="text-sm text-cyber-green">{bridge.status}</span>
                </div>
              </div>
            ))}
          </div>
        </InsightCard>
      </div>

      {/* Recent Bridge Transactions */}
      <InsightCard title="Recent Bridge Transactions">
        <div className="space-y-3">
          {[
            { from: 'Ethereum', to: 'Polygon', amount: '$250K', time: '2m ago' },
            { from: 'Arbitrum', to: 'Ethereum', amount: '$180K', time: '5m ago' },
            { from: 'Optimism', to: 'Ethereum', amount: '$120K', time: '8m ago' },
          ].map((tx, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-cyber-black/50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="text-cyber-blue">
                  {tx.from} → {tx.to}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-cyber-green">{tx.amount}</div>
                <div className="text-xs text-gray-400">{tx.time}</div>
              </div>
            </div>
          ))}
        </div>
      </InsightCard>
    </div>
  );
};

export default CrossChainInsights;
