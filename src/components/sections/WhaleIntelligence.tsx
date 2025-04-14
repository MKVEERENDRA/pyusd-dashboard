import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { formatNumber } from '../../utils/formatters';

// Fetch Data from Backend
async function fetchDataFromBackend(endpoint: string): Promise<any> {
  const response = await fetch(`http://localhost:3001/api/whales/${endpoint}`);
  if (!response.ok) throw new Error('Failed to fetch data');
  return response.json();
}

const WhaleIntelligence: React.FC = () => {
  // State for toggling address expansion
  const [expandedAddresses, setExpandedAddresses] = useState<Record<string, boolean>>({});

  // Fetch whale-related data from the backend
  const { data: largeTransfers, isLoading: largeTransfersLoading } = useQuery({
    queryKey: ['largeTransfers'],
    queryFn: () => fetchDataFromBackend('large-transfers'),
    refetchInterval: 300000,
  });

  const { data: dormantWhales, isLoading: dormantWhalesLoading } = useQuery({
    queryKey: ['dormantWhales'],
    queryFn: () => fetchDataFromBackend('dormant-whales'),
    refetchInterval: 300000,
  });

  const { data: topWallets, isLoading: topWalletsLoading } = useQuery({
    queryKey: ['topWallets'],
    queryFn: () => fetchDataFromBackend('top-wallets'),
    refetchInterval: 300000,
  });

  const { data: whaleSentiment, isLoading: sentimentLoading } = useQuery({
    queryKey: ['whaleSentiment'],
    queryFn: () => fetchDataFromBackend('whale-sentiment'),
    refetchInterval: 300000,
  });

  const { data: whaleClusters, isLoading: clustersLoading } = useQuery({
    queryKey: ['whaleClusters'],
    queryFn: () => fetchDataFromBackend('whale-cluster-map'),
    refetchInterval: 300000,
  });

  const { data: multiWallets, isLoading: multiWalletsLoading } = useQuery({
    queryKey: ['multiWallets'],
    queryFn: () => fetchDataFromBackend('multi-wallet-detection'),
    refetchInterval: 300000,
  });

  const { data: mintSwapPatterns, isLoading: mintSwapLoading } = useQuery({
    queryKey: ['mintSwapPatterns'],
    queryFn: () => fetchDataFromBackend('mint-swap-pattern'),
    refetchInterval: 300000,
  });

  const { data: exchangeFlow, isLoading: exchangeFlowLoading } = useQuery({
    queryKey: ['exchangeFlow'],
    queryFn: () => fetchDataFromBackend('exchange-flow'),
    refetchInterval: 300000,
  });

  const { data: mevProtectedTransfers, isLoading: mevLoading } = useQuery({
    queryKey: ['mevProtectedTransfers'],
    queryFn: () => fetchDataFromBackend('mev-protected-transfers'),
    refetchInterval: 300000,
  });

  const { data: movementForecast, isLoading: forecastLoading } = useQuery({
    queryKey: ['movementForecast'],
    queryFn: () => fetchDataFromBackend('movement-forecast'),
    refetchInterval: 300000,
  });

  // Handle loading and error states
  if (
    largeTransfersLoading ||
    dormantWhalesLoading ||
    topWalletsLoading ||
    sentimentLoading ||
    clustersLoading ||
    multiWalletsLoading ||
    mintSwapLoading ||
    exchangeFlowLoading ||
    mevLoading ||
    forecastLoading
  ) {
    return <div className="p-4">Loading whale intelligence...</div>;
  }

  // Helper function to copy address to clipboard
  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    alert('Address copied to clipboard!');
  };

  // Helper function to toggle full address display
  const toggleAddressExpansion = (address: string) => {
    setExpandedAddresses((prev) => ({
      ...prev,
      [address]: !prev[address],
    }));
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Whale Intelligence</h2>
      {/* Horizontal Layout for Metrics */}
      <div className="space-y-4">
      <div
  className="p-4 rounded-xl border bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 text-white text-center font-bold text-lg shadow-md"
>
Large Transfers</div>

        {/* Large Transfers */}
        {largeTransfers?.map((transfer: any, index: number) => (
          <div
            key={index}
            className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 flex items-center justify-between"
          >
            <div className="flex-1 pr-4 text-left">
              <span
                className="text-lg font-medium cursor-pointer"
                onClick={() => toggleAddressExpansion(transfer.from_address)}
              >
                From:{' '}
                {expandedAddresses[transfer.from_address]
                  ? transfer.from_address
                  : `${transfer.from_address.slice(0, 6)}...${transfer.from_address.slice(-4)}`}
              </span>
            </div>
            <div className="flex-1 px-4 text-center">
              <span
                className="text-lg font-medium cursor-pointer"
                onClick={() => toggleAddressExpansion(transfer.to_address)}
              >
                To:{' '}
                {expandedAddresses[transfer.to_address]
                  ? transfer.to_address
                  : `${transfer.to_address.slice(0, 6)}...${transfer.to_address.slice(-4)}`}
              </span>
            </div>
            <div className="flex-1 pl-4 text-right">
              <span className="text-lg font-medium">Amount: {formatNumber(transfer.total_sent_pyusd)} PYUSD</span>
              <button
                className="ml-2 text-sm text-blue-500 hover:underline"
                onClick={() => handleCopyAddress(transfer.from_address)}
              >
                Copy From Address
              </button>
              <button
                className="ml-2 text-sm text-blue-500 hover:underline"
                onClick={() => handleCopyAddress(transfer.to_address)}
              >
                Copy To Address
              </button>
            </div>
          </div>
        ))}

<div
  className="p-4 rounded-xl border bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 text-white text-center font-bold text-lg shadow-md"
>
  Dormant Whales
</div>


        {/* Dormant Whales */}
        {dormantWhales?.map((whale: any, index: number) => (
          <div
            key={index}
            className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 flex items-center justify-between"
          >
            <div className="flex-1 pr-4 text-left">
              <span
                className="text-lg font-medium cursor-pointer"
                onClick={() => toggleAddressExpansion(whale.from_address)}
              >
                Address:{' '}
                {expandedAddresses[whale.from_address]
                  ? whale.from_address
                  : `${whale.from_address.slice(0, 6)}...${whale.from_address.slice(-4)}`}
              </span>
            </div>
            <div className="flex-1 px-4 text-center">
              <span className="text-lg font-medium">Last Active:90 days</span>
            </div>
            <div className="flex-1 pl-4 text-right">
              <span className="text-lg font-medium">Sent: {formatNumber(whale.total_sent_pyusd)} PYUSD</span>
              <button
                className="ml-2 text-sm text-blue-500 hover:underline"
                onClick={() => handleCopyAddress(whale.from_address)}
              >
                Copy Address
              </button>
            </div>
          </div>
        ))}
<div
  className="p-4 rounded-xl border bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 text-white text-center font-bold text-lg shadow-md"
>
Top Wallets Leaderboard
</div>
        {/* Top Wallets Leaderboard */}
        {topWallets?.map((wallet: any, index: number) => (
          <div
            key={index}
            className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 flex items-center justify-between"
          >
            <div className="flex-1 pr-4 text-left">
              <span
                className="text-lg font-medium cursor-pointer"
                onClick={() => toggleAddressExpansion(wallet.wallet)}
              >
                Wallet:{' '}
                {expandedAddresses[wallet.wallet]
                  ? wallet.wallet
                  : `${wallet.wallet.slice(0, 6)}...${wallet.wallet.slice(-4)}`}
              </span>
            </div>
            <div className="flex-1 px-4 text-center">
              <span className="text-lg font-medium">Transactions: {wallet.tx_count}</span>
            </div>
            <div className="flex-1 pl-4 text-right">
              <span className="text-lg font-medium">Sent: {formatNumber(wallet.total_sent_pyusd)} PYUSD</span>
              <button
                className="ml-2 text-sm text-blue-500 hover:underline"
                onClick={() => handleCopyAddress(wallet.wallet)}
              >
                Copy Address
              </button>
            </div>
          </div>
        ))}
        <div
  className="p-4 rounded-xl border bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 text-white text-center font-bold text-lg shadow-md"
>
Whale Sentiment Tracker
</div>

        {/* Whale Sentiment Tracker */}
        {whaleSentiment?.map((sentiment: any, index: number) => (
          <div
            key={index}
            className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 flex items-center justify-between"
          >
            <div className="flex-1 pr-4 text-left">
              <span
                className="text-lg font-medium cursor-pointer"
                onClick={() => toggleAddressExpansion(sentiment.from_address)}
              >
                Wallet:{' '}
                {expandedAddresses[sentiment.from_address]
                  ? sentiment.from_address
                  : `${sentiment.from_address.slice(0, 6)}...${sentiment.from_address.slice(-4)}`}
              </span>
            </div>
            <div className="flex-1 px-4 text-center">
              <span className="text-lg font-medium">Avg Gas Fee: {formatNumber(sentiment.avg_gas_fee_gwei)} Gwei</span>
            </div>
            <div className="flex-1 pl-4 text-right">
              <button
                className="text-sm text-blue-500 hover:underline"
                onClick={() => handleCopyAddress(sentiment.from_address)}
              >
                Copy Address
              </button>
            </div>
          </div>
        ))}

<div
  className="p-4 rounded-xl border bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 text-white text-center font-bold text-lg shadow-md"
>
  Whale Cluster Map
</div>

        {/* Whale Cluster Map */}
        {whaleClusters?.map((cluster: any, index: number) => (
          <div
            key={index}
            className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 flex items-center justify-between"
          >
            <div className="flex-1 pr-4 text-left">
              <span
                className="text-lg font-medium cursor-pointer"
                onClick={() => toggleAddressExpansion(cluster.from_address)}
              >
                From:{' '}
                {expandedAddresses[cluster.from_address]
                  ? cluster.from_address
                  : `${cluster.from_address.slice(0, 6)}...${cluster.from_address.slice(-4)}`}
              </span>
            </div>
            <div className="flex-1 px-4 text-center">
              <span
                className="text-lg font-medium cursor-pointer"
                onClick={() => toggleAddressExpansion(cluster.to_address)}
              >
                To:{' '}
                {expandedAddresses[cluster.to_address]
                  ? cluster.to_address
                  : `${cluster.to_address.slice(0, 6)}...${cluster.to_address.slice(-4)}`}
              </span>
            </div>
            <div className="flex-1 pl-4 text-right">
              <span className="text-lg font-medium">Interactions: {cluster.interactions}</span>
              <button
                className="ml-2 text-sm text-blue-500 hover:underline"
                onClick={() => handleCopyAddress(cluster.from_address)}
              >
                Copy From Address
              </button>
              <button
                className="ml-2 text-sm text-blue-500 hover:underline"
                onClick={() => handleCopyAddress(cluster.to_address)}
              >
                Copy To Address
              </button>
            </div>
          </div>
        ))}

        <div
  className="p-4 rounded-xl border bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 text-white text-center font-bold text-lg shadow-md"
>
  Multi-Wallet Detection
</div>

        {/* Multi-Wallet Detection */}
        {multiWallets?.map((wallet: any, index: number) => (
          <div
            key={index}
            className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 flex items-center justify-between"
          >
            <div className="flex-1 pr-4 text-left">
              <span
                className="text-lg font-medium cursor-pointer"
                onClick={() => toggleAddressExpansion(wallet.from_address)}
              >
                Wallet:{' '}
                {expandedAddresses[wallet.from_address]
                  ? wallet.from_address
                  : `${wallet.from_address.slice(0, 6)}...${wallet.from_address.slice(-4)}`}
              </span>
            </div>
            <div className="flex-1 px-4 text-center">
              <span className="text-lg font-medium">Unique Recipients: {wallet.wallet_count}</span>
            </div>
            <div className="flex-1 pl-4 text-right">
              <button
                className="text-sm text-blue-500 hover:underline"
                onClick={() => handleCopyAddress(wallet.from_address)}
              >
                Copy Address
              </button>
            </div>
          </div>
        ))}

   

        {/* Mint-to-Swap Patterns */}
        {mintSwapPatterns?.map((pattern: any, index: number) => (
          <div
            key={index}
            className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 flex items-center justify-between"
          >
            <div className="flex-1 pr-4 text-left">
              <span
                className="text-lg font-medium cursor-pointer"
                onClick={() => toggleAddressExpansion(pattern.from_address)}
              >
                Wallet:{' '}
                {expandedAddresses[pattern.from_address]
                  ? pattern.from_address
                  : `${pattern.from_address.slice(0, 6)}...${pattern.from_address.slice(-4)}`}
              </span>
            </div>
            <div className="flex-1 px-4 text-center">
              <span className="text-lg font-medium">Count: {pattern.mint_swap_count}</span>
            </div>
            <div className="flex-1 pl-4 text-right">
              <button
                className="text-sm text-blue-500 hover:underline"
                onClick={() => handleCopyAddress(pattern.from_address)}
              >
                Copy Address
              </button>
            </div>
          </div>
        ))}

        {/* Exchange Flow */}
        {exchangeFlow?.map((flow: any, index: number) => (
          <div
            key={index}
            className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 flex items-center justify-between"
          >
            <div className="flex-1 pr-4 text-left">
              <span
                className="text-lg font-medium cursor-pointer"
                onClick={() => toggleAddressExpansion(flow.wallet)}
              >
                Wallet:{' '}
                {expandedAddresses[flow.wallet]
                  ? flow.wallet
                  : `${flow.wallet.slice(0, 6)}...${flow.wallet.slice(-4)}`}
              </span>
            </div>
            <div className="flex-1 px-4 text-center">
              <span className="text-lg font-medium">Total Sent: {formatNumber(flow.total_sent_pyusd)} PYUSD</span>
            </div>
            <div className="flex-1 pl-4 text-right">
              <span className="text-lg font-medium">Transactions: {flow.tx_count}</span>
              <button
                className="ml-2 text-sm text-blue-500 hover:underline"
                onClick={() => handleCopyAddress(flow.wallet)}
              >
                Copy Address
              </button>
            </div>
          </div>
        ))}

   

        {/* MEV Protected Transfers */}
        {mevProtectedTransfers?.map((transfer: any, index: number) => (
          <div
            key={index}
            className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 flex items-center justify-between"
          >
            <div className="flex-1 pr-4 text-left">
              <span
                className="text-lg font-medium cursor-pointer"
                onClick={() => toggleAddressExpansion(transfer.from_address)}
              >
                From:{' '}
                {expandedAddresses[transfer.from_address]
                  ? transfer.from_address
                  : `${transfer.from_address.slice(0, 6)}...${transfer.from_address.slice(-4)}`}
              </span>
            </div>
            <div className="flex-1 px-4 text-center">
              <span
                className="text-lg font-medium cursor-pointer"
                onClick={() => toggleAddressExpansion(transfer.to_address)}
              >
                To:{' '}
                {expandedAddresses[transfer.to_address]
                  ? transfer.to_address
                  : `${transfer.to_address.slice(0, 6)}...${transfer.to_address.slice(-4)} || 0`}
              </span>
            </div>
            <div className="flex-1 pl-4 text-right">
              <span className="text-lg font-medium">Amount: {formatNumber(transfer.total_sent_pyusd)} PYUSD</span>
              <button
                className="ml-2 text-sm text-blue-500 hover:underline"
                onClick={() => handleCopyAddress(transfer.from_address)}
              >
                Copy From Address
              </button>
              <button
                className="ml-2 text-sm text-blue-500 hover:underline"
                onClick={() => handleCopyAddress(transfer.to_address)}
              >
                Copy To Address
              </button>
            </div>
          </div>
        ))}
        

        <div
  className="p-4 rounded-xl border bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 text-white text-center font-bold text-lg shadow-md"
>
  Movement Forecast
</div>

        {/* Movement Forecast */}
        {movementForecast?.map((forecast: any, index: number) => (
          <div
            key={index}
            className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 flex items-center justify-between"
          >
            <div className="flex-1 pr-4 text-left">
              <span
                className="text-lg font-medium cursor-pointer"
                onClick={() => toggleAddressExpansion(forecast.from_address)}
              >
                From:{' '}
                {expandedAddresses[forecast.from_address]
                  ? forecast.from_address
                  : `${forecast.from_address.slice(0, 6)}...${forecast.from_address.slice(-4)}`}
              </span>
            </div>
            <div className="flex-1 px-4 text-center">
              <span
                className="text-lg font-medium cursor-pointer"
                onClick={() => toggleAddressExpansion(forecast.to_address)}
              >
                To:{' '}
                {expandedAddresses[forecast.to_address]
                  ? forecast.to_address
                  : `${forecast.to_address.slice(0, 6)}...${forecast.to_address.slice(-4)}`}
              </span>
            </div>
            <div className="flex-1 pl-4 text-right">
              <span className="text-lg font-medium">Transfer Count: {forecast.transfer_count}</span>
              <span className="text-lg font-medium"> | Avg Amount: {formatNumber(forecast.avg_transfer_amount)} PYUSD</span>
              <button
                className="ml-2 text-sm text-blue-500 hover:underline"
                onClick={() => handleCopyAddress(forecast.from_address)}
              >
                Copy From Address
              </button>
              <button
                className="ml-2 text-sm text-blue-500 hover:underline"
                onClick={() => handleCopyAddress(forecast.to_address)}
              >
                Copy To Address
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhaleIntelligence;