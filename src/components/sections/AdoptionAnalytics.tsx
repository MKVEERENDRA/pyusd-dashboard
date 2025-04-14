import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
} from 'recharts';
import { ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { formatNumber as formatNumberUtil } from '../../utils/formatters';

// Mock API Endpoints
const API_BASE_URL = "http://localhost:3001/api/adoption";

// Fetch Data from Backend
async function fetchDataFromBackend(endpoint: string) {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`);
  if (!response.ok) throw new Error('Failed to fetch data');
  return response.json();
}

// Generate dynamic colors
const generateColors = (count: number) => {
  const colors = ['#FF8042', '#00C49F', '#FFBB28', '#0088FE'];
  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
};

// Format number
const formatNumber = (value: ValueType) => {
  if (value === null || value === undefined) return '0';
  const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
  return formatNumberUtil(numValue);
};

// Reusable Area Chart Component
const ReusableAreaChart = ({
  data,
  xKey,
  yKey,
  title,
}: {
  data: any[];
  xKey: string;
  yKey: string;
  title: string;
}) => (
  <div className="bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] p-6 rounded-2xl border border-blue-500/30 shadow-lg shadow-blue-500/10 mb-6">
    <h3 className="text-blue-300 text-sm mb-4 font-semibold tracking-widest uppercase">{title}</h3>
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorAdoption" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#38bdf855" />
        <XAxis
          dataKey={xKey}
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
        <Tooltip formatter={(value) => `${formatNumber(value)} PYUSD`} />
        <Area
          type="monotone"
          dataKey={yKey}
          stroke="#38bdf8"
          fillOpacity={1}
          fill="url(#colorAdoption)"
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const AdoptionAnalytics = () => {
  // Fetch data from backend
  const { data: dailyAdoption, isLoading: adoptionLoading, error: adoptionError } = useQuery({
    queryKey: ['dailyAdoption'],
    queryFn: () => fetchDataFromBackend('daily-adoption'),
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  const { data: topWalletsRelaxed, isLoading: walletsRelaxedLoading, error: walletsRelaxedError } = useQuery({
    queryKey: ['topWalletsRelaxed'],
    queryFn: () => fetchDataFromBackend('top-wallets-relaxed'),
    refetchInterval: 300000,
  });

  const { data: ecosystemAdoption, isLoading: ecosystemLoading, error: ecosystemError } = useQuery({
    queryKey: ['ecosystemAdoption'],
    queryFn: () => fetchDataFromBackend('ecosystem-adoption'),
    refetchInterval: 300000,
  });

  const { data: weeklyActivity, isLoading: weeklyLoading, error: weeklyError } = useQuery({
    queryKey: ['weeklyActivity'],
    queryFn: () => fetchDataFromBackend('weekly-activity'),
    refetchInterval: 300000,
  });

  const { data: exchangeFlow, isLoading: exchangeLoading, error: exchangeError } = useQuery({
    queryKey: ['exchangeFlow'],
    queryFn: () => fetchDataFromBackend('exchange-flow'),
    refetchInterval: 300000,
  });

  // Handle loading state
  if (
    adoptionLoading ||
    walletsRelaxedLoading ||
    ecosystemLoading ||
    weeklyLoading ||
    exchangeLoading
  ) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full h-8 w-8"></div>
      </div>
    );
  }

  // Handle error state
  if (
    adoptionError ||
    walletsRelaxedError ||
    ecosystemError ||
    weeklyError ||
    exchangeError
  ) {
    return <div className="p-4 text-red-500">Failed to load data. Please try again later.</div>;
  }

  // Handle empty data state
  if (
    !dailyAdoption?.length ||
    !topWalletsRelaxed?.length ||
    !ecosystemAdoption?.length ||
    !weeklyActivity?.length ||
    !exchangeFlow?.length
  ) {
    return <div className="p-4">No data available for this metric.</div>;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Live Metrics</h2>

      {/* Daily Adoption Chart */}
      <ReusableAreaChart
        data={dailyAdoption}
        xKey="day"
        yKey="total_daily_adoption_pyusd"
        title="📊 Daily PYUSD Adoption"
      />

      {/* Top Wallets Bar Chart */}
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] p-6 rounded-2xl border border-blue-500/30 shadow-lg shadow-blue-500/10 mb-6">
        <h3 className="text-blue-300 text-sm mb-4 font-semibold tracking-widest uppercase">📊 Top Wallets by PYUSD Sent</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topWalletsRelaxed}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis
              dataKey="wallet"
              stroke="#93c5fd"
              tickFormatter={(value) => value.slice(0, 6) + '...' + value.slice(-4)}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#93c5fd"
              tickFormatter={(value) => `${formatNumber(value)} PYUSD`}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip formatter={(value) => `${formatNumber(value)} PYUSD`} />
            <Bar dataKey="total_sent_pyusd" fill="#9D00FF" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Ecosystem Adoption Pie Chart */}
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] p-6 rounded-2xl border border-blue-500/30 shadow-lg shadow-blue-500/10 mb-6">
        <h3 className="text-blue-300 text-sm mb-4 font-semibold tracking-widest uppercase">📊 Ecosystem Adoption</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={ecosystemAdoption}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${formatNumber(value)} PYUSD`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="total_sent_pyusd"
            >
              {ecosystemAdoption.map((entry: { total_sent_pyusd: number }, index: number) => (
                <Cell key={`cell-${index}`} fill={generateColors(ecosystemAdoption.length)[index]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${formatNumber(value)} PYUSD`} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Activity Line Chart */}
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] p-6 rounded-2xl border border-blue-500/30 shadow-lg shadow-blue-500/10 mb-6">
        <h3 className="text-blue-300 text-sm mb-4 font-semibold tracking-widest uppercase">📊 Weekly Activity Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weeklyActivity}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis
              dataKey="week_number"
              stroke="#93c5fd"
              tickFormatter={(value) => `Week ${value}`}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#93c5fd"
              tickFormatter={(value) => formatNumber(value)}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip formatter={(value) => formatNumber(value)} />
            <Line type="monotone" dataKey="total_tx_count" stroke="#FF8042" name="Total Transactions" />
            <Line type="monotone" dataKey="unique_wallets" stroke="#00C49F" name="Unique Wallets" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Exchange Flow Bar Chart */}
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] p-6 rounded-2xl border border-blue-500/30 shadow-lg shadow-blue-500/10 mb-6">
        <h3 className="text-blue-300 text-sm mb-4 font-semibold tracking-widest uppercase">📊 Exchange Flow</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={exchangeFlow}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="flow_type" stroke="#93c5fd" tickLine={false} axisLine={false} />
            <YAxis
              stroke="#93c5fd"
              tickFormatter={(value) => `${formatNumber(value)} PYUSD`}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip formatter={(value) => `${formatNumber(value)} PYUSD`} />
            <Bar dataKey="total_flow_pyusd" fill="#FFBB28" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdoptionAnalytics;