import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBoats, createBoat, deleteBoat, syncSandboxBoats } from '../lib/properties'
import { useBankIdQrFlow } from '../hooks/useBankIdQrFlow'
import { formatCreatedSkipped } from '../lib/sync-result-message'
import { Modal, FormField, Button } from '../components/Modal'
import { useToast } from '../components/Toast'

const boatTypeLabels: Record<string, string> = {
  motorboat: 'Motorbåtar',
  sailboat: 'Segelbåtar',
  other: 'Andra båtar',
}

type TransportFlow = 'idle' | 'bankid_qr' | 'syncing' | 'done' | 'error'

function Boats() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [boats, setBoats] = useState<Record<string, any[]>>({
    motorboat: [],
    sailboat: [],
    other: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [currentType, setCurrentType] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    registration_number: '',
    year: '',
    length: '',
    engine_type: '',
    engine_power: '',
  })

  const { qrImageUrl: tsQrUrl, hint: tsStatus, start: startTsBankId, reset: resetTsBankId } = useBankIdQrFlow()
  const tsStatusRef = useRef<HTMLParagraphElement>(null)

  const [tsFlow, setTsFlow] = useState<TransportFlow>('idle')
  const [tsResult, setTsResult] = useState('')
  const [tsError, setTsError] = useState('')

  useEffect(() => {
    loadBoats()
  }, [])

  useEffect(() => {
    tsStatusRef.current?.focus()
  }, [tsStatus, tsFlow])

  function startTransportSync() {
    setTsFlow('bankid_qr')
    setTsError('')
    startTsBankId({
      onComplete: async () => {
        setTsFlow('syncing')
        try {
          const r = await syncSandboxBoats()
          if (!r.ok) {
            setTsFlow('error')
            setTsError(r.message || 'Misslyckades')
            return
          }
          setTsResult(
            formatCreatedSkipped(
              r.created,
              r.skipped,
              '1 båt har hämtats från Transportstyrelsen',
              (n) => `${n} båtar har hämtats från Transportstyrelsen`,
              (sk) =>
                sk === 1
                  ? 'Inget nytt tillagt. 1 båt fanns redan.'
                  : `Inget nytt tillagt. ${sk} båtar fanns redan.`,
            ),
          )
          setTsFlow('done')
          await loadBoats()
        } catch {
          setTsFlow('error')
          setTsError('Kunde inte hämta båtar.')
        }
      },
      onFail: (msg) => {
        setTsFlow('error')
        setTsError(msg)
      },
    })
  }

  function cancelTransportSync() {
    resetTsBankId()
    setTsFlow('idle')
  }

  const loadBoats = async () => {
    try {
      setLoading(true)
      setError(null)
      const allBoats = await getBoats()
      
      // Gruppera båtar efter typ
      const grouped: Record<string, any[]> = {
        motorboat: [],
        sailboat: [],
        other: [],
      }

      allBoats.forEach((boat: any) => {
        if (boat.type && grouped[boat.type]) {
          grouped[boat.type].push(boat)
        }
      })

      setBoats(grouped)
    } catch (err) {
      console.error('Error loading boats:', err)
      setError(err.message || 'Kunde inte ladda båtar')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/properties')
    }
  }

  const handleAddBoat = (type: string) => {
    setCurrentType(type)
    setFormData({
      make: '',
      model: '',
      registration_number: '',
      year: '',
      length: '',
      engine_type: '',
      engine_power: '',
    })
    setShowAddModal(true)
  }

  const handleSubmitBoat = async () => {
    if (!formData.make.trim() || !formData.model.trim() || !currentType) return

    try {
      await createBoat({
        type: currentType,
        make: formData.make,
        model: formData.model,
        registration_number: formData.registration_number || undefined,
        year: formData.year ? parseInt(formData.year) : undefined,
        length: formData.length ? parseFloat(formData.length) : undefined,
        engine_type: formData.engine_type || undefined,
        engine_power: formData.engine_power || undefined,
      })
      loadBoats()
      setShowAddModal(false)
      setFormData({
        make: '',
        model: '',
        registration_number: '',
        year: '',
        length: '',
        engine_type: '',
        engine_power: '',
      })
    } catch (err) {
      showToast('Kunde inte skapa båt: ' + (err.message || 'Okänt fel'), 'error')
    }
  }

  const handleDeleteBoat = async (boatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Är du säker på att du vill ta bort denna båt?')) return

    try {
      await deleteBoat(boatId)
      loadBoats()
    } catch (err) {
      showToast('Kunde inte ta bort båt: ' + (err.message || 'Okänt fel'), 'error')
    }
  }

  if (tsFlow === 'bankid_qr') {
    return (
      <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '360px', padding: '24px' }}>
          <div style={{ width: '56px', height: '56px', margin: '0 auto 12px', background: '#E8F5F0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1C938C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h2 style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '20px', color: '#2A2A2A', margin: '0 0 4px' }}>Transportstyrelsen</h2>
          <p style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontSize: '13px', color: '#999', margin: '0 0 24px' }}>Identifiera dig med BankID</p>
          <div style={{ background: '#F7FBFC', borderRadius: '16px', padding: '24px', border: '1px solid #E6F1F4' }}>
            {tsQrUrl ? (
              <div style={{ width: '200px', height: '200px', backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '12px', margin: '0 auto 16px', boxShadow: '0px 4px 12px rgba(0,0,0,0.08)' }}>
                <img src={tsQrUrl} alt="BankID QR" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            ) : (
              <div style={{ width: '200px', height: '200px', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid #E0E0E0', borderTop: '3px solid #1C938C', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              </div>
            )}
            <p
              ref={tsStatusRef}
              tabIndex={-1}
              role="status"
              aria-live="polite"
              aria-atomic="true"
              style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontSize: '15px', color: '#2A2A2A', fontWeight: 600, margin: '0 0 4px', outline: 'none' }}
            >
              {tsStatus}
            </p>
            <p style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontSize: '12px', color: '#999', margin: 0 }}>QR-koden uppdateras automatiskt</p>
          </div>
          <button type="button" onClick={cancelTransportSync} style={{ marginTop: '20px', padding: '10px 24px', background: 'transparent', border: '1px solid #DDD', borderRadius: '8px', color: '#666', fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 500, fontSize: '14px', cursor: 'pointer' }}>Avbryt</button>
        </div>
      </div>
    )
  }
  if (tsFlow === 'syncing') {
    return (
      <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '340px', padding: '24px' }}>
          <div style={{ width: '44px', height: '44px', border: '3px solid #E6E6E6', borderTop: '3px solid #1C938C', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 24px' }} />
          <h2 style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '20px', color: '#2A2A2A', marginBottom: '8px' }}>Hämtar båtar</h2>
          <p style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontSize: '14px', color: '#888' }}>Hämtar dina registrerade båtar från Transportstyrelsen...</p>
        </div>
      </div>
    )
  }
  if (tsFlow === 'done') {
    return (
      <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '340px', padding: '24px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#E8F5F0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1C938C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <h2 style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '22px', color: '#2A2A2A', marginBottom: '8px' }}>Båtar hämtade!</h2>
          <p style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontSize: '16px', color: '#4F4F4F', marginBottom: '24px' }}>{tsResult}</p>
          <button type="button" onClick={() => setTsFlow('idle')} style={{ padding: '14px 28px', background: '#1C938C', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '15px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>Visa mina båtar</button>
        </div>
      </div>
    )
  }
  if (tsFlow === 'error') {
    return (
      <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '340px', padding: '24px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#FEE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" /></svg>
          </div>
          <h2 style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '22px', color: '#2A2A2A', marginBottom: '8px' }}>Kunde inte hämta</h2>
          <p style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontSize: '16px', color: '#4F4F4F', marginBottom: '24px' }}>{tsError}</p>
          <button type="button" onClick={cancelTransportSync} style={{ padding: '14px 28px', background: '#1C938C', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '15px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>Försök igen</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#F4F6FF', minHeight: '100vh', width: '100%', position: 'relative', paddingBottom: '120px' }}>
      <div style={{ position: 'absolute', width: '100%', height: '220px', top: 0, left: 0, right: 0, zIndex: 5, overflow: 'hidden' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 554 336"
          preserveAspectRatio="xMidYMin slice"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '100%', minHeight: '100%' }}
        >
          <defs>
            <filter id="filter0_d_boats" x="-50" y="-50" width="654" height="436" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-2" dy="-2" />
              <feGaussianBlur stdDeviation="10" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <linearGradient id="paint0_linear_boats" x1="193.714" y1="62.3333" x2="398.505" y2="322.66" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1A7498" />
              <stop offset="0.510382" stopColor="#1A7498" />
              <stop offset="1" stopColor="#1A7498" />
            </linearGradient>
            <linearGradient id="paint1_linear_boats" x1="105.219" y1="61.4667" x2="288.087" y2="379.015" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1A7498" />
              <stop offset="0.510382" stopColor="#1A7498" />
              <stop offset="1" stopColor="#1A7498" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_boats)" />
          <g filter="url(#filter0_d_boats)">
            <path d="M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z" fill="url(#paint1_linear_boats)" />
          </g>
        </svg>

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            boxSizing: 'border-box',
            height: '88px',
            zIndex: 4,
          }}
        >
          <button
            type="button"
            onClick={handleBack}
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              zIndex: 5,
            }}
            aria-label="Tillbaka"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h2
            style={{
              fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
              fontWeight: 700,
              fontSize: '24px',
              lineHeight: '29px',
              color: '#FFFFFF',
              margin: 0,
            }}
          >
            Båtar
          </h2>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '160px',
          left: 0,
          width: '100%',
          background: '#FFFFFF',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          zIndex: 3,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '232px 16px 120px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <button
          type="button"
          onClick={startTransportSync}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
            padding: '14px 16px', background: '#FFFFFF', border: '1px solid #E6F1F4',
            borderRadius: '12px', cursor: 'pointer', boxShadow: '0px 1px 8px rgba(0,0,0,0.06)',
            transition: 'box-shadow 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0px 4px 16px rgba(0,0,0,0.12)' }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0px 1px 8px rgba(0,0,0,0.06)' }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#E8F5F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1C938C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '15px', color: '#2A2A2A' }}>Hämta från Transportstyrelsen</div>
            <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: '#888', marginTop: '2px' }}>Logga in med BankID för att hämta dina registrerade båtar</div>
          </div>
          <svg width="6" height="12" viewBox="0 0 6 12" fill="none"><path d="M1 1L5 6L1 11" stroke="#BBBBBB" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#2A2A2A', opacity: 0.6 }}>
            Laddar båtar...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#d32f2f' }}>
            {error}
          </div>
        ) : (
          <>
            {Object.entries(boats).map(([type, items]) => (
              <section key={type} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3
                  style={{
                    margin: 0,
                    fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                    fontWeight: 600,
                    fontSize: '16px',
                    color: '#2A2A2A',
                  }}
                >
                  {boatTypeLabels[type] || type}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {items.map((boat) => {
                    const content = (
                      <div
                        key={boat.id}
                        onClick={() => {
                          if (boat.model?.toLowerCase().includes('aquador') || boat.model?.toLowerCase().includes('26ht')) {
                            navigate('/properties/boats/aquador-26ht')
                          }
                        }}
                        style={{
                          width: '100%',
                          background: '#FFFFFF',
                          borderRadius: '16px',
                          boxShadow: '0px 8px 24px rgba(20, 45, 120, 0.08)',
                          padding: '14px 18px',
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          boxSizing: 'border-box',
                          cursor: 'pointer',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: 500,
                            fontSize: '15px',
                            color: '#2A2A2A',
                          }}
                        >
                          {boat.make} {boat.model}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {boat.registration_number && (
                            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '14px', color: '#1A7498' }}>
                              {boat.registration_number}
                            </span>
                          )}
                          <button
                            onClick={(e) => handleDeleteBoat(boat.id, e)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              padding: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                            aria-label="Ta bort"
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path
                                d="M4 4L12 12M4 12L12 4"
                                stroke="#d32f2f"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                          <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                            <path d="M1 1L5 6L1 11" stroke="#1A7498" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </div>
                      </div>
                    )
                    return content
                  })}
                  <div
                    onClick={() => handleAddBoat(type)}
                    style={{
                      width: '100%',
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      boxShadow: '0px 8px 24px rgba(20, 45, 120, 0.08)',
                      padding: '14px 18px',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      boxSizing: 'border-box',
                      cursor: 'pointer',
                      border: '2px dashed #E3ECFF',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 500,
                        fontSize: '15px',
                        color: '#1A7498',
                      }}
                    >
                      Lägg till ny
                    </span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1V11M1 6H11" stroke="#1A7498" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </section>
            ))}
          </>
        )}
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setFormData({
            make: '',
            model: '',
            registration_number: '',
            year: '',
            length: '',
            engine_type: '',
            engine_power: '',
          })
        }}
        title={`Lägg till ${currentType ? boatTypeLabels[currentType] : 'båt'}`}
      >
        <FormField
          label="Tillverkare"
          value={formData.make}
          onChange={(value) => setFormData({ ...formData, make: value })}
          placeholder="t.ex. Aquador"
          required
        />
        <FormField
          label="Modell"
          value={formData.model}
          onChange={(value) => setFormData({ ...formData, model: value })}
          placeholder="t.ex. 26HT"
          required
        />
        <FormField
          label="Registreringsnummer"
          value={formData.registration_number}
          onChange={(value) => setFormData({ ...formData, registration_number: value })}
          placeholder="Registreringsnummer (valfritt)"
        />
        <FormField
          label="År"
          value={formData.year}
          onChange={(value) => setFormData({ ...formData, year: value })}
          placeholder="Årsmodell (valfritt)"
          type="number"
        />
        <FormField
          label="Längd (meter)"
          value={formData.length}
          onChange={(value) => setFormData({ ...formData, length: value })}
          placeholder="Längd i meter (valfritt)"
          type="number"
        />
        <FormField
          label="Motortyp"
          value={formData.engine_type}
          onChange={(value) => setFormData({ ...formData, engine_type: value })}
          placeholder="Motortyp (valfritt)"
        />
        <FormField
          label="Motoreffekt"
          value={formData.engine_power}
          onChange={(value) => setFormData({ ...formData, engine_power: value })}
          placeholder="Motoreffekt (valfritt)"
        />
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Button
            variant="secondary"
            onClick={() => {
              setShowAddModal(false)
              setFormData({
                make: '',
                model: '',
                registration_number: '',
                year: '',
                length: '',
                engine_type: '',
                engine_power: '',
              })
            }}
          >
            Avbryt
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmitBoat}
            disabled={!formData.make.trim() || !formData.model.trim()}
          >
            Spara
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default Boats

