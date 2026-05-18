import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { DatabaseModule } from '../database/database.module';
import { OidcModule } from './oidc/oidc.module';
import { RefreshTokenService } from './refresh-token.service';
import { TokenService } from './token.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [SupabaseModule, DatabaseModule, OidcModule],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenService, TokenService, JwtAuthGuard],
  exports: [AuthService, OidcModule, RefreshTokenService, TokenService, JwtAuthGuard],
})
export class AuthModule {}

