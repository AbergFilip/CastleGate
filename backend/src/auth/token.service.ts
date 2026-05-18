import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { KeyVaultService } from '../secrets/keyvault.service';

export interface AccessTokenPayload {
  sub: string;
  email?: string;
  name?: string;
  roles?: string[];
  user_type?: string;
  [key: string]: any;
}

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  private accessTokenSecret: string | null = null;
  private accessTokenSecretLoaded = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly keyVaultService: KeyVaultService
  ) {}

  private async getAccessTokenSecret(): Promise<string> {
    if (this.accessTokenSecretLoaded) {
      return this.accessTokenSecret || '';
    }

    const secret =
      (await this.keyVaultService.getSecret('ACCESS_TOKEN_SECRET')) ||
      this.configService.get<string>('ACCESS_TOKEN_SECRET') ||
      this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET') ||
      this.configService.get<string>('JWT_SECRET');

    this.accessTokenSecret = secret || null;
    this.accessTokenSecretLoaded = true;

    if (!this.accessTokenSecret) {
      this.logger.error(
        'ACCESS_TOKEN_SECRET saknas. Lägg till i Key Vault eller .env'
      );
      throw new Error('ACCESS_TOKEN_SECRET is not configured');
    }

    return this.accessTokenSecret;
  }

  private getAccessTokenTtl(): string {
    const ttlMinutes = Number(
      this.configService.get<string>('ACCESS_TOKEN_TTL_MINUTES') || '15'
    );
    const safeMinutes = Number.isFinite(ttlMinutes) && ttlMinutes > 0 ? ttlMinutes : 15;
    return `${safeMinutes}m`;
  }

  async signAccessToken(payload: AccessTokenPayload): Promise<string> {
    const secret: Secret = await this.getAccessTokenSecret();
    const options: SignOptions = {
      algorithm: 'HS256',
      expiresIn: this.getAccessTokenTtl() as SignOptions['expiresIn'],
    };
    return jwt.sign(payload, secret, options);
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    const secret: Secret = await this.getAccessTokenSecret();
    return jwt.verify(token, secret) as AccessTokenPayload;
  }
}
