
export interface Token {
  symbol: string;
  name: string;
  balance: number;
  price: number;
  priceChange24h: number;
  icon: string;
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive';
  token: string;
  amount: number;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
  hash?: string;
  to?: string;
  from?: string;
}

export interface WalletState {
  isLocked: boolean;
  username: string;
  tokens: Token[];
  transactions: Transaction[];
  totalNetWorth: number;
}
