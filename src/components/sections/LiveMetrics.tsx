import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { formatNumber } from '../../utils/formatters';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ethers } from 'ethers';
import { abi } from './D';

// Smart Contract ABI and Address
const CONTRACT_ABI = abi;
const CONTRACT_ADDRESS = "0x6c3ea9036406852006290770bedfcaba0e23a0e8";
const url = "https://blockchain.googleapis.com/v1/projects/hackerthon-456705/locations/asia-east1/endpoints/ethereum-mainnet/rpc?key=AIzaSyD6xGPuDfjN-z4U08XBkw4UvF8Wiiy-2Lw"

// Initialize provider and contract instance
console.log("iam here");
const provider = new ethers.providers.JsonRpcProvider(url);
console.log("iam here2",provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
console.log("iam here3",contract);

// Fetch Total Supply from the Smart Contract
console.log("iam heer ")
async function getTotalSupply() {
  const totalSupply = await contract.totalSupply();
  console.log("Total Supply:", totalSupply);
  console.log("iam",parseFloat(ethers.utils.formatUnits(totalSupply, 18)));
  const decimals = await contract.decimals();
  console.log("iam",decimals);


  return parseFloat(ethers.utils.formatUnits(totalSupply, decimals)); // Assuming 18 decimals

}

// Fetch Mint/Burn Events from the Smart Contract
async function getMintBurnEvents(): Promise<{ minted: number; burned: number }> {
  const mintFilter = contract.filters.SupplyIncreased(null, null);
  const burnFilter = contract.filters.SupplyDecreased(null, null);

  const mintEvents = await contract.queryFilter(mintFilter);
  const burnEvents = await contract.queryFilter(burnFilter);
  const minted = mintEvents.reduce(
    (sum: number, event: any) =>
      sum + (event.args?.value 
        ? parseFloat(ethers.utils.formatUnits(event.args.value, 18)) 
        : 0),
    0);
  console.log("Minted:", minted);
  const burned = burnEvents.reduce(
    (sum: number, event: any) =>
      sum + (event.args?.value 
        ? parseFloat(ethers.utils.formatUnits(event.args.value, 18)) 
        : 0),
    0);
  console.log("Burned:", burned);
  return { minted, burned };
}

// Fetch Data from Backend
async function fetchDataFromBackend(endpoint:any) {
  const response = await fetch(`http://localhost:3001/api/${endpoint}`);
  if (!response.ok) throw new Error('Failed to fetch data');
  return response.json();
}


const LiveMetrics = () => {
  // Fetch data from the smart contract
  const { data: totalSupply, isLoading: supplyLoading } = useQuery({
    queryKey: ['totalSupply'],
    queryFn: getTotalSupply,
    refetchInterval: 3000000, // Refetch every 5 minutes
  });

  const { data: mintBurnData, isLoading: mintBurnLoading } = useQuery({
    queryKey: ['mintBurnData'],
    queryFn: getMintBurnEvents,
    refetchInterval: 300000,
  });

  // Fetch data from backend
  const { data: dailyVolume, isLoading: volumeLoading } = useQuery({
    queryKey: ['dailyVolume'],
    queryFn: () => fetchDataFromBackend('metrics/daily-volume'),
    refetchInterval: 3000000,
  });

  const { data: activeAddresses, isLoading: addressesLoading } = useQuery({
    queryKey: ['activeAddresses'],
    queryFn: () => fetchDataFromBackend('metrics/active-addresses'),
    refetchInterval: 300000,
  });

  const { data: uniqueHolders, isLoading: holdersLoading } = useQuery({
    queryKey: ['uniqueHolders'],
    queryFn: () => fetchDataFromBackend('metrics/unique-holders'),
    refetchInterval: 300000,
  });

  const { data: avgGasFee, isLoading: gasLoading } = useQuery({
    queryKey: ['avgGasFee'],
    queryFn: () => fetchDataFromBackend('metrics/avg-gas-fee'),
    refetchInterval: 300000,
  });

  const { data: transactionSpeed, isLoading: speedLoading } = useQuery({
    queryKey: ['transactionSpeed'],
    queryFn: () => fetchDataFromBackend('metrics/transaction-speed'),
    refetchInterval: 300000,
  });
  const { data: avgTransactionValue, isLoading: transactionValueLoading } = useQuery({
    queryKey: ['avgTransactionValue'],
    queryFn: () => fetchDataFromBackend('metrics/avg-transaction-value'),
    refetchInterval: 300000,
  });
 
  const { data: volumeHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['volumeHistory'],
    queryFn: () => fetchDataFromBackend('metrics/volume-history'),
    refetchInterval: 300000,
  });

  // Handle loading and error states
  if (
    supplyLoading ||
    mintBurnLoading ||
    volumeLoading ||
    addressesLoading ||
    holdersLoading ||
    gasLoading ||
    speedLoading
  ) {
    return <div className="p-4">Loading metrics...</div>;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Live Metrics</h2>

      {/* Grid Layout for Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Supply */}
        <div className="bg-blue-500/10 p-6 rounded-xl border border-blue-500/20">
          <h3 className="text-blue-400 text-sm mb-1">Total Supply</h3>
          <p className="text-2xl font-bold">{formatNumber(totalSupply || 0)} PYUSD</p>
        </div>

        {/* Daily Volume */}
        
        <div className="bg-blue-500/10 p-6 rounded-xl border border-blue-500/20">
          <h3 className="text-blue-400 text-sm mb-1">24h Volume</h3>
          
          <p className="text-2xl font-bold">
          {formatNumber(dailyVolume?.reduce((sum: number, row: { total_daily_volume_pyusd: number; tx_count: number }) => sum + row.total_daily_volume_pyusd, 0)) || 0} PYUSD | 
    {formatNumber(dailyVolume?.reduce((sum: number, row: { tx_count: number }) => sum + row.tx_count, 0)) || 0}
    
     Transactions

 </p>
        </div>

        {/* Unique Holders */}
        <div className="bg-blue-500/10 p-6 rounded-xl border border-blue-500/20">
          <h3 className="text-blue-400 text-sm mb-1">Unique Holders</h3>
          <p className="text-2xl font-bold">{formatNumber(uniqueHolders?.uniqueHolders || 0)}</p>
        </div>

        {/* Active Addresses */}
        <div className="bg-blue-500/10 p-6 rounded-xl border border-blue-500/20">
          <h3 className="text-blue-400 text-sm mb-1">Active Addresses</h3>
          <p className="text-2xl font-bold">
            Senders: {formatNumber(activeAddresses?.reduce((sum: number, row: { active_senders: number }) => sum + row.active_senders, 0)) || 0} | 
            Receivers: {formatNumber(activeAddresses?.reduce((sum: number, row: { active_receivers: number }) => sum + row.active_receivers, 0)) || 0} | 
            Total: {formatNumber(activeAddresses?.reduce((sum: number, row: { total_active: number }) => sum + row.total_active, 0)) || 0}
          </p>
        </div>

        {/* Mint vs Burn Tracker */}
        <div className="bg-blue-500/10 p-6 rounded-xl border border-blue-500/20">
          <h3 className="text-blue-400 text-sm mb-1">Mint vs Burn</h3>
          <p className="text-2xl font-bold">
            Minted: {formatNumber(mintBurnData?.minted || 0)} | Burned: {formatNumber(mintBurnData?.burned || 0)}
          </p>
        </div>

        {/* Avg. Gas Fee */}
        <div className="bg-blue-500/10 p-6 rounded-xl border border-blue-500/20">
          <h3 className="text-blue-400 text-sm mb-1">Avg. Gas Fee</h3>
          <p className="text-2xl font-bold">{formatNumber(avgGasFee?.avgGasFee || 0)} Gwei</p>
        </div>

        {/* Avg. Transaction Speed */}
        <div className="bg-blue-500/10 p-6 rounded-xl border border-blue-500/20">
          <h3 className="text-blue-400 text-sm mb-1">Avg. Transaction Speed</h3>
          <p className="text-2xl font-bold">{formatNumber(transactionSpeed?.transactionSpeed || 0)} secs</p>
        </div>
      </div>
{/* Volume History Chart */}
<div className="bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] p-6 rounded-2xl border border-blue-500/30 shadow-lg shadow-blue-500/10">
        <h3 className="text-blue-300 text-sm mb-4 font-semibold tracking-widest uppercase">📊 30-Day Volume History</h3>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={volumeHistory} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#38bdf855" />
              <XAxis
                dataKey="day"
                stroke="#93c5fd"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                }
                tickLine={false}
                axisLine={false}
              />
             <YAxis
                stroke="#93c5fd"
                tickFormatter={(value) => `${formatNumber(value)} PYUSD`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(value: number) => `${formatNumber(value)} PYUSD`}
                labelFormatter={(label) =>
                  `Date: ${new Date(label).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}`
                }
              />
              <Area
                type="monotone"
                dataKey="total_daily_volume_pyusd"
                stroke="#38bdf8"
                fillOpacity={1}
                fill="url(#colorVolume)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default LiveMetrics;