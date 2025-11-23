# Guide: Skaffa Test BankID

## Problemet

Felmeddelandet "Det finns inget BankID i den här datorn" betyder att:
- ❌ Du har inget BankID installerat på datorn
- ❌ BankID kan inte bara "laddas ner" - det måste beställas/skapas
- ❌ För test behöver du ett **test BankID** från BankID's test-sida

## Hur BankID fungerar

### BankID på datorn kräver:
1. **BankID-kort** (fysiskt kort som sätts i kortläsare)
   - Eller
2. **BankID-app på mobilen** (används via QR-kod)

### För vår webapp:
- Vi använder **QR-kod** som användaren skannar med BankID-appen på telefonen
- Datorn behöver INTE ha BankID installerat
- Användaren behöver BankID-appen på sin telefon

## Så här skaffar du ett Test BankID

### Steg 1: Konfigurera BankID-appen för test

**På datorn (redan gjort):**
- ✅ `CavaServerSelector.txt` med `kundtest` är skapat
- ✅ BankID-appen på datorn är konfigurerad för test

**På telefonen (behöver göras):**
- ⚠️ Du behöver en test-telefon (inte din privata)
- Eller temporärt avinstallera produktions-BankID

### Steg 2: Gå till BankID's test-sida

1. Gå till: https://www.bankid.com/utvecklare/guider/teknisk-integration/testmiljo
2. Scrolla ner till "Issue a test BankID" eller "Skaffa test BankID"
3. Klicka på länken till test-sidan

### Steg 3: Beställ test BankID

På test-sidan:
1. Följ instruktionerna för att skapa ett test BankID
2. Du kommer få ett test BankID som du kan installera
3. Installera test BankID på din test-telefon (eller temporärt på din privata telefon)

### Steg 4: Testa QR-koden

När du har test BankID installerat:
1. Öppna vår app i webbläsaren
2. Klicka på "Logga in med BankID"
3. QR-koden visas
4. Öppna BankID-appen på telefonen (med test BankID)
5. Skanna QR-koden
6. Signera i BankID-appen

## Viktigt att veta

### BankID kan inte bara "laddas ner"
- ❌ Det finns ingen fil att ladda ner som ger dig ett BankID
- ✅ BankID måste beställas/skapas (antingen från banken eller test-sidan)
- ✅ För test: Beställ från BankID's test-sida
- ✅ För produktion: Beställ från din bank

### För vår webapp behöver du:
1. ✅ Backend-servern körs (redan gjort)
2. ✅ BankID-appen på datorn konfigurerad för test (redan gjort)
3. ⚠️ BankID-appen på telefonen konfigurerad för test
4. ⚠️ Ett test BankID installerat på telefonen

## Alternativ: Testa utan fysisk telefon

Om du inte har en test-telefon just nu kan du:

### Alternativ 1: Simulator/Emulator
- Använd iOS Simulator eller Android Emulator
- Installera BankID där
- Konfigurera för test
- Testa QR-koden (kan vara svårt att skanna från simulator)

### Alternativ 2: Mock/Test mode
- Skapa en test-mode i appen som simulerar BankID
- Användbart för UI-testning
- Fungerar inte med riktig BankID-integration

### Alternativ 3: Vänta med test-telefon
- Fortsätt utveckla UI och funktionalitet
- Testa BankID-integrationen när du har tillgång till test-telefon

## Nästa steg

1. **Beställ test BankID:**
   - Gå till BankID's test-sida
   - Följ instruktionerna
   - Installera på test-telefon

2. **Konfigurera test-telefon:**
   - Installera BankID-appen
   - Konfigurera för test (`cavainternal.test.bankid.com`)
   - Verifiera att "CUST" visas

3. **Testa:**
   - Öppna vår app
   - Klicka "Logga in med BankID"
   - Skanna QR-koden med test-telefonen

## Support

Om du har problem med att beställa test BankID:
- Kontrollera BankID's dokumentation
- Kontakta BankID support
- Kontrollera att alla steg är följda korrekt



