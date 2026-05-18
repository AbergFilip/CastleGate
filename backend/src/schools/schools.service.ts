import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { CreateSchoolContactDto } from './dto/create-school-contact.dto';

@Injectable()
export class SchoolsService {
  private readonly logger = new Logger(SchoolsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async getSchools(userId: string, type?: string) {
    try {
      let q = this.supabaseService
        .getClient()
        .from('schools')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (type) {
        q = q.eq('type', type);
      }

      const { data, error } = await q;

      if (error) {
        this.logger.error(`Error fetching schools: ${error.message}`);
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          return { schools: [] };
        }
        throw new Error('Kunde inte hämta skolor');
      }

      return { schools: data || [] };
    } catch (e: any) {
      this.logger.error(`Error fetching schools: ${e.message}`);
      throw new Error('Kunde inte hämta skolor');
    }
  }

  async assertSchoolOwned(userId: string, schoolId: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('schools')
      .select('id')
      .eq('id', schoolId)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Skola hittades inte');
    }
  }

  async createSchool(userId: string, dto: CreateSchoolDto) {
    const insert = {
      user_id: userId,
      name: dto.name,
      type: dto.type,
      address: dto.address ?? null,
      phone: dto.phone ?? null,
      email: dto.email ?? null,
    };

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('schools')
        .insert(insert)
        .select()
        .single();

      if (error) {
        this.logger.error(`Error creating school: ${error.message}`);
        throw new Error('Kunde inte skapa skola');
      }

      return { school: data };
    } catch (e: any) {
      if (e instanceof NotFoundException) throw e;
      this.logger.error(`Error creating school: ${e.message}`);
      throw new Error('Kunde inte skapa skola');
    }
  }

  async deleteSchool(userId: string, id: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('schools')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
        .select('id')
        .single();

      if (error || !data) {
        throw new NotFoundException('Skola hittades inte');
      }

      return { message: 'Skola borttagen' };
    } catch (e: any) {
      if (e instanceof NotFoundException) throw e;
      this.logger.error(`Error deleting school: ${e.message}`);
      throw new Error('Kunde inte ta bort skola');
    }
  }

  async getContacts(userId: string, schoolId: string) {
    await this.assertSchoolOwned(userId, schoolId);

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('school_contacts')
        .select('*')
        .eq('school_id', schoolId)
        .order('created_at', { ascending: true });

      if (error) {
        this.logger.error(`Error fetching contacts: ${error.message}`);
        throw new Error('Kunde inte hämta kontakter');
      }

      return { contacts: data || [] };
    } catch (e: any) {
      if (e instanceof NotFoundException) throw e;
      throw new Error('Kunde inte hämta kontakter');
    }
  }

  async createContact(userId: string, schoolId: string, dto: CreateSchoolContactDto) {
    await this.assertSchoolOwned(userId, schoolId);

    const insert = {
      school_id: schoolId,
      name: dto.name,
      role: dto.role ?? null,
      phone: dto.phone ?? null,
      email: dto.email ?? null,
    };

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('school_contacts')
        .insert(insert)
        .select()
        .single();

      if (error) {
        this.logger.error(`Error creating contact: ${error.message}`);
        throw new Error('Kunde inte skapa kontakt');
      }

      return { contact: data };
    } catch (e: any) {
      if (e instanceof NotFoundException) throw e;
      throw new Error('Kunde inte skapa kontakt');
    }
  }

  async deleteContact(userId: string, schoolId: string, contactId: string) {
    await this.assertSchoolOwned(userId, schoolId);

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('school_contacts')
        .delete()
        .eq('id', contactId)
        .eq('school_id', schoolId)
        .select('id')
        .single();

      if (error || !data) {
        throw new NotFoundException('Kontakt hittades inte');
      }

      return { message: 'Kontakt borttagen' };
    } catch (e: any) {
      if (e instanceof NotFoundException) throw e;
      throw new Error('Kunde inte ta bort kontakt');
    }
  }
}
