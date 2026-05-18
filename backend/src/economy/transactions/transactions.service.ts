import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

export interface Transaction {
  id: string;
  user_id: string;
  bank_account_id?: string;
  transaction_date: Date;
  amount: number;
  currency: string;
  merchant?: string;
  description?: string;
  category?: string;
  transaction_type?: string;
  reference?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Get transactions for a bank account
   */
  async getTransactionsByAccount(
    userId: string,
    accountId: string,
    limit: number = 50,
    offset: number = 0
  ) {
    try {
      // Check that account belongs to user
      const { data: accountData, error: accountError } = await this.supabaseService
        .getClient()
        .from('bank_accounts')
        .select('id')
        .eq('id', accountId)
        .eq('user_id', userId)
        .single();

      if (accountError || !accountData) {
        throw new NotFoundException('Bankkonto hittades inte');
      }

      // Get transactions with count
      const { data, error, count } = await this.supabaseService
        .getClient()
        .from('transactions')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('bank_account_id', accountId)
        .order('transaction_date', { ascending: false })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        this.logger.error(`Error fetching transactions: ${error.message}`);
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          return { transactions: [], total: 0 };
        }
        throw new Error('Kunde inte hämta transaktioner');
      }

      return { transactions: data || [], total: count || 0 };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching transactions: ${error.message}`);
      throw new Error('Kunde inte hämta transaktioner');
    }
  }

  /**
   * Create a new transaction
   */
  async createTransaction(userId: string, createDto: CreateTransactionDto) {
    if (!createDto.transaction_date || createDto.amount === undefined) {
      throw new BadRequestException('Transaktionsdatum och belopp krävs');
    }

    try {
      // If bank_account_id is provided, check that account belongs to user
      if (createDto.bank_account_id) {
        const { data: accountData, error: accountError } = await this.supabaseService
          .getClient()
          .from('bank_accounts')
          .select('id')
          .eq('id', createDto.bank_account_id)
          .eq('user_id', userId)
          .single();

        if (accountError || !accountData) {
          throw new NotFoundException('Bankkonto hittades inte');
        }
      }

      const { data, error } = await this.supabaseService
        .getClient()
        .from('transactions')
        .insert({
          user_id: userId,
          bank_account_id: createDto.bank_account_id || null,
          transaction_date: createDto.transaction_date,
          amount: parseFloat(String(createDto.amount)),
          currency: createDto.currency || 'SEK',
          merchant: createDto.merchant?.trim() || null,
          description: createDto.description?.trim() || null,
          category: createDto.category || null,
          transaction_type: createDto.transaction_type || 'debit',
          reference: createDto.reference?.trim() || null,
          notes: createDto.notes?.trim() || null,
        })
        .select()
        .single();

      if (error) {
        this.logger.error(`Error creating transaction: ${error.message}`);
        throw new Error('Kunde inte skapa transaktion');
      }

      return { transaction: data };
    } catch (error: any) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error creating transaction: ${error.message}`);
      throw new Error('Kunde inte skapa transaktion');
    }
  }

  /**
   * Update a transaction
   */
  async updateTransaction(
    userId: string,
    transactionId: string,
    updateDto: UpdateTransactionDto
  ) {
    const updates: any = {};
    const allowedFields = [
      'transaction_date',
      'amount',
      'currency',
      'merchant',
      'description',
      'category',
      'transaction_type',
      'reference',
      'notes',
    ];

    for (const field of allowedFields) {
      const value = (updateDto as any)[field];
      if (value !== undefined) {
        if (field === 'amount') {
          updates[field] = parseFloat(String(value));
        } else if (typeof value === 'string') {
          updates[field] = value.trim() || null;
        } else {
          updates[field] = value;
        }
      }
    }

    if (Object.keys(updates).length === 0) {
      // No updates, return existing transaction
      const { data, error } = await this.supabaseService
        .getClient()
        .from('transactions')
        .select('*')
        .eq('id', transactionId)
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        throw new NotFoundException('Transaktion hittades inte');
      }
      return { transaction: data };
    }

    updates.updated_at = new Date().toISOString();

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('transactions')
        .update(updates)
        .eq('id', transactionId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error || !data) {
        throw new NotFoundException('Transaktion hittades inte');
      }

      return { transaction: data };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error updating transaction: ${error.message}`);
      throw new Error('Kunde inte uppdatera transaktion');
    }
  }

  /**
   * Delete a transaction
   */
  async deleteTransaction(userId: string, transactionId: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('transactions')
        .delete()
        .eq('id', transactionId)
        .eq('user_id', userId)
        .select('id')
        .single();

      if (error || !data) {
        throw new NotFoundException('Transaktion hittades inte');
      }

      return { message: 'Transaktion borttagen' };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting transaction: ${error.message}`);
      throw new Error('Kunde inte ta bort transaktion');
    }
  }
}
