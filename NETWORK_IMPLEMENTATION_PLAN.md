# Nätverk - Implementeringsplan
## CastleGate Social Network Feature

### Översikt
Detta dokument beskriver en omfattande plan för att bygga ut Nätverk-funktionaliteten i CastleGate-applikationen. Planen är baserad på moderna sociala nätverk (LinkedIn, Facebook, Twitter) men anpassad för en BankID-verifierad plattform där alla användare är verifierade.

---

## 1. Nuvarande Status

### ✅ Redan Implementerat

#### Backend API Endpoints
- `GET /api/user-connections` - Hämta användarrelationer
- `POST /api/user-connections` - Skicka vänförfrågan
- `PUT /api/user-connections/:id` - Acceptera/avvisa förfrågan
- `DELETE /api/user-connections/:id` - Ta bort relation
- `GET /api/users/search` - Sök efter användare
- `GET /api/users/recommended` - Rekommenderade användare (vänner till vänner)
- `GET /api/users/:id` - Hämta användarprofil
- `GET /api/users/:id/mutual-friends` - Gemensamma vänner
- `GET /api/network` - Hämta kontakter (icke-användare)
- `POST /api/network` - Lägg till kontakt
- `PUT /api/network/:id` - Uppdatera kontakt
- `DELETE /api/network/:id` - Ta bort kontakt

#### Frontend Komponenter
- `Network.tsx` - Huvudsida för nätverk
- `UserProfile.tsx` - Användarprofilsida
- `network.ts` - API-funktioner för nätverk

#### Databasstruktur
- `user_connections` - Relationer mellan användare (pending/accepted/blocked)
- `network_connections` - Kontakter utanför appen
- `users` - Användarprofiler med integritetsinställningar

#### Funktioner
- Vänförfrågningar (skicka, acceptera, avvisa)
- Sökning efter användare
- Rekommenderade användare
- Gemensamma vänner
- Profilintegritet (public/friends/private)
- Notifikationer för vänförfrågningar

---

## 2. Förbättringar och Nya Funktioner

### 2.1 Profilfunktioner

#### 2.1.1 Förbättrad Profilvisning
**Prioritet: Hög**

- [ ] **Profilstatistik**
  - Antal vänner
  - Antal gemensamma vänner
  - Medlemskap sedan (datum)
  - Verifieringsstatus (BankID-verifierad badge)

- [ ] **Profilsektioner**
  - Om mig (bio, intressen, hobbies)
  - Arbetslivserfarenhet
  - Utbildning
  - Kontaktinformation (med integritetsinställningar)
  - Delade resurser (bilar, båtar, fastigheter) - om användaren väljer att dela

- [ ] **Profilbild och Cover Photo**
  - Stöd för profilbild (avatar_url finns redan)
  - Cover photo/banner för profil
  - Bildgalleri

- [ ] **Aktivitetsfeed**
  - Senaste aktiviteter (valfritt att dela)
  - Delade inlägg/uppdateringar
  - Kommentarer och likes

#### 2.1.2 Profilinställningar
**Prioritet: Hög**

- [ ] **Integritetsinställningar (utöka befintliga)**
  - Vem kan se min profil? (public/friends/private)
  - Vem kan skicka vänförfrågningar? (alla/vänner av vänner/ingen)
  - Vem kan se min e-post? (ingen/vänner/alla)
  - Vem kan se mitt telefonnummer? (ingen/vänner/alla)
  - Vem kan se min adress? (ingen/vänner/alla)
  - Vem kan se mina resurser? (ingen/vänner/alla)

- [ ] **Sökbarhet**
  - Synlig i sökresultat (ja/nej)
  - Synlig i rekommendationer (ja/nej)

- [ ] **Notifikationsinställningar**
  - E-postnotifikationer för vänförfrågningar
  - Push-notifikationer (framtida funktion)
  - Notifikationer för vänförfrågningar från vänner av vänner

### 2.2 Vänförfrågningar och Relationer

#### 2.2.1 Förbättrad Vänförfrågningshantering
**Prioritet: Hög**

- [ ] **Förfrågningsmeddelanden**
  - Möjlighet att lägga till meddelande när man skickar förfrågan
  - Visa meddelande i notifikationer

- [ ] **Förfrågningsstatus**
  - "Väntar på svar" - tydligare visning
  - "Förfrågan skickad" - bekräftelse
  - "Förfrågan mottagen" - för mottagaren
  - "Förfrågan accepterad" - bekräftelse
  - "Förfrågan avvisad" - med möjlighet att skicka igen

- [ ] **Bulk-åtgärder**
  - Acceptera flera förfrågningar samtidigt
  - Avvisa flera förfrågningar samtidigt

- [ ] **Förfrågningsfilter**
  - Filtrera efter status (alla/pending/accepted/blocked)
  - Sortera efter datum (nyast/äldst)
  - Sök i förfrågningar

#### 2.2.2 Relationstyper
**Prioritet: Medel**

- [ ] **Kategorisering av relationer**
  - Vän
  - Familj
  - Kollega
  - Grannar
  - Bekanta
  - Anpassad relation

- [ ] **Relationstaggar**
  - Möjlighet att lägga till flera taggar per relation
  - Exempel: "Vän", "Gymnasiet", "Fotboll"

- [ ] **Relationens styrka**
  - Nära vän
  - Vän
  - Bekant
  - (Valfritt - kan användas för rekommendationer)

### 2.3 Sökning och Upptäckt

#### 2.3.1 Avancerad Sökning
**Prioritet: Hög**

- [ ] **Sökfilter**
  - Sök efter namn
  - Sök efter e-post
  - Sök efter telefonnummer (om synligt)
  - Sök efter personnummer (endast för admin/verifiering)
  - Filtrera efter relation (vänner/vänner av vänner/alla)
  - Filtrera efter verifieringsstatus

- [ ] **Sökresultat**
  - Visa gemensamma vänner i resultat
  - Visa relation (om vän/bekant)
  - Visa verifieringsstatus
  - Sortera efter relevans/gemensamma vänner/datum

- [ ] **Sökhjälp**
  - Förslag när man skriver
  - Senaste sökningar
  - Populära sökningar

#### 2.3.2 Rekommendationer
**Prioritet: Medel**

- [ ] **Förbättrade Rekommendationer**
  - Vänner av vänner (redan implementerat)
  - Gemensamma intressen (framtida funktion)
  - Gemensamma platser (framtida funktion)
  - Gemensamma skolor/arbetsplatser (framtida funktion)
  - Personer som sökt efter dig (valfritt)

- [ ] **Rekommendationsalgoritm**
  - Prioritera vänner av vänner med flest gemensamma vänner
  - Prioritera personer med gemensamma intressen
  - Prioritera personer i samma område

- [ ] **Rekommendationsinställningar**
  - Användare kan välja att inte visas i rekommendationer
  - Användare kan välja att inte få rekommendationer

### 2.4 Nätverksöversikt

#### 2.4.1 Nätverksstatistik
**Prioritet: Medel**

- [ ] **Dashboard**
  - Totalt antal vänner
  - Totalt antal kontakter (network_connections)
  - Antal väntande förfrågningar
  - Antal rekommendationer
  - Nätverksstorlek (vänner + vänner av vänner)

- [ ] **Nätverksvisualisering**
  - Enkel grafisk representation av nätverket
  - Visa vänner och deras relationer (valfritt)

#### 2.4.2 Nätverkshantering
**Prioritet: Medel**

- [ ] **Vänlistor**
  - Skapa anpassade listor (t.ex. "Familj", "Jobb", "Gym")
  - Organisera vänner i listor
  - Filtrera vänner efter lista

- [ ] **Exportfunktioner**
  - Exportera kontaktlista (CSV/VCF)
  - Exportera nätverksdata (GDPR-kompatibelt)

### 2.5 Integritet och Säkerhet

#### 2.5.1 Blockering och Rapportering
**Prioritet: Hög**

- [ ] **Blockering**
  - Blockera användare (redan delvis implementerat med status 'blocked')
  - Blockerad användare kan inte:
    - Se din profil
    - Skicka vänförfrågningar
    - Skicka meddelanden
    - Se dina inlägg
  - Lista över blockerade användare
  - Avblockera användare

- [ ] **Rapportering**
  - Rapportera användare för olämpligt beteende
  - Rapportera fake-konton (även om BankID ska förhindra detta)
  - Rapportera spam
  - Admin-panel för hantering av rapporter

#### 2.5.2 Integritetskontroller
**Prioritet: Hög**

- [ ] **Verifieringssystem**
  - BankID-verifierad badge på profil
  - Verifieringsstatus synlig i sökresultat
  - Möjlighet att filtrera efter verifierade användare

- [ ] **Integritetsloggar**
  - Logga vem som har sett din profil (valfritt)
  - Logga vem som har sökt efter dig (valfritt)
  - Integritetsinställningar för loggning

### 2.6 Notifikationer

#### 2.6.1 Förbättrade Notifikationer
**Prioritet: Medel**

- [ ] **Notifikationstyper**
  - Vänförfrågan mottagen (redan implementerat)
  - Vänförfrågan accepterad (redan implementerat)
  - Nya rekommendationer
  - Någon sökte efter dig (valfritt)
  - Någon visade din profil (valfritt)
  - Födelsedagar (om delat)

- [ ] **Notifikationsinställningar**
  - Aktivera/inaktivera olika typer av notifikationer
  - E-postnotifikationer
  - Push-notifikationer (framtida funktion)

### 2.7 Sociala Funktioner

#### 2.7.1 Aktivitetsfeed
**Prioritet: Låg (Framtida)**

- [ ] **Feed-funktioner**
  - Visa vänners aktiviteter
  - Dela uppdateringar
  - Kommentarer och likes
  - Dela resurser (bilar, båtar, fastigheter)

#### 2.7.2 Grupper och Communities
**Prioritet: Låg (Framtida)**

- [ ] **Gruppfunktioner**
  - Skapa grupper
  - Gå med i grupper
  - Gruppmeddelanden
  - Gruppaktiviteter

### 2.8 Mobile och UX

#### 2.8.1 Användarupplevelse
**Prioritet: Hög**

- [ ] **UI-förbättringar**
  - Förbättrad sökning med autocomplete
  - Snabbare laddningstider
  - Bättre felhantering
  - Loading states
  - Empty states

- [ ] **Responsiv design**
  - Optimerad för mobil
  - Optimerad för tablet
  - Optimerad för desktop

- [ ] **Tillgänglighet**
  - Keyboard navigation
  - Screen reader support
  - Hög kontrast-läge

#### 2.8.2 Prestanda
**Prioritet: Medel**

- [ ] **Optimeringar**
  - Paginering för vänlistor
  - Lazy loading för profiler
  - Caching av sökresultat
  - Debouncing av sökningar

---

## 3. Databasändringar

### 3.1 Nya Tabeller

```sql
-- Profilinställningar (utöka users-tabellen)
ALTER TABLE users ADD COLUMN IF NOT EXISTS cover_photo_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS interests TEXT[];
ALTER TABLE users ADD COLUMN IF NOT EXISTS hobbies TEXT[];
ALTER TABLE users ADD COLUMN IF NOT EXISTS searchable BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS show_in_recommendations BOOLEAN DEFAULT true;

-- Blockeringstabell
CREATE TABLE IF NOT EXISTS user_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blocked_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT user_blocks_unique UNIQUE (user_id, blocked_user_id),
  CONSTRAINT user_blocks_no_self CHECK (user_id != blocked_user_id)
);

-- Rapporteringstabell
CREATE TABLE IF NOT EXISTS user_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reported_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'reviewed', 'resolved', 'dismissed'
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vänlistor
CREATE TABLE IF NOT EXISTS friend_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vänner i listor
CREATE TABLE IF NOT EXISTS friend_list_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID NOT NULL REFERENCES friend_lists(id) ON DELETE CASCADE,
  connection_id UUID NOT NULL REFERENCES user_connections(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT friend_list_members_unique UNIQUE (list_id, connection_id)
);

-- Profilvisningar (valfritt, för integritetsloggning)
CREATE TABLE IF NOT EXISTS profile_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  viewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  viewed_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT profile_views_unique UNIQUE (viewer_id, viewed_user_id, DATE(viewed_at))
);
```

### 3.2 Index och Prestanda

```sql
-- Index för blockering
CREATE INDEX IF NOT EXISTS idx_user_blocks_user_id ON user_blocks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_blocks_blocked_user_id ON user_blocks(blocked_user_id);

-- Index för rapportering
CREATE INDEX IF NOT EXISTS idx_user_reports_reported_user_id ON user_reports(reported_user_id);
CREATE INDEX IF NOT EXISTS idx_user_reports_status ON user_reports(status);

-- Index för profilvisningar
CREATE INDEX IF NOT EXISTS idx_profile_views_viewed_user_id ON profile_views(viewed_user_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewed_at ON profile_views(viewed_at);
```

### 3.3 RLS Policies

```sql
-- RLS för blockering
ALTER TABLE user_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own blocks"
  ON user_blocks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own blocks"
  ON user_blocks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blocks"
  ON user_blocks FOR DELETE
  USING (auth.uid() = user_id);

-- RLS för rapportering
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reports"
  ON user_reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

-- RLS för profilvisningar
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile views"
  ON profile_views FOR SELECT
  USING (auth.uid() = viewed_user_id);
```

---

## 4. Backend API Endpoints (Nya)

### 4.1 Blockering

```javascript
// Blockera användare
POST /api/users/:id/block
DELETE /api/users/:id/block  // Avblockera
GET /api/users/blocked  // Lista blockerade användare
```

### 4.2 Rapportering

```javascript
// Rapportera användare
POST /api/users/:id/report
GET /api/users/reports  // Admin: lista rapporter
PUT /api/users/reports/:id  // Admin: uppdatera rapportstatus
```

### 4.3 Vänlistor

```javascript
// Hantera vänlistor
GET /api/friend-lists
POST /api/friend-lists
PUT /api/friend-lists/:id
DELETE /api/friend-lists/:id
POST /api/friend-lists/:id/members/:connectionId
DELETE /api/friend-lists/:id/members/:connectionId
```

### 4.4 Profilvisningar

```javascript
// Logga profilvisning
POST /api/users/:id/view
GET /api/users/profile-views  // Vem har sett min profil
```

### 4.5 Förbättrad Sökning

```javascript
// Avancerad sökning
GET /api/users/search/advanced
  ?q=query
  &filter=relation|all
  &verified=true|false
  &sort=relevance|mutual|date
```

---

## 5. Frontend Komponenter (Nya)

### 5.1 Nya Komponenter

- [ ] `ProfileSettings.tsx` - Omfattande profilinställningar
- [ ] `BlockedUsers.tsx` - Hantera blockerade användare
- [ ] `FriendLists.tsx` - Hantera vänlistor
- [ ] `AdvancedSearch.tsx` - Avancerad sökning
- [ ] `NetworkStats.tsx` - Nätverksstatistik
- [ ] `ProfileViewers.tsx` - Vem har sett min profil
- [ ] `ConnectionCard.tsx` - Återanvändbar komponent för vänkort
- [ ] `RecommendationCard.tsx` - Återanvändbar komponent för rekommendationer

### 5.2 Förbättringar av Befintliga

- [ ] `Network.tsx` - Lägg till filter, sortering, bulk-åtgärder
- [ ] `UserProfile.tsx` - Lägg till fler sektioner, statistik, aktiviteter
- [ ] `network.ts` - Lägg till nya API-funktioner

---

## 6. Implementeringsprioritering

### Fas 1: Grundläggande Förbättringar (Högsta prioritet)
1. ✅ Profilstatistik (antal vänner, gemensamma vänner)
2. ✅ Förbättrad profilvisning (bio, intressen)
3. ✅ Blockering och avblockering
4. ✅ Förbättrad sökning med filter
5. ✅ Förfrågningsmeddelanden

### Fas 2: Avancerade Funktioner (Medel prioritet)
1. Relationstyper och taggar
2. Vänlistor
3. Avancerad sökning
4. Förbättrade rekommendationer
5. Nätverksstatistik

### Fas 3: Sociala Funktioner (Låg prioritet)
1. Aktivitetsfeed
2. Grupper och communities
3. Profilvisningar och loggning

### Fas 4: Optimering (Pågående)
1. Prestandaoptimering
2. UI/UX-förbättringar
3. Mobile optimization
4. Tillgänglighet

---

## 7. Säkerhetsöverväganden

### 7.1 BankID-verifiering
- Alla användare måste vara BankID-verifierade
- Ingen möjlighet att skapa fake-konton
- Personnummer är unikt per konto

### 7.2 Integritet
- RLS policies för all data
- Användare kan endast se sin egen data och data de har tillstånd för
- Blockering förhindrar all interaktion

### 7.3 GDPR
- Användare kan exportera sin data
- Användare kan radera sitt konto
- Profilvisningar är valfria och kan inaktiveras

---

## 8. Testning

### 8.1 Enhetstester
- [ ] Testa alla API-endpoints
- [ ] Testa RLS policies
- [ ] Testa integritetsinställningar

### 8.2 Integrationstester
- [ ] Testa vänförfrågningsflöde
- [ ] Testa blockering
- [ ] Testa sökning

### 8.3 Användartester
- [ ] Testa med flera användare
- [ ] Testa edge cases
- [ ] Testa prestanda med många vänner

---

## 9. Dokumentation

### 9.1 Användardokumentation
- [ ] Guide för att använda nätverksfunktioner
- [ ] Guide för integritetsinställningar
- [ ] FAQ

### 9.2 Utvecklardokumentation
- [ ] API-dokumentation
- [ ] Databasstruktur
- [ ] Komponentdokumentation

---

## 10. Framtida Möjligheter

### 10.1 AI och Machine Learning
- Intelligenta rekommendationer baserat på intressen
- Automatisk kategorisering av relationer
- Spam-detektion

### 10.2 Integrationer
- LinkedIn-import
- Kontaktbokssynkronisering
- Kalenderintegration

### 10.3 Sociala Funktioner
- Inlägg och uppdateringar
- Kommentarer och likes
- Delning av resurser
- Events och evenemang

---

## 11. Slutsats

Denna plan ger en omfattande roadmap för att bygga ut Nätverk-funktionaliteten i CastleGate. Genom att följa denna plan stegvis kan vi skapa en robust, säker och användarvänlig social nätverksfunktion som utnyttjar fördelarna med BankID-verifiering.

**Nästa steg:** Börja med Fas 1: Grundläggande Förbättringar och implementera funktionerna en i taget.

