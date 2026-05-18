export interface Wallet {
  id: string;
  user_id: string;
  address: string;
  network: string; // 'solana', 'ethereum', etc.
  balance: number;
  created_at: Date;
  updated_at: Date;
}

