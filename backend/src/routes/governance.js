const express = require('express');
const router = express.Router();

// Governance Overview
router.get('/overview', async (req, res) => {
  try {
    const overview = {
      activeProposals: 2,
      timeRemaining: '48h',
      totalVotes: 1200000,
      participationChange: 5.3,
      governanceScore: 8.5,
    };
    res.json(overview);
  } catch (error) {
    console.error('Error fetching governance overview:', error);
    res.status(500).json({ error: 'Failed to fetch governance overview' });
  }
});

// Active Proposals
router.get('/proposals', async (req, res) => {
  try {
    const proposals = [
      { 
        id: 'PIP-001', 
        title: 'Upgrade Bridge Security', 
        status: 'Active', 
        votes: { for: 65, against: 35 } 
      },
      { 
        id: 'PIP-002', 
        title: 'Expand to Optimism', 
        status: 'Passed', 
        votes: { for: 82, against: 18 } 
      },
      { 
        id: 'PIP-003', 
        title: 'Treasury Allocation', 
        status: 'Active', 
        votes: { for: 45, against: 55 } 
      },
    ];
    res.json(proposals);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
});

// Voting Power Distribution
router.get('/voting-power', async (req, res) => {
  try {
    const votingPower = [
      { holder: 'Whale 1', power: 15 },
      { holder: 'Whale 2', power: 12 },
      { holder: 'Whale 3', power: 10 },
      { holder: 'Whale 4', power: 8 },
      { holder: 'Others', power: 55 },
    ];
    res.json(votingPower);
  } catch (error) {
    console.error('Error fetching voting power distribution:', error);
    res.status(500).json({ error: 'Failed to fetch voting power distribution' });
  }
});

// Recent Activities
router.get('/activities', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const activities = [
      { 
        action: 'Vote Cast', 
        details: 'PIP-001', 
        time: '5m ago', 
        voter: '0x1234...5678' 
      },
      { 
        action: 'Proposal Created', 
        details: 'PIP-003', 
        time: '2h ago', 
        voter: '0x8765...4321' 
      },
      { 
        action: 'Proposal Executed', 
        details: 'PIP-002', 
        time: '1d ago', 
        voter: 'System' 
      },
    ].slice(0, limit);
    res.json(activities);
  } catch (error) {
    console.error('Error fetching governance activities:', error);
    res.status(500).json({ error: 'Failed to fetch governance activities' });
  }
});

// Governance Rules
router.get('/rules', async (req, res) => {
  try {
    const rules = {
      voting: {
        minimumStake: 1000,
        votingPeriod: '7 days',
      },
      quorum: {
        required: 10,
        currentAverage: 15.3,
      },
      timelock: {
        executionDelay: '48 hours',
        gracePeriod: '24 hours',
      },
    };
    res.json(rules);
  } catch (error) {
    console.error('Error fetching governance rules:', error);
    res.status(500).json({ error: 'Failed to fetch governance rules' });
  }
});

module.exports = router;
