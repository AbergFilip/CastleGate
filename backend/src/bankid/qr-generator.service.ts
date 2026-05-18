import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class QrGeneratorService {
  /**
   * Generera QR-kod sträng för BankID
   * @param qrStartToken - Token från BankID
   * @param qrStartSecret - Secret från BankID
   * @param secondsSinceStart - Antal sekunder sedan autentisering startade
   * @returns QR-kod sträng
   */
  generateBankIDQR(
    qrStartToken: string,
    qrStartSecret: string,
    secondsSinceStart: number
  ): string {
    // Säkerställ att secondsSinceStart är ett heltal
    const seconds = Math.floor(secondsSinceStart);

    // Generera HMAC med SHA-256
    const qrAuthCode = crypto
      .createHmac('sha256', qrStartSecret)
      .update(String(seconds))
      .digest('hex');

    // QR-kod format: bankid.{token}.{seconds}.{hmac}
    const qrCode = `bankid.${qrStartToken}.${seconds}.${qrAuthCode}`;

    return qrCode;
  }
}

