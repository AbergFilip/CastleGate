# BankID API Implementation Guide

## Översikt

Vår implementation följer BankID API-dokumentationen och använder följande endpoints:

### ✅ Implementerade Endpoints

#### 1. `/auth` - Authentication
- **Användning:** Identifierar användaren (för inloggning)
- **Status:** ✅ Implementerad
- **Location:** `backend/server.js` → `POST /api/bankid/auth`
- **Funktioner:**
  - Initierar BankID-autentisering
  - Returnerar `orderRef`, `autoStartToken`, `qrStartToken`, `qrStartSecret`
  - Sparar QR-generator för senare användning

#### 2. `/collect` - Status Check
- **Användning:** Hämtar status för pågående order
- **Status:** ✅ Implementerad
- **Location:** `backend/server.js` → `POST /api/bankid/collect`
- **Funktioner:**
  - Pollas var 2:e sekund från frontend
  - Returnerar status: `pending`, `complete`, eller `failed`
  - Returnerar `completionData` när klar

#### 3. `/qr` - QR Code Generation
- **Användning:** Genererar animerad QR-kod
- **Status:** ✅ Implementerad (custom endpoint)
- **Location:** `backend/server.js` → `POST /api/bankid/qr`
- **Funktioner:**
  - Använder BankID's egen QrGenerator
  - Uppdateras varje sekund (tidsbaserad)
  - Fallback till manuell generering om nödvändigt

### ⚠️ Endpoints som inte behövs just nu

#### `/sign` - Digital Signature
- **Användning:** Digital signering av dokument
- **Status:** ❌ Inte implementerad (behövs inte för inloggning)

#### `/payment` - Payment Signature
- **Användning:** Digital signering för betalningar
- **Status:** ❌ Inte implementerad (endast för företag med betalkort)

#### `/phone/auth` och `/phone/sign`
- **Användning:** Autentisering/signering via telefon
- **Status:** ❌ Inte implementerad (behövs inte)

#### `/cancel` - Cancel Order
- **Användning:** Avbryter pågående order
- **Status:** ⚠️ Inte implementerad (kan vara användbart)

## Implementation Details

### QR Code vs Autostart

Enligt dokumentationen:
> "If the BankID app is installed on the same device as your service executes in, the BankID app can be launched automatically. If your service is running on another device, for example in a PC web browser, your service must present an animated QR code that the user will scan with their BankID app."

**Vår implementation:**
- ✅ Använder QR-kod (eftersom vi kör i webbläsare)
- ✅ QR-koden är animerad (uppdateras varje sekund)
- ✅ Använder `autoStartToken` som fallback om QR inte fungerar

### Polling Strategy

Enligt dokumentationen:
> "Should be polled until you get a success or failure."

**Vår implementation:**
- ✅ Pollar `/collect` var 2:e sekund
- ✅ Stoppar när status är `complete` eller `failed`
- ✅ Hanterar fel gracefully (fortsätter polla vid tillfälliga fel)

### Certificate

Enligt dokumentationen:
> "You use the BankID identification or signature services through the API. The API can only be accessed if you have a valid certificate."

**Vår implementation:**
- ✅ Använder test-certifikat från `node_modules/bankid/cert/`
- ✅ Konfigurerat med `production: false` i `BankIdClientV6`
- ⚠️ För produktion behöver vi ett riktigt certifikat från banken

## Förbättringar som kan göras

### 1. Lägg till `/cancel` endpoint

```javascript
// POST /api/bankid/cancel
app.post('/api/bankid/cancel', async (req, res) => {
  try {
    const { orderRef } = req.body
    if (!orderRef) {
      return res.status(400).json({ message: 'orderRef is required' })
    }
    await bankid.cancel({ orderRef })
    res.json({ success: true })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})
```

### 2. Förbättra felhantering

Hantera olika `hintCode` från `/collect`:
- `userCancel` - Användaren avbröt
- `expiredTransaction` - Transaktionen gick ut
- `certificateErr` - Certifikatfel
- etc.

### 3. Timeout-hantering

Lägg till timeout för autentisering (BankID har 60 sekunder timeout).

## Best Practices

✅ **Gjort:**
- Använder korrekt endpoint för autentisering
- Pollar `/collect` tills klar
- Använder QR-kod för webbläsare
- Hanterar IP-adresser korrekt
- Använder test-certifikat i testmiljö

⚠️ **Kan förbättras:**
- Lägg till `/cancel` endpoint
- Förbättra felhantering med hintCodes
- Lägg till timeout-hantering
- Bättre logging för debugging

## Testmiljö

- ✅ Använder test-certifikat
- ✅ `BANKID_PRODUCTION=false` i `.env`
- ✅ BankID-appen konfigurerad för test (`CavaServerSelector.txt`)
- ✅ Test BankID på telefon krävs

## Produktionsmiljö

För produktion behöver vi:
1. ✅ Avtal med bank om BankID-tjänst
2. ✅ Produktions-certifikat från banken
3. ✅ Sätt `BANKID_PRODUCTION=true` i `.env`
4. ✅ Konfigurera BankID-appen för produktion (ta bort `CavaServerSelector.txt`)

