import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { SandboxBankService } from '../../economy/sandbox-bank/sandbox-bank.service';
import { CurrentUserId } from '../../auth/decorators/current-user.decorator';

@ApiTags('Vehicles')
@Controller('vehicles')
@ApiBearerAuth()
export class VehiclesController {
  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly sandboxBankService: SandboxBankService,
  ) {}

  @Post('sandbox/sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sync vehicles from Transportstyrelsen sandbox' })
  @ApiResponse({ status: 200, description: 'Vehicles synced' })
  async sandboxSync(@CurrentUserId() userId: string) {
    try {
      const vehicles = this.sandboxBankService.generateVehicles();
      let created = 0;
      let skipped = 0;
      for (const v of vehicles) {
        const { data: existing } = await (this.vehiclesService as any).supabaseService
          .getClient()
          .from('vehicles')
          .select('id')
          .eq('user_id', userId)
          .eq('registration_number', v.registration_number)
          .maybeSingle();
        if (existing) { skipped++; continue; }
        try {
          await this.vehiclesService.createVehicle(userId, {
            type: v.type,
            make: v.make,
            model: v.model,
            registration_number: v.registration_number,
            year: v.year,
            color: v.color,
            vin: v.vin,
            purchase_price: v.purchase_price,
            current_value: v.current_value,
          });
          created++;
        } catch { /* skip */ }
      }
      return { ok: true, created, skipped, total: vehicles.length };
    } catch (err: any) {
      return { ok: false, message: err?.message ?? 'Kunde inte synka fordon', created: 0 };
    }
  }

  @Get()
  async getVehicles(@CurrentUserId() userId: string) {
    return await this.vehiclesService.getVehicles(userId);
  }

  @Get(':id')
  async getVehicleById(@CurrentUserId() userId: string, @Param('id') id: string) {
    return await this.vehiclesService.getVehicleById(userId, id);
  }

  @Post()
  async createVehicle(@CurrentUserId() userId: string, @Body() createDto: CreateVehicleDto) {
    return await this.vehiclesService.createVehicle(userId, createDto);
  }

  @Put(':id')
  async updateVehicle(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() updateDto: UpdateVehicleDto
  ) {
    return await this.vehiclesService.updateVehicle(userId, id, updateDto);
  }

  @Delete(':id')
  async deleteVehicle(@CurrentUserId() userId: string, @Param('id') id: string) {
    return await this.vehiclesService.deleteVehicle(userId, id);
  }
}

