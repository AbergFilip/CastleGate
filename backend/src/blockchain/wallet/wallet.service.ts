import { Injectable } from '@nestjs/common';

export interface WalletInfo {
  address: string;
  balance: number;
  network: string;
}

@Injectable()
export abstract class WalletService {
  abstract createWallet(userId: string): Promise<WalletInfo>;
  abstract getWallet(userId: string): Promise<WalletInfo | null>;
  abstract getBalance(address: string): Promise<number>;
}

