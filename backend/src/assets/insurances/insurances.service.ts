import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

export interface Insurance {
  id: string;
  user_id: string;
  category: string;
  type: string;
  insurance_company: string;
  policy_number?: string;
  coverage_amount?: number;
  premium?: number;
  premium_frequency?: string;
  start_date?: Date;
  expiry_date?: Date;
  renewal_date?: Date;
  deductible?: number;
  linked_property_id?: string;
  linked_property_type?: string;
  documents?: any;
  notes?: string;
  metadata?: any;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class InsurancesService {
  private readonly logger = new Logger(InsurancesService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async getInsurances(userId: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('insurances')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error(`Error fetching insurances: ${error.message}`);
        if (error.code === '42P01') {
          return { insurances: [] };
        }
        throw new Error('Kunde inte hämta försäkringar');
      }

      return { insurances: data || [] };
    } catch (error: any) {
      this.logger.error(`Error fetching insurances: ${error.message}`);
      throw new Error('Kunde inte hämta försäkringar');
    }
  }

  async getInsuranceById(userId: string, id: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('insurances')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        throw new NotFoundException('Försäkring hittades inte');
      }

      return { insurance: data };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching insurance: ${error.message}`);
      throw new Error('Kunde inte hämta försäkring');
    }
  }

  async createInsurance(userId: string, createDto: any) {
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
        .from('insurances')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        this.logger.error(`Error creating insurance: ${error.message}`);
        throw new Error('Kunde inte skapa försäkring');
      }

      return { insurance: data };
    } catch (error: any) {
      this.logger.error(`Error creating insurance: ${error.message}`);
      throw new Error('Kunde inte skapa försäkring');
    }
  }

  async updateInsurance(userId: string, id: string, updateDto: any) {
    const updates: any = {};

    for (const [key, value] of Object.entries(updateDto)) {
      if (key !== 'user_id' && value !== undefined) {
        updates[key] = value;
      }
    }

    if (Object.keys(updates).length === 0) {
      return this.getInsuranceById(userId, id);
    }

    updates.updated_at = new Date().toISOString();

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('insurances')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error || !data) {
        throw new NotFoundException('Försäkring hittades inte');
      }

      return { insurance: data };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error updating insurance: ${error.message}`);
      throw new Error('Kunde inte uppdatera försäkring');
    }
  }

  async deleteInsurance(userId: string, id: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('insurances')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
        .select('id')
        .single();

      if (error || !data) {
        throw new NotFoundException('Försäkring hittades inte');
      }

      return { message: 'Försäkring borttagen' };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting insurance: ${error.message}`);
      throw new Error('Kunde inte ta bort försäkring');
    }
  }
}
