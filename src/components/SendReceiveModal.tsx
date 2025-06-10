
import React, { useState } from 'react';
import { X, ArrowUp, ArrowDown, Copy, Check, ChevronDown } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface SendReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'send' | 'receive';
  onSubmit: (amount: number, token: string, address?: string) => void;
  tokens: Array<{ symbol: string; balance: number; name: string; icon: string }>;
}

const SendReceiveModal = ({ isOpen, onClose, type, onSubmit, tokens }: SendReceiveModalProps) => {
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('SOL');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTokenDropdown, setShowTokenDropdown] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  // Realistic wallet address
  const myWalletAddress = '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM';

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || (type === 'send' && !address)) return;

    setIsLoading(true);
    
    // Realistic loading time with progress
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    setIsLoading(false);
    setIsSuccess(true);
    
    // Show success animation for a moment
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onSubmit(parseFloat(amount), selectedToken, address);
    
    // Show toast notification
    toast({
      title: type === 'send' ? "Transaction Sent!" : "Payment Received!",
      description: `${amount} ${selectedToken} ${type === 'send' ? 'sent successfully' : 'received successfully'}`,
      duration: 4000,
    });
    
    setAmount('');
    setAddress('');
    setIsSuccess(false);
    onClose();
  };

  const copyAddress = async () => {
    await navigator.clipboard.writeText(myWalletAddress);
    setCopied(true);
    toast({
      title: "Address Copied!",
      description: "Wallet address copied to clipboard",
      duration: 2000,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedTokenData = tokens.find(t => t.symbol === selectedToken);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className={`wallet-card rounded-2xl p-6 w-full max-w-md transition-all duration-300 ${
        isSuccess ? 'scale-105 border-green-500/50' : 'slide-up'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              type === 'send' 
                ? isSuccess ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                : isSuccess ? 'bg-green-500/20 text-green-400' : 'bg-green-500/20 text-green-400'
            }`}>
              {isSuccess ? <Check size={16} /> : (type === 'send' ? <ArrowUp size={16} /> : <ArrowDown size={16} />)}
            </div>
            <h2 className="text-xl font-bold capitalize">
              {isSuccess ? (type === 'send' ? 'Sent!' : 'Received!') : `${type} ${selectedToken}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors hover:scale-110 transform duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {type === 'receive' && (
          <div className="mb-6 animate-fade-in">
            <label className="block text-sm font-medium mb-2">Your {selectedToken} Address</label>
            <div className="bg-muted border border-border rounded-lg p-3 flex items-center justify-between transition-all duration-200 hover:bg-muted/80">
              <span className="text-sm font-mono break-all mr-2">{myWalletAddress}</span>
              <button
                onClick={copyAddress}
                className="p-1 hover:bg-background rounded transition-all duration-200 hover:scale-110 transform"
              >
                {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        )}

        {type === 'send' && !isSuccess && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium mb-2">Token</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowTokenDropdown(!showTokenDropdown)}
                  className="w-full bg-muted border border-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between transition-all duration-200 hover:bg-muted/80"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                      {selectedTokenData?.icon || '●'}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{selectedToken}</div>
                      <div className="text-xs text-muted-foreground">
                        {selectedTokenData?.balance.toFixed(4)} available
                      </div>
                    </div>
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform duration-200 ${showTokenDropdown ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                {showTokenDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-muted border border-border rounded-lg shadow-lg z-10 animate-fade-in">
                    {tokens.map((token, index) => (
                      <button
                        key={token.symbol}
                        type="button"
                        onClick={() => {
                          setSelectedToken(token.symbol);
                          setShowTokenDropdown(false);
                        }}
                        className={`w-full p-3 flex items-center space-x-3 hover:bg-background transition-all duration-200 ${
                          index === 0 ? 'rounded-t-lg' : ''
                        } ${index === tokens.length - 1 ? 'rounded-b-lg' : ''} hover:scale-[1.02] transform`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                          {token.icon}
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-medium">{token.symbol}</div>
                          <div className="text-xs text-muted-foreground">{token.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{token.balance.toFixed(4)}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Amount</label>
              <input
                type="number"
                step="0.000001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={selectedTokenData?.balance}
                className="w-full bg-muted border border-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 focus:scale-[1.01] transform"
                placeholder="0.00"
                required
              />
              {selectedTokenData && (
                <div className="text-sm text-muted-foreground mt-1 animate-fade-in">
                  Available: {selectedTokenData.balance.toFixed(4)} {selectedToken}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">To Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-muted border border-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 focus:scale-[1.01] transform"
                placeholder="Enter wallet address..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !amount || !address}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-all wallet-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover:scale-[1.02] transform duration-200"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full loading-spinner"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <span>Confirm Send</span>
              )}
            </button>
          </form>
        )}

        {isSuccess && (
          <div className="text-center py-8 animate-fade-in">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Check size={32} className="text-green-400" />
            </div>
            <p className="text-lg font-medium text-green-400">
              {type === 'send' ? 'Transaction Sent!' : 'Payment Received!'}
            </p>
            <p className="text-muted-foreground mt-2">
              {amount} {selectedToken} {type === 'send' ? 'sent successfully' : 'received successfully'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendReceiveModal;
