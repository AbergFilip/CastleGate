import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { writeToLogFile } from '../../common/file-logger';

const TINK_API = 'https://api.tink.com';

export interface TinkAccountInfo {
  id: string;
  name?: string;
  accountNumber?: string;
  currencyCode?: string;
  financialInstitutionName?: string;
  balance?: number;
}

@Injectable()
export class TinkService {
  private readonly logger = new Logger(TinkService.name);
  private static envLoaded = false;

  constructor(private readonly config: ConfigService) {}

  /** Ladda backend/.env från fil om TINK_ inte finns – provar flera sökvägar */
  private ensureTinkEnv(): void {
    if (process.env.TINK_CLIENT_ID) return;
    if (TinkService.envLoaded) return;
    const mainDir = typeof require !== 'undefined' && require.main?.filename
      ? dirname(require.main.filename)
      : __dirname;
    const possiblePaths = [
      join(mainDir, '..', '.env'),
      join(__dirname, '..', '..', '..', '.env'),
      join(process.cwd(), '.env'),
      join(process.cwd(), 'backend', '.env'),
    ];
    try {
      const dotenv = require('dotenv');
      for (const envPath of possiblePaths) {
        if (!existsSync(envPath)) continue;
        const result = dotenv.config({ path: envPath });
        if (!result.error && process.env.TINK_CLIENT_ID) {
          TinkService.envLoaded = true;
          return;
        }
      }
    } catch {
      // fallback: manuell parsing
      for (const envPath of possiblePaths) {
        if (!existsSync(envPath)) continue;
        try {
          const content = readFileSync(envPath, 'utf-8');
          for (const line of content.split(/\r?\n/)) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
              const eq = trimmed.indexOf('=');
              if (eq > 0) {
                const key = trimmed.slice(0, eq).trim();
                const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
                if (key.startsWith('TINK_') && !process.env[key]) process.env[key] = value;
              }
            }
          }
          if (process.env.TINK_CLIENT_ID) {
            TinkService.envLoaded = true;
            return;
          }
        } catch {
          //
        }
      }
    }
    TinkService.envLoaded = true;
  }

  private getClientId(): string {
    this.ensureTinkEnv();
    const id =
      this.config.get<string>('tink.clientId') ??
      this.config.get<string>('TINK_CLIENT_ID') ??
      process.env.TINK_CLIENT_ID;
    if (!id) throw new Error('TINK_CLIENT_ID saknas i miljön. Lägg till i backend/.env');
    return id;
  }

  private getClientSecret(): string {
    this.ensureTinkEnv();
    const secret =
      this.config.get<string>('tink.clientSecret') ??
      this.config.get<string>('TINK_CLIENT_SECRET') ??
      process.env.TINK_CLIENT_SECRET;
    if (!secret) throw new Error('TINK_CLIENT_SECRET saknas i miljön. Lägg till i backend/.env');
    return secret;
  }

  /**
   * Hämta access token från Tink (client credentials).
   */
  async getAccessToken(): Promise<string> {
    const clientId = this.getClientId();
    const clientSecret = this.getClientSecret();
    // Exakt enligt Tink one-time balance check: account-verification-reports:read,accounts:read,accounts.balances:readonly
    const scope = 'account-verification-reports:read,accounts:read,accounts.balances:readonly';

    const body = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
      scope,
    });

    const res = await fetch(`${TINK_API}/api/v1/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!res.ok) {
      const text = await res.text();
      this.logger.error(`Tink token error: ${res.status} ${text}`);
      throw new Error('Kunde inte hämta Tink-token');
    }

    const data = (await res.json()) as { access_token?: string };
    if (!data.access_token) throw new Error('Tink returnerade ingen access_token');
    return data.access_token;
  }

  /**
   * Hämta account verification report (innehåller valt konto från Account Check-flödet).
   */
  async getAccountVerificationReport(
    accessToken: string,
    reportId: string,
  ): Promise<TinkAccountInfo[]> {
    const res = await fetch(
      `${TINK_API}/api/v1/account-verification-reports/${reportId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    if (!res.ok) {
      const text = await res.text();
      this.logger.error(`Tink report error: ${res.status} ${text}`);
      throw new Error('Kunde inte hämta kontorapport från Tink');
    }

    const report = (await res.json()) as Record<string, unknown>;
    const reportKeys = Object.keys(report);
    this.logger.log(`Tink report ${reportId} toppnycklar: ${reportKeys.join(', ')}`);

    const accounts: TinkAccountInfo[] = [];

    // Tink report kan ha "accounts", "accountList", "account", "selectedAccounts", "verifiedAccounts", "userDataByProvider[].accounts", "data.accounts"
    const dataObj = report.data as Record<string, unknown> | undefined;
    let list: Record<string, unknown>[] = [];

    // Tink Account Check: konton under userDataByProvider[].accounts (med financialInstitutionName per provider)
    const userDataByProvider = report.userDataByProvider as Array<{ accounts?: unknown[]; account?: unknown; financialInstitutionName?: string }> | undefined;
    if (Array.isArray(userDataByProvider)) {
      for (const provider of userDataByProvider) {
        const provAccounts = (provider?.accounts ?? (provider?.account ? [provider.account] : [])) as Record<string, unknown>[];
        for (const acc of provAccounts) {
          list.push({
            ...acc,
            financialInstitutionName: (acc.financialInstitutionName ?? provider?.financialInstitutionName) as string | undefined,
          });
        }
      }
    }

    if (list.length === 0) {
      const accountList = (report.accounts ?? report.accountList ?? report.account ?? report.selectedAccounts ?? report.verifiedAccounts ?? dataObj?.accounts ?? dataObj?.accountList) as
        | Record<string, unknown>[]
        | Record<string, unknown>
        | undefined;
      list = Array.isArray(accountList)
        ? accountList
        : accountList
          ? [accountList]
          : [];
    }

    // Vissa rapporter har konton under credentials[].accounts
    if (list.length === 0 && Array.isArray(report.credentials)) {
      for (const cred of report.credentials as Record<string, unknown>[]) {
        const credAccounts = (cred.accounts ?? cred.accountList ?? cred.account) as
          | Record<string, unknown>[]
          | Record<string, unknown>
          | undefined;
        if (Array.isArray(credAccounts)) list.push(...credAccounts);
        else if (credAccounts) list.push(credAccounts);
      }
    }

    // Om bara accountIds/selectedAccountIds finns, skapa minimal kontoinfo för varje id
    const ids = (report.accountIds ?? report.selectedAccountIds ?? dataObj?.accountIds) as string[] | undefined;
    if (list.length === 0 && Array.isArray(ids)) {
      for (const id of ids) {
        if (id) list.push({ id, accountId: id } as Record<string, unknown>);
      }
    }
    if (list.length === 0 && (report.accountId ?? dataObj?.accountId)) {
      const id = (report.accountId ?? dataObj?.accountId) as string;
      list = [{ id, accountId: id }];
    }

    for (const acc of list) {
      const a = acc as Record<string, unknown> & {
        identifiers?: { accountNumber?: unknown };
        financialInstitution?: { name?: unknown };
        balances?: { bookedBalance?: { value?: unknown }; available?: { value?: unknown } };
      };
      const id = a.id ?? a.accountId;
      if (id == null) continue;
      const idStr = typeof id === 'string' ? id : String(id);
      const name = (a.name ?? a.accountName ?? a.displayName ?? 'Konto') as string;
      const identifiers = a.identifiers ?? (a as any).accountIdentifiers;
      const accountNumber = (a.accountNumber ?? a.displayAccountNumber ?? a.iban ?? identifiers?.accountNumber ?? (identifiers?.iban && typeof identifiers.iban === 'object' ? (identifiers.iban as any).iban : identifiers?.iban)) as
        | string
        | undefined;
      const currencyCode = (a.currencyCode ?? a.currency ?? 'SEK') as string;
      const financialInstitutionName = (a.financialInstitutionName ??
        a.financialInstitution?.name ??
        a.providerName ??
        'Bank') as string;
      // Saldo: direkt eller nested (bookedBalance.amount.value med unscaledValue/scale)
      let balance: number | undefined = (a.balance ?? a.balances?.bookedBalance?.value ?? a.balances?.available?.value) as number | undefined;
      if (balance == null && a.balances?.bookedBalance && typeof a.balances.bookedBalance === 'object') {
        const b = (a.balances.bookedBalance as Record<string, unknown>).amount as Record<string, unknown> | undefined;
        const v = b?.value;
        if (v && typeof v === 'object' && 'unscaledValue' in v) {
          const scale = (v as { scale?: number }).scale ?? 0;
          const unscaled = (v as { unscaledValue?: number }).unscaledValue ?? 0;
          balance = scale >= 0 ? unscaled / Math.pow(10, scale) : unscaled * Math.pow(10, -scale);
        }
        if (balance == null && b?.value != null && typeof (b.value as number) === 'number') balance = b.value as number;
      }
      accounts.push({
        id: idStr,
        name: String(name),
        accountNumber: accountNumber ? String(accountNumber) : undefined,
        currencyCode: String(currencyCode),
        financialInstitutionName: String(financialInstitutionName),
        balance: typeof balance === 'number' ? balance : undefined,
      });
    }

    // Om rapporten bara innehåller ett accountId (enkel struktur)
    const singleId = report.accountId as string | undefined;
    if (accounts.length === 0 && singleId) {
      accounts.push({
        id: typeof singleId === 'string' ? singleId : String(singleId),
        name: 'Konto',
        currencyCode: 'SEK',
        financialInstitutionName: 'Bank',
      });
    }

    if (accounts.length === 0) {
      const rawPreview = JSON.stringify(report).slice(0, 3500);
      this.logger.log(`Tink report ${reportId} innehöll inga konton. Raw response: ${rawPreview}${rawPreview.length >= 3500 ? '...' : ''}`);
    } else {
      this.logger.log(`Tink report ${reportId}: ${accounts.length} konto(n) hämtade`);
    }
    return accounts;
  }

  /**
   * Hämta rå rapport (för debug). Returnerar toppnycklar och en kort preview av innehållet.
   */
  async getReportKeysAndPreview(
    clientId: string,
    clientSecret: string,
    reportId: string,
  ): Promise<{ keys: string[]; preview: string }> {
    const token = await this.getAccessTokenWithCredentials(clientId, clientSecret);
    const res = await fetch(
      `${TINK_API}/api/v1/account-verification-reports/${reportId}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!res.ok) return { keys: [], preview: `HTTP ${res.status}` };
    const report = (await res.json()) as Record<string, unknown>;
    const keys = Object.keys(report);
    const preview = JSON.stringify(report).slice(0, 2500);
    return { keys, preview };
  }

  /**
   * Hämta kontodetaljer från Tink Data API (namn, kontonummer etc) för att berika minimal kontoinfo.
   */
  async getAccountDetails(
    accessToken: string,
    accountId: string,
  ): Promise<Partial<TinkAccountInfo> | null> {
    const res = await fetch(`${TINK_API}/data/v2/accounts/${accountId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return null;
    const a = (await res.json()) as Record<string, unknown> & {
      name?: string;
      accountNumber?: string;
      currencyCode?: string;
      financialInstitutionId?: string;
      identifiers?: { accountNumber?: string; iban?: string };
    };
    const name = (a.name ?? a.accountName ?? a.displayName) as string | undefined;
    const accountNumber = (a.accountNumber ?? a.iban ?? a.identifiers?.accountNumber ?? a.identifiers?.iban) as string | undefined;
    const currencyCode = (a.currencyCode ?? a.currency) as string | undefined;
    const financialInstitutionName = (a.financialInstitutionName ?? (a as any).financialInstitution?.name ?? a.providerName) as string | undefined;
    return {
      name: name ?? 'Konto',
      accountNumber: accountNumber ?? undefined,
      currencyCode: currencyCode ?? 'SEK',
      financialInstitutionName: financialInstitutionName ?? 'Bank',
    };
  }

  /**
   * Parsar Tink balance-svar (Get Account eller Get Balances) till { value, currency }.
   * Get Account använder balances.booked; Get Balances använder balances.bookedBalance.
   */
  private parseBalanceResponse(data: Record<string, unknown>): { value: number; currency: string } | null {
    const balances = data.balances as Record<string, unknown> | undefined;
    const booked = (balances?.booked ?? balances?.bookedBalance ?? balances?.availableBalanceExcludingCredit ?? balances?.availableBalanceIncludingCredit ?? balances?.available) as Record<string, unknown> | undefined;
    if (!booked) return null;
    const amount = booked.amount as Record<string, unknown> | undefined;
    if (!amount) return null;
    const val = amount.value;
    let value: number;
    if (typeof val === 'number' && Number.isFinite(val)) {
      value = val;
    } else if (val && typeof val === 'object' && 'unscaledValue' in val) {
      const v = val as { unscaledValue?: number | string; scale?: number | string };
      const scaleNum = typeof v.scale === 'string' ? parseInt(v.scale, 10) : (v.scale ?? 0);
      const scale = Number.isFinite(scaleNum) ? scaleNum : 0;
      const unscaledRaw = v.unscaledValue ?? 0;
      const unscaled = typeof unscaledRaw === 'string' ? parseFloat(unscaledRaw) : Number(unscaledRaw);
      value = scale >= 0 ? unscaled / Math.pow(10, scale) : unscaled * Math.pow(10, -scale);
    } else {
      return null;
    }
    const currency = (amount.currencyCode ?? booked.currencyCode ?? 'SEK') as string;
    return { value, currency };
  }

  /**
   * Hämta saldo för ett konto. Försöker i ordning:
   * 1) GET /data/v2/accounts/{id} – kräver USER token med accounts:read (vi har endast client token → 403)
   * 2) GET /data/v2/accounts/{id}/balances – User eller Client token med accounts.balances:readonly
   * 3) GET /api/v1/accounts/{id}/balances – balances:read
   * Med Account Check (one-time) har vi ingen användartoken; alla anrop görs med client token.
   */
  async getAccountBalance(
    accessToken: string,
    accountId: string,
  ): Promise<{ value: number; currency: string } | null> {
    const accountUrl = `${TINK_API}/data/v2/accounts/${accountId}`;
    const v2BalancesUrl = `${TINK_API}/data/v2/accounts/${accountId}/balances`;
    const v1BalancesUrl = `${TINK_API}/api/v1/accounts/${accountId}/balances`;

    for (const [label, url] of [
      ['v2 account (accounts:read)', accountUrl],
      ['v2 balances', v2BalancesUrl],
      ['v1 balances', v1BalancesUrl],
    ] as const) {
      this.logger.log(`Tink balance: GET ${label} ${url}`);
      const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
      const rawText = await res.text();
      const data = (() => { try { return JSON.parse(rawText); } catch { return {}; } })() as Record<string, unknown>;
      this.logger.log(`Tink balance ${label} svar: ${res.status} – ${rawText.slice(0, 300)}`);

      if (!res.ok) {
        if (res.status === 403) continue;
        return null;
      }
      const parsed = this.parseBalanceResponse(data);
      if (parsed) {
        this.logger.log(`Tink balance OK (${label}): ${parsed.value} ${parsed.currency}`);
        return parsed;
      }
    }
    return null;
  }

  /**
   * Anropar saldo-API (v2 account, v2 balances, v1 balances) och returnerar status + eventuellt felmeddelande (för diagnostik).
   */
  async getBalanceResponseDebug(
    clientId: string,
    clientSecret: string,
    accountId: string,
  ): Promise<{ status: number; error?: string; source?: string }> {
    try {
      const token = await this.getAccessTokenWithCredentials(clientId, clientSecret);
      for (const [label, url] of [
        ['v2 account (accounts:read)', `${TINK_API}/data/v2/accounts/${accountId}`],
        ['v2 balances', `${TINK_API}/data/v2/accounts/${accountId}/balances`],
        ['v1 balances', `${TINK_API}/api/v1/accounts/${accountId}/balances`],
      ] as const) {
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        const text = await res.text();
        const data = (() => { try { return JSON.parse(text); } catch { return {}; } })() as Record<string, unknown>;
        const errorMsg = (data.errorMessage ?? data.error ?? data.message ?? (res.ok ? undefined : text.slice(0, 200))) as string | undefined;
        if (res.ok) return { status: res.status, source: label };
        if (res.status === 403) continue;
        return { status: res.status, error: errorMsg, source: label };
      }
      return { status: 403, error: 'Alla tre endpoints (v2 account, v2 balances, v1 balances) returnerade 403' };
    } catch (e: any) {
      return { status: 0, error: e?.message ?? String(e) };
    }
  }

  /**
   * Hämta access token med angivna credentials (kringgår process.env).
   * Först används exakt scope enligt Tink one-time balance check-dokumentationen;
   * fallback utan accounts.balances:readonly om Tink svarar 401 invalid_scope.
   */
  async getAccessTokenWithCredentials(clientId: string, clientSecret: string): Promise<string> {
    // 1) API-dokumentationen kräver accounts.balances:readonly för saldo – många appar har det inte aktiverat
    const scopeBalancesReadonly = 'account-verification-reports:read,accounts:read,accounts.balances:readonly';
    // 2) Ni har balances:read i Console – testa om saldo-API accepterar det
    const scopeBalancesRead = 'account-verification-reports:read,accounts:read,balances:read';
    // 3) Minimal (rapport + kontolista, inget saldo)
    const scopeMinimal = 'account-verification-reports:read,accounts:read';

    for (const [label, scope] of [
      ['med accounts.balances:readonly', scopeBalancesReadonly],
      ['med balances:read (er Console-scope)', scopeBalancesRead],
      ['utan saldo-scope', scopeMinimal],
    ] as const) {
      const body = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
        scope,
      });
      const res = await fetch(`${TINK_API}/api/v1/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      const text = await res.text();
      const data = (() => { try { return JSON.parse(text); } catch { return {}; } })() as { access_token?: string; errorCode?: string; errorDetails?: string; scope?: string };
      if (res.ok && data.access_token) {
        this.logger.log(`Tink token: använder scope ${label}. Svar scope: ${data.scope ?? '—'}`);
        writeToLogFile(`[Tink] Token OK med scope: ${data.scope ?? scope}. Saldo-API ska fungera.`);
        return data.access_token;
      }
      this.logger.log(`Tink token (${label}): ${res.status} – ${text.slice(0, 300)}`);
      writeToLogFile(`[Tink] Token (${label}): ${res.status} – ${text.slice(0, 200)}`);
      if (res.status === 401 && (data.errorCode === 'oauth.invalid_scope' || text.includes('invalid_scope'))) {
        writeToLogFile(`[Tink] Token (${label}) avvisad (401). Provar nästa scope.`);
        continue;
      }
      this.logger.error(`Tink token error: ${res.status} ${text}`);
      writeToLogFile(`[Tink] Token-fel: ${res.status} ${text.slice(0, 150)}`);
      throw new Error('Kunde inte hämta Tink-token');
    }
    writeToLogFile('[Tink] Inget av scopena gav token. Kontrollera TINK_CLIENT_ID/SECRET och att minst account-verification-reports:read,accounts:read är aktiverat i Tink Console.');
    throw new Error('Kunde inte hämta Tink-token');
  }

  /**
   * Hämta konton från Tink med angivna credentials (används när process.env inte är tillgänglig).
   */
  async getAccountsFromReportWithCredentials(
    reportId: string,
    clientId: string,
    clientSecret: string,
  ): Promise<TinkAccountInfo[]> {
    const token = await this.getAccessTokenWithCredentials(clientId, clientSecret);
    let accounts = await this.getAccountVerificationReport(token, reportId);
    for (const acc of accounts) {
      const needsEnrich = !acc.accountNumber && (acc.name === 'Konto' || !acc.name);
      if (needsEnrich) {
        const details = await this.getAccountDetails(token, acc.id);
        if (details) {
          if (details.name) acc.name = details.name;
          if (details.accountNumber) acc.accountNumber = details.accountNumber;
          if (details.currencyCode) acc.currencyCode = details.currencyCode;
          if (details.financialInstitutionName) acc.financialInstitutionName = details.financialInstitutionName;
        }
      }
      if (acc.balance == null) {
        const bal = await this.getAccountBalance(token, acc.id);
        if (bal) acc.balance = bal.value;
      }
    }
    return accounts;
  }

  /**
   * Hämta konton från Tink för en account verification report och eventuellt saldon.
   */
  async getAccountsFromReport(reportId: string): Promise<TinkAccountInfo[]> {
    const token = await this.getAccessToken();
    const accounts = await this.getAccountVerificationReport(token, reportId);
    for (const acc of accounts) {
      if (acc.balance == null) {
        const bal = await this.getAccountBalance(token, acc.id);
        if (bal) acc.balance = bal.value;
      }
    }
    return accounts;
  }
}
