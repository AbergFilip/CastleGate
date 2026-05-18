import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

export interface Boat {
  id: string;
  user_id: string;
  type: string;
  make: string;
  model: string;
  registration_number?: string;
  year?: number;
  length?: number;
  engine_type?: string;
  engine_power?: string;
  purchase_date?: Date;
  purchase_price?: number;
  current_value?: number;
  insurance_policy_number?: string;
  insurance_company?: string;
  insurance_expiry?: Date;
  mooring_location?: string;
  service_history?: any;
  documents?: any;
  images?: any;
  metadata?: any;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class BoatsService {
  private readonly logger = new Logger(BoatsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async getBoats(userId: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('boats')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error(`Error fetching boats: ${error.message}`);
        if (error.code === '42P01') {
          return { boats: [] };
        }
        throw new Error('Kunde inte hämta båtar');
      }

      return { boats: data || [] };
    } catch (error: any) {
      this.logger.error(`Error fetching boats: ${error.message}`);
      throw new Error('Kunde inte hämta båtar');
    }
  }

  async getBoatById(userId: string, id: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('boats')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        throw new NotFoundException('Båt hittades inte');
      }

      return { boat: data };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching boat: ${error.message}`);
      throw new Error('Kunde inte hämta båt');
    }
  }

  async createBoat(userId: string, createDto: any) {
    const insertData: any = { user_id: userId };

    for (const [key, value] of Object.entries(createDto)) {
      if (key !== 'user_id' && value !== undefined) {
        insertData[key] = value;
      }
    }

    if (Object.keys(insertData).length === 1) {
      throw new Error('Inga fält att skapa');
    }

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('boats')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        this.logger.error(`Error creating boat: ${error.message}`);
        throw new Error('Kunde inte skapa båt');
      }

      return { boat: data };
    } catch (error: any) {
      this.logger.error(`Error creating boat: ${error.message}`);
      throw new Error('Kunde inte skapa båt');
    }
  }

  async updateBoat(userId: string, id: string, updateDto: any) {
    const updates: any = {};

    for (const [key, value] of Object.entries(updateDto)) {
      if (key !== 'user_id' && value !== undefined) {
        updates[key] = value;
      }
    }

    if (Object.keys(updates).length === 0) {
      return this.getBoatById(userId, id);
    }

    updates.updated_at = new Date().toISOString();

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('boats')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error || !data) {
        throw new NotFoundException('Båt hittades inte');
      }

      return { boat: data };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error updating boat: ${error.message}`);
      throw new Error('Kunde inte uppdatera båt');
    }
  }

  async deleteBoat(userId: string, id: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('boats')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
        .select('id')
        .single();

      if (error || !data) {
        throw new NotFoundException('Båt hittades inte');
      }

      return { message: 'Båt borttagen' };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting boat: ${error.message}`);
      throw new Error('Kunde inte ta bort båt');
    }
  }
}
