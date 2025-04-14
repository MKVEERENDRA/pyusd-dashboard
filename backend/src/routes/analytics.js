const express = require('express');
const router = express.Router();
const ethService = require('../services/ethService');
const analyticsService = require('../services/analyticsService');

// Get latest analytics
router.get('/latest', async (req, res) => {
  try {
    const analytics = await analyticsService.getLatestAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching latest analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get volume history
router.get('/volume-history', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const volumeHistory = await ethService.getVolumeHistory(days);
    res.json(volumeHistory);
  } catch (error) {
    console.error('Error fetching volume history:', error);
    res.status(500).json({ error: 'Failed to fetch volume history' });
  }
});

// Get whale transactions
router.get('/whale-transactions', async (req, res) => {
  try {
    const whaleTransactions = await ethService.getWhaleTransactions();
    res.json(whaleTransactions);
  } catch (error) {
    console.error('Error fetching whale transactions:', error);
    res.status(500).json({ error: 'Failed to fetch whale transactions' });
  }
});

// Get historical analytics
router.get('/historical', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const analytics = await analyticsService.getHistoricalAnalytics(parseInt(days));
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching historical analytics:', error);
    res.status(500).json({ error: error.message });
  }
});

// Force update analytics (protected endpoint)
router.post('/update', async (req, res) => {
  try {
    const analytics = await analyticsService.updateAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error('Error updating analytics:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
