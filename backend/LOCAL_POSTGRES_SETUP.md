# Lokal PostgreSQL Setup (Gratis)

Detta är en guide för att installera och konfigurera PostgreSQL lokalt på din dator - helt gratis!

## Snabbstart (PowerShell Script)

Det enklaste sättet är att använda det medföljande scriptet:

```powershell
cd backend
.\scripts\setup-local-postgres.ps1
```

## Alternativ 1: Docker (Rekommenderat - Enklast)

Om du har Docker installerat, är detta det enklaste sättet:

### Starta PostgreSQL Container

```powershell
docker run --name castlegate-postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=castlegate `
  -p 5432:5432 `
  -d postgres:15
```

### Connection String

```
postgresql://postgres:postgres@localhost:5432/castlegate
```

### Stoppa/Starta Container

```powershell
# Stoppa
docker stop castlegate-postgres

# Starta igen
docker start castlegate-postgres

# Ta bort (om du vill börja om)
docker rm castlegate-postgres
```

### Docker Compose (För persistent data)

Skapa `docker-compose.yml`:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    container_name: castlegate-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: castlegate
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Kör:
```powershell
docker-compose up -d
```

## Alternativ 2: Windows Installer

### 1. Ladda ner PostgreSQL

1. Gå till: https://www.postgresql.org/download/windows/
2. Eller direkt: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
3. Ladda ner installer för PostgreSQL 15

### 2. Installera

1. Kör installer
2. Välj installation directory (standard är bra)
3. Välj komponenter (alla är bra)
4. Välj data directory (standard är bra)
5. **Viktigt:** Kom ihåg lösenordet du anger för `postgres`-användaren!
6. Välj port (standard 5432 är bra)
7. Välj locale (standard är bra)

### 3. Verifiera Installation

Öppna PowerShell och kör:

```powershell
psql --version
```

Om det fungerar är PostgreSQL installerat!

### 4. Skapa Database

```powershell
# Anslut som postgres-användare (du behöver lösenordet från installationen)
psql -U postgres

# I psql-prompten:
CREATE DATABASE castlegate;
CREATE USER castlegate_user WITH PASSWORD 'castlegate_pass';
GRANT ALL PRIVILEGES ON DATABASE castlegate TO castlegate_user;
\q
```

### 5. Connection String

```
postgresql://castlegate_user:castlegate_pass@localhost:5432/castlegate
```

## Alternativ 3: Via winget (Windows Package Manager)

Om du har winget installerat:

```powershell
winget install PostgreSQL.PostgreSQL
```

Efter installationen, starta om PowerShell och följ steg 4-5 ovan.

## Konfigurera Backend

### Lägg till i `.env`

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/castlegate
```

Eller om du skapade separat användare:

```env
DATABASE_URL=postgresql://castlegate_user:castlegate_pass@localhost:5432/castlegate
```

### Testa Anslutning

Starta backend:

```powershell
cd backend
npm run start:dev
```

Du bör se i logs:
```
✅ PostgreSQL-anslutning etablerad
```

## Kör Migrations

Efter att databasen är skapad, kör SQL-filerna:

### Via psql

```powershell
# Anslut till databasen
psql -U postgres -d castlegate

# Kör SQL-filer (en i taget)
\i sql/create_users_table.sql
\i sql/create_assets_table.sql
# ... etc
```

### Via PowerShell

```powershell
# Kör alla SQL-filer i ordning
Get-ChildItem sql\create_*.sql | ForEach-Object {
    Write-Host "Kör: $($_.Name)"
    psql -U postgres -d castlegate -f $_.FullName
}
```

## Felsökning

### "psql: command not found"

PostgreSQL är inte i PATH. Lösningar:

1. **Starta om PowerShell** (efter installation)
2. **Lägg till manuellt i PATH:**
   - Vanligtvis: `C:\Program Files\PostgreSQL\15\bin`
   - Lägg till i System Environment Variables

### "password authentication failed"

- Kontrollera att du använder rätt lösenord
- För Docker: Standard är `postgres`
- För installer: Lösenordet du angav vid installationen

### "database does not exist"

Skapa databasen först:
```powershell
psql -U postgres -c "CREATE DATABASE castlegate;"
```

### "connection refused" eller "could not connect"

- Kontrollera att PostgreSQL körs:
  - Docker: `docker ps` (ska visa postgres-container)
  - Windows Service: Öppna Services och kontrollera "postgresql-x64-15"
- Kontrollera port 5432 är ledig:
  ```powershell
  netstat -an | findstr 5432
  ```

### "permission denied"

Ge användaren behörigheter:
```sql
GRANT ALL PRIVILEGES ON DATABASE castlegate TO castlegate_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO castlegate_user;
```

## GUI Tools (Valfritt)

För enklare databashantering, överväg:

- **pgAdmin** (officiell GUI): https://www.pgadmin.org/
- **DBeaver** (gratis, cross-platform): https://dbeaver.io/
- **TablePlus** (betalt, men bra): https://tableplus.com/

## Nästa Steg

1. ✅ PostgreSQL installerat och körs
2. ✅ Database skapad
3. ✅ Connection string i `.env`
4. ⏭️ Kör migrations (SQL-filer)
5. ⏭️ Starta backend och testa!

## Tips

### Backup

```powershell
# Backup
pg_dump -U postgres castlegate > backup.sql

# Restore
psql -U postgres castlegate < backup.sql
```

### Stoppa/Starta (Windows Service)

```powershell
# Stoppa
Stop-Service postgresql-x64-15

# Starta
Start-Service postgresql-x64-15
```

### Stoppa/Starta (Docker)

```powershell
# Stoppa
docker stop castlegate-postgres

# Starta
docker start castlegate-postgres
```

## Jämförelse: Docker vs Installer

| | Docker | Installer |
|---|---|---|
| **Enkelhet** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Setup-tid** | 1 min | 10-15 min |
| **Rensning** | `docker rm` | Uninstall via Control Panel |
| **Portability** | ✅ Fungerar överallt | ✅ Windows only |
| **Performance** | Lite overhead | Native |

**Rekommendation:** Använd Docker om du redan har det, annars installer.
