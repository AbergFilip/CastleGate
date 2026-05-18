import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

export interface NetworkConnection {
  id: string;
  user_id: string;
  name: string;
  relation?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  status?: string;
  avatar?: string;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class ConnectionsService {
  private readonly logger = new Logger(ConnectionsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async getConnections(userId: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('network_connections')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error(`Error fetching connections: ${error.message}`);
        if (error.code === '42P01') {
          return { connections: [] };
        }
        throw new Error('Kunde inte hämta kontakter');
      }

      return { connections: data || [] };
    } catch (error: any) {
      this.logger.error(`Error fetching connections: ${error.message}`);
      throw new Error('Kunde inte hämta kontakter');
    }
  }

  async getConnectionById(userId: string, id: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('network_connections')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        throw new NotFoundException('Kontakt hittades inte');
      }

      return { connection: data };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching connection: ${error.message}`);
      throw new Error('Kunde inte hämta kontakt');
    }
  }

  async createConnection(userId: string, createDto: any) {
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
        .from('network_connections')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        this.logger.error(`Error creating connection: ${error.message}`);
        throw new Error('Kunde inte skapa kontakt');
      }

      return { connection: data };
    } catch (error: any) {
      this.logger.error(`Error creating connection: ${error.message}`);
      throw new Error('Kunde inte skapa kontakt');
    }
  }

  async updateConnection(userId: string, id: string, updateDto: any) {
    const updates: any = {};

    for (const [key, value] of Object.entries(updateDto)) {
      if (key !== 'user_id' && value !== undefined) {
        updates[key] = value;
      }
    }

    if (Object.keys(updates).length === 0) {
      return this.getConnectionById(userId, id);
    }

    updates.updated_at = new Date().toISOString();

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('network_connections')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error || !data) {
        throw new NotFoundException('Kontakt hittades inte');
      }

      return { connection: data };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error updating connection: ${error.message}`);
      throw new Error('Kunde inte uppdatera kontakt');
    }
  }

  async deleteConnection(userId: string, id: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('network_connections')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
        .select('id')
        .single();

      if (error || !data) {
        throw new NotFoundException('Kontakt hittades inte');
      }

      return { message: 'Kontakt borttagen' };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting connection: ${error.message}`);
      throw new Error('Kunde inte ta bort kontakt');
    }
  }
}
