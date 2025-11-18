import { useState, useEffect, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { ArrowLeftIcon } from '../components/Icons'

function Profile() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    personal_number: '',
    address: '',
    postal_code: '',
    city: '',
    country: 'Sverige',
  })

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          // Om profilen inte finns, skapa en ny
          if (error.code === 'PGRST116') {
            console.log('Profile not found, creating new profile...')
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                name: user.user_metadata?.name || user.email?.split('@')[0] || '',
                email: user.email || '',
                onboarding_completed: false,
              })
              .select()
              .single()

            if (createError) {
              console.error('Error creating profile:', createError)
              setError('Kunde inte skapa profil')
              setLoading(false)
              return
            }

            if (newProfile) {
              setProfileData({
                name: newProfile.name || '',
                email: newProfile.email || user.email || '',
                phone: newProfile.phone || '',
                personal_number: newProfile.personal_number || '',
                address: newProfile.address || '',
                postal_code: newProfile.postal_code || '',
                city: newProfile.city || '',
                country: newProfile.country || 'Sverige',
              })
            }
          } else {
            console.error('Error loading profile:', error)
            setError('Kunde inte ladda profil')
            setLoading(false)
            return
          }
        } else if (data) {
          setProfileData({
            name: data.name || '',
            email: data.email || user.email || '',
            phone: data.phone || '',
            personal_number: data.personal_number || '',
            address: data.address || '',
            postal_code: data.postal_code || '',
            city: data.city || '',
            country: data.country || 'Sverige',
          })
        }
        setLoading(false)
      } catch (err) {
        console.error('Unexpected error:', err)
        setError('Ett oväntat fel uppstod')
        setLoading(false)
      }
    }

    loadProfile()
  }, [user])

  const handleInputChange = (field: string, value: string) => {
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
      const updateData: any = {
        name: profileData.name,
        email: profileData.email,
        updated_at: new Date().toISOString(),
      }

      // Lägg bara till fält som har värden
      if (profileData.phone) updateData.phone = profileData.phone
      if (profileData.personal_number) updateData.personal_number = profileData.personal_number
      if (profileData.address) updateData.address = profileData.address
      if (profileData.postal_code) updateData.postal_code = profileData.postal_code
      if (profileData.city) updateData.city = profileData.city
      if (profileData.country) updateData.country = profileData.country

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)

      if (updateError) {
        console.error('Update error:', updateError)
        setError('Kunde inte spara ändringar. Försök igen.')
        setSaving(false)
        return
      }

      setSuccess(true)
      setIsEditing(false)
      setSaving(false)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('Ett oväntat fel uppstod. Försök igen.')
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    if (window.confirm('Är du säker på att du vill logga ut?')) {
      await signOut()
      navigate('/')
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
      <div style={{ padding: '24px 16px 120px', maxWidth: '343px', margin: '0 auto' }}>
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
