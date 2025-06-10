
interface CoinGeckoPrice {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
  };
}

interface CoinGeckoHistoricalData {
  prices: [number, number][];
}

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

const TOKEN_IDS = {
  SOL: 'solana',
  ETH: 'ethereum',
  BTC: 'bitcoin',
  MATIC: 'matic-network',
  USDC: 'usd-coin'
};

export const fetchTokenPrices = async () => {
  try {
    const ids = Object.values(TOKEN_IDS).join(',');
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
    );
    const data: CoinGeckoPrice = await response.json();
    
    return {
      SOL: {
        price: data[TOKEN_IDS.SOL]?.usd || 160,
        priceChange24h: data[TOKEN_IDS.SOL]?.usd_24h_change || 2.5
      },
      ETH: {
        price: data[TOKEN_IDS.ETH]?.usd || 3200,
        priceChange24h: data[TOKEN_IDS.ETH]?.usd_24h_change || -1.2
      },
      BTC: {
        price: data[TOKEN_IDS.BTC]?.usd || 67000,
        priceChange24h: data[TOKEN_IDS.BTC]?.usd_24h_change || 3.8
      },
      MATIC: {
        price: data[TOKEN_IDS.MATIC]?.usd || 0.85,
        priceChange24h: data[TOKEN_IDS.MATIC]?.usd_24h_change || 5.2
      },
      USDC: {
        price: data[TOKEN_IDS.USDC]?.usd || 1.00,
        priceChange24h: data[TOKEN_IDS.USDC]?.usd_24h_change || 0.0
      }
    };
  } catch (error) {
    console.error('Failed to fetch token prices:', error);
    return null;
  }
};

export const fetchTokenChart = async (tokenSymbol: string, days: number = 1) => {
  try {
    const tokenId = TOKEN_IDS[tokenSymbol as keyof typeof TOKEN_IDS];
    if (!tokenId) throw new Error('Token not supported');
    
    const response = await fetch(
      `${COINGECKO_API}/coins/${tokenId}/market_chart?vs_currency=usd&days=${days}`
    );
    const data: CoinGeckoHistoricalData = await response.json();
    
    return data.prices.map(([timestamp, price]) => ({
      time: days === 1 
        ? new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        : new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price,
      timestamp
    }));
  } catch (error) {
    console.error('Failed to fetch chart data:', error);
    return null;
  }
};
