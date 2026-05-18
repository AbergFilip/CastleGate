import { Module } from '@nestjs/common';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { SupabaseModule } from '../../supabase/supabase.module';
import { RbacModule } from '../../rbac/rbac.module';

@Module({
  imports: [SupabaseModule, RbacModule],
  controllers: [OffersController],
  providers: [OffersService],
  exports: [OffersService],
})
export class OffersModule {}

