import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { KeyVaultModule } from '../secrets/keyvault.module';

/**
 * Database Module
 * 
 * Global modul som tillhandahåller DatabaseService för alla moduler.
 * Ersätter SupabaseModule med direkt PostgreSQL-anslutning.
 */
@Global()
@Module({
  imports: [ConfigModule, KeyVaultModule],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
