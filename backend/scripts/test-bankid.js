// Test BankID direkt för att se om problemet är med vår kod eller BankID API:et
import pkg from 'bankid'

const { BankIdClientV6 } = pkg

const bankid = new BankIdClientV6({
  production: false
})

console.log('🧪 Testing BankID authenticate with minimal parameters...')

try {
  const result = await bankid.authenticate({
    endUserIp: '127.0.0.1'
  })
  
  console.log('✅ SUCCESS!')
  console.log('OrderRef:', result.orderRef)
  console.log('AutoStartToken:', result.autoStartToken)
  console.log('Has QR:', !!result.qr)
  console.log('QRStartToken:', result.qrStartToken)
  console.log('QRStartSecret:', result.qrStartSecret)
} catch (error) {
  console.error('❌ ERROR:', error.message)
  console.error('Error code:', error.code)
  console.error('Error details:', error.details)
  process.exit(1)
}

