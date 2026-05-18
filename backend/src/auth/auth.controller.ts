import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { RefreshTokenService } from './refresh-token.service';
import { IssueTokenDto, RefreshTokenDto, RevokeTokenDto } from './dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  @Post('issue')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Issue access + refresh tokens' })
  @ApiResponse({ status: 200, description: 'Tokens issued' })
  async issueTokens(@Req() req: any, @Body() dto: IssueTokenDto) {
    const userId = req.userId || req.user?.id;
    if (!userId) {
      return { success: false, message: 'User not authenticated' };
    }

    return await this.refreshTokenService.issueTokens({
      userId,
      email: req.user?.email,
      name: req.user?.name,
      roles: req.user?.roles,
      userType: req.user?.user_type,
      ipAddress: req.ip,
      userAgent: dto?.deviceName || req.headers['user-agent'],
    });
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed' })
  async refreshToken(@Req() req: any, @Body() dto: RefreshTokenDto) {
    return await this.refreshTokenService.refreshTokens({
      refreshToken: dto.refreshToken,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  @Post('revoke')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke refresh token' })
  @ApiResponse({ status: 200, description: 'Token revoked' })
  async revokeToken(@Req() req: any, @Body() dto: RevokeTokenDto) {
    const userId = req.userId || req.user?.id;
    if (!userId) {
      return { success: false, message: 'User not authenticated' };
    }

    if (!dto.refreshToken) {
      await this.refreshTokenService.revokeAllTokens(userId);
      return { success: true, message: 'All refresh tokens revoked' };
    }

    await this.refreshTokenService.revokeToken({
      userId,
      refreshToken: dto.refreshToken,
    });

    return { success: true, message: 'Refresh token revoked' };
  }

  @Post('logout')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and revoke all refresh tokens' })
  @ApiResponse({ status: 200, description: 'Logged out' })
  async logout(@Req() req: any) {
    const userId = req.userId || req.user?.id;
    if (!userId) {
      return { success: false, message: 'User not authenticated' };
    }

    await this.refreshTokenService.revokeAllTokens(userId);
    return { success: true, message: 'Logged out' };
  }
}
