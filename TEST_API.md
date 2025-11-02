# ✅ CastleGate API - Test Guide

## Servern Kör! 🎉

Du ser nu:
```json
{
  "status": "OK",
  "timestamp": "2025-11-02T11:18:04.782Z",
  "service": "CastleGate Backend"
}
```

Detta betyder att **backend fungerar perfekt!**

---

## 🧪 Testa Alla API Endpoints

### 1. Health Check ✅ (Redan testat!)
```
GET http://localhost:3000/health
```

---

### 2. Authentication Endpoints

#### Initiera BankID Login
Öppna i webbläsare (POST går bara via DevTools):
```javascript
// Öppna Console i DevTools (F12) och kör:
fetch('http://localhost:3000/api/auth/bankid', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ personalNumber: '199001011234' })
}).then(r => r.json()).then(console.log)
```

Förväntad respons:
```json
{
  "success": true,
  "message": "BankID authentication initiated",
  "transactionId": "mock-transaction-id"
}
```

#### Verifiera BankID Token
```javascript
fetch('http://localhost:3000/api/auth/bankid/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ token: 'test-token' })
}).then(r => r.json()).then(console.log)
```

---

### 3. Documents Endpoints

#### Lista Dokument (GET)
Öppna i webbläsare:
```
http://localhost:3000/api/documents
```

Du kommer få 401 Unauthorized eftersom du behöver autentiserad session, men det visar att routen fungerar!

#### Alternativ: Testa med mock token
```javascript
fetch('http://localhost:3000/api/documents', {
  headers: { 'Authorization': 'Bearer test-token' }
}).then(r => r.json()).then(console.log)
```

---

### 4. Blockchain Endpoints

#### Generera Wallet (POST)
```javascript
fetch('http://localhost:3000/api/blockchain/wallet/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer test-token'
  }
}).then(r => r.json()).then(console.log)
```

#### Hämta Wallet Address (GET)
```
http://localhost:3000/api/blockchain/wallet/address
```

#### Hämta Castlegate Coins Saldo (GET)
```
http://localhost:3000/api/blockchain/coins/balance
```

---

### 5. AI Endpoints

#### Fråga AI Assistant (POST)
```javascript
fetch('http://localhost:3000/api/ai/ask', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer test-token'
  },
  body: JSON.stringify({
    query: 'Hur många dokument har jag?',
    context: {}
  })
}).then(r => r.json()).then(console.log)
```

#### Få Rekommendationer (GET)
```
http://localhost:3000/api/ai/recommendations
```

#### Övervaka Avtal (GET)
```
http://localhost:3000/api/ai/contracts
```

---

### 6. Marketplace Endpoints

#### Hämta Marknadsplats (GET)
```
http://localhost:3000/api/marketplace
```

#### Hämta Marketing Preferenser (GET)
```
http://localhost:3000/api/marketplace/preferences
```

---

## 🎯 Quick Test - PowerShell

Kör detta i ett nytt PowerShell-fönster:

```powershell
# Test BankID
$body = @{personalNumber='199001011234'} | ConvertTo-Json
Invoke-WebRequest -Uri http://localhost:3000/api/auth/bankid -Method POST -Body $body -ContentType 'application/json' | Select-Object -ExpandProperty Content

# Test Documents (skulle få auth error)
Invoke-WebRequest -Uri http://localhost:3000/api/documents -Headers @{Authorization='Bearer test'} | Select-Object StatusCode

# Test Blockchain
Invoke-WebRequest -Uri http://localhost:3000/api/blockchain/coins/balance -Headers @{Authorization='Bearer test'} | Select-Object StatusCode

# Test AI
Invoke-WebRequest -Uri http://localhost:3000/api/ai/recommendations -Headers @{Authorization='Bearer test'} | Select-Object StatusCode
```

---

## 📊 Status Codes

- ✅ **200 OK** - Allt fungerar
- ⚠️ **401 Unauthorized** - Behöver authentication (förväntat!)
- ⚠️ **404 Not Found** - Endpoint finns inte
- ❌ **500 Error** - Serverfel (kolla logs!)

---

## 📝 Next Steps

1. ✅ **Backend fungerar** - Du ser health check
2. ⏭️ **Installera MongoDB** - För persistent data
3. ⏭️ **Integrera BankID** - Riktig authentication
4. ⏭️ **Sätt upp Blockchain** - Infura/WalletConnect
5. ⏭️ **Lägg till AI** - OpenAI/Anthropic
6. ⏭️ **Mobile App** - Testa React Native app

---

## 🎉 Du är klar med Fas 1!

Backend är upp, alla endpoints är tillgängliga, och ready för utveckling!

Fortsätt med:
- MongoDB för data
- BankID integration
- Blockchain setup
- AI integration
- Mobile app development

