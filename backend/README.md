# BankID Backend Server

Backend-server för BankID-autentisering med Supabase-integration.

## Konfiguration

### 1. Skapa `.env`-fil

Skapa en `.env`-fil i `backend/`-mappen med följande innehåll:

```env
# Supabase Configuration
# Hämta dessa värden från Supabase Dashboard -> Settings -> API
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Server Configuration
PORT=3001

# BankID Configuration
# För produktion, sätt till true och konfigurera certifikat
# För testmiljö, använd false (använder test-certifikat automatiskt)
BANKID_PRODUCTION=false
```

### 2. Hämta Supabase-credentials

1. Gå till [Supabase Dashboard](https://app.supabase.com)
2. Välj ditt projekt
3. Gå till **Settings** → **API**
4. Kopiera:
   - **Project URL** → `SUPABASE_URL`
   - **service_role** key (⚠️ **ADMIN KEY** - håll den hemlig!) → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Konfigurera Supabase Database

Kör SQL-scriptet `supabase_setup.sql` i Supabase SQL Editor:

1. Gå till Supabase Dashboard → **SQL Editor**
2. Skapa en ny query
3. Kopiera innehållet från `supabase_setup.sql`
4. Kör scriptet

Detta skapar:
- `users`-tabell med BankID-integration
- RLS policies för säkerhet
- Automatiska triggers för user-profil skapande

## Installation

```bash
npm install
```

## Kör servern

### Development (med auto-reload)
```bash
npm run dev
```

### Production
```bash
npm start
```

Servern startar på `http://localhost:3001` (eller porten angiven i `.env`).

## API Endpoints

### `GET /`
Hälsning och API-dokumentation

### `GET /api/bankid/ip`
Hämta användarens IP-adress

### `POST /api/bankid/auth`
Initiera BankID-autentisering

**Request:**
```json
{
  "personalNumber": "199001011234", // Valfritt
  "endUserIp": "127.0.0.1"
}
```

**Response:**
```json
{
  "orderRef": "...",
  "autoStartToken": "...",
  "qrStartToken": "...",
  "qrStartSecret": "..."
}
```

### `POST /api/bankid/collect`
Kontrollera status för BankID-autentisering

**Request:**
```json
{
  "orderRef": "..."
}
```

### `POST /api/bankid/signup`
Skapa konto med BankID

**Request:**
```json
{
  "personalNumber": "199001011234",
  "name": "Förnamn Efternamn",
  "email": "user@example.com" // Valfritt
}
```

### `POST /api/bankid/signin`
Logga in med BankID

**Request:**
```json
{
  "personalNumber": "199001011234",
  "name": "Förnamn Efternamn"
}
```

**Response:**
```json
{
  "success": true,
  "userId": "...",
  "email": "user@example.com",
  "name": "Förnamn Efternamn",
  "accessToken": "...", // JWT token för session
  "refreshToken": "..." // Refresh token
}
```

### `POST /api/bankid/qr`
Generera QR-kod för BankID

### `POST /api/bankid/link`
Koppla BankID till befintligt konto

### `GET /api/bankid/status`
Kontrollera BankID-status

### `POST /api/bankid/unlink`
Ta bort BankID-koppling

## Felsökning

### Backend startar inte
- Kontrollera att alla dependencies är installerade: `npm install`
- Kontrollera att porten inte är upptagen
- Kontrollera att `.env`-filen finns och är korrekt konfigurerad

### BankID-autentisering fungerar inte
- Kontrollera att BankID-certifikat finns i `node_modules/bankid/cert/`
- För testmiljö, använd `BANKID_PRODUCTION=false`
- Kontrollera att backend-servern körs på rätt port

### Supabase-integration fungerar inte
- Kontrollera att `.env`-filen har korrekta credentials
- Kontrollera att `users`-tabellen är skapad i Supabase
- Kontrollera RLS policies i Supabase Dashboard

## Säkerhet

⚠️ **VIKTIGT:**
- Dela **ALDRIG** `SUPABASE_SERVICE_ROLE_KEY` publikt
- Använd `.env`-filen och lägg den i `.gitignore`
- I produktion, använd säkra miljövariabler
- Aktivera RLS policies i Supabase för säkerhet

