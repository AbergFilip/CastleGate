import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoansService } from './loans.service';
import { SandboxBankService } from '../sandbox-bank/sandbox-bank.service';
import { CurrentUserId } from '../../auth/decorators/current-user.decorator';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';

@ApiTags('Loans')
@Controller('loans')
@ApiBearerAuth()
export class LoansController {
  private readonly logger = new Logger(LoansController.name);

  constructor(
    private readonly loansService: LoansService,
    private readonly sandboxBankService: SandboxBankService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all loans for current user' })
  async getLoans(@CurrentUserId() userId: string) {
    return await this.loansService.getLoans(userId);
  }

  @Get('sandbox/banks')
  @ApiOperation({ summary: 'List available sandbox banks for loans' })
  async getSandboxBanks() {
    return { ok: true, banks: this.sandboxBankService.getBanks() };
  }

  @Post('sandbox/sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate and save sandbox loans for a bank' })
  async sandboxSync(
    @CurrentUserId() userId: string,
    @Body() body: { bank_id: string },
  ) {
    if (!body.bank_id) return { ok: false, message: 'bank_id krävs', created: 0 };
    try {
      const loans = this.sandboxBankService.generateLoans(body.bank_id);
      let created = 0;
      for (const l of loans) {
        try {
          await this.loansService.createLoan(userId, {
            loan_type: l.loanType,
            loan_name: l.loanName,
            bank_name: l.bankName,
            amount: l.amount,
            remaining_amount: l.remainingAmount,
            interest_rate: l.interestRate,
            monthly_payment: l.monthlyPayment,
            currency: l.currency,
            notes: `Sandbox: ${l.id}`,
          });
          created++;
        } catch { /* skip */ }
      }
      return { ok: true, created, total: loans.length, bank_name: loans[0]?.bankName };
    } catch (err: any) {
      return { ok: false, message: err?.message ?? 'Kunde inte skapa sandbox-lån', created: 0 };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single loan by ID' })
  async getLoanById(@CurrentUserId() userId: string, @Param('id') id: string) {
    return await this.loansService.getLoanById(userId, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new loan' })
  async createLoan(@CurrentUserId() userId: string, @Body() dto: CreateLoanDto) {
    return await this.loansService.createLoan(userId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a loan' })
  async updateLoan(@CurrentUserId() userId: string, @Param('id') id: string, @Body() dto: UpdateLoanDto) {
    return await this.loansService.updateLoan(userId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a loan' })
  async deleteLoan(@CurrentUserId() userId: string, @Param('id') id: string) {
    return await this.loansService.deleteLoan(userId, id);
  }
}
