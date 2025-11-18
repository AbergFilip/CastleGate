// Test QR-kodgenerering direkt med BankID
import pkg from 'bankid'

const { BankIdClientV6 } = pkg

const bankid = new BankIdClientV6({
  production: false
})

console.log('🧪 Testing BankID QR code generation...')

try {
  const result = await bankid.authenticate({
    endUserIp: '127.0.0.1'
  })
  
  console.log('✅ Auth successful!')
  console.log('OrderRef:', result.orderRef)
  console.log('Has QR generator:', !!result.qr)
  
  if (result.qr) {
    console.log('\n📱 Generating QR codes...')
    let count = 0
    for await (const qrCode of result.qr.nextQr(result.orderRef, { timeout: 10 })) {
      count++
      console.log(`\nQR Code #${count}:`)
      console.log('Full QR string:', qrCode)
      console.log('First 50 chars:', qrCode.substring(0, 50))
      console.log('Format check:', qrCode.startsWith('bankid.'))
      
      // Testa att skanna denna QR-kod med BankID-appen
      console.log('\n💡 Skanna denna QR-kod med BankID-appen för att testa!')
      console.log('QR-kod:', qrCode)
      
      if (count >= 3) {
        console.log('\n✅ Tested 3 QR codes, stopping...')
        break
      }
      
      await new Promise(r => setTimeout(r, 2000))
    }
  } else {
    console.log('❌ No QR generator returned')
  }
} catch (error) {
  console.error('❌ ERROR:', error.message)
  console.error('Error code:', error.code)
  console.error('Error details:', error.details)
  process.exit(1)
}

