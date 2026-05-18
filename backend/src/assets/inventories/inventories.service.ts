import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoriesService {
  private readonly logger = new Logger(InventoriesService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async getInventories(
    userId: string,
    filters?: { type?: string; category?: string },
  ) {
    try {
      let q = this.supabaseService
        .getClient()
        .from('inventories')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (filters?.type) {
        q = q.eq('type', filters.type);
      }
      if (filters?.category) {
        q = q.eq('category', filters.category);
      }

      const { data, error } = await q;

      if (error) {
        this.logger.error(`Error fetching inventories: ${error.message}`);
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          return { inventories: [] };
        }
        throw new Error('Kunde inte hämta inventarier');
      }

      return { inventories: data || [] };
    } catch (error: any) {
      this.logger.error(`Error fetching inventories: ${error.message}`);
      throw new Error('Kunde inte hämta inventarier');
    }
  }

  async getInventoryById(userId: string, id: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('inventories')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        throw new NotFoundException('Inventarie hittades inte');
      }

      return { inventory: data };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Error fetching inventory: ${error.message}`);
      throw new Error('Kunde inte hämta inventarie');
    }
  }

  async createInventory(userId: string, dto: CreateInventoryDto) {
    const insertData: Record<string, unknown> = {
      user_id: userId,
      type: dto.type,
      category: dto.category,
      name: dto.name,
    };
    if (dto.description !== undefined) insertData.description = dto.description;
    if (dto.brand !== undefined) insertData.brand = dto.brand;
    if (dto.model !== undefined) insertData.model = dto.model;
    if (dto.serial_number !== undefined) insertData.serial_number = dto.serial_number;
    if (dto.location !== undefined) insertData.location = dto.location;

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('inventories')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        this.logger.error(`Error creating inventory: ${error.message}`);
        throw new Error('Kunde inte skapa inventarie');
      }

      return { inventory: data };
    } catch (error: any) {
      this.logger.error(`Error creating inventory: ${error.message}`);
      throw new Error('Kunde inte skapa inventarie');
    }
  }

  async updateInventory(userId: string, id: string, dto: UpdateInventoryDto) {
    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(dto)) {
      if (value !== undefined) updates[key] = value;
    }

    if (Object.keys(updates).length === 0) {
      return this.getInventoryById(userId, id);
    }

    updates.updated_at = new Date().toISOString();

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('inventories')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error || !data) {
        throw new NotFoundException('Inventarie hittades inte');
      }

      return { inventory: data };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Error updating inventory: ${error.message}`);
      throw new Error('Kunde inte uppdatera inventarie');
    }
  }

  async deleteInventory(userId: string, id: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('inventories')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
        .select('id')
        .single();

      if (error || !data) {
        throw new NotFoundException('Inventarie hittades inte');
      }

      return { message: 'Inventarie borttagen' };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Error deleting inventory: ${error.message}`);
      throw new Error('Kunde inte ta bort inventarie');
    }
  }
}
