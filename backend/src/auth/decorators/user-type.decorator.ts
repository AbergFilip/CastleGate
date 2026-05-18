import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserType } from '../../users/dto/user-type.dto';

export const CurrentUserType = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserType | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.userType || request.user?.user_type;
  }
);

