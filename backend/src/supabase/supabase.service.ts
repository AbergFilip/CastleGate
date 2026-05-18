import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { KeyVaultService } from '../secrets/keyvault.service';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseService.name);
  private client!: SupabaseClient;

  constructor(
    private configService: ConfigService,
    private keyVaultService: KeyVaultService
  ) {}

  async onModuleInit() {
    // Hämta secrets från Key Vault (med fallback till env vars)
    const supabaseUrl =
      (await this.keyVaultService.getSecret('SUPABASE_URL')) ||
      this.configService.get<string>('SUPABASE_URL');
    
    const supabaseServiceKey =
      (await this.keyVaultService.getSecret('SUPABASE_SERVICE_ROLE_KEY')) ||
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      this.logger.warn(
        '⚠️ Supabase credentials saknas. Lägg till SUPABASE_URL och SUPABASE_SERVICE_ROLE_KEY i Key Vault eller .env-filen'
      );
      return;
    }

    this.client = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    this.logger.log('✅ Supabase-klient skapad för backend');
  }

  getClient(): SupabaseClient {
    if (!this.client) {
      throw new Error('Supabase client not initialized. Check your .env configuration.');
    }
    return this.client;
  }
}

