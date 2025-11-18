import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

function Onboarding() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    phone: '',
    personalNumber: '',
    address: '',
    postalCode: '',
    city: '',
    country: 'Sverige',
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!user) {
        setError('Du är inte inloggad')
        setLoading(false)
        return
      }

      // Uppdatera profil i Supabase
      const updateData: any = {
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      }

      // Lägg bara till fält som har värden
      if (formData.phone) updateData.phone = formData.phone
      if (formData.personalNumber) updateData.personal_number = formData.personalNumber
      if (formData.address) updateData.address = formData.address
      if (formData.postalCode) updateData.postal_code = formData.postalCode
      if (formData.city) updateData.city = formData.city
      if (formData.country) updateData.country = formData.country

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)

      if (updateError) {
        console.error('Update error:', updateError)
        setError('Kunde inte spara information. Försök igen.')
        setLoading(false)
        return
      }

      // Redirecta till home
      navigate('/home')
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('Ett oväntat fel uppstod. Försök igen.')
      setLoading(false)
    }
  }

  const totalSteps = 2

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(180deg, #146D7B 0%, #1C9FB4 60%, #F5F5F5 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '32px 16px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '375px',
          maxWidth: '100%',
          backgroundColor: '#FFFFFF',
          boxShadow: '0px 20px 64px rgba(0, 0, 0, 0.24)',
          borderRadius: '24px',
          padding: '32px 24px',
          boxSizing: 'border-box',
        }}
      >
        {/* Progress indicator */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: '#146D7B', fontWeight: 600 }}>
              Steg {step} av {totalSteps}
            </span>
            <span style={{ fontSize: '14px', color: '#767676' }}>
              {Math.round((step / totalSteps) * 100)}%
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '6px',
              backgroundColor: '#E6F1F4',
              borderRadius: '3px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${(step / totalSteps) * 100}%`,
                height: '100%',
                background: 'linear-gradient(135deg, #146D7B 14.76%, #198A9C 51.22%, #1C9FB4 86.19%)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Header */}
        <header style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 16px',
              background: 'linear-gradient(135deg, #146D7B 14.76%, #198A9C 51.22%, #1C9FB4 86.19%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0px 8px 24px rgba(20, 109, 123, 0.24)',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15C10.9391 15 9.92172 15.4214 9.17157 16.1716C8.42143 16.9217 8 17.9391 8 19V21"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: '28px',
              lineHeight: '34px',
              fontWeight: 700,
              color: '#1E1E1E',
              marginBottom: '8px',
            }}
          >
            {step === 1 ? 'Välkommen!' : 'Nästan klart'}
          </h1>
          <p style={{ margin: 0, color: '#4F4F4F', lineHeight: 1.6, fontSize: '15px' }}>
            {step === 1
              ? 'Låt oss hjälpa dig att komma igång. Vi behöver några uppgifter för att personalisera din upplevelse.'
              : 'Lite mer information så är du redo att börja använda Castlegate.'}
          </p>
        </header>

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

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#2A2A2A' }}>
                  Telefonnummer <span style={{ color: '#767676', fontWeight: 400 }}>(valfritt)</span>
                </span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+46 70 123 45 67"
                  style={{
                    height: '48px',
                    borderRadius: '12px',
                    border: '1px solid #D5D5D5',
                    padding: '0 16px',
                    fontSize: '16px',
                  }}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#2A2A2A' }}>
                  Personnummer <span style={{ color: '#767676', fontWeight: 400 }}>(valfritt)</span>
                </span>
                <input
                  type="text"
                  value={formData.personalNumber}
                  onChange={(e) => handleInputChange('personalNumber', e.target.value)}
                  placeholder="YYYYMMDD-XXXX"
                  maxLength={13}
                  style={{
                    height: '48px',
                    borderRadius: '12px',
                    border: '1px solid #D5D5D5',
                    padding: '0 16px',
                    fontSize: '16px',
                  }}
                />
                <span style={{ fontSize: '12px', color: '#767676' }}>
                  Används för automatisk inläsning av dokument och försäkringar
                </span>
              </label>

              <button
                type="button"
                onClick={() => setStep(2)}
                style={{
                  height: '52px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #146D7B 14.76%, #198A9C 51.22%, #1C9FB4 86.19%)',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginTop: '8px',
                }}
              >
                Fortsätt
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#2A2A2A' }}>
                  Adress <span style={{ color: '#767676', fontWeight: 400 }}>(valfritt)</span>
                </span>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Gatunamn och nummer"
                  style={{
                    height: '48px',
                    borderRadius: '12px',
                    border: '1px solid #D5D5D5',
                    padding: '0 16px',
                    fontSize: '16px',
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
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    placeholder="123 45"
                    maxLength={6}
                    style={{
                      height: '48px',
                      borderRadius: '12px',
                      border: '1px solid #D5D5D5',
                      padding: '0 16px',
                      fontSize: '16px',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  />
                </label>

                <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#2A2A2A' }}>Stad</span>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Stockholm"
                    style={{
                      height: '48px',
                      borderRadius: '12px',
                      border: '1px solid #D5D5D5',
                      padding: '0 16px',
                      fontSize: '16px',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  />
                </label>
              </div>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#2A2A2A' }}>Land</span>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  style={{
                    height: '48px',
                    borderRadius: '12px',
                    border: '1px solid #D5D5D5',
                    padding: '0 16px',
                    fontSize: '16px',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <option value="Sverige">Sverige</option>
                  <option value="Norge">Norge</option>
                  <option value="Danmark">Danmark</option>
                  <option value="Finland">Finland</option>
                </select>
              </label>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
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
                  Tillbaka
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 2,
                    height: '52px',
                    borderRadius: '12px',
                    border: 'none',
                    background: loading
                      ? '#CCCCCC'
                      : 'linear-gradient(135deg, #146D7B 14.76%, #198A9C 51.22%, #1C9FB4 86.19%)',
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? 'Sparar...' : 'Slutför'}
                </button>
              </div>
            </div>
          )}
        </form>

        {step === 2 && (
          <p
            style={{
              marginTop: '24px',
              fontSize: '12px',
              color: '#767676',
              textAlign: 'center',
              lineHeight: 1.5,
            }}
          >
            Du kan alltid uppdatera denna information senare i inställningar.
          </p>
        )}
      </div>
    </div>
  )
}

export default Onboarding
