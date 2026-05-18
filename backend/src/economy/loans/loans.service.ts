import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';

@Injectable()
export class LoansService {
  private readonly logger = new Logger(LoansService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async getLoans(userId: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('loans')
        .select('*')
        .eq('user_id', userId)
        .order('loan_type', { ascending: true })
        .order('loan_name', { ascending: true });

      if (error) {
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          return { loans: [], totalDebt: 0, totalMonthly: 0 };
        }
        throw new Error('Kunde inte hämta lån');
      }

      const loans = data || [];
      const totalDebt = loans.reduce((s, l) => s + (parseFloat(String(l.remaining_amount ?? l.amount)) || 0), 0);
      const totalMonthly = loans.reduce((s, l) => s + (parseFloat(String(l.monthly_payment)) || 0), 0);

      return { loans, totalDebt, totalMonthly };
    } catch (error: any) {
      this.logger.error(`Error fetching loans: ${error.message}`);
      throw new Error('Kunde inte hämta lån');
    }
  }

  async createLoan(userId: string, dto: CreateLoanDto) {
    if (!dto.loan_type || !dto.loan_name) {
      throw new BadRequestException('Låntyp och lånnamn krävs');
    }
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('loans')
        .insert({
          user_id: userId,
          loan_type: dto.loan_type,
          loan_name: dto.loan_name.trim(),
          bank_name: dto.bank_name?.trim() || null,
          amount: parseFloat(String(dto.amount)) || 0,
          remaining_amount: dto.remaining_amount != null ? parseFloat(String(dto.remaining_amount)) : parseFloat(String(dto.amount)) || 0,
          interest_rate: dto.interest_rate != null ? parseFloat(String(dto.interest_rate)) : null,
          monthly_payment: dto.monthly_payment != null ? parseFloat(String(dto.monthly_payment)) : null,
          currency: dto.currency || 'SEK',
          start_date: dto.start_date || null,
          end_date: dto.end_date || null,
          notes: dto.notes || null,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        this.logger.error(`Error creating loan: ${error.message}`);
        throw new Error('Kunde inte skapa lån');
      }
      return { loan: data };
    } catch (error: any) {
      this.logger.error(`Error creating loan: ${error.message}`);
      throw new Error('Kunde inte skapa lån');
    }
  }

  async updateLoan(userId: string, loanId: string, dto: UpdateLoanDto) {
    const updates: Record<string, unknown> = {};
    if (dto.loan_type !== undefined) updates.loan_type = dto.loan_type;
    if (dto.loan_name !== undefined) updates.loan_name = dto.loan_name.trim();
    if (dto.bank_name !== undefined) updates.bank_name = dto.bank_name?.trim() || null;
    if (dto.amount !== undefined) updates.amount = parseFloat(String(dto.amount)) || 0;
    if (dto.remaining_amount !== undefined) updates.remaining_amount = parseFloat(String(dto.remaining_amount)) || 0;
    if (dto.interest_rate !== undefined) updates.interest_rate = dto.interest_rate;
    if (dto.monthly_payment !== undefined) updates.monthly_payment = dto.monthly_payment;
    if (dto.currency !== undefined) updates.currency = dto.currency;
    if (dto.start_date !== undefined) updates.start_date = dto.start_date || null;
    if (dto.end_date !== undefined) updates.end_date = dto.end_date || null;
    if (dto.notes !== undefined) updates.notes = dto.notes || null;
    if (dto.is_active !== undefined) updates.is_active = dto.is_active;
    if (Object.keys(updates).length === 0) return this.getLoanById(userId, loanId);
    updates.updated_at = new Date().toISOString();

    const { data, error } = await this.supabaseService
      .getClient()
      .from('loans')
      .update(updates)
      .eq('id', loanId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !data) throw new NotFoundException('Lån hittades inte');
    return { loan: data };
  }

  async getLoanById(userId: string, loanId: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('loans')
      .select('*')
      .eq('id', loanId)
      .eq('user_id', userId)
      .single();
    if (error || !data) throw new NotFoundException('Lån hittades inte');
    return { loan: data };
  }

  async deleteLoan(userId: string, loanId: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('loans')
      .delete()
      .eq('id', loanId)
      .eq('user_id', userId)
      .select('id')
      .single();
    if (error || !data) throw new NotFoundException('Lån hittades inte');
    return { message: 'Lån borttaget' };
  }
}
