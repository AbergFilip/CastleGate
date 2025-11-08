# Instruktioner för att starta appen

## Steg 1: Installera beroenden
Öppna en terminal i projektmappen och kör:
```bash
npm install
```

## Steg 2: Starta utvecklingsservern
```bash
npm run dev
```

## Steg 3: Öppna i webbläsaren
Servern kommer köra på `http://localhost:5173`

Öppna denna URL i din webbläsare.

---

## Felsökning

### Om "webbplatsen kan inte nås":
1. Kontrollera att servern faktiskt körs (du ska se "Local: http://localhost:5173" i terminalen)
2. Kontrollera att port 5173 inte är blockerad av brandvägg
3. Försök öppna `http://127.0.0.1:5173` istället

### Om npm install inte fungerar:
1. Kontrollera att Node.js är installerat: `node --version`
2. Kontrollera att npm är installerat: `npm --version`
3. Om de saknas, ladda ner från https://nodejs.org/

### Om det finns fel i terminalen:
Kopiera felmeddelandet och skicka till mig så kan jag hjälpa dig fixa det.

