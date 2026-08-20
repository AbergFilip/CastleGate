# Deploya CastleGate till Vercel

Den här guiden tar dig från noll till en publik test-URL där en kollega kan
logga in med **e-post och lösenord** och leka runt i appen – utan BankID.

Vi deployar **både frontend och backend på Vercel** som två separata projekt
från samma GitHub-repo:

| Projekt        | Root directory | URL (exempel)                             |
| -------------- | -------------- | ----------------------------------------- |
| `castlegate`   | `/` (root)     | `https://castlegate.vercel.app`           |
| `castlegate-api` | `backend/`   | `https://castlegate-api.vercel.app`       |

Databasen ligger på **Supabase** (redan hostat). Ett separat Supabase-projekt
för staging rekommenderas.

---

## 1. Förberedelser (engångsjobb)

### 1.1 Pusha koden till GitHub

Om projektet inte redan finns på GitHub:

```powershell
cd C:\Users\Filip\CastleGate
git init
git add .
git commit -m "Initial commit"
gh repo create castlegate --private --source=. --push
```

> Dubbelkolla att `.env`, `backend/.env` och `backend/certificates/` **inte**
> ligger i historiken. `.gitignore` täcker dem, men kör `git status` innan
> du pushar.

### 1.2 Skapa Vercel-konto

[vercel.com/signup](https://vercel.com/signup) – logga in med GitHub.

### 1.3 Skapa Supabase staging-projekt

1. [app.supabase.com](https://app.supabase.com) → **New project** → `castlegate-staging`.
2. Under **Settings → Database → Connection string**:
   - Välj **Session pooler** (inte Direct connection, inte Transaction pooler) och kopiera **Shared pooler-URI:n**.
     → detta blir `DATABASE_URL` i backenden.
   - **Varför just Session pooler?** Direct connection (host `db.<ref>.supabase.co`) fungerar från en persistent server men serverless öppnar nya anslutningar per cold-start och exhauster poolen. Transaction pooler stöder inte TypeORM:s prepared statements (du får "prepared statement already exists"). Session pooler kombinerar det bästa: skalar för serverless och funkar med TypeORM utan kodändringar.
   - URL:en ser ut typ `postgresql://postgres.<ref>:<lösenord>@aws-X-<region>.pooler.supabase.com:5432/postgres`. Notera att användarnamnet är `postgres.<ref>` (med punkt).
   - Om ditt lösenord innehåller specialtecken (`@`, `#`, `%` osv.) – [percent-encoda](https://www.urlencoder.org/) dem först.
3. Under **Settings → API**:
   - Kopiera **Project URL** → `SUPABASE_URL` / `VITE_SUPABASE_URL`
   - Kopiera **anon public key** → `VITE_SUPABASE_ANON_KEY`
   - Kopiera **service_role key** (⚠️ HEMLIG – bara för backend) → `SUPABASE_SERVICE_ROLE_KEY`
4. Kör dina migrations / SQL (t.ex. `supabase_onboarding_update.sql`) via
   Supabase SQL Editor.

### 1.4 Generera hemligheter för backend

I PowerShell:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Kör tre gånger och spara värdena för:
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_PEPPER`
- `FIELD_HASH_PEPPER`

För `FIELD_ENCRYPTION_KEY` (måste vara 32 bytes hex = 64 tecken):

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 2. Deploya backend till Vercel (först)

Backenden måste vara uppe innan frontenden har något att prata med.

### 2.1 Skapa projektet

1. [vercel.com/new](https://vercel.com/new) → välj GitHub-repot.
2. **Project Name:** `castlegate-api` (eller vad du vill).
3. **Framework Preset:** Other.
4. **Root Directory:** klicka **Edit** → välj `backend`.
5. Build settings hämtas från `backend/vercel.json` – du behöver inte ändra:
   - Build command: `npm run build`
   - Install command: `npm ci`
6. **Klicka INTE Deploy än** – vi måste sätta miljövariablerna.

### 2.2 Miljövariabler (backend)

Under **Environment Variables**, lägg in (Production + Preview):

| Namn                          | Värde                                                                             |
| ----------------------------- | --------------------------------------------------------------------------------- |
| `NODE_ENV`                    | `production`                                                                      |
| `DATABASE_URL`                | Supabase **Session pooler** URI (`postgres.<ref>@...pooler.supabase.com:5432`)   |
| `SUPABASE_URL`                | `https://<staging>.supabase.co`                                                   |
| `SUPABASE_SERVICE_ROLE_KEY`   | service_role key från Supabase                                                    |
| `ACCESS_TOKEN_SECRET`         | slumpad 96-tecken sträng (se steg 1.4)                                            |
| `REFRESH_TOKEN_PEPPER`        | slumpad 96-tecken sträng                                                          |
| `FIELD_ENCRYPTION_KEY`        | slumpad 64-tecken hex                                                             |
| `FIELD_HASH_PEPPER`           | slumpad 96-tecken sträng                                                          |
| `FRONTEND_URL`                | temporärt `*` – uppdateras i steg 4 med Vercel-URL:en till frontenden             |
| `BANKID_PRODUCTION`           | `false`                                                                           |
| `MTLS_ENABLED`                | `false`                                                                           |
| `ENABLE_TEST_DATA_TOOLS`      | `true` (bara i staging – ger testaren möjlighet att rensa sin data)              |

Se [`backend/.env.example`](./backend/.env.example) för fullständig lista med valfria integrationer.

### 2.3 Deploy

Klicka **Deploy**. Efter ~2–4 min får du en URL:
`https://castlegate-api.vercel.app`

Verifiera:

```
https://castlegate-api.vercel.app/api/v1/health
```

Ska svara `{"status":"ok",...}`. Om första requesten tar 3-5 s är det cold start – normalt för serverless.

---

## 3. Deploya frontend till Vercel

### 3.1 Skapa projektet

1. [vercel.com/new](https://vercel.com/new) → välj **samma repo igen** (Vercel tillåter flera projekt per repo).
2. **Project Name:** `castlegate` (eller vad du vill).
3. **Root Directory:** lämna som `/` (root).
4. Framework auto-detekteras som **Vite** från `vercel.json` i roten.

### 3.2 Miljövariabler (frontend)

| Namn                             | Värde                                                                |
| -------------------------------- | -------------------------------------------------------------------- |
| `VITE_SUPABASE_URL`              | `https://<staging>.supabase.co`                                      |
| `VITE_SUPABASE_ANON_KEY`         | anon key från Supabase                                               |
| `VITE_API_BASE_URL`              | `https://castlegate-api.vercel.app/api/v1`                           |
| `VITE_BANKID_API_URL`            | `https://castlegate-api.vercel.app/api/v1/bankid`                    |
| `VITE_SESSION_TIMEOUT_MINUTES`   | `15`                                                                 |
| `VITE_ENABLE_PASSWORD_AUTH`      | `true` (default – visar e-post/lösenord-formen på startsidan)        |
| `VITE_ENABLE_TEST_DATA_TOOLS`    | `true` (visar "Rensa min testdata" på Profil)                        |
| `VITE_DEMO_MODE`                 | `true` (visar en "DEMO"-badge i UI:t)                                |

### 3.3 Deploy

Klicka **Deploy**. Efter ~1–2 min: `https://castlegate.vercel.app`.

---

## 4. Koppla ihop frontend och backend (CORS)

Gå tillbaka till backend-projektets **Environment Variables** och uppdatera:

```
FRONTEND_URL=https://castlegate.vercel.app
```

Klicka **Redeploy** på senaste backend-deploymenten (Deployments → ⋯ → Redeploy)
för att CORS ska släppa igenom din nya frontend.

> **Tips:** vill du också tillåta preview-deploys från pull requests?
> Kommaseparera: `FRONTEND_URL=https://castlegate.vercel.app,https://castlegate-git-*.vercel.app`

---

## 5. Skapa ett testkonto åt kollegan

Kollegan loggar in med **e-post + lösenord** via Supabase auth. Skapa kontot på
ett av två sätt:

### Alternativ A – Låt kollegan skapa själv (enklast)

1. Skicka Vercel-URL:en till kollegan.
2. Hen klickar **Skapa konto** → fyller i e-post + lösenord.
3. Om **email confirmation** är på i Supabase: hen får ett mejl med en länk att klicka.
   - Vill du slippa mejlbekräftelse för test: **Supabase → Authentication → Providers → Email → Confirm email = OFF**.

### Alternativ B – Skapa manuellt i Supabase Dashboard

1. **Supabase → Authentication → Users → Add user → Create new user**.
2. Fyll i e-post och lösenord, bocka i **Auto Confirm User**.
3. Skicka credentials till kollegan.

---

## 6. Testa

Öppna Vercel-URL:en i incognito:

1. Du ser startsidan med **Logga in / Skapa konto**-toggle och en form.
2. Ange kollegans e-post och lösenord → klicka **Logga in**.
3. Du landar på `/home` och kan navigera runt.
4. Öppna Network-fliken – API-anrop går mot `https://castlegate-api.vercel.app`
   och svarar 200 (eventuellt en långsam första request pga cold start).

### Vanliga problem

| Symptom | Trolig orsak |
| ------- | ------------ |
| Blank sida, 404 vid refresh av `/profile` | SPA-rewrite saknas – dubbelkolla att `vercel.json` finns i repo-roten |
| API-anrop misslyckas med CORS-fel | `FRONTEND_URL` i backend matchar inte Vercel-URL:en exakt (inkl. `https://`, inget trailing `/`). Redeploy backend efter ändring. |
| Backend svarar 500 vid första request | Cold-start-timeout eller DB-connection failure. Kolla **Vercel → Functions → Logs**. Vanligast: `DATABASE_URL` pekar mot Direct connection (`db.<ref>.supabase.co`) istället för Session pooler (`aws-X-<region>.pooler.supabase.com`). |
| `prepared statement "S_1" already exists` | Du använder **Transaction pooler** istället för Session pooler. TypeORM funkar inte i transaction-mode. Byt till Session pooler-URI:n. |
| "Invalid login credentials" | Kontot finns inte i Supabase, eller email-confirmation krävs och användaren har inte klickat länken |
| `Failed to fetch` vid inloggning | Backend är nere / cold start pågår. Vänta 5 s och försök igen. |
| Login funkar men API returnerar 401 | Backend accepterar inte Supabase-JWT. Verifiera att `SUPABASE_URL` och `SUPABASE_SERVICE_ROLE_KEY` i backend matchar samma Supabase-projekt som frontenden |

---

## 7. Skydda staging (rekommenderas)

Innan du delar länken publikt:

- **Vercel → Frontend Project → Settings → Deployment Protection → Password Protection**
  (Pro-plan, ~20 USD/mån). Sätter ett lösenord som alla besökare måste ange.
- Alternativ (gratis): lägg ett hemligt sökvägsprefix (`?token=abc123`) i frontenden
  eller ha en enkel splash-sida med lösenordsprompt.
- Sätt `<meta name="robots" content="noindex">` (finns redan) så Google inte
  indexerar staging-URL:en.

---

## 8. Trade-offs på Vercel serverless (bra att veta)

| Aspekt | Vad som händer |
| ------ | -------------- |
| **Cold start** | Första request efter idle tar 2–5 s. Vanligt. |
| **DB-pool** | Använd Supabase Session pooler (`aws-X.pooler.supabase.com:5432`), inte Direct connection (`db.<ref>.supabase.co:5432`). Annars: "too many connections" vid cold-starts. |
| **Rate limiting** | Nuvarande in-memory implementation nollställs per lambda-instans. OK för test, byt till Redis/Upstash för produktion. |
| **Långlivade requests** | Max 30 s (satt i `functions.maxDuration`). BankID-polling gör korta requests, så det är OK. |
| **mTLS** | `MTLS_ENABLED=true` fungerar inte – Vercel terminerar TLS själv. Håll `false`. |
| **Bundle size** | Vercel-gränsen är 250 MB (unzipped). Kolla i deploy-loggen om det närmar sig. |

Går det inte att få backenden att fitta eller cold-starts stör testet: flytta
backenden till **Railway** eller **Render** – frontenden kan ligga kvar på Vercel.

---

## Filer i denna setup

| Fil | Syfte |
| --- | ----- |
| [`vercel.json`](./vercel.json) | Frontend (Vite) – SPA-rewrites, cache & security headers |
| [`.vercelignore`](./.vercelignore) | Utesluter backend och interna docs från frontend-projektet |
| [`.env.example`](./.env.example) | Mall för frontend-miljövariabler |
| [`backend/vercel.json`](./backend/vercel.json) | Backend – buildar Nest och kopplar alla routes till serverless-funktionen |
| [`backend/.vercelignore`](./backend/.vercelignore) | Utesluter certifikat, docs och byggartefakter från backend-projektet |
| [`backend/.env.example`](./backend/.env.example) | Mall för backend-miljövariabler |
| [`backend/api/index.js`](./backend/api/index.js) | Serverless-handler som bootstrappar Nest en gång per lambda |
| [`backend/src/main.ts`](./backend/src/main.ts) | Exporterar `configureApp()` som återanvänds av både `main.ts` (lokal server) och `api/index.js` (Vercel) |
