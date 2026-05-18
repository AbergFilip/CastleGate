import { Module } from '@nestjs/common';
import { SandboxBankService } from './sandbox-bank.service';

@Module({
  providers: [SandboxBankService],
  exports: [SandboxBankService],
})
export class SandboxBankModule {}
