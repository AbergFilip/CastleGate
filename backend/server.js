import express from 'express'
import cors from 'cors'
import pkg from 'bankid'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { generateBankIDQR } from './qr-generator.js'

dotenv.config()

// Supabase-klient för backend
const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
let supabase = null

if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  console.log('✅ Supabase-klient skapad för backend')
} else {
  console.warn('⚠️ Supabase-credentials saknas. BankID signup/signin kommer inte fungera korrekt.')
  console.warn('⚠️ Lägg till SUPABASE_URL och SUPABASE_SERVICE_ROLE_KEY i .env-filen')
}

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
    
      // V6 returnerar QR-kod direkt via qr-objektet
      // Spara BankID's egen QrGenerator-instans för att använda senare
      // Detta säkerställer att vi använder exakt samma logik och starttid som BankID
      const startTime = authResponse.qrStartTime || Date.now()
      
      console.log('📱 QR Generator data:', {
        hasQr: !!authResponse.qr,
        qrStartToken: authResponse.qrStartToken ? 'present' : 'missing',
        qrStartSecret: authResponse.qrStartSecret ? 'present' : 'missing',
        qrStartTime: startTime,
        qrStartTimeFromResponse: authResponse.qrStartTime,
        orderRef: authResponse.orderRef
      })
      
      // Spara QrGenerator-instansen i cache så vi kan använda den för att generera QR-koder
      // Spara om vi har antingen qr-objektet ELLER token+secret
      const hasQRData = authResponse.qr || (authResponse.qrStartToken && authResponse.qrStartSecret)
      
      if (hasQRData) {
        qrGeneratorCache.set(authResponse.orderRef, {
          qr: authResponse.qr, // Kan vara undefined
          qrStartToken: authResponse.qrStartToken,
          qrStartSecret: authResponse.qrStartSecret,
          qrStartTime: startTime
        })
        
        console.log('✅ QR-generator sparad i cache för orderRef:', authResponse.orderRef.substring(0, 20) + '...')
        console.log('✅ Cache data:', {
          hasQr: !!authResponse.qr,
          hasToken: !!authResponse.qrStartToken,
          hasSecret: !!authResponse.qrStartSecret,
          hasTime: !!startTime
        })
        
        // Rensa cache efter 60 sekunder (BankID's timeout)
        setTimeout(() => {
          qrGeneratorCache.delete(authResponse.orderRef)
          console.log('🗑️ QR-generator borttagen från cache för orderRef:', authResponse.orderRef.substring(0, 20) + '...')
        }, 60000)
      } else {
        console.warn('⚠️ QR-generator inte sparad i cache - saknar både qr-objekt och token/secret')
        console.warn('⚠️ Auth response keys:', Object.keys(authResponse))
      }
      
      res.json({
        orderRef: authResponse.orderRef,
        autoStartToken: authResponse.autoStartToken,
        qrStartToken: authResponse.qrStartToken,
        qrStartSecret: authResponse.qrStartSecret,
        qrStartTime: authResponse.qrStartTime || Date.now()
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
    
    if (!supabase) {
      return res.status(500).json({ 
        success: false,
        message: 'Supabase är inte konfigurerad. Kontrollera miljövariabler.' 
      })
    }
    
    console.log('Signup request:', { personalNumber, name, email })
    
    // Använd personnummer som email om email inte anges
    let userEmail = email || `${personalNumber}@bankid.local`
    
    // Kontrollera om användaren redan finns (via personalNumber i users-tabellen)
    const { data: existingUser, error: existingUserError } = await supabase
      .from('users')
      .select('id, email, name')
      .eq('personal_number', personalNumber)
      .single()
    
    console.log('Signup - Existing user check:', { 
      found: !!existingUser, 
      error: existingUserError?.message,
      personalNumber 
    })
    
    // Kontrollera också om användaren finns i auth.users via email eller personnummer
    let existingAuthUser = null
    try {
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
      if (!listError && users) {
        // Försök hitta användare med samma email eller personnummer i metadata
        existingAuthUser = users.find(u => 
          u.email === userEmail || 
          u.user_metadata?.personal_number === personalNumber
        )
        
        if (existingAuthUser) {
          console.log('⚠️ Hittade befintlig auth-användare:', {
            id: existingAuthUser.id,
            email: existingAuthUser.email,
            hasPersonalNumber: !!existingAuthUser.user_metadata?.personal_number
          })
        }
      }
    } catch (listErr) {
      console.warn('Kunde inte lista användare:', listErr)
    }
    
    let authData = null
    let insertedUser = null // Definiera insertedUser tidigt
    
    // Om användaren redan finns i users-tabellen ELLER i auth.users, använd den
    if (existingUser || existingAuthUser) {
      // Använd existingUser om den finns, annars skapa en från existingAuthUser
      const userToUse = existingUser || {
        id: existingAuthUser.id,
        email: existingAuthUser.email,
        name: existingAuthUser.user_metadata?.name || name
      }
      
      console.log('⚠️ Användare finns redan, använder befintlig användare:', {
        id: userToUse.id,
        email: userToUse.email,
        fromUsers: !!existingUser,
        fromAuth: !!existingAuthUser
      })
      
      // Hämta eller använd auth-användaren
      if (existingAuthUser) {
        authData = { user: existingAuthUser }
        console.log('✅ Använder befintlig auth-användare')
      } else if (existingUser) {
        const { data: authUser, error: getUserError } = await supabase.auth.admin.getUserById(existingUser.id)
        
        if (authUser && !getUserError) {
          authData = { user: authUser.user }
          console.log('✅ Auth-användare hittad för befintligt konto')
        } else {
          console.error('⚠️ Användare finns i users men inte i auth')
          return res.status(400).json({
            success: false,
            message: 'Konto finns redan men är i felaktigt tillstånd. Kontakta support.'
          })
        }
      }
      
      // Uppdatera users-tabellen med BankID-info
      const userIdToUpdate = existingUser?.id || existingAuthUser?.id
      if (userIdToUpdate) {
        const { error: updateError } = await supabase
          .from('users')
          .upsert({
            id: userIdToUpdate,
            email: userToUse.email,
            name: name || userToUse.name,
            personal_number: personalNumber,
            bankid_linked: true,
            bankid_linked_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          })
        
        if (updateError) {
          console.error('Error updating user:', updateError)
          return res.status(400).json({
            success: false,
            message: 'Kunde inte uppdatera användardata: ' + updateError.message
          })
        }
        
        console.log('✅ Användare uppdaterad med BankID-koppling')
        
        // Hämta den uppdaterade användaren
        const { data: updatedUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userIdToUpdate)
          .single()
        
        if (updatedUser && !fetchError) {
          insertedUser = updatedUser
        } else if (existingUser) {
          // Fallback: använd existingUser om vi inte kan hämta den uppdaterade
          insertedUser = existingUser
        }
      }
    } else {
      // Skapa ny användare i Supabase Auth
      console.log('🆕 Skapar ny användare med email:', userEmail)
      
      const { data: newAuthData, error: createAuthError } = await supabase.auth.admin.createUser({
        email: userEmail,
        email_confirm: true,
        user_metadata: {
          name: name,
          personal_number: personalNumber,
          bankid_linked: true
        }
      })
      
      if (createAuthError) {
        console.error('❌ Supabase auth error:', createAuthError)
        console.error('❌ Error message:', createAuthError.message)
        console.error('❌ Error code:', createAuthError.status)
        
        // Om email redan används, försök hitta användaren och använd den istället
        if (createAuthError.message?.includes('already registered') || 
            createAuthError.message?.includes('already exists') ||
            createAuthError.status === 422) {
          console.log('⚠️ Email redan registrerad, försöker hitta användare...')
          
          try {
            const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
            if (!listError && users) {
              const existingAuthUserFound = users.find(u => 
                u.email === userEmail || 
                u.user_metadata?.personal_number === personalNumber
              )
              
              if (existingAuthUserFound) {
                console.log('✅ Hittade befintlig auth-användare, använder den:', {
                  id: existingAuthUserFound.id,
                  email: existingAuthUserFound.email
                })
                authData = { user: existingAuthUserFound }
                userEmail = existingAuthUserFound.email // Uppdatera userEmail
              } else {
                // Generera unik email om vi inte hittar användaren
                userEmail = `${personalNumber}-${Date.now()}@bankid.local`
                console.log(`⚠️ Kunde inte hitta användare, försöker med ny email: ${userEmail}`)
                
                // Försök skapa med ny email
                const { data: retryAuthData, error: retryError } = await supabase.auth.admin.createUser({
                  email: userEmail,
                  email_confirm: true,
                  user_metadata: {
                    name: name,
                    personal_number: personalNumber,
                    bankid_linked: true
                  }
                })
                
                if (retryError) {
                  return res.status(400).json({
                    success: false,
                    message: 'Kunde inte skapa användare: ' + retryError.message
                  })
                }
                
                authData = retryAuthData
              }
            } else {
              return res.status(400).json({
                success: false,
                message: 'Kunde inte skapa användare: ' + createAuthError.message
              })
            }
          } catch (listErr) {
            console.error('Error listing users:', listErr)
            return res.status(400).json({
              success: false,
              message: 'Kunde inte skapa användare: ' + createAuthError.message
            })
          }
        } else {
          return res.status(400).json({
            success: false,
            message: createAuthError.message || 'Kunde inte skapa användare'
          })
        }
      } else {
        authData = newAuthData
        console.log('✅ Ny användare skapad i auth:', authData.user.id)
      }
      
      if (!authData) {
        return res.status(400).json({
          success: false,
          message: 'Kunde inte skapa användare'
        })
      }
      
      // Spara BankID-koppling i databasen (använd upsert för att undvika duplicate key errors)
      const { data: upsertedUser, error: dbError } = await supabase
        .from('users')
        .upsert({
          id: authData.user.id,
          email: userEmail,
          name: name,
          personal_number: personalNumber,
          bankid_linked: true,
          bankid_linked_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })
        .select()
        .single()
      
      if (dbError) {
        console.error('Database error:', dbError)
        console.error('Database error details:', JSON.stringify(dbError, null, 2))
        
        // Om det är ett duplicate key error, försök hämta den befintliga användaren
        if (dbError.message?.includes('duplicate key') || dbError.code === '23505') {
          console.log('⚠️ Duplicate key error, försöker hämta befintlig användare...')
          const { data: existingUserData, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single()
          
          if (existingUserData && !fetchError) {
            console.log('✅ Hittade befintlig användare i databasen')
            insertedUser = existingUserData
            // Uppdatera med BankID-info
            const { error: updateError } = await supabase
              .from('users')
              .update({
                bankid_linked: true,
                bankid_linked_at: new Date().toISOString(),
                name: name
              })
              .eq('id', authData.user.id)
            
            if (updateError) {
              console.error('Error updating existing user:', updateError)
              return res.status(400).json({
                success: false,
                message: 'Kunde inte uppdatera användardata: ' + updateError.message
              })
            }
          } else {
            // Om vi inte kan hämta användaren, ta bort auth-användaren
            await supabase.auth.admin.deleteUser(authData.user.id)
            return res.status(400).json({
              success: false,
              message: 'Kunde inte spara användardata: ' + dbError.message
            })
          }
        } else {
          // Ta bort användaren från auth om databasinsertion misslyckades
          await supabase.auth.admin.deleteUser(authData.user.id)
          return res.status(400).json({
            success: false,
            message: 'Kunde inte spara användardata: ' + dbError.message
          })
        }
      } else {
        insertedUser = upsertedUser
        console.log('✅ Användare sparad i users-tabellen:', {
          id: insertedUser?.id,
          email: insertedUser?.email,
          personal_number: insertedUser?.personal_number
        })
      }
    }
    
    // Hämta användaren för att säkerställa att vi har korrekt data
    if (!insertedUser && authData?.user?.id) {
      const { data: fetchedUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single()
      
      if (fetchedUser && !fetchError) {
        insertedUser = fetchedUser
      }
    }
    
    console.log('✅ Användare sparad i users-tabellen:', {
      id: insertedUser?.id || authData?.user?.id,
      email: insertedUser?.email || userEmail,
      personal_number: insertedUser?.personal_number || personalNumber
    })
    
    // Generera magic link för att skapa session direkt efter signup
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: userEmail,
      options: {
        redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback`
      }
    })
    
    console.log('✅ Användare skapad:', authData.user.id)
    
    // Extrahera tokens från magic link om den genererades
    let token = null
    let tokenHash = null
    let actionLink = null
    
    if (linkData && !linkError) {
      const url = new URL(linkData.properties.action_link)
      token = url.searchParams.get('token')
      tokenHash = url.searchParams.get('token_hash')
      actionLink = linkData.properties.action_link
    }
    
    res.json({
      success: true,
      userId: authData.user.id,
      email: userEmail,
      name: name,
      token: token, // Magic link token för session
      tokenHash: tokenHash,
      actionLink: actionLink,
      message: 'Konto skapat framgångsrikt'
    })
  } catch (error) {
    console.error('BankID signup error:', error)
    res.status(400).json({ 
      success: false,
      message: error.message || 'Ett fel uppstod vid registrering' 
    })
  }
})

// POST /api/bankid/signin
app.post('/api/bankid/signin', async (req, res) => {
  try {
    const { personalNumber, name } = req.body
    
    if (!supabase) {
      return res.status(500).json({ 
        success: false,
        message: 'Supabase är inte konfigurerad. Kontrollera miljövariabler.' 
      })
    }
    
    console.log('Signin request:', { personalNumber, name })
    
    // Hitta användare via personalNumber i users-tabellen
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, name, personal_number')
      .eq('personal_number', personalNumber)
      .single()
    
    console.log('Signin - User lookup result:', { 
      found: !!user, 
      error: userError?.message,
      personalNumber 
    })
    
    if (userError || !user) {
      // Om kontot inte finns, skapa det automatiskt (samma som signup)
      console.log('⚠️ Användare hittades inte, skapar automatiskt...')
      
      const userEmail = `${personalNumber}@bankid.local`
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userEmail,
        email_confirm: true,
        user_metadata: {
          name: name,
          personal_number: personalNumber,
          bankid_linked: true
        }
      })
      
      if (authError) {
        console.error('Auto-signup auth error:', authError)
        return res.status(400).json({
          success: false,
          message: authError.message || 'Kunde inte skapa konto'
        })
      }
      
      // Spara i users-tabellen
      const { error: dbError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: userEmail,
          name: name,
          personal_number: personalNumber,
          bankid_linked: true,
          bankid_linked_at: new Date().toISOString()
        })
      
      if (dbError) {
        console.error('Auto-signup database error:', dbError)
        await supabase.auth.admin.deleteUser(authData.user.id)
        return res.status(400).json({
          success: false,
          message: 'Kunde inte spara användardata'
        })
      }
      
      console.log('✅ Användare skapad automatiskt:', authData.user.id)
      
      // Använd den nya användaren
      const newUser = {
        id: authData.user.id,
        email: userEmail,
        name: name,
        personal_number: personalNumber
      }
      
      // Generera magic link för session
      const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: userEmail,
        options: {
          redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback`
        }
      })
      
      if (linkError || !linkData) {
        return res.json({
          success: true,
          userId: newUser.id,
          email: newUser.email,
          name: newUser.name,
          message: 'Konto skapat och inloggning lyckades (fallback mode)'
        })
      }
      
      const url = new URL(linkData.properties.action_link)
      const token = url.searchParams.get('token')
      const tokenHash = url.searchParams.get('token_hash')
      
      return res.json({
        success: true,
        userId: newUser.id,
        email: newUser.email,
        name: newUser.name,
        token: token,
        tokenHash: tokenHash,
        actionLink: linkData.properties.action_link,
        message: 'Konto skapat och inloggning lyckades'
      })
    }
    
    // Hämta användaren från Supabase Auth för att skapa session
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(user.id)
    
    if (authError || !authUser) {
      console.error('Auth user error:', authError)
      return res.status(400).json({
        success: false,
        message: 'Kunde inte hämta användarinformation'
      })
    }
    
    // Skapa en session genom att använda Supabase admin API
    // Vi genererar en magic link och extraherar tokens från den
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: user.email,
      options: {
        redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback`
      }
    })
    
    if (linkError || !linkData) {
      console.error('Link generation error:', linkError)
      // Fallback: returnera user info och låt frontend hantera session
      console.log('⚠️ Kunde inte generera session link, använder fallback')
      return res.json({
        success: true,
        userId: user.id,
        email: user.email,
        name: user.name,
        message: 'Inloggning lyckades (fallback mode)'
      })
    }
    
    // Extrahera tokens från magic link URL
    // Magic link format: https://...?token=...&type=magiclink
    const url = new URL(linkData.properties.action_link)
    const token = url.searchParams.get('token')
    const tokenHash = url.searchParams.get('token_hash')
    
    // Skapa session med tokens
    // Notera: Vi använder admin API för att skapa session direkt
    // Detta kräver att vi använder Supabase's JWT signing
    console.log('✅ Användare inloggad:', user.id)
    
    res.json({
      success: true,
      userId: user.id,
      email: user.email,
      name: user.name,
      token: token, // Magic link token som frontend kan använda
      tokenHash: tokenHash,
      actionLink: linkData.properties.action_link, // Fullständig magic link
      message: 'Inloggning lyckades'
    })
  } catch (error) {
    console.error('BankID signin error:', error)
    res.status(400).json({ 
      success: false,
      message: error.message || 'Ett fel uppstod vid inloggning' 
    })
  }
})

// POST /api/bankid/link
app.post('/api/bankid/link', async (req, res) => {
  try {
    const { personalNumber, name } = req.body
    
    if (!supabase) {
      return res.status(500).json({ 
        success: false,
        message: 'Supabase är inte konfigurerad' 
      })
    }
    
    console.log('Link request:', { personalNumber, name })
    
    // TODO: Implementera koppling av BankID till befintligt konto
    // Detta kräver att vi vet vilken användare som är inloggad
    // Vi behöver en session token eller user ID från request
    
    res.json({ success: true })
  } catch (error) {
    console.error('BankID link error:', error)
    res.status(400).json({ 
      success: false,
      message: error.message 
    })
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
    const cachedData = qrGeneratorCache.get(orderRef)
    
    if (!cachedData) {
      console.error('❌ QR-generator hittades inte i cache för orderRef:', orderRef.substring(0, 20) + '...')
      return res.status(404).json({ 
        message: 'QR-generator hittades inte. Starta autentisering först.' 
      })
    }
    
    // Kontrollera om vi har minst token och secret (qr-objektet kan saknas)
    if (!cachedData.qrStartToken || !cachedData.qrStartSecret) {
      console.error('❌ QR-generator saknar token eller secret för orderRef:', orderRef.substring(0, 20) + '...')
      return res.status(404).json({ 
        message: 'QR-generator saknar nödvändig data. Starta autentisering först.' 
      })
    }
    
    const { qr: qrGenerator, qrStartToken, qrStartSecret, qrStartTime } = cachedData
    
    // Använd BankID's egen generator för att hämta nuvarande QR-kod
    // Detta säkerställer att vi använder exakt samma logik och starttid
    console.log('🔄 Försöker generera QR-kod för orderRef:', orderRef.substring(0, 20) + '...')
    console.log('🔄 Cache data:', {
      hasQr: !!qrGenerator,
      hasToken: !!qrStartToken,
      hasSecret: !!qrStartSecret,
      hasTime: !!qrStartTime
    })
    
    // Använd QrGenerator-instansens nextQr-metod för att få nuvarande QR-kod
    let qrCode = null
    
    // Om vi har qr-objektet, försök använda det först
    if (qrGenerator) {
      try {
        // Använd nextQr för att få nästa QR-kod i sekvensen
        // Detta ger oss den korrekta QR-koden baserat på nuvarande tid
        const qrIterator = qrGenerator.nextQr(orderRef, { maxCycles: 1 })
        const qrResult = await qrIterator.next()
        
        if (qrResult.value) {
          qrCode = qrResult.value
          console.log('✅ QR-kod genererad via nextQr')
        } else {
          // Fallback: Använd latestQrFromCache om nextQr inte fungerar
          const { QrGenerator } = await import('bankid/lib/qrgenerator.js')
          qrCode = await QrGenerator.latestQrFromCache(orderRef, qrGenerator.cache)
          console.log('✅ QR-kod genererad via latestQrFromCache (fallback)')
        }
      } catch (error) {
        console.error('❌ Error using qrGenerator:', error.message)
        // Fortsätt till manuell generering
      }
    }
    
    // Om qr-objektet saknas eller om det misslyckades, använd manuell generering
    if (!qrCode && qrStartToken && qrStartSecret && qrStartTime) {
      try {
        // Beräkna sekunder sedan start (använd Math.floor för att få heltal)
        const now = Date.now()
        const secondsSinceStart = Math.floor((now - qrStartTime) / 1000)
        
        console.log('⚠️ Använder manuell QR-generering:', {
          now,
          qrStartTime,
          secondsSinceStart,
          hasToken: !!qrStartToken,
          hasSecret: !!qrStartSecret
        })
        
        const { generateBankIDQR } = await import('./qr-generator.js')
        qrCode = generateBankIDQR(qrStartToken, qrStartSecret, secondsSinceStart)
        console.log('✅ QR-kod genererad manuellt')
      } catch (error) {
        console.error('❌ Error in manual QR generation:', error.message, error.stack)
        return res.status(500).json({ 
          message: 'Kunde inte generera QR-kod: ' + error.message 
        })
      }
    }
    
    if (!qrCode) {
      console.error('❌ Saknar data för QR-generering:', {
        hasToken: !!qrStartToken,
        hasSecret: !!qrStartSecret,
        hasTime: !!qrStartTime,
        hasQrGenerator: !!qrGenerator
      })
      return res.status(500).json({ 
        message: 'Kunde inte generera QR-kod: Saknar nödvändig data' 
      })
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

