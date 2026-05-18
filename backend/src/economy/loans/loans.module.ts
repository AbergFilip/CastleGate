import { Module } from '@nestjs/common';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { SupabaseModule } from '../../supabase/supabase.module';
import { SandboxBankModule } from '../sandbox-bank/sandbox-bank.module';

@Module({
  imports: [SupabaseModule, SandboxBankModule],
  controllers: [LoansController],
  providers: [LoansService],
  exports: [LoansService],
})
export class LoansModule {}
