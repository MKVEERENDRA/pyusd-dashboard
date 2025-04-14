import axios from 'axios';

// Backend API base UR
// L
const API_BASE_URL = 'http://localhost:3001/api'; // Ensure this matches your backend server URL

// Create an Axios instance for API calls
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interfaces for returned data
export interface Analytics {
  totalSupply: number;
  minted: number;
  burned: number;
}

export interface VolumeData {
  day: string;
  total_daily_volume_pyusd: number;
  tx_count: number;
}

export interface ActiveAddresses {
  day: string;
  active_senders: number;
  active_receivers: number;
  total_active: number;
}

export interface UniqueHolders {
  uniqueHolders: number;
}

export interface AvgGasFee {
  avgGasFee: number;
}

export interface TransactionSpeed {
  transactionSpeed: number;
}

export interface AvgTransactionValue {
  avgTransactionValue: number;
}

export interface SecurityRiskScore {
  time: string;
  score: number;
}

export interface Vulnerability {
  type: 'Critical' | 'High' | 'Medium' | 'Low';
  count: number;
}

export interface SecurityEvent {
  id: number;
  type: 'info' | 'warning' | 'danger';
  message: string;
  timestamp: string;
}

export interface SecurityOverview {
  securityScore: number;
  status: 'safe' | 'warning' | 'danger';
  lastUpdated: string;
  activeThreats: number;
  threatSeverity: 'low' | 'medium' | 'high' | 'critical';
  protectedAssets: number;
}

export interface SecurityMeasures {
  accessControl: {
    multiSigRequired: boolean;
    multiSigThreshold: string;
    timeLock: string;
  };
  monitoring: {
    anomalyDetection: boolean;
    realTimeAlerts: boolean;
  };
  compliance: {
    lastAudit: string;
    certificationValid: boolean;
  };
}

// Fetch Total Supply from the Smart Contract (Frontend)
export const getTotalSupply = async (): Promise<number> => {
  const response = await api.get('/total-supply');
  return parseFloat(response.data.totalSupply);
};

// Fetch Mint/Burn Events from the Smart Contract (Frontend)
export const getMintBurnEvents = async (): Promise<{ minted: number; burned: number }> => {
  const response = await api.get('/mint-burn-events');
  return {
    minted: parseFloat(response.data.minted),
    burned: parseFloat(response.data.burned),
  };
};

// Fetch Daily Volume from the Backend
export const getDailyVolume = async (): Promise<VolumeData[]> => {
  const response = await api.get('/daily-volume');
  return response.data.map((row: any) => ({
    day: row.day,
    total_daily_volume_pyusd: parseFloat(row.total_daily_volume_pyusd),
    tx_count: row.tx_count,
  }));
};

// Fetch Active Addresses from the Backend
export const getActiveAddresses = async (): Promise<ActiveAddresses[]> => {
  const response = await api.get('/active-addresses');
  return response.data.map((row: any) => ({
    day: row.day,
    active_senders: parseInt(row.active_senders, 10),
    active_receivers: parseInt(row.active_receivers, 10),
    total_active: parseInt(row.total_active, 10),
  }));
};

// Fetch Unique Holders from the Backend
export const getUniqueHolders = async (): Promise<UniqueHolders> => {
  const response = await api.get('/unique-holders');
  return { uniqueHolders: parseInt(response.data.uniqueHolders, 10) };
};

// Fetch Average Gas Fee from the Backend
export const getAvgGasFee = async (): Promise<AvgGasFee> => {
  const response = await api.get('/avg-gas-fee');
  return { avgGasFee: parseFloat(response.data.avgGasFee) };
};

// Fetch Transaction Speed from the Backend
export const getTransactionSpeed = async (): Promise<TransactionSpeed> => {
  const response = await api.get('/transaction-speed');
  return { transactionSpeed: parseFloat(response.data.transactionSpeed) };
};

// Fetch Average Transaction Value from the Backend
export const getAvgTransactionValue = async (): Promise<AvgTransactionValue> => {
  const response = await api.get('/avg-transaction-value');
  return { avgTransactionValue: parseFloat(response.data.avgTransactionValue) };
};

// Fetch Transfer Velocity from the Backend
export const getTransferVelocity = async (): Promise<any[]> => {
  const response = await api.get('/transfer-velocity');
  return response.data.map((row: any) => ({
    day: row.day,
    avg_transfer_velocity: parseFloat(row.avg_transfer_velocity),
  }));
};

// Fetch Volume History from the Backend
export const getVolumeHistory = async (days: number = 30): Promise<VolumeData[]> => {
  const response = await api.get(`/volume-history?days=${days}`);
  return response.data.map((row: any) => ({
    day: row.day,
    total_volume_pyusd: parseFloat(row.total_volume_pyusd),
  }));
};

// Security Monitoring API Functions
export const getSecurityOverview = async (): Promise<SecurityOverview> => {
  const response = await api.get('/security/overview');
  return response.data;
};

export const getSecurityRiskScores = async (hours: number = 24): Promise<SecurityRiskScore[]> => {
  const response = await api.get(`/security/risk-scores?hours=${hours}`);
  return response.data;
};

export const getVulnerabilities = async (): Promise<Vulnerability[]> => {
  const response = await api.get('/security/vulnerabilities');
  return response.data;
};

export const getSecurityEvents = async (limit: number = 10): Promise<SecurityEvent[]> => {
  const response = await api.get(`/security/events?limit=${limit}`);
  return response.data;
};

export const getSecurityMeasures = async (): Promise<SecurityMeasures> => {
  const response = await api.get('/security/measures');
  return response.data;
};

// Export the API instance for additional use if needed
export default api;