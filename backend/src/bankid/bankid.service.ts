import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BankIdClientV6 } from 'bankid';
import { QrGeneratorService } from './qr-generator.service';

interface QrGeneratorCache {
  qr?: any;
  qrStartToken: string;
  qrStartSecret: string;
  qrStartTime: number;
}

@Injectable()
export class BankidService implements OnModuleInit {
  private readonly logger = new Logger(BankidService.name);
  private bankid!: BankIdClientV6;
  private qrGeneratorCache = new Map<string, QrGeneratorCache>();

  constructor(
    private configService: ConfigService,
    private qrGeneratorService: QrGeneratorService
  ) {}

  onModuleInit() {
    try {
      const production = this.configService.get<string>('BANKID_PRODUCTION') === 'true';
      this.bankid = new BankIdClientV6({
        production: production || false,
      });
      this.logger.log(
        `✅ BankID-klient V6 skapad (${production ? 'production' : 'test'}-miljö)`
      );
    } catch (error) {
      this.logger.error('❌ Fel vid skapande av BankID-klient:', error instanceof Error ? error.message : String(error));
      this.logger.error('❌ Error stack:', error instanceof Error ? error.stack : undefined);
      throw error;
    }
  }

  /**
   * Hämta användarens IP-adress från request
   */
  getUserIp(req: any): string {
    let ip =
      req.ip ||
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      '127.0.0.1';

    // Konvertera IPv6 localhost (::1) till IPv4
    if (ip === '::1' || ip === '::ffff:127.0.0.1') {
      ip = '127.0.0.1';
    }

    // Ta bort IPv6 prefix om det finns
    if (ip.startsWith('::ffff:')) {
      ip = ip.replace('::ffff:', '');
    }

    return ip;
  }

  /**
   * Initiera BankID-autentisering
   */
  async authenticate(personalNumber: string | undefined, endUserIp: string) {
    this.logger.log('🔐 Initiating BankID authentication');
    this.logger.debug(`IP: ${endUserIp}, Personal number: ${personalNumber || 'not provided'}`);

    // Normalisera IP-adress
    let normalizedIp = String(endUserIp).trim();
    if (normalizedIp === '::1' || normalizedIp === '::ffff:127.0.0.1') {
      normalizedIp = '127.0.0.1';
    }
    if (normalizedIp.startsWith('::ffff:')) {
      normalizedIp = normalizedIp.replace('::ffff:', '');
    }

    const isProduction = process.env.NODE_ENV === 'production';
    const authParams: any = {
      endUserIp: isProduction ? normalizedIp : '127.0.0.1',
    };

    if (personalNumber) {
      authParams.requirement = {
        personalNumber: String(personalNumber).trim(),
      };
    }

    try {
      this.logger.debug(`Sending auth params to BankID: ${JSON.stringify(authParams)}`);
      const authResponse = await this.bankid.authenticate(authParams);
      this.logger.log(`✅ BankID auth successful: ${authResponse.orderRef.substring(0, 20)}...`);

      // Spara QR-generator data i cache
      const startTime = Date.now();
      const hasQRData =
        authResponse.qr || (authResponse.qrStartToken && authResponse.qrStartSecret);

      if (hasQRData) {
        this.qrGeneratorCache.set(authResponse.orderRef, {
          qr: authResponse.qr,
          qrStartToken: authResponse.qrStartToken,
          qrStartSecret: authResponse.qrStartSecret,
          qrStartTime: startTime,
        });

        // Rensa cache efter 60 sekunder (BankID's timeout)
        setTimeout(() => {
          this.qrGeneratorCache.delete(authResponse.orderRef);
          this.logger.debug(
            `🗑️ QR-generator borttagen från cache: ${authResponse.orderRef.substring(0, 20)}...`
          );
        }, 60000);
      }

      return {
        orderRef: authResponse.orderRef,
        autoStartToken: authResponse.autoStartToken,
        qrStartToken: authResponse.qrStartToken,
        qrStartSecret: authResponse.qrStartSecret,
        qrStartTime: startTime,
      };
    } catch (error) {
      this.logger.error('❌ BankID authenticate() error:', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  /**
   * Kontrollera status för BankID-autentisering
   */
  async collect(orderRef: string) {
    try {
      return await this.bankid.collect({ orderRef });
    } catch (error) {
      this.logger.error('❌ BankID collect() error:', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  /**
   * Generera QR-kod för BankID
   */
  generateQR(orderRef: string): string | null {
    const cached = this.qrGeneratorCache.get(orderRef);
    if (!cached) {
      this.logger.warn(`⚠️ QR-generator inte hittad i cache för orderRef: ${orderRef.substring(0, 20)}...`);
      return null;
    }

    const secondsSinceStart = Math.floor((Date.now() - cached.qrStartTime) / 1000);
    return this.qrGeneratorService.generateBankIDQR(
      cached.qrStartToken,
      cached.qrStartSecret,
      secondsSinceStart
    );
  }

  /**
   * Avbryt BankID-autentisering
   */
  async cancel(orderRef: string) {
    try {
      await this.bankid.cancel({ orderRef });
      this.qrGeneratorCache.delete(orderRef);
      return { success: true };
    } catch (error) {
      this.logger.error('❌ BankID cancel() error:', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }
}

