# BankID Test Setup Guide

För att använda BankID i testmiljö måste BankID-applikationen konfigureras korrekt.

## Steg 1: Starta BankID-appen

1. Starta BankID-applikationen på din dator
2. Stäng appen igen (File → Exit)
3. Detta skapar nödvändiga mappar

## Steg 2: Konfigurera för test

### Windows

1. Öppna Utforskaren
2. Gå till: `%appdata%\BankID\Config`
   - Eller: `C:\Users\<DITT_ANVÄNDARNAMN>\AppData\Roaming\BankID\Config`
3. Skapa en fil som heter `CavaServerSelector.txt`
4. Skriv innehållet: `kundtest` (utan citattecken)
5. Spara filen

### macOS

1. Öppna Finder
2. Tryck på `Alt` (Option) och välj "Go" → "Library"
3. Gå till: `Application Support/BankID/Config`
4. Skapa en fil som heter `CavaServerSelector.txt`
5. Skriv innehållet: `kundtest` (utan citattecken)
6. Spara filen

## Steg 3: Starta om BankID-appen

**VIKTIGT:** Du måste stänga BankID-appen helt (File → Exit) och starta om den för att konfigurationen ska gälla.

## Steg 4: Skaffa test BankID

1. Gå till [BankID Test-sidan](https://www.bankid.com/utvecklare/guider/teknisk-integration/testmiljo)
2. Följ instruktionerna för att skaffa en test BankID
3. Installera test BankID på din telefon

## Vanliga problem

### "Invalid Credentials" eller "BankID is missing"

- ✅ Kontrollera att `CavaServerSelector.txt` finns och innehåller `kundtest`
- ✅ Starta om BankID-appen (File → Exit, sedan starta igen)
- ✅ Kontrollera att du använder en test BankID på din telefon

### BankID-appen startar inte i testläge

- ✅ Kontrollera att filen heter exakt `CavaServerSelector.txt` (med stor C)
- ✅ Kontrollera att innehållet är exakt `kundtest` (liten k, inga mellanslag)
- ✅ Kontrollera att filen är i rätt mapp: `%appdata%\BankID\Config`

### QR-koden fungerar inte

- ✅ Kontrollera att backend-servern körs med `BANKID_PRODUCTION=false`
- ✅ Kontrollera att BankID-appen är konfigurerad för test
- ✅ Kontrollera att du använder en test BankID på din telefon

## Verifiera konfiguration

Efter att du har konfigurerat BankID för test, testa att logga in på en test-sida. Om det fungerar är konfigurationen korrekt.

## Support

Om du fortfarande har problem:
1. Kontrollera BankID-loggar: `C:\Users\<USER>\AppData\Roaming\BankID\Logs`
2. Kontrollera att ingen proxy blockerar kommunikationen
3. Kontrollera att du inte har både test och production BankID installerat samtidigt

