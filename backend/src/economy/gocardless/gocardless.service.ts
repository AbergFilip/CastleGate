import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const GC_API = 'https://bankaccountdata.gocardless.com/api/v2';
const GC_SANDBOX_INSTITUTION = 'SANDBOXFINANCE_SFIN0000';

export interface GCAccountInfo {
  id: string;
  name?: string;
  ownerName?: string;
  accountNumber?: string;
  iban?: string;
  currency?: string;
  institutionName?: string;
  balance?: number;
}

export interface GCRequisition {
  id: string;
  link: string;
  status: string;
  institution_id: string;
  accounts: string[];
}

@Injectable()
export class GoCardlessService {
  private readonly logger = new Logger(GoCardlessService.name);
  private cachedToken: { access: string; expiresAt: number } | null = null;

  constructor(private readonly config: ConfigService) {}

  private getSecretId(): string {
    const id =
      this.config.get<string>('gocardless.secretId') ??
      this.config.get<string>('GOCARDLESS_SECRET_ID') ??
      process.env.GOCARDLESS_SECRET_ID;
    if (!id) throw new Error('GOCARDLESS_SECRET_ID saknas i miljön');
    return id;
  }

  private getSecretKey(): string {
    const key =
      this.config.get<string>('gocardless.secretKey') ??
      this.config.get<string>('GOCARDLESS_SECRET_KEY') ??
      process.env.GOCARDLESS_SECRET_KEY;
    if (!key) throw new Error('GOCARDLESS_SECRET_KEY saknas i miljön');
    return key;
  }

  async getAccessToken(): Promise<string> {
    if (this.cachedToken && Date.now() < this.cachedToken.expiresAt) {
      return this.cachedToken.access;
    }

    const res = await fetch(`${GC_API}/token/new/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        secret_id: this.getSecretId(),
        secret_key: this.getSecretKey(),
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      this.logger.error(`GoCardless token error: ${res.status} ${text}`);
      throw new Error('Kunde inte hämta GoCardless-token');
    }

    const data = (await res.json()) as {
      access: string;
      access_expires: number;
      refresh: string;
    };
    this.cachedToken = {
      access: data.access,
      expiresAt: Date.now() + (data.access_expires - 60) * 1000,
    };
    return data.access;
  }

  /**
   * List available institutions (banks) for a given country.
   */
  async getInstitutions(country: string = 'SE'): Promise<
    Array<{ id: string; name: string; logo: string; countries: string[] }>
  > {
    const token = await this.getAccessToken();
    const res = await fetch(
      `${GC_API}/institutions/?country=${encodeURIComponent(country)}`,
      { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } },
    );
    if (!res.ok) {
      this.logger.error(`GoCardless institutions error: ${res.status}`);
      return [];
    }
    return (await res.json()) as Array<{
      id: string;
      name: string;
      logo: string;
      countries: string[];
    }>;
  }

  /**
   * Create a requisition (bank connection request).
   * Returns a link for the user to authenticate with their bank.
   */
  async createRequisition(
    institutionId: string,
    redirectUri: string,
    reference?: string,
  ): Promise<GCRequisition> {
    const token = await this.getAccessToken();
    const body: Record<string, string> = {
      institution_id: institutionId,
      redirect: redirectUri,
    };
    if (reference) body.reference = reference;

    const res = await fetch(`${GC_API}/requisitions/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      this.logger.error(`GoCardless requisition error: ${res.status} ${text}`);
      throw new Error('Kunde inte skapa GoCardless-requisition');
    }

    const data = (await res.json()) as GCRequisition;
    this.logger.log(
      `GoCardless requisition skapad: ${data.id} → ${data.link}`,
    );
    return data;
  }

  /**
   * Create a sandbox requisition using the built-in test bank.
   */
  async createSandboxRequisition(redirectUri: string): Promise<GCRequisition> {
    return this.createRequisition(GC_SANDBOX_INSTITUTION, redirectUri);
  }

  /**
   * Get requisition details (includes account IDs after user has authenticated).
   */
  async getRequisition(requisitionId: string): Promise<GCRequisition> {
    const token = await this.getAccessToken();
    const res = await fetch(`${GC_API}/requisitions/${requisitionId}/`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
    if (!res.ok) {
      const text = await res.text();
      this.logger.error(`GoCardless get requisition error: ${res.status} ${text}`);
      throw new Error('Kunde inte hämta GoCardless-requisition');
    }
    return (await res.json()) as GCRequisition;
  }

  /**
   * Get account details (owner name, IBAN, etc).
   */
  async getAccountDetails(
    accountId: string,
  ): Promise<Record<string, unknown> | null> {
    const token = await this.getAccessToken();
    const res = await fetch(`${GC_API}/accounts/${accountId}/details/`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
    if (!res.ok) {
      this.logger.warn(`GoCardless account details ${accountId}: ${res.status}`);
      return null;
    }
    const data = (await res.json()) as { account?: Record<string, unknown> };
    return data.account ?? null;
  }

  /**
   * Get account balances.
   */
  async getAccountBalances(
    accountId: string,
  ): Promise<Array<{ amount: string; currency: string; type: string }>> {
    const token = await this.getAccessToken();
    const res = await fetch(`${GC_API}/accounts/${accountId}/balances/`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
    if (!res.ok) {
      this.logger.warn(`GoCardless balances ${accountId}: ${res.status}`);
      return [];
    }
    const data = (await res.json()) as {
      balances?: Array<{
        balanceAmount: { amount: string; currency: string };
        balanceType: string;
      }>;
    };
    return (data.balances ?? []).map((b) => ({
      amount: b.balanceAmount.amount,
      currency: b.balanceAmount.currency,
      type: b.balanceType,
    }));
  }

  /**
   * Get account metadata (institution name, status, etc).
   */
  async getAccountMetadata(
    accountId: string,
  ): Promise<{
    id: string;
    institution_id: string;
    status: string;
    owner_name?: string;
  } | null> {
    const token = await this.getAccessToken();
    const res = await fetch(`${GC_API}/accounts/${accountId}/`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
    if (!res.ok) return null;
    return (await res.json()) as {
      id: string;
      institution_id: string;
      status: string;
      owner_name?: string;
    };
  }

  /**
   * Fetch full account info (details + balances) for all accounts in a requisition.
   */
  async getAccountsFromRequisition(
    requisitionId: string,
  ): Promise<GCAccountInfo[]> {
    const req = await this.getRequisition(requisitionId);
    if (!req.accounts || req.accounts.length === 0) {
      this.logger.warn(`GoCardless requisition ${requisitionId} har inga konton (status: ${req.status})`);
      return [];
    }

    const institutions = await this.getInstitutions();
    const instMap = new Map(institutions.map((i) => [i.id, i.name]));

    const results: GCAccountInfo[] = [];

    for (const accountId of req.accounts) {
      const [details, balances, metadata] = await Promise.all([
        this.getAccountDetails(accountId),
        this.getAccountBalances(accountId),
        this.getAccountMetadata(accountId),
      ]);

      const iban = (details?.iban ?? details?.resourceId) as string | undefined;
      const name =
        (details?.name as string) ??
        (details?.product as string) ??
        'Konto';
      const ownerName = (details?.ownerName as string) ?? metadata?.owner_name;
      const currency = (details?.currency as string) ?? 'SEK';

      const institutionName =
        instMap.get(metadata?.institution_id ?? req.institution_id) ??
        req.institution_id;

      const interimAvailable = balances.find(
        (b) => b.type === 'interimAvailable',
      );
      const closingBooked = balances.find((b) => b.type === 'closingBooked');
      const balanceEntry = interimAvailable ?? closingBooked ?? balances[0];
      const balance = balanceEntry
        ? parseFloat(balanceEntry.amount)
        : undefined;

      results.push({
        id: accountId,
        name,
        ownerName,
        iban,
        currency: balanceEntry?.currency ?? currency,
        institutionName,
        balance: Number.isFinite(balance) ? balance : undefined,
      });
    }

    this.logger.log(
      `GoCardless requisition ${requisitionId}: ${results.length} konto(n) hämtade`,
    );
    return results;
  }

  /**
   * Refresh balance for a single account.
   */
  async refreshAccountBalance(
    accountId: string,
  ): Promise<{ value: number; currency: string } | null> {
    const balances = await this.getAccountBalances(accountId);
    const interimAvailable = balances.find(
      (b) => b.type === 'interimAvailable',
    );
    const closingBooked = balances.find((b) => b.type === 'closingBooked');
    const entry = interimAvailable ?? closingBooked ?? balances[0];
    if (!entry) return null;
    const value = parseFloat(entry.amount);
    return Number.isFinite(value) ? { value, currency: entry.currency } : null;
  }
}
