const express = require('express');
const router = express.Router();

// Cross-Chain Overview
router.get('/overview', async (req, res) => {
  try {
    const overview = {
      totalBridges: 4,
      bridgeVolume24h: 7200000, // $7.2M
      volumeChange: 15.3,
      securityScore: 100,
    };
    res.json(overview);
  } catch (error) {
    console.error('Error fetching cross-chain overview:', error);
    res.status(500).json({ error: 'Failed to fetch cross-chain overview' });
  }
});

// Bridge Volume Data
router.get('/bridge-volume', async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 24;
    const data = generateBridgeVolumeData(hours);
    res.json(data);
  } catch (error) {
    console.error('Error fetching bridge volume:', error);
    res.status(500).json({ error: 'Failed to fetch bridge volume' });
  }
});

// Chain Distribution
router.get('/distribution', async (req, res) => {
  try {
    const distribution = [
      { chain: 'Ethereum', value: 45, color: '#627EEA' },
      { chain: 'Polygon', value: 25, color: '#8247E5' },
      { chain: 'Arbitrum', value: 20, color: '#28A0F0' },
      { chain: 'Optimism', value: 10, color: '#FF0420' },
    ];
    res.json(distribution);
  } catch (error) {
    console.error('Error fetching chain distribution:', error);
    res.status(500).json({ error: 'Failed to fetch chain distribution' });
  }
});

// Bridge Health
router.get('/bridge-health', async (req, res) => {
  try {
    const health = [
      { name: 'Wormhole', status: 'Operational', latency: '12s' },
      { name: 'Polygon Bridge', status: 'Operational', latency: '15s' },
      { name: 'Arbitrum Bridge', status: 'Operational', latency: '18s' },
      { name: 'Optimism Bridge', status: 'Operational', latency: '14s' },
    ];
    res.json(health);
  } catch (error) {
    console.error('Error fetching bridge health:', error);
    res.status(500).json({ error: 'Failed to fetch bridge health' });
  }
});

// Recent Bridge Transactions
router.get('/recent-transactions', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const transactions = [
      { from: 'Ethereum', to: 'Polygon', amount: '$250K', time: '2m ago' },
      { from: 'Arbitrum', to: 'Ethereum', amount: '$180K', time: '5m ago' },
      { from: 'Optimism', to: 'Ethereum', amount: '$120K', time: '8m ago' },
    ].slice(0, limit);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    res.status(500).json({ error: 'Failed to fetch recent transactions' });
  }
});

// Helper Functions
function generateBridgeVolumeData(hours) {
  const data = [];
  const now = new Date();
  
  for (let i = 0; i < hours; i++) {
    const time = new Date(now - i * 3600000);
    data.unshift({
      time: time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      ethereum: 1200 + Math.random() * 1600,
      polygon: 800 + Math.random() * 1000,
      arbitrum: 600 + Math.random() * 900,
      optimism: 400 + Math.random() * 700,
    });
  }
  
  return data;
}

module.exports = router;
