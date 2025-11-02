# 🌐 CastleGate Web UI - Startguide

## ⚡ Snabbstart Web-gränssnittet

### 1. Öppna ett NYTT terminalfönster

### 2. Navigera till web-mappen
```powershell
cd C:\Users\Filip\CastleGate\web
```

### 3. Installera dependencies (första gången)
```powershell
npm install
```

### 4. Starta web-servern
```powershell
npm run dev
```

### 5. Öppna webbläsare
```
http://localhost:3001
```

---

## ✅ Förväntad Output

Du bör se:
- 🏰 **Blue gradient CastleGate header**
- 👋 **Välkomstkort** "Välkommen till CastleGate"
- 📊 **3 statistik-kort** (Dokument, Tillgångar, CGC)
- 🎯 **5 navigation tabs** (Översikt, Dokument, Wallet, AI, Marknadsplats)
- 🔗 **API Status** visar att backend är online

---

## 🎨 Design Features

- ✅ Modern Material-UI design
- ✅ Responsive layout
- ✅ Icons för varje sektion
- ✅ Blue gradient theme (CastleGate branding)
- ✅ Card-baserad layout
- ✅ Clean, professional look

---

## 🔗 Hur Det Fungerar

```
Web UI (port 3001)  →  API Calls  →  Backend (port 3000)
     ↓                                    ↓
Browser                           Express + TypeScript
```

Båda serverna **måste** köra samtidigt för att det ska fungera!

---

## 🐛 Problemlösning

### Port 3001 är upptagen
```powershell
netstat -ano | findstr :3001
taskkill /PID [nummer] /F
```

### Web visar "Cannot connect to backend"
- Kontrollera att backend kör: `http://localhost:3000/health`
- Starta backend i ett annat terminalfönster

### npm install fel
```powershell
cd web
rm -r node_modules
npm install
```

---

## 📚 Mer Information

- Se `VISUAL_GUIDE.md` för UI-detaljer
- Se `ARCHITECTURE.md` för teknisk översikt
- Se `TEST_API.md` för API-testning

---

**Öppna http://localhost:3001 och njut av ditt visuella gränssnitt! 🎉**

