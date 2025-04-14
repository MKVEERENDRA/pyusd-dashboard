import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const sampleData = {
  proposals: [
    { id: 'PIP-001', title: 'Upgrade Bridge Security', status: 'Active', votes: { for: 65, against: 35 } },
    { id: 'PIP-002', title: 'Expand to Optimism', status: 'Passed', votes: { for: 82, against: 18 } },
    { id: 'PIP-003', title: 'Treasury Allocation', status: 'Active', votes: { for: 45, against: 55 } },
  ],
  votingPower: [
    { holder: 'Whale 1', power: 15 },
    { holder: 'Whale 2', power: 12 },
    { holder: 'Whale 3', power: 10 },
    { holder: 'Whale 4', power: 8 },
    { holder: 'Others', power: 55 },
  ],
};

const GovernanceCard: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  const motionProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    className: "bg-cyber-black/30 rounded-xl p-6 border border-cyber-purple/20"
  } as const;

  return (
    <motion.div {...motionProps}>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      {children}
    </motion.div>
  );
};

const ProposalStatus: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-cyber-yellow text-black';
      case 'passed':
        return 'bg-cyber-green text-black';
      case 'failed':
        return 'bg-cyber-pink text-black';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor()}`}>
      {status}
    </span>
  );
};

const VoteBar: React.FC<{ forVotes: number; againstVotes: number }> = ({ forVotes, againstVotes }) => (
  <div className="w-full h-2 bg-cyber-black rounded-full overflow-hidden">
    <div
      className="h-full bg-cyber-green"
      style={{ width: `${forVotes}%` }}
    />
  </div>
);

const Governance: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GovernanceCard title="Active Proposals">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-cyber-purple">2</div>
            <div className="text-sm text-gray-400">Open for voting</div>
            <div className="text-sm text-cyber-yellow">48h remaining</div>
          </div>
        </GovernanceCard>

        <GovernanceCard title="Total Votes Cast">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-cyber-purple">1.2M</div>
            <div className="text-sm text-gray-400">Voting power used</div>
            <div className="text-sm text-cyber-green">+5.3% participation</div>
          </div>
        </GovernanceCard>

        <GovernanceCard title="Governance Score">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-cyber-purple">8.5/10</div>
            <div className="text-sm text-gray-400">Decentralization index</div>
            <div className="text-sm text-cyber-green">High participation</div>
          </div>
        </GovernanceCard>
      </div>

      {/* Active Proposals */}
      <GovernanceCard title="Active Proposals">
        <div className="space-y-4">
          {sampleData.proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="p-4 bg-cyber-black/50 rounded-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{proposal.title}</div>
                  <div className="text-sm text-gray-400">{proposal.id}</div>
                </div>
                <ProposalStatus status={proposal.status} />
              </div>
              <div className="space-y-2">
                <VoteBar
                  forVotes={proposal.votes.for}
                  againstVotes={proposal.votes.against}
                />
                <div className="flex justify-between text-sm">
                  <span className="text-cyber-green">For: {proposal.votes.for}%</span>
                  <span className="text-cyber-pink">Against: {proposal.votes.against}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GovernanceCard>

      {/* Voting Power Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GovernanceCard title="Voting Power Distribution">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sampleData.votingPower}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="holder" stroke="#ffffff40" />
                <YAxis stroke="#ffffff40" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(13, 13, 15, 0.9)',
                    border: '1px solid rgba(187, 107, 217, 0.2)',
                  }}
                />
                <Bar dataKey="power" fill="#BB6BD9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GovernanceCard>

        <GovernanceCard title="Recent Activities">
          <div className="space-y-4">
            {[
              { action: 'Vote Cast', details: 'PIP-001', time: '5m ago', voter: '0x1234...5678' },
              { action: 'Proposal Created', details: 'PIP-003', time: '2h ago', voter: '0x8765...4321' },
              { action: 'Proposal Executed', details: 'PIP-002', time: '1d ago', voter: 'System' },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-cyber-black/50 rounded-lg"
              >
                <div>
                  <div className="font-semibold">{activity.action}</div>
                  <div className="text-sm text-gray-400">{activity.details}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono text-cyber-purple">{activity.voter}</div>
                  <div className="text-xs text-gray-400">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </GovernanceCard>
      </div>

      {/* Governance Rules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-cyber-black/50 p-4 rounded-lg">
          <h4 className="font-bold mb-2">Voting Rules</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Minimum Stake</span>
              <span className="text-cyber-purple">1,000 PYUSD</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Voting Period</span>
              <span className="text-cyber-purple">7 days</span>
            </div>
          </div>
        </div>

        <div className="bg-cyber-black/50 p-4 rounded-lg">
          <h4 className="font-bold mb-2">Quorum</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Required</span>
              <span className="text-cyber-purple">10%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Current Average</span>
              <span className="text-cyber-green">15.3%</span>
            </div>
          </div>
        </div>

        <div className="bg-cyber-black/50 p-4 rounded-lg">
          <h4 className="font-bold mb-2">Timelock</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Execution Delay</span>
              <span className="text-cyber-purple">48 hours</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Grace Period</span>
              <span className="text-cyber-purple">24 hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Governance;
