# PostgreSQL Migration Guide

## Översikt
Detta dokument beskriver hur man migrerar från Supabase till ren PostgreSQL.

## Status
✅ **Klar:**
- Migrationssystem skapat (`MigrationService`)
- Grundtabeller migrerade (users, documents, bank_accounts, rbac, messages)
- DocumentsService migrerad som exempel

⏳ **Pågående:**
- Migrera resterande SQL-filer
- Migrera resterande services

## Migrerade SQL-filer

### Nya migrationsfiler (nummerade för ordning):
1. `001_create_users_table.sql` - Grundtabell för användare
2. `002_create_documents_table.sql` - Dokument, ICE kontakter, skolor, betyg
3. `003_create_bank_accounts_table.sql` - Bankkonton
4. `004_create_rbac_tables.sql` - Roller och behörigheter
5. `005_create_messages_table.sql` - Meddelanden

### Ändringar i migrerade filer:
- ✅ `auth.users(id)` → `public.users(id)`
- ✅ RLS (Row Level Security) policies borttagna
- ✅ `auth.uid()` referenser borttagna
- ✅ Triggers för `updated_at` behållna
- ✅ Index behållna

## Migrerade Services

### DocumentsService
- ✅ Ersatt `SupabaseService` med `DatabaseService`
- ✅ Konverterat Supabase query builder till SQL queries
- ✅ User ID-validering i varje query (ersätter RLS)
- ✅ Error handling uppdaterad

## Kör migrations

### Automatiskt vid start (rekommenderas för utveckling):
```typescript
// I migration.service.ts, ändra onModuleInit:
async onModuleInit() {
  await this.runMigrations();
}
```

### Manuellt via API (rekommenderas för produktion):
```typescript
// Skapa en migration controller eller CLI-kommando
await migrationService.runMigrations();
```

### Via script:
```powershell
cd backend
node -e "const { MigrationService } = require('./dist/database/migrations/migration.service'); ..."
```

## Migrera en Service

### Steg 1: Uppdatera imports
```typescript
// Före:
import { SupabaseService } from '../supabase/supabase.service';

// Efter:
import { DatabaseService } from '../database/database.service';
```

### Steg 2: Uppdatera constructor
```typescript
// Före:
constructor(private readonly supabaseService: SupabaseService) {}

// Efter:
constructor(private readonly databaseService: DatabaseService) {}
```

### Steg 3: Konvertera queries

#### Supabase query builder → SQL
```typescript
// Före:
const { data, error } = await supabase
  .from('documents')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });

// Efter:
const result = await this.databaseService.query<Document>(
  'SELECT * FROM public.documents WHERE user_id = $1 ORDER BY created_at DESC',
  [userId]
);
const data = result.rows;
```

#### Insert
```typescript
// Före:
const { data, error } = await supabase
  .from('documents')
  .insert({ user_id: userId, title: 'Test' })
  .select()
  .single();

// Efter:
const result = await this.databaseService.query<Document>(
  'INSERT INTO public.documents (user_id, title) VALUES ($1, $2) RETURNING *',
  [userId, 'Test']
);
const data = result.rows[0];
```

#### Update
```typescript
// Före:
const { data, error } = await supabase
  .from('documents')
  .update({ title: 'New Title' })
  .eq('id', documentId)
  .eq('user_id', userId)
  .select()
  .single();

// Efter:
const result = await this.databaseService.query<Document>(
  'UPDATE public.documents SET title = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
  ['New Title', documentId, userId]
);
const data = result.rows[0];
```

#### Delete
```typescript
// Före:
const { error } = await supabase
  .from('documents')
  .delete()
  .eq('id', documentId)
  .eq('user_id', userId);

// Efter:
const result = await this.databaseService.query(
  'DELETE FROM public.documents WHERE id = $1 AND user_id = $2 RETURNING id',
  [documentId, userId]
);
```

### Steg 4: Uppdatera error handling
```typescript
// Före:
if (error) {
  if (error.code === 'PGRST116') {
    throw new NotFoundException('Not found');
  }
  throw new Error('Database error');
}

// Efter:
if (result.rows.length === 0) {
  throw new NotFoundException('Not found');
}
// Errors kastas automatiskt av databaseService
```

### Steg 5: Uppdatera module
```typescript
// Före:
import { SupabaseModule } from '../supabase/supabase.module';
@Module({
  imports: [SupabaseModule],
})

// Efter:
import { DatabaseModule } from '../database/database.module';
@Module({
  imports: [DatabaseModule],
})
```

## Viktiga skillnader

### 1. RLS (Row Level Security)
- **Supabase:** RLS hanteras automatiskt i databasen
- **PostgreSQL:** Måste validera `user_id` i varje query

### 2. Error codes
- **Supabase:** Använder `PGRST116` för "not found"
- **PostgreSQL:** Kontrollera `result.rows.length === 0`

### 3. Query builder vs SQL
- **Supabase:** Chainable query builder
- **PostgreSQL:** Direkta SQL queries med parameterized queries ($1, $2, etc.)

### 4. Single vs Multiple rows
- **Supabase:** `.single()` returnerar ett objekt eller error
- **PostgreSQL:** Alltid returnerar array, kontrollera längd manuellt

## Services att migrera

1. ✅ DocumentsService
2. ⏳ BankAccountsService
3. ⏳ CardsService
4. ⏳ InvestmentsService
5. ⏳ TransactionsService
6. ⏳ PropertiesService
7. ⏳ VehiclesService
8. ⏳ BoatsService
9. ⏳ InsurancesService
10. ⏳ ConnectionsService
11. ⏳ MessagesService
12. ⏳ NotificationsService
13. ⏳ RequestsService
14. ⏳ OffersService
15. ⏳ UsersService
16. ⏳ RbacService
17. ⏳ AuthService (delvis)
18. ⏳ SearchService

## SQL-filer att migrera

1. ✅ create_documents_table.sql → 002_create_documents_table.sql
2. ✅ create_bank_accounts_table.sql → 003_create_bank_accounts_table.sql
3. ✅ create_rbac_tables.sql → 004_create_rbac_tables.sql
4. ✅ create_messages_table.sql → 005_create_messages_table.sql
5. ⏳ create_cards_table.sql
6. ⏳ create_investments_table.sql
7. ⏳ create_transactions_table.sql
8. ⏳ create_properties_table.sql
9. ⏳ create_properties_homes_table.sql
10. ⏳ create_assets_table.sql
11. ⏳ create_vehicles_table.sql
12. ⏳ create_boats_table.sql
13. ⏳ create_insurances_table.sql
14. ⏳ create_network_table.sql
15. ⏳ create_notifications_table.sql
16. ⏳ create_requests_table.sql
17. ⏳ create_offers_table.sql
18. ⏳ create_friend_lists_table.sql
19. ⏳ enhance_user_connections.sql
20. ⏳ add_message_to_user_connections.sql
21. ⏳ create_user_blocks_table.sql
22. ⏳ enhance_users_table.sql
23. ⏳ update_users_table.sql

## Testa migrations

```powershell
# Starta PostgreSQL
cd backend
docker-compose up -d

# Kör migrations (när MigrationService är integrerad)
# Eller kör SQL-filerna manuellt:
docker exec -i castlegate-postgres psql -U postgres -d castlegate < sql/001_create_users_table.sql
```

## Nästa steg

1. Migrera fler SQL-filer (prioritera de som används mest)
2. Migrera fler services (följ DocumentsService som mall)
3. Testa alla endpoints
4. Ta bort SupabaseService när allt är migrerat
5. Uppdatera dokumentation
