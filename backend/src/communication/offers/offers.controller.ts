import { Controller, Get, Post, Delete, Body, Param, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { CurrentUserId } from '../../auth/decorators/current-user.decorator';
import { RbacGuard } from '../../rbac/guards/rbac.guard';
import { Roles } from '../../rbac/decorators/roles.decorator';

@ApiTags('Communication - Offers')
@Controller('offers')
@ApiBearerAuth()
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  @ApiOperation({ summary: 'Get offers for current user' })
  async getOffers(@CurrentUserId() userId: string) {
    return this.offersService.getOffers(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get offer by ID' })
  async getOfferById(@CurrentUserId() userId: string, @Param('id') id: string) {
    return this.offersService.getOfferById(userId, id);
  }

  @Post(':userId')
  @UseGuards(RbacGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create offer for a user (Admin/B2B only)' })
  async createOffer(@Param('userId') targetUserId: string, @Body() createDto: CreateOfferDto) {
    return this.offersService.createOffer(targetUserId, createDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete/Dismiss an offer' })
  async deleteOffer(@CurrentUserId() userId: string, @Param('id') id: string) {
    return this.offersService.deleteOffer(userId, id);
  }
}

