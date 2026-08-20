# Deploya CastleGate till Vercel

Den här guiden tar dig från noll till en publik test-URL som du kan skicka
till en tester. **Frontenden (Vite/React) körs på Vercel. Backenden (NestJS)
körs separat** – Vercel serverless passar inte den nuvarande NestJS-appen
(in-memory rate limiting, mTLS-stöd, långlivade BankID-anrop, m.m.).

---

## Översikt

| Del      | Plattform                          | Kostnad (startup)              |
| -------- | ---------------------------------- | ------------------------------ |
| Frontend | [Vercel](https://vercel.com)       | Gratis (Hobby-plan)            |
| Backend  | [Railway](https://railway.app)     | ~5 USD/mån (Hobby) eller gratis-tier på Render/Fly.io |
| Databas  | [Supabase](https://supabase.com)   | Gratis (upp till 500 MB)       |

> **Tips:** Skapa ett **separat Supabase-projekt för staging/test** så testarens
> data inte blandas med din dev-data.

---

## 1. Förberedelser (engångsjobb)

### 1.1 Pusha koden till GitHub

Om projektet inte redan finns på GitHub:

```powershell
# I C:\Users\Filip\CastleGate
git init
git add .
git commit -m "Initial commit"
gh repo create castlegate --private --source=. --push
```

> Dubbelkolla att `.env`, `.env.production` och `certificates/` **inte** ligger
> i historiken. `.gitignore` täcker dem, men kör `git status` innan du pushar.

### 1.2 Skapa Vercel-konto

Gå till [vercel.com/signup](https://vercel.com/signup) och logga in med GitHub.

### 1.3 (Rekommenderas) Skapa staging-projekt på Supabase

1. Gå till [app.supabase.com](https://app.supabase.com) → **New project** → `castlegate-staging`.
2. Kör dina migrations / SQL i det projektet (t.ex. `supabase_onboarding_update.sql`).
3. Notera **Project URL** och **anon key** – behövs i steg 3.

---

## 2. Deploya backend först

Frontenden pekar mot backenden, så backenden måste vara uppe innan
frontenden fungerar. Välj **en** av dessa:

### Alternativ A – Railway (rekommenderas, enklast)

1. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub Repo**.
2. Välj repot. Under **Settings → Service**:
   - **Root Directory:** `backend`
   - **Build Command:** `npm ci && npm run build`
   - **Start Command:** `npm run start:prod`
3. Under **Variables**, lägg till (från `backend/.env`):

   ```env
   NODE_ENV=production
   PORT=3001
   FRONTEND_URL=https://<ditt-vercel-projekt>.vercel.app

   DATABASE_URL=postgres://...
   SUPABASE_URL=https://<staging-project>.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=...
   ACCESS_TOKEN_SECRET=<generera-en-slumpad-64-tecken-str>

   BANKID_PRODUCTION=false

   # Valfria integrationer:
   GOCARDLESS_SECRET_ID=...
   GOCARDLESS_SECRET_KEY=...
   TINK_CLIENT_ID=...
   TINK_CLIENT_SECRET=...
   LANTMATERIET_CONSUMER_KEY=...
   LANTMATERIET_CONSUMER_SECRET=...
   LANTMATERIET_USE_VERIFICATION=true
   ```

4. Under **Settings → Networking → Generate Domain** – notera URL:en, t.ex.
   `castlegate-backend-production.up.railway.app`.
5. Verifiera i webbläsaren: `https://<din-backend>/api/v1/health` ska svara.

### Alternativ B – Render

- **New → Web Service** → koppla repo → **Root Directory:** `backend`.
- Build: `npm ci && npm run build` — Start: `npm run start:prod`.
- Miljövariabler samma som ovan.

### Alternativ C – Fly.io

Kräver Docker – hoppa över om du inte redan använder det.

---

## 3. Deploya frontend till Vercel

### 3.1 Importera projektet

1. [vercel.com/new](https://vercel.com/new) → välj GitHub-repot.
2. Vercel läser `vercel.json` automatiskt:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output: `dist`
3. **Klicka INTE Deploy än** – vi måste lägga in miljövariablerna först.

### 3.2 Lägg in miljövariabler

Under **Environment Variables**, lägg in (Production + Preview):

| Namn                          | Värde                                              |
| ----------------------------- | -------------------------------------------------- |
| `VITE_SUPABASE_URL`           | `https://<staging-project>.supabase.co`            |
| `VITE_SUPABASE_ANON_KEY`      | `<anon key från Supabase>`                         |
| `VITE_API_BASE_URL`           | `https://<din-backend>/api/v1`                     |
| `VITE_BANKID_API_URL`         | `https://<din-backend>/api/v1/bankid`              |
| `VITE_SESSION_TIMEOUT_MINUTES`| `15`                                               |

Om du vill att testaren ska slippa BankID-QR (t.ex. för första UX-testet),
lägg också till:

| Namn                          | Värde  |
| ----------------------------- | ------ |
| `VITE_SKIP_BANKID`            | `true` |
| `VITE_DEMO_MODE`              | `true` |

### 3.3 Deploy

Klicka **Deploy**. Efter ~1–2 min får du en URL: `https://<projekt>.vercel.app`.

### 3.4 Uppdatera backendens FRONTEND_URL

Gå tillbaka till Railway → sätt `FRONTEND_URL` till Vercel-URL:en → **Restart**.
Detta är nödvändigt för att CORS ska släppa igenom din nya frontend.

---

## 4. Testa

Öppna Vercel-URL:en i incognito. Du ska:

1. Se startsidan.
2. Kunna logga in (BankID Test eller demo-läge).
3. Se att data laddas (nätverksfliken → API-anrop mot din Railway-backend
   ska returnera 200).

### Vanliga problem

| Symptom                                  | Trolig orsak                                                                                     |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Blank sida, 404 på refresh av `/profile` | SPA-rewrite saknas – dubbelkolla att `vercel.json` finns i repo-roten                            |
| API-anrop failar med CORS-fel            | `FRONTEND_URL` i backend matchar inte Vercel-URL:en exakt (inkl. `https://`, inget trailing `/`) |
| "Missing environment variable"           | Env vars satta men projektet inte re-deployat – klicka **Redeploy** i Vercel                     |
| BankID svarar 500                        | `BANKID_PRODUCTION=false` saknas i backend, eller test-certifikat inte laddat                    |

---

## 5. Skydda staging (rekommenderas)

Innan du skickar länken till en tester, aktivera lösenordsskydd så inte vem
som helst hittar den:

- **Vercel → Project → Settings → Deployment Protection** → **Password Protection**
  (finns på Pro-planen, ~20 USD/mån).
- Alternativ (gratis): lägg till en Basic Auth-middleware i NestJS för att
  skydda `/api/*` och sätt en `<meta name="robots" content="noindex">` i
  `index.html` så Google inte indexerar staging.

---

## 6. Fortsatt arbete

- **Custom domän:** Vercel → Domains → lägg till `staging.castlegate.se`.
- **CI:** Varje push till `main` deployar automatiskt till Vercel (och Railway
  om det är konfigurerat). Pull requests får preview-URL:er automatiskt.
- **Buggrapportering:** ge testaren en Linear-inbox, ett Google Form eller en
  Slack-kanal för feedback.

---

## Filer som ingår i denna setup

- [`vercel.json`](./vercel.json) – SPA-rewrites, cache och security headers
- [`.vercelignore`](./.vercelignore) – utesluter backend och interna docs från deployen
- [`.env.example`](./.env.example) – mall för miljövariabler (både lokalt och Vercel)
