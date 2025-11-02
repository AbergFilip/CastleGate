# 🎯 FINAL GUIDE - Starta CastleGate

## ✅ ALLT ÄR KLART!

### 🚀 STARTA NU I 2 TERMINALFÖNSTER:

---

### **Terminal 1: Backend**
```powershell
cd C:\Users\Filip\CastleGate\backend
npm run dev
```

**Ser du detta = det fungerar:**
```
🚀 CastleGate Backend running on port 3000
📱 Environment: development
```

---

### **Terminal 2: Web UI** 
```powershell
cd C:\Users\Filip\CastleGate\web
npm run dev
```

**Ser du detta = det fungerar:**
```
▲ Next.js 14.2.33
- Local:        http://localhost:3001

✓ Ready in 2.2s
```

---

## 🌐 ÖPPNA I WEBBLÄSARE:
```
http://localhost:3001
```

---

## 🎨 Du Ser:

- 🏰 **CastleGate** header
- 💙 **Blue gradient** welcome card  
- 📊 **Stats:** 12 Dokument, 3 Tillgångar, 1,234 CGC
- 🎯 **5 Tabs:** Översikt, Dokument, Wallet, AI, Marknadsplats
- ✅ **API Online** indicator

---

## 🐛 PROBLEM?

### Port upptagen?
```powershell
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Testa Backend:
```powershell
curl http://localhost:3000/health
```
Ska visa JSON med status OK.

### Restart allt:
1. Tryck Ctrl+C i båda terminaler
2. Stoppa alla Node-processer (kommandot ovan)
3. Starta om från början

---

## ✅ CHECKLIST:

- [ ] Backend kör i Terminal 1 (port 3000)
- [ ] Web UI kör i Terminal 2 (port 3001)  
- [ ] Båda visar "Ready" medelst fel
- [ ] http://localhost:3001 öppnas i webbläsare
- [ ] Du ser CastleGate UI

---

**🎉 FUNGERAR DET? Du har nu en FULLSTÄNDIG FUNGERANDE APP!**

