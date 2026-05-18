import { Injectable, OnModuleInit, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { KeyVaultService } from '../secrets/keyvault.service';

/**
 * Database Service
 * 
 * Ersätter SupabaseService med direkt PostgreSQL-anslutning.
 * Använder connection pooling för prestanda.
 * 
 * Secrets hämtas från Key Vault (med fallback till env vars).
 */
@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private pool: Pool | null = null;

  constructor(
    private configService: ConfigService,
    private keyVaultService: KeyVaultService
  ) {}

  async onModuleInit() {
    try {
      // Hämta connection string från Key Vault eller env
      const connectionString =
        (await this.keyVaultService.getSecret('DATABASE_URL')) ||
        this.configService.get<string>('DATABASE_URL');

      if (!connectionString) {
        this.logger.warn(
          '⚠️ DATABASE_URL saknas. Lägg till i Key Vault eller .env-filen'
        );
        this.logger.warn(
          '   Format: postgresql://user:password@host:port/database'
        );
        return;
      }

      // Trim whitespace och logga (utan att visa lösenord)
      const cleanConnectionString = connectionString.trim();
      const maskedConnectionString = cleanConnectionString.replace(
        /:\/\/[^:]+:[^@]+@/,
        '://***:***@'
      );
      this.logger.debug(`Connection string: ${maskedConnectionString}`);

      // Skapa connection pool
      this.pool = new Pool({
        connectionString,
        max: 20, // Max antal connections i poolen
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      // Testa anslutningen
      const client = await this.pool.connect();
      const result = await client.query('SELECT NOW()');
      client.release();

      this.logger.log('✅ PostgreSQL-anslutning etablerad');
      this.logger.debug(`   Server time: ${result.rows[0].now}`);
    } catch (error: any) {
      this.logger.error(
        `❌ Fel vid anslutning till PostgreSQL: ${error.message}`
      );
      this.logger.warn(
        '⚠️ Kontrollera DATABASE_URL i .env'
      );
      this.logger.warn(
        '   För Docker: postgresql://postgres:postgres@localhost:5433/castlegate'
      );
      // I utveckling kan vi låta backend starta utan DB, men i produktion bör vi kasta fel
      // throw error;
    }
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
      this.logger.log('✅ PostgreSQL connection pool stängd');
    }
  }

  /**
   * Hämta en client från poolen (för transaktioner)
   */
  async getClient(): Promise<PoolClient> {
    if (!this.pool) {
      throw new Error(
        'Database pool not initialized. Check your DATABASE_URL configuration.'
      );
    }
    return await this.pool.connect();
  }

  /**
   * Kör en query och returnera resultat
   */
  async query<T extends QueryResultRow = any>(
    text: string,
    params?: any[]
  ): Promise<QueryResult<T>> {
    if (!this.pool) {
      throw new Error(
        'Database pool not initialized. Check your DATABASE_URL configuration.'
      );
    }

    const start = Date.now();
    try {
      const result = await this.pool.query<T>(text, params);
      const duration = Date.now() - start;
      
      this.logger.debug(`Query executed in ${duration}ms`, {
        query: text.substring(0, 100),
        rows: result.rowCount,
      });

      return result;
    } catch (error: any) {
      this.logger.error(`Query error: ${error.message}`, {
        query: text.substring(0, 100),
        error: error.stack,
      });
      throw error;
    }
  }

  /**
   * Kör en transaktion
   */
  async transaction<T>(
    callback: (client: PoolClient) => Promise<T>
  ): Promise<T> {
    const client = await this.getClient();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Hämta pool för avancerad användning
   */
  getPool(): Pool {
    if (!this.pool) {
      throw new Error(
        'Database pool not initialized. Check your DATABASE_URL configuration.'
      );
    }
    return this.pool;
  }

  /**
   * Kontrollera om databasen är ansluten
   */
  isConnected(): boolean {
    return this.pool !== null;
  }
}
