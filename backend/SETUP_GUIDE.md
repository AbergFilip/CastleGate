# BankID Backend Setup Guide

Följ dessa steg för att sätta upp BankID-backend:

## Steg 1: Skapa .env-fil

### Alternativ A: Använd setup-scriptet (Rekommenderat)

Kör i PowerShell:
```powershell
cd backend
.\setup-env.ps1
```

### Alternativ B: Skapa manuellt

1. Skapa en fil som heter `.env` i `backend/`-mappen
2. Lägg till följande innehåll:

```env
# Supabase Configuration
SUPABASE_URL=din_supabase_url_här
SUPABASE_SERVICE_ROLE_KEY=din_service_role_key_här

# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:5173

# BankID Configuration
BANKID_PRODUCTION=false
```

### Hämta Supabase-credentials

1. Gå till [Supabase Dashboard](https://app.supabase.com)
2. Välj ditt projekt (eller skapa ett nytt)
3. Gå till **Settings** → **API**
4. Kopiera:
   - **Project URL** → `SUPABASE_URL`
   - **service_role** key (⚠️ **ADMIN KEY** - håll den hemlig!) → `SUPABASE_SERVICE_ROLE_KEY`

## Steg 2: Konfigurera Supabase Database

1. Gå till Supabase Dashboard → **SQL Editor**
2. Skapa en ny query
3. Öppna filen `supabase_setup.sql` i denna mapp
4. Kopiera hela innehållet och klistra in i SQL Editor
5. Klicka på **Run** för att köra scriptet

Detta skapar:
- ✅ `users`-tabell med BankID-integration
- ✅ Index för snabbare sökningar
- ✅ Row Level Security (RLS) policies
- ✅ Automatiska triggers för user-profil skapande

## Steg 3: Installera dependencies

```bash
npm install
```

## Steg 4: Starta backend-servern

### Development (med auto-reload)
```bash
npm run dev
```

### Production
```bash
npm start
```

Servern startar på `http://localhost:3001` (eller porten angiven i `.env`).

## Verifiera att allt fungerar

1. Öppna en webbläsare och gå till `http://localhost:3001`
2. Du bör se ett JSON-svar med API-dokumentation
3. Kontrollera konsolen för eventuella felmeddelanden

## Felsökning

### Backend startar inte
- ✅ Kontrollera att Node.js är installerat: `node --version`
- ✅ Kontrollera att dependencies är installerade: `npm install`
- ✅ Kontrollera att porten inte är upptagen
- ✅ Kontrollera att `.env`-filen finns och är korrekt konfigurerad

### BankID-autentisering fungerar inte
- ✅ Kontrollera att BankID-certifikat finns i `node_modules/bankid/cert/`
- ✅ För testmiljö, använd `BANKID_PRODUCTION=false`
- ✅ Kontrollera att backend-servern körs på rätt port

### Supabase-integration fungerar inte
- ✅ Kontrollera att `.env`-filen har korrekta credentials
- ✅ Kontrollera att `users`-tabellen är skapad i Supabase
- ✅ Kontrollera RLS policies i Supabase Dashboard → Authentication → Policies

## Säkerhet

⚠️ **VIKTIGT:**
- Dela **ALDRIG** `SUPABASE_SERVICE_ROLE_KEY` publikt
- Använd `.env`-filen och lägg den i `.gitignore` (redan gjort)
- I produktion, använd säkra miljövariabler
- Aktivera RLS policies i Supabase för säkerhet

## Support

Om du stöter på problem:
1. Kontrollera konsolen för felmeddelanden
2. Kontrollera Supabase Dashboard för databasfel
3. Se `README.md` för mer detaljerad dokumentation

