import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes, createHash } from 'crypto';
import { DatabaseService } from '../database/database.service';
import { KeyVaultService } from '../secrets/keyvault.service';
import { TokenService } from './token.service';

interface RefreshTokenRecord {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: string;
  revoked_at?: string | null;
}

@Injectable()
export class RefreshTokenService {
  private readonly logger = new Logger(RefreshTokenService.name);
  private refreshTokenPepper: string | null = null;
  private refreshTokenPepperLoaded = false;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
    private readonly keyVaultService: KeyVaultService,
    private readonly tokenService: TokenService
  ) {}

  private async getRefreshTokenPepper(): Promise<string> {
    if (this.refreshTokenPepperLoaded) {
      return this.refreshTokenPepper || '';
    }

    const pepper =
      (await this.keyVaultService.getSecret('REFRESH_TOKEN_PEPPER')) ||
      this.configService.get<string>('REFRESH_TOKEN_PEPPER');

    this.refreshTokenPepper = pepper || null;
    this.refreshTokenPepperLoaded = true;

    if (!this.refreshTokenPepper) {
      this.logger.error(
        'REFRESH_TOKEN_PEPPER saknas. Lägg till i Key Vault eller .env'
      );
      throw new Error('REFRESH_TOKEN_PEPPER is not configured');
    }

    return this.refreshTokenPepper;
  }

  private getRefreshTokenTtlDays(): number {
    const ttlDays = Number(
      this.configService.get<string>('REFRESH_TOKEN_TTL_DAYS') || '30'
    );
    return Number.isFinite(ttlDays) && ttlDays > 0 ? ttlDays : 30;
  }

  private generateRefreshToken(): string {
    return randomBytes(64).toString('base64url');
  }

  private async hashRefreshToken(token: string): Promise<string> {
    const pepper = await this.getRefreshTokenPepper();
    return createHash('sha256')
      .update(`${pepper}:${token}`)
      .digest('hex');
  }

  private buildDeviceInfo(userAgent?: string | string[] | undefined) {
    if (!userAgent) {
      return null;
    }
    return {
      userAgent: Array.isArray(userAgent) ? userAgent.join('; ') : userAgent,
    };
  }

  async issueTokens(params: {
    userId: string;
    email?: string;
    name?: string;
    roles?: string[];
    userType?: string;
    ipAddress?: string | null;
    userAgent?: string | string[] | undefined;
  }) {
    const refreshToken = this.generateRefreshToken();
    const refreshTokenHash = await this.hashRefreshToken(refreshToken);
    const refreshTokenTtlDays = this.getRefreshTokenTtlDays();
    const refreshTokenExpiresAt = new Date(
      Date.now() + refreshTokenTtlDays * 24 * 60 * 60 * 1000
    );

    await this.databaseService.query(
      `INSERT INTO public.refresh_tokens
        (user_id, token_hash, expires_at, device_info, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        params.userId,
        refreshTokenHash,
        refreshTokenExpiresAt.toISOString(),
        this.buildDeviceInfo(params.userAgent),
        params.ipAddress || null,
      ]
    );

    const accessToken = await this.tokenService.signAccessToken({
      sub: params.userId,
      email: params.email,
      name: params.name,
      roles: params.roles,
      user_type: params.userType,
    });

    return {
      accessToken,
      refreshToken,
      refreshTokenExpiresAt: refreshTokenExpiresAt.toISOString(),
    };
  }

  async refreshTokens(params: {
    refreshToken: string;
    ipAddress?: string | null;
    userAgent?: string | string[] | undefined;
  }) {
    const refreshTokenHash = await this.hashRefreshToken(params.refreshToken);

    const refreshTokenResult = await this.databaseService.query<RefreshTokenRecord>(
      `SELECT id, user_id, token_hash, expires_at, revoked_at
       FROM public.refresh_tokens
       WHERE token_hash = $1
       LIMIT 1`,
      [refreshTokenHash]
    );

    const storedToken = refreshTokenResult.rows[0];
    if (!storedToken) {
      throw new UnauthorizedException('Ogiltig refresh token');
    }

    if (storedToken.revoked_at) {
      throw new UnauthorizedException('Refresh token är ogiltig');
    }

    const now = new Date();
    const expiresAt = new Date(storedToken.expires_at);
    if (expiresAt <= now) {
      throw new UnauthorizedException('Refresh token har gått ut');
    }

    // Rotate: revoke old token and issue a new one
    await this.databaseService.query(
      `UPDATE public.refresh_tokens
       SET revoked_at = NOW(), updated_at = NOW()
       WHERE id = $1`,
      [storedToken.id]
    );

    return this.issueTokens({
      userId: storedToken.user_id,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    });
  }

  async revokeToken(params: { userId: string; refreshToken: string }) {
    const refreshTokenHash = await this.hashRefreshToken(params.refreshToken);
    await this.databaseService.query(
      `UPDATE public.refresh_tokens
       SET revoked_at = NOW(), updated_at = NOW()
       WHERE user_id = $1 AND token_hash = $2 AND revoked_at IS NULL`,
      [params.userId, refreshTokenHash]
    );
  }

  async revokeAllTokens(userId: string) {
    await this.databaseService.query(
      `UPDATE public.refresh_tokens
       SET revoked_at = NOW(), updated_at = NOW()
       WHERE user_id = $1 AND revoked_at IS NULL`,
      [userId]
    );
  }
}
