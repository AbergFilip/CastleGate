import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';

export interface Investment {
  id: string;
  user_id: string;
  provider: string;
  account_name: string;
  investment_type: string;
  symbol?: string;
  amount: number;
  quantity?: number;
  purchase_price?: number;
  current_price?: number;
  currency: string;
  growth_percent?: number;
  account_type?: string;
  external_url?: string;
  notes?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class InvestmentsService {
  private readonly logger = new Logger(InvestmentsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Get all investments for a user
   */
  async getInvestments(userId: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('investments')
        .select('*')
        .eq('user_id', userId)
        .order('provider', { ascending: true })
        .order('account_name', { ascending: true });

      if (error) {
        this.logger.error(`Error fetching investments: ${error.message}`);
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          return { investments: [], total: 0, totalGrowth: 0 };
        }
        throw new Error('Kunde inte hämta investeringar');
      }

      const investments = data || [];

      // Calculate total and average growth
      const total = investments.reduce(
        (sum, inv) => sum + (parseFloat(String(inv.amount)) || 0),
        0
      );
      const totalGrowth =
        investments.reduce((sum, inv) => {
          const growth = parseFloat(String(inv.growth_percent)) || 0;
          const amount = parseFloat(String(inv.amount)) || 0;
          return sum + (growth * amount) / 100;
        }, 0) /
          total *
          100 || 0;

      return { investments, total, totalGrowth: totalGrowth || 0 };
    } catch (error: any) {
      this.logger.error(`Error fetching investments: ${error.message}`);
      throw new Error('Kunde inte hämta investeringar');
    }
  }

  /**
   * Get a single investment by ID
   */
  async getInvestmentById(userId: string, investmentId: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('investments')
        .select('*')
        .eq('id', investmentId)
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        throw new NotFoundException('Investering hittades inte');
      }

      return { investment: data };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching investment: ${error.message}`);
      throw new Error('Kunde inte hämta investering');
    }
  }

  /**
   * Create a new investment
   */
  async createInvestment(userId: string, createDto: CreateInvestmentDto) {
    if (!createDto.provider || !createDto.account_name || !createDto.investment_type) {
      throw new BadRequestException('Provider, kontonamn och investeringstyp krävs');
    }

    // Duplikat-skydd: samma symbol + provider = redan tillagd
    if (createDto.symbol) {
      const { data: existing } = await this.supabaseService
        .getClient()
        .from('investments')
        .select('id')
        .eq('user_id', userId)
        .eq('provider', createDto.provider.trim())
        .eq('symbol', createDto.symbol.trim())
        .maybeSingle();
      if (existing) {
        this.logger.debug(`Investering ${createDto.symbol} från ${createDto.provider} finns redan, hoppar över`);
        return { investment: existing, duplicate: true };
      }
    }

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('investments')
        .insert({
          user_id: userId,
          provider: createDto.provider.trim(),
          account_name: createDto.account_name.trim(),
          investment_type: createDto.investment_type.trim(),
          symbol: createDto.symbol?.trim() || null,
          amount: createDto.amount ? parseFloat(String(createDto.amount)) : 0,
          quantity: createDto.quantity ? parseFloat(String(createDto.quantity)) : null,
          purchase_price: createDto.purchase_price ? parseFloat(String(createDto.purchase_price)) : null,
          current_price: createDto.current_price ? parseFloat(String(createDto.current_price)) : null,
          currency: createDto.currency || 'SEK',
          growth_percent: createDto.growth_percent ? parseFloat(String(createDto.growth_percent)) : null,
          account_type: createDto.account_type || null,
          external_url: createDto.external_url || null,
          notes: createDto.notes || null,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        this.logger.error(`Error creating investment: ${error.message}`);
        throw new Error('Kunde inte skapa investering');
      }

      return { investment: data };
    } catch (error: any) {
      this.logger.error(`Error creating investment: ${error.message}`);
      throw new Error('Kunde inte skapa investering');
    }
  }

  /**
   * Update an investment
   */
  async updateInvestment(
    userId: string,
    investmentId: string,
    updateDto: UpdateInvestmentDto
  ) {
    const updates: any = {};
    const allowedFields = [
      'provider',
      'account_name',
      'investment_type',
      'symbol',
      'amount',
      'quantity',
      'purchase_price',
      'current_price',
      'currency',
      'growth_percent',
      'account_type',
      'external_url',
      'notes',
      'is_active',
    ];

    for (const field of allowedFields) {
      const value = (updateDto as any)[field];
      if (value !== undefined) {
        if (
          ['amount', 'quantity', 'purchase_price', 'current_price', 'growth_percent'].includes(
            field
          )
        ) {
          updates[field] = value ? parseFloat(String(value)) : null;
        } else if (typeof value === 'string') {
          updates[field] = value.trim() || null;
        } else {
          updates[field] = value;
        }
      }
    }

    if (Object.keys(updates).length === 0) {
      return this.getInvestmentById(userId, investmentId);
    }

    updates.updated_at = new Date().toISOString();

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('investments')
        .update(updates)
        .eq('id', investmentId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error || !data) {
        throw new NotFoundException('Investering hittades inte');
      }

      return { investment: data };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error updating investment: ${error.message}`);
      throw new Error('Kunde inte uppdatera investering');
    }
  }

  /**
   * Delete an investment
   */
  async deleteInvestment(userId: string, investmentId: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('investments')
        .delete()
        .eq('id', investmentId)
        .eq('user_id', userId)
        .select('id')
        .single();

      if (error || !data) {
        throw new NotFoundException('Investering hittades inte');
      }

      return { message: 'Investering borttagen' };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting investment: ${error.message}`);
      throw new Error('Kunde inte ta bort investering');
    }
  }
}
