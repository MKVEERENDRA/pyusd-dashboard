import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import LiveMetrics from './sections/LiveMetrics';
import WhaleIntelligence from './sections/WhaleIntelligence';
import AdoptionAnalytics from './sections/AdoptionAnalytics';
import SentimentAnalysis from './sections/SentimentAnalysis';
import DeveloperTools from './sections/DeveloperTools';
import SecurityMonitor from './sections/SecurityMonitor';
import CrossChainInsights from './sections/CrossChainInsights';
import Governance from './sections/Governance';
import MevAnalysis from './sections/MevAnalysis';
import ExportAutomation from './sections/ExportAutomation';
import { ChartBarIcon, ChartPieIcon, CurrencyDollarIcon, ShieldCheckIcon, 
         CodeBracketIcon, ArrowsRightLeftIcon, BoltIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

interface DashboardSection {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
  color: string;
}

interface DashboardCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  onClick: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, icon, description, color, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`p-6 rounded-xl bg-card-gradient backdrop-blur-md border border-${color}/20 cursor-pointer`}
    onClick={onClick}
  >
    <div className={`w-12 h-12 rounded-lg bg-${color}/20 flex items-center justify-center mb-4`}>
      <div className="w-6 h-6 text-white">{icon}</div>
    </div>
    <h3 className={`text-xl font-bold mb-2 text-${color}`}>{title}</h3>
    <p className="text-gray-400 text-sm">{description}</p>
  </motion.div>
);

const sections: DashboardSection[] = [
  {
    id: 'metrics',
    title: 'Live Metrics',
    description: 'Real-time PYUSD statistics and market data',
    component: <LiveMetrics />,
    color: 'from-cyber-blue/20 to-cyber-purple/20'
  },
  {
    id: 'whales',
    title: 'Whale Intelligence',
    description: 'Track large holders and significant transfers',
    component: <WhaleIntelligence />,
    color: 'from-cyber-purple/20 to-cyber-pink/20'
  },
  {
    id: 'adoption',
    title: 'Adoption Analytics',
    description: 'Monitor PYUSD adoption and usage patterns',
    component: <AdoptionAnalytics />,
    color: 'from-cyber-pink/20 to-cyber-green/20'
  },
  {
    id: 'sentiment',
    title: 'Sentiment Analysis',
    description: 'AI-powered sentiment analysis and predictions',
    component: <SentimentAnalysis />,
    color: 'from-cyber-green/20 to-cyber-yellow/20'
  },
  {
    id: 'developer',
    title: 'Developer Tools',
    description: 'Smart contract analysis and development tools',
    component: <DeveloperTools />,
    color: 'from-cyber-yellow/20 to-cyber-orange/20'
  },
  {
    id: 'security',
    title: 'Security Monitor',
    description: 'Risk analysis and security monitoring',
    component: <SecurityMonitor />,
    color: 'from-cyber-orange/20 to-cyber-blue/20'
  },
  {
    id: 'crosschain',
    title: 'Cross-Chain Insights',
    description: 'Multi-chain analytics and bridge monitoring',
    component: <CrossChainInsights />,
    color: 'from-cyber-blue/20 to-cyber-purple/20'
  },
  {
    id: 'governance',
    title: 'Governance',
    description: 'DAO proposals and voting analytics',
    component: <Governance />,
    color: 'from-cyber-purple/20 to-cyber-pink/20'
  },
  {
    id: 'mev',
    title: 'MEV Analysis',
    description: 'MEV detection and protection metrics',
    component: <MevAnalysis />,
    color: 'from-cyber-pink/20 to-cyber-green/20'
  },
  {
    id: 'export',
    title: 'Export & Automation',
    description: 'Data export and automated reporting tools',
    component: <ExportAutomation />,
    color: 'from-cyber-green/20 to-cyber-yellow/20'
  }
];

const MainDashboard: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<DashboardSection | null>(null);

  return (
    <div className="min-h-screen bg-cyber-gradient p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4"></h1>
          <a 
            href="https://github.com/MKVEERENDRA/ZKPUSD" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-cyber-blue hover:text-cyber-yellow transition-colors duration-300"
          >
            View ZKPUSD Privacy Pool Source Code
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Dialog.Root key={section.id}>
              <Dialog.Trigger asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`cursor-pointer rounded-xl p-6 bg-gradient-to-br ${section.color} 
                             border border-white/10 backdrop-blur-sm hover:border-white/20 
                             transition-all duration-300`}
                >
                  <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
                  <p className="text-gray-400">{section.description}</p>
                </motion.div>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] 
                                        w-[90vw] max-w-[1200px] max-h-[85vh] overflow-auto
                                        bg-cyber-black/95 rounded-xl p-6 border border-white/10
                                        shadow-neon">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{section.title}</h2>
                    <Dialog.Close className="text-gray-400 hover:text-white">
                      <span className="sr-only">Close</span>
                      ×
                    </Dialog.Close>
                  </div>
                  {section.component}
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
