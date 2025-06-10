import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Eye, EyeOff, Lock, Unlock } from 'lucide-react';
import ChronosLogo from '../components/ChronosLogo';
import WalletHeader from '../components/WalletHeader';
import TokenCard from '../components/TokenCard';
import TransactionList from '../components/TransactionList';
import SendReceiveModal from '../components/SendReceiveModal';
import TokenChart from '../components/TokenChart';
import { Toaster } from '../components/ui/toaster';
import { Token, Transaction, WalletState } from '../types/wallet';
import { fetchTokenPrices } from '../services/cryptoService';

const Index = () => {
  const [currentView, setCurrentView] = useState('home');
  const [showModal, setShowModal] = useState<'send' | 'receive' | null>(null);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [walletState, setWalletState] = useState<WalletState>({
    isLocked: false,
    username: 'CryptoTrader47',
    tokens: [
      { symbol: 'SOL', name: 'Solana', balance: 3, price: 160, priceChange24h: 2.5, icon: '◉' },
      { symbol: 'ETH', name: 'Ethereum', balance: 0.5, price: 3200, priceChange24h: -1.2, icon: '♦' },
      { symbol: 'BTC', name: 'Bitcoin', balance: 0.01, price: 67000, priceChange24h: 3.8, icon: '₿' },
      { symbol: 'MATIC', name: 'Polygon', balance: 100, price: 0.85, priceChange24h: 5.2, icon: '▲' },
      { symbol: 'USDC', name: 'USD Coin', balance: 1000, price: 1.00, priceChange24h: 0.0, icon: '$' },
    ],
    transactions: [],
    totalNetWorth: 0
  });
  const [password, setPassword] = useState('');

  // Fetch real price data on component mount
  useEffect(() => {
    const loadPrices = async () => {
      console.log('Fetching real token prices...');
      const prices = await fetchTokenPrices();
      if (prices) {
        setWalletState(prev => ({
          ...prev,
          tokens: prev.tokens.map(token => ({
            ...token,
            price: prices[token.symbol as keyof typeof prices]?.price || token.price,
            priceChange24h: prices[token.symbol as keyof typeof prices]?.priceChange24h || token.priceChange24h
          }))
        }));
        console.log('Updated with real prices:', prices);
      }
    };

    loadPrices();
  }, []);

  // Calculate total net worth
  useEffect(() => {
    const netWorth = walletState.tokens.reduce((total, token) => {
      return total + (token.balance * token.price);
    }, 0);
    setWalletState(prev => ({ ...prev, totalNetWorth: netWorth }));
  }, [walletState.tokens]);

  // Update prices every 30 seconds with real data
  useEffect(() => {
    const interval = setInterval(async () => {
      console.log('Updating prices...');
      const prices = await fetchTokenPrices();
      if (prices) {
        setWalletState(prev => ({
          ...prev,
          tokens: prev.tokens.map(token => ({
            ...token,
            price: prices[token.symbol as keyof typeof prices]?.price || token.price,
            priceChange24h: prices[token.symbol as keyof typeof prices]?.priceChange24h || token.priceChange24h
          }))
        }));
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      console.log('Key pressed:', e.key, 'Code:', e.code, 'Wallet locked:', walletState.isLocked);
      
      if ((e.key === 'ArrowUp' || e.key === '^' || (e.shiftKey && e.key === '6')) && !walletState.isLocked) {
        // Add $11829 worth of SOL
        const solToken = walletState.tokens.find(t => t.symbol === 'SOL');
        console.log('SOL token found:', solToken);
        if (solToken) {
          const amountToAdd = 11829 / solToken.price;
          console.log('Adding SOL amount:', amountToAdd, 'Price:', solToken.price);
          handleTransaction(amountToAdd, 'SOL', 'receive');
          console.log(`Added $11829 worth of SOL (${amountToAdd.toFixed(4)} SOL)`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [walletState.isLocked, walletState.tokens]);

  const handleTransaction = (amount: number, tokenSymbol: string, type: 'send' | 'receive', address?: string) => {
    const transaction: Transaction = {
      id: Date.now().toString(),
      type,
      token: tokenSymbol,
      amount,
      timestamp: new Date(),
      status: 'completed',
      to: type === 'send' ? address : undefined,
      from: type === 'receive' ? 'External Wallet' : undefined
    };

    setWalletState(prev => ({
      ...prev,
      tokens: prev.tokens.map(token => {
        if (token.symbol === tokenSymbol) {
          const newBalance = type === 'send' 
            ? Math.max(0, token.balance - amount)
            : token.balance + amount;
          return { ...token, balance: newBalance };
        }
        return token;
      }),
      transactions: [transaction, ...prev.transactions]
    }));
  };

  const handleLockWallet = () => {
    if (walletState.isLocked) {
      if (password === '1234') {
        setWalletState(prev => ({ ...prev, isLocked: false }));
        setPassword('');
      } else {
        alert('Incorrect password');
      }
    } else {
      setWalletState(prev => ({ ...prev, isLocked: true }));
    }
  };

  if (walletState.isLocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="wallet-card rounded-2xl p-8 w-full max-w-md text-center">
          <ChronosLogo size={80} className="mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-2 text-white">Chronos</h1>
          <p className="text-muted-foreground mb-6">Enter your password to unlock</p>
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-muted border border-border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleLockWallet()}
          />
          
          <button
            onClick={handleLockWallet}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 wallet-button"
          >
            <Unlock size={20} />
            <span>Unlock Wallet</span>
          </button>
        </div>
      </div>
    );
  }

  if (selectedToken) {
    return (
      <div className="min-h-screen bg-background">
        <WalletHeader 
          currentView={currentView} 
          onViewChange={setCurrentView}
          isLocked={walletState.isLocked}
          username={walletState.username}
        />
        <div className="p-4">
          <TokenChart 
            token={selectedToken} 
            onBack={() => setSelectedToken(null)} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <WalletHeader 
        currentView={currentView} 
        onViewChange={setCurrentView}
        isLocked={walletState.isLocked}
        username={walletState.username}
      />

      <div className="p-4 space-y-6 mobile-padding">
        {currentView === 'home' && (
          <>
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-border rounded-2xl p-6 wallet-card">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground">Total Balance</span>
                <button
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {balanceVisible ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="text-3xl font-bold">
                  {balanceVisible ? `$${walletState.totalNetWorth.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '••••••'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={() => setShowModal('send')}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 wallet-button shadow-lg drop-shadow-md"
                >
                  <ArrowUp size={20} />
                  <span>Send</span>
                </button>
                <button
                  onClick={() => setShowModal('receive')}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 wallet-button shadow-lg drop-shadow-md"
                >
                  <ArrowDown size={20} />
                  <span>Receive</span>
                </button>
              </div>
            </div>

            {/* Tokens */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Assets</h2>
              <div className="space-y-3">
                {walletState.tokens.map(token => (
                  <TokenCard
                    key={token.symbol}
                    token={token}
                    onClick={() => setSelectedToken(token)}
                  />
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <TransactionList transactions={walletState.transactions.slice(0, 5)} />
            </div>
          </>
        )}

        {currentView === 'profile' && (
          <div className="space-y-6">
            <div className="wallet-card rounded-2xl p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {walletState.username.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{walletState.username}</h2>
                  <p className="text-muted-foreground">Chronos User</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="text-sm text-muted-foreground">Net Worth</div>
                  <div className="text-xl font-bold">${walletState.totalNetWorth.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                </div>
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="text-sm text-muted-foreground">Tokens</div>
                  <div className="text-xl font-bold">{walletState.tokens.length}</div>
                </div>
              </div>
            </div>

            <div className="wallet-card rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Portfolio Breakdown</h3>
              <div className="space-y-3">
                {walletState.tokens.map(token => {
                  const value = token.balance * token.price;
                  const percentage = (value / walletState.totalNetWorth) * 100;
                  return (
                    <div key={token.symbol} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                          {token.symbol.charAt(0)}
                        </div>
                        <span className="font-medium">{token.symbol}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{percentage.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {currentView === 'settings' && (
          <div className="space-y-6">
            <div className="wallet-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Security</h2>
              
              <button
                onClick={handleLockWallet}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 wallet-button"
              >
                <Lock size={20} />
                <span>Lock Wallet</span>
              </button>
              
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Password: 1234 (for demo)
              </p>
            </div>

            <div className="wallet-card rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Show Balance</span>
                  <button
                    onClick={() => setBalanceVisible(!balanceVisible)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      balanceVisible ? 'bg-blue-500' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      balanceVisible ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            <div className="wallet-card rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">All Transactions</h3>
              <div className="max-h-64 overflow-y-auto">
                <TransactionList transactions={walletState.transactions} />
              </div>
            </div>
          </div>
        )}
      </div>

      <SendReceiveModal
        isOpen={showModal !== null}
        onClose={() => setShowModal(null)}
        type={showModal || 'send'}
        onSubmit={(amount, token, address) => {
          handleTransaction(amount, token, showModal!, address);
          setShowModal(null);
        }}
        tokens={walletState.tokens}
      />
      
      <Toaster />
    </div>
  );
};

export default Index;
