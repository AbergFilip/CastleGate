import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { SupabaseModule } from '../../supabase/supabase.module';
import { LantmaterietModule } from '../../lantmateriet/lantmateriet.module';
import { SandboxBankModule } from '../../economy/sandbox-bank/sandbox-bank.module';

@Module({
  imports: [SupabaseModule, LantmaterietModule, SandboxBankModule],
  controllers: [PropertiesController],
  providers: [PropertiesService],
  exports: [PropertiesService],
})
export class PropertiesModule {}

