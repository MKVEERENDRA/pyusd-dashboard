// Express route handlers for Developer & Analyst Tools
import express from "express";
import { bigqueryClient } from "../utils/bigqueryClient";

const router = express.Router();

// 1. Transaction Explorer: Recent transactions
router.get("/developer/recent-transactions", async (req, res) => {
  const query = `
    SELECT from_address, to_address, value/1e6 as pyusd_value, block_timestamp, hash
    FROM \`ultrasound-pyusd-prod.raw_ethereum.transactions\`
    WHERE to_address IS NOT NULL AND value > 0
    ORDER BY block_timestamp DESC
    LIMIT 100
  `;

  try {
    const [rows] = await bigqueryClient.query({ query });
    res.json(rows);
  } catch (err) {
    console.error("Error fetching recent transactions:", err);
    res.status(500).json({ error: "Failed to fetch recent transactions" });
  }
});

// 2. Gas Fee Simulator: Average gas price by time
router.get("/developer/gas-simulator", async (req, res) => {
  const query = `
    SELECT 
      FORMAT_TIMESTAMP('%Y-%m-%d %H:00:00', block_timestamp) as hour,
      AVG(gas_price) / 1e9 as avg_gwei
    FROM \`ultrasound-pyusd-prod.raw_ethereum.transactions\`
    WHERE block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 DAY)
    GROUP BY hour
    ORDER BY hour DESC
    LIMIT 24
  `;

  try {
    const [rows] = await bigqueryClient.query({ query });
    res.json(rows);
  } catch (err) {
    console.error("Error fetching gas fee simulation:", err);
    res.status(500).json({ error: "Failed to fetch gas data" });
  }
});

// 3. Contract Optimization Leaderboard: Lowest gas contracts
router.get("/developer/optimization-leaderboard", async (req, res) => {
  const query = `
    SELECT 
      from_address as deployer,
      AVG(gas_used) as avg_gas,
      COUNT(*) as tx_count
    FROM \`ultrasound-pyusd-prod.raw_ethereum.transactions\`
    WHERE to_address IS NULL -- Contract deployments
    GROUP BY deployer
    ORDER BY avg_gas ASC
    LIMIT 20
  `;

  try {
    const [rows] = await bigqueryClient.query({ query });
    res.json(rows);
  } catch (err) {
    console.error("Error fetching optimization leaderboard:", err);
    res.status(500).json({ error: "Failed to fetch optimization data" });
  }
});

// 4. Function Call Analyzer: Most called methods by contract
router.get("/developer/function-call-analyzer", async (req, res) => {
  const query = `
    SELECT
      to_address,
      input,
      COUNT(*) as count
    FROM \`ultrasound-pyusd-prod.raw_ethereum.transactions\`
    WHERE input IS NOT NULL AND LENGTH(input) >= 10
    GROUP BY to_address, input
    ORDER BY count DESC
    LIMIT 50
  `;

  try {
    const [rows] = await bigqueryClient.query({ query });
    res.json(rows);
  } catch (err) {
    console.error("Error fetching function call data:", err);
    res.status(500).json({ error: "Failed to fetch function call data" });
  }
});

// 5. Top Deployers: Wallets that deployed most contracts
router.get("/developer/top-deployers", async (req, res) => {
  const query = `
    SELECT from_address, COUNT(*) as contracts_deployed
    FROM \`ultrasound-pyusd-prod.raw_ethereum.transactions\`
    WHERE to_address IS NULL
    GROUP BY from_address
    ORDER BY contracts_deployed DESC
    LIMIT 10
  `;

  try {
    const [rows] = await bigqueryClient.query({ query });
    res.json(rows);
  } catch (err) {
    console.error("Error fetching top deployers:", err);
    res.status(500).json({ error: "Failed to fetch deployer data" });
  }
});

export default router;
