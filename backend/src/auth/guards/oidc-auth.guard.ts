import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OidcService } from '../oidc/oidc.service';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';

@Injectable()
export class OidcAuthGuard implements CanActivate {
  private readonly logger = new Logger(OidcAuthGuard.name);

  constructor(
    private readonly oidcService: OidcService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if OIDC is enabled
    if (!this.oidcService.isEnabled()) {
      // If OIDC is not enabled, allow request to pass (fallback to JWT)
      return true;
    }

    // Check if route is marked as public
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

    try {
      const payload = await this.oidcService.verifyToken(token);

      // Add user info to request
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
    } catch (error) {
      this.logger.error('OIDC authentication error:', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('OIDC autentiseringsfel');
    }
  }
}

