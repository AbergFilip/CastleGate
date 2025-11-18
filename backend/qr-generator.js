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
  const qrAuthCode = crypto
    .createHmac('sha256', qrStartSecret)
    .update(String(secondsSinceStart))
    .digest('hex')
  
  return `bankid.${qrStartToken}.${secondsSinceStart}.${qrAuthCode}`
}

