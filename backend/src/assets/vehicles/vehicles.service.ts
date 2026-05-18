import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

export interface Vehicle {
  id: string;
  user_id: string;
  type: string;
  make: string;
  model: string;
  registration_number?: string;
  year?: number;
  color?: string;
  vin?: string;
  purchase_date?: Date;
  purchase_price?: number;
  current_value?: number;
  insurance_policy_number?: string;
  insurance_company?: string;
  insurance_expiry?: Date;
  service_history?: any;
  documents?: any;
  images?: any;
  metadata?: any;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class VehiclesService {
  private readonly logger = new Logger(VehiclesService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async getVehicles(userId: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('vehicles')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error(`Error fetching vehicles: ${error.message}`);
        if (error.code === '42P01') {
          return { vehicles: [] };
        }
        throw new Error('Kunde inte hämta fordon');
      }

      return { vehicles: data || [] };
    } catch (error: any) {
      this.logger.error(`Error fetching vehicles: ${error.message}`);
      throw new Error('Kunde inte hämta fordon');
    }
  }

  async getVehicleById(userId: string, id: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        throw new NotFoundException('Fordon hittades inte');
      }

      return { vehicle: data };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching vehicle: ${error.message}`);
      throw new Error('Kunde inte hämta fordon');
    }
  }

  async createVehicle(userId: string, createDto: any) {
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
        .from('vehicles')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        this.logger.error(`Error creating vehicle: ${error.message}`);
        throw new Error('Kunde inte skapa fordon');
      }

      return { vehicle: data };
    } catch (error: any) {
      this.logger.error(`Error creating vehicle: ${error.message}`);
      throw new Error('Kunde inte skapa fordon');
    }
  }

  async updateVehicle(userId: string, id: string, updateDto: any) {
    const updates: any = {};

    for (const [key, value] of Object.entries(updateDto)) {
      if (key !== 'user_id' && value !== undefined) {
        updates[key] = value;
      }
    }

    if (Object.keys(updates).length === 0) {
      return this.getVehicleById(userId, id);
    }

    updates.updated_at = new Date().toISOString();

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('vehicles')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error || !data) {
        throw new NotFoundException('Fordon hittades inte');
      }

      return { vehicle: data };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error updating vehicle: ${error.message}`);
      throw new Error('Kunde inte uppdatera fordon');
    }
  }

  async deleteVehicle(userId: string, id: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('vehicles')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
        .select('id')
        .single();

      if (error || !data) {
        throw new NotFoundException('Fordon hittades inte');
      }

      return { message: 'Fordon borttaget' };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting vehicle: ${error.message}`);
      throw new Error('Kunde inte ta bort fordon');
    }
  }
}
