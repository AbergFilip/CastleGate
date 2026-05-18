import { Module } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { InvestmentsController } from './investments.controller';
import { SupabaseModule } from '../../supabase/supabase.module';
import { SandboxBankModule } from '../sandbox-bank/sandbox-bank.module';

@Module({
  imports: [SupabaseModule, SandboxBankModule],
  controllers: [InvestmentsController],
  providers: [InvestmentsService],
  exports: [InvestmentsService],
})
export class InvestmentsModule {}

