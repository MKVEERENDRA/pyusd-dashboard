import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainDashboard from 'components/MainDashboard';

const queryClient = new QueryClient();

function App() {
  const [showZkpusd, setShowZkpusd] = useState(false);

  const handleZkpusdClick = () => {
    window.open('https://github.com/MKVEERENDRA/ZKPUSD', '_blank');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold">PYUSD Analytics Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="bg-cyber-black/30 rounded-lg p-2 flex items-center">
              <button
                onClick={() => setShowZkpusd(false)}
                className={`px-4 py-2 rounded-l-lg transition-colors ${!showZkpusd ? 'bg-cyber-green text-black' : 'text-white hover:bg-cyber-black/50'}`}
              >
                Analytics
              </button>
              <button
                onClick={() => {
                  setShowZkpusd(true);
                  handleZkpusdClick();
                }}
                className={`px-4 py-2 rounded-r-lg transition-colors ${showZkpusd ? 'bg-cyber-green text-black' : 'text-white hover:bg-cyber-black/50'}`}
              >
                Private TX
              </button>
            </div>
          </div>
        </header>
        <main>
          <MainDashboard />
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
