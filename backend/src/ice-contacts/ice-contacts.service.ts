import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateIceContactDto } from './dto/create-ice-contact.dto';
import { UpdateIceContactDto } from './dto/update-ice-contact.dto';

@Injectable()
export class IceContactsService {
  private readonly logger = new Logger(IceContactsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async getContacts(userId: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('ice_contacts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) {
        this.logger.error(`Error fetching ICE contacts: ${error.message}`);
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          return { contacts: [] };
        }
        throw new Error('Kunde inte hämta kontakter');
      }

      return { contacts: data || [] };
    } catch (e: any) {
      this.logger.error(`Error fetching ICE contacts: ${e.message}`);
      throw new Error('Kunde inte hämta kontakter');
    }
  }

  async createContact(userId: string, dto: CreateIceContactDto) {
    const insert = {
      user_id: userId,
      name: dto.name,
      relation: dto.relation ?? null,
      phone: dto.phone ?? null,
      email: dto.email ?? null,
      address: dto.address ?? null,
      notes: dto.notes ?? null,
    };

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('ice_contacts')
        .insert(insert)
        .select()
        .single();

      if (error) {
        this.logger.error(`Error creating ICE contact: ${error.message}`);
        throw new Error('Kunde inte skapa kontakt');
      }

      return { contact: data };
    } catch (e: any) {
      this.logger.error(`Error creating ICE contact: ${e.message}`);
      throw new Error('Kunde inte skapa kontakt');
    }
  }

  async updateContact(userId: string, id: string, dto: UpdateIceContactDto) {
    await this.assertOwned(userId, id);

    const patch: Record<string, unknown> = {};
    if (dto.name !== undefined) patch.name = dto.name;
    if (dto.relation !== undefined) patch.relation = dto.relation;
    if (dto.phone !== undefined) patch.phone = dto.phone;
    if (dto.email !== undefined) patch.email = dto.email;
    if (dto.address !== undefined) patch.address = dto.address;
    if (dto.notes !== undefined) patch.notes = dto.notes;

    if (Object.keys(patch).length === 0) {
      const { data: row } = await this.supabaseService
        .getClient()
        .from('ice_contacts')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();
      return { contact: row };
    }

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('ice_contacts')
        .update(patch)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        this.logger.error(`Error updating ICE contact: ${error.message}`);
        throw new Error('Kunde inte uppdatera kontakt');
      }

      return { contact: data };
    } catch (e: any) {
      if (e instanceof NotFoundException) throw e;
      this.logger.error(`Error updating ICE contact: ${e.message}`);
      throw new Error('Kunde inte uppdatera kontakt');
    }
  }

  async deleteContact(userId: string, id: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('ice_contacts')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
        .select('id')
        .single();

      if (error || !data) {
        throw new NotFoundException('Kontakt hittades inte');
      }

      return { message: 'Kontakt borttagen' };
    } catch (e: any) {
      if (e instanceof NotFoundException) throw e;
      this.logger.error(`Error deleting ICE contact: ${e.message}`);
      throw new Error('Kunde inte ta bort kontakt');
    }
  }

  private async assertOwned(userId: string, id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('ice_contacts')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Kontakt hittades inte');
    }
  }
}
