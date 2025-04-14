const express = require('express');
const { BigQuery } = require('@google-cloud/bigquery');
const bigquery = new BigQuery();
const router = express.Router();

// Contract Address from Environment Variable
const PYUSD_CONTRACT_ADDRESS = process.env.PYUSD_CONTRACT_ADDRESS || '0x6c3ea9036406852006290770bedfcaba0e23a0e8';
const EXCHANGE_ADDRESSES = process.env.EXCHANGE_ADDRESSES?.split(',') || ['0xUniswapAddress', '0xBinanceAddress'];

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


// 1. Daily PYUSD Adoption
router.get('/daily-adoption', async (req, res) => {
  try {
    const query = `
      SELECT
        DATE(block_timestamp) AS day,
        SUM(CAST(value AS FLOAT64)) / POW(10, 18) AS total_daily_adoption_pyusd,
        COUNT(*) AS tx_count
      FROM
        \`bigquery-public-data.crypto_ethereum.token_transfers\`
      WHERE
        token_address = "${PYUSD_CONTRACT_ADDRESS}"
      GROUP BY day
      ORDER BY day DESC
      LIMIT 30;
    `;
    const rows = await queryBigQuery(query);
    const formattedData = rows.map(row => ({
      day: row.day.value || row.day,
      total_daily_adoption_pyusd: parseFloat(row.total_daily_adoption_pyusd),
      tx_count: parseInt(row.tx_count),
    }));
    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch daily adoption data.' });
  }
});

// 2. Top Wallets by PYUSD Sent (Relaxed Condition)
router.get('/top-wallets-relaxed', async (req, res) => {
  try {
    const query = `
      SELECT
        from_address AS wallet,
        COUNT(*) AS tx_count,
        SUM(CAST(value AS FLOAT64)) / POW(10, 18) AS total_sent_pyusd,
        MAX(block_timestamp) AS last_activity_time
      FROM
        \`bigquery-public-data.crypto_ethereum.token_transfers\`
      WHERE
        token_address = "${PYUSD_CONTRACT_ADDRESS}"
      GROUP BY from_address
      HAVING COUNT(*) > 1
      ORDER BY total_sent_pyusd DESC
      LIMIT 10;
    `;
    const rows = await queryBigQuery(query);
    const formattedData = rows.map(row => ({
      wallet: row.wallet || row.from_address,
      tx_count: parseInt(row.tx_count),
      total_sent_pyusd: parseFloat(row.total_sent_pyusd),
      last_activity_time: row.last_activity_time.value || row.last_activity_time,
    }));
    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top wallets data.' });
  }
});

// 3. Top Wallets by PYUSD Sent (Stricter Condition)
router.get('/top-wallets-strict', async (req, res) => {
  try {
    const query = `
      SELECT
        from_address AS wallet,
        COUNT(*) AS tx_count,
        SUM(CAST(value AS FLOAT64)) / POW(10, 18) AS total_sent_pyusd,
        MAX(block_timestamp) AS last_activity_time
      FROM
        \`bigquery-public-data.crypto_ethereum.token_transfers\`
      WHERE
        token_address = "${PYUSD_CONTRACT_ADDRESS}"
      GROUP BY from_address
      HAVING COUNT(*) > 2
      ORDER BY total_sent_pyusd DESC
      LIMIT 10;
    `;
    const rows = await queryBigQuery(query);
    const formattedData = rows.map(row => ({
      wallet: row.wallet || row.from_address,
      tx_count: parseInt(row.tx_count),
      total_sent_pyusd: parseFloat(row.total_sent_pyusd),
      last_activity_time: row.last_activity_time.value || row.last_activity_time,
    }));
    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch strict top wallets data.' });
  }
});

// 4. Ecosystem Adoption (Top Receivers)
router.get('/ecosystem-adoption', async (req, res) => {
  try {
    const query = `
      SELECT
        to_address AS ecosystem_address,
        SUM(CAST(value AS FLOAT64)) / POW(10, 18) AS total_sent_pyusd,
        COUNT(*) AS tx_count
      FROM
        \`bigquery-public-data.crypto_ethereum.token_transfers\`
      WHERE
        token_address = "${PYUSD_CONTRACT_ADDRESS}"
      GROUP BY to_address
      ORDER BY total_sent_pyusd DESC
      LIMIT 10;
    `;
    const rows = await queryBigQuery(query);
    const formattedData = rows.map(row => ({
      ecosystem_address: row.ecosystem_address || row.to_address,
      total_sent_pyusd: parseFloat(row.total_sent_pyusd),
      tx_count: parseInt(row.tx_count),
    }));
    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ecosystem adoption data.' });
  }
});

// 5. Total PYUSD Sent on Ethereum Mainnet
router.get('/total-pyusd-sent', async (req, res) => {
  try {
    const query = `
      SELECT
        'ethereum_mainnet' AS chain_name,
        SUM(CAST(value AS FLOAT64)) / POW(10, 6) AS total_sent_pyusd,
        COUNT(*) AS tx_count
      FROM
        \`bigquery-public-data.crypto_ethereum.token_transfers\`
      WHERE
        token_address = "${PYUSD_CONTRACT_ADDRESS}";
    `;
    const rows = await queryBigQuery(query);
    const formattedData = rows.map(row => ({
      chain_name: row.chain_name || 'ethereum_mainnet',
      total_sent_pyusd: parseFloat(row.total_sent_pyusd),
      tx_count: parseInt(row.tx_count),
    }));
    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch total PYUSD sent data.' });
  }
});

// 6. Weekly Activity Analysis
router.get('/weekly-activity', async (req, res) => {
  try {
    const query = `
      WITH weekly_data AS (
        SELECT
          from_address,
          EXTRACT(WEEK FROM block_timestamp) AS week_number,
          COUNT(*) AS tx_count
        FROM
          \`bigquery-public-data.crypto_ethereum.token_transfers\`
        WHERE
          token_address = "${PYUSD_CONTRACT_ADDRESS}"
        GROUP BY from_address, week_number
      )
      SELECT
        week_number,
        SUM(tx_count) AS total_tx_count,
        COUNT(DISTINCT from_address) AS unique_wallets
      FROM
        weekly_data
      GROUP BY week_number
      ORDER BY week_number DESC
      LIMIT 10;
    `;
    const rows = await queryBigQuery(query);
    const formattedData = rows.map(row => ({
      week_number: parseInt(row.week_number),
      total_tx_count: parseInt(row.total_tx_count),
      unique_wallets: parseInt(row.unique_wallets),
    }));
    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weekly activity data.' });
  }
});

// 7. Wallet Transaction Count Distribution
router.get('/wallet-tx-distribution', async (req, res) => {
  try {
    const query = `
      WITH wallet_activity AS (
        SELECT
          from_address,
          COUNT(*) AS tx_count
        FROM
          \`bigquery-public-data.crypto_ethereum.token_transfers\`
        WHERE
          token_address = "${PYUSD_CONTRACT_ADDRESS}"
        GROUP BY from_address
      )
      SELECT
        tx_count,
        COUNT(*) AS wallet_count
      FROM
        wallet_activity
      GROUP BY tx_count
      ORDER BY tx_count DESC
      LIMIT 10;
    `;
    const rows = await queryBigQuery(query);
    const formattedData = rows.map(row => ({
      tx_count: parseInt(row.tx_count),
      wallet_count: parseInt(row.wallet_count),
    }));
    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wallet transaction distribution data.' });
  }
});

// 8. Top Exchanges by PYUSD Inflow/Outflow
router.get('/exchange-flow', async (req, res) => {
  try {
    const query = `
      SELECT
        CASE
          WHEN to_address IN (${EXCHANGE_ADDRESSES.map(addr => `'${addr}'`).join(',')}) THEN 'Inflow'
          WHEN from_address IN (${EXCHANGE_ADDRESSES.map(addr => `'${addr}'`).join(',')}) THEN 'Outflow'
        END AS flow_type,
        SUM(CAST(value AS FLOAT64)) / POW(10, 18) AS total_flow_pyusd,
        COUNT(*) AS tx_count
      FROM
        \`bigquery-public-data.crypto_ethereum.token_transfers\`
      WHERE
        token_address = "${PYUSD_CONTRACT_ADDRESS}"
        AND (to_address IN (${EXCHANGE_ADDRESSES.map(addr => `'${addr}'`).join(',')})
             OR from_address IN (${EXCHANGE_ADDRESSES.map(addr => `'${addr}'`).join(',')}))
      GROUP BY flow_type
      ORDER BY total_flow_pyusd DESC;
    `;
    const rows = await queryBigQuery(query);
    const formattedData = rows.map(row => ({
      flow_type: row.flow_type || 'Unknown',
      total_flow_pyusd: parseFloat(row.total_flow_pyusd),
      tx_count: parseInt(row.tx_count),
    }));
    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exchange flow data.' });
  }
});

// 9. Dormant Wallets Analysis
router.get('/dormant-wallets', async (req, res) => {
  try {
    const query = `
      SELECT
        from_address AS wallet,
        SUM(CAST(value AS FLOAT64)) / POW(10, 18) AS total_balance_pyusd,
        MAX(block_timestamp) AS last_activity_time
      FROM
        \`bigquery-public-data.crypto_ethereum.token_transfers\`
      WHERE
        token_address = "${PYUSD_CONTRACT_ADDRESS}"
      GROUP BY from_address
      HAVING DATE_DIFF(CURRENT_DATE(), CAST(MAX(block_timestamp) AS DATE), DAY) > 180
      ORDER BY total_balance_pyusd DESC
      LIMIT 10;
    `;
    const rows = await queryBigQuery(query);
    const formattedData = rows.map(row => ({
      wallet: row.wallet || row.from_address,
      total_balance_pyusd: parseFloat(row.total_balance_pyusd),
      last_activity_time: row.last_activity_time.value || row.last_activity_time,
    }));
    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dormant wallets data.' });
  }
});

// Export the router
module.exports = router;