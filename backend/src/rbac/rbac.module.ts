import { Module } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [SupabaseModule, UsersModule],
  providers: [RbacService],
  exports: [RbacService],
})
export class RbacModule {}

