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

# Lokal utveckling: hoppa över BankID QR och kör direkt vidare efter "Hämta" (sandbox-flöden)
# VITE_SKIP_BANKID=true

# Visa knapp på Profil: "Rensa all min testdata" (kräver ENABLE_TEST_DATA_TOOLS=true i backend)
# VITE_ENABLE_TEST_DATA_TOOLS=true

# Tink Link (valfritt – äldre open banking-integration)
# Hämta client_id från https://console.tink.com → App settings.
# Registrera redirect URI i Tink Console: http://localhost:5173/connect-bank/callback
VITE_TINK_CLIENT_ID=din-tink-client-id
```

### Auth0 (valfritt – `@auth0/auth0-react`)

Om du sätter **både** `VITE_AUTH0_DOMAIN` och `VITE_AUTH0_CLIENT_ID` i `.env`:

- Visas **Logga in med Auth0** / **Skapa konto med Auth0** på startsidan (ovanför BankID).
- `npm run dev` använder **port 5173** (`--strictPort`) så URL:er matchar Auth0.
- I **Auth0 Dashboard** (Application → Settings): typ **SPA**, Callback URL, Logout URL och Allowed Web Origins ska vara t.ex. `http://localhost:5173/` (samma som `redirect_uri` i koden: `origin` + `/`).
- **Backend** måste kunna verifiera Auth0 JWT (OIDC) om du ska anropa API med Auth0-token – annars använd BankID/Supabase-flödet som idag.

```env
# VITE_AUTH0_DOMAIN=din-tenant.us.auth0.com
# VITE_AUTH0_CLIENT_ID=din-client-id
# VITE_AUTH0_AUDIENCE=   # valfritt, om du har ett API i Auth0
```

## Steg 2: Skapa .env-fil för Backend

För att bankanslutning via **GoCardless** (rekommenderat) eller **Tink** ska fungera behöver backend:

**GoCardless (rekommenderat – gratis):**
- `GOCARDLESS_SECRET_ID` – Secret ID från GoCardless Bank Account Data-portalen
- `GOCARDLESS_SECRET_KEY` – Secret Key från GoCardless Bank Account Data-portalen

**Tink (valfritt):**
- `TINK_CLIENT_ID` – samma som `VITE_TINK_CLIENT_ID` (Client ID från Tink Console)
- `TINK_CLIENT_SECRET` – Client secret från Tink Console (App settings → API Client)

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

# Test: tillåt POST /api/v1/test-data/clear-all (rensning av användarens synkade data). Sätt aldrig i produktion.
# ENABLE_TEST_DATA_TOOLS=true

# GoCardless Open Banking (gratis sandbox & produktion)
# Registrera på https://bankaccountdata.gocardless.com/
GOCARDLESS_SECRET_ID=din-gocardless-secret-id
GOCARDLESS_SECRET_KEY=din-gocardless-secret-key
```

## Hämta Supabase-credentials

1. Gå till [Supabase Dashboard](https://app.supabase.com)
2. Välj ditt projekt (eller skapa ett nytt)
3. Gå till **Settings** → **API**
4. Kopiera:
   - **Project URL** → `VITE_SUPABASE_URL` (frontend) och `SUPABASE_URL` (backend)
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY` (frontend)
   - **service_role key** (⚠️ ADMIN KEY - håll hemlig!) → `SUPABASE_SERVICE_ROLE_KEY` (backend)

## GoCardless Open Banking (rekommenderat)

GoCardless (f.d. Nordigen) erbjuder gratis tillgång till Open Banking-data (konton, saldon, transaktioner) för svenska banker.

1. Skapa ett konto på [GoCardless Bank Account Data](https://bankaccountdata.gocardless.com/).
2. Gå till **User secrets** och skapa nya nycklar.
3. Kopiera **Secret ID** till `backend/.env` som `GOCARDLESS_SECRET_ID=...`
4. Kopiera **Secret Key** till `backend/.env` som `GOCARDLESS_SECRET_KEY=...`
5. Starta om backend. På sidan **Välj bank** (/connect-bank) visas knappen **Anslut sandbox-bank**.

### Sandbox
GoCardless har en inbyggd sandbox-bank (`SANDBOXFINANCE_SFIN0000`) som returnerar testkonton med saldon. Inga riktiga bankuppgifter behövs för utveckling.

### Produktion
I produktion kan användare ansluta riktiga svenska banker (Handelsbanken, Swedbank, Nordea, SEB m.fl.) via GoCardless – utan extra kostnad.

---

## Tink Link (valfritt – för att testa demo bank)

1. Skapa konto och app i [Tink Console](https://console.tink.com).
2. Under **App settings** → **Redirect URIs** lägg till exakt: `http://localhost:5173/connect-bank/callback` (projektet använder port 5173 i `vite.config.ts`).
3. Kopiera **Client ID** till `.env` som `VITE_TINK_CLIENT_ID=...`.
4. Starta om frontend. På sidan **Välj bank** (/connect-bank) visas då knappen **Anslut bank med Tink**. I sandbox kan du välja **Demo Bank** för test utan riktig bank.

### Automatisk saldo (One-time Balance Check)

För att saldo ska hämtas automatiskt från banken krävs att Tink aktiverar scopet **`accounts.balances:readonly`** för er app. Det går inte att slå på i Console själv – Tink Support måste göra det.

**Så här begär du aktivering:**
1. Gå till [Tink Support](https://docs.tink.com/resources/support/how-to-find-technical-support) eller mejla er Tink-kontakt.
2. Skriv att ni använder **One-time Balance Check** (Account Check + saldo) och behöver scopet **`accounts.balances:readonly`** aktiverat för er **Client ID** (samma som i `.env`).
3. När scopet är aktiverat fungerar både "Anslut bank" och knappen "Uppdatera" saldo automatiskt – inga kodändringar behövs.

## Lantmäteriet Adress-API (för "Lägg till hem")

Adressautocomplete i formuläret "Lägg till hem" använder Lantmäteriets officiella **Referens Uppslag Adress**-API. Tjänsten är avgiftsfri.

### Steg 1: Skapa konto på Geotorget

1. Gå till [Geotorget](https://geotorget.lantmateriet.se/) och skapa ett konto som privatperson (använd e-post som användarnamn).

### Steg 2: Ansök om att bli konsument

1. Logga in på Geotorget.
2. Under **Bli konsument** → välj **Nationella geodataplattformen (NGP)**.
3. Godkänn användarvillkoren och skicka in ansökan.
4. Efter godkännande får du behörighet till API:erna.

### Steg 3: Beställ produkten

1. I Geotorget, sök efter **Referens Uppslag Adress**.
2. Beställ produkten (avgiftsfri).
3. Godkänn eventuella användningsvillkor.

### Steg 4: Hämta API-nycklar

1. Gå till [API-portalen (verifiering)](https://apimanager-ver.lantmateriet.se/store) för utveckling, eller [API-portalen (produktion)](https://apimanager.lantmateriet.se/store/) för live.
2. Logga in med samma uppgifter som Geotorget.
3. Skapa en **Application** och prenumerera på **Referens Uppslag Adress**.
4. Under **Application Keys** → **GENERATE KEYS** – kopiera **Consumer Key** och **Consumer Secret**.

### Steg 5: Lägg till i backend/.env

```env
# Lantmäteriet Adress-API (avgiftsfri)
LANTMATERIET_CONSUMER_KEY=din-consumer-key
LANTMATERIET_CONSUMER_SECRET=din-consumer-secret

# Använd verifieringsmiljö (api-ver) som standard för utveckling
# Sätt till false för produktion
LANTMATERIET_USE_VERIFICATION=true
```

### Beteende

- **Verifiering** (`LANTMATERIET_USE_VERIFICATION=true`): Använder testmiljö, rekommenderas för utveckling.
- **Produktion** (`LANTMATERIET_USE_VERIFICATION=false`): Använder produktions-API med riktig adressdata.

Om nycklarna saknas fungerar "Lägg till hem" fortfarande – användaren kan skriva adress manuellt, men autocomplete visas inte.

---

## Efter att du skapat .env-filerna

1. **Starta om frontend-servern** (om den redan körs)
2. **Starta om backend-servern** (om den redan körs)

Vite läser miljövariabler när servern startar, så du måste starta om för att ändringarna ska gälla.

