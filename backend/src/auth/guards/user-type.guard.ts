import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users/users.service';
import { UserType } from '../../users/dto/user-type.dto';

export const REQUIRED_USER_TYPE_KEY = 'requiredUserType';

@Injectable()
export class UserTypeGuard implements CanActivate {
  private readonly logger = new Logger(UserTypeGuard.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredUserType = this.reflector.getAllAndOverride<UserType>(
      REQUIRED_USER_TYPE_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredUserType) {
      // No user type requirement, allow access
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.userId || request.user?.id;

    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    try {
      const userType = await this.usersService.getUserType(userId);

      if (userType !== requiredUserType) {
        this.logger.warn(
          `User ${userId} (${userType}) attempted to access ${requiredUserType} resource`
        );
        throw new ForbiddenException(
          `This resource requires ${requiredUserType} user type`
        );
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      this.logger.error(`Error checking user type: ${error instanceof Error ? error.message : String(error)}`);
      throw new ForbiddenException('Failed to verify user type');
    }
  }
}

