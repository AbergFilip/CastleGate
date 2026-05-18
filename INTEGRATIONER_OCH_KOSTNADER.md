# Integrationer och kostnader – svenska källor

Översikt över konkreta leverantörer, API:er och typ av kostnad för att integrera CastleGate med banker, försäkringar, Transportstyrelsen, pension och skatt. Använd för grov kostnadsuppskattning och prioritering.

---

## 1. Banker (konton, transaktioner, saldon)

Ni behöver **inte** en integration per bank. Använd **en Open Banking-aggregator** som har avtal med många svenska banker.

| Leverantör | Täckning (exempel) | Kostnadstyp | Länk / kommentar |
|------------|--------------------|-------------|------------------|
| **Tink** | Nordea, SEB, Swedbank, Handelsbanken, Danske Bank, Skandia, Länsförsäkringar Bank, SBAB, m.fl. | Per användare/månad eller volym; ofta startup‑paket | [tink.com](https://tink.com) – vanlig i Norden |
| **TrueLayer** | Växande nordisk täckning | Per användare eller per API‑anrop | [truelayer.com](https://truelayer.com) |
| **Plaid** | Begränsad svensk täckning | Per användare (ofta) | Mer fokus UK/US |
| **Nordea Open Banking** (direkt) | Endast Nordea | Per avtal | Om ni bara behöver en bank |

**Rekommendation:** Börja med **en** aggregator (t.ex. Tink) för att få många svenska banker via en integration. Kostnaden är **inte** antal banker × X, utan aggregatorns prissättning (ofta per ansluten användare eller per anrop).

---

## 2. Försäkringar (policys, täckning, premie)

Det finns **ingen** nationell "en API för alla försäkringsbolag". Alternativ: B2B‑avtal per bolag eller aggregator/jämförelsetjänst.

| Typ | Leverantör / källa | Kostnadstyp | Kommentar |
|-----|--------------------|-------------|-----------|
| **Jämförelse / aggregator** | Compricer, Insurely (API för försäkringsdata) | Per användare, per anrop eller licens | Insurely erbjuder API för att hämta befintliga försäkringar |
| **B2B per bolag** | Länsförsäkringar, If, Trygg-Hansa, Folksam, Gjensidige, m.fl. | Per avtal (ofta ingen standardprislista) | Kräver förhandling per bolag |
| **Bransch / samverkanslösningar** | Ev. samarbeten via försäkringsförbund | Varierar | Kan underlätta vid flera bolag |

**Rekommendation:** För snabb täckning: kolla **Insurely** eller liknande API. För full kontroll och fler bolag: planera B2B‑avtal med de 2–3 största bolagen ni prioriterar.

---

## 3. Transportstyrelsen (fordon, båtar, körkort)

Officiella API:er från Transportstyrelsen. Ofta krävs avtal och godkänd användning.

| API / tjänst | Innehåll | Kostnadstyp | Länk / kommentar |
|--------------|----------|-------------|------------------|
| **Fordonsregister / Vehicle Registry** | Fordonsuppgifter, ägare, historik | Enligt Transportstyrelsens prissättning; ofta per anrop eller abonnemang | [transportstyrelsen.se](https://www.transportstyrelsen.se) – sök "API", "öppna data" |
| **Fartygsregister** | Båtar, ägare | Samma modell | Via Transportstyrelsen |
| **Körkort / tillstånd** | Normalt inte öppet API för privata tjänster | N/A eller särskilt avtal | Begränsad tillgång |

**Rekommendation:** Gå till Transportstyrelsens webbplats och deras avdelning för utvecklare/API för aktuella priser och villkor. Räkna med **en integration** (eller en per register) med avgifter per anrop eller månadsavgift.

---

## 4. Pension (tjänstepension, orange kuvert, MinPension)

| Leverantör | Innehåll | Kostnadstyp | Kommentar |
|------------|----------|-------------|-----------|
| **MinPension** | Samlad pension från många försäkringsbolag och pensioner | B2B‑avtal; ofta per användare eller fast | [minpension.se](https://www.minpension.se) – samlar tjänstepension m.m. |
| **Svensk Kollektivförsäkring** | Tjänstepension (via arbetsgivare) | Via avtal | För arbetsgivar-/pensionsdata |
| **Pensionsmyndigheten** | Allmän pension, prognoser | Tjänster/API enligt deras villkor; vissa delar gratis | [pensionsmyndigheten.se](https://www.pensionsmyndigheten.se) |

**Rekommendation:** **MinPension** ger bred täckning med **en** integration. Pensionsmyndigheten för allmän pension – kolla deras utvecklarportal för API och kostnad.

---

## 5. Skatt (deklaration, skattekonto, inkomst)

| Källa | Innehåll | Kostnadstyp | Kommentar |
|-------|----------|-------------|-----------|
| **Skatteverket** | Deklaration, skattekonto, inkomstuppgifter, INK2S m.m. | Enligt Skatteverkets villkor; många tjänster kräver godkänd åtkomst (t.ex. "Myndighetskoppling" eller e‑legitimation) | [skatteverket.se](https://www.skatteverket.se) – utvecklarinfo, e-tjänster |
| **Bokföringsnämnden / Visma m.fl.** | Mer bokföring/rapporter än skatt | Licens per användare eller företag | Om ni behöver företagsskatt, inte privatperson |

**Rekommendation:** För privatpersoner: **en** integration mot Skatteverkets tjänster (API eller e‑tjänster). Kostnad och tillgång beror på vilken tjänst och vilket avtal (t.ex. test vs produktion).

---

## 6. Övrigt som kan påverka kostnad

| Område | Kommentar |
|--------|-----------|
| **BankID** | Redan i bruk; kostnad enligt BankID‑avtal (ofta per autentisering). |
| **Hosting & egna API:er** | Er backend (t.ex. Node/Express) – kostnad för server/hosting, inte per extern källa. |
| **Auth (t.ex. Supabase/Auth0)** | Abonnemang eller MAU; separat från datakällorna ovan. |

---

## Grov prioritering för kostnadsuppskattning

1. **Banker** – 1 leverantör (t.ex. Tink): begär prissättning (per användare/månad eller per anrop).
2. **Pension** – 1 leverantör (MinPension): begär B2B‑pris.
3. **Transportstyrelsen** – 1–2 API:er: kolla transportstyrelsen.se för priser.
4. **Skatt** – Skatteverket: kolla vilken tjänst ni behöver och deras prissättning.
5. **Försäkringar** – 1 aggregator (t.ex. Insurely) för snabb start, eller B2B per bolag för djupare integration.

Totalt **ca 5–8 huvudsakliga avtal/API:er** ger täckning för banker, försäkringar, transport, pension och skatt – inte hundratals integrationer.

---

*Senast uppdaterad: februari 2025. Kontrollera alltid aktuella priser och villkor hos respektive leverantör.*
