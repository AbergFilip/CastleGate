import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MigrationService implements OnModuleInit {
  private readonly logger = new Logger(MigrationService.name);
  private readonly migrationsTable = 'schema_migrations';

  constructor(private readonly databaseService: DatabaseService) {}

  async onModuleInit() {
    // Kör migrations automatiskt vid start
    try {
      await this.runMigrations();
    } catch (error: any) {
      this.logger.error(`Fel vid automatisk migration: ${error.message}`);
      // Fortsätt ändå - migrations kan köras manuellt senare
    }
  }

  /**
   * Skapa migrations-tabell om den inte finns
   */
  async ensureMigrationsTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS ${this.migrationsTable} (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    await this.databaseService.query(query);
  }

  /**
   * Kör alla migrations från sql-mappen
   */
  async runMigrations() {
    this.logger.log('🔄 Kör migrations...');
    await this.ensureMigrationsTable();

    const sqlDir = path.join(process.cwd(), 'sql');
    if (!fs.existsSync(sqlDir)) {
      this.logger.warn(`SQL-mapp finns inte: ${sqlDir}`);
      return;
    }

    const files = fs
      .readdirSync(sqlDir)
      .filter((file) => {
        // Bara kör filer med nummerprefix (00X_)
        return file.endsWith('.sql') && /^\d{3}_/.test(file);
      })
      .sort();

    for (const file of files) {
      // Hoppa över Supabase-specifika filer
      if (file.includes('supabase') || file.includes('cleanup')) {
        continue;
      }

      const migrationName = file.replace('.sql', '');
      const hasRun = await this.hasMigrationRun(migrationName);

      if (hasRun) {
        this.logger.debug(`⏭️  Migration redan kör: ${file}`);
        continue;
      }

      try {
        this.logger.log(`📝 Kör migration: ${file}`);
        const sql = fs.readFileSync(path.join(sqlDir, file), 'utf-8');
        await this.databaseService.query(sql);
        await this.recordMigration(migrationName);
        this.logger.log(`✅ Migration klar: ${file}`);
      } catch (error: any) {
        this.logger.error(`❌ Fel vid migration ${file}: ${error.message}`);
        throw error;
      }
    }

    this.logger.log('✅ Alla migrations körda');
  }

  /**
   * Kontrollera om en migration redan har körts
   */
  private async hasMigrationRun(name: string): Promise<boolean> {
    const result = await this.databaseService.query<{ count: string }>(
      `SELECT COUNT(*) as count FROM ${this.migrationsTable} WHERE name = $1`,
      [name]
    );
    return parseInt(result.rows[0].count) > 0;
  }

  /**
   * Registrera att en migration har körts
   */
  private async recordMigration(name: string) {
    await this.databaseService.query(
      `INSERT INTO ${this.migrationsTable} (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
      [name]
    );
  }

  /**
   * Kör en specifik migration manuellt
   */
  async runMigration(fileName: string) {
    await this.ensureMigrationsTable();
    const migrationName = fileName.replace('.sql', '');
    const hasRun = await this.hasMigrationRun(migrationName);

    if (hasRun) {
      this.logger.warn(`Migration ${fileName} har redan körts`);
      return;
    }

    const sqlPath = path.join(process.cwd(), 'sql', fileName);
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`Migration-fil finns inte: ${sqlPath}`);
    }

    this.logger.log(`📝 Kör migration: ${fileName}`);
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    await this.databaseService.query(sql);
    await this.recordMigration(migrationName);
    this.logger.log(`✅ Migration klar: ${fileName}`);
  }
}
