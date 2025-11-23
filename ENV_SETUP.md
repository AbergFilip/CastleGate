# Miljövariabler Setup

För att appen ska fungera behöver du skapa `.env`-filer med Supabase-credentials.

## Steg 1: Skapa .env-fil för Frontend (root-mappen)

Skapa en fil som heter `.env` i root-mappen (`C:\Users\Filip\CastleGate\.env`) med följande innehåll:

```env
# Supabase Configuration för Frontend
# Hämta dessa värden från Supabase Dashboard -> Settings -> API
# Project URL -> VITE_SUPABASE_URL
# anon/public key -> VITE_SUPABASE_ANON_KEY

VITE_SUPABASE_URL=https://din-projekt-id.supabase.co
VITE_SUPABASE_ANON_KEY=din-anon-key-här

# BankID API URL (för backend)
VITE_BANKID_API_URL=http://localhost:3001/api/bankid
```

## Steg 2: Skapa .env-fil för Backend

Gå till `backend`-mappen och kör setup-scriptet:

```powershell
cd backend
.\setup-env.ps1
```

Eller skapa manuellt en `.env`-fil i `backend/`-mappen med:

```env
# Supabase Configuration
SUPABASE_URL=https://din-projekt-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=din-service-role-key-här

# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:5173

# BankID Configuration
BANKID_PRODUCTION=false
```

## Hämta Supabase-credentials

1. Gå till [Supabase Dashboard](https://app.supabase.com)
2. Välj ditt projekt (eller skapa ett nytt)
3. Gå till **Settings** → **API**
4. Kopiera:
   - **Project URL** → `VITE_SUPABASE_URL` (frontend) och `SUPABASE_URL` (backend)
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY` (frontend)
   - **service_role key** (⚠️ ADMIN KEY - håll hemlig!) → `SUPABASE_SERVICE_ROLE_KEY` (backend)

## Efter att du skapat .env-filerna

1. **Starta om frontend-servern** (om den redan körs)
2. **Starta om backend-servern** (om den redan körs)

Vite läser miljövariabler när servern startar, så du måste starta om för att ändringarna ska gälla.

