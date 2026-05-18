import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateOfferDto } from './dto/create-offer.dto';

export interface Offer {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category?: string;
  badge?: string;
  price?: string;
  type?: string;
  link_url?: string;
  viewed: boolean;
  created_at: Date;
  expires_at?: Date;
}

@Injectable()
export class OffersService {
  private readonly logger = new Logger(OffersService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async getOffers(userId: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('offers')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error(`Error fetching offers: ${error.message}`);
        throw new Error('Could not fetch offers');
      }

      return data || [];
    } catch (error: any) {
      this.logger.error(`Error fetching offers: ${error.message}`);
      throw new Error('Could not fetch offers');
    }
  }

  async getOfferById(userId: string, id: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('offers')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        throw new NotFoundException('Offer not found');
      }

      // Mark as viewed if not already
      if (!data.viewed) {
        await this.supabaseService
          .getClient()
          .from('offers')
          .update({ viewed: true })
          .eq('id', id);
        data.viewed = true;
      }

      return data;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching offer: ${error.message}`);
      throw new Error('Could not fetch offer');
    }
  }

  async createOffer(targetUserId: string, createDto: CreateOfferDto) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('offers')
        .insert({
          user_id: targetUserId,
          title: createDto.title,
          description: createDto.description || null,
          category: createDto.category || null,
          badge: createDto.badge || null,
          price: createDto.price || null,
          type: createDto.type || null,
          link_url: createDto.linkUrl || null,
          expires_at: (createDto as any).expiresAt || null,
        })
        .select()
        .single();

      if (error) {
        this.logger.error(`Error creating offer: ${error.message}`);
        throw new Error('Could not create offer');
      }

      return data;
    } catch (error: any) {
      this.logger.error(`Error creating offer: ${error.message}`);
      throw new Error('Could not create offer');
    }
  }

  async deleteOffer(userId: string, id: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('offers')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
        .select('id')
        .single();

      if (error || !data) {
        throw new NotFoundException('Offer not found');
      }

      return { message: 'Offer deleted' };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting offer: ${error.message}`);
      throw new Error('Could not delete offer');
    }
  }
}
