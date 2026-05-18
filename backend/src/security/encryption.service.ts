import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';
import { KeyVaultService } from '../secrets/keyvault.service';

@Injectable()
export class EncryptionService {
  private readonly logger = new Logger(EncryptionService.name);
  private encryptionKey: Buffer | null = null;
  private encryptionKeyLoaded = false;
  private hashPepper: string | null = null;
  private hashPepperLoaded = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly keyVaultService: KeyVaultService
  ) {}

  private async getEncryptionKey(): Promise<Buffer> {
    if (this.encryptionKeyLoaded) {
      return this.encryptionKey as Buffer;
    }

    const keyValue =
      (await this.keyVaultService.getSecret('FIELD_ENCRYPTION_KEY')) ||
      this.configService.get<string>('FIELD_ENCRYPTION_KEY');

    this.encryptionKeyLoaded = true;

    if (!keyValue) {
      this.logger.error(
        'FIELD_ENCRYPTION_KEY saknas. Lägg till i Key Vault eller .env'
      );
      throw new Error('FIELD_ENCRYPTION_KEY is not configured');
    }

    const key = Buffer.from(keyValue, 'base64');
    if (key.length !== 32) {
      throw new Error(
        'FIELD_ENCRYPTION_KEY måste vara 32 bytes (base64-encoded)'
      );
    }

    this.encryptionKey = key;
    return this.encryptionKey;
  }

  private async getHashPepper(): Promise<string> {
    if (this.hashPepperLoaded) {
      return this.hashPepper || '';
    }

    const pepper =
      (await this.keyVaultService.getSecret('FIELD_HASH_PEPPER')) ||
      this.configService.get<string>('FIELD_HASH_PEPPER');

    this.hashPepperLoaded = true;
    this.hashPepper = pepper || null;

    if (!this.hashPepper) {
      this.logger.error(
        'FIELD_HASH_PEPPER saknas. Lägg till i Key Vault eller .env'
      );
      throw new Error('FIELD_HASH_PEPPER is not configured');
    }

    return this.hashPepper;
  }

  async encryptString(plainText: string): Promise<string> {
    const key = await this.getEncryptionKey();
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return [
      iv.toString('base64'),
      authTag.toString('base64'),
      encrypted.toString('base64'),
    ].join('.');
  }

  async decryptString(payload: string): Promise<string> {
    const key = await this.getEncryptionKey();
    const [ivB64, tagB64, dataB64] = payload.split('.');
    if (!ivB64 || !tagB64 || !dataB64) {
      throw new Error('Invalid encrypted payload');
    }

    const iv = Buffer.from(ivB64, 'base64');
    const tag = Buffer.from(tagB64, 'base64');
    const data = Buffer.from(dataB64, 'base64');

    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
    return decrypted.toString('utf8');
  }

  async hashValue(value: string, context: string): Promise<string> {
    const pepper = await this.getHashPepper();
    return createHash('sha256')
      .update(`${context}:${value}:${pepper}`)
      .digest('hex');
  }
}
