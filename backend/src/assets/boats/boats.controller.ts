import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BoatsService } from './boats.service';
import { CreateBoatDto } from './dto/create-boat.dto';
import { UpdateBoatDto } from './dto/update-boat.dto';
import { SandboxBankService } from '../../economy/sandbox-bank/sandbox-bank.service';
import { CurrentUserId } from '../../auth/decorators/current-user.decorator';

@ApiTags('Boats')
@Controller('boats')
@ApiBearerAuth()
export class BoatsController {
  constructor(
    private readonly boatsService: BoatsService,
    private readonly sandboxBankService: SandboxBankService,
  ) {}

  @Post('sandbox/sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sync boats from Transportstyrelsen sandbox' })
  @ApiResponse({ status: 200, description: 'Boats synced' })
  async sandboxSync(@CurrentUserId() userId: string) {
    try {
      const boats = this.sandboxBankService.generateBoats();
      let created = 0;
      let skipped = 0;
      for (const b of boats) {
        const { data: existing } = await (this.boatsService as any).supabaseService
          .getClient()
          .from('boats')
          .select('id')
          .eq('user_id', userId)
          .eq('registration_number', b.registration_number)
          .maybeSingle();
        if (existing) { skipped++; continue; }
        try {
          await this.boatsService.createBoat(userId, {
            type: b.type,
            make: b.make,
            model: b.model,
            registration_number: b.registration_number,
            year: b.year,
            length: b.length,
            engine_type: b.engine_type,
            engine_power: b.engine_power,
            mooring_location: b.mooring_location,
            purchase_price: b.purchase_price,
            current_value: b.current_value,
          });
          created++;
        } catch { /* skip */ }
      }
      return { ok: true, created, skipped, total: boats.length };
    } catch (err: any) {
      return { ok: false, message: err?.message ?? 'Kunde inte synka båtar', created: 0 };
    }
  }

  @Get()
  async getBoats(@CurrentUserId() userId: string) {
    return await this.boatsService.getBoats(userId);
  }

  @Get(':id')
  async getBoatById(@CurrentUserId() userId: string, @Param('id') id: string) {
    return await this.boatsService.getBoatById(userId, id);
  }

  @Post()
  async createBoat(@CurrentUserId() userId: string, @Body() createDto: CreateBoatDto) {
    return await this.boatsService.createBoat(userId, createDto);
  }

  @Put(':id')
  async updateBoat(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() updateDto: UpdateBoatDto
  ) {
    return await this.boatsService.updateBoat(userId, id, updateDto);
  }

  @Delete(':id')
  async deleteBoat(@CurrentUserId() userId: string, @Param('id') id: string) {
    return await this.boatsService.deleteBoat(userId, id);
  }
}

