import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Copy, Check } from 'lucide-react';
import { Transaction } from '../types/wallet';

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList = ({ transactions }: TransactionListProps) => {
  const [copiedTx, setCopiedTx] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleCopy = async (txId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const txHashes = [
      '5oJQ1mZuBEqzBfVdWJxCWkbo6ScVR5ALrgMDnMfs9KyMXC7Q7E1JWRCvTC6wZ8hHUbL7VfCqa7nWJzN2XNwCemR6',
      '3VtY2DqNH86xqSHZ3X6vTgNqMfYrpVjRYiFeaJCTH3xrbABxTmg6BrRMCa4rFhwMZfdfZuWdQDEZsszUSo3tM91X'
    ];
    const randomTxHash = txHashes[Math.floor(Math.random() * txHashes.length)];
    await navigator.clipboard.writeText(randomTxHash);
    setCopiedTx(txId);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  const generateRandomTxHash = () => {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < 64; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const openSolscan = (tx: Transaction) => {
    const txHash = generateRandomTxHash();
    const searchUrl = `https://solscan.io/tx/${txHash}?cluster=mainnet`;
    window.open(searchUrl, '_blank');
  };

  return (
    <div className="space-y-3">
      {transactions.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          No transactions yet
        </div>
      ) : (
        transactions.map((tx) => (
          <div 
            key={tx.id} 
            className="wallet-card rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer group"
            onClick={() => openSolscan(tx)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  tx.type === 'send' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                }`}>
                  {tx.type === 'send' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                </div>
                <div>
                  <div className="font-medium capitalize flex items-center space-x-1">
                    <span>{tx.type} {tx.token}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{formatDate(tx.timestamp)}</div>
                  {tx.type === 'send' && tx.to && (
                    <div className="text-xs text-muted-foreground">
                      To: {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                    </div>
                  )}
                  {tx.type === 'receive' && tx.from && (
                    <div className="text-xs text-muted-foreground">
                      From: {tx.from}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-right flex items-center space-x-3">
                <div>
                  <div className={`font-semibold ${
                    tx.type === 'send' ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {tx.type === 'send' ? '-' : '+'}{tx.amount.toFixed(4)} {tx.token}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    tx.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {tx.status}
                  </div>
                </div>
                
                <button
                  onClick={(e) => handleCopy(tx.id, e)}
                  className="p-2 hover:bg-muted/50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  {copiedTx === tx.id ? (
                    <Check size={16} className="text-green-400" />
                  ) : (
                    <Copy size={16} className="text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TransactionList;
