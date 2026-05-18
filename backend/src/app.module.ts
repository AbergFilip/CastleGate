import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { join } from 'path';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { BankidModule } from './bankid/bankid.module';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { OidcModule } from './auth/oidc/oidc.module';
import { UsersModule } from './users/users.module';
import { RbacModule } from './rbac/rbac.module';
import { DocumentsModule } from './documents/documents.module';
import { EconomyModule } from './economy/economy.module';
import { AssetsModule } from './assets/assets.module';
import { NetworkModule } from './network/network.module';
import { CommunicationModule } from './communication/communication.module';
import { SearchModule } from './search/search.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { AiModule } from './ai/ai.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { KeyVaultModule } from './secrets/keyvault.module';
import { DatabaseModule } from './database/database.module';
import { MigrationModule } from './database/migrations/migration.module';
import oidcConfig from './config/oidc.config';
import keyvaultConfig from './config/keyvault.config';
import tinkConfig from './config/tink.config';
import gocardlessConfig from './config/gocardless.config';
import lantmaterietConfig from './config/lantmateriet.config';
import { SecurityModule } from './security/security.module';
import { AuditModule } from './audit/audit.module';
import { AuditLogInterceptor } from './audit/audit.interceptor';
import { HealthModule } from './health/health.module';
import { TestDataModule } from './test-data/test-data.module';
import { SchoolsModule } from './schools/schools.module';
import { IceContactsModule } from './ice-contacts/ice-contacts.module';
import { GradesModule } from './grades/grades.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        join(__dirname, '..', '.env'),
        join(process.cwd(), '.env'),
        '.env',
      ],
      validationSchema: Joi.object({
        PORT: Joi.number().default(3001),
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        DATABASE_URL: Joi.string().required(),
        SUPABASE_URL: Joi.string().required(),
        SUPABASE_SERVICE_ROLE_KEY: Joi.string().required(),
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        FRONTEND_URL: Joi.string().default('http://localhost:5173'),
        ENABLE_TEST_DATA_TOOLS: Joi.string().valid('true', 'false').optional(),
      }),
      load: [oidcConfig, keyvaultConfig, tinkConfig, gocardlessConfig, lantmaterietConfig],
    }),
    KeyVaultModule,
    SecurityModule,
    AuditModule,
    DatabaseModule, // PostgreSQL database (ersätter Supabase för data)
    MigrationModule, // Database migrations
    SupabaseModule, // Behålls temporärt för auth (tills vi migrerar till Auth0 helt)
    BankidModule,
    HealthModule,
    TestDataModule,
    AuthModule,
    OidcModule,
    UsersModule,
    RbacModule,
    DocumentsModule,
    SchoolsModule,
    IceContactsModule,
    GradesModule,
    EconomyModule,
    AssetsModule,
    NetworkModule,
    CommunicationModule,
    SearchModule,
    BlockchainModule,
    AiModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
  ],
})
export class AppModule {}

