import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SupabaseService } from '../../supabase/supabase.service';
import { OidcService } from '../oidc/oidc.service';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';
import { TokenService } from '../token.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly oidcService: OidcService,
    private readonly tokenService: TokenService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Kolla om route är markerad som public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Saknar autentisering');
    }

    const token = authHeader.replace('Bearer ', '');

    // Try internal access token first
    try {
      const payload = await this.tokenService.verifyAccessToken(token);
      request.user = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        roles: payload.roles || [],
        userType: payload.user_type,
        ...payload,
      };
      request.userId = payload.sub;
      this.logger.debug(
        `Internal JWT authentication successful for user: ${payload.sub}`
      );
      return true;
    } catch (internalError) {
      // Continue to OIDC/Supabase fallback
    }

    // Try OIDC first if enabled
    if (this.oidcService.isEnabled()) {
      try {
        const payload = await this.oidcService.verifyToken(token);
        request.user = {
          id: payload.sub,
          email: payload.email || payload.preferred_username,
          name: payload.name,
          roles: payload.roles || [],
          userType: payload.user_type,
          ...payload,
        };
        request.userId = payload.sub;
        this.logger.debug(`OIDC authentication successful for user: ${payload.sub}`);
        return true;
      } catch (oidcError) {
        // If OIDC fails, fall back to Supabase JWT
        this.logger.debug('OIDC verification failed, trying Supabase JWT');
      }
    }

    // Fallback to Supabase JWT authentication
    const supabase = this.supabaseService.getClient();

    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token);

      if (error || !user) {
        this.logger.warn(`Invalid authentication: ${error?.message}`);
        throw new UnauthorizedException('Ogiltig autentisering');
      }

      // Lägg till user i request för att användas i controllers
      request.user = user;
      request.userId = user.id;

      return true;
    } catch (error) {
      this.logger.error('Auth verification error:', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Autentiseringsfel');
    }
  }
}
