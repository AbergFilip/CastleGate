import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RbacService } from '../rbac.service';

export const REQUIRED_PERMISSIONS_KEY = 'requiredPermissions';
export const REQUIRED_ROLES_KEY = 'requiredRoles';

@Injectable()
export class RbacGuard implements CanActivate {
  private readonly logger = new Logger(RbacGuard.name);

  constructor(
    private readonly rbacService: RbacService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      REQUIRED_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()]
    );

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      REQUIRED_ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    // If no requirements, allow access
    if (!requiredPermissions && !requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.userId || request.user?.id;

    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    try {
      // Check roles first
      if (requiredRoles && requiredRoles.length > 0) {
        let hasRequiredRole = false;
        for (const role of requiredRoles) {
          if (await this.rbacService.hasRole(userId, role)) {
            hasRequiredRole = true;
            break;
          }
        }

        if (!hasRequiredRole) {
          this.logger.warn(
            `User ${userId} does not have required roles: ${requiredRoles.join(', ')}`
          );
          throw new ForbiddenException('Insufficient role permissions');
        }
      }

      // Check permissions
      if (requiredPermissions && requiredPermissions.length > 0) {
        const hasPermission = await this.rbacService.hasAnyPermission(
          userId,
          requiredPermissions
        );

        if (!hasPermission) {
          this.logger.warn(
            `User ${userId} does not have required permissions: ${requiredPermissions.join(', ')}`
          );
          throw new ForbiddenException('Insufficient permissions');
        }
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      this.logger.error(`Error checking RBAC: ${error instanceof Error ? error.message : String(error)}`);
      throw new ForbiddenException('Failed to verify permissions');
    }
  }
}

