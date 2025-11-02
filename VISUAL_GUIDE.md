# 🎨 CastleGate - Visuell Gränssnittsguide

## 🌐 Öppna Web-gränssnittet

Jag har skapat ett **beautiful Next.js web-gränssnitt** för att se applikationen visuellt!

### 🚀 Starta Web-gränssnittet

**Öppna ett NYTT PowerShell-fönster** och kör:

```powershell
cd C:\Users\Filip\CastleGate\web
npm install  # Om du inte redan gjort det
npm run dev
```

Du bör se:
```
> Ready on http://localhost:3001

✓ Compiled successfully
```

### 👀 Öppna i Webbläsare

Gå till:
```
http://localhost:3001
```

---

## 🎨 Vad du kommer se

### **Dashboard**
- 🏰 **CastleGate header** - Blue gradient design
- 👤 **Välkomstmeddelande** - "Virtually Me"
- 📊 **Stats cards** - Dokument, Tillgångar, CGC coins
- 🎯 **Navigation tabs** - 5 olika sektioner

### **Navigation Tabs**

1. **🏠 Översikt (Home)**
   - AI-rekommendationer
   - Snabbstatistik
   - Aktuella erbjudanden

2. **📄 Dokument**
   - Lista över alla dokument
   - Upload-funktion
   - Kategorisering

3. **💼 Wallet**
   - Castlegate Coins saldo
   - Wallet-adress
   - Transaktionshistorik

4. **🤖 AI**
   - AI-assistent interface
   - Produktjämförelse
   - Rekommendationer

5. **🏪 Marknadsplats**
   - Permission marketing
   - Personliga erbjudanden
   - Inställningar

---

## 💻 Teknologi

- **Next.js 14** - React framework
- **Material-UI** - Material Design komponenter
- **TypeScript** - Type-safe kod
- **Responsive Design** - Fungerar på alla enheter

---

## 🔗 API Integration

Web-gränssnittet är **redan anslutet** till din backend:
- Backend kör på: `http://localhost:3000`
- Web kör på: `http://localhost:3001`
- Alla API-anrop går automatiskt till rätt endpoint

---

## 📱 Användargränssnitt Features

✅ **Modern UI Design** - Material Design 3
✅ **Responsive** - Fungerar på desktop, tablet, mobile
✅ **Dark/Light mode ready** - (Kan läggas till)
✅ **Navigation** - Tabs för olika sektioner
✅ **Stats Dashboard** - Visuell översikt
✅ **Icons** - Material Icons för clarity
✅ **Cards** - Modern card-baserad layout

---

## 🎯 Efter Web Gränssnittet Kör

Du kommer kunna:

1. **Se hela applikationen visuellt**
2. **Navigera mellan olika sektioner**
3. **Se API-status**
4. **Förstå app-strukturen bättre**

Detta är **inte** en fullständig UI ännu - det är en **demo/prototyp** för att visa appens struktur!

---

## 🔄 Fullständig UI Utveckling

För att utveckla fullständig UI behöver vi:

- [ ] BankID inloggning i UI
- [ ] Dokumentuppladdning
- [ ] Wallet integration
- [ ] AI chat interface
- [ ] Marknadsplats features
- [ ] Användarprofil
- [ ] Settings

Men detta ger dig en **bra start** att se hur appen ser ut!

---

## 💡 Tips

### Se båda serverna
```powershell
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Web UI
cd web
npm run dev
```

### Testa API från Web
Öppna DevTools (F12) i webbläsaren och kör:
```javascript
fetch('http://localhost:3000/api/auth/bankid', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ personalNumber: '199001011234' })
}).then(r => r.json()).then(console.log)
```

---

**🎉 Nu har du ett visuellt gränssnitt att arbeta med!**

