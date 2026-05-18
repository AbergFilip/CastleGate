import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { QueryDocumentsDto } from './dto/query-documents.dto';

export interface Document {
  id: string;
  user_id: string;
  category: string;
  subcategory?: string;
  title: string;
  description?: string;
  file_url?: string;
  file_name?: string;
  file_type?: string;
  file_size?: number;
  metadata?: any;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Get all documents for a user
   */
  async getDocuments(userId: string, query: QueryDocumentsDto) {
    try {
      let queryBuilder = this.supabaseService
        .getClient()
        .from('documents')
        .select('*')
        .eq('user_id', userId);

      if (query.category) {
        queryBuilder = queryBuilder.eq('category', query.category);
      }

      if (query.subcategory) {
        queryBuilder = queryBuilder.eq('subcategory', query.subcategory);
      }

      if (query.search) {
        queryBuilder = queryBuilder.ilike('title', `%${query.search}%`);
      }

      queryBuilder = queryBuilder.order('created_at', { ascending: false });

      const { data, error } = await queryBuilder;

      if (error) {
        this.logger.error(`Error fetching documents: ${error.message}`);
        throw new Error('Kunde inte hämta dokument');
      }

      return { documents: data || [] };
    } catch (error: any) {
      this.logger.error(`Error fetching documents: ${error.message}`);
      throw new Error('Kunde inte hämta dokument');
    }
  }

  /**
   * Get a single document by ID
   */
  async getDocumentById(userId: string, documentId: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        throw new NotFoundException('Dokument hittades inte');
      }

      return { document: data };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching document: ${error.message}`);
      throw new Error('Kunde inte hämta dokument');
    }
  }

  /**
   * Create a new document
   */
  async createDocument(userId: string, createDto: CreateDocumentDto) {
    if (!createDto.category || !createDto.title) {
      throw new BadRequestException('Kategori och titel krävs');
    }

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('documents')
        .insert({
          user_id: userId,
          category: createDto.category,
          subcategory: createDto.subcategory || null,
          title: createDto.title,
          description: createDto.description || null,
          file_url: createDto.file_url || null,
          file_name: createDto.file_name || null,
          file_type: createDto.file_type || null,
          file_size: createDto.file_size || null,
          metadata: createDto.metadata || {},
        })
        .select()
        .single();

      if (error) {
        this.logger.error(`Error creating document: ${error.message}`);
        throw new Error('Kunde inte skapa dokument');
      }

      return { document: data };
    } catch (error: any) {
      this.logger.error(`Error creating document: ${error.message}`);
      throw new Error('Kunde inte skapa dokument');
    }
  }

  /**
   * Update a document
   */
  async updateDocument(
    userId: string,
    documentId: string,
    updateDto: UpdateDocumentDto
  ) {
    // Bygg update-objekt (ta bort undefined)
    const updates: any = {};
    if (updateDto.title !== undefined) updates.title = updateDto.title;
    if (updateDto.description !== undefined) updates.description = updateDto.description;
    if (updateDto.file_url !== undefined) updates.file_url = updateDto.file_url;
    if (updateDto.file_name !== undefined) updates.file_name = updateDto.file_name;
    if (updateDto.file_type !== undefined) updates.file_type = updateDto.file_type;
    if (updateDto.file_size !== undefined) updates.file_size = updateDto.file_size;
    if (updateDto.metadata !== undefined) updates.metadata = updateDto.metadata || {};

    if (Object.keys(updates).length === 0) {
      // Inga ändringar, returnera befintligt dokument
      return this.getDocumentById(userId, documentId);
    }

    updates.updated_at = new Date().toISOString();

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('documents')
        .update(updates)
        .eq('id', documentId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error || !data) {
        throw new NotFoundException('Dokument hittades inte');
      }

      return { document: data };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error updating document: ${error.message}`);
      throw new Error('Kunde inte uppdatera dokument');
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(userId: string, documentId: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('documents')
        .delete()
        .eq('id', documentId)
        .eq('user_id', userId)
        .select('id')
        .single();

      if (error || !data) {
        throw new NotFoundException('Dokument hittades inte');
      }

      return { message: 'Dokument borttaget' };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting document: ${error.message}`);
      throw new Error('Kunde inte ta bort dokument');
    }
  }
}

