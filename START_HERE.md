# 🏰 CastleGate - Så här startar du applikationen

## ✅ Status

Backend är konfigurerat och redo att starta! Alla filer är på plats.

## 🚀 Starta Backend Server

Öppna **PowerShell** i projektmappen och kör:

```powershell
cd backend
npm install  # Om du inte redan gjort det
npm run dev
```

Du bör se:
```
🚀 CastleGate Backend running on port 3000
📱 Environment: development
```

## 🌐 Testa i Webbläsare

Öppna denna URL i din webbläsare:
```
http://localhost:3000/health
```

Du bör se:
```json
{
  "status": "OK",
  "timestamp": "2025-11-02T...",
  "service": "CastleGate Backend"
}
```

## 📱 Mobile App (Valfritt för nu)

För att köra mobilappen behöver du installera fler verktyg. Fokusera på backend först!

Om du vill testa mobile app senare:
```powershell
cd mobile
npm install
npm start
```

## 🔍 Projektstruktur

```
CastleGate/
├── backend/           ✅ Backend API (Kör på port 3000)
│   ├── src/
│   │   ├── controllers/  # API-logik
│   │   ├── routes/       # API-endpoints
│   │   └── middleware/   # Auth, security
│   └── package.json
├── mobile/            ✅ React Native app
│   └── src/
│       ├── screens/      # UI-skärmar
│       └── contexts/     # State management
├── README.md         ✅ Huvuddokumentation
├── ARCHITECTURE.md   ✅ Teknisk design
└── QUICKSTART.md     ✅ Detaljerad guide
```

## 🎯 Tillgängliga API Endpoints

När backend kör kommer du åt:

### Authentication
- `POST /api/auth/bankid` - BankID login
- `POST /api/auth/bankid/verify` - Verifiera BankID

### Documents
- `GET /api/documents` - Lista dokument
- `POST /api/documents` - Ladda upp dokument

### Blockchain
- `POST /api/blockchain/wallet/generate` - Skapa wallet
- `GET /api/blockchain/coins/balance` - Saldo

### AI
- `POST /api/ai/ask` - Fråga AI
- `POST /api/ai/compare` - Jämför produkter

### Marketplace
- `GET /api/marketplace` - Marknadsplats
- `GET /api/marketplace/preferences` - Preferenser

## 📝 Nästa Steg

1. ✅ **Backend är klar** - Starta servern
2. ⏳ **BankID** - Integrera riktigt BankID API
3. ⏳ **MongoDB** - Sätt upp databas
4. ⏳ **Blockchain** - Konfigurera Infura/WalletConnect
5. ⏳ **AI** - Lägg till OpenAI/Anthropic

## ❓ Problemlösning

**Backend startar inte?**
- Se felmeddelanden i terminalen
- Kontrollera att port 3000 är ledig
- Kolla `backend/logs/` för detaljerade loggar

**Behöver hjälp?**
- Läs `ARCHITECTURE.md` för teknisk översikt
- Läs `QUICKSTART.md` för detaljerade instruktioner
- Se `README.md` för projektöversikt

---

**🎉 Du är redo! Starta backend och se det fungera!**

