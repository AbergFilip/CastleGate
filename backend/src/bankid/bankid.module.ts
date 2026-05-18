import { Module } from '@nestjs/common';
import { BankidService } from './bankid.service';
import { BankidController } from './bankid.controller';
import { QrGeneratorService } from './qr-generator.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [SupabaseModule, AuthModule],
  controllers: [BankidController],
  providers: [BankidService, QrGeneratorService],
  exports: [BankidService],
})
export class BankidModule {}

