import { Module } from '@nestjs/common';
import { MigrationService } from './migration.service';
import { MigrationController } from './migration.controller';
import { DatabaseModule } from '../database.module';
import { OidcModule } from '../../auth/oidc/oidc.module';
import { SupabaseModule } from '../../supabase/supabase.module';
import { RbacModule } from '../../rbac/rbac.module';
import { TokenService } from '../../auth/token.service';

@Module({
  imports: [DatabaseModule, SupabaseModule, OidcModule, RbacModule],
  controllers: [MigrationController],
  providers: [MigrationService, TokenService],
  exports: [MigrationService],
})
export class MigrationModule {}
