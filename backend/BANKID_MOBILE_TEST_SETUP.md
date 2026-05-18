# BankID Mobile App Test Setup - Felsökning

## Problem: "CUST" visas inte i About BankID

Om du inte ser "CUST" vid version numret i Settings → Support → About BankID, betyder det att appen inte är korrekt konfigurerad för test.

## Steg-för-steg felsökning

### 1. Kontrollera iOS Settings

**Gå till:** iOS Settings → BankID → Developer → Server

**Kontrollera att:**
- ✅ Server är satt till: `cavainternal.test.bankid.com`
- ✅ Inga mellanslag eller extra tecken
- ✅ Inga citattecken runt värdet

**Om det inte finns:**
- Kontrollera att du har Developer-alternativet aktiverat
- Vissa versioner kräver att Developer-läge är aktiverat först

### 2. Avinstallera och installera om appen

**VIKTIGT:** Du måste avinstallera appen HELT innan du installerar om den.

1. Håll ned BankID-appen på hem-skärmen
2. Tryck på "X" eller "Ta bort app"
3. Bekräfta avinstallation
4. Gå till App Store
5. Installera BankID Security App igen
6. Öppna appen och gå till Settings → Developer → Server
7. Ange: `cavainternal.test.bankid.com`
8. Stäng appen HELT (swipe up från app switcher)
9. Öppna appen igen
10. Gå till Settings → Support → About BankID
11. Kontrollera att "CUST" visas

### 3. Kontrollera Developer-läge

Om du inte ser "Developer" i Settings:

**För iOS:**
- Vissa versioner kräver att Developer-läge aktiveras först
- Kontrollera iOS-inställningar för Developer-options

**Alternativ metod:**
- Öppna BankID-appen
- Gå till Settings
- Leta efter "Developer" eller "Utvecklare"
- Om det inte finns, kan det vara att appen inte stöder test-konfiguration i din version

### 4. Verifiera server-inställningen

Efter att ha angett servern:

1. Stäng appen HELT
2. Starta om appen
3. Gå till Settings → Developer → Server
4. Verifiera att `cavainternal.test.bankid.com` fortfarande är där
5. Om den är borta, ange den igen och spara

### 5. Kontrollera app-version

Vissa äldre versioner av BankID-appen stöder inte test-konfiguration.

- Kontrollera att du har den senaste versionen från App Store
- Uppdatera appen om nödvändigt

### 6. Alternativ: Android

Om du använder Android:

1. Avinstallera BankID-appen
2. Installera om från Google Play Store
3. Öppna appen
4. Gå till Settings → Developer → Server
5. Ange: `cavainternal.test.bankid.com`
6. Stäng appen HELT
7. Starta om appen
8. Verifiera "CUST" i About BankID

## Vanliga problem

### Problem: "Developer" finns inte i Settings

**Lösning:**
- Kontrollera att du har den senaste versionen av appen
- Vissa versioner har Developer-options på annat ställe
- Försök: Settings → Advanced → Developer

### Problem: Server-inställningen sparas inte

**Lösning:**
- Stäng appen HELT efter att ha sparat
- Starta om appen
- Kontrollera att inställningen fortfarande är där
- Om den försvinner, kan det vara ett behörighetsproblem

### Problem: "CUST" visas fortfarande inte

**Lösning:**
1. Avinstallera appen HELT
2. Starta om telefonen
3. Installera appen igen
4. Konfigurera servern
5. Stäng appen HELT
6. Starta om appen
7. Kontrollera igen

## Verifiering

När "CUST" visas i About BankID betyder det att:
- ✅ Appen är korrekt konfigurerad för test
- ✅ Appen kommer att ansluta till test-servern
- ✅ Du kan använda test BankID

## Nästa steg

När "CUST" visas:
1. Gå till [BankID Test-sidan](https://www.bankid.com/utvecklare/guider/teknisk-integration/testmiljo)
2. Följ instruktionerna för att skaffa en test BankID
3. Installera test BankID på din telefon
4. Testa QR-koden i appen

## Support

Om inget fungerar:
- Kontrollera BankID's support-sida
- Kontakta BankID support
- Kontrollera att din telefon och iOS-version stöds





