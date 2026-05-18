# Deploya Databas till Produktion - Guide

## 🎯 Översikt

För att visa applikationen för investerare behöver du deploya databasen till molnet. Denna guide visar hur du gör det.

---

## 📊 Alternativ för Produktion

### **1. Azure Database for PostgreSQL** ⭐ REKOMMENDERAT
- ✅ Samma ekosystem som Key Vault
- ✅ Managed service (ingen server-hantering)
- ✅ Automatisk backup
- ✅ GDPR-compliant (Sweden Central region)
- ✅ Kostnad: ~$30-100/månad (beroende på storlek)

### **2. AWS RDS PostgreSQL**
- ✅ Managed service
- ✅ Bra prestanda
- ⚠️ Annat ekosystem (om du använder Azure)
- ✅ Kostnad: ~$30-100/månad

### **3. Supabase (PostgreSQL)**
- ✅ Enkelt att sätta upp
- ✅ Gratis tier (begränsad)
- ⚠️ Data i USA (GDPR-problem)
- ✅ Kostnad: Gratis (begränsad) eller $25/månad

### **4. DigitalOcean Managed Database**
- ✅ Enkelt
- ✅ Bra priser
- ⚠️ Mindre features än Azure/AWS
- ✅ Kostnad: ~$15-50/månad

---

## 🚀 Azure PostgreSQL - Steg för Steg

### **Steg 1: Skapa Azure PostgreSQL Database**

```bash
# Logga in på Azure
az login

# Skapa resource group
az group create \
  --name castlegate-rg \
  --location swedencentral

# Skapa PostgreSQL Flexible Server
az postgres flexible-server create \
  --resource-group castlegate-rg \
  --name castlegate-db \
  --location swedencentral \
  --admin-user postgres \
  --admin-password "YourSecurePassword123!" \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 15 \
  --storage-size 32 \
  --public-access 0.0.0.0
```

**Viktigt:**
- `--public-access 0.0.0.0` = Tillåt åtkomst från internet (för demo)
- I produktion: Använd VNet/Private Endpoint istället
- `--sku-name Standard_B1ms` = Billigaste tier (~$30/månad)

### **Steg 2: Konfigurera Firewall Rules**

```bash
# Tillåt din IP-adress
az postgres flexible-server firewall-rule create \
  --resource-group castlegate-rg \
  --name castlegate-db \
  --rule-name AllowMyIP \
  --start-ip-address YOUR_IP_ADDRESS \
  --end-ip-address YOUR_IP_ADDRESS

# Tillåt Azure services (för App Service)
az postgres flexible-server firewall-rule create \
  --resource-group castlegate-rg \
  --name castlegate-db \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### **Steg 3: Hämta Connection String**

```bash
# Hämta connection string
az postgres flexible-server show-connection-string \
  --server-name castlegate-db \
  --admin-user postgres \
  --admin-password "YourSecurePassword123!" \
  --database-name postgres
```

**Output:**
```
postgresql://postgres:YourSecurePassword123!@castlegate-db.postgres.database.azure.com:5432/postgres?sslmode=require
```

### **Steg 4: Lägg till i Azure Key Vault**

```bash
# Lägg till connection string i Key Vault
az keyvault secret set \
  --vault-name castlegate-kv \
  --name DATABASE_URL \
  --value "postgresql://postgres:YourSecurePassword123!@castlegate-db.postgres.database.azure.com:5432/castlegate?sslmode=require"
```

### **Steg 5: Skapa Databas**

```bash
# Anslut till Azure PostgreSQL
psql "host=castlegate-db.postgres.database.azure.com port=5432 dbname=postgres user=postgres password=YourSecurePassword123! sslmode=require"

# Skapa databas
CREATE DATABASE castlegate;
\q
```

### **Steg 6: Migrera Data**

#### **Alternativ A: pg_dump/pg_restore (Rekommenderat)**

```bash
# 1. Dumpa lokal databas
pg_dump -h localhost -p 5433 -U postgres -d castlegate > castlegate_backup.sql

# 2. Restore till Azure
psql "host=castlegate-db.postgres.database.azure.com port=5432 dbname=castlegate user=postgres password=YourSecurePassword123! sslmode=require" < castlegate_backup.sql
```

#### **Alternativ B: Via Backend Migrations**

```bash
# 1. Uppdatera DATABASE_URL i Key Vault (eller .env)
# 2. Starta backend (migrations körs automatiskt)
npm run start:prod
```

---

## 🔐 Säkerhet för Produktion

### **1. SSL/TLS (Krävs)**
Azure PostgreSQL kräver SSL. Connection string måste innehålla:
```
?sslmode=require
```

### **2. Firewall Rules**
- ✅ Tillåt endast nödvändiga IP-adresser
- ✅ Använd VNet/Private Endpoint för produktion
- ❌ Öppna inte för 0.0.0.0/0 i produktion

### **3. Lösenord**
- ✅ Använd starkt lösenord (minst 16 tecken)
- ✅ Rotera regelbundet
- ✅ Lagra i Azure Key Vault (inte i kod)

### **4. Backup**
Azure PostgreSQL har automatisk backup:
- ✅ Dagliga backups (7 dagar retention)
- ✅ Point-in-time restore
- ✅ Geo-redundant backup (valfritt)

---

## 💰 Kostnader

### **Azure PostgreSQL Flexible Server:**

| Tier | vCores | RAM | Storage | Kostnad/månad |
|------|--------|-----|---------|---------------|
| **Burstable B1ms** | 1 | 2 GB | 32 GB | ~$30 |
| **Burstable B2s** | 2 | 4 GB | 32 GB | ~$60 |
| **General Purpose D2s_v3** | 2 | 8 GB | 32 GB | ~$150 |

**För demo/investerare:**
- **B1ms** räcker gott (~$30/månad)
- Inkluderar automatisk backup
- Inkluderar SSL/TLS

**Totalt för demo:**
- PostgreSQL: ~$30/månad
- Key Vault: ~$0.03/månad
- **Total: ~$30/månad**

---

## 🚀 Deployment Checklist

### **Före Deployment:**
- [ ] Skapa Azure PostgreSQL database
- [ ] Konfigurera firewall rules
- [ ] Skapa databas (`castlegate`)
- [ ] Lägg till connection string i Key Vault
- [ ] Testa anslutning lokalt

### **Deployment:**
- [ ] Dumpa lokal databas (`pg_dump`)
- [ ] Restore till Azure (`pg_restore`)
- [ ] Verifiera migrations (`schema_migrations` tabell)
- [ ] Testa backend-anslutning

### **Efter Deployment:**
- [ ] Testa API endpoints
- [ ] Verifiera data
- [ ] Konfigurera backup
- [ ] Säkerhetsgranska firewall rules

---

## 📝 Snabbguide: Azure PostgreSQL

### **1. Skapa Database (5 min)**
```bash
az postgres flexible-server create \
  --resource-group castlegate-rg \
  --name castlegate-db \
  --location swedencentral \
  --admin-user postgres \
  --admin-password "SecurePassword123!" \
  --sku-name Standard_B1ms \
  --public-access 0.0.0.0
```

### **2. Konfigurera Firewall (2 min)**
```bash
az postgres flexible-server firewall-rule create \
  --resource-group castlegate-rg \
  --name castlegate-db \
  --rule-name AllowMyIP \
  --start-ip-address YOUR_IP \
  --end-ip-address YOUR_IP
```

### **3. Migrera Data (10 min)**
```bash
# Dumpa lokal
pg_dump -h localhost -p 5433 -U postgres -d castlegate > backup.sql

# Restore till Azure
psql "host=castlegate-db.postgres.database.azure.com port=5432 dbname=castlegate user=postgres password=SecurePassword123! sslmode=require" < backup.sql
```

### **4. Uppdatera Backend (2 min)**
```bash
# Lägg till i Key Vault
az keyvault secret set \
  --vault-name castlegate-kv \
  --name DATABASE_URL \
  --value "postgresql://postgres:SecurePassword123!@castlegate-db.postgres.database.azure.com:5432/castlegate?sslmode=require"
```

**Total tid: ~20 minuter**

---

## 🔄 Migration från Lokal till Azure

### **Steg 1: Backup Lokal Databas**
```bash
pg_dump -h localhost -p 5433 -U postgres -d castlegate \
  --format=custom \
  --file=castlegate_backup.dump
```

### **Steg 2: Skapa Azure Database**
(Se ovan)

### **Steg 3: Restore till Azure**
```bash
pg_restore \
  --host=castlegate-db.postgres.database.azure.com \
  --port=5432 \
  --username=postgres \
  --dbname=castlegate \
  --no-owner \
  --no-privileges \
  castlegate_backup.dump
```

### **Steg 4: Verifiera**
```bash
# Anslut till Azure
psql "host=castlegate-db.postgres.database.azure.com port=5432 dbname=castlegate user=postgres password=SecurePassword123! sslmode=require"

# Kontrollera tabeller
\dt

# Kontrollera migrations
SELECT * FROM schema_migrations;
```

---

## 🌐 Alternativ: Supabase (Snabbare Setup)

Om du vill ha något snabbare att sätta upp:

### **Steg 1: Skapa Supabase Project**
1. Gå till https://supabase.com
2. Skapa nytt projekt
3. Välj region (Stockholm för GDPR)

### **Steg 2: Hämta Connection String**
```bash
# I Supabase Dashboard → Settings → Database
# Connection string: postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
```

### **Steg 3: Migrera Data**
```bash
# Dumpa lokal
pg_dump -h localhost -p 5433 -U postgres -d castlegate > backup.sql

# Restore till Supabase
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres" < backup.sql
```

**Fördelar:**
- ✅ Snabbare setup (~5 min)
- ✅ Gratis tier (begränsad)
- ✅ Inbyggd dashboard

**Nackdelar:**
- ⚠️ Data kan vara i USA (GDPR-problem)
- ⚠️ Begränsad kontroll

---

## 📊 Jämförelse

| Aspekt | Azure PostgreSQL | Supabase | AWS RDS |
|--------|------------------|----------|---------|
| **Setup-tid** | ~20 min | ~5 min | ~20 min |
| **Kostnad** | ~$30/månad | Gratis/$25 | ~$30/månad |
| **GDPR** | ✅ Sweden Central | ⚠️ USA | ✅ EU regions |
| **Kontroll** | ✅ Full | ⚠️ Begränsad | ✅ Full |
| **Backup** | ✅ Automatisk | ✅ Automatisk | ✅ Automatisk |
| **SSL** | ✅ Krävs | ✅ Krävs | ✅ Krävs |

---

## 🎯 Rekommendation för Investerare Demo

### **För Demo (Kort tid):**
**Supabase** - Snabbaste setup, gratis tier

### **För Produktion:**
**Azure PostgreSQL** - Bästa säkerhet, GDPR-compliant, samma ekosystem

---

## ❓ FAQ

**Q: Behöver jag ändra kod för att använda Azure PostgreSQL?**
A: Nej, bara uppdatera `DATABASE_URL` i Key Vault eller `.env`.

**Q: Fungerar migrations automatiskt?**
A: Ja, migrations körs automatiskt vid backend-start.

**Q: Hur mycket kostar det?**
A: ~$30/månad för Azure PostgreSQL (B1ms tier).

**Q: Kan jag använda gratis tier?**
A: Supabase har gratis tier (begränsad), Azure har inte.

**Q: Hur säker är det?**
A: Mycket säkert med SSL/TLS, firewall rules, och Key Vault för secrets.

---

## 📞 Nästa Steg

1. **Välj provider** (Azure PostgreSQL rekommenderat)
2. **Skapa database** (följ guide ovan)
3. **Migrera data** (pg_dump/pg_restore)
4. **Uppdatera backend** (DATABASE_URL i Key Vault)
5. **Testa** (verifiera anslutning och data)

**Total tid:** ~20-30 minuter
