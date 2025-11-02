# 🏰 CastleGate - Installation och Start

## ⚡ SNABBSTART

### 1️⃣ Öppna PowerShell i projektmappen
```
C:\Users\Filip\CastleGate\
```

### 2️⃣ Navigera till backend
```powershell
cd backend
```

### 3️⃣ Starta servern
```powershell
npm run dev
```

### 4️⃣ Öppna i webbläsare
Gå till: **http://localhost:3000/health**

---

## 📋 Detaljerade Instruktioner

### Förberedelser
1. Kontrollera att du är i rätt mapp: `C:\Users\Filip\CastleGate`
2. Dependencies är redan installerade

### Starta Backend
```powershell
# Navigera till backend
cd backend

# Starta utvecklingsservern
npm run dev
```

**Förväntad output:**
```
[nodemon] starting `ts-node src/index.ts`
info: 🚀 CastleGate Backend running on port 3000
info: 📱 Environment: development
```

### Testa API:et

#### I webbläsare:
Öppna: `http://localhost:3000/health`

Förväntad JSON:
```json
{
  "status": "OK",
  "timestamp": "2025-11-02T...",
  "service": "CastleGate Backend"
}
```

#### I PowerShell:
```powershell
# Öppna ett NYTT PowerShell-fönster (servern måste köra i bakgrunden)
Invoke-WebRequest -Uri http://localhost:3000/health -UseBasicParsing
```

### Testa Authentication
```powershell
# I ett nytt PowerShell-fönster
$body = @{personalNumber='199001011234'} | ConvertTo-Json
Invoke-WebRequest -Uri http://localhost:3000/api/auth/bankid -Method POST -Body $body -ContentType 'application/json'
```

---

## 🎯 Alla API Endpoints

### Health
- `GET /health` - Server status

### Authentication
- `POST /api/auth/bankid` - Initiera BankID
- `POST /api/auth/bankid/verify` - Verifiera BankID

### Users
- `GET /api/users/profile` - Hämta profil
- `PUT /api/users/profile` - Uppdatera profil

### Documents
- `GET /api/documents` - Lista dokument
- `POST /api/documents` - Ladda upp
- `GET /api/documents/:id` - Hämta specifikt

### Blockchain
- `POST /api/blockchain/wallet/generate` - Skapa wallet
- `GET /api/blockchain/wallet/address` - Hämta adress
- `GET /api/blockchain/coins/balance` - Saldo

### AI
- `POST /api/ai/ask` - Fråga AI
- `POST /api/ai/compare` - Jämför produkter
- `GET /api/ai/recommendations` - Rekommendationer

### Marketplace
- `GET /api/marketplace` - Hämta marknadsplats
- `GET /api/marketplace/preferences` - Preferenser

---

## ⚠️ Felsökning

### Port 3000 är upptagen
```powershell
# Hitta processen
netstat -ano | findstr :3000

# Döda processen
taskkill /PID [PID_NUMMER] /F
```

### npm run dev fungerar inte
```powershell
# Reinstallera dependencies
rm -r node_modules
npm install

# Försök igen
npm run dev
```

### Ingen respons från /health
1. Kolla terminalen för felmeddelanden
2. Se loggarna: `backend/logs/combined.log`
3. Kontrollera att servern faktiskt startade

### "Cannot find module"
```powershell
# Installera om
cd C:\Users\Filip\CastleGate\backend
rm -r node_modules
npm install
```

---

## 📚 Mer Information

- **README.md** - Projektöversikt
- **ARCHITECTURE.md** - Teknisk design
- **QUICKSTART.md** - Detaljerad guide
- **START_HERE.md** - Snabbguide

---

## ✅ Checklista

- [ ] Backend mappen finns: `C:\Users\Filip\CastleGate\backend`
- [ ] Dependencies installerade: `npm install` i backend/
- [ ] Servern startar: `npm run dev`
- [ ] Terminal visar: "🚀 CastleGate Backend running on port 3000"
- [ ] Webbläsare visar JSON på http://localhost:3000/health
- [ ] Ingen fel i terminalen

---

**🎉 Klar! Applikationen är nu igång!**

