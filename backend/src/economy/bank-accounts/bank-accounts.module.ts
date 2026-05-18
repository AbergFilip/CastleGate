import { Module } from '@nestjs/common';
import { BankAccountsService } from './bank-accounts.service';
import { BankAccountsController } from './bank-accounts.controller';
import { SupabaseModule } from '../../supabase/supabase.module';
import { TinkModule } from '../tink/tink.module';
import { GoCardlessModule } from '../gocardless/gocardless.module';
import { SandboxBankModule } from '../sandbox-bank/sandbox-bank.module';

@Module({
  imports: [SupabaseModule, TinkModule, GoCardlessModule, SandboxBankModule],
  controllers: [BankAccountsController],
  providers: [BankAccountsService],
  exports: [BankAccountsService],
})
export class BankAccountsModule {}

