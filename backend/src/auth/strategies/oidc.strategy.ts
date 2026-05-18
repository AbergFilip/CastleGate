import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OidcService } from '../oidc/oidc.service';

/**
 * OIDC Strategy for Passport
 * This can be used if implementing full OIDC flow with Keycloak
 * For Azure AD B2C, token validation is handled directly in OidcService
 * 
 * Note: This is a placeholder. Full OIDC flow implementation would require
 * passport-oidc or similar strategy. Currently, we use token validation
 * directly in OidcService.
 */
@Injectable()
export class OidcStrategy {
  constructor(
    private configService: ConfigService,
    private oidcService: OidcService
  ) {
    // Placeholder for future full OIDC flow implementation
    // Currently, token validation is handled in OidcService
  }
}

