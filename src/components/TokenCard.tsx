
import React from 'react';
import { Token } from '../types/wallet';

interface TokenCardProps {
  token: Token;
  onClick: () => void;
}

const TokenCard = ({ token, onClick }: TokenCardProps) => {
  const formatPrice = (price: number) => {
    if (price < 1) return `$${price.toFixed(4)}`;
    if (price < 100) return `$${price.toFixed(2)}`;
    return `$${price.toLocaleString()}`;
  };

  const formatBalance = (balance: number) => {
    return balance < 1 ? balance.toFixed(6) : balance.toFixed(4);
  };

  const getTokenIcon = (symbol: string) => {
    const icons: { [key: string]: string } = {
      SOL: 'https://i.ibb.co/nNdR4cQt/IMG-1357.png',
      ETH: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      BTC: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
      MATIC: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
      USDC: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
    };
    return icons[symbol];
  };

  const getTokenColor = (symbol: string) => {
    const colors: { [key: string]: string } = {
      SOL: 'from-purple-400 to-blue-500',
      ETH: 'from-blue-400 to-purple-500',
      BTC: 'from-orange-400 to-yellow-500',
      MATIC: 'from-purple-500 to-pink-500',
      USDC: 'from-green-400 to-blue-500'
    };
    return colors[symbol] || 'from-gray-400 to-gray-600';
  };

  const tokenIcon = getTokenIcon(token.symbol);

  return (
    <div 
      onClick={onClick}
      className="wallet-card rounded-xl p-4 hover:bg-muted/50 transition-all cursor-pointer group hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getTokenColor(token.symbol)} flex items-center justify-center text-white font-bold text-sm overflow-hidden`}>
            {tokenIcon ? (
              <img 
                src={tokenIcon} 
                alt={token.symbol} 
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  // Fallback to text if image fails to load
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
            ) : null}
            <span style={{ display: tokenIcon ? 'none' : 'block' }}>
              {token.symbol.charAt(0)}
            </span>
          </div>
          <div>
            <div className="font-semibold">{token.symbol}</div>
            <div className="text-sm text-muted-foreground">{token.name}</div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="font-semibold">{formatBalance(token.balance)} {token.symbol}</div>
          <div className="text-sm text-muted-foreground">
            {formatPrice(token.price)}
          </div>
          <div className={`text-xs font-medium ${token.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenCard;
