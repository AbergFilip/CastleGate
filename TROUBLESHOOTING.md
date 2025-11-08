# Felsökning - ERR_CONNECTION_REFUSED

Om du får "ERR_CONNECTION_REFUSED" eller "webbplatsen kan inte nås" betyder det att utvecklingsservern inte körs.

## Lösning 1: Använd start.bat

1. Dubbelklicka på filen `start.bat` i projektmappen
2. Vänta tills du ser "Local: http://localhost:5173" i fönstret
3. Öppna webbläsaren och gå till `http://localhost:5173`

## Lösning 2: Manuell start i terminal

1. Öppna PowerShell eller Command Prompt
2. Navigera till projektmappen:
   ```powershell
   cd C:\Users\Filip\CastleGate
   ```

3. Installera beroenden (första gången):
   ```powershell
   npm install
   ```

4. Starta servern:
   ```powershell
   npm run dev
   ```

5. Du ska se något liknande:
   ```
   VITE v5.x.x  ready in xxx ms

   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

6. Öppna `http://localhost:5173` i webbläsaren

## Lösning 3: Kontrollera Node.js

Om kommandona inte fungerar, kontrollera att Node.js är installerat:

1. Öppna PowerShell
2. Skriv: `node --version`
3. Om du får ett fel, ladda ner Node.js från https://nodejs.org/
4. Installera och starta om datorn
5. Försök igen

## Lösning 4: Kontrollera port

Om port 5173 är upptagen:

1. Stäng alla andra program som kan använda porten
2. Eller ändra port i `vite.config.ts`:
   ```typescript
   export default defineConfig({
     plugins: [react()],
     server: {
       port: 3000  // Ändra till annan port
     }
   })
   ```

## Vanliga fel

### "npm is not recognized"
- Node.js är inte installerat eller inte i PATH
- Installera Node.js från https://nodejs.org/

### "Cannot find module"
- Kör `npm install` igen
- Ta bort `node_modules` mappen och `package-lock.json` och kör `npm install` igen

### Port redan används
- Stäng andra program som använder port 5173
- Eller ändra port i vite.config.ts

## Kontakta mig

Om inget av ovanstående fungerar, kopiera hela felmeddelandet från terminalen och skicka till mig.

