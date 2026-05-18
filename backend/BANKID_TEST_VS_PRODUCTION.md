# BankID Test vs Production - Viktig Information

## ⚠️ VIKTIGT: Du kan inte använda samma BankID-app för både test och produktion

Enligt BankID's dokumentation:
> "Please note that you can't use the application for both test and production with the same user account in your computer. You need to have either two separate accounts, or a separate computer for testing."

Detta gäller också för mobilappar!

## Problemet

Om du har en produktions-BankID installerad på din telefon och försöker konfigurera appen för test:
- ❌ Appen kommer fortfarande använda produktions-servern
- ❌ "CUST" kommer inte visas i About BankID
- ❌ QR-koden kommer inte fungera med test-servern

## Lösningar

### Alternativ 1: Använd en separat telefon (Rekommenderat)

**Bästa lösningen för utveckling:**
- Använd en gammal telefon eller en test-telefon
- Installera BankID på den telefonen
- Konfigurera den för test
- Använd den endast för testning

**Fördelar:**
- ✅ Du kan behålla din produktions-BankID på din privata telefon
- ✅ Ingen risk att förstöra din produktions-BankID
- ✅ Enkelt att växla mellan test och produktion

### Alternativ 2: Avinstallera och installera om (Tidskrävande)

**Om du måste använda samma telefon:**

1. **Spara din produktions-BankID:**
   - Kontrollera att du har tillgång till din produktions-BankID på annat sätt
   - Du kan behöva beställa en ny om något går fel

2. **Avinstallera BankID-appen:**
   - Ta bort appen helt från telefonen

3. **Installera om och konfigurera för test:**
   - Installera BankID från App Store
   - Konfigurera för test (cavainternal.test.bankid.com)
   - Verifiera att "CUST" visas

4. **När du är klar med testning:**
   - Avinstallera appen igen
   - Installera om
   - Konfigurera för produktion (ta bort test-inställningar)
   - Logga in med din produktions-BankID igen

**Nackdelar:**
- ⚠️ Tidskrävande att växla
- ⚠️ Risk att förlora produktions-BankID om något går fel
- ⚠️ Måste göra om varje gång du vill växla

### Alternativ 3: Använd simulator/emulator (För utvecklare)

**Om du utvecklar:**
- Använd iOS Simulator eller Android Emulator
- Installera BankID i simulatorn
- Konfigurera för test
- Testa QR-koden där

**Nackdelar:**
- ⚠️ QR-kod scanning kan vara svårt i simulator
- ⚠️ Kräver utvecklingsverktyg

## Rekommendation

**För utveckling:**
1. Använd en separat test-telefon om möjligt
2. Eller använd en gammal telefon som du kan dedikera för testning
3. Behåll din produktions-BankID på din privata telefon

**För snabb testning:**
- Du kan temporärt avinstallera produktions-BankID
- Konfigurera för test
- Testa
- Installera om produktions-BankID när du är klar

## Varningar

⚠️ **VIKTIGT:**
- Om du avinstallerar BankID-appen kan du förlora tillgång till din produktions-BankID
- Kontrollera att du har backup eller kan beställa en ny
- BankID rekommenderar att ha separata enheter för test och produktion

## För din situation

Eftersom du redan har en produktions-BankID på din privata telefon:

**Bästa lösningen:**
1. Hitta en gammal telefon eller test-telefon
2. Installera BankID där
3. Konfigurera för test
4. Använd den för att testa QR-koden

**Alternativ (om du måste använda samma telefon):**
1. Avinstallera BankID från din privata telefon
2. Installera om och konfigurera för test
3. Testa QR-koden
4. När du är klar: avinstallera och installera om för produktion

## Nästa steg

När du har konfigurerat en telefon för test:
1. Verifiera att "CUST" visas i About BankID
2. Skaffa en test BankID från BankID's test-sida
3. Installera test BankID på test-telefonen
4. Testa QR-koden i appen





