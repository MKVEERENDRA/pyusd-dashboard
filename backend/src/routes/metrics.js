const express = require('express');
const router = express.Router();
const { BigQuery } = require('@google-cloud/bigquery');

const bigquery = new BigQuery();
console.log("am here ",bigquery);

// 1. Get daily transaction volume
router.get('/daily-volume', async (req, res) => {
  console.log("iam here1");
  try {
    const query = `
      SELECT
        DATE(block_timestamp) AS day,
        SUM(CAST(value AS FLOAT64)) / POW(10, 6) AS total_daily_volume_pyusd,
        COUNT(*) AS tx_count
      FROM
        \`bigquery-public-data.crypto_ethereum.token_transfers\`
      WHERE
        token_address = "0x6c3ea9036406852006290770bedfcaba0e23a0e8"
      GROUP BY day
      ORDER BY day DESC
      LIMIT 1;
    `;
    console.log("iam here2",query);

    const [rows] = await bigquery.query(query);
    console.log(rows);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Get transfer velocity
router.get('/transfer-velocity', async (req, res) => {
  try {
    const query = `
      SELECT
        DATE(block_timestamp) AS day,
        SUM(CAST(value AS FLOAT64)) / POW(10, 6) / COUNT(DISTINCT from_address) AS avg_transfer_velocity
      FROM
        \`bigquery-public-data.crypto_ethereum.token_transfers\`
      WHERE
        token_address = "0x6c3ea9036406852006290770bedfcaba0e23a0e8"
      GROUP BY day
      ORDER BY day DESC
      LIMIT 1;
    `;

    const [rows] = await bigquery.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Get active addresses
router.get('/active-addresses', async (req, res) => {
  try {
    const query = `
      SELECT
        DATE(block_timestamp) AS day,
        COUNT(DISTINCT from_address) AS active_senders,
        COUNT(DISTINCT to_address) AS active_receivers,
        COUNT(DISTINCT from_address || to_address) AS total_active
      FROM
        \`bigquery-public-data.crypto_ethereum.token_transfers\`
      WHERE
        token_address = "0x6c3ea9036406852006290770bedfcaba0e23a0e8"
      GROUP BY day
      ORDER BY day DESC
      LIMIT 1;
    `;

    const [rows] = await bigquery.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Get unique holders
router.get('/unique-holders', async (req, res) => {
  try {
    const query = `
      SELECT
        COUNT(DISTINCT owner) AS unique_holders
      FROM
        \`bigquery-public-data.crypto_ethereum.token_balances\`
      WHERE
        token_address = "0x6c3ea9036406852006290770bedfcaba0e23a0e8" AND balance > 0
              ORDER BY address DESC
              LIMIT 1;

    `;

    const [rows] = await bigquery.query(query);
    res.json({ uniqueHolders: rows[0]?.unique_holders || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Get average gas fee
router.get('/avg-gas-fee', async (req, res) => {
  try {
    const query = `
      SELECT
        AVG(gas_price) / POW(10, 9) AS avg_gas_fee_gwei
      FROM
        \`bigquery-public-data.crypto_ethereum.transactions\`
      WHERE
        DATE(block_timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)
    `;

    const [rows] = await bigquery.query(query);
    res.json({ avgGasFee: rows[0]?.avg_gas_fee_gwei || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Get transaction speed
router.get('/transaction-speed', async (req, res) => {
  try {
    const query = `
     WITH block_diffs AS (
  SELECT
    timestamp,
    LEAD(timestamp) OVER (ORDER BY timestamp) AS next_timestamp
  FROM
    \`bigquery-public-data.crypto_ethereum.blocks\`
  WHERE
    DATE(timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)
)

SELECT
  AVG(TIMESTAMP_DIFF(next_timestamp, timestamp, SECOND)) AS avg_transaction_speed_seconds
FROM
  block_diffs
WHERE
  next_timestamp IS NOT NULL;

    `;

    const [rows] = await bigquery.query(query);
    res.json({ transactionSpeed: rows[0]?.avg_transaction_speed_seconds || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Get mint/burn events (frontend handles this via smart contract interaction)
// No backend route needed for mint/burn events as it's handled by the frontend.

// 8. Get total supply (frontend handles this via smart contract interaction)
// No backend route needed for total supply as it's handled by the frontend.

// 9. Get average transaction value
router.get('/avg-transaction-value', async (req, res) => {
  try {
    const query = `
      SELECT
        AVG(CAST(value AS FLOAT64)) / POW(10, 6) AS avg_transaction_value_pyusd
      FROM
        \`bigquery-public-data.crypto_ethereum.token_transfers\`
      WHERE
        token_address = "0x6c3ea9036406852006290770bedfcaba0e23a0e8"
    `;

    const [rows] = await bigquery.query(query);
    res.json({ avgTransactionValue: rows[0]?.avg_transaction_value_pyusd || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 10. Get volume history
router.get('/volume-history', async (req, res) => {
  try {
    const query = `
      SELECT
        DATE(block_timestamp) AS day,
        SUM(CAST(value AS FLOAT64)) / POW(10, 6) AS total_volume_pyusd
      FROM
        \`bigquery-public-data.crypto_ethereum.token_transfers\`
      WHERE
        token_address = "0x6c3ea9036406852006290770bedfcaba0e23a0e8"
      GROUP BY day
      ORDER BY day DESC
      LIMIT 30;
    `;

    const [rows] = await bigquery.query(query);
    console.log(rows);
    const formattedData = rows.map(row => ({
      day: row.day.value,
      total_daily_volume_pyusd: parseFloat(row.total_volume_pyusd),
    }));
    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;