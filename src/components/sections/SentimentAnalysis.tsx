import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const sampleData = {
  sentimentTrend: [
    { time: '00:00', score: 75 },
    { time: '04:00', score: 82 },
    { time: '08:00', score: 78 },
    { time: '12:00', score: 85 },
    { time: '16:00', score: 90 },
    { time: '20:00', score: 88 },
  ],
  sources: [
    { name: 'Twitter', sentiment: 85, volume: 12500 },
    { name: 'Reddit', sentiment: 78, volume: 8200 },
    { name: 'Discord', sentiment: 82, volume: 6300 },
    { name: 'Telegram', sentiment: 80, volume: 5100 },
  ],
  keywords: [
    { word: 'bullish', count: 1250, sentiment: 'positive' },
    { word: 'adoption', count: 980, sentiment: 'positive' },
    { word: 'stable', count: 850, sentiment: 'neutral' },
    { word: 'volatile', count: 420, sentiment: 'negative' },
    { word: 'growth', count: 780, sentiment: 'positive' },
  ],
};

const SentimentCard: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-cyber-black/30 rounded-xl p-6 border border-cyber-purple/20"
  >
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    {children}
  </motion.div>
);

const SentimentBadge: React.FC<{
  score: number;
}> = ({ score }) => {
  let color = 'text-cyber-pink';
  if (score >= 80) color = 'text-cyber-green';
  else if (score >= 60) color = 'text-cyber-yellow';

  return (
    <div className={`text-2xl font-bold ${color}`}>
      {score}%
    </div>
  );
};

const SentimentAnalysis: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Overall Sentiment */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SentimentCard title="Overall Sentiment">
          <div className="flex items-center justify-between">
            <div>
              <SentimentBadge score={85} />
              <div className="text-gray-400 mt-2">Very Bullish</div>
            </div>
            <div className="text-right">
              <div className="text-cyber-green text-sm">+5.2%</div>
              <div className="text-gray-400 text-sm">vs last 24h</div>
            </div>
          </div>
        </SentimentCard>

        <SentimentCard title="Social Volume">
          <div>
            <div className="text-2xl font-bold text-cyber-purple">32.1K</div>
            <div className="text-gray-400 mt-2">Mentions in 24h</div>
            <div className="text-cyber-green text-sm mt-1">+12.5% increase</div>
          </div>
        </SentimentCard>

        <SentimentCard title="Market Confidence">
          <div>
            <div className="text-2xl font-bold text-cyber-blue">High</div>
            <div className="text-gray-400 mt-2">Based on 15 indicators</div>
            <div className="text-cyber-green text-sm mt-1">Strong buy signals</div>
          </div>
        </SentimentCard>
      </div>

      {/* Sentiment Trend */}
      <SentimentCard title="Sentiment Trend">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sampleData.sentimentTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="time" stroke="#ffffff40" />
              <YAxis stroke="#ffffff40" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(13, 13, 15, 0.9)',
                  border: '1px solid rgba(157, 0, 255, 0.2)',
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#9D00FF"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SentimentCard>

      {/* Source Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SentimentCard title="Source Analysis">
          <div className="space-y-4">
            {sampleData.sources.map((source) => (
              <div key={source.name} className="flex items-center justify-between p-3 bg-cyber-black/50 rounded-lg">
                <div>
                  <div className="font-semibold">{source.name}</div>
                  <div className="text-sm text-gray-400">{source.volume.toLocaleString()} mentions</div>
                </div>
                <SentimentBadge score={source.sentiment} />
              </div>
            ))}
          </div>
        </SentimentCard>

        {/* Trending Keywords */}
        <SentimentCard title="Trending Keywords">
          <div className="space-y-4">
            {sampleData.keywords.map((keyword) => (
              <div key={keyword.word} className="flex items-center justify-between p-3 bg-cyber-black/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    keyword.sentiment === 'positive' ? 'bg-cyber-green' :
                    keyword.sentiment === 'negative' ? 'bg-cyber-pink' :
                    'bg-cyber-yellow'
                  }`} />
                  <div>
                    <div className="font-semibold">#{keyword.word}</div>
                    <div className="text-sm text-gray-400">{keyword.count} mentions</div>
                  </div>
                </div>
                <div className={`text-sm ${
                  keyword.sentiment === 'positive' ? 'text-cyber-green' :
                  keyword.sentiment === 'negative' ? 'text-cyber-pink' :
                  'text-cyber-yellow'
                }`}>
                  {keyword.sentiment}
                </div>
              </div>
            ))}
          </div>
        </SentimentCard>
      </div>

      {/* AI Predictions */}
      <SentimentCard title="AI Market Predictions">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-cyber-black/50 p-4 rounded-lg">
            <div className="text-cyber-blue mb-2">Short Term (24h)</div>
            <div className="text-2xl font-bold">Bullish</div>
            <div className="text-sm text-gray-400 mt-1">85% confidence</div>
          </div>
          <div className="bg-cyber-black/50 p-4 rounded-lg">
            <div className="text-cyber-purple mb-2">Medium Term (7d)</div>
            <div className="text-2xl font-bold">Very Bullish</div>
            <div className="text-sm text-gray-400 mt-1">78% confidence</div>
          </div>
          <div className="bg-cyber-black/50 p-4 rounded-lg">
            <div className="text-cyber-pink mb-2">Long Term (30d)</div>
            <div className="text-2xl font-bold">Bullish</div>
            <div className="text-sm text-gray-400 mt-1">72% confidence</div>
          </div>
        </div>
      </SentimentCard>
    </div>
  );
};

export default SentimentAnalysis;
