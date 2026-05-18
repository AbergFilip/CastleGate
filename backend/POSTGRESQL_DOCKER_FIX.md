# PostgreSQL Docker Fix

## Problem
PostgreSQL Docker-containern kunde inte anslutas från Node.js backend på Windows, trots att containern körde korrekt.

## Lösning
Problemet var att **port 5432 redan var upptagen** (antingen av en lokal PostgreSQL-instans eller av en annan container). 

### Lösning: Använd port 5433 istället

1. **Docker Compose konfiguration** (`docker-compose.yml`):
   - PostgreSQL-containern mappar nu port `5433:5432` istället för `5432:5432`
   - Detta undviker konflikter med eventuella lokala PostgreSQL-instanser

2. **Connection string** (`.env`):
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5433/castlegate
   ```

## Starta PostgreSQL

```powershell
cd backend
docker-compose up -d
```

## Stoppa PostgreSQL

```powershell
cd backend
docker-compose down
```

## Verifiera anslutning

```powershell
cd backend
node -e "const { Pool } = require('pg'); const pool = new Pool({ host: 'localhost', port: 5433, database: 'castlegate', user: 'postgres', password: 'postgres' }); pool.query('SELECT NOW()').then(r => { console.log('✅ Anslutning fungerar!', r.rows[0]); pool.end(); }).catch(e => { console.error('❌ Fel:', e.message); pool.end(); });"
```

## Status
✅ PostgreSQL-containern körs på port 5433
✅ Backend kan ansluta till databasen
✅ Connection pooling fungerar
