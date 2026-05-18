import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';

export interface BankAccount {
  id: string;
  user_id: string;
  bank_name: string;
  account_name: string;
  account_number?: string;
  account_type?: string;
  balance: number;
  currency: string;
  iban?: string;
  swift?: string;
  notes?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class BankAccountsService {
  private readonly logger = new Logger(BankAccountsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Get all bank accounts for a user
   */
  async getBankAccounts(userId: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('bank_accounts')
        .select('*')
        .eq('user_id', userId)
        .order('bank_name', { ascending: true })
        .order('account_name', { ascending: true });

      if (error) {
        this.logger.error(`Error fetching bank accounts: ${error.message}`);
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          return { accounts: [], total: 0 };
        }
        throw new Error('Kunde inte hämta bankkonton');
      }

      const accounts = data || [];
      
      // Calculate total balance
      const total = accounts.reduce(
        (sum, account) => sum + (parseFloat(String(account.balance)) || 0),
        0
      );

      return { accounts, total };
    } catch (error: any) {
      this.logger.error(`Error fetching bank accounts: ${error.message}`);
      throw new Error('Kunde inte hämta bankkonton');
    }
  }

  /**
   * Get a single bank account by ID
   */
  async getBankAccountById(userId: string, accountId: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('bank_accounts')
        .select('*')
        .eq('id', accountId)
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        throw new NotFoundException('Bankkonto hittades inte');
      }

      return { account: data };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching bank account: ${error.message}`);
      throw new Error('Kunde inte hämta bankkonto');
    }
  }

  /**
   * Create a new bank account
   */
  async createBankAccount(userId: string, createDto: CreateBankAccountDto) {
    if (!createDto.bank_name || !createDto.account_name) {
      throw new BadRequestException('Banknamn och kontonamn krävs');
    }

    // Duplikat-skydd: kontrollera om samma konto redan finns
    if (createDto.account_number) {
      const { data: existing } = await this.supabaseService
        .getClient()
        .from('bank_accounts')
        .select('id')
        .eq('user_id', userId)
        .eq('account_number', createDto.account_number)
        .maybeSingle();
      if (existing) {
        this.logger.debug(`Konto ${createDto.account_number} finns redan, hoppar över`);
        return { account: existing, duplicate: true };
      }
    }

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('bank_accounts')
        .insert({
          user_id: userId,
          bank_name: createDto.bank_name.trim(),
          account_name: createDto.account_name.trim(),
          account_number: createDto.account_number || null,
          account_type: createDto.account_type || 'checking',
          balance: createDto.balance ? parseFloat(String(createDto.balance)) : 0,
          currency: createDto.currency || 'SEK',
          iban: createDto.iban || null,
          swift: createDto.swift || null,
          notes: createDto.notes || null,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        this.logger.error(`Error creating bank account: ${error.message}`);
        throw new Error('Kunde inte skapa bankkonto');
      }

      return { account: data };
    } catch (error: any) {
      this.logger.error(`Error creating bank account: ${error.message}`);
      throw new Error('Kunde inte skapa bankkonto');
    }
  }

  /**
   * Update a bank account
   */
  async updateBankAccount(
    userId: string,
    accountId: string,
    updateDto: UpdateBankAccountDto
  ) {
    const updates: any = {};
    if (updateDto.bank_name !== undefined) updates.bank_name = updateDto.bank_name.trim();
    if (updateDto.account_name !== undefined) updates.account_name = updateDto.account_name.trim();
    if (updateDto.account_number !== undefined) updates.account_number = updateDto.account_number || null;
    if (updateDto.account_type !== undefined) updates.account_type = updateDto.account_type;
    if (updateDto.balance !== undefined) updates.balance = parseFloat(String(updateDto.balance)) || 0;
    if (updateDto.currency !== undefined) updates.currency = updateDto.currency;
    if (updateDto.iban !== undefined) updates.iban = updateDto.iban || null;
    if (updateDto.swift !== undefined) updates.swift = updateDto.swift || null;
    if (updateDto.notes !== undefined) updates.notes = updateDto.notes || null;
    if (updateDto.is_active !== undefined) updates.is_active = updateDto.is_active;

    if (Object.keys(updates).length === 0) {
      return this.getBankAccountById(userId, accountId);
    }

    updates.updated_at = new Date().toISOString();

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('bank_accounts')
        .update(updates)
        .eq('id', accountId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error || !data) {
        throw new NotFoundException('Bankkonto hittades inte');
      }

      return { account: data };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error updating bank account: ${error.message}`);
      throw new Error('Kunde inte uppdatera bankkonto');
    }
  }

  /**
   * Delete a bank account
   */
  async deleteBankAccount(userId: string, accountId: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('bank_accounts')
        .delete()
        .eq('id', accountId)
        .eq('user_id', userId)
        .select('id')
        .single();

      if (error || !data) {
        throw new NotFoundException('Bankkonto hittades inte');
      }

      return { message: 'Bankkonto borttaget' };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting bank account: ${error.message}`);
      throw new Error('Kunde inte ta bort bankkonto');
    }
  }
}

