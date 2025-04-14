# PYUSD Analytics Dashboard Backend

This is the backend service for the PYUSD Analytics Dashboard, providing real-time analytics and insights for PYUSD token transactions.

## Features

- Real-time PYUSD token analytics
- Whale transaction monitoring
- Exchange and DeFi integration tracking
- Historical data analysis
- Twitter sentiment analysis
- Caching layer for improved performance
- Rate limiting and security features

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Redis
- PostgreSQL
- Google Cloud account with BigQuery access
- Infura account for Ethereum node access
- Twitter API credentials

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with the following configuration:
   ```env
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/pyusd-analytics
   MONGODB_USER=your_mongodb_user
   MONGODB_PASS=your_mongodb_password

   # Web3 Configuration
   WEB3_PROVIDER_URL=your_infura_url
   PYUSD_CONTRACT_ADDRESS=0x6c3ea9036406852006290770bedfcaba0e23a0e8
   ETHERSCAN_API_KEY=your_etherscan_api_key

   # Google Cloud Configuration
   GOOGLE_CLOUD_PROJECT_ID=your_project_id
   GOOGLE_APPLICATION_CREDENTIALS=path_to_service_account_key.json
   BIGQUERY_DATASET=bigquery-public-data.crypto_ethereum.token_transfers

   # Twitter API Configuration
   TWITTER_API_KEY=your_twitter_api_key
   TWITTER_API_SECRET=your_twitter_api_secret
   TWITTER_ACCESS_TOKEN=your_twitter_access_token
   TWITTER_ACCESS_SECRET=your_twitter_access_secret

   # Cache Configuration
   REDIS_URL=redis://localhost:6379
   CACHE_TTL=300

   # PostgreSQL Configuration
   POSTGRES_USER=your_db_user
   POSTGRES_PASSWORD=your_db_password
   POSTGRES_DB=pyusd_analytics
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Analytics
- `GET /api/analytics/latest` - Get latest analytics data
- `GET /api/analytics/historical` - Get historical analytics data
- `POST /api/analytics/update` - Force update analytics

### Metrics
- `GET /api/metrics/total-supply` - Get current PYUSD total supply
- `GET /api/metrics/daily-volume` - Get daily transaction volume

### Whales
- `GET /api/whales/transactions` - Get whale transactions
- `GET /api/whales/holders` - Get top PYUSD holders

### Adoption
- `GET /api/adoption/stats` - Get adoption statistics
- `GET /api/adoption/trends` - Get adoption trends

### Sentiment
- `GET /api/sentiment/twitter` - Get Twitter sentiment analysis
- `GET /api/sentiment/market` - Get market sentiment indicators

## Architecture

- Express.js for REST API
- MongoDB for transaction and analytics data
- Redis for caching
- PostgreSQL for structured data
- Web3.js for Ethereum blockchain interaction
- BigQuery for large-scale analytics
- Twitter API for sentiment analysis

## Security

- Helmet.js for security headers
- Rate limiting
- CORS configuration
- Input validation with Joi
- Error handling middleware
- Environment variable management

## Caching

The application uses Redis for caching with a default TTL of 5 minutes (300 seconds). Cache can be configured through environment variables.

## Error Handling

Centralized error handling through custom middleware. All errors are logged and appropriate error responses are sent to the client.

## License

ISC
