import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface LantmaterietAddressResult {
  label: string;
  address?: string;
  postal_code?: string;
  city?: string;
  street?: string;
  objectId?: string;
}

@Injectable()
export class LantmaterietService {
  private readonly logger = new Logger(LantmaterietService.name);
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(private readonly config: ConfigService) {}

  private get consumerKey(): string {
    return this.config.get<string>('lantmateriet.consumerKey') || '';
  }

  private get consumerSecret(): string {
    return this.config.get<string>('lantmateriet.consumerSecret') || '';
  }

  private get addressApiUrl(): string {
    return this.config.get<string>('lantmateriet.addressApiUrl') || '';
  }

  private get tokenUrl(): string {
    return this.config.get<string>('lantmateriet.tokenUrl') || '';
  }

  isConfigured(): boolean {
    return !!(this.consumerKey && this.consumerSecret);
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry - 60000) {
      return this.accessToken;
    }

    const credentials = Buffer.from(
      `${this.consumerKey}:${this.consumerSecret}`,
      'utf-8'
    ).toString('base64');

    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const text = await response.text();
      this.logger.error(`Lantmäteriet token error: ${response.status} ${text}`);
      throw new Error('Kunde inte hämta Lantmäteriet-token');
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    const expiresIn = (data.expires_in || 3600) * 1000;
    this.tokenExpiry = Date.now() + expiresIn;
    return this.accessToken!;
  }

  async searchAddress(query: string, maxHits = 15): Promise<LantmaterietAddressResult[]> {
    if (!this.isConfigured()) {
      this.logger.warn('Lantmäteriet API inte konfigurerad');
      return [];
    }

    const trimmed = query.trim();
    if (trimmed.length < 3) {
      return [];
    }

    try {
      const token = await this.getAccessToken();
      const url = new URL(`${this.addressApiUrl}/autocomplete`);
      url.searchParams.set('adress', trimmed);
      url.searchParams.set('match', 'startsWith');
      url.searchParams.set('maxHits', String(maxHits));
      url.searchParams.set('splitAdress', 'true');

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        this.logger.error(`Lantmäteriet autocomplete error: ${response.status}`, err);
        return [];
      }

      const data = await response.json();
      const items = Array.isArray(data) ? data : data?.adresser || data?.resultat || [];
      if (!Array.isArray(items)) return [];

      return items.map((item: any) => {
        if (typeof item === 'string') {
          return { label: item, address: item };
        }
        const addr = item?.adress;
        const label =
          item?.adressetikett ||
          addr?.adressetikett ||
          item?.label ||
          (typeof addr === 'object'
            ? [addr?.gatuadress, addr?.postnummer, addr?.postort].filter(Boolean).join(', ')
            : '');
        const postal_code = addr?.postnummer ?? item?.postnummer;
        const city = addr?.postort ?? item?.postort;
        const street = addr?.gatuadress ?? item?.gatuadress;
        return {
          label: label || 'Okänd adress',
          address: label,
          postal_code,
          city,
          street,
          objectId: item?.objektidentitet,
        };
      });
    } catch (error: any) {
      this.logger.error(`Lantmäteriet search error: ${error?.message}`);
      return [];
    }
  }

  async fritextSearch(query: string, maxHits = 15): Promise<LantmaterietAddressResult[]> {
    if (!this.isConfigured()) {
      return [];
    }

    const trimmed = query.trim();
    if (trimmed.length < 3 || trimmed.length > 120) {
      return [];
    }

    try {
      const token = await this.getAccessToken();
      const url = new URL(`${this.addressApiUrl}/fritext`);
      url.searchParams.set('adress', trimmed);
      url.searchParams.set('maxHits', String(maxHits));
      url.searchParams.set('splitAdress', 'true');

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        return [];
      }

      return data.map((item: any) => {
        const label = item?.adressetikett || item?.adress?.adressetikett || '';
        const addr = item?.adress;
        return {
          label,
          address: label,
          postal_code: typeof addr === 'object' ? addr?.postnummer : undefined,
          city: typeof addr === 'object' ? addr?.postort : undefined,
          street: typeof addr === 'object' ? addr?.gatuadress : undefined,
          objectId: item?.objektidentitet,
        };
      });
    } catch (error: any) {
      this.logger.error(`Lantmäteriet fritext error: ${error?.message}`);
      return [];
    }
  }
}
