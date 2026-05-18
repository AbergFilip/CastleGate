import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SecretClient } from '@azure/keyvault-secrets';
import { DefaultAzureCredential } from '@azure/identity';

/**
 * Azure Key Vault Service
 * 
 * Hanterar hämtning av secrets från Azure Key Vault med fallback till miljövariabler.
 * 
 * För lokal utveckling: Använd miljövariabler eller Azure CLI login (az login)
 * För produktion: Använd Managed Identity (automatiskt i Azure)
 */
@Injectable()
export class KeyVaultService implements OnModuleInit {
  private readonly logger = new Logger(KeyVaultService.name);
  private client: SecretClient | null = null;
  private vaultUrl: string | null = null;
  private enabled: boolean = false;
  private cache: Map<string, { value: string; expiresAt: number }> = new Map();
  private readonly CACHE_TTL_MS = 5 * 60 * 1000; // 5 minuter cache

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const vaultUrl = this.configService.get<string>('AZURE_KEY_VAULT_URL');
    const enabled = this.configService.get<string>('KEY_VAULT_ENABLED') === 'true';

    if (!enabled || !vaultUrl) {
      this.logger.log(
        '⚠️ Key Vault är inte aktiverat. Använder miljövariabler istället.'
      );
      this.logger.log(
        '   För att aktivera: sätt KEY_VAULT_ENABLED=true och AZURE_KEY_VAULT_URL i .env'
      );
      return;
    }

    try {
      this.vaultUrl = vaultUrl;
      
      // Använd DefaultAzureCredential som automatiskt hittar credentials:
      // 1. Environment variables (AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, AZURE_TENANT_ID)
      // 2. Managed Identity (i Azure)
      // 3. Azure CLI (az login) - för lokal utveckling
      const credential = new DefaultAzureCredential();
      
      this.client = new SecretClient(vaultUrl, credential);
      this.enabled = true;

      // Testa anslutningen genom att försöka lista secrets (med begränsad behörighet)
      this.logger.log(`✅ Key Vault-klient initierad: ${vaultUrl}`);
    } catch (error: any) {
      this.logger.error(
        `❌ Fel vid initiering av Key Vault: ${error.message}`,
        error.stack
      );
      this.logger.warn('   Fortsätter med miljövariabler som fallback');
      this.enabled = false;
    }
  }

  /**
   * Hämta secret från Key Vault eller miljövariabel
   * 
   * @param secretName Namnet på secretet i Key Vault (eller env variabel)
   * @param defaultValue Värde att använda om secret inte hittas
   * @returns Secret-värdet eller defaultValue
   */
  async getSecret(
    secretName: string,
    defaultValue?: string
  ): Promise<string | undefined> {
    // Kontrollera cache först
    const cached = this.cache.get(secretName);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value;
    }

    // Om Key Vault är aktiverat, försök hämta därifrån
    if (this.enabled && this.client) {
      try {
        const secret = await this.client.getSecret(secretName);
        const value = secret.value;

        if (value) {
          // Cacha värdet
          this.cache.set(secretName, {
            value,
            expiresAt: Date.now() + this.CACHE_TTL_MS,
          });
          this.logger.debug(`✅ Hämtat secret från Key Vault: ${secretName}`);
          return value;
        }
      } catch (error: any) {
        // Om secret inte finns i Key Vault, logga varning och fortsätt till fallback
        if (error.statusCode === 404) {
          this.logger.debug(
            `⚠️ Secret '${secretName}' hittades inte i Key Vault, använder fallback`
          );
        } else {
          this.logger.warn(
            `⚠️ Fel vid hämtning av secret '${secretName}' från Key Vault: ${error.message}`
          );
        }
      }
    }

    // Fallback till miljövariabel
    const envValue = this.configService.get<string>(secretName);
    if (envValue) {
      this.logger.debug(`✅ Hämtat secret från miljövariabel: ${secretName}`);
      return envValue;
    }

    // Om defaultValue finns, använd den
    if (defaultValue !== undefined) {
      this.logger.debug(
        `⚠️ Använder default-värde för secret: ${secretName}`
      );
      return defaultValue;
    }

    this.logger.warn(
      `⚠️ Secret '${secretName}' hittades varken i Key Vault eller miljövariabler`
    );
    return undefined;
  }

  /**
   * Hämta secret och kasta fel om det saknas
   */
  async getSecretOrThrow(secretName: string): Promise<string> {
    const value = await this.getSecret(secretName);
    if (!value) {
      throw new Error(
        `Secret '${secretName}' saknas i både Key Vault och miljövariabler`
      );
    }
    return value;
  }

  /**
   * Rensa cache (användbart efter secret-rotation)
   */
  clearCache(secretName?: string): void {
    if (secretName) {
      this.cache.delete(secretName);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Kontrollera om Key Vault är aktiverat
   */
  isEnabled(): boolean {
    return this.enabled;
  }
}
