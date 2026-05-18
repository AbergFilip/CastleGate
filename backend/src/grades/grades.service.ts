import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';

@Injectable()
export class GradesService {
  private readonly logger = new Logger(GradesService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async getGrades(userId: string, educationLevel?: string) {
    try {
      let q = this.supabaseService
        .getClient()
        .from('grades')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (educationLevel) {
        q = q.eq('education_level', educationLevel);
      }

      const { data, error } = await q;

      if (error) {
        this.logger.error(`Error fetching grades: ${error.message}`);
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          return { grades: [] };
        }
        throw new Error('Kunde inte hämta betyg');
      }

      return { grades: data || [] };
    } catch (e: any) {
      this.logger.error(`Error fetching grades: ${e.message}`);
      throw new Error('Kunde inte hämta betyg');
    }
  }

  async assertOwned(userId: string, gradeId: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('grades')
      .select('id')
      .eq('id', gradeId)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Betyg hittades inte');
    }
  }

  async createGrade(userId: string, dto: CreateGradeDto) {
    const insert = {
      user_id: userId,
      education_level: dto.education_level,
      school_name: dto.school_name ?? null,
      program: dto.program ?? null,
      year: dto.year ?? null,
      semester: dto.semester ?? null,
      courses: dto.courses ?? null,
      document_id: dto.document_id ?? null,
    };

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('grades')
        .insert(insert)
        .select()
        .single();

      if (error) {
        this.logger.error(`Error creating grade: ${error.message}`);
        throw new Error('Kunde inte skapa betyg');
      }

      return { grade: data };
    } catch (e: any) {
      this.logger.error(`Error creating grade: ${e.message}`);
      throw new Error('Kunde inte skapa betyg');
    }
  }

  async updateGrade(userId: string, id: string, dto: UpdateGradeDto) {
    await this.assertOwned(userId, id);

    const patch: Record<string, unknown> = {};
    if (dto.education_level !== undefined) patch.education_level = dto.education_level;
    if (dto.school_name !== undefined) patch.school_name = dto.school_name;
    if (dto.program !== undefined) patch.program = dto.program;
    if (dto.year !== undefined) patch.year = dto.year;
    if (dto.semester !== undefined) patch.semester = dto.semester;
    if (dto.courses !== undefined) patch.courses = dto.courses;
    if (dto.document_id !== undefined) patch.document_id = dto.document_id;

    if (Object.keys(patch).length === 0) {
      const { data: row } = await this.supabaseService
        .getClient()
        .from('grades')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();
      return { grade: row };
    }

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('grades')
        .update(patch)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        this.logger.error(`Error updating grade: ${error.message}`);
        throw new Error('Kunde inte uppdatera betyg');
      }

      return { grade: data };
    } catch (e: any) {
      if (e instanceof NotFoundException) throw e;
      this.logger.error(`Error updating grade: ${e.message}`);
      throw new Error('Kunde inte uppdatera betyg');
    }
  }

  async deleteGrade(userId: string, id: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('grades')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
        .select('id')
        .single();

      if (error || !data) {
        throw new NotFoundException('Betyg hittades inte');
      }

      return { message: 'Betyg borttaget' };
    } catch (e: any) {
      if (e instanceof NotFoundException) throw e;
      this.logger.error(`Error deleting grade: ${e.message}`);
      throw new Error('Kunde inte ta bort betyg');
    }
  }
}
