import { Controller, Get, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { AssetsService } from './assets.service';
import { PropertiesService } from './properties/properties.service';
import { SandboxBankService } from '../economy/sandbox-bank/sandbox-bank.service';
import { CurrentUserId } from '../auth/decorators/current-user.decorator';

@ApiTags('Assets')
@Controller('assets')
@ApiBearerAuth()
export class AssetsController {
  constructor(
    private readonly assetsService: AssetsService,
    private readonly propertiesService: PropertiesService,
    private readonly sandboxBankService: SandboxBankService,
  ) {}

  @Get()
  async getAssets(@CurrentUserId() userId: string) {
    return await this.assetsService.getAssets(userId);
  }

  @Get('properties/sandbox/health')
  @Public()
  sandboxHealth() {
    return { ok: true, message: 'properties sandbox route works' };
  }

  @Post('properties/sandbox/sync')
  @HttpCode(HttpStatus.OK)
  async sandboxPropertiesSync(@CurrentUserId() userId: string) {
    try {
      const properties = this.sandboxBankService.generateProperties();
      let created = 0;
      for (const p of properties) {
        try {
          await this.propertiesService.createProperty(userId, {
            type: 'home',
            address: p.address,
            city: p.city,
            postal_code: p.postal_code,
            property_type: p.property_type,
            size_sqm: p.size_sqm,
            rooms: p.rooms,
            floor: p.floor,
            purchase_price: p.purchase_price,
            current_value: p.current_value,
            purchase_date: p.purchase_date,
            valuation_source: 'Lantmäteriet',
          });
          created++;
        } catch {
          /* skip */
        }
      }
      return { ok: true, created, total: properties.length };
    } catch (err: any) {
      return { ok: false, message: err?.message ?? 'Kunde inte hämta fastigheter', created: 0 };
    }
  }
}
