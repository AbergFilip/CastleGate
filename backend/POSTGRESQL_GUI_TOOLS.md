# PostgreSQL GUI-verktyg - Guide

## Vad är Docker Desktop?
Docker Desktop är en containerhanterare som kör dina applikationer (backend, PostgreSQL, etc.) i isolerade miljöer. Det är **inte** ett verktyg för att se databasen direkt - det är bara för att hantera containers.

## Rekommenderade GUI-verktyg

### 1. **DBeaver Community** (GRATIS) ⭐ REKOMMENDERAT
- **Ladda ner:** https://dbeaver.io/download/
- **Varför:** Gratis, open source, mycket kraftfull, liknar Supabase Studio
- **Features:** 
  - Visualisera tabeller, data, relationer
  - SQL-editor med syntax highlighting
  - Data export/import
  - ER-diagram

### 2. **TablePlus** (GRATIS för 2 connections)
- **Ladda ner:** https://tableplus.com/
- **Varför:** Modern, snygg UI, snabb
- **Features:** 
  - Mycket intuitivt gränssnitt
  - Snabb och responsiv
  - Gratis för 2 databasanslutningar

### 3. **pgAdmin** (GRATIS)
- **Ladda ner:** https://www.pgadmin.org/download/
- **Varför:** Klassisk PostgreSQL admin tool, webbaserad
- **Features:**
  - Webbaserat gränssnitt (kör i webbläsaren)
  - Mycket komplett för PostgreSQL

### 4. **Azure Data Studio** (GRATIS)
- **Ladda ner:** https://aka.ms/azuredatastudio
- **Varför:** Microsofts verktyg med PostgreSQL extension
- **Features:**
  - Modern UI
  - Bra för både SQL Server och PostgreSQL

## Anslutningsinformation

Använd dessa uppgifter för att ansluta till din lokala PostgreSQL-databas:

```
Host: localhost
Port: 5433
Database: castlegate
Username: postgres
Password: postgres
```

**Viktigt:** Porten är **5433** (inte 5432) eftersom vi mappade Docker-containerns port 5432 till host-port 5433.

## Snabbguide: DBeaver

1. **Installera DBeaver:**
   - Ladda ner från https://dbeaver.io/download/
   - Välj "Community Edition" (gratis)
   - Installera

2. **Skapa ny anslutning:**
   - Öppna DBeaver
   - Klicka på "New Database Connection" (ikon med +)
   - Välj "PostgreSQL"
   - Fyll i:
     - **Host:** localhost
     - **Port:** 5433
     - **Database:** castlegate
     - **Username:** postgres
     - **Password:** postgres
   - Klicka "Test Connection" för att verifiera
   - Klicka "Finish"

3. **Utforska databasen:**
   - Expandera "castlegate" i vänstermenyn
   - Se alla tabeller under "Schemas" → "public" → "Tables"
   - Dubbelklicka på en tabell för att se data
   - Högerklicka för att köra SQL-queries

## Snabbguide: TablePlus

1. **Installera TablePlus:**
   - Ladda ner från https://tableplus.com/
   - Installera

2. **Skapa ny anslutning:**
   - Öppna TablePlus
   - Klicka "Create a new connection"
   - Välj "PostgreSQL"
   - Fyll i:
     - **Name:** CastleGate Local
     - **Host:** localhost
     - **Port:** 5433
     - **User:** postgres
     - **Password:** postgres
     - **Database:** castlegate
   - Klicka "Test" för att verifiera
   - Klicka "Connect"

3. **Utforska databasen:**
   - Se alla tabeller i vänstermenyn
   - Klicka på en tabell för att se data
   - Använd SQL-fliken för att köra queries

## Testa anslutningen

Om du har problem med anslutningen, kontrollera att Docker-containern körs:

```powershell
docker ps
```

Du bör se `castlegate-postgres` i listan. Om inte, starta den:

```powershell
cd backend
docker-compose up -d
```

## Jämförelse med Supabase

| Feature | Supabase Studio | DBeaver/TablePlus |
|---------|----------------|-------------------|
| Se tabeller | ✅ | ✅ |
| Se data | ✅ | ✅ |
| SQL Editor | ✅ | ✅ |
| ER-diagram | ✅ | ✅ (DBeaver) |
| Visualisera relationer | ✅ | ✅ |
| **Kostnad** | Betalt (efter gratis tier) | **GRATIS** |

## Rekommendation

**Börja med DBeaver** - det är gratis, kraftfullt och ger dig en Supabase-liknande upplevelse för din lokala PostgreSQL-databas.
