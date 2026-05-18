import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { LantmaterietService } from '../../lantmateriet/lantmateriet.service';
import { SandboxBankService } from '../../economy/sandbox-bank/sandbox-bank.service';
import { CurrentUserId } from '../../auth/decorators/current-user.decorator';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { SearchAddressQueryDto } from './dto/search-address-query.dto';

@ApiTags('Properties')
@Controller('properties')
@ApiBearerAuth()
export class PropertiesController {
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly lantmaterietService: LantmaterietService,
    private readonly sandboxBankService: SandboxBankService,
  ) {}

  @Post('sandbox/sync')
  @HttpCode(HttpStatus.OK)
  async sandboxSync(@CurrentUserId() userId: string) {
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

  @Get('address-search')
  async searchAddress(
    @CurrentUserId() userId: string,
    @Query() query: SearchAddressQueryDto,
  ) {
    const results = await this.lantmaterietService.searchAddress(
      query.q,
      query.maxHits ? parseInt(query.maxHits, 10) : 15,
    );
    return { results };
  }

  @Get()
  async getProperties(@CurrentUserId() userId: string) {
    return await this.propertiesService.getProperties(userId);
  }

  @Get(':id')
  async getPropertyById(@CurrentUserId() userId: string, @Param('id') id: string) {
    return await this.propertiesService.getPropertyById(userId, id);
  }

  @Post()
  async createProperty(@CurrentUserId() userId: string, @Body() createDto: CreatePropertyDto) {
    return await this.propertiesService.createProperty(userId, createDto);
  }

  @Put(':id')
  async updateProperty(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() updateDto: UpdatePropertyDto
  ) {
    return await this.propertiesService.updateProperty(userId, id, updateDto);
  }

  @Delete(':id')
  async deleteProperty(@CurrentUserId() userId: string, @Param('id') id: string) {
    return await this.propertiesService.deleteProperty(userId, id);
  }
}

