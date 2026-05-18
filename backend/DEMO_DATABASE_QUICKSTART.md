# Snabbguide: Deploya Databas för Investerare Demo

## 🎯 Mål
Deploya databasen till molnet så att investerare kan se applikationen live.

---

## ⚡ Snabbaste Vägen (20 minuter)

### **Alternativ 1: Azure PostgreSQL** ⭐ REKOMMENDERAT

#### **Steg 1: Skapa Database (5 min)**
```bash
# Logga in
az login

# Skapa database
az postgres flexible-server create \
  --resource-group castlegate-demo-rg \
  --name castlegate-demo-$(date +%s) \
  --location swedencentral \
  --admin-user postgres \
  --admin-password "DemoPassword123!" \
  --sku-name Standard_B1ms \
  --public-access 0.0.0.0
```

#### **Steg 2: Migrera Data (10 min)**
```bash
# 1. Dumpa lokal databas
pg_dump -h localhost -p 5433 -U postgres -d castlegate > demo_backup.sql

# 2. Hämta connection string (från Azure Portal eller CLI)
# Format: postgresql://postgres:DemoPassword123!@[server].postgres.database.azure.com:5432/postgres?sslmode=require

# 3. Skapa databas
psql "postgresql://postgres:DemoPassword123!@[server].postgres.database.azure.com:5432/postgres?sslmode=require" -c "CREATE DATABASE castlegate;"

# 4. Restore data
psql "postgresql://postgres:DemoPassword123!@[server].postgres.database.azure.com:5432/castlegate?sslmode=require" < demo_backup.sql
```

#### **Steg 3: Uppdatera Backend (2 min)**
```bash
# Lägg till i Key Vault eller .env
DATABASE_URL=postgresql://postgres:DemoPassword123!@[server].postgres.database.azure.com:5432/castlegate?sslmode=require
```

#### **Steg 4: Testa (3 min)**
```bash
# Starta backend
npm run start:dev

# Kontrollera logs - ska se:
# ✅ PostgreSQL-anslutning etablerad
```

**Kostnad:** ~$30/månad (kan stoppas när demo är klar)

---

### **Alternativ 2: Supabase** (Snabbare, 10 minuter)

#### **Steg 1: Skapa Project (2 min)**
1. Gå till https://supabase.com
2. Klicka "New Project"
3. Välj region: **Stockholm** (för GDPR)
4. Välj organisation och skapa

#### **Steg 2: Hämta Connection String (1 min)**
1. Gå till Settings → Database
2. Kopiera "Connection string" (URI format)

#### **Steg 3: Migrera Data (5 min)**
```bash
# 1. Dumpa lokal
pg_dump -h localhost -p 5433 -U postgres -d castlegate > demo_backup.sql

# 2. Restore till Supabase
psql "[SUPABASE_CONNECTION_STRING]" < demo_backup.sql
```

#### **Steg 4: Uppdatera Backend (2 min)**
```bash
# Lägg till i .env
DATABASE_URL=[SUPABASE_CONNECTION_STRING]
```

**Kostnad:** Gratis (begränsad) eller $25/månad

---

## 📊 Jämförelse för Demo

| Aspekt | Azure PostgreSQL | Supabase |
|--------|------------------|----------|
| **Setup-tid** | ~20 min | ~10 min |
| **Kostnad** | ~$30/månad | Gratis/$25 |
| **GDPR** | ✅ Sweden Central | ⚠️ Stockholm (OK) |
| **Kontroll** | ✅ Full | ⚠️ Begränsad |
| **Rekommendation** | ✅ För produktion | ✅ För snabb demo |

---

## 🎯 Rekommendation

### **För Snabb Demo (Idag):**
**Supabase** - Snabbaste setup, gratis tier

### **För Produktion:**
**Azure PostgreSQL** - Bästa säkerhet, GDPR-compliant

---

## ⚠️ Viktigt för Demo

### **Säkerhet:**
- ✅ Använd starkt lösenord
- ✅ SSL/TLS (krävs för Azure)
- ⚠️ Firewall: Öppna endast för demo-tid (stäng efteråt)

### **Kostnad:**
- **Azure:** Stoppa servern när demo är klar (spara pengar)
- **Supabase:** Gratis tier räcker för demo

### **Data:**
- ✅ Backup innan migration
- ✅ Verifiera data efter migration
- ✅ Testa API endpoints

---

## 🚀 Efter Deployment

### **1. Verifiera Anslutning**
```bash
# Testa från backend
npm run start:dev

# Kontrollera logs
# Ska se: ✅ PostgreSQL-anslutning etablerad
```

### **2. Testa API**
```bash
# Öppna Swagger
http://localhost:3001/api/docs

# Testa endpoints
curl http://localhost:3001/api/v1/documents
```

### **3. Verifiera Data**
```bash
# Anslut till databas
psql "[CONNECTION_STRING]"

# Kontrollera tabeller
\dt

# Kontrollera data
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM documents;
```

---

## 💡 Tips

1. **Backup innan:** Alltid backup lokal databas innan migration
2. **Testa lokalt:** Testa connection string lokalt innan deployment
3. **Verifiera data:** Kontrollera att all data migrerades korrekt
4. **Stoppa när klar:** Stoppa Azure server när demo är klar (spara pengar)

---

## ❓ FAQ

**Q: Vilket alternativ är bäst för demo?**
A: Supabase för snabbaste setup, Azure för produktion.

**Q: Hur mycket kostar det?**
A: Supabase gratis (begränsad), Azure ~$30/månad.

**Q: Behöver jag ändra kod?**
A: Nej, bara uppdatera `DATABASE_URL`.

**Q: Hur lång tid tar det?**
A: Supabase ~10 min, Azure ~20 min.

---

**Se `DEPLOY_DATABASE_PRODUCTION.md` för detaljerad guide.**
