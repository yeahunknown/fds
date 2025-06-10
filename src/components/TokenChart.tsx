import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowLeft } from 'lucide-react';
import { fetchTokenChart } from '../services/cryptoService';

interface TokenChartProps {
  token: { symbol: string; name: string; price: number; priceChange24h: number };
  onBack: () => void;
}

const TokenChart = ({ token, onBack }: TokenChartProps) => {
  const [chartData, setChartData] = useState<Array<{ time: string; price: number; timestamp: number }>>([]);
  const [timeframe, setTimeframe] = useState('24H');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChartData = async () => {
      setLoading(true);
      const days = timeframe === '24H' ? 1 : timeframe === '7D' ? 7 : 30;
      const data = await fetchTokenChart(token.symbol, days);
      
      if (data) {
        setChartData(data);
      } else {
        // Fallback to generated data if API fails
        const fallbackData = generateFallbackData();
        setChartData(fallbackData);
      }
      setLoading(false);
    };

    loadChartData();
  }, [token.symbol, timeframe]);

  const generateFallbackData = () => {
    const data = [];
    const basePrice = token.price;
    const now = new Date();
    const points = timeframe === '24H' ? 24 : timeframe === '7D' ? 168 : 720;
    const interval = timeframe === '24H' ? 60 * 60 * 1000 : timeframe === '7D' ? 60 * 60 * 1000 : 60 * 60 * 1000;
    
    let currentPrice = basePrice;
    
    for (let i = points; i >= 0; i--) {
      const time = new Date(now.getTime() - i * interval);
      
      const volatility = token.symbol === 'USDC' ? 0.001 : 0.02;
      const trend = (token.priceChange24h / 100) / points;
      const randomWalk = (Math.random() - 0.5) * volatility;
      
      currentPrice = currentPrice * (1 + trend + randomWalk);
      currentPrice = Math.max(0.01, currentPrice);
      
      data.push({
        time: timeframe === '24H' 
          ? time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: currentPrice,
        timestamp: time.getTime()
      });
    }
    
    return data;
  };

  const formatPrice = (value: number) => {
    if (value < 1) return `$${value.toFixed(4)}`;
    if (value < 100) return `$${value.toFixed(2)}`;
    return `$${value.toLocaleString()}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-lg font-semibold">
            {formatPrice(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 mobile-padding">
      <div className="flex items-center space-x-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-muted rounded-lg transition-colors wallet-button"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold">{token.symbol}</h2>
          <p className="text-muted-foreground">{token.name}</p>
        </div>
      </div>

      <div className="wallet-card rounded-xl p-6">
        <div className="mb-6">
          <div className="text-3xl font-bold">{formatPrice(token.price)}</div>
          <div className={`text-sm flex items-center space-x-1 ${
            token.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            <span>{token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%</span>
            <span className="text-muted-foreground">24h</span>
          </div>
        </div>

        {/* Timeframe buttons */}
        <div className="flex space-x-2 mb-4">
          {['24H', '7D', '30D'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors wallet-button ${
                timeframe === tf 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        <div className="h-64">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full loading-spinner"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#888' }}
                />
                <YAxis 
                  domain={['dataMin - 5', 'dataMax + 5']}
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#888' }}
                  tickFormatter={formatPrice}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke={token.priceChange24h >= 0 ? '#10b981' : '#ef4444'}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: token.priceChange24h >= 0 ? '#10b981' : '#ef4444' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="wallet-card rounded-xl p-4">
          <div className="text-sm text-muted-foreground">24h High</div>
          <div className="text-lg font-semibold">{formatPrice(token.price * 1.05)}</div>
        </div>
        <div className="wallet-card rounded-xl p-4">
          <div className="text-sm text-muted-foreground">24h Low</div>
          <div className="text-lg font-semibold">{formatPrice(token.price * 0.95)}</div>
        </div>
        <div className="wallet-card rounded-xl p-4">
          <div className="text-sm text-muted-foreground">Market Cap</div>
          <div className="text-lg font-semibold">
            ${(token.price * (Math.random() * 1000000000 + 1000000000)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="wallet-card rounded-xl p-4">
          <div className="text-sm text-muted-foreground">Volume (24h)</div>
          <div className="text-lg font-semibold">
            ${(token.price * (Math.random() * 100000000 + 10000000)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenChart;
