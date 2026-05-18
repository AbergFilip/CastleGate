import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getVehicles, createVehicle, deleteVehicle, syncSandboxVehicles } from '../lib/properties'
import { useBankIdQrFlow } from '../hooks/useBankIdQrFlow'
import { formatCreatedSkipped } from '../lib/sync-result-message'
import { Modal, FormField, Button } from '../components/Modal'
import { useToast } from '../components/Toast'
import { TRANSPORTSTYRELSEN } from '../lib/agencies'
import { getAgencyTheme } from '../lib/bank-themes'
import { BankAuthFrame } from '../components/BankAuthFrame'
import { BankIdAuthCard } from '../components/BankIdAuthCard'
import { BankSyncingScreen } from '../components/BankSyncingScreen'

const vehicleTypeLabels: Record<string, string> = {
  car: 'Bilar',
  motorcycle: 'Motorcykel',
  trailer: 'Släp',
  other: 'Andra fordon',
}

type TransportFlow = 'idle' | 'bankid_qr' | 'syncing' | 'done' | 'error'

function Vehicles() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [vehicles, setVehicles] = useState<Record<string, any[]>>({
    car: [],
    motorcycle: [],
    trailer: [],
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
    color: '',
    vin: '',
  })

  const { qrImageUrl: tsQrUrl, hint: tsStatus, start: startTsBankId, reset: resetTsBankId } = useBankIdQrFlow()
  const tsStatusRef = useRef<HTMLParagraphElement>(null)

  const [tsFlow, setTsFlow] = useState<TransportFlow>('idle')
  const [tsResult, setTsResult] = useState('')
  const [tsError, setTsError] = useState('')

  useEffect(() => {
    loadVehicles()
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
          const r = await syncSandboxVehicles()
          if (!r.ok) {
            setTsFlow('error')
            setTsError(r.message || 'Misslyckades')
            return
          }
          setTsResult(
            formatCreatedSkipped(
              r.created,
              r.skipped,
              '1 fordon har hämtats från Transportstyrelsen',
              (n) => `${n} fordon har hämtats från Transportstyrelsen`,
              (sk) =>
                sk === 1
                  ? 'Inget nytt tillagt. 1 fordon fanns redan.'
                  : `Inget nytt tillagt. ${sk} fordon fanns redan.`,
            ),
          )
          setTsFlow('done')
          await loadVehicles()
        } catch {
          setTsFlow('error')
          setTsError('Kunde inte hämta fordon.')
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

  const loadVehicles = async () => {
    try {
      setLoading(true)
      setError(null)
      const allVehicles = await getVehicles()
      
      // Gruppera fordon efter typ
      const grouped: Record<string, any[]> = {
        car: [],
        motorcycle: [],
        trailer: [],
        other: [],
      }

      allVehicles.forEach((vehicle: any) => {
        if (vehicle.type && grouped[vehicle.type]) {
          grouped[vehicle.type].push(vehicle)
        }
      })

      setVehicles(grouped)
    } catch (err) {
      console.error('Error loading vehicles:', err)
      setError(err.message || 'Kunde inte ladda fordon')
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

  const handleAddVehicle = (type: string) => {
    setCurrentType(type)
    setFormData({
      make: '',
      model: '',
      registration_number: '',
      year: '',
      color: '',
      vin: '',
    })
    setShowAddModal(true)
  }

  const handleSubmitVehicle = async () => {
    if (!formData.make.trim() || !formData.model.trim() || !currentType) return

    try {
      await createVehicle({
        type: currentType,
        make: formData.make,
        model: formData.model,
        registration_number: formData.registration_number || undefined,
        year: formData.year ? parseInt(formData.year) : undefined,
        color: formData.color || undefined,
        vin: formData.vin || undefined,
      })
      loadVehicles()
      setShowAddModal(false)
      setFormData({
        make: '',
        model: '',
        registration_number: '',
        year: '',
        color: '',
        vin: '',
      })
    } catch (err) {
      showToast('Kunde inte skapa fordon: ' + (err.message || 'Okänt fel'), 'error')
    }
  }

  const handleDeleteVehicle = async (vehicleId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Är du säker på att du vill ta bort detta fordon?')) return

    try {
      await deleteVehicle(vehicleId)
      loadVehicles()
    } catch (err) {
      showToast('Kunde inte ta bort fordon: ' + (err.message || 'Okänt fel'), 'error')
    }
  }

  if (tsFlow === 'bankid_qr') {
    const theme = getAgencyTheme(TRANSPORTSTYRELSEN.id)
    return (
      <BankAuthFrame
        theme={theme}
        bankLogo={TRANSPORTSTYRELSEN.logo}
        subtitle="Identifiera dig för att hämta dina fordon"
        onCancel={cancelTransportSync}
      >
        <BankIdAuthCard
          ref={tsStatusRef}
          theme={theme}
          qrImageUrl={tsQrUrl}
          status={tsStatus}
        />
      </BankAuthFrame>
    )
  }

  if (tsFlow === 'syncing') {
    const theme = getAgencyTheme(TRANSPORTSTYRELSEN.id)
    return (
      <BankSyncingScreen
        theme={theme}
        bankLogo={TRANSPORTSTYRELSEN.logo}
        title="Hämtar fordon"
        description="Transportstyrelsen delar dina registrerade fordon med CastleGate."
      />
    )
  }

  if (tsFlow === 'done') {
    return (
      <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '340px', padding: '24px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#E8F5F0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1C938C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <h2 style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '22px', color: '#2A2A2A', marginBottom: '8px' }}>Fordon hämtade!</h2>
          <p style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontSize: '16px', color: '#4F4F4F', marginBottom: '24px' }}>{tsResult}</p>
          <button type="button" onClick={() => setTsFlow('idle')} style={{ padding: '14px 28px', background: '#1C938C', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '15px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>Visa mina fordon</button>
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
            <filter id="filter0_d_vehicles" x="-50" y="-50" width="654" height="436" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-2" dy="-2" />
              <feGaussianBlur stdDeviation="10" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <linearGradient id="paint0_linear_vehicles" x1="193.714" y1="62.3333" x2="398.505" y2="322.66" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1A7498" />
              <stop offset="0.510382" stopColor="#1A7498" />
              <stop offset="1" stopColor="#1A7498" />
            </linearGradient>
            <linearGradient id="paint1_linear_vehicles" x1="105.219" y1="61.4667" x2="288.087" y2="379.015" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1A7498" />
              <stop offset="0.510382" stopColor="#1A7498" />
              <stop offset="1" stopColor="#1A7498" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_vehicles)" />
          <g filter="url(#filter0_d_vehicles)">
            <path d="M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z" fill="url(#paint1_linear_vehicles)" />
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
            Fordon
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
          className="hover-lift"
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
            padding: '12px 16px', background: '#FFFFFF', border: '1px solid #F0F0F0',
            borderRadius: '12px', cursor: 'pointer', boxShadow: '0px 1px 8px rgba(0,0,0,0.08)',
            minHeight: 72,
            textAlign: 'left',
          }}
        >
          <img
            src={TRANSPORTSTYRELSEN.logo}
            alt={TRANSPORTSTYRELSEN.name}
            style={{ width: 44, height: 44, objectFit: 'contain', flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '16px', color: '#2A2A2A', marginBottom: 2 }}>{TRANSPORTSTYRELSEN.name}</div>
            <div style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontSize: '12px', color: '#888', lineHeight: 1.3 }}>{TRANSPORTSTYRELSEN.description}</div>
          </div>
          <svg width="6" height="12" viewBox="0 0 6 12" fill="none" style={{ flexShrink: 0 }}><path d="M1 1L5 6L1 11" stroke="#BBBBBB" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#2A2A2A', opacity: 0.6 }}>
            Laddar fordon...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#d32f2f' }}>
            {error}
          </div>
        ) : (
          <>
            {Object.entries(vehicles).map(([type, items]) => (
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
                  {vehicleTypeLabels[type] || type}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {items.map((vehicle) => {
                    const content = (
                      <div
                        key={vehicle.id}
                        onClick={() => {
                          if (vehicle.model?.toLowerCase().includes('xc90')) {
                            navigate('/properties/vehicles/volvo-xc90')
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
                          {vehicle.make} {vehicle.model}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {vehicle.registration_number && (
                            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '14px', color: '#1A7498' }}>
                              {vehicle.registration_number}
                            </span>
                          )}
                          <button
                            onClick={(e) => handleDeleteVehicle(vehicle.id, e)}
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
                    onClick={() => handleAddVehicle(type)}
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
            color: '',
            vin: '',
          })
        }}
        title={`Lägg till ${currentType ? vehicleTypeLabels[currentType] : 'fordon'}`}
      >
        <FormField
          label="Tillverkare"
          value={formData.make}
          onChange={(value) => setFormData({ ...formData, make: value })}
          placeholder="t.ex. Volvo"
          required
        />
        <FormField
          label="Modell"
          value={formData.model}
          onChange={(value) => setFormData({ ...formData, model: value })}
          placeholder="t.ex. XC90"
          required
        />
        <FormField
          label="Registreringsnummer"
          value={formData.registration_number}
          onChange={(value) => setFormData({ ...formData, registration_number: value })}
          placeholder="t.ex. MLB 102"
        />
        <FormField
          label="År"
          value={formData.year}
          onChange={(value) => setFormData({ ...formData, year: value })}
          placeholder="Årsmodell (valfritt)"
          type="number"
        />
        <FormField
          label="Färg"
          value={formData.color}
          onChange={(value) => setFormData({ ...formData, color: value })}
          placeholder="Färg (valfritt)"
        />
        <FormField
          label="VIN (Chassinummer)"
          value={formData.vin}
          onChange={(value) => setFormData({ ...formData, vin: value })}
          placeholder="VIN (valfritt)"
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
                color: '',
                vin: '',
              })
            }}
          >
            Avbryt
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmitVehicle}
            disabled={!formData.make.trim() || !formData.model.trim()}
          >
            Spara
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default Vehicles
