import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

export interface Property {
  id: string;
  user_id: string;
  type: string;
  address: string;
  city?: string;
  postal_code?: string;
  country?: string;
  property_type?: string;
  size_sqm?: number;
  rooms?: number;
  floor?: string;
  purchase_date?: Date;
  purchase_price?: number;
  current_value?: number;
  valuation_date?: Date;
  valuation_source?: string;
  description?: string;
  images?: any;
  documents?: any;
  metadata?: any;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class PropertiesService {
  private readonly logger = new Logger(PropertiesService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async getProperties(userId: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('properties')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error(`Error fetching properties: ${error.message}`);
        if (error.code === '42P01') {
          return { properties: [] };
        }
        throw new Error('Kunde inte hämta fastigheter');
      }

      return { properties: data || [] };
    } catch (error: any) {
      this.logger.error(`Error fetching properties: ${error.message}`);
      throw new Error('Kunde inte hämta fastigheter');
    }
  }

  async getPropertyById(userId: string, id: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('properties')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        throw new NotFoundException('Fastighet hittades inte');
      }

      return { property: data };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching property: ${error.message}`);
      throw new Error('Kunde inte hämta fastighet');
    }
  }

  /**
   * Säkerställ att användaren finns i public.users (krävs för FK).
   * Synkar från auth.users om användaren saknas.
   */
  async ensureUserExists(userId: string): Promise<void> {
    const supabase = this.supabaseService.getClient();
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();
    if (existing) return;

    try {
      const { data: authUser } = await supabase.auth.admin.getUserById(userId);
      const u = authUser?.user;
      const email = u?.email || `user-${userId.slice(0, 8)}@castlegate.local`;
      const name = u?.user_metadata?.name || u?.email?.split('@')[0] || 'Användare';
      const { error } = await supabase.from('users').upsert(
        {
          id: userId,
          email,
          name,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );
      if (error) this.logger.warn(`ensureUserExists upsert: ${error.message}`);
    } catch (e: any) {
      this.logger.warn(`Could not ensure user exists: ${e?.message}`);
    }
  }

  async createProperty(userId: string, createDto: any) {
    await this.ensureUserExists(userId);

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
        .from('properties')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        this.logger.error(`Error creating property: ${error.message}`);
        throw new Error(`Kunde inte skapa fastighet: ${error.message}`);
      }

      return { property: data };
    } catch (error: any) {
      this.logger.error(`Error creating property: ${error?.message}`);
      throw new Error(error?.message || 'Kunde inte skapa fastighet');
    }
  }

  async updateProperty(userId: string, id: string, updateDto: any) {
    const updates: any = {};

    for (const [key, value] of Object.entries(updateDto)) {
      if (key !== 'user_id' && value !== undefined) {
        updates[key] = value;
      }
    }

    if (Object.keys(updates).length === 0) {
      return this.getPropertyById(userId, id);
    }

    updates.updated_at = new Date().toISOString();

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('properties')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error || !data) {
        throw new NotFoundException('Fastighet hittades inte');
      }

      return { property: data };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error updating property: ${error.message}`);
      throw new Error('Kunde inte uppdatera fastighet');
    }
  }

  async deleteProperty(userId: string, id: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('properties')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
        .select('id')
        .single();

      if (error || !data) {
        throw new NotFoundException('Fastighet hittades inte');
      }

      return { message: 'Fastighet borttagen' };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting property: ${error.message}`);
      throw new Error('Kunde inte ta bort fastighet');
    }
  }
}
