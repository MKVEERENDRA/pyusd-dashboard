const express = require('express');
const router = express.Router();
const { BigQuery } = require('@google-cloud/bigquery');
const bigquery = new BigQuery();

// PYUSD Contract Address (directly added here)
const PYUSD_CONTRACT_ADDRESS = '0x6c3ea9036406852006290770bedfcaba0e23a0e8'; // Replace with the actual address
const EXCHANGE_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'; // Example exchange address (Uniswap V2 Router)

// Helper function to execute BigQuery queries
async function queryBigQuery(query) {
  try {
    const [rows] = await bigquery.query(query);
    return rows;
  } catch (error) {
    console.error('Error querying BigQuery:', error);
    throw error;
  }
}

// 1. Large Transfers > $50k
router.get('/large-transfers', async (req, res) => {
  try {
    const query = `
      SELECT
        from_address,
        to_address,
        SUM(CAST(value AS FLOAT64)) / POW(10, 6) AS total_sent_pyusd,
        COUNT(*) AS tx_count
      FROM
        \`bigquery-public-data.crypto_ethereum.token_transfers\`
      WHERE
        token_address = "${PYUSD_CONTRACT_ADDRESS}"
        AND CAST(value AS FLOAT64) > 50000 * POW(10, 6)
        AND block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 365 DAY)
      GROUP BY from_address, to_address
      ORDER BY total_sent_pyusd DESC
      LIMIT 3;
    `;
    const rows = await queryBigQuery(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Dormant Whale Awakening Alerts
router.get('/dormant-whales', async (req, res) => {
  try {
    const query = `
      SELECT
        from_address,
        SUM(CAST(value AS FLOAT64)) / POW(10, 6) AS total_sent_pyusd,
        COUNT(*) AS tx_count,
        MIN(block_timestamp) AS first_tx_time,
        MAX(block_timestamp) AS last_tx_time
      FROM
        \`bigquery-public-data.crypto_ethereum.token_transfers\`
      WHERE
        token_address = "${PYUSD_CONTRACT_ADDRESS}"
        AND block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 365 DAY)
      GROUP BY from_address
      HAVING
        DATE_DIFF(CURRENT_DATE(), CAST(MAX(block_timestamp) AS DATE), DAY) > 90
      ORDER BY total_sent_pyusd DESC
      LIMIT 3;
    `;
    const rows = await queryBigQuery(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Top Wallets Leaderboard (Live)
router.get('/top-wallets', async (req, res) => {
  try {
    const query = `
      SELECT
        from_address AS wallet,
        SUM(CAST(value AS FLOAT64)) / POW(10, 6) AS total_sent_pyusd,
        COUNT(*) AS tx_count
      FROM
        \`bigquery-public-data.crypto_ethereum.token_transfers\`
      WHERE
        token_address = "${PYUSD_CONTRACT_ADDRESS}"
        AND block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 365 DAY)
      GROUP BY from_address
      ORDER BY total_sent_pyusd DESC
      LIMIT 3;
    `;
    const rows = await queryBigQuery(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Whale Sentiment Tracker
router.get('/whale-sentiment', async (req, res) => {
  try {
    const query = `
      SELECT
        from_address,
        AVG(gas_price) / POW(10, 9) AS avg_gas_fee_gwei
      FROM
        \`bigquery-public-data.crypto_ethereum.transactions\`
      WHERE
        from_address IN (
          SELECT DISTINCT from_address
          FROM \`bigquery-public-data.crypto_ethereum.token_transfers\`
          WHERE token_address = "${PYUSD_CONTRACT_ADDRESS}"
        )
        AND block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 365 DAY)
      GROUP BY from_address
      ORDER BY avg_gas_fee_gwei DESC
      LIMIT 3;
    `;
    const rows = await queryBigQuery(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Whale Cluster Map (Interactions between whales)
router.get('/whale-cluster-map', async (req, res) => {
  try {
    const query = `
      SELECT
        from_address,
        to_address,
        COUNT(*) AS interactions
      FROM
        \`bigquery-public-data.crypto_ethereum.token_transfers\`
      WHERE
        token_address = "${PYUSD_CONTRACT_ADDRESS}"
        AND block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 365 DAY)
      GROUP BY from_address, to_address
      HAVING interactions > 5
      ORDER BY interactions DESC
      LIMIT 3;
    `;
    const rows = await queryBigQuery(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Multi-Wallet Detection (Entity Clustering)
router.get('/multi-wallet-detection', async (req, res) => {
  try {
    const query = `
      SELECT
        from_address,
        COUNT(DISTINCT to_address) AS wallet_count
      FROM
        \`bigquery-public-data.crypto_ethereum.token_transfers\`
      WHERE
        token_address = "${PYUSD_CONTRACT_ADDRESS}"
        AND block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 365 DAY)
      GROUP BY from_address
      HAVING wallet_count > 5
      ORDER BY wallet_count DESC
      LIMIT 3;
    `;
    const rows = await queryBigQuery(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Whale Mint-to-Swap Pattern Recognition
router.get('/mint-swap-pattern', async (req, res) => {
  try {
    const query = `
      SELECT
        from_address,
        COUNT(*) AS mint_swap_count
      FROM
        \`bigquery-public-data.crypto_ethereum.token_transfers\`
      WHERE
        token_address = "${PYUSD_CONTRACT_ADDRESS}"
        AND (to_address = "${EXCHANGE_ADDRESS}" OR from_address = "${EXCHANGE_ADDRESS}")
        AND block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 365 DAY)
      GROUP BY from_address
      HAVING mint_swap_count > 5
      ORDER BY mint_swap_count DESC
      LIMIT 3;
    `;
    const rows = await queryBigQuery(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. PYUSD Exchange Wallet Tracker
router.get('/exchange-flow', async (req, res) => {
  try {
    const query = `
      SELECT
        from_address AS wallet,
        COUNT(*) AS tx_count,
        SUM(CAST(value AS FLOAT64)) / POW(10, 6) AS total_sent_pyusd
      FROM
        \`bigquery-public-data.crypto_ethereum.token_transfers\`
      WHERE
        token_address = "${PYUSD_CONTRACT_ADDRESS}"
        AND (to_address = "${EXCHANGE_ADDRESS}" OR from_address = "${EXCHANGE_ADDRESS}")
        AND block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 365 DAY)
      GROUP BY from_address
      ORDER BY total_sent_pyusd DESC
      LIMIT 3;
    `;
    const rows = await queryBigQuery(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 9. Whale MEV-Protected Transfers
router.get('/mev-protected-transfers', async (req, res) => {
  try {
    const query = `
      SELECT
        t.from_address,
        t.to_address,
        SUM(CAST(tt.value AS FLOAT64)) / POW(10, 6) AS total_sent_pyusd,
        COUNT(*) AS tx_count
      FROM
        \`bigquery-public-data.crypto_ethereum.transactions\` t
      JOIN
        \`bigquery-public-data.crypto_ethereum.token_transfers\` tt
      ON
        t.hash = tt.transaction_hash
      WHERE
        t.to_address IN (
          "0xac6e77dfe25ecd6110b8e780608cce0dab71fdd5ebea22a16c0205200f2f8e2e3ad3b71d3499c54ad14d6c21b41a37ae", -- Flashbots
          "0xa15b52576bcbf1072f4a011c0f99f9fb6c66f3e1ff321f11f461d15e31b1cb359caa092c71bbded0bae5b5ea401aab7e" -- Aestus
        )
        AND tt.token_address = "${PYUSD_CONTRACT_ADDRESS}"
        AND t.block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
      GROUP BY
        t.from_address, t.to_address
      ORDER BY
        total_sent_pyusd DESC
      LIMIT 3;
    `;
    const rows = await queryBigQuery(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 10. Whale Movement Forecasts
router.get('/movement-forecast', async (req, res) => {
  try {
    const query = `
      SELECT
        from_address,
        to_address,
        COUNT(*) AS transfer_count,
        AVG(CAST(value AS FLOAT64)) / POW(10, 6) AS avg_transfer_amount
      FROM
        \`bigquery-public-data.crypto_ethereum.token_transfers\`
      WHERE
        token_address = "${PYUSD_CONTRACT_ADDRESS}"
        AND block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 365 DAY)
      GROUP BY from_address, to_address
      HAVING transfer_count > 10
      ORDER BY avg_transfer_amount DESC
      LIMIT 3;
    `;
    const rows = await queryBigQuery(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export the router
module.exports = router;