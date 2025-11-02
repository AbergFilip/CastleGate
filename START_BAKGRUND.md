# 🚀 Starta CastleGate Backend Manuellt

## Problemet
Terminalkommandon i bakgrunden fungerar inte alltid i Windows PowerShell. 
Här är hur du startar servern manuellt:

## ✅ Steg-för-steg

### 1. Öppna ett NYTT PowerShell-fönster
- Tryck `Win + X` och välj "Terminal" eller "PowerShell"
- ELLER högerklicka på projektmappen och välj "Open in Terminal"

### 2. Navigera till backend-mappen
```powershell
cd C:\Users\Filip\CastleGate\backend
```

### 3. Starta servern
```powershell
npm run dev
```

### 4. Du bör se:
```
[nodemon] starting `ts-node src/index.ts`
🚀 CastleGate Backend running on port 3000
📱 Environment: development
```

### 5. Öppna webbläsare
Gå till:
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

## ✅ Framgång!

Om du ser JSON-responsen fungerar servern!

## 🛑 Stoppa servern
I terminalen där servern kör: Tryck `Ctrl + C`

## ❌ Fungerar det fortfarande inte?

### Testa att bygga först:
```powershell
cd backend
npm run build
node dist/index.js
```

### Kontrollera porten:
```powershell
netstat -ano | findstr :3000
```
Om någon annan process använder port 3000, döda den:
```powershell
taskkill /PID [nummer] /F
```

### Installera om:
```powershell
cd backend
rm -r node_modules
npm install
npm run dev
```

---

**TIPS:** Låt terminalfönstret vara öppet medan servern kör!

