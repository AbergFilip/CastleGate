import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { InvestmentsService } from './investments.service';
import { SandboxBankService } from '../sandbox-bank/sandbox-bank.service';
import { CurrentUserId } from '../../auth/decorators/current-user.decorator';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';

@ApiTags('Investments')
@Controller('investments')
@ApiBearerAuth()
export class InvestmentsController {
  constructor(
    private readonly investmentsService: InvestmentsService,
    private readonly sandboxBankService: SandboxBankService,
  ) {}

  @Post('sandbox/sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sync sandbox investments from a bank' })
  @ApiResponse({ status: 200, description: 'Investments synced' })
  async sandboxSync(
    @CurrentUserId() userId: string,
    @Body() body: { bank_id: string },
  ) {
    try {
      const investments = this.sandboxBankService.generateInvestments(body.bank_id);
      let created = 0;
      let skipped = 0;
      for (const inv of investments) {
        try {
          const result = await this.investmentsService.createInvestment(userId, {
            provider: inv.provider,
            account_name: `${inv.account_name} – ${inv.symbol}`,
            investment_type: inv.investment_type,
            symbol: inv.symbol,
            amount: inv.amount,
            quantity: inv.quantity,
            purchase_price: inv.purchase_price,
            current_price: inv.current_price,
            currency: inv.currency,
            growth_percent: inv.growth_percent,
            account_type: inv.account_type,
          } as CreateInvestmentDto);
          if ((result as any).duplicate) {
            skipped++;
          } else {
            created++;
          }
        } catch {
          /* skip errors */
        }
      }
      return { ok: true, created, skipped, total: investments.length };
    } catch (err: any) {
      return { ok: false, message: err?.message ?? 'Kunde inte synka investeringar', created: 0 };
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all investments for current user' })
  @ApiResponse({ status: 200, description: 'Investments retrieved successfully' })
  async getInvestments(@CurrentUserId() userId: string) {
    return await this.investmentsService.getInvestments(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single investment by ID' })
  @ApiResponse({ status: 200, description: 'Investment retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Investment not found' })
  async getInvestmentById(
    @CurrentUserId() userId: string,
    @Param('id') id: string
  ) {
    return await this.investmentsService.getInvestmentById(userId, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new investment' })
  @ApiResponse({ status: 201, description: 'Investment created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createInvestment(
    @CurrentUserId() userId: string,
    @Body() createDto: CreateInvestmentDto
  ) {
    return await this.investmentsService.createInvestment(userId, createDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an investment' })
  @ApiResponse({ status: 200, description: 'Investment updated successfully' })
  @ApiResponse({ status: 404, description: 'Investment not found' })
  async updateInvestment(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() updateDto: UpdateInvestmentDto
  ) {
    return await this.investmentsService.updateInvestment(userId, id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an investment' })
  @ApiResponse({ status: 200, description: 'Investment deleted successfully' })
  async deleteInvestment(
    @CurrentUserId() userId: string,
    @Param('id') id: string
  ) {
    return await this.investmentsService.deleteInvestment(userId, id);
  }
}

