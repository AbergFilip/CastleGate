import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

export interface Card {
  id: string;
  user_id: string;
  card_type: string;
  bank_name?: string;
  card_name: string;
  last_four?: string;
  card_number?: string;
  balance: number;
  credit_limit?: number;
  available_credit?: number;
  currency: string;
  expiry_date?: Date;
  cvv?: string;
  is_active: boolean;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class CardsService {
  private readonly logger = new Logger(CardsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Get all cards for a user
   */
  async getCards(userId: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('cards')
        .select('*')
        .eq('user_id', userId)
        .order('card_type', { ascending: true })
        .order('card_name', { ascending: true });

      if (error) {
        this.logger.error(`Error fetching cards: ${error.message}`);
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          return { cards: [] };
        }
        throw new Error('Kunde inte hämta kort');
      }

      return { cards: data || [] };
    } catch (error: any) {
      this.logger.error(`Error fetching cards: ${error.message}`);
      throw new Error('Kunde inte hämta kort');
    }
  }

  /**
   * Get a single card by ID
   */
  async getCardById(userId: string, cardId: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('cards')
        .select('*')
        .eq('id', cardId)
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        throw new NotFoundException('Kort hittades inte');
      }

      return { card: data };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching card: ${error.message}`);
      throw new Error('Kunde inte hämta kort');
    }
  }

  /**
   * Create a new card
   */
  async createCard(userId: string, createDto: CreateCardDto) {
    if (!createDto.card_type || !createDto.card_name) {
      throw new BadRequestException('Korttyp och kortnamn krävs');
    }

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('cards')
        .insert({
          user_id: userId,
          card_type: createDto.card_type.trim(),
          bank_name: createDto.bank_name?.trim() || null,
          card_name: createDto.card_name.trim(),
          last_four: createDto.last_four || null,
          card_number: createDto.card_number || null,
          balance: createDto.balance ? parseFloat(String(createDto.balance)) : 0,
          credit_limit: createDto.credit_limit ? parseFloat(String(createDto.credit_limit)) : null,
          available_credit: createDto.available_credit ? parseFloat(String(createDto.available_credit)) : null,
          currency: createDto.currency || 'SEK',
          expiry_date: createDto.expiry_date || null,
          notes: createDto.notes || null,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        this.logger.error(`Error creating card: ${error.message}`);
        throw new Error('Kunde inte skapa kort');
      }

      return { card: data };
    } catch (error: any) {
      this.logger.error(`Error creating card: ${error.message}`);
      throw new Error('Kunde inte skapa kort');
    }
  }

  /**
   * Update a card
   */
  async updateCard(userId: string, cardId: string, updateDto: UpdateCardDto) {
    const updates: any = {};
    if (updateDto.card_type !== undefined) updates.card_type = updateDto.card_type.trim();
    if (updateDto.bank_name !== undefined) updates.bank_name = updateDto.bank_name?.trim() || null;
    if (updateDto.card_name !== undefined) updates.card_name = updateDto.card_name.trim();
    if (updateDto.last_four !== undefined) updates.last_four = updateDto.last_four || null;
    if (updateDto.card_number !== undefined) updates.card_number = updateDto.card_number || null;
    if (updateDto.balance !== undefined) updates.balance = parseFloat(String(updateDto.balance)) || 0;
    if (updateDto.credit_limit !== undefined) updates.credit_limit = updateDto.credit_limit ? parseFloat(String(updateDto.credit_limit)) : null;
    if (updateDto.available_credit !== undefined) updates.available_credit = updateDto.available_credit ? parseFloat(String(updateDto.available_credit)) : null;
    if (updateDto.currency !== undefined) updates.currency = updateDto.currency;
    if (updateDto.expiry_date !== undefined) updates.expiry_date = updateDto.expiry_date || null;
    if (updateDto.notes !== undefined) updates.notes = updateDto.notes || null;
    if (updateDto.is_active !== undefined) updates.is_active = updateDto.is_active;

    if (Object.keys(updates).length === 0) {
      return this.getCardById(userId, cardId);
    }

    updates.updated_at = new Date().toISOString();

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('cards')
        .update(updates)
        .eq('id', cardId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error || !data) {
        throw new NotFoundException('Kort hittades inte');
      }

      return { card: data };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error updating card: ${error.message}`);
      throw new Error('Kunde inte uppdatera kort');
    }
  }

  /**
   * Delete a card
   */
  async deleteCard(userId: string, cardId: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('cards')
        .delete()
        .eq('id', cardId)
        .eq('user_id', userId)
        .select('id')
        .single();

      if (error || !data) {
        throw new NotFoundException('Kort hittades inte');
      }

      return { message: 'Kort borttaget' };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting card: ${error.message}`);
      throw new Error('Kunde inte ta bort kort');
    }
  }
}
