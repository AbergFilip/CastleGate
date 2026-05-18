import { Module } from '@nestjs/common';
import { IceContactsService } from './ice-contacts.service';
import { IceContactsController } from './ice-contacts.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [IceContactsController],
  providers: [IceContactsService],
  exports: [IceContactsService],
})
export class IceContactsModule {}
