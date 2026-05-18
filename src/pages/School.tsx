import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getSchools, createSchool, deleteSchool } from '../lib/documents'
import { Modal, FormField, Button } from '../components/Modal'
import { useToast } from '../components/Toast'

function School() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [schools, setSchools] = useState<Record<string, any[]>>({
    preschool: [],
    elementary: [],
    high_school: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [currentType, setCurrentType] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', address: '', phone: '', email: '' })

  useEffect(() => {
    loadSchools()
  }, [])

  const loadSchools = async () => {
    try {
      setLoading(true)
      setError(null)
      const allSchools = await getSchools()
      
      // Gruppera skolor efter typ
      const grouped: Record<string, any[]> = {
        preschool: [],
        elementary: [],
        high_school: [],
      }

      allSchools.forEach((school: any) => {
        if (school.type && grouped[school.type]) {
          grouped[school.type].push(school)
        }
      })

      setSchools(grouped)
    } catch (err) {
      console.error('Error loading schools:', err)
      setError(err instanceof Error ? err.message : 'Kunde inte ladda skolor')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/documents')
    }
  }

  const handleAddSchool = (type: string) => {
    setCurrentType(type)
    setFormData({ name: '', address: '', phone: '', email: '' })
    setShowAddModal(true)
  }

  const handleSubmitSchool = async () => {
    if (!formData.name.trim() || !currentType) return

    try {
      await createSchool({
        name: formData.name,
        type: currentType,
        address: formData.address || undefined,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
      })
      loadSchools()
      setShowAddModal(false)
      setFormData({ name: '', address: '', phone: '', email: '' })
    } catch (err) {
      showToast('Kunde inte skapa skola: ' + (err instanceof Error ? err.message : 'Okänt fel'), 'error')
    }
  }

  const getTypeTitle = (type: string) => {
    const titles: Record<string, string> = {
      preschool: 'Förskola',
      elementary: 'Grundskola',
      high_school: 'Gymnasium',
    }
    return titles[type] || type
  }

  const handleDeleteSchool = async (schoolId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Är du säker på att du vill ta bort denna skola?')) return

    try {
      await deleteSchool(schoolId)
      loadSchools()
    } catch (err) {
      showToast('Kunde inte ta bort skola: ' + (err instanceof Error ? err.message : 'Okänt fel'), 'error')
    }
  }

  return (
    <div style={{ background: '#F4F6FF', minHeight: '100vh', width: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', width: '100%', height: '200px', top: 0, left: 0, right: 0, zIndex: 5, overflow: 'hidden' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 554 336"
          preserveAspectRatio="xMidYMin slice"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '100%', minHeight: '100%' }}
        >
          <defs>
            <filter id="filter0_d_school" x="-50" y="-50" width="654" height="436" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-2" dy="-2" />
              <feGaussianBlur stdDeviation="10" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <linearGradient id="paint0_linear_school" x1="193.714" y1="62.3333" x2="398.505" y2="322.66" gradientUnits="userSpaceOnUse">
              <stop stopColor="#274FB7" />
              <stop offset="0.510382" stopColor="#3162D3" />
              <stop offset="1" stopColor="#3B76EF" />
            </linearGradient>
            <linearGradient id="paint1_linear_school" x1="105.219" y1="61.4667" x2="288.087" y2="379.015" gradientUnits="userSpaceOnUse">
              <stop stopColor="#274FB7" />
              <stop offset="0.510382" stopColor="#3162D3" />
              <stop offset="1" stopColor="#3B76EF" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_school)" />
          <g filter="url(#filter0_d_school)">
            <path d="M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z" fill="url(#paint1_linear_school)" />
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
            Barn i skola
          </h2>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '160px',
          left: 0,
          width: '100%',
          height: '100%',
          background: '#FFFFFF',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '208px 16px 120px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#2A2A2A', opacity: 0.6 }}>
            Laddar skolor...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#d32f2f' }}>
            {error}
          </div>
        ) : (
          <>
            <Section title="Förskolor">
              {schools.preschool.map((school) => (
                <SchoolCard
                  key={school.id}
                  school={school}
                  onDelete={handleDeleteSchool}
                />
              ))}
              <AddNewCard
                label="Lägg till ny"
                onClick={() => handleAddSchool('preschool')}
              />
            </Section>
            <Section title="Grundskolor">
              {schools.elementary.map((school) => (
                <SchoolCard
                  key={school.id}
                  school={school}
                  onDelete={handleDeleteSchool}
                />
              ))}
              <AddNewCard
                label="Lägg till ny"
                onClick={() => handleAddSchool('elementary')}
              />
            </Section>
            <Section title="Gymnasium">
              {schools.high_school.map((school) => (
                <SchoolCard
                  key={school.id}
                  school={school}
                  onDelete={handleDeleteSchool}
                />
              ))}
              <AddNewCard
                label="Lägg till ny"
                onClick={() => handleAddSchool('high_school')}
              />
            </Section>
          </>
        )}
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setFormData({ name: '', address: '', phone: '', email: '' })
        }}
        title={`Lägg till ${currentType ? getTypeTitle(currentType) : 'skola'}`}
      >
        <FormField
          label="Skolans namn"
          value={formData.name}
          onChange={(value) => setFormData({ ...formData, name: value })}
          placeholder="Ange skolans namn"
          required
        />
        <FormField
          label="Adress"
          value={formData.address}
          onChange={(value) => setFormData({ ...formData, address: value })}
          placeholder="Ange adress (valfritt)"
        />
        <FormField
          label="Telefon"
          value={formData.phone}
          onChange={(value) => setFormData({ ...formData, phone: value })}
          placeholder="Ange telefonnummer (valfritt)"
          type="tel"
        />
        <FormField
          label="E-post"
          value={formData.email}
          onChange={(value) => setFormData({ ...formData, email: value })}
          placeholder="Ange e-postadress (valfritt)"
          type="email"
        />
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Button
            variant="secondary"
            onClick={() => {
              setShowAddModal(false)
              setFormData({ name: '', address: '', phone: '', email: '' })
            }}
          >
            Avbryt
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmitSchool}
            disabled={!formData.name.trim()}
          >
            Spara
          </Button>
        </div>
      </Modal>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h3
        style={{
          margin: 0,
          fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
          fontWeight: 600,
          fontSize: '16px',
          color: '#2A2A2A',
        }}
      >
        {title}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>{children}</div>
    </section>
  )
}

function SchoolCard({ school, onDelete }: { school: any; onDelete: (id: string, e: React.MouseEvent) => void }) {
  const navigate = useNavigate()
  
  return (
    <div
      onClick={() => navigate(`/documents/school/${school.id}`)}
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
      <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '15px' }}>{school.name}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={(e) => onDelete(school.id, e)}
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
          <path d="M1 1L5 6L1 11" stroke="#1C3C9B" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}

function AddNewCard({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
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
      <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '15px', color: '#1C3C9B' }}>{label}</span>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M6 1V11M1 6H11" stroke="#1C3C9B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

const contacts = [
  { name: 'Annika Ivarson', role: 'Lärare', phone: '070-712 34 56' },
  { name: 'Jessica Barbarossi', role: 'Rektor', phone: '070-712 34 56' },
]

function EnglishPreschool() {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/documents/school')
    }
  }

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', position: 'relative' }}>
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
          zIndex: 3,
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
          }}
          aria-label="Tillbaka"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h2
          style={{
            fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
            fontWeight: 700,
            fontSize: '24px',
            lineHeight: '29px',
            color: '#2A2A2A',
            margin: 0,
          }}
        >
          Engelska förskolan
        </h2>
      </div>

      <div style={{ padding: '104px 16px 120px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3
            style={{
              margin: 0,
              fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
              fontWeight: 600,
              fontSize: '16px',
              color: '#2A2A2A',
            }}
          >
            Kontaktuppgifter
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {contacts.map((contact) => (
              <div
                key={contact.name}
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
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '16px', color: '#2A2A2A' }}>{contact.name}</span>
                  <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px', color: '#2A2A2A', opacity: 0.75 }}>{contact.phone}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px', color: '#2A2A2A' }}>{contact.role}</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M2.5 4.16666C2.5 3.70642 2.68437 3.26409 3.01256 2.93591C3.34075 2.60772 3.78307 2.42334 4.24331 2.42334C5.63333 2.42334 7.41667 4.16666 7.70833 5.41666C7.81667 5.88332 7.73333 6.34999 7.44167 6.66666L6.31667 7.89166C7.175 9.50832 8.49167 10.825 10.1167 11.6833L11.3333 10.5583C11.65 10.2667 12.1167 10.1833 12.5833 10.2917C13.8333 10.575 15.5833 12.3667 15.5833 13.7567C15.5833 14.2169 15.3989 14.6593 15.0707 14.9875C14.7425 15.3157 14.3002 15.5 13.84 15.5C7.85 15.5 2.5 10.15 2.5 4.16666Z"
                      stroke="#1C3C9B"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3
            style={{
              margin: 0,
              fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
              fontWeight: 600,
              fontSize: '16px',
              color: '#2A2A2A',
            }}
          >
            Avtal
          </h3>
          <Link
            to="/documents/school/english-preschool/agreements"
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
              textDecoration: 'none',
              color: '#2A2A2A',
            }}
          >
            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '15px' }}>Inskrivning och regler</span>
            <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
              <path d="M1 1L5 6L1 11" stroke="#1C3C9B" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Link>
        </section>
      </div>
    </div>
  )
}

export { School as default, EnglishPreschool }
