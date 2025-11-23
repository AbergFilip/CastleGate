// QR-kod generator för BankID (använder samma logik som bankid-paketet)
import crypto from 'crypto'

/**
 * Generera QR-kod sträng för BankID
 * @param {string} qrStartToken - Token från BankID
 * @param {string} qrStartSecret - Secret från BankID
 * @param {number} secondsSinceStart - Antal sekunder sedan autentisering startade
 * @returns {string} QR-kod sträng
 */
export function generateBankIDQR(qrStartToken, qrStartSecret, secondsSinceStart) {
  // Säkerställ att secondsSinceStart är ett heltal
  const seconds = Math.floor(secondsSinceStart)
  
  // Generera HMAC med SHA-256
  const qrAuthCode = crypto
    .createHmac('sha256', qrStartSecret)
    .update(String(seconds))
    .digest('hex')
  
  // QR-kod format: bankid.{token}.{seconds}.{hmac}
  const qrCode = `bankid.${qrStartToken}.${seconds}.${qrAuthCode}`
  
  return qrCode
}

