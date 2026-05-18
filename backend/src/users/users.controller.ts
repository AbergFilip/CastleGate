import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CurrentUserId } from '../auth/decorators/current-user.decorator';
import { UserType, UserTypeMetadata } from './dto/user-type.dto';
import { UpdateUserTypeDto } from './dto/update-user-type.dto';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me/type')
  @ApiOperation({ summary: 'Get current user type' })
  @ApiResponse({ status: 200, description: 'User type retrieved' })
  async getMyUserType(@CurrentUserId() userId: string): Promise<{ type: UserType }> {
    const type = await this.usersService.getUserType(userId);
    return { type };
  }

  @Put('me/type')
  @ApiOperation({ summary: 'Update current user type' })
  @ApiResponse({ status: 200, description: 'User type updated' })
  async updateMyUserType(
    @CurrentUserId() userId: string,
    @Body() body: UpdateUserTypeDto
  ) {
    const metadata = body.metadata
      ? { type: body.type, ...body.metadata }
      : undefined;
    return await this.usersService.setUserType(userId, body.type, metadata);
  }

  @Get('me/metadata')
  @ApiOperation({ summary: 'Get current user metadata' })
  @ApiResponse({ status: 200, description: 'User metadata retrieved' })
  async getMyMetadata(@CurrentUserId() userId: string): Promise<UserTypeMetadata> {
    return await this.usersService.getUserMetadata(userId);
  }

  @Get(':id/type')
  @ApiOperation({ summary: 'Get user type by ID (own user only)' })
  @ApiResponse({ status: 200, description: 'User type retrieved' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getUserType(
    @CurrentUserId() currentUserId: string,
    @Param('id') id: string,
  ): Promise<{ type: UserType }> {
    if (currentUserId !== id) {
      throw new (await import('@nestjs/common')).ForbiddenException('Cannot access other users type');
    }
    const type = await this.usersService.getUserType(id);
    return { type };
  }
}

