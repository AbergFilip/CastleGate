import { useState, useEffect, useRef, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getMyProfile, updateMyProfile } from '../lib/network'
import { clearAllTestData, isTestDataToolsEnabled } from '../lib/test-data'
import { ArrowLeftIcon } from '../components/Icons'

function Profile() {
  const { user, signOut } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [clearingTestData, setClearingTestData] = useState(false)
  const [testDataMessage, setTestDataMessage] = useState<string | null>(null)

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    personal_number: '',
    address: '',
    postal_code: '',
    city: '',
    country: 'Sverige',
    bio: '',
    avatar_url: '',
    profile_visibility: 'public' as 'public' | 'friends' | 'private',
    allow_friend_requests: true,
    show_email: false,
    show_phone: false,
    show_address: false,
  })

  const loadingRef = useRef(false)
  const hasLoadedRef = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setLoading(false)
        hasLoadedRef.current = false
        return
      }

      // Om vi redan har laddat profilen för denna användare, hoppa över
      if (hasLoadedRef.current && loadingRef.current) {
        return
      }

      // Förhindra flera samtidiga requests
      if (loadingRef.current) {
        return
      }

      // Avbryt tidigare request om den finns
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      loadingRef.current = true
      setLoading(true)

      const abortController = new AbortController()
      abortControllerRef.current = abortController

      try {
        // Använd backend API istället för direkt Supabase-anrop
        const data = await getMyProfile()

        // Kontrollera om requesten avbröts
        if (abortController.signal.aborted) {
          return
        }

        if (data) {
          setProfileData({
            name: data.name || '',
            email: data.email || user.email || '',
            phone: data.phone || '',
            personal_number: data.personal_number || '',
            address: data.address || '',
            postal_code: data.postal_code || '',
            city: data.city || '',
            country: data.country || 'Sverige',
            bio: data.bio || '',
            avatar_url: data.avatar_url || '',
            profile_visibility: data.profile_visibility || 'public',
            allow_friend_requests: data.allow_friend_requests !== false,
            show_email: data.show_email || false,
            show_phone: data.show_phone || false,
            show_address: data.show_address || false,
          })
        }
        setLoading(false)
        hasLoadedRef.current = true
      } catch (err) {
        // Kontrollera om requesten avbröts
        if (abortController.signal.aborted) {
          return
        }

        const errMsg = err instanceof Error ? err.message : undefined
        // Om det är timeout eller nätverksfel, använd fallback data tyst
        if (errMsg?.includes('Timeout') ||
            errMsg?.includes('ERR_INSUFFICIENT_RESOURCES') ||
            errMsg?.includes('Failed to fetch') ||
            errMsg?.includes('AbortError')) {
          // Använd fallback data tyst
          setProfileData({
            name: user.user_metadata?.name || user.email?.split('@')[0] || '',
            email: user.email || '',
            phone: '',
            personal_number: '',
            address: '',
            postal_code: '',
            city: '',
            country: 'Sverige',
            bio: '',
            avatar_url: '',
            profile_visibility: 'public',
            allow_friend_requests: true,
            show_email: false,
            show_phone: false,
            show_address: false,
          })
          setLoading(false)
          hasLoadedRef.current = true
        } else {
          // Andra fel - visa felmeddelande
          console.error('Unexpected error:', err)
          setError('Ett oväntat fel uppstod')
          setLoading(false)
        }
      } finally {
        if (!abortController.signal.aborted) {
          loadingRef.current = false
        }
      }
    }

    loadProfile()

    // Cleanup: avbryt request om komponenten unmountas eller user ändras
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      loadingRef.current = false
    }
  }, [user?.id]) // Använd user.id istället för hela user-objektet

  const handleInputChange = (field: string, value: string | boolean) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
    setSuccess(false)
    setError(null)
  }

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    if (!user) {
      setError('Du är inte inloggad')
      setSaving(false)
      return
    }

    try {
      // Använd backend API för att uppdatera profilen
      const updateData: any = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone || null,
        address: profileData.address || null,
        postal_code: profileData.postal_code || null,
        city: profileData.city || null,
        country: profileData.country || 'Sverige',
        bio: profileData.bio || null,
        avatar_url: profileData.avatar_url || null,
        profile_visibility: profileData.profile_visibility,
        allow_friend_requests: profileData.allow_friend_requests,
        show_email: profileData.show_email,
        show_phone: profileData.show_phone,
        show_address: profileData.show_address,
      }

      // Lägg till personnummer om det finns
      if (profileData.personal_number && profileData.personal_number.trim() !== '') {
        updateData.personal_number = profileData.personal_number
      }

      try {
        await updateMyProfile(updateData)
        setSuccess(true)
        setIsEditing(false)
        setSaving(false)
        setTimeout(() => setSuccess(false), 3000)
      } catch (updateError: any) {
        console.error('Update error:', updateError)
        const errorMessage = updateError.message || 'Kunde inte spara ändringar. Försök igen.'
        setError(errorMessage)
        setSaving(false)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('Ett oväntat fel uppstod. Försök igen.')
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    if (window.confirm('Är du säker på att du vill logga ut?')) {
      await signOut()
      // Vänta lite för att säkerställa att auth state är uppdaterad
      await new Promise(resolve => setTimeout(resolve, 100))
      // Navigera till root och använd replace för att förhindra back-navigation
      window.location.href = '/'
    }
  }

  const handleClearTestData = async () => {
    setTestDataMessage(null)
    const msg =
      'Detta tar bort all synkad data: bankkonton, kort, lån, investeringar, fordon, båtar, försäkringar, fastigheter, dokument, nätverk, meddelanden m.m. Din profil och inloggning behålls.\n\nFortsätt?'
    if (!window.confirm(msg)) return
    if (!window.confirm('Sista chansen – rensa all testdata nu?')) return
    setClearingTestData(true)
    try {
      const r = await clearAllTestData()
      setTestDataMessage(`Rensat (${r.totalRows} rader totalt). Ladda om sidor för att se tomma listor.`)
    } catch (e) {
      setTestDataMessage(e instanceof Error ? e.message : 'Kunde inte rensa data.')
    } finally {
      setClearingTestData(false)
    }
  }

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#F5F5F5',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '4px solid #E6E6E6',
              borderTop: '4px solid #146D7B',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
            }}
          />
          <p style={{ color: '#4F4F4F', fontSize: '16px' }}>Laddar profil...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        background: '#FFFFFF',
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '196px',
          background: 'linear-gradient(180deg, #146D7B 0%, #1C9FB4 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: '48px',
          boxSizing: 'border-box',
        }}
      >
        <Link
          to="/home"
          style={{
            position: 'absolute',
            left: '16px',
            top: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.2)',
            textDecoration: 'none',
          }}
        >
          <ArrowLeftIcon width={20} height={20} color="#FFFFFF" />
        </Link>

        {/* Profile Avatar */}
        <div
          style={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F7FBFC 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.16)',
            border: '4px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <span
            style={{
              fontSize: '36px',
              fontWeight: 700,
              color: '#146D7B',
              textTransform: 'uppercase',
            }}
          >
            {profileData.name
              ? profileData.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
              : user?.email?.[0].toUpperCase() || 'U'}
          </span>
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: 700,
            color: '#FFFFFF',
            marginBottom: '4px',
          }}
        >
          {profileData.name || 'Min profil'}
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)' }}>
          {profileData.email || user?.email}
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 16px 120px', maxWidth: 'calc(100% - 32px)', margin: '0 auto' }}>
        {error && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#FEE',
              border: '1px solid #FCC',
              borderRadius: '8px',
              color: '#C33',
              fontSize: '14px',
              marginBottom: '24px',
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#EFE',
              border: '1px solid #CFC',
              borderRadius: '8px',
              color: '#3C3',
              fontSize: '14px',
              marginBottom: '24px',
            }}
          >
            Profil uppdaterad!
          </div>
        )}

        {!isEditing ? (
          <>
            {/* View Mode */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                marginBottom: '32px',
              }}
            >
              <div
                style={{
                  background: '#F7FBFC',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid #E6F1F4',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 16px 0',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#146D7B',
                  }}
                >
                  Personlig information
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#767676', fontWeight: 600 }}>
                      Namn
                    </span>
                    <p style={{ margin: '4px 0 0 0', fontSize: '16px', color: '#2A2A2A' }}>
                      {profileData.name || 'Ej angivet'}
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#767676', fontWeight: 600 }}>
                      E-post
                    </span>
                    <p style={{ margin: '4px 0 0 0', fontSize: '16px', color: '#2A2A2A' }}>
                      {profileData.email || user?.email || 'Ej angivet'}
                    </p>
                  </div>
                  {profileData.phone && (
                    <div>
                      <span style={{ fontSize: '12px', color: '#767676', fontWeight: 600 }}>
                        Telefon
                      </span>
                      <p style={{ margin: '4px 0 0 0', fontSize: '16px', color: '#2A2A2A' }}>
                        {profileData.phone}
                      </p>
                    </div>
                  )}
                  {profileData.personal_number && (
                    <div>
                      <span style={{ fontSize: '12px', color: '#767676', fontWeight: 600 }}>
                        Personnummer
                      </span>
                      <p style={{ margin: '4px 0 0 0', fontSize: '16px', color: '#2A2A2A' }}>
                        {profileData.personal_number}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {(profileData.address || profileData.city || profileData.postal_code) && (
                <div
                  style={{
                    background: '#F7FBFC',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid #E6F1F4',
                  }}
                >
                  <h3
                    style={{
                      margin: '0 0 16px 0',
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#146D7B',
                    }}
                  >
                    Adress
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {profileData.address && (
                      <div>
                        <span style={{ fontSize: '12px', color: '#767676', fontWeight: 600 }}>
                          Gatuadress
                        </span>
                        <p style={{ margin: '4px 0 0 0', fontSize: '16px', color: '#2A2A2A' }}>
                          {profileData.address}
                        </p>
                      </div>
                    )}
                    {(profileData.postal_code || profileData.city) && (
                      <div>
                        <span style={{ fontSize: '12px', color: '#767676', fontWeight: 600 }}>
                          Postnummer & Stad
                        </span>
                        <p style={{ margin: '4px 0 0 0', fontSize: '16px', color: '#2A2A2A' }}>
                          {[profileData.postal_code, profileData.city].filter(Boolean).join(' ')}
                        </p>
                      </div>
                    )}
                    {profileData.country && (
                      <div>
                        <span style={{ fontSize: '12px', color: '#767676', fontWeight: 600 }}>
                          Land
                        </span>
                        <p style={{ margin: '4px 0 0 0', fontSize: '16px', color: '#2A2A2A' }}>
                          {profileData.country}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={() => setIsEditing(true)}
                style={{
                  height: '52px',
                  borderRadius: '12px',
                  border: '2px solid #146D7B',
                  background: '#FFFFFF',
                  color: '#146D7B',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginTop: '8px',
                }}
              >
                Redigera profil
              </button>
            </div>


            {isTestDataToolsEnabled() && (
              <div
                style={{
                  marginTop: '24px',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '2px dashed #E8A598',
                  background: '#FFF8F6',
                }}
              >
                <p
                  style={{
                    margin: '0 0 8px 0',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#8B4513',
                  }}
                >
                  Testläge
                </p>
                <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#5C4033', lineHeight: 1.45 }}>
                  Rensa all appdata som hör till ditt konto så du kan testa &quot;hämta igen&quot; från början.
                  Kräver <code style={{ fontSize: '12px' }}>ENABLE_TEST_DATA_TOOLS=true</code> i backend.
                </p>
                <button
                  type="button"
                  onClick={handleClearTestData}
                  disabled={clearingTestData}
                  style={{
                    width: '100%',
                    height: '48px',
                    borderRadius: '10px',
                    border: 'none',
                    background: clearingTestData ? '#CCC' : '#C44',
                    color: '#FFF',
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: clearingTestData ? 'not-allowed' : 'pointer',
                  }}
                >
                  {clearingTestData ? 'Rensar…' : 'Rensa all min testdata'}
                </button>
                {testDataMessage && (
                  <p
                    role="status"
                    style={{ margin: '12px 0 0 0', fontSize: '13px', color: '#2A2A2A' }}
                  >
                    {testDataMessage}
                  </p>
                )}
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                height: '52px',
                borderRadius: '12px',
                border: '2px solid #FCC',
                background: '#FFFFFF',
                color: '#C33',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                marginTop: '24px',
              }}
            >
              Logga ut
            </button>
          </>
        ) : (
          <>
            {/* Edit Mode */}
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div
                style={{
                  background: '#F7FBFC',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid #E6F1F4',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 20px 0',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#146D7B',
                  }}
                >
                  Personlig information
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#2A2A2A' }}>Namn</span>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      style={{
                        height: '48px',
                        borderRadius: '12px',
                        border: '2px solid #E6F1F4',
                        padding: '0 16px',
                        fontSize: '16px',
                        outline: 'none',
                      }}
                    />
                  </label>

                  <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#2A2A2A' }}>
                      E-postadress
                    </span>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      style={{
                        height: '48px',
                        borderRadius: '12px',
                        border: '2px solid #E6F1F4',
                        padding: '0 16px',
                        fontSize: '16px',
                        outline: 'none',
                      }}
                    />
                  </label>

                  <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#2A2A2A' }}>
                      Telefonnummer <span style={{ color: '#767676', fontWeight: 400 }}>(valfritt)</span>
                    </span>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+46 70 123 45 67"
                      style={{
                        height: '48px',
                        borderRadius: '12px',
                        border: '2px solid #E6F1F4',
                        padding: '0 16px',
                        fontSize: '16px',
                        outline: 'none',
                      }}
                    />
                  </label>

                  <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#2A2A2A' }}>
                      Personnummer <span style={{ color: '#767676', fontWeight: 400 }}>(valfritt)</span>
                    </span>
                    <input
                      type="text"
                      value={profileData.personal_number}
                      onChange={(e) => handleInputChange('personal_number', e.target.value)}
                      placeholder="YYYYMMDD-XXXX"
                      maxLength={13}
                      style={{
                        height: '48px',
                        borderRadius: '12px',
                        border: '2px solid #E6F1F4',
                        padding: '0 16px',
                        fontSize: '16px',
                        outline: 'none',
                      }}
                    />
                  </label>
                </div>
              </div>

              <div
                style={{
                  background: '#F7FBFC',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid #E6F1F4',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 20px 0',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#146D7B',
                  }}
                >
                  Adress
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#2A2A2A' }}>
                      Gatuadress <span style={{ color: '#767676', fontWeight: 400 }}>(valfritt)</span>
                    </span>
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Gatunamn och nummer"
                      style={{
                        height: '48px',
                        borderRadius: '12px',
                        border: '2px solid #E6F1F4',
                        padding: '0 16px',
                        fontSize: '16px',
                        outline: 'none',
                      }}
                    />
                  </label>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '0 0 140px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#2A2A2A' }}>
                        Postnummer
                      </span>
                      <input
                        type="text"
                        value={profileData.postal_code}
                        onChange={(e) => handleInputChange('postal_code', e.target.value)}
                        placeholder="123 45"
                        maxLength={6}
                        style={{
                          height: '48px',
                          borderRadius: '12px',
                          border: '2px solid #E6F1F4',
                          padding: '0 16px',
                          fontSize: '16px',
                          outline: 'none',
                          width: '100%',
                          boxSizing: 'border-box',
                        }}
                      />
                    </label>

                    <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#2A2A2A' }}>Stad</span>
                      <input
                        type="text"
                        value={profileData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Stockholm"
                        style={{
                          height: '48px',
                          borderRadius: '12px',
                          border: '2px solid #E6F1F4',
                          padding: '0 16px',
                          fontSize: '16px',
                          outline: 'none',
                          width: '100%',
                          boxSizing: 'border-box',
                        }}
                      />
                    </label>
                  </div>

                  <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#2A2A2A' }}>Land</span>
                    <select
                      value={profileData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      style={{
                        height: '48px',
                        borderRadius: '12px',
                        border: '2px solid #E6F1F4',
                        padding: '0 16px',
                        fontSize: '16px',
                        backgroundColor: '#FFFFFF',
                        outline: 'none',
                      }}
                    >
                      <option value="Sverige">Sverige</option>
                      <option value="Norge">Norge</option>
                      <option value="Danmark">Danmark</option>
                      <option value="Finland">Finland</option>
                    </select>
                  </label>
                </div>
              </div>

              {/* Sociala inställningar */}
              <div
                style={{
                  background: '#F7FBFC',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid #E6F1F4',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 20px 0',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#146D7B',
                  }}
                >
                  Sociala inställningar
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#2A2A2A' }}>
                      Biografi <span style={{ color: '#767676', fontWeight: 400 }}>(valfritt)</span>
                    </span>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Berätta lite om dig själv..."
                      rows={4}
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #E6F1F4',
                        padding: '12px 16px',
                        fontSize: '16px',
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                      }}
                    />
                  </label>

                  <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#2A2A2A' }}>
                      Profilbild URL <span style={{ color: '#767676', fontWeight: 400 }}>(valfritt)</span>
                    </span>
                    <input
                      type="url"
                      value={profileData.avatar_url}
                      onChange={(e) => handleInputChange('avatar_url', e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      style={{
                        height: '48px',
                        borderRadius: '12px',
                        border: '2px solid #E6F1F4',
                        padding: '0 16px',
                        fontSize: '16px',
                        outline: 'none',
                      }}
                    />
                  </label>

                  <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#2A2A2A' }}>
                      Profilsynlighet
                    </span>
                    <select
                      value={profileData.profile_visibility}
                      onChange={(e) => handleInputChange('profile_visibility', e.target.value)}
                      style={{
                        height: '48px',
                        borderRadius: '12px',
                        border: '2px solid #E6F1F4',
                        padding: '0 16px',
                        fontSize: '16px',
                        outline: 'none',
                        background: '#FFFFFF',
                      }}
                    >
                      <option value="public">Publik - Alla kan se min profil</option>
                      <option value="friends">Vänner - Endast vänner kan se min profil</option>
                      <option value="private">Privat - Ingen kan se min profil</option>
                    </select>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={profileData.allow_friend_requests === true}
                      onChange={(e) => handleInputChange('allow_friend_requests', e.target.checked)}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#2A2A2A' }}>
                      Tillåt vänförfrågningar
                    </span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={profileData.show_email === true}
                      onChange={(e) => handleInputChange('show_email', e.target.checked)}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#2A2A2A' }}>
                      Visa e-postadress för vänner
                    </span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={profileData.show_phone === true}
                      onChange={(e) => handleInputChange('show_phone', e.target.checked)}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#2A2A2A' }}>
                      Visa telefonnummer för vänner
                    </span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={profileData.show_address === true}
                      onChange={(e) => handleInputChange('show_address', e.target.checked)}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#2A2A2A' }}>
                      Visa adress för vänner
                    </span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    setError(null)
                    setSuccess(false)
                    // Reload profile data to discard changes
                    window.location.reload()
                  }}
                  style={{
                    flex: 1,
                    height: '52px',
                    borderRadius: '12px',
                    border: '2px solid #146D7B',
                    background: '#FFFFFF',
                    color: '#146D7B',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    flex: 2,
                    height: '52px',
                    borderRadius: '12px',
                    border: 'none',
                    background: saving
                      ? '#CCCCCC'
                      : 'linear-gradient(135deg, #146D7B 14.76%, #198A9C 51.22%, #1C9FB4 86.19%)',
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving ? 'Sparar...' : 'Spara ändringar'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default Profile
