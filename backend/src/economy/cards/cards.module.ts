import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { SupabaseModule } from '../../supabase/supabase.module';
import { SandboxBankModule } from '../sandbox-bank/sandbox-bank.module';

@Module({
  imports: [SupabaseModule, SandboxBankModule],
  controllers: [CardsController],
  providers: [CardsService],
  exports: [CardsService],
})
export class CardsModule {}

