import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OidcService } from './oidc.service';
import oidcConfig from '../../config/oidc.config';

@Module({
  imports: [ConfigModule.forFeature(oidcConfig)],
  providers: [OidcService],
  exports: [OidcService],
})
export class OidcModule {}

