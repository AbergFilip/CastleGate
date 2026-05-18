import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwksClient from 'jwks-rsa';
import jwt, { VerifyOptions } from 'jsonwebtoken';
import axios from 'axios';

interface OidcConfig {
  enabled: boolean;
  provider: string;
  azureAdB2C: {
    tenantId?: string;
    clientId?: string;
    clientSecret?: string;
    policy?: string;
    authority?: string;
    issuer?: string;
  };
  auth0: {
    domain?: string;
    clientId?: string;
    audience?: string;
    jwksUri?: string;
  };
  keycloak: {
    realm?: string;
    clientId?: string;
    clientSecret?: string;
    serverUrl?: string;
  };
  jwksUri?: string;
  issuer?: string;
}

interface TokenPayload {
  sub: string;
  email?: string;
  name?: string;
  preferred_username?: string;
  roles?: string[];
  user_type?: 'B2B' | 'B2C';
  [key: string]: any;
}

@Injectable()
export class OidcService {
  private readonly logger = new Logger(OidcService.name);
  private jwksClient: ReturnType<typeof jwksClient> | null = null;
  private config: OidcConfig;

  constructor(private configService: ConfigService) {
    this.config = this.configService.get<OidcConfig>('oidc') || {
      enabled: false,
      provider: 'azure-ad-b2c',
      azureAdB2C: {},
      auth0: {},
      keycloak: {},
    };

    if (this.config.enabled) {
      // Derive JWKS URI for common providers if not explicitly set
      if (!this.config.jwksUri) {
        if (this.config.provider === 'auth0' && this.config.auth0?.domain) {
          this.config.jwksUri = `https://${this.config.auth0.domain}/.well-known/jwks.json`;
        }
      }
    }

    if (this.config.enabled && this.config.jwksUri) {
      this.initializeJwksClient();
    }
  }

  private initializeJwksClient() {
    if (!this.config.jwksUri) {
      this.logger.warn('JWKS URI not configured, OIDC token validation will be limited');
      return;
    }

    this.jwksClient = jwksClient({
      jwksUri: this.config.jwksUri,
      cache: true,
      cacheMaxAge: 86400000, // 24 hours
      rateLimit: true,
      jwksRequestsPerMinute: 10,
    });

    this.logger.log('JWKS client initialized');
  }

  /**
   * Get signing key for token verification
   */
  private async getSigningKey(kid: string): Promise<string> {
    if (!this.jwksClient) {
      throw new UnauthorizedException('JWKS client not initialized');
    }

    try {
      const key = await this.jwksClient.getSigningKey(kid);
      return key.getPublicKey();
    } catch (error) {
      this.logger.error(`Failed to get signing key: ${error instanceof Error ? error.message : String(error)}`);
      throw new UnauthorizedException('Invalid token signing key');
    }
  }

  /**
   * Verify and decode OIDC token
   */
  async verifyToken(token: string): Promise<TokenPayload> {
    if (!this.config.enabled) {
      throw new UnauthorizedException('OIDC is not enabled');
    }

    try {
      // Decode token header to get kid
      const decoded = jwt.decode(token, { complete: true });
      if (!decoded || typeof decoded === 'string') {
        throw new UnauthorizedException('Invalid token format');
      }

      const kid = decoded.header.kid;
      if (!kid) {
        throw new UnauthorizedException('Token missing key ID');
      }

      // Get signing key
      const publicKey = await this.getSigningKey(kid);

      // Verify token
      const issuer = this.getIssuer();
      const audience = this.getAudience();

      const verifyOptions: VerifyOptions = {
        issuer,
        algorithms: ['RS256'],
      };

      if (audience) {
        verifyOptions.audience = Array.isArray(audience) ? audience[0] : audience;
      }

      const payload = jwt.verify(token, publicKey, verifyOptions) as TokenPayload;

      this.logger.debug(`Token verified for user: ${payload.sub}`);

      return payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      this.logger.error(`Token verification failed: ${error instanceof Error ? error.message : String(error)}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * Get user info from OIDC provider
   */
  async getUserInfo(accessToken: string): Promise<any> {
    if (!this.config.enabled) {
      throw new UnauthorizedException('OIDC is not enabled');
    }

    try {
      const userInfoEndpoint = this.getUserInfoEndpoint();
      if (!userInfoEndpoint) {
        throw new UnauthorizedException('UserInfo endpoint not configured');
      }

      const response = await axios.get(userInfoEndpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get user info: ${error instanceof Error ? error.message : String(error)}`);
      throw new UnauthorizedException('Failed to retrieve user information');
    }
  }

  /**
   * Get issuer based on provider
   */
  private getIssuer(): string {
    if (this.config.issuer) {
      return this.config.issuer;
    }

    if (this.config.provider === 'auth0') {
      const domain = this.config.auth0.domain;
      if (domain) {
        return `https://${domain}/`;
      }
    }

    if (this.config.provider === 'azure-ad-b2c') {
      const tenantId = this.config.azureAdB2C.tenantId;
      const policy = this.config.azureAdB2C.policy;
      if (tenantId && policy) {
        return `https://${tenantId}.b2clogin.com/${tenantId}/${policy}/v2.0`;
      }
      if (this.config.azureAdB2C.issuer) {
        return this.config.azureAdB2C.issuer;
      }
    }

    if (this.config.provider === 'keycloak') {
      const serverUrl = this.config.keycloak.serverUrl;
      const realm = this.config.keycloak.realm;
      if (serverUrl && realm) {
        return `${serverUrl}/realms/${realm}`;
      }
    }

    throw new Error('OIDC issuer not configured');
  }

  /**
   * Get audience (client ID)
   */
  private getAudience(): string | string[] | undefined {
    if (this.config.provider === 'auth0') {
      return this.config.auth0.audience || this.config.auth0.clientId;
    }

    if (this.config.provider === 'azure-ad-b2c') {
      return this.config.azureAdB2C.clientId;
    }

    if (this.config.provider === 'keycloak') {
      return this.config.keycloak.clientId;
    }

    return undefined;
  }

  /**
   * Get UserInfo endpoint
   */
  private getUserInfoEndpoint(): string | null {
    const issuer = this.getIssuer();
    // Normalize trailing slash to avoid double slashes
    const normalizedIssuer = issuer.endsWith('/')
      ? issuer.slice(0, -1)
      : issuer;
    return `${normalizedIssuer}/userinfo`;
  }

  /**
   * Check if OIDC is enabled
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Get provider type
   */
  getProvider(): string {
    return this.config.provider;
  }
}

