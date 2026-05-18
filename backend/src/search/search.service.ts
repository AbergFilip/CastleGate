import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

function escapeSearchQuery(query: string): string {
  return query.replace(/[%_\\]/g, '\\$&');
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async search(userId: string, query: string) {
    if (!query || query.length < 2) {
      return { results: [] };
    }

    const escapedQuery = escapeSearchQuery(query);
    const results: {
      documents: any[];
      contacts: any[];
      assets: any[];
    } = {
      documents: [],
      contacts: [],
      assets: [],
    };

    try {
      // Search documents
      const { data: documents } = await this.supabaseService
        .getClient()
        .from('documents')
        .select('id, title, category, created_at')
        .eq('user_id', userId)
        .ilike('title', `%${escapedQuery}%`)
        .limit(5);
      results.documents = documents || [];

      // Search contacts (network_connections)
      const { data: contacts } = await this.supabaseService
        .getClient()
        .from('network_connections')
        .select('id, name, relation, phone, email, avatar')
        .eq('user_id', userId)
        .or(`name.ilike.%${escapedQuery}%,email.ilike.%${escapedQuery}%`)
        .limit(5);
      results.contacts = contacts || [];

      // Search assets (properties)
      const { data: properties } = await this.supabaseService
        .getClient()
        .from('properties')
        .select('id, address, city, type')
        .eq('user_id', userId)
        .or(`address.ilike.%${escapedQuery}%,city.ilike.%${escapedQuery}%`)
        .limit(3);
      if (properties) {
        results.assets.push(
          ...properties.map((p: any) => ({
            ...p,
            type: 'property',
            name: `${p.address || ''}, ${p.city || ''}`,
          }))
        );
      }

      // Search vehicles
      const { data: vehicles } = await this.supabaseService
        .getClient()
        .from('vehicles')
        .select('id, make, model, registration_number')
        .eq('user_id', userId)
        .or(`make.ilike.%${escapedQuery}%,model.ilike.%${escapedQuery}%,registration_number.ilike.%${escapedQuery}%`)
        .limit(3);
      if (vehicles) {
        results.assets.push(
          ...vehicles.map((v: any) => ({
            ...v,
            type: 'vehicle',
            name: `${v.make} ${v.model} (${v.registration_number || ''})`,
          }))
        );
      }

      return results;
    } catch (error: any) {
      this.logger.error(`Error searching: ${error.message}`);
      return { results: [] };
    }
  }
}
