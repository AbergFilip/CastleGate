import { SetMetadata } from '@nestjs/common';
import { UserType } from '../../users/dto/user-type.dto';
import { REQUIRED_USER_TYPE_KEY } from '../guards/user-type.guard';

export const RequireUserType = (userType: UserType) =>
  SetMetadata(REQUIRED_USER_TYPE_KEY, userType);

