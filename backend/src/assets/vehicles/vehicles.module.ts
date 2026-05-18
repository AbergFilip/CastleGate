import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { SupabaseModule } from '../../supabase/supabase.module';
import { SandboxBankModule } from '../../economy/sandbox-bank/sandbox-bank.module';

@Module({
  imports: [SupabaseModule, SandboxBankModule],
  controllers: [VehiclesController],
  providers: [VehiclesService],
  exports: [VehiclesService],
})
export class VehiclesModule {}

