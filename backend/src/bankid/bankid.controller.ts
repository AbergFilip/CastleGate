import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BankidService } from './bankid.service';
import { AuthService } from '../auth/auth.service';
import { SupabaseService } from '../supabase/supabase.service';
import { Public } from '../common/decorators/public.decorator';
import { AuthDto, CollectDto, SignupDto, SigninDto, LinkDto } from './dto';

@ApiTags('BankID')
@Controller('bankid')
export class BankidController {
  private readonly logger = new Logger(BankidController.name);

  constructor(
    private readonly bankidService: BankidService,
    private readonly authService: AuthService,
    private readonly supabaseService: SupabaseService
  ) {}

  @Get('ip')
  @Public()
  @ApiOperation({ summary: 'Get user IP address' })
  @ApiResponse({ status: 200, description: 'IP address retrieved' })
  getUserIp(@Req() req: any) {
    const ip = this.bankidService.getUserIp(req);
    this.logger.log(`📍 IP request - detected IP: ${ip}`);
    return { ip };
  }

  @Post('auth')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Initiate BankID authentication' })
  @ApiResponse({ status: 200, description: 'BankID authentication initiated' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async authenticate(@Body() authDto: AuthDto, @Req() req: any) {
    this.logger.log('📥 BankID auth request received');
    const endUserIp = authDto.endUserIp || this.bankidService.getUserIp(req);
    return await this.bankidService.authenticate(authDto.personalNumber, endUserIp);
  }

  @Post('collect')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Collect BankID authentication status' })
  @ApiResponse({ status: 200, description: 'Status retrieved' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async collect(@Body() collectDto: CollectDto) {
    return await this.bankidService.collect(collectDto.orderRef);
  }

  @Post('signup')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign up with BankID' })
  @ApiResponse({ status: 200, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async signup(@Body() signupDto: SignupDto) {
    return await this.authService.signupWithBankID(signupDto);
  }

  @Post('signin')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in with BankID' })
  @ApiResponse({ status: 200, description: 'User signed in successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async signin(@Body() signinDto: SigninDto) {
    return await this.authService.signinWithBankID(signinDto);
  }

  @Post('link')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Link BankID to existing account' })
  @ApiResponse({ status: 200, description: 'BankID linked successfully' })
  async link(@Body() linkDto: LinkDto, @Req() req: any) {
    const userId = req.userId;
    if (!userId) {
      return { success: false, message: 'User not authenticated' };
    }
    return await this.authService.linkBankID({ ...linkDto, userId });
  }

  @Get('status')
  @Public()
  @ApiOperation({ summary: 'Get BankID service health status' })
  @ApiResponse({ status: 200, description: 'Service status retrieved' })
  async getStatus() {
    return { status: 'ok', message: 'BankID service is running' };
  }

  @Get('user-status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user BankID link status' })
  @ApiResponse({ status: 200, description: 'User BankID status retrieved' })
  async getUserBankIDStatus(@Req() req: any) {
    const userId = req.userId;
    if (!userId) {
      return { linked: false };
    }
    try {
      const result = await this.supabaseService.getClient()
        .from('users')
        .select('bankid_linked, bankid_linked_at, display_name')
        .eq('id', userId)
        .single();
      if (result.data) {
        return {
          linked: !!result.data.bankid_linked,
          linkedAt: result.data.bankid_linked_at,
          name: result.data.display_name,
        };
      }
      return { linked: false };
    } catch {
      return { linked: false };
    }
  }

  @Post('unlink')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unlink BankID from account' })
  @ApiResponse({ status: 200, description: 'BankID unlinked successfully' })
  async unlink(@Req() req: any) {
    const userId = req.userId || req.user?.id;
    if (!userId) {
      return { success: false, message: 'User not authenticated' };
    }
    return await this.authService.unlinkBankID(userId);
  }

  @Post('qr')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate QR code for BankID' })
  @ApiResponse({ status: 200, description: 'QR code generated' })
  @ApiResponse({ status: 404, description: 'Order reference not found' })
  async generateQR(@Body() collectDto: CollectDto) {
    const qrCode = this.bankidService.generateQR(collectDto.orderRef);
    if (!qrCode) {
      return { success: false, message: 'QR code not available' };
    }
    return { qrCode };
  }

  @Post('cancel')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel BankID authentication' })
  @ApiResponse({ status: 200, description: 'Authentication cancelled' })
  async cancel(@Body() collectDto: CollectDto) {
    return await this.bankidService.cancel(collectDto.orderRef);
  }
}

