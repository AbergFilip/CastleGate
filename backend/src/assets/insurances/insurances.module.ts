import { Module } from '@nestjs/common';
import { InsurancesService } from './insurances.service';
import { InsurancesController } from './insurances.controller';
import { SupabaseModule } from '../../supabase/supabase.module';
import { SandboxBankModule } from '../../economy/sandbox-bank/sandbox-bank.module';

@Module({
  imports: [SupabaseModule, SandboxBankModule],
  controllers: [InsurancesController],
  providers: [InsurancesService],
  exports: [InsurancesService],
})
export class InsurancesModule {}

