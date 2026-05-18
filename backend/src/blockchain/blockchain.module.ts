import { Module } from '@nestjs/common';
import { WalletService } from './wallet/wallet.service';
import { SolanaWalletService } from './wallet/solana-wallet.service';

@Module({
  providers: [
    {
      provide: WalletService,
      useClass: SolanaWalletService,
    },
  ],
  exports: [WalletService],
})
export class BlockchainModule {}

