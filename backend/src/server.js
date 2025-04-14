require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const metricsRoutes = require('./routes/metrics');
const adoptionRoutes = require('./routes/adoption');
const whalesRoutes = require('./routes/whales');
const securityRoutes = require('./routes/security.js');
const crossChainRoutes = require('./routes/cross-chain');
const governanceRoutes = require('./routes/governance');
const mevRoutes = require('./routes/mev');
const exportRoutes = require('./routes/export');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());

app.use(express.json());



// Routes
app.use('/api/adoption', adoptionRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/whales', whalesRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/cross-chain', crossChainRoutes);
app.use('/api/governance', governanceRoutes);
app.use('/api/mev', mevRoutes);
app.use('/api/export', exportRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
