import express from 'express'
import cors from 'cors'
import pkg from 'bankid'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { generateBankIDQR } from './qr-generator.js'

dotenv.config()

const { BankIdClientV6 } = pkg

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }))
app.use(express.json())

// Cache för att spara QrGenerator-instanser per orderRef
const qrGeneratorCache = new Map()

// Skapa BankID-klient V6 (använder certifikat från node_modules/bankid/cert/)
let bankid
try {
  // BankIdClientV6 hittar automatiskt certifikatet i node_modules/bankid/cert/
  // när production: false (testmiljö)
  bankid = new BankIdClientV6({
    production: false // Testmiljö - använder FPTestcert5_20240610.p12 automatiskt
  })
  
  console.log('✅ BankID-klient V6 skapad (använder test-certifikat från node_modules/bankid/cert/)')
} catch (error) {
  console.error('❌ Fel vid skapande av BankID-klient:', error.message)
  console.error('❌ Error stack:', error.stack)
  process.exit(1)
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'BankID Backend API',
    version: '1.0.0',
    endpoints: {
      'GET /api/bankid/ip': 'Get user IP',
      'POST /api/bankid/auth': 'Initiate BankID authentication',
      'POST /api/bankid/collect': 'Collect BankID status',
      'POST /api/bankid/signup': 'Sign up with BankID',
      'POST /api/bankid/link': 'Link BankID to account',
      'GET /api/bankid/status': 'Get BankID status',
      'POST /api/bankid/unlink': 'Unlink BankID'
    }
  })
})

// GET /api/bankid/ip
app.get('/api/bankid/ip', (req, res) => {
  // Hämta IP från olika källor
  let ip = req.ip || 
           req.headers['x-forwarded-for']?.split(',')[0] || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           '127.0.0.1'
  
  // Konvertera IPv6 localhost (::1) till IPv4
  if (ip === '::1' || ip === '::ffff:127.0.0.1') {
    ip = '127.0.0.1'
  }
  
  // Ta bort IPv6 prefix om det finns
  if (ip.startsWith('::ffff:')) {
    ip = ip.replace('::ffff:', '')
  }
  
  console.log('📍 IP request - detected IP:', ip)
  res.json({ ip })
})

// POST /api/bankid/auth
app.post('/api/bankid/auth', async (req, res) => {
  try {
    console.log('📥 BankID auth request received')
    console.log('📥 Request body:', JSON.stringify(req.body, null, 2))
    console.log('📥 Request body type:', typeof req.body)
    console.log('📥 Request body keys:', Object.keys(req.body || {}))
    
    const { personalNumber, endUserIp } = req.body || {}
    
    if (!endUserIp) {
      console.error('❌ Missing endUserIp in request body')
      return res.status(400).json({ message: 'endUserIp is required' })
    }
    
    // Normalisera IP-adress (konvertera ::1 till 127.0.0.1)
    let normalizedIp = String(endUserIp).trim()
    if (normalizedIp === '::1' || normalizedIp === '::ffff:127.0.0.1') {
      normalizedIp = '127.0.0.1'
    }
    if (normalizedIp.startsWith('::ffff:')) {
      normalizedIp = normalizedIp.replace('::ffff:', '')
    }
    
    console.log('🔐 Initiating BankID authentication')
    console.log('🔐 Original IP:', endUserIp)
    console.log('🔐 Normalized IP:', normalizedIp)
    console.log('📋 Personal number:', personalNumber || 'not provided')
    
    // Bygg parameter-objekt för BankID V6 - EXAKT som test-bankid.js
    const authParams = {
      endUserIp: normalizedIp
    }
    
    console.log('📤 Sending to BankID API (exact same as test):', JSON.stringify(authParams, null, 2))
    console.log('📤 AuthParams type:', typeof authParams)
    console.log('📤 AuthParams keys:', Object.keys(authParams))
    console.log('📤 endUserIp value:', authParams.endUserIp)
    console.log('📤 endUserIp type:', typeof authParams.endUserIp)
    console.log('📤 endUserIp === "127.0.0.1":', authParams.endUserIp === '127.0.0.1')
    
    try {
      console.log('🚀 Calling bankid.authenticate()...')
      const authResponse = await bankid.authenticate(authParams)
      console.log('✅ BankID auth successful:', { orderRef: authResponse.orderRef })
      console.log('✅ Response keys:', Object.keys(authResponse))
      console.log('✅ Has qrStartToken:', !!authResponse.qrStartToken)
      console.log('✅ Has qrStartSecret:', !!authResponse.qrStartSecret)
    
      // V6 returnerar QR-kod direkt, inte qrStartToken/qrStartSecret
      // Spara BankID's egen QrGenerator-instans för att använda senare
      // Detta säkerställer att vi använder exakt samma logik och starttid som BankID
      if (authResponse.qr) {
        // Spara QrGenerator-instansen i cache så vi kan använda den för att generera QR-koder
        qrGeneratorCache.set(authResponse.orderRef, authResponse.qr)
        
        // Rensa cache efter 60 sekunder (BankID's timeout)
        setTimeout(() => {
          qrGeneratorCache.delete(authResponse.orderRef)
        }, 60000)
      }
      
      res.json({
        orderRef: authResponse.orderRef,
        autoStartToken: authResponse.autoStartToken,
        qr: authResponse.qr ? {
          qrStartToken: authResponse.qrStartToken,
          qrStartSecret: authResponse.qrStartSecret
        } : undefined,
        // För bakåtkompatibilitet
        qrStartToken: authResponse.qrStartToken,
        qrStartSecret: authResponse.qrStartSecret
      })
    } catch (authError) {
      console.error('❌ BankID authenticate() threw error:', authError)
      console.error('❌ Error code:', authError.code)
      console.error('❌ Error details:', authError.details)
      throw authError
    }
  } catch (error) {
    console.error('❌ BankID auth error:', error)
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    res.status(400).json({ 
      message: error.message || error.toString() || 'Kunde inte initiera BankID-autentisering' 
    })
  }
})

// POST /api/bankid/collect
app.post('/api/bankid/collect', async (req, res) => {
  try {
    const { orderRef } = req.body
    if (!orderRef) {
      return res.status(400).json({ message: 'orderRef is required' })
    }
    const collectResponse = await bankid.collect({ orderRef })
    res.json(collectResponse)
  } catch (error) {
    console.error('BankID collect error:', error)
    res.status(400).json({ message: error.message })
  }
})

// POST /api/bankid/signup
app.post('/api/bankid/signup', async (req, res) => {
  try {
    const { personalNumber, name, email } = req.body
    
    // TODO: Implementera Supabase-användarskapande här
    // För nu, returnera success
    console.log('Signup request:', { personalNumber, name, email })
    
    res.json({
      success: true,
      message: 'Signup endpoint - implementera med Supabase senare'
    })
  } catch (error) {
    console.error('BankID signup error:', error)
    res.status(400).json({ message: error.message })
  }
})

// POST /api/bankid/link
app.post('/api/bankid/link', async (req, res) => {
  try {
    const { personalNumber, name } = req.body
    console.log('Link request:', { personalNumber, name })
    res.json({ success: true })
  } catch (error) {
    console.error('BankID link error:', error)
    res.status(400).json({ message: error.message })
  }
})

// GET /api/bankid/status
app.get('/api/bankid/status', async (req, res) => {
  try {
    // TODO: Implementera statuskontroll med Supabase
    res.json({ linked: false })
  } catch (error) {
    console.error('BankID status error:', error)
    res.status(400).json({ message: error.message })
  }
})

// POST /api/bankid/unlink
app.post('/api/bankid/unlink', async (req, res) => {
  try {
    // TODO: Implementera avkoppling med Supabase
    res.json({ success: true })
  } catch (error) {
    console.error('BankID unlink error:', error)
    res.status(400).json({ message: error.message })
  }
})

// POST /api/bankid/qr - Generera QR-kod
// Använd BankID's egen QrGenerator-instans för att generera QR-koder
app.post('/api/bankid/qr', async (req, res) => {
  try {
    const { orderRef } = req.body
    
    if (!orderRef) {
      return res.status(400).json({ 
        message: 'orderRef krävs' 
      })
    }
    
    // Hämta BankID's egen QrGenerator-instans från cache
    const qrGenerator = qrGeneratorCache.get(orderRef)
    
    if (!qrGenerator) {
      return res.status(404).json({ 
        message: 'QR-generator hittades inte. Starta autentisering först.' 
      })
    }
    
    // Använd BankID's egen generator för att hämta nuvarande QR-kod
    // Detta säkerställer att vi använder exakt samma logik och starttid
    console.log('🔄 Försöker generera QR-kod för orderRef:', orderRef)
    
    // Använd latestQrFromCache med QrGenerator-instansens cache
    // Detta är den rekommenderade metoden enligt BankID's dokumentation
    let qrCode = null
    
    try {
      const { QrGenerator } = await import('bankid/lib/qrgenerator.js')
      // Använd samma cache som QrGenerator-instansen använder
      qrCode = await QrGenerator.latestQrFromCache(orderRef, qrGenerator.cache)
      console.log('✅ Använder latestQrFromCache med QrGenerator-instansens cache')
    } catch (error) {
      console.warn('⚠️ latestQrFromCache misslyckades, använder nextQr:', error.message)
      // Fallback till nextQr
      const qrIterator = qrGenerator.nextQr(orderRef, { maxCycles: 1 })
      const qrResult = await qrIterator.next()
      
      if (!qrResult.value) {
        console.error('❌ QR-generator returnerade ingen QR-kod')
        console.error('❌ Iterator result:', qrResult)
        return res.status(500).json({ 
          message: 'Kunde inte generera QR-kod' 
        })
      }
      
      qrCode = qrResult.value
    }
    
    if (!qrCode) {
      console.error('❌ Ingen QR-kod kunde genereras')
      return res.status(500).json({ 
        message: 'Kunde inte generera QR-kod' 
      })
    }
    
    const qrParts = qrCode.split('.')
    console.log('📱 QR-kod genererad:', {
      length: qrCode.length,
      startsWith: qrCode.substring(0, 20),
      format: qrCode.startsWith('bankid.') ? '✅ Korrekt format' : '❌ Fel format',
      parts: qrParts.length,
      expectedParts: 4,
      token: qrParts[1]?.substring(0, 20) + '...',
      time: qrParts[2],
      hashLength: qrParts[3]?.length,
      fullQR: qrCode // För debugging
    })
    
    res.json({ qrCode })
  } catch (error) {
    console.error('QR generation error:', error)
    res.status(500).json({ message: error.message })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`✅ BankID Backend server running on http://localhost:${PORT}`)
  console.log(`📁 Ready to accept requests`)
})

