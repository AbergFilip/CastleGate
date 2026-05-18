# CastleGate Backend

Detta är backend-systemet för CastleGate B2C/B2B plattformen. Systemet är byggt med NestJS och använder Supabase som databas.

## Funktioner

### Kärnfunktionalitet
- **IAM (Identity & Access Management):**
  - Stöd för både B2C (BankID) och B2B (OIDC/Azure AD)
  - RBAC (Role-Based Access Control)
  - B2B/B2C-separation
- **Ekonomi:**
  - Bankkonton, Kort, Investeringar, Transaktioner
- **Tillgångar:**
  - Fastigheter, Fordon, Båtar, Försäkringar
- **Kommunikation:**
  - Meddelanden, Notiser, Marknadsplats (Requests/Offers)
- **Nätverk:**
  - Vänlistor och kontakter

### Dokumentation
- [IAM Implementation Guide](docs/IAM_IMPLEMENTATION.md) - Detaljer om säkerhet och behörighet.
- [API Dokumentation](http://localhost:3001/api/docs) - Swagger dokumentation (när servern körs).

## Komma igång

### 1. Konfiguration
Skapa en `.env`-fil baserad på `example.env` (se IAM guiden för variabler).

### 2. Installation
```bash
npm install
```

### 3. Databas
Kör migrationsskripten i Supabase SQL Editor:
1. `supabase_setup.sql`
2. `create_rbac_tables.sql`
3. SQL-filer för moduler (finns i roten av backend-mappen)

### 4. Starta servern
```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

Servern startar normalt på port 3001.
API:t är tillgängligt under `/api`.
Swagger docs under `/api/docs`.
