import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InsurancesService } from './insurances.service';
import { SandboxBankService } from '../../economy/sandbox-bank/sandbox-bank.service';
import { CurrentUserId } from '../../auth/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { SandboxSyncDto } from './dto/sandbox-sync.dto';
import { CreateInsuranceDto } from './dto/create-insurance.dto';
import { UpdateInsuranceDto } from './dto/update-insurance.dto';

@ApiTags('Insurances')
@Controller('insurances')
@ApiBearerAuth()
export class InsurancesController {
  constructor(
    private readonly insurancesService: InsurancesService,
    private readonly sandboxBankService: SandboxBankService,
  ) {}

  @Get('sandbox/companies')
  @Public()
  @ApiOperation({ summary: 'List available insurance companies (sandbox)' })
  getInsuranceCompanies() {
    return { ok: true, companies: this.sandboxBankService.getInsuranceCompanies() };
  }

  @Post('sandbox/sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sync insurances from an insurance company sandbox' })
  @ApiResponse({ status: 200, description: 'Insurances synced' })
  async sandboxSync(
    @CurrentUserId() userId: string,
    @Body() body: SandboxSyncDto,
  ) {
    try {
      const insurances = this.sandboxBankService.generateInsurances(body.company_id);
      let created = 0;
      let skipped = 0;
      for (const ins of insurances) {
        const { data: existing } = await (this.insurancesService as any).supabaseService
          .getClient()
          .from('insurances')
          .select('id')
          .eq('user_id', userId)
          .eq('policy_number', ins.policy_number)
          .maybeSingle();
        if (existing) { skipped++; continue; }
        try {
          await this.insurancesService.createInsurance(userId, {
            category: ins.category,
            type: ins.type,
            insurance_company: ins.insurance_company,
            policy_number: ins.policy_number,
            coverage_amount: ins.coverage_amount,
            premium: ins.premium,
            premium_frequency: ins.premium_frequency,
            start_date: ins.start_date,
            expiry_date: ins.expiry_date,
            deductible: ins.deductible,
          });
          created++;
        } catch { /* skip */ }
      }
      return { ok: true, created, skipped, total: insurances.length };
    } catch (err: any) {
      return { ok: false, message: err?.message ?? 'Kunde inte synka försäkringar', created: 0 };
    }
  }

  @Get()
  async getInsurances(@CurrentUserId() userId: string) {
    return await this.insurancesService.getInsurances(userId);
  }

  @Get(':id')
  async getInsuranceById(@CurrentUserId() userId: string, @Param('id') id: string) {
    return await this.insurancesService.getInsuranceById(userId, id);
  }

  @Post()
  async createInsurance(@CurrentUserId() userId: string, @Body() createDto: CreateInsuranceDto) {
    return await this.insurancesService.createInsurance(userId, createDto);
  }

  @Put(':id')
  async updateInsurance(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() updateDto: UpdateInsuranceDto
  ) {
    return await this.insurancesService.updateInsurance(userId, id, updateDto);
  }

  @Delete(':id')
  async deleteInsurance(@CurrentUserId() userId: string, @Param('id') id: string) {
    return await this.insurancesService.deleteInsurance(userId, id);
  }
}

