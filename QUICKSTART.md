# CastleGate - Quick Start Guide

## Backend Server

Backend-servern är nu igång på **http://localhost:3000**

### Testa API:et

#### 1. Health Check
```bash
# Windows PowerShell
curl http://localhost:3000/health

# Eller öppna i webbläsare
http://localhost:3000/health
```

Förväntad respons:
```json
{
  "status": "OK",
  "timestamp": "2025-11-02T11:10:10.972Z",
  "service": "CastleGate Backend"
}
```

#### 2. Test BankID Autentisering
```powershell
# PowerShell
$body = @{personalNumber='199001011234'} | ConvertTo-Json
Invoke-WebRequest -Uri http://localhost:3000/api/auth/bankid -Method POST -Body $body -ContentType 'application/json'
```

#### 3. Tillgängliga API Endpoints

**Authentication**
- `POST /api/auth/bankid` - Initiera BankID login
- `POST /api/auth/bankid/verify` - Verifiera BankID token

**Users**
- `GET /api/users/profile` - Hämta användarprofil
- `PUT /api/users/profile` - Uppdatera profil

**Documents**
- `POST /api/documents` - Ladda upp dokument
- `GET /api/documents` - Lista dokument
- `GET /api/documents/:id` - Hämta specifikt dokument

**Blockchain**
- `POST /api/blockchain/wallet/generate` - Generera wallet
- `GET /api/blockchain/wallet/address` - Hämta wallet-adress
- `POST /api/blockchain/contract/create` - Skapa smart contract
- `GET /api/blockchain/coins/balance` - Hämta Castlegate Coins saldo

**AI Assistant**
- `POST /api/ai/ask` - Fråga AI-assistent
- `POST /api/ai/compare` - Jämför produkter
- `GET /api/ai/recommendations` - Få rekommendationer

**Marketplace**
- `GET /api/marketplace` - Hämta marknadsplats
- `POST /api/marketplace/add` - Lägg till item
- `GET /api/marketplace/preferences` - Hämta preferenser

---

## Mobile App (React Native)

För att köra mobilappen krävs:
1. Node.js installerat
2. React Native CLI
3. iOS: Xcode (för macOS) eller Android Studio (alla plattformar)

### Installation Mobile App

```bash
cd mobile
npm install
```

### Starta Metro Bundler
```bash
npm start
```

### Kör på iOS (kräver macOS + Xcode)
```bash
npm run ios
```

### Kör på Android (kräver Android Studio)
```bash
npm run android
```

---

## Utvecklingsmiljö

### Starta Allt
```bash
# Från projektroot
npm run dev:backend  # Backend i ett terminalfönster
npm run dev:mobile   # Mobile i ett annat terminalfönster
```

### Loggfiler
Backend-loggar sparas i:
- `backend/logs/combined.log` - Alla loggar
- `backend/logs/error.log` - Endast errors

---

## Nästa Steg

1. **Installera MongoDB** (för databas)
2. **Konfigurera BankID** - Integrera riktigt BankID API
3. **Sätt upp Blockchain** - Infura eller annan provider
4. **Implementera AI** - OpenAI/Anthropic API
5. **Byt mock-data mot riktig data**

---

## Problem?

### Backend startar inte
- Kontrollera att port 3000 är ledig
- Se loggarna i `backend/logs/`
- Testa: `npm run build` för att se TypeScript-fel

### Mobile app crashar
- Kör `npm install` i `mobile/`
- Kontrollera React Native version: `npx react-native --version`
- Se: https://reactnative.dev/docs/environment-setup

---

## Support

För frågor, se README.md eller ARCHITECTURE.md

