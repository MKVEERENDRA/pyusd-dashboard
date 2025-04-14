const express = require('express');
const router = express.Router();

// MEV Overview
router.get('/overview', async (req, res) => {
  try {
    const overview = {
      protectionRate: 97,
      protectionChange: 2.5,
      valueSaved: 52800,
      activeSearchers: 24,
      newSearchers: 5,
    };
    res.json(overview);
  } catch (error) {
    console.error('Error fetching MEV overview:', error);
    res.status(500).json({ error: 'Failed to fetch MEV overview' });
  }
});

// MEV Activity Timeline
router.get('/activity', async (req, res) => {
  try {
    const activity = [
      { time: '00:00', sandwiches: 5, frontRuns: 3, backRuns: 2 },
      { time: '04:00', sandwiches: 7, frontRuns: 4, backRuns: 3 },
      { time: '08:00', sandwiches: 4, frontRuns: 6, backRuns: 4 },
      { time: '12:00', sandwiches: 8, frontRuns: 5, backRuns: 3 },
      { time: '16:00', sandwiches: 6, frontRuns: 7, backRuns: 5 },
      { time: '20:00', sandwiches: 9, frontRuns: 4, backRuns: 2 },
    ];
    res.json(activity);
  } catch (error) {
    console.error('Error fetching MEV activity:', error);
    res.status(500).json({ error: 'Failed to fetch MEV activity' });
  }
});

// Protection Statistics
router.get('/protection-stats', async (req, res) => {
  try {
    const stats = [
      { type: 'Protected', value: 85 },
      { type: 'At Risk', value: 12 },
      { type: 'Attacked', value: 3 },
    ];
    res.json(stats);
  } catch (error) {
    console.error('Error fetching protection stats:', error);
    res.status(500).json({ error: 'Failed to fetch protection stats' });
  }
});

// Recent MEV Attacks
router.get('/recent-attacks', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const attacks = [
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
    ].slice(0, limit);
    res.json(attacks);
  } catch (error) {
    console.error('Error fetching recent MEV attacks:', error);
    res.status(500).json({ error: 'Failed to fetch recent MEV attacks' });
  }
});

// Network Stats
router.get('/network-stats', async (req, res) => {
  try {
    const stats = {
      gasPrice: 45,
      blockTime: 12.1,
      networkLoad: 75,
      riskLevel: 'Medium',
    };
    res.json(stats);
  } catch (error) {
    console.error('Error fetching network stats:', error);
    res.status(500).json({ error: 'Failed to fetch network stats' });
  }
});

module.exports = router;
