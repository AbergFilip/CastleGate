import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OidcService } from '../oidc/oidc.service';

/**
 * Mobile Authentication Strategy
 * Placeholder for mobile-specific authentication flows
 * Can be extended for mobile app token validation, biometric auth, etc.
 */
@Injectable()
export class MobileAuthStrategy {
  constructor(
    private configService: ConfigService,
    private oidcService: OidcService
  ) {
    // Placeholder for mobile authentication implementation
  }

  /**
   * Validate mobile token
   */
  async validateMobileToken(token: string): Promise<any> {
    // For now, fallback to OIDC or JWT validation
    if (this.oidcService.isEnabled()) {
      return await this.oidcService.verifyToken(token);
    }
    // Otherwise handled by JwtAuthGuard
    return null;
  }
}

